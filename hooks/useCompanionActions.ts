import { useState } from 'react';
import {
  PlayerStats,
  CompanionDefinition,
  CompanionPlayerState,
  LogType,
  DualCultivationEvent,
  CompanionWithState
} from '@/lib/types';
import {
  evaluateDualCultivationEvent,
  resolveEventChoice
} from '@/lib/dual-cultivation-event-logic';
import {
  COMPANIONS_DATA,
  COMPANIONS_MAP,
  createDefaultCompanionsState,
  createDefaultCompanionPlayerState,
  getChatCooldownMs,
  getCompanionDialogue,
  calculateGiftAffinity,
  BOND_COST_LINH_THACH,
  SONG_TU_COOLDOWN_MS,
  calculateSongTuTuViGain,
  TAM_TINH_DURATION_MS,
  TAM_THAN_DURATION_MS,
  getBondedCompanionBuffs,
  getCompanionSongTuFlavor,
  DualCultivationType
} from '@/lib/companions-data';

import { PILL_TEMPLATES } from '@/lib/alchemy-data';
import { addItemToInventory, getMaxInventoryCapacity } from '@/lib/inventory-data';
import { createDefaultLinhDien } from '@/lib/garden-data';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';

interface UseCompanionActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export function useCompanionActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UseCompanionActionsParams) {
  const [selectedCompanionId, setSelectedCompanionId] = useState<string | null>(null);
  const [showGiftModal, setShowGiftModal] = useState<boolean>(false);
  const [giftingCompanion, setGiftingCompanion] = useState<CompanionDefinition | null>(null);
  const [giftFilter, setGiftFilter] = useState<'all' | 'pill' | 'herb' | 'ore' | 'equipment' | 'manual'>('all');
  const [activeDualEvent, setActiveDualEvent] = useState<{
    event: DualCultivationEvent;
    partner: CompanionWithState;
    songTuType: DualCultivationType;
  } | null>(null);
  const [isResolvingDualEvent, setIsResolvingDualEvent] = useState<boolean>(false);

  // 1. Tương ngộ / Tầm Duyên với Tiên Tử
  const handleEncounterCompanion = (comp: CompanionDefinition) => {
    const cost = 5000;
    if (player.linhThach < cost) {
      showToast(`Không đủ Linh Thạch bôn ba du lịch! Cần ${cost.toLocaleString()} Linh Thạch.`);
      return;
    }
    const currentCompanions = { ...(player.companionsState?.companions || {}) };
    const curCompState = currentCompanions[comp.id] || createDefaultCompanionPlayerState(comp.id);
    if (curCompState.isMet) {
      showToast(`Ngươi và ${comp.name} đã sớm quen biết nhau.`);
      return;
    }

    const updatedCompState: CompanionPlayerState = {
      ...curCompState,
      isMet: true,
      affinity: 20 // Hảo cảm ban đầu khi tương ngộ
    };
    currentCompanions[comp.id] = updatedCompState;

    const updatedPlayer: PlayerStats = normalizePlayerData({
      ...player,
      linhThach: player.linhThach - cost,
      companionsState: {
        ...(player.companionsState || createDefaultCompanionsState()),
        companions: currentCompanions
      }
    });

    setPlayer(updatedPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));
    showToast(`🌸 Kỳ duyên gặp gỡ! Đã tương ngộ [${comp.name} - ${comp.title}]! Hảo cảm ban đầu +20!`);
    addLog('Tiên Duyên Kỳ Ngộ', `${comp.meetStory}\n${comp.name} khẽ nhìn ngươi mỉm cười:\n"${comp.dialogues.so_thuc[0]}"`, 'companion');
  };

  // Du lịch tầm duyên cùng đạo lữ
  const handleTravelCompanion = () => {
    const curCompState = player.companionsState || createDefaultCompanionsState();
    const unmet = COMPANIONS_DATA.filter(c => !curCompState.companions[c.id]?.isMet);
    if (unmet.length > 0) {
      handleEncounterCompanion(unmet[0]);
    } else {
      if (player.linhThach < 5000) {
        showToast('Cần 5,000 Linh Thạch để du ngoạn tầm duyên!');
        return;
      }
      const curTarget = COMPANIONS_DATA.find(c => (curCompState.companions[c.id]?.affinity || 0) < 100);
      if (curTarget) {
        const cur = curCompState.companions[curTarget.id] || createDefaultCompanionPlayerState(curTarget.id);
        const updatedComps = { ...curCompState.companions };
        updatedComps[curTarget.id] = {
          ...cur,
          affinity: Math.min(100, cur.affinity + 10)
        };
        const updatedP = normalizePlayerData({
          ...player,
          linhThach: player.linhThach - 5000,
          companionsState: { ...curCompState, companions: updatedComps }
        });
        setPlayer(updatedP);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedP));
        showToast(`Du lịch sơn hà cùng ${curTarget.name}! Hảo cảm +10!`);
        addLog('Du Lịch Bốn Phương', `Cùng [${curTarget.name}] ngao du sơn thủy, hảo cảm tăng +10!`, 'companion');
      } else {
        showToast('Toàn bộ Tiên Tử đã đạt 100 Hảo Cảm viên mãn!');
      }
    }
  };

  // 2. Đàm Đạo cùng Tiên Tử
  const handleChatCompanion = (comp: CompanionDefinition) => {
    const currentCompanions = { ...(player.companionsState?.companions || {}) };
    const curCompState = currentCompanions[comp.id] || createDefaultCompanionPlayerState(comp.id);
    const now = Date.now();
    const hasHuongTui = !!player.huongTuiTinhNong ||
      (player.inventory?.equipments || []).some(e => e.name?.includes('Hương Túi Tình Nồng'));
    const baseChatCd = getChatCooldownMs(curCompState.affinity || 0);
    const chatCd = hasHuongTui ? Math.floor(baseChatCd * 0.5) : baseChatCd;

    if (curCompState.lastChatTime && now - curCompState.lastChatTime < chatCd) {
      const remainMinutes = Math.ceil((chatCd - (now - curCompState.lastChatTime)) / 60000);
      showToast(`${comp.name} đang tĩnh tọa nhập định, hãy quay lại sau ${remainMinutes} phút nữa.`);
      return;
    }

    const dialogue = getCompanionDialogue(comp, curCompState.affinity, player.currentRealm);
    const hasDongTamKet = !!player.dongTamKet ||
      (player.inventory?.equipments || []).some(e => e.name?.includes('Đồng Tâm Kết')) ||
      (player.inventory?.herbs || []).some(h => h.name?.includes('Đồng Tâm Kết'));
    const multiplier = hasDongTamKet ? 2 : 1;
    const baseGain = Math.floor(Math.random() * 5) + 6; // 6 đến 10 điểm
    const gainAff = baseGain * multiplier;
    const newAff = Math.min(100, (curCompState.affinity || 0) + gainAff);

    const updatedCompState: CompanionPlayerState = {
      ...curCompState,
      isMet: true,
      affinity: newAff,
      lastChatTime: now
    };
    currentCompanions[comp.id] = updatedCompState;

    const updatedPlayer = normalizePlayerData({
      ...player,
      companionsState: {
        ...(player.companionsState || createDefaultCompanionsState()),
        companions: currentCompanions
      }
    });

    setPlayer(updatedPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));
    showToast(`Cùng ${comp.name} đàm đạo tâm đầu ý hợp! Hảo cảm +${gainAff}${hasDongTamKet ? ' (Đồng Tâm Kết gia trì x2!)' : ''} (Hiện tại: ${newAff}/100)`);
    addLog('Đàm Đạo Luận Đạo', `Cùng [${comp.name}] ngồi dưới trăng đối ẩm${hasDongTamKet ? ' (Đồng Tâm Kết x2 Hảo Cảm)' : ''}. Nàng dịu dàng nói:\n"${dialogue}"\n(Hảo cảm tăng +${gainAff})`, 'companion');
  };

  // 3. Mở Modal Tặng Quà
  const handleOpenGiftModal = (comp: CompanionDefinition) => {
    setGiftingCompanion(comp);
    setGiftFilter('all');
    setShowGiftModal(true);
  };

  // 4. Tặng Quà từ Túi Trữ Vật
  const handleSendGift = (itemType: 'pill' | 'herb' | 'ore' | 'equipment' | 'manual', item: any, count: number = 1) => {
    if (!giftingCompanion) return;
    const comp = giftingCompanion;
    const currentInv = {
      pills: [...(player.inventory?.pills || [])],
      herbs: [...(player.inventory?.herbs || [])],
      ores: [...(player.inventory?.ores || [])],
      equipments: [...(player.inventory?.equipments || [])],
      manuals: [...(player.inventory?.manuals || [])],
      books: [...(player.inventory?.books || [])],
      bags: [...(player.inventory?.bags || [])]
    };
    const currentCompanions = { ...(player.companionsState?.companions || {}) };
    const curCompState = currentCompanions[comp.id] || createDefaultCompanionPlayerState(comp.id);

    let availableCount = 0;
    if (itemType === 'pill') {
      const found = currentInv.pills.find(p => p.id === item.id);
      availableCount = found?.quantity || 0;
      if (availableCount < count) {
        showToast(`Không đủ số lượng ${item.name}!`);
        return;
      }
      found!.quantity -= count;
      currentInv.pills = currentInv.pills.filter(p => p.quantity > 0);
    } else if (itemType === 'herb') {
      const found = currentInv.herbs.find(h => h.id === item.id);
      availableCount = found?.quantity || 0;
      if (availableCount < count) {
        showToast(`Không đủ số lượng ${item.name}!`);
        return;
      }
      found!.quantity -= count;
      currentInv.herbs = currentInv.herbs.filter(h => h.quantity > 0);
    } else if (itemType === 'ore') {
      const found = currentInv.ores.find(o => o.id === item.id);
      availableCount = found?.quantity || 0;
      if (availableCount < count) {
        showToast(`Không đủ số lượng ${item.name}!`);
        return;
      }
      found!.quantity -= count;
      currentInv.ores = currentInv.ores.filter(o => o.quantity > 0);
    } else if (itemType === 'equipment') {
      const index = currentInv.equipments.findIndex(e => e.id === item.id);
      if (index === -1) {
        showToast(`Không tìm thấy pháp bảo trong túi!`);
        return;
      }
      currentInv.equipments.splice(index, 1);
    } else if (itemType === 'manual') {
      const index = currentInv.manuals.findIndex(m => m.id === item.id);
      if (index === -1) {
        showToast(`Không tìm thấy bí kíp trong túi!`);
        return;
      }
      currentInv.manuals.splice(index, 1);
    }

    const giftAff = calculateGiftAffinity(comp, itemType, item.grade, item.name);
    const totalGain = giftAff.finalPoints * count;
    const newAff = Math.min(100, (curCompState.affinity || 0) + totalGain);

    const updatedCompState: CompanionPlayerState = {
      ...curCompState,
      isMet: true,
      affinity: newAff
    };
    currentCompanions[comp.id] = updatedCompState;

    const updatedPlayer = normalizePlayerData({
      ...player,
      inventory: currentInv,
      companionsState: {
        ...(player.companionsState || createDefaultCompanionsState()),
        companions: currentCompanions
      }
    });

    setPlayer(updatedPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));
    showToast(giftAff.message);
    addLog('Tặng Quà Đạo Lữ', `Ngươi tặng ${count}x [${item.name}] cho [${comp.name}]. ${giftAff.isFavorite ? 'Nàng mỉm cười nhận lấy với ánh mắt tràn ngập nhu tình!' : 'Nàng cảm kích nhận lấy món quà.'} (Hảo cảm +${totalGain})`, 'companion');
  };

  // 5. Kết Duyên Tiên Lữ
  const handleBondCompanion = (comp: CompanionDefinition) => {
    const currentCompanions = { ...(player.companionsState?.companions || {}) };
    const curCompState = currentCompanions[comp.id] || createDefaultCompanionPlayerState(comp.id);

    if (curCompState.affinity < 100) {
      showToast(`Hảo cảm chưa đạt 100 (Tình Đầu Ý Hợp)! Hiện tại: ${curCompState.affinity}/100.`);
      return;
    }
    if (curCompState.isBonded) {
      showToast(`Ngươi và ${comp.name} đã kết làm Đạo Lữ Tiên Lữ rồi!`);
      return;
    }
    if (player.linhThach < BOND_COST_LINH_THACH) {
      showToast(`Không đủ ${BOND_COST_LINH_THACH.toLocaleString()} Linh Thạch để lập Lời Thề Thiên Địa kết duyên!`);
      return;
    }

    const updatedCompState: CompanionPlayerState = {
      ...curCompState,
      isBonded: true,
      bondedAt: Date.now()
    };
    currentCompanions[comp.id] = updatedCompState;

    const updatedPlayer = normalizePlayerData({
      ...player,
      linhThach: player.linhThach - BOND_COST_LINH_THACH,
      companionsState: {
        ...(player.companionsState || createDefaultCompanionsState()),
        activeCompanionId: comp.id,
        companions: currentCompanions
      }
    });

    setPlayer(updatedPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));
    showToast(`🎉 Thiên địa chứng giám! Ngươi và [${comp.name}] đã chính thức Kết Duyên Tiên Lữ! Kích hoạt toàn bộ Buff Bị Động!`);
    addLog('Kết Duyên Tiên Lữ', `🌹 Dưới sự chứng giám của Thiên Địa Nhật Nguyệt, ngươi và ${comp.name} (${comp.title}) trao nhau tín vật định tình, lập thề ước trường sinh cửu tử bất hối!\nKích hoạt Buff Bị Động Độc Quyền!`, 'companion');
  };

  // 6. Song Tu Thổ Nạp Nâng Cao
  const handleSongTu = (comp: CompanionDefinition, type: DualCultivationType = 'tu_vi') => {
    const currentCompanions = { ...(player.companionsState?.companions || {}) };
    const curCompState = currentCompanions[comp.id] || createDefaultCompanionPlayerState(comp.id);

    if (!curCompState.isBonded) {
      showToast(`Ngươi và ${comp.name} chưa Kết Duyên Tiên Lữ! Hãy đạt 100 Hảo Cảm để cử hành Đại Điển.`);
      return;
    }

    // 0. Chặn Đạo Lữ đang tham gia Hộ Pháp Nhập Định
    if (curCompState.isAssignedToMeditation) {
      showToast(`[${comp.name}] đang tham gia Hộ Pháp Nhập Định cùng bạn, không thể phân tâm Song Tu!`);
      return;
    }

    const now = Date.now();
    // 1. Kiểm tra trạng thái kiệt sức / nghỉ ngơi của Đạo Lữ (Fatigue Guard)
    if (curCompState.fatigueUntil && curCompState.fatigueUntil > now) {
      const remainMinutes = Math.max(1, Math.ceil((curCompState.fatigueUntil - now) / 60000));
      showToast(`[${comp.name}] nguyên khí tiêu hao sau khi Hộ Pháp Trừ Ma, đang bế quan tĩnh dưỡng! Cần nghỉ ngơi ${remainMinutes} phút.`);
      return;
    }

    if (curCompState.lastSongTuTime && now - curCompState.lastSongTuTime < SONG_TU_COOLDOWN_MS) {
      const remainHours = Math.ceil((SONG_TU_COOLDOWN_MS - (now - curCompState.lastSongTuTime)) / (60 * 60 * 1000));
      showToast(`Hồi khí chưa đủ! Cần nghỉ ngơi ${remainHours} giờ nữa mới có thể tiếp tục Song Tu.`);
      return;
    }

    // 2. Thẩm định biến cố ngẫu nhiên khi Song Tu (Dual Cultivation Dynamic Events)
    const partnerForEvaluation: CompanionWithState = {
      ...comp,
      ...curCompState,
      affinity: curCompState.affinity || 0,
      tier: comp.tier || comp.shopTier || (comp.id.includes('t9_') ? 9 : (comp.realmIndex >= 36 ? 9 : 1))
    };

    const triggeredEvent = evaluateDualCultivationEvent(player, partnerForEvaluation);
    if (triggeredEvent) {
      setActiveDualEvent({
        event: triggeredEvent,
        partner: partnerForEvaluation,
        songTuType: type
      });
      return;
    }

    if (type === 'luyen_the') {
      const availableBlood = (player.tinhHuyet || 0) + (player.tinhHuyetYeuThu || 0);
      const currentHp = player.khiHuyet || 1000;
      if (availableBlood < 5 && currentHp < 200) {
        showToast(`Khí huyết suy kiệt! Cần tối thiểu 5 Tinh Huyết hoặc Khí Huyết sung mãn để Luyện Thể.`);
        return;
      }
    }

    const tuViGain = calculateSongTuTuViGain(player.currentRealm, comp.realmIndex);
    const tamTinhUntil = now + TAM_TINH_DURATION_MS;
    const tamThanUntil = now + TAM_THAN_DURATION_MS;

    const updatedCompState: CompanionPlayerState = {
      ...curCompState,
      lastSongTuTime: now,
      totalSongTuCount: (curCompState.totalSongTuCount || 0) + 1,
      lastSongTuType: type
    };
    currentCompanions[comp.id] = updatedCompState;

    let extraLog = '';
    let updatedInv = {
      pills: [...(player.inventory?.pills || [])],
      herbs: [...(player.inventory?.herbs || [])],
      ores: [...(player.inventory?.ores || [])],
      equipments: [...(player.inventory?.equipments || [])],
      manuals: [...(player.inventory?.manuals || [])],
      books: [...(player.inventory?.books || [])],
      bags: [...(player.inventory?.bags || [])]
    };
    const compBuffs = getBondedCompanionBuffs({ ...player, companionsState: { companions: currentCompanions } });

    if (compBuffs.dailyRandomPill) {
      const giftPillKeys = ['pill_cai_menh', 'pill_khi_huyet', 'pill_tay_linh', 'pill_cuong_bao', 'pill_hoi_thien'];
      const picked = giftPillKeys[Math.floor(Math.random() * giftPillKeys.length)];
      const pillDef = PILL_TEMPLATES[picked];
      if (pillDef) {
        const maxCap = getMaxInventoryCapacity(player);
        const addRes = addItemToInventory(updatedInv, maxCap, 'pill', pillDef, 1);
        if (addRes.success) {
          updatedInv = addRes.inventory;
          extraLog = `\n🌿 [Thanh Mộc Y Tiên] Diệp Chỉ Hàm dịu dàng tặng chàng 1 viên [${pillDef.name}] bồi bổ khí tức!`;
        }
      }
    }

    const poem = getCompanionSongTuFlavor(comp);
    let resultMessage = '';
    let logSummary = '';
    let updatedKhiHuyet = player.khiHuyet;
    let updatedLinhLuc = player.linhLuc;
    let updatedTinhHuyet = player.tinhHuyet || 0;
    let updatedTuVi = player.tuVi;
    let newTamThanUntil = player.companionsState?.tamThanHopNhatUntil || 0;

    let updatedBody = player.bodyRefinement
      ? { ...player.bodyRefinement }
      : { realmIndex: 0, level: 1, currentExp: 0, maxExp: 100 };

    if (type === 'linh_luc') {
      updatedKhiHuyet = player.maxKhiHuyet;
      updatedLinhLuc = player.maxLinhLuc;
      resultMessage = `💧 [Linh Lực Quán Thông] Cùng ${comp.name} hợp thể vận công, hồi phục 100% Khí Huyết & Chân Nguyên!`;
      logSummary = `Ngươi cùng [${comp.name}] vận chuyển linh tuyền quán thông, tức thì hồi phục trọn vẹn 100% Khí Huyết & Chân Nguyên.`;
    } else if (type === 'tam_than') {
      newTamThanUntil = tamThanUntil;
      resultMessage = `🔮 [Tâm Thần Hợp Nhất] Cùng ${comp.name} nhập định Thái Hư, tăng 20% tốc độ tu luyện bế quan trong 12 giờ!`;
      logSummary = `Ngươi cùng [${comp.name}] tâm thần tương hợp, nhận hiệu ứng tăng +20% Tốc Độ Tu Luyện bế quan trong 12 giờ kế tiếp.`;
    } else if (type === 'luyen_the') {
      if (updatedTinhHuyet >= 5) {
        updatedTinhHuyet -= 5;
      } else {
        const hpSacrifice = Math.floor((player.khiHuyet || 1000) * 0.1);
        updatedKhiHuyet = Math.max(1, (player.khiHuyet || 1000) - hpSacrifice);
      }
      updatedBody.currentExp = (updatedBody.currentExp || 0) + 1500;
      resultMessage = `🔥 [Luyện Thể Song Tu] Cùng ${comp.name} dẫn động huyết khí tôi thể (+1,500 Điểm Tôi Thể Exp, tiêu hao Tinh Huyết)!`;
      logSummary = `Ngươi cùng [${comp.name}] tôi luyện huyết khí chân nguyên, nhục thân lột xác (+1,500 Điểm Tôi Thể Exp).`;
    } else {
      const hasUyenUong = !!player.uyenUongSongBoi ||
        (player.inventory?.equipments || []).some(e => e.name?.includes('Uyên Ương Song Bội'));
      const finalTuViGain = hasUyenUong ? Math.round(tuViGain * 1.3) : tuViGain;
      updatedTuVi += finalTuViGain;
      resultMessage = `✨ Song Tu Thổ Nạp cùng ${comp.name} viên mãn! Nhận +${finalTuViGain.toLocaleString()} Tu Vi${hasUyenUong ? ' (Uyên Ương Song Bội +30%!)' : ''} & Buff [Tâm Tịnh Thần Diệu] 24 giờ!`;
      logSummary = `Thu được +${finalTuViGain.toLocaleString()} Tu Vi${hasUyenUong ? ' (Uyên Ương Song Bội +30%)' : ''}, Tâm Tịnh Thần Diệu kéo dài 24 giờ - Giảm 50% nguy cơ Tâm Ma & sát thương phản phệ.`;
    }

    const updatedPlayer = normalizePlayerData({
      ...player,
      tuVi: updatedTuVi,
      khiHuyet: updatedKhiHuyet,
      linhLuc: updatedLinhLuc,
      tinhHuyet: updatedTinhHuyet,
      bodyRefinement: updatedBody,
      inventory: updatedInv,
      activeBuffs: {
        ...(player.activeBuffs || {}),
        tamTinhThanDieu: true,
        tamTinhThanDieuUntil: tamTinhUntil
      },
      companionsState: {
        ...(player.companionsState || createDefaultCompanionsState()),
        companions: currentCompanions,
        tamTinhThanDieuUntil: tamTinhUntil,
        tamThanHopNhatUntil: newTamThanUntil
      },
      achievementsState: {
        ...player.achievementsState,
        claimedAchievementIds: player.achievementsState?.claimedAchievementIds || [],
        unlockedTitleIds: player.achievementsState?.unlockedTitleIds || [],
        stats: {
          ...player.achievementsState?.stats,
          dualCultivations: (player.achievementsState?.stats?.dualCultivations || 0) + 1
        }
      }
    });

    setPlayer(updatedPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));
    showToast(resultMessage);
    addLog('Song Tu Thổ Nạp', `Ngươi cùng [${comp.name}] bế quan song tu, âm dương giao hòa.\n"${poem}"\n(${logSummary})${extraLog}`, 'companion');
  };

  // Xử lý lựa chọn trong Biến Cố Song Tu
  const handleChooseDualEventOption = (choiceId: string) => {
    if (!activeDualEvent || isResolvingDualEvent) return;

    setIsResolvingDualEvent(true);
    const { event, partner, songTuType } = activeDualEvent;

    const res = resolveEventChoice(player, partner, event, choiceId);
    if (!res.success) {
      showToast(res.resultLog);
      setIsResolvingDualEvent(false);
      return;
    }

    const now = Date.now();
    const currentCompanions = { ...(res.updatedPlayer.companionsState?.companions || {}) };
    const curCompState = currentCompanions[partner.id] || { id: partner.id, affinity: partner.affinity || 0, isBonded: true };

    currentCompanions[partner.id] = {
      ...curCompState,
      affinity: res.updatedPartner.affinity ?? curCompState.affinity,
      lastSongTuTime: now,
      totalSongTuCount: (curCompState.totalSongTuCount || 0) + 1,
      lastSongTuType: songTuType,
      fatigueUntil: res.updatedPartner.fatigueUntil ?? (curCompState.fatigueUntil || 0),
      totalEpiphanies: res.updatedPartner.totalEpiphanies ?? (curCompState.totalEpiphanies || 0)
    };

    const finalPlayer = normalizePlayerData({
      ...res.updatedPlayer,
      companionsState: {
        ...(res.updatedPlayer.companionsState || createDefaultCompanionsState()),
        companions: currentCompanions
      },
      achievementsState: {
        ...res.updatedPlayer.achievementsState,
        claimedAchievementIds: res.updatedPlayer.achievementsState?.claimedAchievementIds || [],
        unlockedTitleIds: res.updatedPlayer.achievementsState?.unlockedTitleIds || [],
        stats: {
          ...res.updatedPlayer.achievementsState?.stats,
          dualCultivations: (res.updatedPlayer.achievementsState?.stats?.dualCultivations || 0) + 1
        }
      }
    });

    setPlayer(finalPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalPlayer));
    showToast(res.resultLog);
    addLog(
      'Biến Cố Song Tu',
      `[${partner.name}] - ${event.title}\n${res.resultLog}`,
      'companion'
    );
    setIsResolvingDualEvent(false);
    setActiveDualEvent(null);
  };

  const handleCloseDualEventModal = () => {
    setActiveDualEvent(null);
  };

  // 7. Chọn Đạo Lữ đồng hành chính
  const handleSetActiveCompanion = (compId: string) => {
    const curCompState = player.companionsState?.companions?.[compId];
    if (!curCompState || !curCompState.isBonded) {
      showToast('Chỉ có thể chọn Tiên Lữ đã chính thức Kết Duyên để cùng sánh bước trợ chiến!');
      return;
    }

    const updatedPlayer = normalizePlayerData({
      ...player,
      companionsState: {
        ...(player.companionsState || createDefaultCompanionsState()),
        activeCompanionId: compId
      }
    });
    setPlayer(updatedPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));
    const comp = COMPANIONS_MAP[compId];
    showToast(`Đã chọn [${comp?.name || 'Đạo Lữ'}] cùng sánh bước du lịch tam giới!`);
  };

  // 8. Hoàn thành Nhiệm Vụ Tâm Nguyện Tiên Tử (Mốc 60)
  const handleCompleteQuest = (comp: CompanionDefinition) => {
    const currentCompanions = { ...(player.companionsState?.companions || {}) };
    const curCompState = currentCompanions[comp.id] || createDefaultCompanionPlayerState(comp.id);

    if (curCompState.questCompleted) {
      showToast(`Đã hoàn thành tâm nguyện của ${comp.name} và nhận tín vật định tình rồi!`);
      return;
    }

    const q = comp.storyQuest;
    let inv = {
      pills: [...(player.inventory?.pills || [])],
      herbs: [...(player.inventory?.herbs || [])],
      ores: [...(player.inventory?.ores || [])],
      equipments: [...(player.inventory?.equipments || [])],
      manuals: [...(player.inventory?.manuals || [])],
      books: [...(player.inventory?.books || [])],
      bags: [...(player.inventory?.bags || [])]
    };

    let itemDeducted = false;
    let deductedItemName = '';

    if (q.targetItemType === 'herb') {
      if (inv.herbs.length === 0) {
        showToast(`Cần có ít nhất 1 gốc Dược Liệu trong Túi Trữ Vật để trao cho ${comp.name}!`);
        return;
      }
      const targetHerb = inv.herbs[0];
      targetHerb.quantity -= 1;
      deductedItemName = targetHerb.name;
      inv.herbs = inv.herbs.filter(h => h.quantity > 0);
      itemDeducted = true;
    } else if (q.targetItemType === 'ore') {
      if (inv.ores.length === 0) {
        showToast(`Cần có ít nhất 1 khối Khoáng Thạch trong Túi Trữ Vật để trao cho ${comp.name}!`);
        return;
      }
      const targetOre = inv.ores[0];
      targetOre.quantity -= 1;
      deductedItemName = targetOre.name;
      inv.ores = inv.ores.filter(o => o.quantity > 0);
      itemDeducted = true;
    } else if (q.targetItemType === 'manual') {
      if (inv.manuals.length === 0) {
        showToast(`Cần có ít nhất 1 cuốn Bí Kíp / Tàn Quyển trong Túi Trữ Vật để trao cho ${comp.name}!`);
        return;
      }
      const targetManual = inv.manuals.splice(0, 1)[0];
      deductedItemName = targetManual.name;
      itemDeducted = true;
    } else {
      if (inv.pills.length === 0) {
        showToast(`Cần có ít nhất 1 viên Đan Dược trong Túi Trữ Vật để trao cho ${comp.name}!`);
        return;
      }
      const targetPill = inv.pills[0];
      targetPill.quantity -= 1;
      deductedItemName = targetPill.name;
      inv.pills = inv.pills.filter(p => p.quantity > 0);
      itemDeducted = true;
    }

    if (!itemDeducted) return;

    const newAff = Math.min(100, (curCompState.affinity || 0) + 20);
    const updatedCompState: CompanionPlayerState = {
      ...curCompState,
      questCompleted: true,
      tokenEquipped: true,
      tokenName: q.tokenReward.name,
      tokenDescription: q.tokenReward.description,
      tokenIcon: q.tokenReward.icon,
      affinity: newAff
    };
    currentCompanions[comp.id] = updatedCompState;

    const updatedPlayer = normalizePlayerData({
      ...player,
      inventory: inv,
      companionsState: {
        ...(player.companionsState || createDefaultCompanionsState()),
        companions: currentCompanions
      }
    });

    setPlayer(updatedPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));
    showToast(`🎁 Hoàn thành tâm nguyện của ${comp.name}! Nhận Tín Vật: [${q.tokenReward.name}]! (Hảo cảm +20)`);
    addLog('Tâm Nguyện Tiên Tử Hoàn Thành', `Trao tặng [${deductedItemName}] cho [${comp.name}].\nNàng xúc động đáp: "${q.dialogueOnComplete}"\n(Nhận Tín Vật: [${q.tokenReward.name}] - ${q.tokenReward.description}, Hảo cảm +20)`, 'companion');
  };

  // 9. Bố trí Tiên Tử vào Động Phủ Linh Điền
  const handleStationGarden = (companionId: string | null) => {
    const isRemove = !companionId || player.companionsState?.stationedGardenCompanionId === companionId;
    const newStationedId = isRemove ? null : companionId;

    const currentCompanions = { ...(player.companionsState?.companions || {}) };
    Object.keys(currentCompanions).forEach(k => {
      currentCompanions[k] = {
        ...currentCompanions[k],
        assignedGarden: newStationedId === k
      };
    });

    const updatedPlayer = normalizePlayerData({
      ...player,
      linhDien: {
        ...(player.linhDien || createDefaultLinhDien()),
        stationedCompanionId: newStationedId
      },
      companionsState: {
        ...(player.companionsState || createDefaultCompanionsState()),
        stationedGardenCompanionId: newStationedId,
        companions: currentCompanions
      }
    });

    setPlayer(updatedPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));
    if (newStationedId) {
      const comp = COMPANIONS_MAP[newStationedId];
      showToast(`🌱 Đã bố trí [${comp?.name || 'Tiên Tử'}] vào Động Phủ Linh Điền! (-15% tgian sinh trưởng, +35% thảo dược biến dị)`);
      addLog('Động Phủ Tiên Duyên', `Bố trí [${comp?.name}] trấn thủ Linh Điền, ngày ngày chăm bón tưới tiêu, dược thảo sinh trưởng thần tốc!`, 'companion');
    } else {
      showToast('Đã thu hồi Tiên Tử về Tiên Phủ nghỉ ngơi.');
    }
  };

  return {
    selectedCompanionId,
    setSelectedCompanionId,
    showGiftModal,
    setShowGiftModal,
    giftingCompanion,
    setGiftingCompanion,
    giftFilter,
    setGiftFilter,
    handleEncounterCompanion,
    handleTravelCompanion,
    handleChatCompanion,
    handleOpenGiftModal,
    handleSendGift,
    handleBondCompanion,
    handleSongTu,
    handleSetActiveCompanion,
    handleCompleteQuest,
    handleStationGarden,
    activeDualEvent,
    setActiveDualEvent,
    isResolvingDualEvent,
    handleChooseDualEventOption,
    handleCloseDualEventModal
  };
}

