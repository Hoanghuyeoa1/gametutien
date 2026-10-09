// app/api/event/route.ts
// API endpoint để xử lý random events

import { NextRequest, NextResponse } from 'next/server';
import { triggerRandomEvent, resolveEventChoice, updatePlayerStats, calculateCombatPower, applySecretRealmRewardToPlayer } from '@/lib/game-logic';
import { calculateCombatStats } from '@/lib/destiny-data';
import { createDefaultCompanionPlayerState } from '@/lib/companions-data';
import { RandomEvent, EventChoice } from '@/lib/types';
import eventsDataRaw from '@/data/events-data.json';
import realmsData from '@/data/realms-data.json';

const eventsData = eventsDataRaw as unknown as RandomEvent[];
const maxRealmIndex = realmsData.length - 1;

// GET - Lấy random event phù hợp với player
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const playerData = searchParams.get('player');
    const realmParam = searchParams.get('realm');
    const khiVanParam = searchParams.get('khiVan');
    
    let currentRealm = 0;
    let khiVan = 50;
    
    if (playerData) {
      try {
        const parsed = JSON.parse(playerData);
        currentRealm = typeof parsed.currentRealm === 'number' ? parsed.currentRealm : 0;
        khiVan = typeof parsed.khiVan === 'number' ? parsed.khiVan : 50;
      } catch (e) {
        // Fallback to query params
      }
    }
    if (realmParam) currentRealm = parseInt(realmParam, 10) || 0;
    if (khiVanParam) khiVan = parseInt(khiVanParam, 10) || 50;
    
    // Filter events available for current realm
    const availableEvents = eventsData.filter(event => 
      currentRealm >= (event.availableFrom ?? 0) &&
      currentRealm <= (event.availableTo ?? maxRealmIndex)
    );
    
    const pool = availableEvents.length > 0 ? availableEvents : eventsData;
    
    // Weight events by khiVan and trigger chance
    const weightedEvents = pool.map(event => ({
      ...event,
      weight: (event.triggerChance || 20) * (1 + (event.khiVanModifier || 0.2) * ((khiVan - 50) / 50))
    }));
    
    // Random select
    const totalWeight = weightedEvents.reduce((sum, e) => sum + Math.max(1, e.weight), 0);
    let random = Math.random() * totalWeight;
    
    let selectedEvent = weightedEvents[0];
    for (const event of weightedEvents) {
      random -= Math.max(1, event.weight);
      if (random <= 0) {
        selectedEvent = event;
        break;
      }
    }
    
    // Giữ nguyên toàn bộ lựa chọn kèm điều kiện
    return NextResponse.json({
      hasEvent: true,
      event: selectedEvent
    });
    
  } catch (error) {
    console.error('Event fetch error:', error);
    const fallbackEvent = eventsData[Math.floor(Math.random() * eventsData.length)];
    return NextResponse.json({
      hasEvent: true,
      event: fallbackEvent
    });
  }
}

// POST - Resolve event choice or get random event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { player, eventId, choiceId, action } = body;
    
    // Support getting random event via POST
    if (action === 'get_random' || (!eventId && player)) {
      const currentRealm = typeof player?.currentRealm === 'number' ? player.currentRealm : 0;
      const khiVan = typeof player?.khiVan === 'number' ? player.khiVan : 50;
      const available = eventsData.filter(e => currentRealm >= (e.availableFrom ?? 0) && currentRealm <= (e.availableTo ?? maxRealmIndex));
      const pool = available.length > 0 ? available : eventsData;
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      return NextResponse.json({
        hasEvent: true,
        event: chosen
      });
    }
    
    if (!player || !eventId || !choiceId) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }
    
    // Find event
    const event = eventsData.find(e => e.id === eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Find choice
    const choice = event.choices.find(c => c.id === choiceId);
    if (!choice) {
      return NextResponse.json(
        { error: 'Choice not found' },
        { status: 404 }
      );
    }
    
    // Check requirements
    if (choice.requirements) {
      const reqs = choice.requirements;
      const cStats = calculateCombatStats(player);
      const cPower = calculateCombatPower(player);

      if (reqs.ngoTinh && player.ngoTinh < reqs.ngoTinh) {
        return NextResponse.json(
          { error: `Cần Ngộ Tính >= ${reqs.ngoTinh} (Hiện có: ${player.ngoTinh})` },
          { status: 400 }
        );
      }
      if (reqs.tamCanh && player.tamCanh < reqs.tamCanh) {
        return NextResponse.json(
          { error: `Cần Tâm Cảnh >= ${reqs.tamCanh} (Hiện có: ${player.tamCanh})` },
          { status: 400 }
        );
      }
      if (reqs.khiVan && player.khiVan < reqs.khiVan) {
        return NextResponse.json(
          { error: `Cần Khí Vận >= ${reqs.khiVan} (Hiện có: ${player.khiVan})` },
          { status: 400 }
        );
      }
      if (reqs.canCot && player.canCot < reqs.canCot) {
        return NextResponse.json(
          { error: `Cần Căn Cốt >= ${reqs.canCot} (Hiện có: ${player.canCot})` },
          { status: 400 }
        );
      }
      if (reqs.linhThach && player.linhThach < reqs.linhThach) {
        return NextResponse.json(
          { error: `Cần Linh Thạch >= ${reqs.linhThach.toLocaleString()} (Hiện có: ${player.linhThach.toLocaleString()})` },
          { status: 400 }
        );
      }
      if (reqs.hp && (player.khiHuyet ?? 500) < reqs.hp) {
        return NextResponse.json(
          { error: `Cần Khí Huyết >= ${reqs.hp} HP (Hiện có: ${player.khiHuyet ?? 500})` },
          { status: 400 }
        );
      }
      if (reqs.mp && (player.linhLuc ?? 200) < reqs.mp) {
        return NextResponse.json(
          { error: `Cần Chân Nguyên >= ${reqs.mp} MP (Hiện có: ${player.linhLuc ?? 200})` },
          { status: 400 }
        );
      }
      if (reqs.atk && (cStats.atk < reqs.atk && cPower < reqs.atk)) {
        return NextResponse.json(
          { error: `Cần Công Kích >= ${reqs.atk} (Hiện có: ${Math.max(cStats.atk, cPower)})` },
          { status: 400 }
        );
      }
    }
    
    // Resolve choice
    const outcome = resolveEventChoice(choice, player);
    
    // Apply effects
    let updatedPlayer = { ...player };
    
    if (outcome.effects) {
      updatedPlayer = updatePlayerStats(updatedPlayer, {
        tuVi: outcome.effects.tuVi || 0,
        canCot: outcome.effects.canCot || 0,
        ngoTinh: outcome.effects.ngoTinh || 0,
        khiVan: outcome.effects.khiVan || 0,
        tamCanh: outcome.effects.tamCanh || 0,
        linhThach: outcome.effects.linhThach || 0,
        danhVong: outcome.effects.danhVong || 0
      });

      // Cập nhật Khí Huyết
      if (outcome.effects.khiHuyet) {
        const curHP = updatedPlayer.khiHuyet ?? 500;
        const maxHP = updatedPlayer.maxKhiHuyet || 1000;
        updatedPlayer.khiHuyet = Math.max(1, Math.min(maxHP, curHP + outcome.effects.khiHuyet));
      }

      // Cập nhật Chân Nguyên
      if (outcome.effects.linhLuc) {
        const curMP = updatedPlayer.linhLuc ?? 200;
        const maxMP = updatedPlayer.maxLinhLuc || 500;
        updatedPlayer.linhLuc = Math.max(0, Math.min(maxMP, curMP + outcome.effects.linhLuc));
      }

      // Cập nhật Tinh Huyết Yêu Thú
      if (outcome.effects.tinhHuyet) {
        updatedPlayer.tinhHuyetYeuThu = (updatedPlayer.tinhHuyetYeuThu || 0) + outcome.effects.tinhHuyet;
      }

      // Cập nhật Đạo Lữ Hảo Cảm
      if (outcome.effects.companionId && outcome.effects.companionAffinity) {
        if (!updatedPlayer.companionsState) {
          updatedPlayer.companionsState = { companions: {} };
        }
        if (!updatedPlayer.companionsState.companions) {
          updatedPlayer.companionsState.companions = {};
        }
        const rawCompId = outcome.effects.companionId;
        const compId = rawCompId.startsWith('companion_') ? rawCompId : `companion_${rawCompId}`;
        const curComp = updatedPlayer.companionsState.companions[compId] || createDefaultCompanionPlayerState(compId);
        curComp.isMet = true;
        curComp.affinity = Math.min(100, (curComp.affinity || 0) + outcome.effects.companionAffinity);
        updatedPlayer.companionsState.companions[compId] = curComp;
      }
    }

    // Đồng bộ thêm vật phẩm Kỳ Duyên vào Inventory nếu có phần thưởng
    const rewardOutcomeResult = applySecretRealmRewardToPlayer(updatedPlayer, outcome);
    updatedPlayer = rewardOutcomeResult.player;
    
    return NextResponse.json({
      success: true,
      outcome,
      updatedPlayer,
      rewardResult: {
        added: rewardOutcomeResult.added,
        isFull: rewardOutcomeResult.isFull,
        message: rewardOutcomeResult.message,
        item: rewardOutcomeResult.rewardItem
      },
      specialReward: outcome.effects?.specialReward
    });
    
  } catch (error) {
    console.error('Event resolution error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

