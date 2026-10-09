// hooks/useOffspringActions.ts
// Custom Domain Hook quản lý toàn bộ nghiệp vụ Song Tu Hóa Duyên & Tiên Đồng Huyết Mạch

import { useState } from 'react';
import type { PlayerStats, LogType } from '@/lib/types';
import type { DualCultivationMethod, ImmortalChild, GestationState, OffspringStage } from '@/lib/types/offspring';
import { COMPANIONS_DATA, COMPANIONS_MAP, createDefaultCompanionPlayerState } from '@/lib/companions-data';
import {
  executeDualCultivation,
  calculateGestationProgress,
  generateProceduralChild,
} from '@/lib/offspring-logic';
import {
  GESTATION_TOTAL_DURATION_MS,
  CONCEPTION_COST_LINH_THACH,
  CONCEPTION_REQUIRED_REALM,
  CONCEPTION_REQUIRED_AFFINITY,
  GESTATION_PILLS,
} from '@/lib/offspring-data';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';

interface UseOffspringActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export function useOffspringActions({
  player,
  setPlayer,
  addLog,
  showToast,
}: UseOffspringActionsParams) {
  const [namingModalChild, setNamingModalChild] = useState<boolean>(false);
  const [customChildName, setCustomChildName] = useState<string>('');

  const offspringState = player.offspringState || {
    gestation: null,
    children: [],
    deployedChildId: null,
    demonicKarma: 0,
    lastSongTuTimestamp: 0,
    activeDualCultivationBuff: null,
  };

  // ─── 1. Hành Động Song Tu Phân Nhánh ───────────────────────────────────────
  const handlePerformDualCultivation = (
    companionId: string,
    method: DualCultivationMethod
  ) => {
    const companion = COMPANIONS_MAP[companionId];
    if (!companion) {
      showToast('Không tìm thấy đạo lữ tương ứng!');
      return;
    }

    const companionsState = player.companionsState || { companions: {} };
    const compPlayerState = companionsState.companions?.[companionId] || createDefaultCompanionPlayerState(companionId);

    // Kiểm tra Cooldown: 4 giờ (14,400,000 ms)
    const SONG_TU_COOLDOWN_MS = 4 * 60 * 60 * 1000;
    const now = Date.now();
    const lastSongTu = compPlayerState.lastSongTuTime || offspringState.lastSongTuTimestamp || 0;
    if (now - lastSongTu < SONG_TU_COOLDOWN_MS) {
      const remainingMs = SONG_TU_COOLDOWN_MS - (now - lastSongTu);
      const remHours = Math.floor(remainingMs / (60 * 60 * 1000));
      const remMinutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
      showToast(`Chân nguyên hai bên chưa hồi phục hoàn toàn! Cần chờ thêm ${remHours}h ${remMinutes}m.`);
      return;
    }

    try {
      const result = executeDualCultivation(player, companion, compPlayerState, method);

      // Cập nhật Hảo cảm đạo lữ (giới hạn 0 - 100)
      const newAffinity = Math.max(0, Math.min(100, (compPlayerState.affinity || 0) + result.affinityDelta));
      const updatedCompanions = {
        ...(companionsState.companions || {}),
        [companionId]: {
          ...compPlayerState,
          affinity: newAffinity,
          lastSongTuTime: now,
          totalSongTuCount: (compPlayerState.totalSongTuCount || 0) + 1,
        },
      };

      // Cập nhật Ma Tính (0 - 100)
      const newKarma = Math.max(0, Math.min(100, offspringState.demonicKarma + result.demonicKarmaDelta));

      // Thiết lập Buff Song Tu
      const buffExpiresAt = now + result.playerBuffDurationHours * 60 * 60 * 1000;
      const activeDualCultivationBuff = {
        method: result.method,
        expiresAt: buffExpiresAt,
        atkBonusPercent: result.atkBonusPercent,
        critRateBonusPercent: result.critRateBonusPercent,
        cultivationRateBonusPercent: result.method === 'chinh_dao' ? 15 : 0,
      };

      // Xử lý hoài thai tự nhiên nếu kích hoạt
      let updatedGestation = offspringState.gestation;
      if (result.conceptionTriggered && !updatedGestation?.isGestationActive) {
        updatedGestation = {
          isGestationActive: true,
          motherCompanionId: companion.id,
          motherName: companion.name,
          startGestationTimestamp: now,
          estimatedBirthTimestamp: now + GESTATION_TOTAL_DURATION_MS,
          durationMs: GESTATION_TOTAL_DURATION_MS,
          nurturingLevel: 1,
          consumedPillIds: ['conception_natural'],
        };
      }

      const updatedPlayer: PlayerStats = normalizePlayerData({
        ...player,
        tuVi: player.tuVi + result.playerTuViGain,
        tamCanh: Math.max(0, player.tamCanh + result.tamCanhDelta),
        companionsState: {
          ...companionsState,
          companions: updatedCompanions,
        },
        offspringState: {
          ...offspringState,
          gestation: updatedGestation,
          demonicKarma: newKarma,
          lastSongTuTimestamp: now,
          activeDualCultivationBuff,
        },
      });

      setPlayer(updatedPlayer);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));

      showToast(result.message);
      addLog(
        result.method === 'chinh_dao' ? 'Chính Đạo Âm Dương Song Tu' : 'Thái Bổ Tà Pháp Song Tu',
        result.message,
        'companion'
      );
    } catch (err: any) {
      showToast(err.message || 'Song Tu thất bại do chưa đủ điều kiện!');
    }
  };

  // ─── 2. Khởi Động Nghi Thức Ngưng Tụ Linh Thai Chủ Động ─────────────────────
  const handleInitiateGestation = (companionId: string, pillId: string = 'pill_linh_thai_tao_hoa') => {
    const companion = COMPANIONS_MAP[companionId];
    if (!companion) {
      showToast('Không tìm thấy đạo lữ!');
      return;
    }

    if (offspringState.gestation?.isGestationActive) {
      showToast('Đạo lữ hiện đang hoài thai Linh Thai! Không thể khởi động nghi thức mới.');
      return;
    }

    const companionsState = player.companionsState || { companions: {} };
    const compPlayerState = companionsState.companions?.[companionId] || createDefaultCompanionPlayerState(companionId);

    // Kiểm tra điều kiện: Hảo cảm 100 + Cả hai >= Nguyên Anh
    if ((compPlayerState.affinity || 0) < CONCEPTION_REQUIRED_AFFINITY) {
      showToast(`Hảo cảm chưa đạt Sinh Tử Bất Ly (${compPlayerState.affinity || 0}/100)! Cần đạt 100 Hảo Cảm.`);
      return;
    }

    if (player.currentRealm < CONCEPTION_REQUIRED_REALM) {
      showToast('Tu vi của ngươi chưa đạt Nguyên Anh Kỳ (Cảnh giới 21+)!');
      return;
    }

    if (companion.realmIndex < CONCEPTION_REQUIRED_REALM) {
      showToast(`${companion.name} chưa đạt Nguyên Anh Kỳ!`);
      return;
    }

    // Chi phí: 50,000 Linh Thạch
    if (player.linhThach < CONCEPTION_COST_LINH_THACH) {
      showToast(`Không đủ Linh Thạch! Cần ${CONCEPTION_COST_LINH_THACH.toLocaleString()} Linh Thạch cho nghi thức Tạo Hóa.`);
      return;
    }

    const now = Date.now();
    const newGestation: GestationState = {
      isGestationActive: true,
      motherCompanionId: companion.id,
      motherName: companion.name,
      startGestationTimestamp: now,
      estimatedBirthTimestamp: now + GESTATION_TOTAL_DURATION_MS,
      durationMs: GESTATION_TOTAL_DURATION_MS,
      nurturingLevel: 1,
      consumedPillIds: [pillId],
    };

    const updatedPlayer: PlayerStats = normalizePlayerData({
      ...player,
      linhThach: player.linhThach - CONCEPTION_COST_LINH_THACH,
      offspringState: {
        ...offspringState,
        gestation: newGestation,
      },
    });

    setPlayer(updatedPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));

    showToast(`🌟 [NGƯNG TỤ LINH THAI] Tiêu hao 50,000 Linh Thạch cử hành Nghi thức Tạo Hóa cùng ${companion.name}! Thai nghén linh thai thần thánh bắt đầu.`);
    addLog(
      'Ngưng Tụ Linh Thai Thành Công',
      `Ngươi và ${companion.name} tiêu hao Linh Thai Tạo Hóa Đan và 50,000 Linh Thạch, dẫn thiên địa linh khí nhập thể, đan điền kết tinh một quả Linh Thai rực rỡ! Thời gian hoài thai quy chuẩn là 48 giờ.`,
      'companion'
    );
  };

  // ─── 3. Ban Đan Dưỡng Thai (Nurture Gestation) ──────────────────────────────
  const handleNurtureGestation = (pillId: string) => {
    const gestation = offspringState.gestation;
    if (!gestation || !gestation.isGestationActive) {
      showToast('Hiện không có Linh Thai nào đang hoài thai!');
      return;
    }

    const pillConfig = GESTATION_PILLS[pillId];
    if (!pillConfig) {
      showToast('Đan dược không hợp lệ!');
      return;
    }

    if (player.linhThach < pillConfig.price) {
      showToast(`Không đủ Linh Thạch bồi bổ! Cần ${pillConfig.price.toLocaleString()} Linh Thạch.`);
      return;
    }

    // Giảm thời gian hoài thai nếu có
    let newEstimated = gestation.estimatedBirthTimestamp;
    if (pillConfig.progressReductionHours) {
      const reductionMs = pillConfig.progressReductionHours * 60 * 60 * 1000;
      newEstimated = Math.max(Date.now(), newEstimated - reductionMs);
    }

    const newNurturingLevel = Math.min(5, (gestation.nurturingLevel || 1) + 1);
    const updatedConsumed = [...(gestation.consumedPillIds || []), pillId];

    const updatedGestation: GestationState = {
      ...gestation,
      estimatedBirthTimestamp: newEstimated,
      nurturingLevel: newNurturingLevel,
      consumedPillIds: updatedConsumed,
    };

    const updatedPlayer: PlayerStats = normalizePlayerData({
      ...player,
      linhThach: player.linhThach - pillConfig.price,
      offspringState: {
        ...offspringState,
        gestation: updatedGestation,
      },
    });

    setPlayer(updatedPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));

    showToast(`🧪 [BAN ĐAN DƯỠNG THAI] Đã ban ${pillConfig.name}! Tăng cấp bồi bổ lên Cấp ${newNurturingLevel}.${pillConfig.progressReductionHours ? ` Rút ngắn ${pillConfig.progressReductionHours} giờ!` : ''}`);
    addLog(
      'Bồi Bổ Linh Thai',
      `Ngươi đã tinh luyện ${pillConfig.name} rót vào Linh Thai. ${pillConfig.description}`,
      'alchemy'
    );
  };

  // ─── 4. Điểm Hóa Khai Thai Sinh Hạ Tiên Đồng ────────────────────────────────
  const handleBirthChild = (customName?: string) => {
    const gestation = offspringState.gestation;
    if (!gestation || !gestation.isGestationActive) {
      showToast('Hiện không có Linh Thai sẵn sàng sinh hạ!');
      return;
    }

    const progress = calculateGestationProgress(gestation, Date.now());
    if (!progress.readyToBirth) {
      showToast(`Linh Thai chưa viên mãn! Còn thiếu thời gian dưỡng thai (${progress.formattedRemaining}).`);
      return;
    }

    const motherComp = COMPANIONS_MAP[gestation.motherCompanionId] || {
      id: gestation.motherCompanionId,
      name: gestation.motherName || 'Đạo Lữ',
      element: 'thuy',
    };

    const newChild = generateProceduralChild(
      player,
      motherComp as any,
      gestation.nurturingLevel || 1,
      gestation.consumedPillIds || [],
      customName
    );

    const updatedChildren = [...(offspringState.children || []), newChild];

    const updatedPlayer: PlayerStats = normalizePlayerData({
      ...player,
      offspringState: {
        ...offspringState,
        gestation: null, // Đã sinh hạ thành công
        children: updatedChildren,
      },
    });

    setPlayer(updatedPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));

    setNamingModalChild(false);
    setCustomChildName('');

    showToast(`🎉 [TIÊN ĐỒNG GIÁNG TRẦN] Chúc mừng đạo hữu và ${gestation.motherName}! Hài nhi [${newChild.name}] đã phá noãn chào đời! Mang [${newChild.spiritualRoots.elementName}] và Thiên Phú [${newChild.innateTalent.name}]!`);
    addLog(
      'Tiên Đồng Phá Noãn Giáng Trần',
      `Linh quang vạn trượng bao phủ động phủ! Hài nhi [${newChild.name}] (Giới tính: ${newChild.gender === 'nam' ? 'Nam' : 'Nữ'}) đã ra đời, kế thừa linh căn [${newChild.spiritualRoots.elementName}] (${newChild.spiritualRoots.grade}) cùng thần thông [${newChild.innateTalent.name}]. Hiện đang an dưỡng tại Nôi Tiên Động Phủ, cung cấp buff gia viên!`,
      'companion'
    );
  };

  // ─── 5. Chỉ Định Tiên Đồng Xuất Chiến ────────────────────────────────────────
  const handleDeployChild = (childId: string | null) => {
    const children = offspringState.children || [];
    if (childId) {
      const child = children.find(c => c.id === childId);
      if (!child) {
        showToast('Không tìm thấy tiên đồng!');
        return;
      }
      if (child.stage !== 'adult') {
        showToast('Tiên đồng chưa đủ tuổi xuất sư (Cần giai đoạn Đạo Tử Xuất Sư - 16+ tuổi / Kim Đan Kỳ)! Hãy tiếp tục truyền công nuôi dưỡng.');
        return;
      }
    }

    const updatedChildren = children.map(c => ({
      ...c,
      isDeployed: c.id === childId,
    }));

    const updatedPlayer: PlayerStats = normalizePlayerData({
      ...player,
      offspringState: {
        ...offspringState,
        children: updatedChildren,
        deployedChildId: childId,
      },
    });

    setPlayer(updatedPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));

    if (childId) {
      const deployed = updatedChildren.find(c => c.id === childId);
      showToast(`⚔️ [XUẤT SƯ TRỢ CHIẾN] Đạo Tử [${deployed?.name}] đã nhập ngũ trợ chiến! Kích hoạt cơ chế Tứ Trận Quy Nhất & Tuyệt Kỹ Huyết Mạch!`);
    } else {
      showToast('Đã thu hồi Tiên Đồng về tu luyện tại Tiên Đình.');
    }
  };

  // ─── 6. Truyền Công Đẩy Nhanh Trưởng Thành Cho Con ───────────────────────────
  const handleTransferTuViToChild = (childId: string) => {
    const children = offspringState.children || [];
    const child = children.find(c => c.id === childId);
    if (!child) return;

    if (child.stage === 'adult') {
      showToast('Đạo Tử đã đại thành xuất sư, không cần truyền thụ thêm tu vi cơ bản!');
      return;
    }

    const costTuVi = 50000;
    if (player.tuVi < costTuVi) {
      showToast(`Không đủ Tu Vi truyền công! Cần ít nhất ${costTuVi.toLocaleString()} Tu Vi.`);
      return;
    }

    const currentProg = child.growthProgress || 0;
    const newProg = Math.min(100, currentProg + 25);
    let newStage: OffspringStage = child.stage;
    let newAge = (child.ageYears || 0) + 4;
    let newRealmName = child.realmName;
    let newRealmIndex = child.realmIndex;

    if (newProg >= 100) {
      if (child.stage === 'infant') {
        newStage = 'child';
        newRealmName = 'Luyện Khí Tầng 9';
        newRealmIndex = 9;
        showToast(`✨ [TIÊN ĐỒNG ĐỘT PHÁ] ${child.name} đã trưởng thành bước vào giai đoạn [Tiên Đồng Tập Khí]!`);
      } else if (child.stage === 'child') {
        newStage = 'adult';
        newRealmName = 'Kim Đan Sơ Kỳ';
        newRealmIndex = 16;
        showToast(`🌟 [ĐẠO TỬ ĐẠI THÀNH] ${child.name} ngưng kết Kim Đan thành công, chính thức bước vào giai đoạn [Đạo Tử Xuất Sư]! Có thể xuất chiến trợ trận!`);
      }
    }

    const updatedChildren = children.map(c => {
      if (c.id !== childId) return c;
      return {
        ...c,
        stage: newStage,
        growthProgress: newProg >= 100 && newStage !== 'adult' ? 0 : newProg,
        ageYears: newAge,
        realmName: newRealmName,
        realmIndex: newRealmIndex,
        combatPower: c.combatPower + 1500,
        transferredTuVi: (c.transferredTuVi || 0) + costTuVi,
      };
    });

    const updatedPlayer: PlayerStats = normalizePlayerData({
      ...player,
      tuVi: player.tuVi - costTuVi,
      offspringState: {
        ...offspringState,
        children: updatedChildren,
      },
    });

    setPlayer(updatedPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));

    showToast(`🌸 [TRUYỀN CÔNG BỒI DƯỠNG] Đã truyền 50,000 Tu Vi cho [${child.name}]! Tiến độ trưởng thành: ${newProg}%.`);
  };

  // ─── 7. Bồi Dưỡng Cảnh Giới Cho Đạo Tử Trưởng Thành (Lên Hóa Thần Xuất Sư) ───
  const handleNurtureChildRealm = (childId: string) => {
    const children = offspringState.children || [];
    const child = children.find(c => c.id === childId);
    if (!child) return;

    if (child.stage !== 'adult') {
      showToast('Tiên đồng chưa trưởng thành! Hãy tiếp tục truyền công nuôi dưỡng.');
      return;
    }

    const currentIdx = child.realmIndex || 16;
    if (currentIdx >= 26) {
      showToast('Đạo Tử đã đạt Hóa Thần Kỳ trở lên! Đã đủ điều kiện cử hành Đại Lễ Xuất Sư!');
      return;
    }

    const costTuVi = currentIdx < 21 ? 100000 : 200000;
    if (player.tuVi < costTuVi) {
      showToast(`Không đủ Tu Vi bồi dưỡng! Cần ít nhất ${costTuVi.toLocaleString()} Tu Vi.`);
      return;
    }

    let nextIdx = 21;
    let nextName = 'Nguyên Anh Sơ Kỳ';
    let cpGain = 30000;

    if (currentIdx >= 21) {
      nextIdx = 26;
      nextName = 'Hóa Thần Sơ Kỳ';
      cpGain = 60000;
    }

    const updatedChildren = children.map(c => {
      if (c.id !== childId) return c;
      return {
        ...c,
        realmIndex: nextIdx,
        realmName: nextName,
        combatPower: c.combatPower + cpGain,
        transferredTuVi: (c.transferredTuVi || 0) + costTuVi,
      };
    });

    const updatedPlayer: PlayerStats = normalizePlayerData({
      ...player,
      tuVi: player.tuVi - costTuVi,
      offspringState: {
        ...offspringState,
        children: updatedChildren,
      },
    });

    setPlayer(updatedPlayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));

    showToast(`⚡ [ĐỘT PHÁ CẢNH GIỚI] Đạo Tử [${child.name}] đột phá thành công lên [${nextName}]! Lực chiến +${cpGain.toLocaleString()} CP.${nextIdx >= 26 ? ' 🎓 Đã sẵn sàng cử hành Đại Lễ Xuất Sư!' : ''}`);
  };

  return {
    offspringState,
    namingModalChild,
    setNamingModalChild,
    customChildName,
    setCustomChildName,
    handlePerformDualCultivation,
    handleInitiateGestation,
    handleNurtureGestation,
    handleBirthChild,
    handleDeployChild,
    handleTransferTuViToChild,
    handleNurtureChildRealm,
  };
}
