// hooks/useDiscipleAppointmentActions.ts
// Custom Hook quản lý toàn bộ tương tác Bổ Nhiệm Tiên Đồng Xuất Sư (Graduation & Dominion Appointments)

import { useState, useCallback } from 'react';
import type { PlayerStats, LogType } from '@/lib/types';
import type {
  DiscipleAppointmentRole,
  DiscipleAppointmentData,
} from '@/lib/types/disciple-appointment';
import type { ImmortalChild } from '@/lib/types/offspring';
import type { ProceduralDisciple } from '@/lib/types/custom-sect';
import {
  canGraduateDisciple,
  graduateDisciple,
  appointDiscipleRole,
  recallDiscipleRole,
  rewardDisciple,
} from '@/lib/disciple-appointment-logic';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';

interface UseDiscipleAppointmentActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog?: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
  playSfx?: (sfx: string) => void;
}

export function useDiscipleAppointmentActions({
  player,
  setPlayer,
  addLog,
  showToast,
  playSfx,
}: UseDiscipleAppointmentActionsParams) {
  const [selectedDiscipleForGraduation, setSelectedDiscipleForGraduation] =
    useState<ImmortalChild | ProceduralDisciple | null>(null);

  const [appointmentModalTarget, setAppointmentModalTarget] = useState<{
    role: DiscipleAppointmentRole;
    targetId: string;
    targetName: string;
  } | null>(null);

  // ─── 1. Cử Hành Đại Lễ Xuất Sư ──────────────────────────────────────────────
  const handleGraduateDisciple = useCallback(
    (discipleId: string) => {
      // Tìm đệ tử trong Tiên Đồng Động Phủ hoặc Đệ Tử Tông Môn
      let targetChild: ImmortalChild | undefined = player.offspringState?.children?.find(
        (c) => c.id === discipleId
      );
      let targetDisciple: ProceduralDisciple | undefined =
        player.customSectState?.disciples?.find((d) => d.id === discipleId);

      const target = targetChild || targetDisciple;
      if (!target) {
        showToast('Không tìm thấy thông tin Tiên Đồng!');
        return;
      }

      const check = canGraduateDisciple(target);
      if (!check.eligible) {
        showToast(`⚠️ [CHƯA ĐỦ ĐIỀU KIỆN] ${check.reason}`);
        return;
      }

      try {
        let updatedPlayer: PlayerStats = { ...player };

        if (targetChild) {
          const graduated = graduateDisciple(targetChild);
          const newChildren = (player.offspringState?.children || []).map((c) =>
            c.id === discipleId ? graduated : c
          );
          updatedPlayer = {
            ...updatedPlayer,
            offspringState: {
              ...updatedPlayer.offspringState!,
              children: newChildren,
            },
          };
        } else if (targetDisciple) {
          const graduated = graduateDisciple(targetDisciple);
          const newDisciples = (player.customSectState?.disciples || []).map((d) =>
            d.id === discipleId ? graduated : d
          );
          updatedPlayer = {
            ...updatedPlayer,
            customSectState: {
              ...updatedPlayer.customSectState!,
              disciples: newDisciples,
            },
          };
        }

        const normalized = normalizePlayerData(updatedPlayer);
        setPlayer(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

        playSfx?.('breakthrough');

        showToast(
          `🎓 [ĐẠI LỄ XUẤT SƯ] Chúc mừng Tiên Đồng [${target.name}] cử hành Đại Lễ Xuất Sư viên mãn! Đã sẵn sàng nhận trọng trách Trấn Thủ Tinh Hải hoặc Chấp Sự Khố Phòng!`
        );

        if (addLog) {
          addLog(
            'Đại Lễ Xuất Sư Viên Mãn',
            `Tiên Đồng [${target.name}] đạt cảnh giới [${target.realmName}], cử hành lễ xuất sư, tiếp nhận đạo bào truyền thừa và pháp bảo trấn sơn. Sẵn sàng phò tá sư môn khai cương thác thổ!`,
            'companion'
          );
        }

        setSelectedDiscipleForGraduation(null);
      } catch (err: any) {
        showToast(`❌ Xuất sư thất bại: ${err.message}`);
      }
    },
    [player, setPlayer, addLog, showToast, playSfx]
  );

  // ─── 2. Bổ Nhiệm Chức Vụ ───────────────────────────────────────────────────
  const handleAppointRole = useCallback(
    (discipleId: string, role: DiscipleAppointmentRole, targetId: string) => {
      const res = appointDiscipleRole(player, discipleId, role, targetId);
      if (!res.success) {
        showToast(`⚠️ ${res.message}`);
        return;
      }

      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      playSfx?.('upgrade');

      showToast(`✨ ${res.message}`);

      if (addLog) {
        const roleLabel =
          role === 'tinh_hai_guardian'
            ? 'Trấn Thủ Sĩ Tinh Hải'
            : 'Chấp Sự Khố Phòng Tông Môn';
        addLog(
          'Bổ Nhiệm Trọng Chức',
          `Sư môn sắc phong Tiên Đồng đảm nhiệm trọng trách [${roleLabel}] tại cứ điểm [${targetId}].`,
          'sect'
        );
      }

      setAppointmentModalTarget(null);
    },
    [player, setPlayer, addLog, showToast, playSfx]
  );

  // ─── 3. Bãi Nhiệm / Triệu Hồi ──────────────────────────────────────────────
  const handleRecallRole = useCallback(
    (discipleId: string) => {
      const res = recallDiscipleRole(player, discipleId);
      if (!res.success) {
        showToast(`⚠️ ${res.message}`);
        return;
      }

      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      playSfx?.('retreat');

      showToast(`📜 ${res.message}`);

      if (addLog) {
        addLog(
          'Thu Hồi Lệnh Bài',
          `Tiên đồng đã được triệu hồi về Động Phủ nghỉ ngơi tu luyện, hoàn trả trạng thái tự do.`,
          'sect'
        );
      }
    },
    [player, setPlayer, addLog, showToast, playSfx]
  );

  // ─── 4. Ban Thưởng Bổng Lộc ────────────────────────────────────────────────
  const handleRewardDisciple = useCallback(
    (discipleId: string, spiritStones: number) => {
      const res = rewardDisciple(player, discipleId, spiritStones);
      if (!res.success) {
        showToast(`⚠️ ${res.message}`);
        return;
      }

      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      playSfx?.('coin');

      showToast(`🎁 ${res.message}`);
    },
    [player, setPlayer, showToast, playSfx]
  );

  return {
    selectedDiscipleForGraduation,
    setSelectedDiscipleForGraduation,
    appointmentModalTarget,
    setAppointmentModalTarget,
    handleGraduateDisciple,
    handleAppointRole,
    handleRecallRole,
    handleRewardDisciple,
  };
}
