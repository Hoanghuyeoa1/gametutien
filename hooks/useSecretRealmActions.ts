import { useState } from 'react';
import { PlayerStats, SecretRealmDungeon, LogType, DungeonRunState } from '@/lib/types';
import { getDungeonById } from '@/lib/secret-realm-data';
import {
  generateFloorRooms,
  resolveRoomEncounter,
  settleDungeonRun
} from '@/lib/secret-realm-logic';
import { audioEngine } from '@/lib/audio-engine';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';

interface UseSecretRealmActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
  onExploreRandomEvent?: () => void;
}

export function useSecretRealmActions({
  player,
  setPlayer,
  addLog,
  showToast,
  onExploreRandomEvent
}: UseSecretRealmActionsParams) {
  const [eventsSubTab, setEventsSubTab] = useState<'dungeons' | 'forbidden_zones' | 'ancient_maps' | 'random_events' | 'black_market'>('dungeons');
  const [isAdvancingFloor, setIsAdvancingFloor] = useState<boolean>(false);
  const [dungeonLogs, setDungeonLogs] = useState<string[]>([]);

  // Lấy trạng thái hiện tại của chuyến thám hiểm
  const dungeonState = player.dungeonRunState || null;

  // 1. Khởi tạo chuyến đi ải mới
  const handleStartDungeon = (realmId: string) => {
    const dungeon = getDungeonById(realmId);
    if (!dungeon) {
      showToast('Bí cảnh không tồn tại!');
      return;
    }

    if (player.currentRealm < dungeon.minRealm) {
      showToast(`Cảnh giới chưa đủ! Cần đạt [${dungeon.realmName}] trở lên để bước vào.`);
      return;
    }

    const currentMp = player.linhLuc ?? 100;
    if (currentMp < dungeon.mpCost) {
      showToast(`Chân nguyên không đủ! Cần ${dungeon.mpCost} MP để mở ra thông đạo cổ trận.`);
      return;
    }

    audioEngine.playSFX('alchemy');

    const curHp = player.khiHuyet || 500;
    const maxHp = player.maxKhiHuyet || 500;
    const maxMp = player.maxLinhLuc || 300;

    const initialRooms = generateFloorRooms(1, dungeon.totalFloors, 1, 3, player);

    const newDungeonState: DungeonRunState = {
      isActive: true,
      realmId: dungeon.id,
      realmName: dungeon.name,
      currentFloor: 1,
      maxFloors: dungeon.totalFloors,
      stepInFloor: 1,
      currentHp: curHp,
      maxHp,
      currentMp: currentMp - dungeon.mpCost,
      maxMp,
      activeBuffs: [],
      availableRooms: initialRooms,
      currentRoom: null,
      roomEventResolved: false,
      lootBag: {
        linhThach: 0,
        gems: [],
        materials: [],
        herbs: [],
        equipments: []
      }
    };

    const updated: PlayerStats = {
      ...player,
      linhLuc: currentMp - dungeon.mpCost,
      dungeonRunState: newDungeonState
    };

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    showToast(`Đã mở ra thông đạo bước vào [${dungeon.name}] Tầng 1!`);
    addLog(
      'Khai Mở Cổ Bí Cảnh',
      `Tiêu hao ${dungeon.mpCost} Chân Nguyên phá toái kết giới, bước vào [${dungeon.name}] Tầng 1 bắt đầu chuyến đi ải Roguelite!`,
      'event'
    );
  };

  // 2. Chọn ngã rẽ (Chọn 1 trong các phòng)
  const handleSelectRoom = (roomIndex: number) => {
    if (!dungeonState) return;
    const room = dungeonState.availableRooms[roomIndex];
    if (!room) return;

    audioEngine.playSFX('click');

    // Mỗi bước di chuyển tiêu hao 10 Chân Nguyên
    const nextMp = Math.max(0, dungeonState.currentMp - 10);

    const updatedState: DungeonRunState = {
      ...dungeonState,
      currentMp: nextMp,
      currentRoom: { ...room },
      roomEventResolved: false,
      eventNarrative: undefined
    };

    const updated: PlayerStats = {
      ...player,
      dungeonRunState: updatedState
    };

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  };

  // 3. Giải quyết sự kiện trong phòng (Đánh quái, Mở rương, Nhận chúc phúc, Uống linh tuyền)
  const handleResolveCurrentRoom = (choiceAction?: string) => {
    if (!dungeonState || !dungeonState.currentRoom) return;

    const res = resolveRoomEncounter(player, dungeonState, choiceAction);
    const roomType = dungeonState.currentRoom.roomType;

    // Phát âm thanh theo loại phòng
    if (roomType === 'battle' || roomType === 'elite' || roomType === 'boss') {
      audioEngine.playSFX(res.isDefeated ? 'thunder' : 'slash', true);
    } else if (roomType === 'trap') {
      audioEngine.playSFX('thunder');
    } else {
      audioEngine.playSFX('alchemy');
    }

    if (res.isDefeated) {
      // Bị hạ gục trong bí cảnh -> Tổn thất 50% đồ, về 1 HP
      const settle = settleDungeonRun(player, res.updatedState, false);
      const normalized = normalizePlayerData(settle.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      showToast('💀 Ngươi đã bị hạ gục trong Bí Cảnh! Tổn thất 50% tài nguyên.');
      addLog('Vong Mạng Trong Bí Cảnh', settle.message, 'danger');
      return;
    }

    // Cập nhật trạng thái sau khi giải quyết phòng
    const updated: PlayerStats = {
      ...player,
      dungeonRunState: res.updatedState
    };

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    if (res.rewardSummary) {
      showToast(`Thu nạp: ${res.rewardSummary}`);
    }
    addLog(`Bí Cảnh [${dungeonState.currentRoom.title}]`, res.narrative, 'event');
  };

  // 4. Bước tiếp theo hoặc chuyển tầng
  const handleNextStep = () => {
    if (!dungeonState || !dungeonState.currentRoom) return;

    const isBossRoom = dungeonState.currentRoom.roomType === 'boss';

    if (isBossRoom) {
      // Đã đánh bại Boss tầng
      if (dungeonState.currentFloor >= dungeonState.maxFloors) {
        // Phá đảo toàn bộ bí cảnh!
        audioEngine.playSFX('slash', true);
        const settle = settleDungeonRun(player, dungeonState, true);
        const normalized = normalizePlayerData(settle.updatedPlayer);
        setPlayer(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

        showToast(`🏆 Phá đảo toàn bộ [${dungeonState.realmName}]! Nhận 100% chiến lợi phẩm!`);
        addLog(
          `🏆 THÔNG QUAN ĐẠI BÍ CẢNH: [${dungeonState.realmName}]`,
          `Ngươi đã trảm sát Cổ Thần Tối Thượng ở tầng cao nhất!\n${settle.message}`,
          'event'
        );
        return;
      }

      // Sang tầng tiếp theo
      audioEngine.playSFX('alchemy');
      const nextFloor = dungeonState.currentFloor + 1;
      const nextRooms = generateFloorRooms(nextFloor, dungeonState.maxFloors, 1, 3, player);

      const nextState: DungeonRunState = {
        ...dungeonState,
        currentFloor: nextFloor,
        stepInFloor: 1,
        availableRooms: nextRooms,
        currentRoom: null,
        roomEventResolved: false,
        eventNarrative: undefined
      };

      const updated: PlayerStats = {
        ...player,
        dungeonRunState: nextState
      };

      const normalized = normalizePlayerData(updated);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      showToast(`🌟 Đã đặt chân lên Tầng ${nextFloor}!`);
      addLog('Đột Phá Tầng Kế', `Mở ra thạch môn thông đạo, bước vào Tầng ${nextFloor}!`, 'event');
    } else {
      // Sang bước tiếp theo trong cùng tầng
      audioEngine.playSFX('click');
      const nextStep = dungeonState.stepInFloor + 1;
      const nextRooms = generateFloorRooms(dungeonState.currentFloor, dungeonState.maxFloors, nextStep, 3, player);

      const nextState: DungeonRunState = {
        ...dungeonState,
        stepInFloor: nextStep,
        availableRooms: nextRooms,
        currentRoom: null,
        roomEventResolved: false,
        eventNarrative: undefined
      };

      const updated: PlayerStats = {
        ...player,
        dungeonRunState: nextState
      };

      const normalized = normalizePlayerData(updated);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
  };

  // 5. Rút lui an toàn (Mang 100% chiến lợi phẩm về)
  const handleRetreatDungeon = () => {
    if (!dungeonState) return;

    audioEngine.playSFX('alchemy');
    const settle = settleDungeonRun(player, dungeonState, true);
    const normalized = normalizePlayerData(settle.updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    showToast('🏃 Rút lui an toàn khỏi Bí Cảnh! Đã mang toàn bộ bảo vật về túi.');
    addLog('Rút Lui Khỏi Bí Cảnh', settle.message, 'event');
  };

  // ============================================
  // TƯƠNG THÍCH CODE GIAO DIỆN CŨ
  // ============================================
  const activeDungeon = dungeonState ? getDungeonById(dungeonState.realmId) : null;
  const dungeonFloor = dungeonState?.currentFloor || 1;

  const handleEnterDungeon = (dungeon: SecretRealmDungeon) => {
    handleStartDungeon(dungeon.id);
  };

  const handleExitDungeon = () => {
    handleRetreatDungeon();
  };

  const handleAdvanceDungeonFloor = () => {
    handleNextStep();
  };

  const handleClaimDungeonTreasure = () => {
    handleRetreatDungeon();
  };

  return {
    eventsSubTab,
    setEventsSubTab,
    dungeonState,
    activeDungeon,
    dungeonFloor,
    isAdvancingFloor,
    setIsAdvancingFloor,
    dungeonLogs,
    setDungeonLogs,
    handleStartDungeon,
    handleSelectRoom,
    handleResolveCurrentRoom,
    handleNextStep,
    handleRetreatDungeon,
    handleEnterDungeon,
    handleExitDungeon,
    handleAdvanceDungeonFloor,
    handleClaimDungeonTreasure
  };
}
