// app/api/battle/route.ts
// API endpoint để xử lý chiến đấu với boss

import { NextRequest, NextResponse } from 'next/server';
import { battleBoss, updatePlayerStats } from '@/lib/game-logic';
import { Boss } from '@/lib/types';
import bossesData from '@/data/bosses-data.json';
import { canAddItemToInventory, addItemToInventory, getMaxInventoryCapacity } from '@/lib/inventory-data';

// GET - Lấy danh sách boss khả dụng
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const playerData = searchParams.get('player');
    
    if (!playerData) {
      return NextResponse.json(
        { error: 'Missing player data' },
        { status: 400 }
      );
    }
    
    const player = JSON.parse(playerData);
    const playerRealm = Math.max(0, parseInt(String(player?.currentRealm ?? 0), 10) || 0);
    
    // Filter bosses available for current realm
    // Bosses available from -5 to +10 realms
    const availableBosses = bossesData.filter(boss => 
      boss.realm >= playerRealm - 5 &&
      boss.realm <= playerRealm + 10
    );
    
    return NextResponse.json({
      bosses: availableBosses,
      currentRealm: playerRealm
    });
    
  } catch (error) {
    console.error('Boss list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Chiến đấu với boss
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { player, bossId, usedSkillManualId } = body;
    
    if (!player || !bossId) {
      return NextResponse.json(
        { error: 'Missing player data or boss ID' },
        { status: 400 }
      );
    }
    
    // Find boss
    const boss = bossesData.find(b => b.id === bossId) as Boss | undefined;
    if (!boss) {
      return NextResponse.json(
        { error: 'Boss not found' },
        { status: 404 }
      );
    }
    
    // Deduct skill MP cost if skill is used
    let playerForBattle = { ...player };
    if (usedSkillManualId && player.manuals) {
      const skillManual = player.manuals.find((m: any) => m.id === usedSkillManualId && m.level > 0);
      if (skillManual?.activeSkill) {
        const cost = skillManual.activeSkill.mpCost || 0;
        if ((playerForBattle.linhLuc || 0) >= cost) {
          playerForBattle.linhLuc = (playerForBattle.linhLuc || 0) - cost;
        }
      }
    }

    // Battle!
    const result = battleBoss(playerForBattle, boss, usedSkillManualId);
    
    // Update player stats
    let updatedPlayer = { ...playerForBattle };
    
    if (result.victory) {
      updatedPlayer = updatePlayerStats(updatedPlayer, {
        tuVi: result.rewards!.tuVi,
        linhThach: result.rewards!.linhThach,
        danhVong: result.rewards!.danhVong
      });

      // Tinh Huyết Yêu Thú drop
      const tinhHuyetDrop = result.tinhHuyetDrop || 1;
      updatedPlayer.tinhHuyetYeuThu = (updatedPlayer.tinhHuyetYeuThu || 0) + tinhHuyetDrop;

      // Tiên Thiên Đạo Thể tự động hồi phục 15% Chân Nguyên MP
      if (updatedPlayer.physique?.mpRegenPercent) {
        const regenAmount = Math.floor((updatedPlayer.maxLinhLuc || 100) * (updatedPlayer.physique.mpRegenPercent / 100));
        updatedPlayer.linhLuc = Math.min(updatedPlayer.maxLinhLuc || 100, (updatedPlayer.linhLuc || 0) + regenAmount);
      }

      const inv = updatedPlayer.inventory ? { ...updatedPlayer.inventory } : { pills: [], herbs: [], ores: [], manuals: [] };
      if (!inv.pills) inv.pills = [];
      if (!inv.herbs) inv.herbs = [];
      if (!inv.ores) inv.ores = [];
      if (!inv.manuals) inv.manuals = [];
      if (!updatedPlayer.manuals) updatedPlayer.manuals = [];

      let bagFull = false;

      const maxCap = getMaxInventoryCapacity(updatedPlayer);

      // Add dropped pill
      if (result.droppedPill) {
        const resPill = addItemToInventory(inv, maxCap, 'pill', result.droppedPill, result.droppedPill.quantity || 1);
        if (resPill.success) {
          Object.assign(inv, resPill.inventory);
        } else {
          bagFull = true;
        }
      }

      // Add dropped ore
      if (result.droppedOre) {
        const resOre = addItemToInventory(inv, maxCap, 'ore', result.droppedOre, result.droppedOre.quantity || 1);
        if (resOre.success) {
          Object.assign(inv, resOre.inventory);
        } else {
          bagFull = true;
        }
      }

      // Add dropped manual
      if (result.droppedManual) {
        const existManual = updatedPlayer.manuals.find((m: any) => m.id === result.droppedManual!.id);
        if (!existManual) {
          if (canAddItemToInventory({ ...updatedPlayer, inventory: inv }, 'manual', result.droppedManual.id)) {
            updatedPlayer.manuals.push({ ...result.droppedManual, level: 1 });
          } else {
            bagFull = true;
          }
        }
      }

      // Add dropped beast egg
      if (result.droppedBeastEgg) {
        if (!updatedPlayer.beastEggs) updatedPlayer.beastEggs = [];
        updatedPlayer.beastEggs.push(result.droppedBeastEgg);
      }

      updatedPlayer.inventory = inv;
    } else {
      updatedPlayer = updatePlayerStats(updatedPlayer, {
        tuVi: -result.penalties!.tuVi,
        linhThach: -result.penalties!.linhThach,
        khiVan: result.penalties!.khiVan ? -result.penalties!.khiVan : 0
      });
    }
    
    return NextResponse.json({
      success: result.victory,
      result,
      updatedPlayer,
      specialItems: result.victory ? result.rewards?.specialItems : undefined
    });
    
  } catch (error) {
    console.error('Battle error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

