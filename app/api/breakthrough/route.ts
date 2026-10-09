// app/api/breakthrough/route.ts
// API endpoint để xử lý đột phá cảnh giới

import { NextRequest, NextResponse } from 'next/server';
import { attemptBreakthrough, updatePlayerStats } from '@/lib/game-logic';
import { calculateEffectiveRequiredTuVi, isMajorBreakthroughRealm } from '@/lib/attribute-perks';
import { getBaseLifespanForRealm } from '@/lib/lifespan-logic';
import realmsData from '@/data/realms-data.json';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { player, itemBonus = 0 } = body;
    
    // Validate input
    if (!player) {
      return NextResponse.json(
        { error: 'Missing player data' },
        { status: 400 }
      );
    }
    
    // Chuẩn hóa và làm sạch currentRealm thành số nguyên hợp lệ trong khoảng [0, realmsData.length - 1]
    const currentRealmIndex = Math.max(
      0,
      Math.min(realmsData.length - 1, parseInt(String(player?.currentRealm ?? 0), 10) || 0)
    );
    const currentRealmData = realmsData[currentRealmIndex];
    const nextRealmIndex = currentRealmIndex + 1;
    const nextRealm = nextRealmIndex < realmsData.length ? realmsData[nextRealmIndex] : undefined;
    player.currentRealm = currentRealmIndex;

    if (!nextRealm) {
      return NextResponse.json(
        { error: 'Already at maximum realm!' },
        { status: 400 }
      );
    }
    
    // Attempt breakthrough
    const result = attemptBreakthrough(player, nextRealm, itemBonus);
    
    // Update player stats based on result
    let updatedPlayer = { ...player };
    
    if (result.success) {
      // Success - gán trực tiếp cảnh giới mới chính xác thay vì phụ thuộc delta
      updatedPlayer.currentRealm = nextRealmIndex;
      const newMaxLifespan = getBaseLifespanForRealm(nextRealmIndex) + (player.lifespanPillsUsed || 0);
      updatedPlayer.maxLifespan = newMaxLifespan;
      updatedPlayer = updatePlayerStats(updatedPlayer, {
        tuVi: result.rewards!.tuVi,
        linhThach: result.rewards!.linhThach - nextRealm.requirements.linhThach, // Subtract cost, add reward
        danhVong: result.rewards!.danhVong
      });
      // Bảo đảm currentRealm và maxLifespan không bị ghi đè bởi bất kỳ side-effect nào
      updatedPlayer.currentRealm = nextRealmIndex;
      updatedPlayer.maxLifespan = newMaxLifespan;
      
      // Bonus tâm cảnh if passed tam ma
      if (result.tamMaPassed) {
        updatedPlayer = updatePlayerStats(updatedPlayer, {
          tamCanh: 5
        });
      }
      
      // Bonus if passed thien kiep
      if (result.thienKiepPassed) {
        updatedPlayer = updatePlayerStats(updatedPlayer, {
          tamCanh: 8,
          ngoTinh: 3
        });
      }
      
    } else {
      // Failure - apply penalties
      if (result.penalties) {
        const linhThachSpent = result.penalties.linhThach || nextRealm.requirements.linhThach;
        result.penalties.linhThach = linhThachSpent;
        updatedPlayer = updatePlayerStats(updatedPlayer, {
          tuVi: -result.penalties.tuVi,
          linhThach: -linhThachSpent,
          tamCanh: result.penalties.tamCanh ? -result.penalties.tamCanh : 0
        });
      }
      // Bảo đảm tuyệt đối thất bại không bao giờ làm méo mó hay tụt cảnh giới
      updatedPlayer.currentRealm = currentRealmIndex;
    }

    // Tiêu hao 1 lá bùa đột phá nếu có
    if (updatedPlayer.inventory?.talismans && Array.isArray(updatedPlayer.inventory.talismans)) {
      const btTalismanIndex = updatedPlayer.inventory.talismans.findIndex((t: any) => t.type === 'breakthrough' && t.quantity > 0);
      if (btTalismanIndex >= 0) {
        const item = updatedPlayer.inventory.talismans[btTalismanIndex];
        item.quantity -= 1;
        updatedPlayer.inventory.talismans = updatedPlayer.inventory.talismans.filter((t: any) => t.quantity > 0);
      }
    }
    
    return NextResponse.json({
      success: result.success,
      result,
      updatedPlayer,
      message: result.message,
      flavorText: result.flavorText
    });
    
  } catch (error) {
    console.error('Breakthrough error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint để check xem có thể đột phá không
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
    const currentRealmIndex = Math.max(
      0,
      Math.min(realmsData.length - 1, parseInt(String(player?.currentRealm ?? 0), 10) || 0)
    );
    const currentRealmData = realmsData[currentRealmIndex];
    const nextRealmIndex = currentRealmIndex + 1;
    const nextRealm = nextRealmIndex < realmsData.length ? realmsData[nextRealmIndex] : undefined;
    player.currentRealm = currentRealmIndex;

    if (!nextRealm) {
      return NextResponse.json({
        canBreakthrough: false,
        reason: 'Đã đạt cảnh giới tối đa!'
      });
    }
    
    // Check requirements
    const reasons = [];
    const requiredTuVi = calculateEffectiveRequiredTuVi(player, nextRealm);
    
    if (player.tuVi < requiredTuVi) {
      const hasNhatNiem = (player.ngoTinh || 0) >= 80;
      reasons.push(`Tu vi chưa đủ: cần ${requiredTuVi.toLocaleString()}${hasNhatNiem ? ' [Nhất Niệm Thông Thiên -15%]' : ''}, hiện có ${player.tuVi.toLocaleString()}`);
    }
    
    if (player.linhThach < nextRealm.requirements.linhThach) {
      reasons.push(`Linh thạch chưa đủ: cần ${nextRealm.requirements.linhThach.toLocaleString()}, hiện có ${player.linhThach.toLocaleString()}`);
    }
    
    const tamMaMultiplier = player.physique?.tamMaChanceMultiplier || 1.0;
    const hasBatDong = (player.tamCanh || 0) >= 90;
    const isMajor = isMajorBreakthroughRealm(nextRealmIndex);
    const tamMaChance = (hasBatDong && !isMajor) ? 0 : Math.floor(nextRealm.breakthrough.tamMaChance * tamMaMultiplier);

    return NextResponse.json({
      canBreakthrough: reasons.length === 0,
      nextRealm,
      reasons: reasons.length > 0 ? reasons : undefined,
      breakthroughChance: nextRealm.breakthrough.baseSuccessRate,
      tamMaChance,
      hasThienKiep: nextRealm.requirements.thienKiep || false
    });
    
  } catch (error) {
    console.error('Breakthrough check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

