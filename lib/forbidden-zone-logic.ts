// lib/forbidden-zone-logic.ts
// Business Logic & Procedural Engine cho Thái Cổ Cấm Địa • Sa Bàn Sương Mù

import { PlayerStats } from '@/lib/types';
import {
  ForbiddenZoneConfig,
  ForbiddenZoneCell,
  ForbiddenZoneState,
  ZoneCellType,
  ForbiddenZoneLootItem,
} from '@/lib/types/forbidden-zone';
import { calculateCombatStats } from '@/lib/destiny-data';
import { addItemToInventory, getMaxInventoryCapacity } from '@/lib/inventory-data';

// ============================================================
// 1. TÍNH BÁN KÍNH THẦN THỨC & TẦM NHÌN (VISION RADIUS)
// ============================================================
export function calculateVisionRadius(player: PlayerStats): {
  visionRadius: number;
  autoRevealExitAndTreasures: boolean;
  desc: string;
} {
  const thanThuc = player.thanThuc || 50;
  const soulStage = player.soulState?.cultivation?.currentStage || 1;

  // Thần hồn Du Thần / Nguyên Thần (Stage 4+) hoặc Thần Thức >= 1000
  const autoRevealExitAndTreasures = soulStage >= 4 || thanThuc >= 1000;

  let visionRadius = 1; // Mặc định 1 ô xung quanh (3x3)
  if (thanThuc >= 500) {
    visionRadius = 2; // Mở rộng 2 ô (5x5)
  }

  let desc = `Tầm nhìn Thần Thức: ${visionRadius} ô`;
  if (autoRevealExitAndTreasures) {
    desc += ' • Đạo Nhãn Thần Hồn: Tự động khóa vị trí Cổ Trận & Rương Báu!';
  }

  return { visionRadius, autoRevealExitAndTreasures, desc };
}

// ============================================================
// 2. MỞ SƯƠNG MÙ XUNG QUANH TỌA ĐỘ (REVEAL FOG OF WAR)
// ============================================================
export function revealFogOfWar(
  cells: ForbiddenZoneCell[][],
  centerX: number,
  centerY: number,
  radius: number,
  gridSize: number
): ForbiddenZoneCell[][] {
  const newCells = cells.map((row) => row.map((cell) => ({ ...cell })));

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const dist = Math.max(Math.abs(r - centerY), Math.abs(c - centerX));
      if (dist <= radius) {
        newCells[r][c].isRevealed = true;
      }
    }
  }

  return newCells;
}

// ============================================================
// 3. SINH BẢN ĐỒ PROCEDURAL LƯỚI SA BÀN (MAP GENERATOR)
// ============================================================
export function generateForbiddenZoneGrid(
  config: ForbiddenZoneConfig,
  player: PlayerStats
): { cells: ForbiddenZoneCell[][]; visionRadius: number } {
  const { gridSize } = config;
  const { visionRadius, autoRevealExitAndTreasures } = calculateVisionRadius(player);

  // 1. Khởi tạo toàn bộ lưới là empty và chưa lộ diện
  const cells: ForbiddenZoneCell[][] = [];
  for (let y = 0; y < gridSize; y++) {
    const row: ForbiddenZoneCell[] = [];
    for (let x = 0; x < gridSize; x++) {
      row.push({
        x,
        y,
        type: 'empty',
        isRevealed: false,
        isVisited: false,
        isResolved: false,
        name: 'Hư Vô Thạch Thất',
        description: 'Vùng đất hoang tàn phủ đầy sương mù cấm khu.',
      });
    }
    cells.push(row);
  }

  // 2. Điểm xuất phát [0, 0]
  cells[0][0].type = 'empty';
  cells[0][0].name = 'Điểm Khởi Hành';
  cells[0][0].description = 'Vị trí ngươi vừa bước qua kết giới cấm địa.';
  cells[0][0].isVisited = true;
  cells[0][0].isResolved = true;
  cells[0][0].isRevealed = true;

  // 3. Đặt Lối Thoát (exit_portal) ở khu vực xa (x >= gridSize - 2, y >= gridSize - 2)
  const exitX = gridSize - 1;
  const exitY = gridSize - 1;
  cells[exitY][exitX] = {
    x: exitX,
    y: exitY,
    type: 'exit_portal',
    isRevealed: autoRevealExitAndTreasures,
    isVisited: false,
    isResolved: false,
    name: 'Truyền Tống Cổ Trận',
    description: 'Trận nhãn truyền tống cổ xưa, dẫn lối thoát khỏi cấm địa an toàn.',
  };

  // 4. Đặt Boss ở góc xa đối xứng hoặc gần lối thoát
  const bossX = gridSize - 1;
  const bossY = 0;
  cells[bossY][bossX] = {
    x: bossX,
    y: bossY,
    type: 'boss',
    isRevealed: false,
    isVisited: false,
    isResolved: false,
    name: config.bossInfo.name,
    description: `Trấn thủ cấm khu: 【${config.bossInfo.title}】. Khí áp kinh thiên động địa!`,
    data: config.bossInfo,
  };

  // 5. Danh sách các tọa độ trống để rải sự kiện
  const availableCoords: { x: number; y: number }[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if ((x === 0 && y === 0) || (x === exitX && y === exitY) || (x === bossX && y === bossY)) {
        continue;
      }
      availableCoords.push({ x, y });
    }
  }

  // Shuffle tọa độ ngẫu nhiên (Fisher-Yates)
  for (let i = availableCoords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableCoords[i], availableCoords[j]] = [availableCoords[j], availableCoords[i]];
  }

  // Phân bổ số lượng ô theo tỷ lệ
  const totalSlots = availableCoords.length;
  const treasureCount = gridSize === 6 ? 3 : 4;
  const springCount = 2;
  const arrayTrapCount = gridSize === 6 ? 3 : 4;
  const wraithCount = gridSize === 6 ? 3 : 4;
  const eliteCount = 2;
  const monsterCount = Math.floor(totalSlots * 0.35);

  let cIdx = 0;

  // Rải Rương Báu
  for (let i = 0; i < treasureCount && cIdx < availableCoords.length; i++, cIdx++) {
    const { x, y } = availableCoords[cIdx];
    const randDrop = config.specialDrops[Math.floor(Math.random() * config.specialDrops.length)];
    cells[y][x] = {
      x,
      y,
      type: 'treasure',
      isRevealed: autoRevealExitAndTreasures,
      isVisited: false,
      isResolved: false,
      name: 'Cổ Tu Di Trạch',
      description: 'Linh quang phát sáng dịu nhẹ dưới đống đổ nát cổ xưa.',
      data: { drop: randDrop, linhThach: Math.floor(Math.random() * 5000 + 3000) },
    };
  }

  // Rải Linh Tuyền (Hồi phục)
  for (let i = 0; i < springCount && cIdx < availableCoords.length; i++, cIdx++) {
    const { x, y } = availableCoords[cIdx];
    cells[y][x] = {
      x,
      y,
      type: 'spring',
      isRevealed: false,
      isVisited: false,
      isResolved: false,
      name: 'Linh Tuyền Thạch Thất',
      description: 'Dòng suối linh tuyền tinh thuần tuôn trào, xua tan tử khí cấm khu.',
      data: { healAura: 45, healHpPercent: 0.35 },
    };
  }

  // Rải Cấm Chế Cổ Trận (Array Trap)
  for (let i = 0; i < arrayTrapCount && cIdx < availableCoords.length; i++, cIdx++) {
    const { x, y } = availableCoords[cIdx];
    cells[y][x] = {
      x,
      y,
      type: 'array_trap',
      isRevealed: false,
      isVisited: false,
      isResolved: false,
      name: 'Thái Cổ Cấm Chế Trận',
      description: 'Pháp trận sát phạt cổ đại chặn đường. Có thể dùng Trận Bàn phá giải an toàn!',
      data: { damagePercent: 0.2 },
    };
  }

  // Rải Oán Hồn Tụ Linh (Wraith)
  for (let i = 0; i < wraithCount && cIdx < availableCoords.length; i++, cIdx++) {
    const { x, y } = availableCoords[cIdx];
    cells[y][x] = {
      x,
      y,
      type: 'wraith',
      isRevealed: false,
      isVisited: false,
      isResolved: false,
      name: 'Oán Hồn Tụ Linh',
      description: 'Oán khí của tu sĩ ngã xuống kết tụ. Có thể dùng Trấn Ma Phù tịnh hóa nhận thưởng!',
      data: { soulDamage: 30, rewardExp: 15000, rewardStones: 5000 },
    };
  }

  // Rải Thần Thú Tinh Anh (Elite)
  for (let i = 0; i < eliteCount && cIdx < availableCoords.length; i++, cIdx++) {
    const { x, y } = availableCoords[cIdx];
    const m = config.monsterPool[config.monsterPool.length - 1];
    cells[y][x] = {
      x,
      y,
      type: 'elite',
      isRevealed: false,
      isVisited: false,
      isResolved: false,
      name: `Đầu Lĩnh • ${m.name}`,
      description: `Khí áp kinh người, một con dị thú cấm khu đang án ngữ.`,
      data: { ...m, powerRatio: m.powerRatio * 1.25, hpRatio: m.hpRatio * 1.3 },
    };
  }

  // Rải Quái vật cấm khu (Monster)
  for (let i = 0; i < monsterCount && cIdx < availableCoords.length; i++, cIdx++) {
    const { x, y } = availableCoords[cIdx];
    const m = config.monsterPool[Math.floor(Math.random() * config.monsterPool.length)];
    cells[y][x] = {
      x,
      y,
      type: 'monster',
      isRevealed: false,
      isVisited: false,
      isResolved: false,
      name: m.name,
      description: `${m.title} đang rình rập trong sương mù cấm địa.`,
      data: m,
    };
  }

  // Mở sương mù ban đầu quanh [0, 0]
  const revealedCells = revealFogOfWar(cells, 0, 0, visionRadius, gridSize);

  return { cells: revealedCells, visionRadius };
}

// ============================================================
// 4. KIỂM TRA ĐIỀU KIỆN DI CHUYỂN Ô KẾ CẬN (8 HƯỚNG)
// ============================================================
export function canMoveToCell(
  currentPos: { x: number; y: number },
  targetPos: { x: number; y: number }
): boolean {
  const dx = Math.abs(currentPos.x - targetPos.x);
  const dy = Math.abs(currentPos.y - targetPos.y);
  return dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0);
}

// ============================================================
// 5. TIÊU HAO LINH QUANG & HIỆU ỨNG CẤM KHU THEO BƯỚC ĐI
// ============================================================
export interface StepResult {
  newAura: number;
  hpLost: number;
  mindLost: number;
  environmentalLog?: string;
  isCorrosionActive: boolean;
}

export function processStepAuraAndEnvironment(
  state: ForbiddenZoneState,
  player: PlayerStats,
  config: ForbiddenZoneConfig
): StepResult {
  let newAura = Math.max(0, state.auraPower - 2);
  let hpLost = 0;
  let mindLost = 0;
  let environmentalLog = '';
  const isCorrosionActive = newAura <= 0;

  // Nếu Linh Quang Hộ Thể cạn kiệt (= 0): Khí Tức Ăn Mòn trừ 10% Khí Huyết mỗi bước!
  if (isCorrosionActive) {
    const maxHp = player.maxKhiHuyet || 10000;
    hpLost += Math.max(50, Math.floor(maxHp * 0.1));
    environmentalLog = `⚠️ [KHÍ TỨC ĂN MÒN] Hộ Thân Linh Quang đã cạn kiệt! Sương độc cấm khu xâm nhập phế phủ, trừ ${hpLost.toLocaleString()} HP!`;
  }

  // Áp dụng hiệu ứng cấm khu đặc thù
  const nextStep = state.stepCount + 1;
  const canCot = player.canCot || 50;

  if (config.id === 'hoang_co' && canCot < 150 && nextStep % 5 === 0) {
    const extraHp = Math.max(20, Math.floor((player.maxKhiHuyet || 10000) * 0.03));
    hpLost += extraHp;
    environmentalLog += ` 🌫️ [Hoang Khí Xâm Thực] Căn Cốt < 150 không cản nổi hoang khí, hao tổn thêm ${extraHp.toLocaleString()} HP!`;
  } else if (config.id === 'luan_hoi_hai' && nextStep % 3 === 0) {
    mindLost += 1;
    environmentalLog += ` 🌊 [Tử Khí Hủ Hồn] Tử khí Luân Hồi Hải ăn mòn tâm trí, Tâm Cảnh giảm 1 điểm!`;
  } else if (config.id === 'hon_don_gioi' && nextStep % 10 === 0) {
    const voidDamage = Math.max(100, Math.floor((player.maxKhiHuyet || 10000) * 0.05));
    hpLost += voidDamage;
    environmentalLog += ` 🌌 [Hư Không Yên Diệt] Vết nứt không gian bất ngờ bùng nổ, gánh chịu ${voidDamage.toLocaleString()} sát thương hư không!`;
  }

  return { newAura, hpLost, mindLost, environmentalLog: environmentalLog.trim() || undefined, isCorrosionActive };
}

// ============================================================
// 6. GIẢI QUYẾT TƯƠNG TÁC Ô CẤM KHU (RESOLVE CELL ACTION)
// ============================================================
export interface ResolveCellOutput {
  log: string;
  updatedCell: ForbiddenZoneCell;
  hpDelta?: number;
  mpDelta?: number;
  auraDelta?: number;
  lootItems?: ForbiddenZoneLootItem[];
  lootStones?: number;
  updatedPlayer?: Partial<PlayerStats>;
}

export function resolveCellInteraction(
  cell: ForbiddenZoneCell,
  player: PlayerStats,
  config: ForbiddenZoneConfig,
  actionChoice?: 'use_formation' | 'brute_force' | 'use_talisman' | 'soul_suppress'
): ResolveCellOutput {
  const cStats = calculateCombatStats(player);
  const updatedCell: ForbiddenZoneCell = { ...cell, isResolved: true };

  switch (cell.type) {
    // ── 1. RƯƠNG BÁU CỔ TU ─────────────────────────────────────
    case 'treasure': {
      const drop = cell.data?.drop;
      const stones = cell.data?.linhThach || 3000;
      const lootItems: ForbiddenZoneLootItem[] = [];

      if (drop) {
        lootItems.push({
          id: drop.id,
          name: drop.name,
          quantity: 1,
          grade: drop.grade,
          type: drop.type,
          description: drop.desc,
        });
      }

      return {
        log: `🎁 Khai mở 【${cell.name}】! Thu hoạch ${stones.toLocaleString()} Hạ Phẩm Linh Thạch${drop ? ` và trân bảo 【${drop.name} (${drop.grade})】` : ''}!`,
        updatedCell,
        lootStones: stones,
        lootItems,
      };
    }

    // ── 2. LINH TUYỀN HỒI PHỤC ─────────────────────────────────
    case 'spring': {
      const healAura = cell.data?.healAura || 45;
      const healHp = Math.floor((player.maxKhiHuyet || 10000) * (cell.data?.healHpPercent || 0.35));

      return {
        log: `⛲ Ngâm mình trong 【${cell.name}】! Linh khí tẩy uế toàn thân, hồi phục +${healAura} Linh Quang Hộ Thể và +${healHp.toLocaleString()} HP!`,
        updatedCell,
        auraDelta: healAura,
        hpDelta: healHp,
      };
    }

    // ── 3. THÁI CỔ CẤM CHẾ TRẬN ────────────────────────────────
    case 'array_trap': {
      // Lựa chọn A: Dùng Trận Bàn Bản Mệnh phá giải 100% an toàn
      if (actionChoice === 'use_formation' && player.equippedFormation) {
        const formationName = player.equippedFormation.name;
        const rewardStones = 4000;
        return {
          log: `🌀 Vận chuyển Trận Bàn 【${formationName}】 giải trừ toàn bộ trận nhãn của 【${cell.name}】! An toàn vượt cấm chế, thu hồi ${rewardStones.toLocaleString()} Linh Thạch trận nhãn!`,
          updatedCell,
          lootStones: rewardStones,
        };
      }

      // Lựa chọn B: Vũ lực phá trận (mất 20% HP)
      const dmg = Math.floor((player.maxKhiHuyet || 10000) * 0.2);
      return {
        log: `💥 Dùng vũ lực ngạnh kháng oanh kích 【${cell.name}】! Cấm chế nổ tung, đạo thể gánh chịu ${dmg.toLocaleString()} phản phệ sát thương!`,
        updatedCell,
        hpDelta: -dmg,
      };
    }

    // ── 4. OÁN HỒN TỤ LINH ─────────────────────────────────────
    case 'wraith': {
      const talismans = player.inventory?.talismans || [];
      const hasTranMaPhu = talismans.some((t: any) =>
        t.recipeId === 'recipe_tran_ma_phu' || t.id?.includes('tran_ma') || t.type === 'combat'
      );

      // Lựa chọn A: Dùng Trấn Ma Phù tịnh hóa
      if (actionChoice === 'use_talisman' && hasTranMaPhu) {
        let updatedTalismans = [...talismans];
        const tIdx = updatedTalismans.findIndex((t: any) =>
          t.recipeId === 'recipe_tran_ma_phu' || t.id?.includes('tran_ma') || t.type === 'combat'
        );
        let usedName = 'Trấn Ma Phù';
        if (tIdx >= 0) {
          usedName = updatedTalismans[tIdx].name;
          updatedTalismans[tIdx].quantity -= 1;
          updatedTalismans = updatedTalismans.filter(t => t.quantity > 0);
        }

        const stones = 8000;
        return {
          log: `📜 Phóng xuất 【${usedName}】 trấn áp oán khí! Tịnh hóa hoàn toàn 【${cell.name}】, thu được ${stones.toLocaleString()} Linh Thạch và thanh lọc thức hải!`,
          updatedCell,
          lootStones: stones,
          updatedPlayer: {
            inventory: {
              ...player.inventory,
              pills: player.inventory?.pills || [],
              herbs: player.inventory?.herbs || [],
              talismans: updatedTalismans,
            } as any,
          },
        };
      }

      // Lựa chọn B: Thần Niệm Trấn Áp
      const thanThuc = player.thanThuc || 50;
      const isStrongMind = thanThuc >= 300;
      const dmg = isStrongMind ? 50 : Math.floor((player.maxKhiHuyet || 10000) * 0.12);

      return {
        log: `👁️ Tỏa xuất uy áp Thần Thức trấn áp 【${cell.name}】! ${isStrongMind ? 'Thần niệm hùng hậu nghiền nát oán hồn nhẹ nhàng!' : `Thức hải chấn động, chịu ${dmg.toLocaleString()} sát thương phản phệ!`}`,
        updatedCell,
        hpDelta: -dmg,
        lootStones: 2500,
      };
    }

    // ── 5. QUÁI VẬT, TINH ANH, BOSS CHIẾN ĐẤU ──────────────────
    case 'monster':
    case 'elite':
    case 'boss': {
      const monsterData = cell.data || {};
      const isBoss = cell.type === 'boss';
      const isElite = cell.type === 'elite';

      // Tính sát thương nhận vào từ quái
      const myAtk = cStats.atk || 500;
      const myDef = cStats.def || 200;
      const mAtk = Math.floor(myAtk * (monsterData.powerRatio || 1.0));
      const damageTaken = Math.max(30, Math.floor(mAtk - (myDef * 0.7)));

      const dropStones = monsterData.dropStones || (isBoss ? 50000 : isElite ? 12000 : 4000);
      const lootItems: ForbiddenZoneLootItem[] = [];

      // Tỷ lệ rơi vật phẩm đặc thù
      const dropChance = isBoss ? 1.0 : isElite ? 0.6 : 0.25;
      if (Math.random() < dropChance && config.specialDrops.length > 0) {
        const randDrop = config.specialDrops[Math.floor(Math.random() * config.specialDrops.length)];
        lootItems.push({
          id: randDrop.id,
          name: randDrop.name,
          quantity: 1,
          grade: randDrop.grade,
          type: randDrop.type,
          description: randDrop.desc,
        });
      }

      const log = isBoss
        ? `👑 [ĐẠI CHIẾN THẦN MA] Trảm sát 【${cell.name}】! Sau trận huyết chiến sinh tử, gánh chịu ${damageTaken.toLocaleString()} sát thương, đoạt được ${dropStones.toLocaleString()} Linh Thạch${lootItems.length > 0 ? ` và 【${lootItems[0].name}】` : ''}!`
        : `⚔️ Trảm sát 【${cell.name}】! Hao tổn ${damageTaken.toLocaleString()} HP, thu được ${dropStones.toLocaleString()} Linh Thạch!`;

      return {
        log,
        updatedCell,
        hpDelta: -damageTaken,
        lootStones: dropStones,
        lootItems,
      };
    }

    default:
      return {
        log: `Đã khám phá khu vực 【${cell.name}】.`,
        updatedCell,
      };
  }
}

// ============================================================
// 7. KẾT TOÁN RÚT LUI AN TOÀN (FINALIZE ESCAPE)
// ============================================================
export function finalizeEscape(
  player: PlayerStats,
  state: ForbiddenZoneState,
  config: ForbiddenZoneConfig
): {
  updatedPlayer: PlayerStats;
  logTitle: string;
  logContent: string;
  toastMsg: string;
} {
  const currentStones = player.linhThach || 0;
  const gainedStones = state.lootBag.linhThach;
  let updatedPlayer: PlayerStats = {
    ...player,
    linhThach: currentStones + gainedStones,
  };

  const maxSlots = getMaxInventoryCapacity(player);
  let currentInventory = player.inventory || { pills: [], herbs: [], ores: [], equipments: [], books: [], manuals: [], bags: [] };

  // Cất toàn bộ items trong lootBag vào inventory
  for (const item of state.lootBag.items) {
    const itemType = item.type === 'pill' ? 'pill' : item.type === 'weapon' ? 'equipment' : 'herb';
    const res = addItemToInventory(
      currentInventory,
      maxSlots,
      itemType,
      {
        id: item.id,
        name: item.name,
        grade: item.grade || 'Thượng Phẩm',
        description: item.description,
      },
      item.quantity || 1
    );
    if (res.success) {
      currentInventory = res.inventory;
    }
  }
  updatedPlayer.inventory = currentInventory;

  const logTitle = `🌀 THOÁT KHỎI 【${config.name.toUpperCase()}】 AN TOÀN!`;
  const itemsText = state.lootBag.items.map((i) => `${i.quantity}x ${i.name}`).join(', ');
  const logContent = `Ngươi đã kích hoạt Truyền Tống Trận Nhãn, thuận lợi rời khỏi ${config.name}! Bảo toàn 100% chiến lợi phẩm: +${gainedStones.toLocaleString()} Hạ Phẩm Linh Thạch${itemsText ? `, thu hoạch: ${itemsText}` : ''}.`;
  const toastMsg = `🌀 Thoát khỏi cấm khu an toàn! Nhận trọn vẹn ${gainedStones.toLocaleString()} Linh Thạch!`;

  return { updatedPlayer, logTitle, logContent, toastMsg };
}

// ============================================================
// 8. KẾT TOÁN THẤT BẠI KHI TỬ TRẬN (FINALIZE DEFEAT)
// ============================================================
export function finalizeDefeat(
  player: PlayerStats,
  state: ForbiddenZoneState,
  config: ForbiddenZoneConfig
): {
  updatedPlayer: PlayerStats;
  logTitle: string;
  logContent: string;
  toastMsg: string;
} {
  const maxHp = player.maxKhiHuyet || 10000;
  // Đánh rơi 60% Linh Thạch và vật phẩm
  const savedStones = Math.floor(state.lootBag.linhThach * 0.4);
  const lostStones = state.lootBag.linhThach - savedStones;

  // Giữ lại 40% items
  const savedItems = state.lootBag.items.slice(0, Math.ceil(state.lootBag.items.length * 0.4));

  let updatedPlayer: PlayerStats = {
    ...player,
    khiHuyet: Math.floor(maxHp * 0.1), // HP về 10%
    linhThach: (player.linhThach || 0) + savedStones,
  };

  const maxSlots = getMaxInventoryCapacity(player);
  let currentInventory = player.inventory || { pills: [], herbs: [], ores: [], equipments: [], books: [], manuals: [], bags: [] };

  for (const item of savedItems) {
    const itemType = item.type === 'pill' ? 'pill' : item.type === 'weapon' ? 'equipment' : 'herb';
    const res = addItemToInventory(
      currentInventory,
      maxSlots,
      itemType,
      {
        id: item.id,
        name: item.name,
        grade: item.grade || 'Thượng Phẩm',
        description: item.description,
      },
      item.quantity || 1
    );
    if (res.success) {
      currentInventory = res.inventory;
    }
  }
  updatedPlayer.inventory = currentInventory;

  const logTitle = `💥 TỬ TRẬN TẠI 【${config.name.toUpperCase()}】!`;
  const logContent = `Khí tức cấm khu cắn trả, ngươi bị đánh trọng thương bất tỉnh (Khí Huyết rơi về 10%)! Đánh rơi ${lostStones.toLocaleString()} Linh Thạch và 60% bảo vật trong túi thám hiểm cấm khu trước khi linh phù hộ mệnh tự động dịch chuyển ngươi về an toàn.`;
  const toastMsg = `❌ Thất bại trong cấm khu! Tổn thất 60% chiến lợi phẩm.`;

  return { updatedPlayer, logTitle, logContent, toastMsg };
}
