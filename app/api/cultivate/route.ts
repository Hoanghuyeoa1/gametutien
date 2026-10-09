// app/api/cultivate/route.ts
// API endpoint để xử lý tu luyện, rơi đồ bế quan & Kỳ Duyên Động Phủ

import { NextRequest, NextResponse } from 'next/server';
import { processCultivation, updatePlayerStats } from '@/lib/game-logic';
import realmsData from '@/data/realms-data.json';
import { DEFAULT_HERBS, DEFAULT_ORES } from '@/lib/alchemy-data';
import { DEFAULT_MANUALS } from '@/lib/manuals-data';
import { CultivateDropItem, PlayerStats, Herb, Ore, Manual, Pill, CultivateStance, CultivateSummaryData } from '@/lib/types';
import { canAddItemToInventory, addItemToInventory, getMaxInventoryCapacity } from '@/lib/inventory-data';
import { CULTIVATE_STANCES, generateCultivateEncounters } from '@/lib/cultivate-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { player, duration, stance = 'co_ban' } = body;

    // Validate input
    if (!player || !duration) {
      return NextResponse.json(
        { error: 'Missing player data or duration' },
        { status: 400 }
      );
    }

    if (duration < 1 || duration > 1440) {
      return NextResponse.json(
        { error: 'Duration must be between 1 and 1440 minutes' },
        { status: 400 }
      );
    }

    const curStance = (stance in CULTIVATE_STANCES ? stance : 'co_ban') as CultivateStance;
    const stanceCfg = CULTIVATE_STANCES[curStance];

    // 1. Process cultivation EXP (đã áp dụng hệ số tâm pháp phương hướng)
    const result = processCultivation(player, duration, realmsData, curStance);

    // 2. Tính toán rơi đồ (Drops) cơ bản theo thời gian & Khí Vận & Stance Multiplier
    const khiVan = player.khiVan || 50;
    const khiVanMod = (khiVan - 50) * 0.005; // -0.25 to +0.25

    const baseDrops: CultivateDropItem[] = [];
    let baseLinhThachBonus = 0;

    // Rơi Dược Liệu
    const herbDropChance = Math.min(0.99, (0.2 + (duration / 300) * 0.4 + khiVanMod) * stanceCfg.dropRateMultiplier);
    if (Math.random() < herbDropChance) {
      const baseHerbCount = duration >= 1440 ? (Math.floor(Math.random() * 3) + 3) : duration >= 720 ? (Math.floor(Math.random() * 2) + 2) : duration >= 240 ? 2 : 1;
      const herbCount = Math.max(1, Math.floor(baseHerbCount * (curStance === 'doat_bao' ? 1.5 : 1)));
      for (let i = 0; i < herbCount; i++) {
        const availableHerbs = duration >= 720 ? DEFAULT_HERBS : DEFAULT_HERBS.slice(0, 5);
        const pickedHerb = availableHerbs[Math.floor(Math.random() * availableHerbs.length)];
        const qty = duration >= 1440 ? (Math.floor(Math.random() * 2) + 2) : 1;
        baseDrops.push({
          type: 'herb',
          name: pickedHerb.name,
          quantity: qty,
          quality: pickedHerb.grade,
          description: `Thu hái được ${qty} cây [${pickedHerb.name}] trong lúc nạp khí.`,
          data: pickedHerb
        });
      }
    }

    // Rơi Khoáng Thạch
    const oreDropChance = Math.min(0.98, (0.15 + (duration / 400) * 0.4 + khiVanMod) * stanceCfg.dropRateMultiplier);
    if (Math.random() < oreDropChance) {
      const baseOreCount = duration >= 1440 ? 2 : 1;
      const oreCount = curStance === 'doat_bao' ? baseOreCount + 1 : baseOreCount;
      for (let i = 0; i < oreCount; i++) {
        const availableOres = duration >= 720 ? DEFAULT_ORES : DEFAULT_ORES.slice(0, 3);
        const pickedOre = availableOres[Math.floor(Math.random() * availableOres.length)];
        const qty = duration >= 720 ? (Math.floor(Math.random() * 2) + 1) : 1;
        baseDrops.push({
          type: 'ore',
          name: pickedOre.name,
          quantity: qty,
          quality: pickedOre.grade,
          description: `Phát hiện ${qty} khối [${pickedOre.name}] trầm tích linh mạch.`,
          data: pickedOre
        });
      }
    }

    // Cơ duyên nhặt được Túi Linh Thạch cổ cơ bản
    if (duration >= 240 || Math.random() < 0.2 + khiVanMod || curStance === 'doat_bao') {
      const rawLinhThach = Math.floor((duration * 0.8 + (Math.random() * duration)) * (1 + khiVan / 100));
      baseLinhThachBonus = Math.floor(rawLinhThach * stanceCfg.linhThachMultiplier);
      if (baseLinhThachBonus > 0) {
        baseDrops.push({
          type: 'linhThach',
          name: 'Túi Cổ Tiền Linh Thạch',
          quantity: baseLinhThachBonus,
          quality: 'Linh Thạch',
          description: `Đào được di vật cổ chứa +${baseLinhThachBonus.toLocaleString()} Hạ Phẩm Linh Thạch!`
        });
      }
    }

    // Cơ duyên nhặt được Tàn Trang / Bí Tịch Công Pháp
    const manualChance = (duration >= 1440 ? (0.65 + khiVanMod) : duration >= 720 ? (0.35 + khiVanMod) : duration >= 240 ? (0.15 + khiVanMod) : 0.03) * (curStance === 'hiem_canh' ? 1.5 : 1.0);
    if (Math.random() < manualChance) {
      const unownedManuals = DEFAULT_MANUALS.filter(m => {
        const owned = player.manuals?.some((om: Manual) => om.id === m.id);
        return !owned;
      });
      if (unownedManuals.length > 0) {
        const pickedManual = unownedManuals[Math.floor(Math.random() * unownedManuals.length)];
        baseDrops.push({
          type: 'manual',
          name: pickedManual.name,
          quantity: 1,
          quality: pickedManual.grade,
          description: `Ngộ đạo trong thiền định, tình cờ giác ngộ được bí tịch [${pickedManual.name}]!`,
          data: pickedManual
        });
      }
    }

    // 3. Sinh các sự kiện "Kỳ Duyên Bế Quan" (2 đến 6 sự kiện ngẫu nhiên theo thời gian)
    const encounterData = generateCultivateEncounters(player, duration, curStance);

    // Tổng hợp toàn bộ vật phẩm rơi ra
    const allDrops: CultivateDropItem[] = [...baseDrops, ...encounterData.extraDrops];
    const totalLinhThachGain = baseLinhThachBonus + encounterData.extraLinhThach;

    // Cập nhật player stats
    let updatedPlayer: PlayerStats = updatePlayerStats(player, {
      tuVi: result.tuViGain,
      linhThach: totalLinhThachGain
    });

    // Thêm Trung Phẩm Linh Thạch nếu có
    if (encounterData.extraTrungPham > 0) {
      updatedPlayer.trungPhamLinhThach = (updatedPlayer.trungPhamLinhThach || 0) + encounterData.extraTrungPham;
    }

    // Thêm Tinh Huyết nếu có
    if (encounterData.extraTinhHuyet > 0) {
      updatedPlayer.tinhHuyetYeuThu = (updatedPlayer.tinhHuyetYeuThu || 0) + encounterData.extraTinhHuyet;
    }

    // Tăng Ngộ Tính vĩnh viễn nếu có
    if (encounterData.extraNgoTinh > 0) {
      updatedPlayer.ngoTinh = (updatedPlayer.ngoTinh || 50) + encounterData.extraNgoTinh;
    }

    // Tăng Khí Vận vĩnh viễn nếu có
    if (encounterData.extraKhiVan > 0) {
      updatedPlayer.khiVan = (updatedPlayer.khiVan || 50) + encounterData.extraKhiVan;
    }

    // Tăng Tôi Thể / Nhục Thân Exp nếu có
    if (encounterData.extraBodyExp > 0) {
      if (!updatedPlayer.bodyRefinement) {
        updatedPlayer.bodyRefinement = { realmIndex: 0, level: 1, currentExp: 0, maxExp: 100 };
      }
      updatedPlayer.bodyRefinement.currentExp = (updatedPlayer.bodyRefinement.currentExp || 0) + encounterData.extraBodyExp;
    }

    // Xử lý trừ máu / Chân Nguyên nếu gặp Tâm Ma
    if (encounterData.tamMaTriggered) {
      if (encounterData.hpLoss > 0) {
        const curHp = updatedPlayer.khiHuyet || updatedPlayer.maxKhiHuyet || 1000;
        updatedPlayer.khiHuyet = Math.max(1, curHp - encounterData.hpLoss);
      }
      if (encounterData.mpLoss > 0) {
        const curMp = updatedPlayer.linhLuc || updatedPlayer.maxLinhLuc || 500;
        updatedPlayer.linhLuc = Math.max(0, curMp - encounterData.mpLoss);
      }
    }

    const inv = updatedPlayer.inventory ? { ...updatedPlayer.inventory } : { pills: [], herbs: [], ores: [], manuals: [] };
    if (!inv.herbs) inv.herbs = [];
    if (!inv.ores) inv.ores = [];
    if (!inv.pills) inv.pills = [];
    if (!inv.manuals) inv.manuals = [];
    if (!updatedPlayer.manuals) updatedPlayer.manuals = [];

    // Gộp drops vào inventory chuẩn bất biến và kiểm tra sức chứa Túi Trữ Vật
    const acceptedDrops: CultivateDropItem[] = [];
    let bagFullOccurred = false;
    const maxCap = getMaxInventoryCapacity(updatedPlayer);

    for (const drop of allDrops) {
      if (drop.type === 'herb' && drop.data) {
        const resAdd = addItemToInventory(inv, maxCap, 'herb', drop.data, drop.quantity);
        if (resAdd.success) {
          Object.assign(inv, resAdd.inventory);
          acceptedDrops.push(drop);
        } else {
          bagFullOccurred = true;
        }
      } else if (drop.type === 'ore' && drop.data) {
        const resAdd = addItemToInventory(inv, maxCap, 'ore', drop.data, drop.quantity);
        if (resAdd.success) {
          Object.assign(inv, resAdd.inventory);
          acceptedDrops.push(drop);
        } else {
          bagFullOccurred = true;
        }
      } else if (drop.type === 'pill' && drop.data) {
        const resAdd = addItemToInventory(inv, maxCap, 'pill', drop.data, drop.quantity);
        if (resAdd.success) {
          Object.assign(inv, resAdd.inventory);
          acceptedDrops.push(drop);
        } else {
          bagFullOccurred = true;
        }
      } else if (drop.type === 'tinhHuyet') {
        acceptedDrops.push(drop);
      } else if (drop.type === 'manual' && drop.data) {
        const existingInPlayer = updatedPlayer.manuals.find((m: Manual) => m.id === drop.data.id);
        if (!existingInPlayer) {
          if (canAddItemToInventory({ ...updatedPlayer, inventory: inv }, 'manual', drop.data.id)) {
            updatedPlayer.manuals.push({ ...drop.data, level: 1 });
            acceptedDrops.push(drop);
          } else {
            bagFullOccurred = true;
          }
        }
      } else if (drop.type === 'linhThach' || drop.type === 'trungPhamLinhThach') {
        acceptedDrops.push(drop);
      }
    }
    updatedPlayer.inventory = inv;

    // Tổng kết dữ liệu phiên bế quan cho Modal Tổng Kết
    const summary: CultivateSummaryData = {
      duration,
      stance: curStance,
      tuViGain: result.tuViGain,
      linhThachGain: totalLinhThachGain,
      trungPhamLinhThachGain: encounterData.extraTrungPham,
      tinhHuyetGain: encounterData.extraTinhHuyet,
      ngoTinhGain: encounterData.extraNgoTinh,
      khiVanGain: encounterData.extraKhiVan,
      bodyExpGain: encounterData.extraBodyExp,
      tamMaTriggered: encounterData.tamMaTriggered,
      hpLoss: encounterData.hpLoss,
      mpLoss: encounterData.mpLoss,
      events: encounterData.events,
      drops: acceptedDrops,
      bagFull: bagFullOccurred,
      message: `Tu luyện ${duration} phút theo [${stanceCfg.name}] đại thành! Thu được +${result.tuViGain.toLocaleString()} Tu Vi.${bagFullOccurred ? ' (⚠️ Túi trữ vật đã đầy, một số dị bảo không thể thu thập!)' : ''}`
    };

    return NextResponse.json({
      success: true,
      result,
      summary,
      drops: acceptedDrops,
      events: encounterData.events,
      bagFull: bagFullOccurred,
      updatedPlayer,
      message: summary.message
    });

  } catch (error) {
    console.error('Cultivation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
