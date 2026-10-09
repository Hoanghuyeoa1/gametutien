// hooks/useGameActions.ts
// Hook quản lý các API Actions chính: Tu Luyện (Cultivate), Đột Phá (Breakthrough), Trảm Boss (Battle), Kỳ Duyên (Random Events)

import { useState } from 'react';
import {
  PlayerStats,
  Realm,
  Boss,
  RandomEvent,
  EventChoice,
  EventOutcome,
  CultivateStance,
  CultivateSummaryData,
  CultivateDropItem
} from '@/lib/types';
import { CULTIVATE_STANCES } from '@/lib/cultivate-data';
import { normalizePlayerData, STORAGE_KEY } from '@/lib/save-migration';
import { addItemToInventory, getMaxInventoryCapacity } from '@/lib/inventory-data';
import { DeepCultivateUnit } from '@/lib/types/lifespan';
import { executeDeepCultivation } from '@/lib/lifespan-logic';
import { DEFAULT_HERBS, DEFAULT_ORES } from '@/lib/alchemy-data';
import {
  getBossElement,
  resolveEventChoice,
  applySecretRealmRewardToPlayer,
  calculateEffectiveRequiredTuVi,
  getMaxStatLimit
} from '@/lib/game-logic';
import {
  getElementalCombatModifier,
  ELEMENT_NAMES
} from '@/lib/elemental-system';
import eventsDataRaw from '@/data/events-data.json';
import realmsDataRaw from '@/data/realms-data.json';
import { audioEngine } from '@/lib/audio-engine';
import { isTribulationBreakthrough } from '@/lib/tribulation-logic';
import { checkAndTickVeinOccupation } from '@/lib/sect-logic';
import { SECT_DATA_MAP, SECT_PROFILES } from '@/lib/sect-data';

const realmsData = realmsDataRaw as Realm[];

export interface UseGameActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  nextRealm?: Realm;
  addLog: (title: string, content: string, type: any) => void;
  showToast: (msg: string) => void;
  onMajorBreakthrough?: (newRealmIndex: number, realmName: string) => void;
  onTriggerTribulation?: (fromRealmId: number, toRealmId: number, targetNextRealm: Realm) => void;
}

export interface UseGameActionsReturn {
  // Tu Luyện States
  cultivateDuration: number;
  setCultivateDuration: React.Dispatch<React.SetStateAction<number>>;
  cultivateStance: CultivateStance;
  setCultivateStance: React.Dispatch<React.SetStateAction<CultivateStance>>;
  cultivateSummary: CultivateSummaryData | null;
  setCultivateSummary: React.Dispatch<React.SetStateAction<CultivateSummaryData | null>>;
  isCultivating: boolean;

  // Đột Phá States
  isBreakingThrough: boolean;
  screenShake: boolean;
  tammaAlert: boolean;
  thienkiepAlert: boolean;

  // Chiến Đấu States
  isBattling: string | null;

  // Kỳ Duyên States
  activeEvent: RandomEvent | null;
  setActiveEvent: React.Dispatch<React.SetStateAction<RandomEvent | null>>;
  eventOutcome: EventOutcome | null;
  setEventOutcome: React.Dispatch<React.SetStateAction<EventOutcome | null>>;
  isResolvingEvent: boolean;

  // Action Functions
  handleCultivate: (overrideStance?: CultivateStance) => Promise<void>;
  handleDeepCultivate: (amount: number, unit: DeepCultivateUnit) => Promise<void>;
  handleBreakthrough: () => Promise<void>;
  handleBattleBoss: (boss: Boss, usedSkillManualId?: string) => Promise<void>;
  handleExploreRandomEvent: (customPlayer?: PlayerStats) => Promise<void>;
  fetchRandomEvent: (customPlayer?: PlayerStats) => Promise<void>;
  handleSelectEventChoice: (choice: EventChoice) => Promise<void>;
}

export function useGameActions({
  player,
  setPlayer,
  nextRealm,
  addLog,
  showToast,
  onMajorBreakthrough,
  onTriggerTribulation
}: UseGameActionsParams): UseGameActionsReturn {
  // Tu luyện & Đột phá
  const [cultivateDuration, setCultivateDuration] = useState<number>(60);
  const [cultivateStance, setCultivateStance] = useState<CultivateStance>('co_ban');
  const [cultivateSummary, setCultivateSummary] = useState<CultivateSummaryData | null>(null);
  const [isCultivating, setIsCultivating] = useState<boolean>(false);
  const [isBreakingThrough, setIsBreakingThrough] = useState<boolean>(false);
  const [isBattling, setIsBattling] = useState<string | null>(null);

  // Hiệu ứng cảnh báo (Tâm ma & Thiên kiếp)
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [tammaAlert, setTammaAlert] = useState<boolean>(false);
  const [thienkiepAlert, setThienkiepAlert] = useState<boolean>(false);

  // Modal Cơ Duyên (Random Event)
  const [activeEvent, setActiveEvent] = useState<RandomEvent | null>(null);
  const [eventOutcome, setEventOutcome] = useState<EventOutcome | null>(null);
  const [isResolvingEvent, setIsResolvingEvent] = useState<boolean>(false);

  // Kích hoạt hiệu ứng chấn động & nguy cơ
  const triggerHazardEffect = (isTamMa: boolean, isThienKiep: boolean) => {
    setScreenShake(true);
    if (isTamMa) setTammaAlert(true);
    if (isThienKiep) setThienkiepAlert(true);

    setTimeout(() => {
      setScreenShake(false);
      setTammaAlert(false);
      setThienkiepAlert(false);
    }, 3000);
  };

  // --- LOGIC API 1: TU LUYỆN (CULTIVATE) ---
  const handleCultivate = async (overrideStance?: CultivateStance) => {
    const activeStance = overrideStance || cultivateStance;
    setIsCultivating(true);
    const stanceCfg = CULTIVATE_STANCES[activeStance] || CULTIVATE_STANCES.co_ban;
    addLog(
      'Bế Quan Thổ Nạp',
      `Bắt đầu vận chuyển đại chu thiên trong ${cultivateDuration} phút theo [${stanceCfg.name}], linh khí hội tụ đan điền...`,
      'cultivate'
    );

    try {
      const res = await fetch('/api/cultivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player, duration: cultivateDuration, stance: activeStance })
      });
      const data = await res.json();

      if (data.success && data.updatedPlayer) {
        let updatedPlayerBase: PlayerStats = normalizePlayerData({
          ...player,
          ...data.updatedPlayer,
          inventory: data.updatedPlayer.inventory || player.inventory
        });

        if (data.summary?.tamMaTriggered) {
          updatedPlayerBase.khiHuyet = data.updatedPlayer.khiHuyet;
          updatedPlayerBase.linhLuc = data.updatedPlayer.linhLuc;
        } else {
          updatedPlayerBase.khiHuyet = updatedPlayerBase.maxKhiHuyet;
          updatedPlayerBase.linhLuc = updatedPlayerBase.maxLinhLuc;
        }

        // Đảm bảo toàn bộ vật phẩm trong data.drops được đưa vào túi đồ chuẩn bất biến
        if (data.drops && data.drops.length > 0) {
          let currentInv = updatedPlayerBase.inventory || { pills: [], herbs: [], ores: [] };
          const maxCap = getMaxInventoryCapacity(updatedPlayerBase);

          for (const d of data.drops) {
            if (d.type === 'herb' && d.data) {
              const resAdd = addItemToInventory(currentInv, maxCap, 'herb', d.data, d.quantity);
              if (resAdd.success) currentInv = resAdd.inventory;
            } else if (d.type === 'ore' && d.data) {
              const resAdd = addItemToInventory(currentInv, maxCap, 'ore', d.data, d.quantity);
              if (resAdd.success) currentInv = resAdd.inventory;
            } else if (d.type === 'pill' && d.data) {
              const resAdd = addItemToInventory(currentInv, maxCap, 'pill', d.data, d.quantity);
              if (resAdd.success) currentInv = resAdd.inventory;
            }
          }
          updatedPlayerBase.inventory = currentInv;
        }

        // Mô phỏng NPC môn phái đối thủ phản kích Linh Mạch khi bế quan
        const sId = updatedPlayerBase.sectState?.sectId;
        if (sId) {
          const sInfo = SECT_DATA_MAP[sId] || SECT_PROFILES[sId];
          const sTier = (sInfo?.tier as any) || 1;
          const incursion = checkAndTickVeinOccupation(updatedPlayerBase.sectState?.veinStates, sId, sTier);
          if (incursion.lostVeinIds.length > 0) {
            const remOccupied = (updatedPlayerBase.sectState?.occupiedVeinIds || []).filter((id: string) => !incursion.lostVeinIds.includes(id));
            const updatedSectState = {
              ...updatedPlayerBase.sectState!,
              veinStates: incursion.updatedVeinStates,
              occupiedVeinIds: remOccupied
            };
            updatedPlayerBase = {
              ...updatedPlayerBase,
              sectState: updatedSectState,
              sectData: updatedSectState
            };
            incursion.reportLogs.forEach(rLog => addLog('Sơn Môn Cảnh Báo', rLog, 'sect'));
            showToast('⚠️ Môn phái đối thủ đã đánh chiếm lại Linh Mạch của tông môn!');
          }
        }

        setPlayer(updatedPlayerBase);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayerBase));

        // Kích hoạt Modal Bảng Tổng Kết Chiến Lợi Phẩm Bế Quan
        if (data.summary) {
          setCultivateSummary(data.summary);
        }

        addLog(
          'Đại Chu Thiên Viên Mãn',
          `Bế quan hoàn tất! Hấp thu nhật nguyệt tinh hoa, thu hoạch +${data.result.tuViGain.toLocaleString()} Tu vi. Sinh lực tràn trề!`,
          'cultivate'
        );

        if (data.summary?.tamMaTriggered) {
          triggerHazardEffect(true, false);
          addLog(
            '⚠️ Tâm Ma Quấy Nhiễu Phản Phệ',
            `Linh lực cuồng bạo phản phệ! Tổn hao ${data.summary.hpLoss > 0 ? `${data.summary.hpLoss.toLocaleString()} Khí Huyết (HP)` : `${data.summary.mpLoss.toLocaleString()} Chân Nguyên (MP)`}!`,
            'danger'
          );
        }

        // Hiển thị chi tiết rơi đồ bế quan
        if (data.drops && data.drops.length > 0) {
          const dropTexts = data.drops.map((d: CultivateDropItem) => {
            if (d.type === 'linhThach') {
              return `• Thu hoạch: ${d.quantity.toLocaleString()} Hạ Phẩm Linh Thạch (Đã cất vào Túi Trữ Vật)`;
            }
            if (d.type === 'trungPhamLinhThach') {
              return `• Thu hoạch: ${d.quantity.toLocaleString()} Trung Phẩm Linh Thạch (Đã cất vào Túi Trữ Vật)`;
            }
            return `• [${d.quality}] ${d.name} x${d.quantity}`;
          }).join('\n');
          addLog(
            '🎁 Thu Hoạch Bế Quan Kỳ Duyên',
            `Khí vận hiển linh! Trong lúc bế quan ${cultivateDuration} phút theo [${stanceCfg.name}], ngươi thu được:\n${dropTexts}\n(Đã tự động cất vào Túi Trữ Vật & Công Pháp)`,
            'cultivate'
          );
          showToast(`Bế quan đại thành! Thu hoạch ${data.drops.length} vật phẩm & kỳ duyên quý giá!`);
        }

        // Xác suất kích hoạt ngẫu nhiên Kỳ Duyên
        if (Math.random() * 100 < 25) {
          handleExploreRandomEvent(updatedPlayerBase);
        }
      } else {
        addLog('Tạp Niệm Quấy Nhiễu', data.error || 'Tu luyện gián đoạn, tâm thần chưa định.', 'danger');
      }
    } catch (err) {
      addLog('Thiên Địa Biến Đổi', 'Lỗi liên kết thiên đạo (Mạng thất bại)!', 'danger');
    } finally {
      setIsCultivating(false);
    }
  };

  // --- LOGIC API 1.5: TUẾ NGUYỆT BẾ QUAN (DEEP CULTIVATION) ---
  const handleDeepCultivate = async (amount: number, unit: DeepCultivateUnit) => {
    setIsCultivating(true);
    try {
      const { updatedPlayer, result } = executeDeepCultivation(player, amount, unit);
      if (!result.success) {
        addLog(result.logTitle, result.logContent, 'danger');
        showToast(result.logTitle);
        audioEngine.playSFX('ui_error');
        return;
      }

      setPlayer(prev => {
        const merged = normalizePlayerData({
          ...prev,
          ...updatedPlayer,
          inventory: updatedPlayer.inventory || prev.inventory
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      });

      addLog(result.logTitle, result.logContent, 'cultivate');
      showToast(result.logTitle);
      audioEngine.playSFX('level_up');
    } finally {
      setIsCultivating(false);
    }
  };

  // --- LOGIC API 2: ĐỘT PHÁ (BREAKTHROUGH) ---
  const handleBreakthrough = async () => {
    const currentRealmIndex = Math.max(
      0,
      Math.min(realmsData.length - 1, parseInt(String(player?.currentRealm ?? 0), 10) || 0)
    );
    const currentRealmData = realmsData[currentRealmIndex];
    const nextRealmIndex = currentRealmIndex + 1;
    const targetNextRealm: Realm | undefined = nextRealm || (nextRealmIndex < realmsData.length ? realmsData[nextRealmIndex] : undefined);

    if (!targetNextRealm) {
      showToast('Đã đứng trên đỉnh phong vạn giới, không còn cảnh giới để đột phá!');
      return;
    }

    const effectiveTuViReq = calculateEffectiveRequiredTuVi(player, targetNextRealm);
    if (player.tuVi < effectiveTuViReq) {
      const hasNhatNiem = (player.ngoTinh || 0) >= 80;
      showToast(`Tu vi chưa đủ! Cần thêm ${(effectiveTuViReq - player.tuVi).toLocaleString()} tu vi${hasNhatNiem ? ' (Đã giảm 15% từ Nhất Niệm Thông Thiên)' : ''}.`);
      return;
    }
    if (player.linhThach < targetNextRealm.requirements.linhThach) {
      showToast(`Linh thạch chưa đủ! Cần thêm ${(targetNextRealm.requirements.linhThach - player.linhThach).toLocaleString()} linh thạch.`);
      return;
    }

    // ĐIỀU KIỆN KÍCH HOẠT LÔI KIẾP ĐỘ KIẾP (CHỈ TỪ ĐẠI THỪA LÊN ĐỘ KIẾP VÀ CÁC ĐẠI CẢNH GIỚI TIẾP THEO)
    if (isTribulationBreakthrough(currentRealmIndex, nextRealmIndex)) {
      if (onTriggerTribulation && targetNextRealm) {
        onTriggerTribulation(currentRealmIndex, nextRealmIndex, targetNextRealm);
        return;
      }
    }

    // Đan dược hỗ trợ đột phá
    const itemBonus = player.activeBuffs?.breakthroughBonus || 0;

    setIsBreakingThrough(true);
    addLog(
      'Xung Kích Cảnh Giới',
      `Khí tức ngút trời, ngươi đang dẫn động linh khí toàn thân trùng kích gông cùm ${targetNextRealm.name}...${itemBonus > 0 ? ` (Có Đan Dược gia trì +${itemBonus}% tỉ lệ)` : ''}`,
      'breakthrough'
    );

    try {
      const safePlayer = { ...player, currentRealm: currentRealmIndex };

      const res = await fetch('/api/breakthrough', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: safePlayer, itemBonus })
      });
      const data = await res.json();

      if (data.updatedPlayer) {
        const normalized = normalizePlayerData(data.updatedPlayer);
        // Hết hiệu lực đan dược đột phá sau lần kích hoạt này
        if (normalized.activeBuffs) {
          normalized.activeBuffs.breakthroughBonus = 0;
        }
        setPlayer(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }

      if (data.result?.thienKiepEncountered) {
        audioEngine.playThunderSound(1.0);
      } else if (data.result?.tamMaEncountered) {
        audioEngine.playThunderSound(0.65);
      }

      if (data.result?.tamMaEncountered || data.result?.thienKiepEncountered) {
        triggerHazardEffect(data.result.tamMaEncountered, data.result.thienKiepEncountered);
      }

      if (data.success) {
        audioEngine.playBreakthroughSuccessSound(1.0);
        addLog(
          `🎉 ĐỘT PHÁ THÀNH CÔNG: ${targetNextRealm.name}`,
          `${data.flavorText}\nThưởng: +${data.result.rewards?.tuVi?.toLocaleString()} Tu vi, • Thu hoạch: ${data.result.rewards?.linhThach?.toLocaleString()} Hạ Phẩm Linh Thạch (Đã cất vào Túi Trữ Vật), +${data.result.rewards?.danhVong?.toLocaleString()} Danh vọng!`,
          'breakthrough'
        );
        showToast(`Chúc mừng đạo hữu phá cảnh tiến vào [${targetNextRealm.name}]!`);

        // Tự động kích hoạt Đấu Giá Thiên Cổ khi phá cảnh tiến vào Đại Cảnh Giới
        if ([11, 16, 21, 26, 31, 36, 41, 46].includes(nextRealmIndex)) {
          onMajorBreakthrough?.(nextRealmIndex, targetNextRealm.name);
        }
      } else {
        if (!data.result?.thienKiepEncountered && !data.result?.tamMaEncountered) {
          audioEngine.playThunderSound(0.6);
        }
        const isTamMaFail = data.result.tamMaEncountered && !data.result.tamMaPassed;
        const isThienKiepFail = data.result.thienKiepEncountered && !data.result.thienKiepPassed;

        let failTitle = '❌ Đột Phá Thất Bại';
        if (isTamMaFail) failTitle = '💀 BỊ TÂM MA XÂM NHẬP!';
        else if (isThienKiepFail) failTitle = '⚡ THIÊN KIẾP ĐÁNH TAN NGUYÊN THẦN!';

        const lostTuVi = data.result?.penalties?.tuVi || 0;
        const linhThachSpent = targetNextRealm.requirements.linhThach;

        addLog(
          failTitle,
          `${data.message}\n"${data.flavorText}"\nTổn thất: -${lostTuVi.toLocaleString()} Tu vi, Tiêu hao: -${linhThachSpent.toLocaleString()} Hạ Phẩm Linh Thạch!`,
          'danger'
        );
        showToast(`Đột phá thất bại! Bị thiên địa phản phệ!`);
      }
    } catch (err) {
      addLog('Đột Phá Bất Thành', 'Lỗi liên kết linh thức với thiên địa!', 'danger');
    } finally {
      setIsBreakingThrough(false);
    }
  };

  // --- LOGIC API 3: BOSS BATTLE (KHIÊU CHIẾN THÍ LUYỆN) ---
  const handleBattleBoss = async (boss: Boss, usedSkillManualId?: string) => {
    const linhLucCost = 25;
    const currentMP = player.linhLuc ?? 50;
    if (currentMP < linhLucCost) {
      showToast(`Chân nguyên không đủ! Cần ít nhất ${linhLucCost} Linh Lực để xuất chiêu. Hãy Điều Tức hoặc Tu Luyện trước!`);
      return;
    }

    const bossElem = getBossElement(boss);
    const elemReport = getElementalCombatModifier(player.linhCan?.element, bossElem);
    const skillManual = usedSkillManualId ? player.manuals?.find(m => m.id === usedSkillManualId) : null;
    const skillText = skillManual?.activeSkill ? ` • Kích hoạt [${skillManual.activeSkill.name}]` : '';

    setIsBattling(boss.id);
    addLog(
      'Khai Chiến Thí Luyện',
      `Rút kiếm nghênh chiến [${boss.name}] (Hệ ${ELEMENT_NAMES[bossElem]})!${skillText}\n${elemReport.description}`,
      'battle'
    );

    try {
      const res = await fetch('/api/battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player, bossId: boss.id, usedSkillManualId })
      });
      const data = await res.json();
      audioEngine.playSwordSlashSound(1.0, Boolean(data.success));

      if (data.updatedPlayer) {
        setPlayer(prev => {
          const normalized = normalizePlayerData({
            ...prev,
            ...data.updatedPlayer,
            inventory: data.updatedPlayer.inventory || prev.inventory
          });
          normalized.linhLuc = Math.max(0, currentMP - linhLucCost);

          // Giảm số trận buff Cuồng Bạo Đan
          if (normalized.activeBuffs?.combatBuffBattlesLeft && normalized.activeBuffs.combatBuffBattlesLeft > 0) {
            normalized.activeBuffs.combatBuffBattlesLeft -= 1;
            if (normalized.activeBuffs.combatBuffBattlesLeft === 0) {
              normalized.activeBuffs.combatBuffPercent = 0;
              addLog('Dược Lực Tan Biến', 'Hiệu lực Cuồng Bạo Đan đã kết thúc.', 'system');
            }
          }

          if (!data.success) {
            const hpLoss = Math.floor((normalized.maxKhiHuyet || 200) * 0.3);
            normalized.khiHuyet = Math.max(1, (normalized.khiHuyet || 100) - hpLoss);
          } else {
            normalized.achievementsState = {
              ...normalized.achievementsState,
              claimedAchievementIds: normalized.achievementsState?.claimedAchievementIds || [],
              unlockedTitleIds: normalized.achievementsState?.unlockedTitleIds || [],
              stats: {
                ...normalized.achievementsState?.stats,
                bossKills: (normalized.achievementsState?.stats?.bossKills || 0) + 1
              }
            };
            // Khi thắng boss: Rơi ngẫu nhiên Dược Liệu hoặc Khoáng Thạch
            const herbDrop = DEFAULT_HERBS[Math.floor(Math.random() * DEFAULT_HERBS.length)];
            const oreDrop = DEFAULT_ORES[Math.floor(Math.random() * DEFAULT_ORES.length)];
            const maxCap = getMaxInventoryCapacity(normalized);

            let curInv = normalized.inventory || { pills: [], herbs: [], ores: [] };

            if (data.result?.droppedPill) {
              const resP = addItemToInventory(curInv, maxCap, 'pill', data.result.droppedPill, data.result.droppedPill.quantity || 1);
              if (resP.success) curInv = resP.inventory;
            }
            if (data.result?.droppedOre) {
              const resO = addItemToInventory(curInv, maxCap, 'ore', data.result.droppedOre, data.result.droppedOre.quantity || 1);
              if (resO.success) curInv = resO.inventory;
            }

            const resHerb = addItemToInventory(curInv, maxCap, 'herb', herbDrop, 1);
            if (resHerb.success) curInv = resHerb.inventory;

            const resOre = addItemToInventory(curInv, maxCap, 'ore', oreDrop, 1);
            if (resOre.success) curInv = resOre.inventory;

            normalized.inventory = curInv;

            // Cơ chế Cướp Đoạt Khí Vận (Fate Plundering)
            if ((boss.realm || 1) >= player.currentRealm) {
              const stolen = Math.random() < 0.5 ? 1 : 2;
              normalized.khiVan = (normalized.khiVan || 50) + stolen;
              normalized.stolenFatePoints = (normalized.stolenFatePoints || 0) + stolen;
              addLog(
                '✨ CƯỚP ĐOẠT KHÍ VẬN',
                `Thiên đạo vô tình, kẻ thắng làm vua! Ngươi đã cướp đoạt ${stolen} điểm Khí Vận từ [${boss.name}]!`,
                'battle'
              );
            }

            // Rơi Trứng Thần Thú (Linh Noãn)
            if (data.result?.droppedBeastEgg) {
              normalized.beastEggs = [...(normalized.beastEggs || []), data.result.droppedBeastEgg];
              addLog(
                '🥚 BẢO VẬT GIÁNG THẾ: LINH NOÃN',
                `Trảm sát [${boss.name}], thu hoạch được một quả [${data.result.droppedBeastEgg.name}] (${data.result.droppedBeastEgg.quality})! Hãy vào mục Linh Thú để ấp nở!`,
                'battle'
              );
              showToast(`🥚 Nhặt được [${data.result.droppedBeastEgg.name}]!`);
            }

            // Cập nhật tiến độ nhiệm vụ Tông Môn (Trảm Yêu Trừ Ma)
            if (normalized.sectState?.dailyQuests) {
              const q = normalized.sectState.dailyQuests.find(quest => quest.category === 'battle' && !quest.isCompleted);
              if (q) {
                q.currentCount = Math.min(q.targetCount, q.currentCount + 1);
                if (q.currentCount >= q.targetCount) q.isCompleted = true;
              }
            }
          }

          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          return normalized;
        });
      }

      if (data.success) {
        let dropsMsg = '';
        if (data.result.tinhHuyetDrop) {
          dropsMsg += `\n🩸 Thu được Tinh Huyết Yêu Thú: x${data.result.tinhHuyetDrop}!`;
        }
        if (data.result.droppedManual) {
          dropsMsg += `\n📜 Tịch thu Bí Tịch: [${data.result.droppedManual.name}] (${data.result.droppedManual.grade})!`;
        }
        if (data.result.droppedPill) {
          dropsMsg += `\n💊 Đoạt được Đan Dược: [${data.result.droppedPill.name}] x${data.result.droppedPill.quantity || 1}!`;
        }
        if (data.result.droppedOre) {
          dropsMsg += `\n⛏️ Thu nhặt Khoáng Thạch: [${data.result.droppedOre.name}] x${data.result.droppedOre.quantity || 1}!`;
        }

        const skillReport = data.result.usedSkillReport ? `\n⚡ Tuyệt Kỹ: Kích hoạt [${data.result.usedSkillReport.skillName}] bạo phát x${data.result.usedSkillReport.damageMultiplier.toFixed(1)} uy lực!` : '';
        const special = data.specialItems?.length ? `\nVật phẩm thu hoạch: ${data.specialItems.join(', ')}` : '';
        addLog(
          `⚔️ ĐẠI THẮNG: Trảm Diệt [${boss.name}]`,
          `${data.result.flavorText}${skillReport}\nChiến lợi phẩm: +${data.result.rewards?.tuVi?.toLocaleString()} Tu vi, • Thu hoạch: ${data.result.rewards?.linhThach?.toLocaleString()} Hạ Phẩm Linh Thạch (Đã cất vào Túi Trữ Vật), +${data.result.rewards?.danhVong?.toLocaleString()} Danh vọng!${special}${dropsMsg}\nToàn bộ chiến lợi phẩm đã chuyển vào Túi Đồ & Kho Tinh Huyết!`,
          'battle'
        );
        showToast(`Trảm sát ${boss.name} thành công! Nhận +${data.result.tinhHuyetDrop || 1} Tinh Huyết Yêu Thú!`);
      } else {
        addLog(
          `💀 CHIẾN BẠI: Thua Trận Trước [${boss.name}]`,
          `${data.result.flavorText}\nThương tích: Tổn hao -${data.result.penalties?.tuVi?.toLocaleString() || 0} Tu vi, -${data.result.penalties?.linhThach?.toLocaleString() || 0} Linh thạch, Khí Huyết hao hụt!`,
          'danger'
        );
        showToast(`Bại trận dưới tay ${boss.name}! Khí Huyết tổn thương!`);
      }
    } catch (err) {
      addLog('Hỗn Chiến Thất Bại', 'Lỗi kết nối đài thí luyện!', 'danger');
    } finally {
      setIsBattling(null);
    }
  };

  // --- LOGIC API 4: RANDOM EVENTS & KỲ DUYÊN BÍ CẢNH ---
  const handleExploreRandomEvent = async (customPlayer?: PlayerStats) => {
    const p = customPlayer || player;
    const currentMp = p.linhLuc ?? 100;
    const MP_COST = 30;

    if (currentMp < MP_COST) {
      showToast('Chân Nguyên không đủ, hãy vận công hồi phục trước khi thám hiểm!');
      addLog(
        'Chân Nguyên Khô Kiệt',
        'Chân Nguyên không đủ (cần 30 MP), hãy vận công thổ nạp hồi phục trước khi thám hiểm bí cảnh!',
        'danger'
      );
      return;
    }

    const nextMp = Math.max(0, currentMp - MP_COST);
    setPlayer(prev => {
      const updated = { ...prev, linhLuc: nextMp };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      const availableEvents = (eventsDataRaw as unknown as RandomEvent[]).filter(e =>
        p.currentRealm >= (e.availableFrom ?? 0) && p.currentRealm <= (e.availableTo ?? (realmsData.length - 1))
      );
      const pool = availableEvents.length > 0 ? availableEvents : (eventsDataRaw as unknown as RandomEvent[]);
      const picked = pool[Math.floor(Math.random() * pool.length)];

      if (picked) {
        setActiveEvent(picked);
        setEventOutcome(null);
        addLog(
          'Kỳ Duyên Hạ Phàm',
          `Cơ duyên bí cảnh xuất hiện: [${picked.name}]! Tiêu hao 30 Chân Nguyên. Đang chờ ngươi đưa ra lựa chọn...`,
          'event'
        );
      } else {
        showToast('Hiện tại khu vực bí cảnh linh khí tịch mịch, không có kỳ duyên nào.');
      }
    } catch (err) {
      showToast('Lỗi khi thăm dò bí cảnh!');
    }
  };

  const fetchRandomEvent = handleExploreRandomEvent;

  // Xử lý lựa chọn trong Modal Cơ Duyên
  const handleSelectEventChoice = async (choice: EventChoice) => {
    if (!activeEvent) return;
    setIsResolvingEvent(true);

    try {
      let outcomeResult: EventOutcome | null = null;
      let updatedPlayerStats: Partial<PlayerStats> | null = null;
      let rewardResultFromApi: any = null;

      try {
        const res = await fetch('/api/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            player,
            eventId: activeEvent.id,
            choiceId: choice.id
          })
        });
        const data = await res.json();
        if (data.success && data.outcome) {
          outcomeResult = data.outcome;
          updatedPlayerStats = data.updatedPlayer || null;
          rewardResultFromApi = data.rewardResult || null;
        }
      } catch (e) {
        // Fallback xử lý cục bộ an toàn nếu mạng có độ trễ
      }

      if (!outcomeResult) {
        outcomeResult = resolveEventChoice(choice, player);
        const eff = outcomeResult.effects || {};
        const maxStat = getMaxStatLimit(player.currentRealm || 0);
        updatedPlayerStats = {
          tuVi: Math.max(0, player.tuVi + (eff.tuVi || 0)),
          linhThach: Math.max(0, player.linhThach + (eff.linhThach || 0)),
          canCot: Math.min(maxStat, Math.max(1, player.canCot + (eff.canCot || 0))),
          ngoTinh: Math.min(maxStat, Math.max(1, player.ngoTinh + (eff.ngoTinh || 0))),
          khiVan: Math.min(maxStat, Math.max(1, player.khiVan + (eff.khiVan || 0))),
          tamCanh: Math.min(maxStat, Math.max(1, player.tamCanh + (eff.tamCanh || 0))),
          khiHuyet: Math.max(1, (player.khiHuyet || 100) + (eff.khiHuyet || 0)),
          linhLuc: Math.max(0, (player.linhLuc || 100) + (eff.linhLuc || 0)),
          tinhHuyetYeuThu: Math.max(0, (player.tinhHuyetYeuThu || 0) + (eff.tinhHuyet || 0))
        };
      }

      setEventOutcome(outcomeResult);

      let rewardProcess = rewardResultFromApi;
      if (!rewardProcess) {
        rewardProcess = applySecretRealmRewardToPlayer(
          { ...player, ...(updatedPlayerStats || {}) },
          outcomeResult
        );
      }

      if (rewardProcess?.isFull) {
        showToast('Túi trữ vật đã đầy, không thể chứa thêm bảo vật!');
        addLog('Túi Trữ Vật Đầy', 'Túi trữ vật đã đầy, không thể chứa thêm bảo vật!', 'danger');
      } else if (rewardProcess?.added && (rewardProcess?.rewardItem || rewardProcess?.item)) {
        const itemObj = rewardProcess.rewardItem || rewardProcess.item;
        const qty = rewardProcess.quantity || itemObj.quantity || 1;
        showToast(`Bí Cảnh Kỳ Duyên: Nhận được [${itemObj.name}] x${qty}!`);
        addLog(
          'Thu Thập Bảo Vật Kỳ Duyên',
          `Cơ duyên xui khiến, ngươi thu thập thành công bảo vật [${itemObj.name}] x${qty} vào Túi Trữ Vật!`,
          'inventory'
        );
      }

      setPlayer(prev => {
        const baseInv = (rewardProcess?.added && rewardProcess?.player?.inventory)
          ? rewardProcess.player.inventory
          : (updatedPlayerStats?.inventory || prev.inventory);

        const normalized = normalizePlayerData({
          ...prev,
          ...(updatedPlayerStats || {}),
          inventory: baseInv
        });

        // Xác suất nhặt được dược thảo quý trong bí cảnh
        if (Math.random() < 0.65) {
          const herbDrop = DEFAULT_HERBS[Math.floor(Math.random() * DEFAULT_HERBS.length)];
          const maxCap = getMaxInventoryCapacity(normalized);
          const resAdd = addItemToInventory(normalized.inventory, maxCap, 'herb', herbDrop, 1);
          if (resAdd.success) {
            normalized.inventory = resAdd.inventory;
            addLog('Hái Dược Bí Cảnh', `Trong lúc tìm tòi bí cảnh, tình cờ đào được 1 cây [${herbDrop.name}] ngàn năm!`, 'alchemy');
          } else {
            showToast('Túi trữ vật đã đầy, không thể chứa thêm bảo vật!');
          }
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      });

      const eff = outcomeResult.effects || {};
      const effDetails = [
        eff.tuVi ? `${eff.tuVi > 0 ? '+' : ''}${eff.tuVi.toLocaleString()} Tu vi` : null,
        eff.linhThach ? `• Thu hoạch: ${eff.linhThach.toLocaleString()} Hạ Phẩm Linh Thạch (Đã cất vào Túi Trữ Vật)` : null,
        eff.canCot ? `${eff.canCot > 0 ? '+' : ''}${eff.canCot} Căn cốt` : null,
        eff.ngoTinh ? `${eff.ngoTinh > 0 ? '+' : ''}${eff.ngoTinh} Ngộ tính` : null,
        eff.khiVan ? `${eff.khiVan > 0 ? '+' : ''}${eff.khiVan} Khí vận` : null,
        eff.tamCanh ? `${eff.tamCanh > 0 ? '+' : ''}${eff.tamCanh} Tâm cảnh` : null,
        eff.khiHuyet ? `${eff.khiHuyet > 0 ? '+' : ''}${eff.khiHuyet} HP` : null,
        eff.linhLuc ? `${eff.linhLuc > 0 ? '+' : ''}${eff.linhLuc} MP` : null,
        eff.tinhHuyet ? `+${eff.tinhHuyet} Tinh Huyết` : null,
        eff.companionAffinity ? `+${eff.companionAffinity} Hảo Cảm Tiên Tử` : null,
        eff.specialReward ? `Bảo vật: [${eff.specialReward}]` : null
      ].filter(Boolean).join(', ');

      const isDanger = Boolean((eff.khiHuyet && eff.khiHuyet < 0) || (eff.tuVi && eff.tuVi < 0) || (eff.tamCanh && eff.tamCanh < 0));
      const isGreatOpportunity = Boolean(eff.specialReward || (eff.tuVi && eff.tuVi >= 20000) || (eff.tinhHuyet && eff.tinhHuyet >= 3));
      const logType = isDanger ? 'danger' : isGreatOpportunity ? 'breakthrough' : eff.companionId ? 'companion' : 'event';

      addLog(
        `Cơ Duyên Kết Quả: [${activeEvent.name}]`,
        `Lựa chọn: "${choice.text}"\n${outcomeResult.flavor || outcomeResult.description}\n${effDetails ? `Biến chuyển: ${effDetails}` : ''}`,
        logType
      );

    } catch (err) {
      showToast('Lỗi gửi quyết định cơ duyên!');
    } finally {
      setIsResolvingEvent(false);
    }
  };

  return {
    cultivateDuration,
    setCultivateDuration,
    cultivateStance,
    setCultivateStance,
    cultivateSummary,
    setCultivateSummary,
    isCultivating,
    isBreakingThrough,
    screenShake,
    tammaAlert,
    thienkiepAlert,
    isBattling,
    activeEvent,
    setActiveEvent,
    eventOutcome,
    setEventOutcome,
    isResolvingEvent,
    handleCultivate,
    handleDeepCultivate,
    handleBreakthrough,
    handleBattleBoss,
    handleExploreRandomEvent,
    fetchRandomEvent,
    handleSelectEventChoice
  };
}
