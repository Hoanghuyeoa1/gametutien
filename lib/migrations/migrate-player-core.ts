// lib/migrations/migrate-player-core.ts
// Module Chuẩn Hóa & Di Trú Dữ Liệu Nhân Vật Cốt Lõi (Core Player State Migration)
// Trích xuất từ lib/save-migration.ts — Giữ nguyên 100% logic, key names & fallback mặc định

import {
  PlayerStats,
  PlayerState,
  Physique,
  EquippedManualSlots,
  DestinySlotState,
  SoulCultivationState,
  FormationItem,
  Equipment,
  InventoryBag
} from '@/lib/types';
import {
  createNewPlayer,
  getMaxKhiHuyet,
  getMaxLinhLuc
} from '@/lib/game-logic';
import {
  DEFAULT_DESTINY,
  DESTINY_FATES,
  calculateCombatStats,
  getDestinySlotMaxCount,
  createDefaultDestinyBoard,
  getActiveDestinySynergies
} from '@/lib/destiny-data';
import {
  createDefaultBodyRefinement,
  createDefaultSoulCultivation
} from '@/lib/body-soul-data';
import { getBaseLifespanForRealm } from '@/lib/lifespan-logic';
import { getTierFromGrade } from '@/lib/elemental-system';
import { convertGradeToGiai } from '@/lib/item-quality-data';
import { ensureEquipmentStructure } from '@/lib/forging-logic';
import { STARTER_GEMS } from '@/lib/forging-gem-data';
import { GAME_CONSTANTS } from '@/lib/game-constants';
import realmsData from '@/data/realms-data.json';

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Gộp dồn các vật phẩm trùng id trong túi đồ (bảo toàn nguyên vẹn từ save-migration.ts)
 */
export const mergeDuplicateInventoryItems = <T extends { id: string; quantity: number }>(arr: T[] = []): T[] => {
  const map = new Map<string, T>();
  for (const item of arr) {
    if (!item || !item.id || item.quantity <= 0) continue;
    if (map.has(item.id)) {
      const existing = map.get(item.id)!;
      existing.quantity += item.quantity;
    } else {
      map.set(item.id, { ...item });
    }
  }
  return Array.from(map.values());
};

/**
 * Chuẩn hóa cấu trúc vật phẩm Trận Pháp trong túi đồ
 */
export const normalizeFormationItem = (f: any): FormationItem => ({
  ...f,
  isPermanent: Boolean(f?.isPermanent),
  reforgeTier: typeof f?.reforgeTier === 'number' ? f.reforgeTier : 0,
  offlineAbsorptionBonus: typeof f?.offlineAbsorptionBonus === 'number' ? f.offlineAbsorptionBonus : 0,
  reforgedAt: typeof f?.reforgedAt === 'number' ? f.reforgedAt : undefined,
});

// ============================================================================
// 1. HÀM KHỞI TẠO TRẠNG THÁI MẶC ĐỊNH
// ============================================================================

/**
 * Khởi tạo đầy đủ schema PlayerState chuẩn với các giá trị ban đầu
 */
export function createDefaultPlayerState(): PlayerState {
  const base = createNewPlayer();
  return {
    ...base,
    maTinh: base.maTinh ?? 0,
    spiritStones: base.linhThach,
    tienPhamLinhThach: base.tienTinh ?? 0,
    trungPhamLinhThach: base.trungPhamLinhThach ?? 0,
    thuongPhamLinhThach: base.thuongPhamLinhThach ?? 0,
    cucPhamLinhThach: base.cucPhamLinhThach ?? 0,
  };
}

// ============================================================================
// 2. CÁC HÀM DI TRÚ NHÂN VẬT CỐT LÕI
// ============================================================================

/**
 * Chuẩn hóa HP, MP, ATK, DEF, tốc độ, thọ nguyên và các chỉ số nền tảng
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function migrateBaseStats(player: any): any {
  if (!player) return {};
  const base = createDefaultPlayerState();

  const canCot = typeof player.canCot === 'number' && !isNaN(player.canCot) ? player.canCot : base.canCot;
  const tamCanh = typeof player.tamCanh === 'number' && !isNaN(player.tamCanh) ? player.tamCanh : base.tamCanh;
  const ngoTinh = typeof player.ngoTinh === 'number' && !isNaN(player.ngoTinh) ? player.ngoTinh : base.ngoTinh;
  const khiVan = typeof player.khiVan === 'number' && !isNaN(player.khiVan) ? player.khiVan : base.khiVan;

  // 1. Ép kiểu và kiểm tra biên chặt chẽ cho currentRealm (ngăn chặn triệt để string/NaN/undefined/âm)
  const safeRealm = Number.isInteger(Number(player.currentRealm))
    ? Math.max(0, Math.min(realmsData.length - 1, Number(player.currentRealm)))
    : 0;
  const currentRealm = safeRealm;

  const rawEquipment = player.equipment || player.equippedEquipment || player.equippedItems || {};
  const normalizedEquipment: Record<string, Equipment | undefined> = {
    weapon: rawEquipment.weapon ? ensureEquipmentStructure({ ...rawEquipment.weapon, quality: rawEquipment.weapon.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.weapon.grade) }) : undefined,
    armor: rawEquipment.armor ? ensureEquipmentStructure({ ...rawEquipment.armor, quality: rawEquipment.armor.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.armor.grade) }) : undefined,
    boots: rawEquipment.boots ? ensureEquipmentStructure({ ...rawEquipment.boots, quality: rawEquipment.boots.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.boots.grade) }) : undefined,
    accessory: rawEquipment.accessory ? ensureEquipmentStructure({ ...rawEquipment.accessory, quality: rawEquipment.accessory.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.accessory.grade) }) : undefined,
    artifact: rawEquipment.artifact ? ensureEquipmentStructure({ ...rawEquipment.artifact, quality: rawEquipment.artifact.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.artifact.grade) }) : undefined
  };

  const manuals = Array.isArray(player.manuals) ? player.manuals : [];

  // Chuẩn hóa Đa Thể Chất (physiques) & Thể chất đơn (physique)
  let physiques: Physique[] = [];
  if (player.physiques && Array.isArray(player.physiques) && player.physiques.length > 0) {
    physiques = player.physiques;
  } else if (player.physique) {
    physiques = [player.physique];
  } else {
    physiques = base.physiques || (base.physique ? [base.physique] : []);
  }
  const physique = physiques[0] || base.physique;
  const equippedManuals: EquippedManualSlots = player.equippedManuals || {};

  // Tự động gán slot công pháp nếu chưa có
  if (!equippedManuals.tamPhap) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tp = manuals.find((m: any) => m && m.type === 'tam_phap' && m.level > 0);
    if (tp) equippedManuals.tamPhap = tp.id;
  }
  if (!equippedManuals.theThuat) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tt = manuals.find((m: any) => m && m.type === 'the_thuat' && m.level > 0);
    if (tt) equippedManuals.theThuat = tt.id;
  }
  if (!equippedManuals.thanThong1) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const thanThongs = manuals.filter((m: any) => m && m.type === 'than_thong' && m.level > 0);
    if (thanThongs[0]) equippedManuals.thanThong1 = thanThongs[0].id;
    if (thanThongs[1]) equippedManuals.thanThong2 = thanThongs[1].id;
  }

  // Chuẩn hóa Linh Căn
  let linhCan = player.linhCan || base.linhCan;
  if (linhCan && !linhCan.tier) {
    linhCan = {
      ...linhCan,
      tier: getTierFromGrade(linhCan.grade),
      purity: linhCan.purity ?? 40
    };
  }

  const destiny = player.destiny || base.destiny || DEFAULT_DESTINY;
  const maxDestinySlots = getDestinySlotMaxCount(currentRealm);
  const rawDestinyBoard = player.destinyBoard || createDefaultDestinyBoard(destiny.id);
  const destinyBoard: DestinySlotState = {
    unlockedSlots: Math.max(maxDestinySlots, rawDestinyBoard.unlockedSlots || 3),
    equippedIds: Array.isArray(rawDestinyBoard.equippedIds) && rawDestinyBoard.equippedIds.length > 0
      ? rawDestinyBoard.equippedIds.slice(0, maxDestinySlots)
      : [destiny.id],
    collectedIds: Array.isArray(rawDestinyBoard.collectedIds) && rawDestinyBoard.collectedIds.length > 0
      ? Array.from(new Set([...rawDestinyBoard.collectedIds, destiny.id]))
      : [destiny.id]
  };
  const activeSynergies = getActiveDestinySynergies(destinyBoard.equippedIds).map(s => s.id);
  const destinies = destinyBoard.equippedIds.map(id => DESTINY_FATES[id]).filter(Boolean);
  const bodyRefinement = player.bodyRefinement || createDefaultBodyRefinement();
  const rawSoul = player.soulCultivation || createDefaultSoulCultivation();
  const soulCultivation: SoulCultivationState = {
    ...rawSoul,
    currentStageIndex: typeof rawSoul.currentStageIndex === 'number'
      ? rawSoul.currentStageIndex
      : (typeof rawSoul.realmIndex === 'number' ? Math.min(rawSoul.realmIndex, 3) : 0),
    currentSubTier: typeof rawSoul.currentSubTier === 'number'
      ? rawSoul.currentSubTier
      : (typeof rawSoul.level === 'number' ? Math.min(Math.max(1, rawSoul.level), 9) : 1),
    currentExp: typeof rawSoul.currentExp === 'number' ? rawSoul.currentExp : 0,
    maxExp: typeof rawSoul.maxExp === 'number' ? rawSoul.maxExp : 100,
    realmIndex: typeof rawSoul.realmIndex === 'number' ? rawSoul.realmIndex : 0,
    level: typeof rawSoul.level === 'number' ? rawSoul.level : 1,
    expeditionState: rawSoul.expeditionState || null
  };

  const maxHP = getMaxKhiHuyet(
    canCot,
    currentRealm,
    normalizedEquipment,
    manuals,
    physiques,
    equippedManuals,
    linhCan,
    destiny,
    bodyRefinement,
    player.companionsState,
    player.physiqueState,
    player.tuViEmpowermentState,
    player.manualsState,
    player.beastsState
  );
  const maxMP = getMaxLinhLuc(tamCanh, ngoTinh, currentRealm, normalizedEquipment, manuals, equippedManuals, linhCan);

  // Tính toán lại bộ chỉ số chiến đấu
  const cStats = calculateCombatStats({
    ...base,
    ...player,
    canCot,
    tamCanh,
    ngoTinh,
    currentRealm,
    equipment: normalizedEquipment,
    equippedEquipment: normalizedEquipment,
    manuals,
    physique,
    physiques,
    linhCan,
    destiny,
    destinies,
    destinyBoard,
    equippedManuals,
    bodyRefinement,
    soulCultivation
  });

  // Chuẩn hóa Thọ Nguyên & Tuế Nguyệt
  const safeAge = typeof player.age === 'number' && player.age > 0 ? Number(player.age.toFixed(2)) : 16;
  const rawPillBonus = typeof player.lifespanPillsUsed === 'number' ? player.lifespanPillsUsed : 0;
  const baseLifespan = getBaseLifespanForRealm(currentRealm);
  const safeMaxLifespan = Math.max(baseLifespan + rawPillBonus, typeof player.maxLifespan === 'number' ? player.maxLifespan : baseLifespan);
  const isToaHoaWarning = (safeMaxLifespan - safeAge) < 5;

  return {
    canCot,
    tamCanh,
    ngoTinh,
    khiVan,
    currentRealm,
    maxKhiHuyet: maxHP,
    khiHuyet: typeof player.khiHuyet === 'number' ? Math.min(player.khiHuyet, maxHP) : maxHP,
    maxLinhLuc: maxMP,
    linhLuc: typeof player.linhLuc === 'number' ? Math.min(player.linhLuc, maxMP) : maxMP,
    maxMp: maxMP,
    mp: typeof player.linhLuc === 'number' ? Math.min(player.linhLuc, maxMP) : maxMP,
    congKich: cStats.atk,
    phongNgu: cStats.def,
    thanThuc: typeof player.thanThuc === 'number' ? Math.max(player.thanThuc, cStats.soul) : (cStats.soul || 10),
    tocDo: cStats.speed,
    baoKichRate: cStats.critRate,
    baoKichDmg: cStats.critDmg,
    age: safeAge,
    maxLifespan: safeMaxLifespan,
    lifespanPillsUsed: rawPillBonus,
    isToaHoaWarning,
    linhCan,
    physique,
    physiques,
    destiny,
    destinies,
    destinyBoard,
    activeSynergies,
    equippedManuals,
    bodyRefinement,
    soulCultivation,
  };
}

/**
 * Chuẩn hóa mảng inventory và object equipment, đảm bảo các slot trang bị không bị undefined
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function migrateInventoryAndEquipment(player: any): any {
  if (!player) return {};

  const rawEquipment = player.equipment || player.equippedEquipment || player.equippedItems || {};
  const normalizedEquipment: Record<string, Equipment | undefined> = {
    weapon: rawEquipment.weapon ? ensureEquipmentStructure({ ...rawEquipment.weapon, quality: rawEquipment.weapon.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.weapon.grade) }) : undefined,
    armor: rawEquipment.armor ? ensureEquipmentStructure({ ...rawEquipment.armor, quality: rawEquipment.armor.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.armor.grade) }) : undefined,
    boots: rawEquipment.boots ? ensureEquipmentStructure({ ...rawEquipment.boots, quality: rawEquipment.boots.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.boots.grade) }) : undefined,
    accessory: rawEquipment.accessory ? ensureEquipmentStructure({ ...rawEquipment.accessory, quality: rawEquipment.accessory.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.accessory.grade) }) : undefined,
    artifact: rawEquipment.artifact ? ensureEquipmentStructure({ ...rawEquipment.artifact, quality: rawEquipment.artifact.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.artifact.grade) }) : undefined
  };

  // Đảm bảo đối tượng equippedItems có đầy đủ các slot trang bị không bị undefined (fallback null)
  const equippedItems: Record<string, Equipment | null> = {
    weapon: normalizedEquipment.weapon ?? null,
    armor: normalizedEquipment.armor ?? null,
    boots: normalizedEquipment.boots ?? null,
    accessory: normalizedEquipment.accessory ?? null,
    artifact: normalizedEquipment.artifact ?? null,
  };

  const rawInv = player.inventory || {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invPills = mergeDuplicateInventoryItems(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rawInv.pills || [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((p: any) => p && typeof p.quantity === 'number' && p.quantity > 0)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((p: any) => ({ ...p }))
  );

  const inventoryFormations = Array.isArray(rawInv.formations)
    ? rawInv.formations.map(normalizeFormationItem)
    : [];

  const inventoryTalismans = Array.isArray(rawInv.talismans)
    ? rawInv.talismans
    : [];

  const inventory: InventoryBag = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pills: invPills.map((p: any) => ({
      ...p,
      quality: p.quality || 'thuong_pham',
      grade: convertGradeToGiai(p.grade),
      veinMetadata: p.veinMetadata && typeof p.veinMetadata === 'object' ? {
        veinCount: typeof p.veinMetadata.veinCount === 'number' ? Math.max(0, Math.min(9, p.veinMetadata.veinCount)) : 0,
        veinMultiplier: typeof p.veinMetadata.veinMultiplier === 'number' ? p.veinMetadata.veinMultiplier : 1.0,
        toxicityMultiplier: typeof p.veinMetadata.toxicityMultiplier === 'number' ? p.veinMetadata.toxicityMultiplier : 0.50,
        mutation: p.veinMetadata.mutation || null
      } : {
        veinCount: 0,
        veinMultiplier: 1.0,
        toxicityMultiplier: 0.50,
        mutation: null
      },
      isMutated: Boolean(p.isMutated || p.veinMetadata?.mutation)
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    herbs: mergeDuplicateInventoryItems((rawInv.herbs || []).filter((h: any) => h && h.quantity > 0)).map((h: any) => ({
      ...h,
      quality: h.quality || 'thuong_pham',
      grade: convertGradeToGiai(h.grade)
    })),
    ores: (() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawOres = mergeDuplicateInventoryItems((rawInv.ores || []).filter((o: any) => o && o.quantity > 0)).map((o: any) => ({
        ...o,
        quality: o.quality || 'thuong_pham',
        grade: convertGradeToGiai(o.grade)
      }));
      // Đảm bảo có nguyên liệu vẽ bùa cơ bản để trải nghiệm Phù Đạo
      const starterMats = [
        { id: 'paper_hoang_bi', name: 'Hoàng Bì Chỉ', grade: 'Nhất Giai', quantity: 20, price: 30, description: 'Giấy bùa làm từ vỏ linh trúc sơ thiên.' },
        { id: 'ink_chu_sa_khoang', name: 'Chu Sa Khoáng', grade: 'Nhất Giai', quantity: 20, price: 40, description: 'Khoáng thạch chu sa xích hồng dùng điểm linh mực.' },
        { id: 'paper_ngoc_thiem_bi', name: 'Ngọc Thiềm Bì', grade: 'Tam Giai', quantity: 10, price: 100, description: 'Da cóc ngọc hoặc yêu thú lột xác, chất liệu bền dai.' },
        { id: 'ink_yeu_thu_tinh_huyet', name: 'Yêu Thú Tinh Huyết', grade: 'Tam Giai', quantity: 10, price: 120, description: 'Huyết dịch ngưng tụ sát khí yêu thú.' },
      ];
      starterMats.forEach(sm => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!rawOres.some((o: any) => o.id === sm.id)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rawOres.push(sm as any);
        }
      });
      return rawOres;
    })(),
    manuals: Array.isArray(rawInv.manuals) ? [...rawInv.manuals] : [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    equipments: Array.isArray(rawInv.equipments || rawInv.equipment)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? [...(rawInv.equipments || rawInv.equipment)].map((e: any) => ensureEquipmentStructure({
          ...e,
          quality: e.quality || 'thuong_pham',
          grade: convertGradeToGiai(e.grade)
        }))
      : [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    equipment: Array.isArray(rawInv.equipments || rawInv.equipment)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? [...(rawInv.equipments || rawInv.equipment)].map((e: any) => ensureEquipmentStructure({
          ...e,
          quality: e.quality || 'thuong_pham',
          grade: convertGradeToGiai(e.grade)
        }))
      : [],
    gems: (rawInv.gems && Array.isArray(rawInv.gems) && rawInv.gems.length > 0)
      ? rawInv.gems
      : [...STARTER_GEMS],
    books: Array.isArray(rawInv.books) ? [...rawInv.books] : [],
    bags: Array.isArray(rawInv.bags) ? [...rawInv.bags] : [],
    formations: inventoryFormations,
    talismans: inventoryTalismans,
    forgingEssence: typeof rawInv.forgingEssence === 'number' ? Math.max(0, rawInv.forgingEssence) : 0,
    maxSlots: typeof rawInv.maxSlots === 'number' ? rawInv.maxSlots : (player?.storageBag?.maxSlots || 50),
  };

  return {
    inventory,
    equipment: normalizedEquipment,
    equippedEquipment: normalizedEquipment,
    equippedItems,
  };
}

/**
 * Chuẩn hóa Linh Thạch, Ma Tinh, Tu Vi, tuổi hiện tại và thọ nguyên tối đa
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function migrateCurrenciesAndLifespan(player: any): any {
  if (!player) return {};

  const currentRealm = Number.isInteger(Number(player.currentRealm))
    ? Math.max(0, Math.min(realmsData.length - 1, Number(player.currentRealm)))
    : 0;

  const linhThach = typeof player.linhThach === 'number' && !isNaN(player.linhThach)
    ? Math.max(0, player.linhThach)
    : (GAME_CONSTANTS.STARTING_LINH_THACH || 100);

  const trungPhamLinhThach = typeof player.trungPhamLinhThach === 'number' && !isNaN(player.trungPhamLinhThach)
    ? Math.max(0, player.trungPhamLinhThach)
    : 0;

  const thuongPhamLinhThach = typeof player.thuongPhamLinhThach === 'number' && !isNaN(player.thuongPhamLinhThach)
    ? Math.max(0, player.thuongPhamLinhThach)
    : 0;

  const cucPhamLinhThach = typeof player.cucPhamLinhThach === 'number' && !isNaN(player.cucPhamLinhThach)
    ? Math.max(0, player.cucPhamLinhThach)
    : 0;

  const rawTienTinh = typeof player.tienTinh === 'number' ? player.tienTinh : player.tienPhamLinhThach;
  const tienTinh = typeof rawTienTinh === 'number' && !isNaN(rawTienTinh) ? Math.max(0, rawTienTinh) : 0;

  const maTinh = typeof player.maTinh === 'number' && !isNaN(player.maTinh) ? Math.max(0, player.maTinh) : 0;

  const tuVi = typeof player.tuVi === 'number' && !isNaN(player.tuVi) ? Math.max(0, player.tuVi) : 0;
  const danhVong = typeof player.danhVong === 'number' && !isNaN(player.danhVong) ? player.danhVong : 0;
  const tinhHuyetYeuThu = typeof player.tinhHuyetYeuThu === 'number' && !isNaN(player.tinhHuyetYeuThu) ? player.tinhHuyetYeuThu : 0;

  // Tuổi & Thọ nguyên
  const safeAge = typeof player.age === 'number' && player.age > 0 ? Number(player.age.toFixed(2)) : 16;
  const rawPillBonus = typeof player.lifespanPillsUsed === 'number' && !isNaN(player.lifespanPillsUsed) ? player.lifespanPillsUsed : 0;
  const baseLifespan = getBaseLifespanForRealm(currentRealm);
  const safeMaxLifespan = Math.max(
    baseLifespan + rawPillBonus,
    typeof player.maxLifespan === 'number' && !isNaN(player.maxLifespan) ? player.maxLifespan : baseLifespan
  );
  const isToaHoaWarning = (safeMaxLifespan - safeAge) < 5;

  return {
    linhThach,
    spiritStones: linhThach,
    trungPhamLinhThach,
    thuongPhamLinhThach,
    cucPhamLinhThach,
    tienTinh,
    tienPhamLinhThach: tienTinh,
    maTinh,
    tuVi,
    danhVong,
    tinhHuyetYeuThu,
    age: safeAge,
    maxLifespan: safeMaxLifespan,
    lifespanPillsUsed: rawPillBonus,
    isToaHoaWarning,
  };
}

// ============================================================================
// 3. HÀM ĐIỀU PHỐI CẤP MODULE
// ============================================================================

/**
 * Thực thi tuần tự các hàm di trú cốt lõi và trả về đối tượng PlayerState đã có khung sườn cốt lõi
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeCorePlayerState(rawPlayer: any): PlayerState {
  const base = createDefaultPlayerState();
  const raw = rawPlayer || {};

  // 1. Chuẩn hóa Currencies & Lifespan
  const currenciesAndLifespan = migrateCurrenciesAndLifespan(raw);

  // 2. Chuẩn hóa Inventory & Equipment
  const inventoryAndEquipment = migrateInventoryAndEquipment(raw);

  // 3. Chuẩn hóa Base Stats & Combat Stats
  const baseStats = migrateBaseStats({
    ...base,
    ...raw,
    ...currenciesAndLifespan,
    ...inventoryAndEquipment,
  });

  // Hợp nhất thành đối tượng PlayerState hoàn chỉnh với khung sườn cốt lõi
  const corePlayer: PlayerState = {
    ...base,
    ...raw,
    name: typeof raw.name === 'string' && raw.name.trim().length > 0 ? raw.name : (base.name || 'Vô Danh Tu Sĩ'),
    ...currenciesAndLifespan,
    ...inventoryAndEquipment,
    ...baseStats,
  };

  return corePlayer;
}
