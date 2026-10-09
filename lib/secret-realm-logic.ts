// lib/secret-realm-logic.ts
// Pure functions & Engine tính toán cho Hệ Thống Bí Cảnh Đa Tầng Roguelite

import {
  PlayerStats,
  DungeonRunState,
  DungeonRoomChoice,
  DungeonRoomType,
  DungeonBuff,
  GemItem,
  Equipment
} from '@/lib/types';
import {
  getDungeonById,
  ALTAR_BUFFS,
  TRAP_TEMPLATES,
  CHEST_TIERS,
  MONSTER_NAMES
} from '@/lib/secret-realm-data';
import { createGem } from '@/lib/forging-gem-data';
import { DEFAULT_HERBS, DEFAULT_ORES, EQUIP_RECIPES } from '@/lib/alchemy-data';
import { ensureEquipmentStructure } from '@/lib/forging-logic';
import { convertGradeToGiai } from '@/lib/item-quality-data';
import { DEFAULT_MANUALS } from '@/lib/manuals-data';

// ============================================
// 1. SINH PHÒNG BẢN ĐỒ PHÂN NHÁNH (PROCEDURAL)
// ============================================

const ROOM_TEMPLATES: Record<DungeonRoomType, { title: string; desc: string; icon: string; danger: DungeonRoomChoice['dangerLevel'] }> = {
  battle: {
    title: 'Mật Thất Yêu Ma',
    desc: 'Âm khí lượn lờ, tiếng gầm gừ của yêu thú vọng ra từ khe đá.',
    icon: '⚔️',
    danger: 'low'
  },
  elite: {
    title: 'Đầu Lĩnh Quái Tinh Anh',
    desc: 'Khí áp bạo liệt, một con quái vật cổ đại khát máu đang án ngữ.',
    icon: '👹',
    danger: 'medium'
  },
  treasure: {
    title: 'Cổ Thần Tàng Bảo Các',
    desc: 'Linh quang phát sáng nhè nhẹ, dường như có rương cổ chưa mở.',
    icon: '🎁',
    danger: 'safe'
  },
  altar: {
    title: 'Tế Đàn Thần Chúc Cổ',
    desc: 'Bát Quái đài cổ kính, nơi có thể hiến tế chân khí đổi lấy thần phù.',
    icon: '📜',
    danger: 'safe'
  },
  trap: {
    title: 'Cấm Chế Cổ Trận',
    desc: 'Pháp trận sát phạt thời cổ đại ẩn giấu dưới lớp gạch rêu phong.',
    icon: '⚠️',
    danger: 'high'
  },
  rest: {
    title: 'Linh Tuyền Thạch Thất',
    desc: 'Nước suối linh khí róc rách, hương thơm thảo mộc giúp an định tâm thần.',
    icon: '🏕️',
    danger: 'safe'
  },
  boss: {
    title: 'Thủ Vệ Trấn Tầng',
    desc: 'Đại yêu ma viễn cổ canh giữ cửa ải phong ấn, khí thế áp đảo thiên địa!',
    icon: '👑',
    danger: 'deadly'
  }
};

/**
 * Sinh danh sách 2-3 phòng ngẫu nhiên cho bước tiếp theo
 */
export function generateFloorRooms(
  floor: number,
  maxFloors: number,
  stepInFloor: number,
  stepsPerFloor: number = 3,
  player?: PlayerStats
): DungeonRoomChoice[] {
  // Nếu là bước cuối cùng của tầng -> Bắt buộc là Boss trấn tầng
  if (stepInFloor >= stepsPerFloor) {
    const isFinalBoss = floor >= maxFloors;
    return [
      {
        id: `room_${Date.now()}_boss`,
        roomType: 'boss',
        title: isFinalBoss ? '👑 Cổ Thần Chung Cực (Boss Đại Viên Mãn)' : `👑 Thủ Vệ Trấn Tầng (Tầng ${floor})`,
        description: isFinalBoss
          ? 'Ý chí của Cổ Thần ngưng tụ, đánh bại sẽ phá tan bí cảnh đoạt đại cơ duyên!'
          : 'Trảm sát thủ vệ này để mở ra thông đạo bước lên tầng cao hơn.',
        icon: '👑',
        dangerLevel: 'deadly',
        resolved: false
      }
    ];
  }

  // Các bước thông thường: sinh 2-3 lựa chọn ngẫu nhiên
  const choiceCount = 2 + (Math.random() < 0.5 ? 1 : 0);
  const possibleTypes: DungeonRoomType[] = ['battle', 'treasure', 'altar', 'trap', 'rest'];
  if (stepInFloor > 1) {
    possibleTypes.push('elite');
  }

  // Perk & Mệnh Duyên: Khí Vận >= 80 hoặc Tổ Hợp "Thiên Đạo Chi Tử" nhân đôi tỷ lệ xuất hiện của Tàng Bảo Các
  const hasThaiHuSynergy = Boolean(
    player?.destinyBoard?.equippedIds?.includes('phuc_duyen_tham_hau') &&
    player?.destinyBoard?.equippedIds?.includes('khi_van_hanh_thong')
  );
  if ((player && (player.khiVan || 0) >= 80) || hasThaiHuSynergy) {
    possibleTypes.push('treasure');
    if (hasThaiHuSynergy) possibleTypes.push('treasure');
  }

  const choices: DungeonRoomChoice[] = [];
  const chosenTypes = new Set<DungeonRoomType>();

  while (choices.length < choiceCount && chosenTypes.size < possibleTypes.length) {
    const randomType = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
    if (!chosenTypes.has(randomType)) {
      chosenTypes.add(randomType);
      const tpl = ROOM_TEMPLATES[randomType];
      choices.push({
        id: `room_${Date.now()}_${randomType}_${choices.length}`,
        roomType: randomType,
        title: tpl.title,
        description: tpl.desc,
        icon: tpl.icon,
        dangerLevel: tpl.danger,
        resolved: false
      });
    }
  }

  return choices;
}

// ============================================
// 2. TÍNH TOÁN COMBAT STATS VỚI BUFF BÍ CẢNH
// ============================================

export function getEffectiveDungeonStats(
  player: PlayerStats,
  activeBuffs: DungeonBuff[]
): { atk: number; def: number; critRate: number; lifesteal: number; reflect: number } {
  let atkMult = 1.0;
  let defMult = 1.0;
  let bonusCrit = 0;
  let bonusLifesteal = 0;
  let bonusReflect = 0;

  for (const buff of activeBuffs) {
    if (buff.statBonus.congKichPercent) atkMult += buff.statBonus.congKichPercent / 100;
    if (buff.statBonus.phongNguPercent) defMult += buff.statBonus.phongNguPercent / 100;
    if (buff.statBonus.baoKichRate) bonusCrit += buff.statBonus.baoKichRate;
    if (buff.statBonus.hutMauRate) bonusLifesteal += buff.statBonus.hutMauRate;
    if (buff.statBonus.phanDmgRate) bonusReflect += buff.statBonus.phanDmgRate;
  }

  const baseAtk = player.congKich || 50;
  const baseDef = player.phongNgu || 30;
  const baseCrit = player.baoKichRate || 5;

  return {
    atk: Math.round(baseAtk * atkMult),
    def: Math.round(baseDef * defMult),
    critRate: Math.min(75, baseCrit + bonusCrit),
    lifesteal: bonusLifesteal,
    reflect: bonusReflect
  };
}

// ============================================
// 3. GIẢI QUYẾT SỰ KIỆN PHÒNG (ROOM RESOLVER)
// ============================================

export interface RoomResolutionResult {
  updatedState: DungeonRunState;
  narrative: string;
  isCombatVictory?: boolean;
  isDefeated?: boolean;
  rewardSummary?: string;
}

export function resolveRoomEncounter(
  player: PlayerStats,
  currentState: DungeonRunState,
  choiceAction?: string
): RoomResolutionResult {
  const room = currentState.currentRoom;
  if (!room) {
    return { updatedState: currentState, narrative: 'Không có phòng nào được chọn.' };
  }

  const state: DungeonRunState = JSON.parse(JSON.stringify(currentState));
  const dungeon = getDungeonById(state.realmId);
  const floorScale = 1 + (state.currentFloor - 1) * 0.25;
  const combatStats = getEffectiveDungeonStats(player, state.activeBuffs);

  let narrative = '';
  let rewardSummary = '';
  let isDefeated = false;

  switch (room.roomType) {
    case 'battle':
    case 'elite':
    case 'boss': {
      const isBoss = room.roomType === 'boss';
      const isElite = room.roomType === 'elite';
      const multiplier = isBoss ? 2.8 : isElite ? 1.6 : 1.0;

      // Chỉ số quái vật
      const monsterBaseHp = Math.round(dungeon.minRealm * 300 * floorScale * multiplier) + 400;
      const monsterBaseAtk = Math.round(dungeon.minRealm * 35 * floorScale * multiplier) + 60;
      const monsterBaseDef = Math.round(dungeon.minRealm * 15 * floorScale * multiplier) + 20;

      // Tính sát thương của người chơi lên quái
      const isCrit = Math.random() * 100 < combatStats.critRate;
      const critMultiplier = isCrit ? 1.8 : 1.0;
      const playerDmg = Math.max(20, Math.round((combatStats.atk * 1.5 - monsterBaseDef) * critMultiplier));

      // Quái đánh lại người chơi
      const monsterDmg = Math.max(15, Math.round(monsterBaseAtk * 1.2 - combatStats.def * 0.7));

      // Hút máu & Phản đòn
      const lifestealHeal = Math.round(playerDmg * (combatStats.lifesteal / 100));

      // Cập nhật HP
      state.currentHp = Math.max(0, state.currentHp - monsterDmg + lifestealHeal);
      state.currentHp = Math.min(state.maxHp, state.currentHp);

      if (state.currentHp <= 0) {
        isDefeated = true;
        narrative = `Ngươi trúng phải đòn chí mạng của ${room.title}! Khí huyết cạn kiệt, ngất đi trong mê trận cổ đại!`;
      } else {
        // Chiến thắng quái
        const baseLinhThach = isBoss ? 3000 * state.currentFloor : isElite ? 1200 : 500;
        const linhThachWon = Math.round(baseLinhThach * (1 + Math.random() * 0.4));
        state.lootBag.linhThach += linhThachWon;

        // Rơi đồ
        const dropHerb = DEFAULT_HERBS[Math.floor(Math.random() * DEFAULT_HERBS.length)];
        const dropOre = DEFAULT_ORES[Math.floor(Math.random() * DEFAULT_ORES.length)];

        state.lootBag.herbs.push({ id: dropHerb.id, name: dropHerb.name, quantity: isBoss ? 3 : 1 });
        state.lootBag.materials.push({ id: dropOre.id, name: dropOre.name, quantity: isBoss ? 2 : 1 });

        // Boss rơi thêm Linh Ngọc
        if (isBoss || (isElite && Math.random() < 0.6)) {
          const gemLevel = Math.min(5, Math.max(1, Math.floor(dungeon.minRealm / 6) + 1));
          const gemTypes: ('kim' | 'mộc' | 'thủy' | 'hỏa' | 'thổ' | 'lôi' | 'phong')[] = ['kim', 'mộc', 'thủy', 'hỏa', 'thổ', 'lôi', 'phong'];
          const pickedType = gemTypes[Math.floor(Math.random() * gemTypes.length)];
          const gem = createGem(pickedType, gemLevel, 1);
          state.lootBag.gems.push({ id: gem.id, name: gem.name, quantity: 1 });
          rewardSummary += ` +1 [${gem.name}]`;
        }

        rewardSummary += ` +${linhThachWon} Linh Thạch, +1 [${dropHerb.name}], +1 [${dropOre.name}]`;
        narrative = isBoss
          ? `⚡ Đại thắng! Ngươi vận chuyển thần thông trảm sát Thủ Vệ Trấn Tầng, phá toái cấm chế kết giới! Nhận được:${rewardSummary}`
          : `⚔️ Xuất chiêu thành công! Ngươi đánh bại yêu ma chịu ${monsterDmg} sát thương ${lifestealHeal > 0 ? `(hồi ${lifestealHeal} HP)` : ''}. Thu được:${rewardSummary}`;
      }
      break;
    }

    case 'treasure': {
      // Mở rương cổ
      // Kiểm tra Tổ Hợp Mệnh Cách "Thiên Đạo Chi Tử": Tăng gấp đôi cơ duyên Rương Thái Hư
      const hasThaiHuSynergy = Boolean(
        player.destinyBoard?.equippedIds?.includes('phuc_duyen_tham_hau') &&
        player.destinyBoard?.equippedIds?.includes('khi_van_hanh_thong')
      );

      let tierKey = (choiceAction as 'silver' | 'gold' | 'celestial') || 'silver';
      // Nếu có tổ hợp Thiên Đạo Chi Tử và chọn ngẫu nhiên hoặc mở hòm, 50% tự động thăng cấp thành Thái Hư Thần Hòm
      if (hasThaiHuSynergy && tierKey !== 'celestial' && Math.random() < 0.5) {
        tierKey = 'celestial';
      }

      const tier = CHEST_TIERS[tierKey] || CHEST_TIERS.silver;

      const baseLt = Math.round(tier.minLinhThach + Math.random() * (tier.maxLinhThach - tier.minLinhThach));
      const lt = hasThaiHuSynergy ? baseLt * 2 : baseLt;
      state.lootBag.linhThach += lt;

      const ore = DEFAULT_ORES[Math.floor(Math.random() * DEFAULT_ORES.length)];
      const oreCount = hasThaiHuSynergy ? tier.oreCount * 2 : tier.oreCount;
      state.lootBag.materials.push({ id: ore.id, name: ore.name, quantity: oreCount });

      // Perk Thiên Mệnh Chi Tử / Tổ Hợp: nhân đôi tỷ lệ rơi Dị Bảo / Linh Ngọc
      const hasThienMenh = (player.khiVan || 0) >= 80 || hasThaiHuSynergy;
      const effectiveGemChance = hasThienMenh ? Math.min(1.0, tier.gemChance * 2) : tier.gemChance;

      if (Math.random() < effectiveGemChance) {
        const gemTypes: ('kim' | 'mộc' | 'thủy' | 'hỏa' | 'thổ' | 'lôi' | 'phong')[] = ['kim', 'mộc', 'thủy', 'hỏa', 'thổ', 'lôi', 'phong'];
        const gemType = gemTypes[Math.floor(Math.random() * gemTypes.length)];
        const gem = createGem(gemType, tier.gemLevel, 1);
        state.lootBag.gems.push({ id: gem.id, name: gem.name, quantity: 1 });
        rewardSummary += ` +1 [${gem.name}]`;
      }

      // Tỷ lệ rơi Tàn Quyển Bí Kíp Công Pháp từ Cổ Rương (đặc biệt là Hoàng Kim & Thái Hư Thần Hòm)
      const effectiveManualChance = hasThienMenh ? Math.min(1.0, (tier.manualChance || 0.2) * 1.5) : (tier.manualChance || 0.2);
      if (Math.random() < effectiveManualChance) {
        let eligible = DEFAULT_MANUALS;
        if (tierKey === 'silver') {
          eligible = DEFAULT_MANUALS.filter(m => m.grade === 'Hoàng Giai');
        } else if (tierKey === 'gold') {
          eligible = DEFAULT_MANUALS.filter(m => m.grade === 'Huyền Giai' || m.grade === 'Địa Giai');
        } else {
          eligible = DEFAULT_MANUALS.filter(m => m.grade === 'Thiên Giai' || m.grade === 'Thần Giai' || m.grade === 'Địa Giai');
        }
        if (eligible.length > 0) {
          const m = eligible[Math.floor(Math.random() * eligible.length)];
          if (!state.lootBag.manuals) state.lootBag.manuals = [];
          state.lootBag.manuals.push({ id: m.id, name: m.name, grade: m.grade, quantity: 1 });
          rewardSummary += ` +1 Tàn Quyển [${m.name}]`;
        }
      }

      rewardSummary += ` +${lt} Linh Thạch, +${oreCount} [${ore.name}]`;
      const synergyPrefix = hasThaiHuSynergy ? '⭐ [Thiên Đạo Chi Tử - Nhân Đôi Đại Cơ Duyên Thái Hư] ' : '';
      const prefix = hasThienMenh && !hasThaiHuSynergy ? '⭐ [Thiên Mệnh Chi Tử - Nhân Đôi Dị Bảo] ' : '';
      narrative = `${synergyPrefix}${prefix}🎁 Khai mở [${tier.name}] thành công! Bên trong bảo quang rực rỡ tỏa ngát linh khí. Ngươi thu nạp vào túi tạm:${rewardSummary}`;
      break;
    }

    case 'altar': {
      // Hiến tế nhận Thần Chúc
      const availableBuffs = ALTAR_BUFFS.filter(b => !state.activeBuffs.some(ab => ab.id === b.id));
      const buff = availableBuffs.length > 0
        ? availableBuffs[Math.floor(Math.random() * availableBuffs.length)]
        : ALTAR_BUFFS[0];

      // Tiêu hao nhỏ: -10% HP hoặc -15 MP
      const hpSacrifice = Math.round(state.maxHp * 0.1);
      state.currentHp = Math.max(1, state.currentHp - hpSacrifice);
      state.activeBuffs.push(buff);

      narrative = `📜 Ngươi thành tâm hướng về Cổ Thần Đài hiến tế ${hpSacrifice} Khí Huyết. Tế đàn phát sáng dị quang, ban cho ngươi ấn ký [${buff.name}]! (${buff.description})`;
      break;
    }

    case 'trap': {
      // Bẫy cổ trận
      const trap = TRAP_TEMPLATES[Math.floor(Math.random() * TRAP_TEMPLATES.length)];
      let playerValue = 0;
      if (trap.checkStat === 'ngoTinh') playerValue = player.ngoTinh || 30;
      else if (trap.checkStat === 'tocDo') playerValue = player.tocDo || 30;
      else if (trap.checkStat === 'canCot') playerValue = player.canCot || 30;
      else if (trap.checkStat === 'khiVan') playerValue = player.khiVan || 20;

      if (playerValue >= trap.threshold) {
        // Hóa giải thành công
        const tuViBonus = 500 * state.currentFloor;
        state.lootBag.linhThach += 300;
        narrative = `🛡️ [${trap.name}] - ${trap.successNarrative} Nhận được +${tuViBonus} ngộ tính tu vi và 300 Linh Thạch rơi vãi!`;
      } else {
        // Dính bẫy
        const dmg = Math.round(state.maxHp * (trap.damagePercent / 100));
        state.currentHp = Math.max(0, state.currentHp - dmg);
        state.currentMp = Math.max(0, state.currentMp - trap.mpCost);

        if (state.currentHp <= 0) {
          isDefeated = true;
          narrative = `💥 [${trap.name}] - ${trap.failureNarrative} Đòn phản phệ quá mãnh liệt, ngươi kiệt sức ngã gục!`;
        } else {
          narrative = `⚠️ [${trap.name}] - ${trap.failureNarrative} Tổn thất ${dmg} Khí Huyết và ${trap.mpCost} Chân Nguyên!`;
        }
      }
      break;
    }

    case 'rest': {
      // Hồi phục tại Linh Tuyền
      const hpRecover = Math.round(state.maxHp * 0.35);
      const mpRecover = Math.round(state.maxMp * 0.4);

      state.currentHp = Math.min(state.maxHp, state.currentHp + hpRecover);
      state.currentMp = Math.min(state.maxMp, state.currentMp + mpRecover);

      narrative = `🏕️ Ngươi khoanh chân nhập định bên bờ Linh Tuyền Thạch Thất, uống ngụm nước suối ngọc bích. Toàn thân thanh mát, hồi phục +${hpRecover} Khí Huyết và +${mpRecover} Chân Nguyên!`;
      break;
    }
  }

  state.roomEventResolved = true;
  state.eventNarrative = narrative;

  return {
    updatedState: state,
    narrative,
    isDefeated,
    rewardSummary
  };
}

// ============================================
// 4. KẾT TOÁN THÁM HIỂM (SETTLE / RETREAT)
// ============================================

export interface SettleResult {
  updatedPlayer: PlayerStats;
  message: string;
  totalLinhThachRetrieved: number;
  totalItemsRetrieved: number;
}

export function settleDungeonRun(
  player: PlayerStats,
  state: DungeonRunState,
  isVictoryOrRetreat: boolean
): SettleResult {
  const updated: PlayerStats = JSON.parse(JSON.stringify(player));
  const inv = updated.inventory || {
    pills: [],
    herbs: [],
    ores: [],
    manuals: [],
    equipments: [],
    books: [],
    bags: [],
    gems: []
  };

  const loot = state.lootBag;
  const factor = isVictoryOrRetreat ? 1.0 : 0.5;

  // 1. Linh Thạch
  const retrievedLinhThach = Math.floor(loot.linhThach * factor);
  updated.linhThach = (updated.linhThach || 0) + retrievedLinhThach;

  let totalItemsRetrieved = 0;

  // 2. Thảo Dược
  if (!inv.herbs) inv.herbs = [];
  for (const h of loot.herbs) {
    const q = Math.max(1, Math.floor(h.quantity * factor));
    const exist = (inv.herbs || []).find(item => item.id === h.id);
    if (exist) {
      exist.quantity += q;
    } else {
      const template = DEFAULT_HERBS.find(item => item.id === h.id) || DEFAULT_HERBS[0];
      inv.herbs.push({ ...template, quantity: q });
    }
    totalItemsRetrieved += q;
  }

  // 3. Khoáng Thạch
  if (!inv.ores) inv.ores = [];
  for (const o of loot.materials) {
    const q = Math.max(1, Math.floor(o.quantity * factor));
    const exist = (inv.ores || []).find(item => item.id === o.id);
    if (exist) {
      exist.quantity += q;
    } else {
      const template = DEFAULT_ORES.find(item => item.id === o.id) || DEFAULT_ORES[0];
      inv.ores.push({ ...template, quantity: q });
    }
    totalItemsRetrieved += q;
  }

  // 4. Linh Ngọc
  if (!inv.gems) inv.gems = [];
  for (const g of loot.gems) {
    const q = Math.max(1, Math.floor(g.quantity * factor));
    const exist = inv.gems.find(item => item.id === g.id);
    if (exist) {
      exist.quantity += q;
    } else {
      inv.gems.push(createGem('kim', 1, q));
    }
    totalItemsRetrieved += q;
  }

  // 5. Tàn Quyển Bí Tịch Công Pháp
  if (Array.isArray(loot.manuals) && loot.manuals.length > 0) {
    if (!inv.books) inv.books = [];
    for (const m of loot.manuals) {
      const exist = inv.books.find(b => b.manualId === m.id || b.id === m.id);
      if (exist) {
        exist.quantity = (exist.quantity || 1) + 1;
      } else {
        const fullDef = DEFAULT_MANUALS.find(dm => dm.id === m.id);
        inv.books.push({
          id: `book_${m.id}`,
          name: m.name || fullDef?.name || 'Tàn Quyển Bí Kíp',
          grade: m.grade || fullDef?.grade || 'Huyền Giai',
          description: fullDef?.description || 'Bí tịch thu hoạch từ di tích cổ bí cảnh.',
          itemType: 'manual',
          manualId: m.id,
          quantity: 1
        });
      }
      totalItemsRetrieved += 1;
    }
  }

  updated.inventory = inv;
  updated.dungeonRunState = null;

  if (!isVictoryOrRetreat) {
    // Trọng thương khi tử trận
    updated.khiHuyet = 1;
  }

  const message = isVictoryOrRetreat
    ? `🎉 Rời Bí Cảnh an toàn! Thu hoạch thành công 100% chiến lợi phẩm: +${retrievedLinhThach.toLocaleString()} Linh Thạch và ${totalItemsRetrieved} bảo vật đã chuyển vào Túi Trữ Vật!`
    : `💀 Trọng thương vong mạng trong bí cảnh! Ngươi được truyền tống ra ngoài trong gang tấc nhưng tổn thất 50% tài nguyên: Vớt vát được ${retrievedLinhThach.toLocaleString()} Linh Thạch.`;

  return {
    updatedPlayer: updated,
    message,
    totalLinhThachRetrieved: retrievedLinhThach,
    totalItemsRetrieved
  };
}
