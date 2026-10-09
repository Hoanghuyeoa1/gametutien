import React, { useState, useEffect } from 'react';
import {
  Swords,
  Zap,
  Flame,
  Shield,
  Layers,
  Crown,
  Skull,
  Award,
  Sparkles,
  ChevronRight,
  X,
  Heart,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Gift,
  Package,
  Eye,
  RefreshCw,
  Target,
  Play,
  Pause,
  FastForward,
  Trophy
} from 'lucide-react';
import {
  PlayerStats,
  Boss,
  DetailedBattleReport,
  CombatRoundLog,
  TowerFloorInfo,
  WorldBossState,
  LinhCanElement
} from '@/lib/types';
import { getBossElement, calculateCombatPower, getMaxKhiHuyet } from '@/lib/game-logic';
import {
  getElementalCombatModifier,
  ELEMENT_ICONS,
  ELEMENT_NAMES,
  ELEMENT_COLORS
} from '@/lib/elemental-system';
import {
  getTowerFloorInfo,
  WORLD_BOSS_CONFIG,
  simulateTurnBasedCombat
} from '@/lib/boss-trial-data';
import { addItemToInventory, getMaxInventoryCapacity } from '@/lib/inventory-data';
import { PILL_TEMPLATES } from '@/lib/alchemy-data';
import { createRandomEgg } from '@/lib/beast-data';
import { audioEngine } from '@/lib/audio-engine';
import { FloatingDamageOverlay, DamagePopup, SmoothHealthBar, PvPLadderView } from '@/components/battle';

export type BattleMode = 'realm' | 'tower' | 'world_boss' | 'pvp_ladder';

export interface BattleTabProps {
  player: PlayerStats;
  availableBosses: Boss[];
  combatPower: number;
  isBattling: string | null;
  handleBattleBoss: (boss: Boss, skillId?: string) => Promise<void>;
  onUpdatePlayer?: (player: PlayerStats) => void;
  onShowToast?: (msg: string) => void;
  onAddLog?: (title: string, content: string, type: any) => void;
}

export const BattleTab: React.FC<BattleTabProps> = ({
  player,
  availableBosses,
  combatPower,
  isBattling,
  handleBattleBoss,
  onUpdatePlayer,
  onShowToast,
  onAddLog
}) => {
  // Chế độ Thí Luyện: 1. Trảm Yêu Cảnh Giới, 2. Trấn Ma Tháp, 3. Ma Thú Xuất Thế
  const [battleMode, setBattleMode] = useState<BattleMode>('realm');

  // Trạng thái Modal Chiến Báo Đối Kháng
  const [combatModalOpen, setCombatModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<DetailedBattleReport | null>(null);
  const [currentModalMode, setCurrentModalMode] = useState<BattleMode>('realm');
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);
  const [showOutcome, setShowOutcome] = useState(false);
  const [pendingPlayerState, setPendingPlayerState] = useState<PlayerStats | null>(null);

  // Hiệu ứng chiến đấu sống động (Combat Visuals & Floating Numbers)
  const [bossPopups, setBossPopups] = useState<DamagePopup[]>([]);
  const [playerPopups, setPlayerPopups] = useState<DamagePopup[]>([]);
  const [bossSlashing, setBossSlashing] = useState(false);
  const [bossSlashCrit, setBossSlashCrit] = useState(false);
  const [playerSlashing, setPlayerSlashing] = useState(false);
  const [playerSlashCrit, setPlayerSlashCrit] = useState(false);
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  // Helper avatar Boss
  const getBossAvatar = (mode: BattleMode, name: string) => {
    if (mode === 'world_boss') return '🐲';
    if (mode === 'tower') return '🏯';
    if (name.includes('Long') || name.includes('Rồng')) return '🐉';
    if (name.includes('Phượng') || name.includes('Điểu')) return '🦅';
    if (name.includes('Lang') || name.includes('Sói')) return '🐺';
    if (name.includes('Viên') || name.includes('Hầu')) return '🦍';
    if (name.includes('Hổ')) return '🐯';
    if (name.includes('Xà') || name.includes('Mãng')) return '🐍';
    if (name.includes('Hạt') || name.includes('Bọ Cạp')) return '🦂';
    if (name.includes('Chu Ma') || name.includes('Quỷ')) return '👹';
    return '👾';
  };

  // Kích hoạt hiệu ứng đòn đánh cho từng hiệp
  const triggerRoundVisuals = (roundIdx: number, report: DetailedBattleReport) => {
    const roundLog = report.rounds[roundIdx];
    if (!roundLog) return;

    const popupId1 = `boss-${Date.now()}-${Math.random()}`;
    const popupId2 = `player-${Date.now()}-${Math.random()}`;

    // 1. Lượt tấn công của Nhân Vật -> Đánh lên Boss
    const pAction = roundLog.playerAction;
    if (pAction.damage > 0) {
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 20;

      setBossPopups(prev => [
        ...prev,
        {
          id: popupId1,
          text: `-${pAction.damage.toLocaleString()}`,
          type: pAction.isCrit ? 'crit' : 'normal',
          x: offsetX,
          y: offsetY
        }
      ]);

      setBossSlashing(true);
      setBossSlashCrit(Boolean(pAction.isCrit));
      audioEngine.playSwordSlashSound(1.0, Boolean(pAction.isCrit));

      if (pAction.isCrit) {
        setIsScreenShaking(true);
        setTimeout(() => setIsScreenShaking(false), 240);
      }

      setTimeout(() => {
        setBossSlashing(false);
      }, 300);
    } else if (pAction.isDodge) {
      setBossPopups(prev => [
        ...prev,
        {
          id: popupId1,
          text: 'NÉ TRÁNH!',
          type: 'dodge',
          x: 0,
          y: 0
        }
      ]);
    }

    if (pAction.hpRegen && pAction.hpRegen > 0) {
      const healId = `heal-${Date.now()}-${Math.random()}`;
      setPlayerPopups(prev => [
        ...prev,
        {
          id: healId,
          text: `+${pAction.hpRegen!.toLocaleString()}`,
          type: 'heal',
          x: (Math.random() - 0.5) * 30,
          y: -15
        }
      ]);
    }

    // 2. Lượt phản kích của Boss -> Đánh lên Nhân Vật (Sau 320ms để thấy rõ nhịp đối kháng)
    const bAction = roundLog.bossAction;
    const bossTimer = setTimeout(() => {
      if (bAction.damage > 0) {
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 20;

        setPlayerPopups(prev => [
          ...prev,
          {
            id: popupId2,
            text: `-${bAction.damage.toLocaleString()}`,
            type: bAction.isCrit ? 'crit' : 'normal',
            x: offsetX,
            y: offsetY
          }
        ]);

        setPlayerSlashing(true);
        setPlayerSlashCrit(Boolean(bAction.isCrit));

        if (bAction.isCrit) {
          audioEngine.playThunderSound(0.8);
          setIsScreenShaking(true);
          setTimeout(() => setIsScreenShaking(false), 240);
        } else {
          audioEngine.playSwordSlashSound(0.7, false);
        }

        setTimeout(() => {
          setPlayerSlashing(false);
        }, 300);
      } else {
        setPlayerPopups(prev => [
          ...prev,
          {
            id: popupId2,
            text: 'NÉ TRÁNH!',
            type: 'dodge',
            x: 0,
            y: 0
          }
        ]);
      }
    }, 320);

    // Dọn dẹp popup sau khi bay xong (950ms)
    const gcTimer = setTimeout(() => {
      setBossPopups(prev => prev.filter(p => p.id !== popupId1));
      setPlayerPopups(prev => prev.filter(p => p.id !== popupId2));
    }, 950);

    return () => {
      clearTimeout(bossTimer);
      clearTimeout(gcTimer);
    };
  };

  // Vòng lặp tự động diễn biến các hiệp đấu (Auto-Play)
  useEffect(() => {
    if (!combatModalOpen || !currentReport || showOutcome) return;

    const cleanup = triggerRoundVisuals(selectedRoundIndex, currentReport);

    if (!autoPlay) return cleanup;

    const nextTimer = setTimeout(() => {
      if (selectedRoundIndex < currentReport.rounds.length - 1) {
        setSelectedRoundIndex(prev => prev + 1);
      } else {
        setShowOutcome(true);
        if (currentReport.victory) {
          audioEngine.playBreakthroughSuccessSound(0.9);
        }
      }
    }, 1150);

    return () => {
      if (cleanup) cleanup();
      clearTimeout(nextTimer);
    };
  }, [combatModalOpen, currentReport, selectedRoundIndex, autoPlay, showOutcome]);

  // Kỹ năng Thần Thông chủ động
  const equippedTT1 = player.manuals?.find(m => m.id === player.equippedManuals?.thanThong1);
  const equippedTT2 = player.manuals?.find(m => m.id === player.equippedManuals?.thanThong2);

  // Dữ liệu Trấn Ma Tháp
  const currentTowerFloor = player.towerFloor || 1;
  const towerFloorInfo = getTowerFloorInfo(currentTowerFloor);

  // Dữ liệu Boss Thế Giới
  const worldBossDamage = player.worldBossDamage || 0;
  const claimedMilestones = player.worldBossClaimedMilestones || [];

  // ============================================
  // HÀM KHỞI CHẠY CHIẾN ĐẤU & MÔ PHỎNG CHI TIẾT
  // ============================================
  const executeCombatSimulation = (
    mode: BattleMode,
    bossData: {
      name: string;
      realm: number;
      power: number;
      element: LinhCanElement;
      difficulty?: string;
    },
    usedSkillId?: string
  ) => {
    const linhLucCost = mode === 'world_boss' ? 35 : 25;
    const currentMP = player.linhLuc ?? 50;

    if (currentMP < linhLucCost) {
      if (onShowToast) {
        onShowToast(`Chân nguyên không đủ! Cần ít nhất ${linhLucCost} Chân Nguyên để xuất chiêu.`);
      }
      return;
    }

    // Tạo báo cáo chiến đấu từng hiệp chi tiết
    const report = simulateTurnBasedCombat(player, bossData, usedSkillId);
    const hasCrit = report.rounds.some(r => r.playerAction?.isCrit);
    audioEngine.playSwordSlashSound(1.0, hasCrit);

    // Tính toán player state cập nhật
    let updatedPlayer = { ...player };
    updatedPlayer.linhLuc = Math.max(0, currentMP - linhLucCost);

    const maxCap = getMaxInventoryCapacity(updatedPlayer);
    let curInv = updatedPlayer.inventory ? { ...updatedPlayer.inventory } : { pills: [], herbs: [], ores: [], manuals: [] };

    if (mode === 'realm') {
      if (report.victory && report.rewards) {
        updatedPlayer.tuVi = (updatedPlayer.tuVi || 0) + report.rewards.tuVi;
        updatedPlayer.linhThach = (updatedPlayer.linhThach || 0) + report.rewards.linhThach;
        updatedPlayer.danhVong = (updatedPlayer.danhVong || 0) + report.rewards.danhVong;
        updatedPlayer.tinhHuyetYeuThu = (updatedPlayer.tinhHuyetYeuThu || 0) + (report.rewards.tinhHuyet || 2);
        updatedPlayer.achievementsState = {
          ...updatedPlayer.achievementsState,
          claimedAchievementIds: updatedPlayer.achievementsState?.claimedAchievementIds || [],
          unlockedTitleIds: updatedPlayer.achievementsState?.unlockedTitleIds || [],
          stats: {
            ...updatedPlayer.achievementsState?.stats,
            bossKills: (updatedPlayer.achievementsState?.stats?.bossKills || 0) + 1
          }
        };

        // Nạp chiến lợi phẩm vào túi trữ vật
        if (report.rewards.droppedPill) {
          const res = addItemToInventory(curInv, maxCap, 'pill', report.rewards.droppedPill, report.rewards.droppedPill.quantity || 1);
          if (res.success) curInv = res.inventory;
        }
        if (report.rewards.droppedOre) {
          const res = addItemToInventory(curInv, maxCap, 'ore', report.rewards.droppedOre, report.rewards.droppedOre.quantity || 1);
          if (res.success) curInv = res.inventory;
        }
        if (report.rewards.droppedManual) {
          const res = addItemToInventory(curInv, maxCap, 'manual', report.rewards.droppedManual, 1);
          if (res.success) curInv = res.inventory;
        }
        updatedPlayer.inventory = curInv;

        // Rơi Trứng Thần Thú (Linh Noãn)
        if (Math.random() < 0.22) {
          const egg = createRandomEgg();
          updatedPlayer.beastEggs = [...(updatedPlayer.beastEggs || []), egg];
          if (onAddLog) {
            onAddLog(
              '🥚 BẢO VẬT GIÁNG THẾ: LINH NOÃN',
              `Trảm sát [${bossData.name}], nhặt được một quả [${egg.name}]! Hãy vào mục Linh Thú để ấp nở!`,
              'special'
            );
          }
          if (onShowToast) {
            onShowToast(`🥚 Nhặt được [${egg.name}]!`);
          }
        }

        // Cơ chế Cướp Đoạt Khí Vận (Fate Plundering) - Không giới hạn trần
        if (bossData.realm >= player.currentRealm) {
          const stolen = Math.random() < 0.5 ? 1 : 2;
          updatedPlayer.khiVan = (updatedPlayer.khiVan || 50) + stolen;
          updatedPlayer.stolenFatePoints = (updatedPlayer.stolenFatePoints || 0) + stolen;
          if (onAddLog) {
            onAddLog(
              '✨ CƯỚP ĐOẠT KHÍ VẬN',
              `Thiên đạo vô tình, kẻ thắng làm vua! Ngươi đã cướp đoạt ${stolen} điểm Khí Vận từ [${bossData.name}]!`,
              'battle'
            );
          }
          if (onShowToast) {
            onShowToast(`✨ Cướp đoạt thành công +${stolen} Khí Vận từ ${bossData.name}!`);
          }
        }

        // Cập nhật quest Tông Môn nếu có
        if (updatedPlayer.sectState?.dailyQuests) {
          const q = updatedPlayer.sectState.dailyQuests.find(quest => quest.category === 'battle' && !quest.isCompleted);
          if (q) {
            q.currentCount = Math.min(q.targetCount, q.currentCount + 1);
            if (q.currentCount >= q.targetCount) q.isCompleted = true;
          }
        }
      } else {
        const hpLoss = Math.floor((updatedPlayer.maxKhiHuyet || 200) * 0.25);
        updatedPlayer.khiHuyet = Math.max(1, (updatedPlayer.khiHuyet || 100) - hpLoss);
      }
    } else if (mode === 'tower') {
      if (report.victory && report.rewards) {
        updatedPlayer.towerFloor = Math.min(100, currentTowerFloor + 1);
        updatedPlayer.towerPoints = (updatedPlayer.towerPoints || 0) + (towerFloorInfo.rewards.towerPoints || 10);
        updatedPlayer.tuVi = (updatedPlayer.tuVi || 0) + report.rewards.tuVi;
        updatedPlayer.linhThach = (updatedPlayer.linhThach || 0) + report.rewards.linhThach;
        updatedPlayer.tinhHuyetYeuThu = (updatedPlayer.tinhHuyetYeuThu || 0) + (report.rewards.tinhHuyet || 2);

        // Cơ chế Cướp Đoạt Khí Vận (Fate Plundering) - Không giới hạn trần
        if (towerFloorInfo.realmLevel >= player.currentRealm) {
          const stolen = Math.random() < 0.5 ? 1 : 2;
          updatedPlayer.khiVan = (updatedPlayer.khiVan || 50) + stolen;
          updatedPlayer.stolenFatePoints = (updatedPlayer.stolenFatePoints || 0) + stolen;
          if (onAddLog) {
            onAddLog(
              '✨ CƯỚP ĐOẠT KHÍ VẬN',
              `Thiên đạo vô tình, kẻ thắng làm vua! Ngươi đã cướp đoạt ${stolen} điểm Khí Vận từ Trấn Ma Tháp [${towerFloorInfo.bossName}]!`,
              'battle'
            );
          }
          if (onShowToast) {
            onShowToast(`✨ Cướp đoạt thành công +${stolen} Khí Vận từ ${towerFloorInfo.bossName}!`);
          }
        }

        if (report.rewards.droppedOre) {
          const res = addItemToInventory(curInv, maxCap, 'ore', report.rewards.droppedOre, report.rewards.droppedOre.quantity || 1);
          if (res.success) curInv = res.inventory;
        }
        if (report.rewards.droppedPill) {
          const res = addItemToInventory(curInv, maxCap, 'pill', report.rewards.droppedPill, report.rewards.droppedPill.quantity || 1);
          if (res.success) curInv = res.inventory;
        }

        // Rơi Trứng Thần Thú khi leo tháp Trấn Ma
        if (Math.random() < 0.25) {
          const egg = createRandomEgg();
          updatedPlayer.beastEggs = [...(updatedPlayer.beastEggs || []), egg];
          if (onAddLog) {
            onAddLog(
              '🥚 BẢO VẬT GIÁNG THẾ: LINH NOÃN',
              `Vượt Trấn Ma Tháp tầng ${currentTowerFloor}, phát hiện một quả [${egg.name}]!`,
              'special'
            );
          }
          if (onShowToast) {
            onShowToast(`🥚 Nhặt được [${egg.name}]!`);
          }
        }

        updatedPlayer.inventory = curInv;
      } else {
        const hpLoss = Math.floor((updatedPlayer.maxKhiHuyet || 200) * 0.25);
        updatedPlayer.khiHuyet = Math.max(1, (updatedPlayer.khiHuyet || 100) - hpLoss);
      }
    } else if (mode === 'world_boss') {
      // Dồn sát thương tích lũy Boss Thế Giới
      const roundDmg = report.rounds.reduce((acc, r) => acc + (r.playerAction.damage || 0), 0);
      const dealtDmg = Math.max(15000, Math.floor(roundDmg * 1.5));
      updatedPlayer.worldBossDamage = worldBossDamage + dealtDmg;

      // Thưởng Tinh Huyết tham gia khiêu chiến
      const bossBonusTinhHuyet = Math.max(2, Math.floor(dealtDmg / 80000));
      updatedPlayer.tinhHuyetYeuThu = (updatedPlayer.tinhHuyetYeuThu || 0) + bossBonusTinhHuyet;
      updatedPlayer.tuVi = (updatedPlayer.tuVi || 0) + Math.floor(dealtDmg * 0.4);

      if (report.rewards) {
        report.rewards.tinhHuyet = bossBonusTinhHuyet;
      }
    }

    setPendingPlayerState(updatedPlayer);
    setCurrentReport(report);
    setCurrentModalMode(mode);
    setSelectedRoundIndex(0);
    setShowOutcome(false);
    setAutoPlay(true);
    setBossPopups([]);
    setPlayerPopups([]);
    setCombatModalOpen(true);
  };

  // Xác nhận kết thúc và đồng bộ dữ liệu
  const handleConfirmCombatFinish = () => {
    if (pendingPlayerState && onUpdatePlayer) {
      onUpdatePlayer(pendingPlayerState);
      if (onShowToast) {
        if (currentReport?.victory) {
          onShowToast('Chiến thắng vang dội! Chiến lợi phẩm đã chuyển vào Túi Đồ.');
        } else {
          onShowToast('Giao tranh bất thành! Hãy tịnh dưỡng phục hồi khí huyết.');
        }
      }
      if (onAddLog && currentReport) {
        if (currentReport.victory) {
          onAddLog(
            `⚔️ Trảm Thắng: [${currentReport.bossName}]`,
            `Chiến thắng vang dội! Nhận +${currentReport.rewards?.tuVi?.toLocaleString()} Tu Vi, +${currentReport.rewards?.linhThach?.toLocaleString()} Linh Thạch, +${currentReport.rewards?.tinhHuyet} Tinh Huyết Yêu Thú.`,
            'battle'
          );
        } else {
          onAddLog(
            `⚔️ Bại Trận: [${currentReport.bossName}]`,
            `Đạo hữu đã bại trận! Nguyên nhân: ${currentReport.lossReason || 'Lực chiến chênh lệch'}`,
            'danger'
          );
        }
      }
    }
    setCombatModalOpen(false);
    setCurrentReport(null);
    setPendingPlayerState(null);
    setAutoPlay(false);
    setBossPopups([]);
    setPlayerPopups([]);
  };

  // Nhận thưởng mốc Sát thương Boss Thế Giới
  const handleClaimWorldBossReward = (milestoneIndex: number) => {
    const ms = WORLD_BOSS_CONFIG.milestones[milestoneIndex];
    if (!ms) return;
    if (worldBossDamage < ms.damageReq) {
      if (onShowToast) onShowToast(`Chưa đạt mốc sát thương ${ms.damageReq.toLocaleString()}!`);
      return;
    }
    if (claimedMilestones.includes(milestoneIndex)) {
      if (onShowToast) onShowToast('Mốc phần thưởng này đã được thu nhận!');
      return;
    }

    const updated = { ...player };
    updated.worldBossClaimedMilestones = [...claimedMilestones, milestoneIndex];
    updated.tuVi = (updated.tuVi || 0) + ms.rewards.tuVi;
    updated.linhThach = (updated.linhThach || 0) + ms.rewards.linhThach;
    updated.tinhHuyetYeuThu = (updated.tinhHuyetYeuThu || 0) + ms.rewards.tinhHuyet;

    const maxCap = getMaxInventoryCapacity(updated);
    let inv = updated.inventory ? { ...updated.inventory } : { pills: [], herbs: [], ores: [], manuals: [] };

    if (ms.rewards.pillId && PILL_TEMPLATES[ms.rewards.pillId]) {
      const res = addItemToInventory(inv, maxCap, 'pill', { ...PILL_TEMPLATES[ms.rewards.pillId], quantity: 2 }, 2);
      if (res.success) inv = res.inventory;
    }
    if (ms.rewards.oreId) {
      const oreItem = {
        id: ms.rewards.oreId,
        name: ms.rewards.oreId === 'manh_co_bao' ? 'Mảnh Cổ Bảo Thượng Cổ' : 'Thần Binh Tàn Phiến',
        grade: ms.rewards.oreId === 'manh_co_bao' ? 'Tứ Phẩm' : 'Thần Phẩm',
        description: 'Tài liệu thần thánh rớt ra từ Ma Thú Xuất Thế.',
        price: 3000,
        quantity: ms.rewards.oreId === 'manh_co_bao' ? 1 : 2
      };
      const res = addItemToInventory(inv, maxCap, 'ore', oreItem, oreItem.quantity);
      if (res.success) inv = res.inventory;
    }
    updated.inventory = inv;

    if (onUpdatePlayer) onUpdatePlayer(updated);
    if (onShowToast) onShowToast(`Nhận thưởng [${ms.title}] thành công!`);
    if (onAddLog) onAddLog('Thưởng Ma Thú Thế Giới', `Lĩnh nhận phần thưởng mốc ${ms.title}: ${ms.rewards.description}`, 'battle');
  };

  return (
    <div className="space-y-3.5">
      {/* ======================================================== */}
      {/* SUB-TABS: CHUYỂN ĐỔI 4 CHẾ ĐỘ THÍ LUYỆN */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#0b0b12] rounded-lg border border-amber-900/30 text-xs font-serif">
        <button
          onClick={() => setBattleMode('realm')}
          className={`py-2 px-1 rounded transition cursor-pointer flex items-center justify-center gap-1.5 ${
            battleMode === 'realm'
              ? 'bg-gradient-to-r from-red-950/80 to-amber-950/80 text-amber-200 border border-amber-600/50 shadow-sm font-bold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Swords className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate">Trảm Yêu Cảnh Giới</span>
        </button>

        <button
          onClick={() => setBattleMode('tower')}
          className={`py-2 px-1 rounded transition cursor-pointer flex items-center justify-center gap-1.5 ${
            battleMode === 'tower'
              ? 'bg-gradient-to-r from-purple-950/80 to-indigo-950/80 text-purple-200 border border-purple-600/50 shadow-sm font-bold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span className="truncate">Trấn Ma Tháp ({currentTowerFloor}/100)</span>
        </button>

        <button
          onClick={() => setBattleMode('world_boss')}
          className={`py-2 px-1 rounded transition cursor-pointer flex items-center justify-center gap-1.5 ${
            battleMode === 'world_boss'
              ? 'bg-gradient-to-r from-rose-950/80 to-red-950/80 text-rose-200 border border-rose-600/50 shadow-sm font-bold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span className="truncate">Ma Thú Xuất Thế</span>
        </button>

        <button
          onClick={() => setBattleMode('pvp_ladder')}
          className={`py-2 px-1 rounded transition cursor-pointer flex items-center justify-center gap-1.5 ${
            battleMode === 'pvp_ladder'
              ? 'bg-gradient-to-r from-amber-950/90 to-yellow-950/90 text-amber-200 border border-amber-500/60 shadow-sm font-bold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate">
            Thiên Kiêu Bảng ({player.pvpLadderState?.currentRank && player.pvpLadderState.currentRank <= 100 ? `#${player.pvpLadderState.currentRank}` : '101+'})
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* CHẾ ĐỘ 1: TRẢM YÊU CẢNH GIỚI (REALM BOSSES) */}
      {/* ======================================================== */}
      {battleMode === 'realm' && (
        <div className="space-y-3">
          <div className="text-[11px] text-zinc-400 flex justify-between items-center px-1">
            <span>Yêu Thú quanh cảnh giới ({availableBosses.length}):</span>
            <span className="text-amber-400/90 font-mono">Tầng Cảnh Giới: {player.currentRealm}</span>
          </div>

          <div className="space-y-3 max-h-[530px] overflow-y-auto pr-1 custom-scrollbar">
            {availableBosses.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 italic font-serif bg-[#0e0e15] rounded-lg border border-amber-900/20">
                Khu vực hư không yên tĩnh, không có Ma Thú nào dám bén mảng.
              </div>
            ) : (
              availableBosses.map(boss => {
                const diffBadgeMap: Record<string, { label: string; style: string }> = {
                  easy: { label: 'Phổ Thông', style: 'text-emerald-300 border-emerald-700/50 bg-emerald-950/30' },
                  medium: { label: 'Tinh Anh', style: 'text-sky-300 border-sky-700/50 bg-sky-950/30' },
                  hard: { label: 'Ma Vương', style: 'text-amber-300 border-amber-700/50 bg-amber-950/30' },
                  legendary: { label: 'Thần Thoại', style: 'text-rose-300 border-rose-600/60 bg-rose-950/40 font-bold shadow-[0_0_10px_rgba(225,29,72,0.3)]' }
                };
                const diffBadge = diffBadgeMap[boss.difficulty] || { label: 'Tinh Anh', style: 'text-sky-300 border-sky-700/50 bg-sky-950/30' };

                const powerDiff = combatPower - boss.stats.power;
                let comparisonBadge = 'bg-yellow-950/40 text-yellow-300 border-yellow-800/40';
                let comparisonText = 'Thế trận giằng co';
                if (powerDiff > boss.stats.power * 0.15) {
                  comparisonBadge = 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40';
                  comparisonText = 'Áp đảo hoàn toàn';
                } else if (powerDiff < -boss.stats.power * 0.15) {
                  comparisonBadge = 'bg-red-950/40 text-red-300 border-red-800/40';
                  comparisonText = 'Cực kỳ hung hiểm';
                }

                const bossElem = getBossElement(boss);
                const elemMod = getElementalCombatModifier(player.linhCan?.element, bossElem);

                return (
                  <div
                    key={boss.id}
                    className="bg-[#0e0e15] border border-amber-900/20 hover:border-amber-600/50 rounded-lg p-3 space-y-2.5 transition shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-serif font-bold text-amber-200 text-xs">
                            {boss.name}
                          </h4>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${diffBadge.style}`}>
                            {diffBadge.label}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${ELEMENT_COLORS[bossElem] || 'text-amber-300'}`}>
                            {ELEMENT_ICONS[bossElem] || '✨'} {ELEMENT_NAMES[bossElem] || bossElem}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded border font-mono bg-amber-950/60 border-amber-600/40 text-amber-300 flex items-center gap-0.5" title="Khí Vận Thiên Kiêu / Ma Đầu">
                            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                            <span>Khí Vận: {boss.khiVan || Math.min(99, 45 + boss.realm * 2)}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] text-zinc-500 font-mono">
                            Cảnh giới: Tầng {boss.realm}
                          </p>
                          {elemMod.playerDamageMod > 1 ? (
                            <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40 font-mono">
                              ⚡ Khắc chế (+30% Sát thương)
                            </span>
                          ) : elemMod.playerDamageMod < 1 ? (
                            <span className="text-[8px] px-1 py-0.2 rounded bg-red-950/50 text-red-300 border border-red-800/40 font-mono">
                              ⚠️ Bị khắc (-20% Sát thương)
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Nút Khiêu Chiến mở Modal */}
                      <button
                        onClick={() => executeCombatSimulation('realm', {
                          name: boss.name,
                          realm: boss.realm,
                          power: boss.stats.power,
                          element: bossElem,
                          difficulty: boss.difficulty
                        })}
                        className="px-2.5 py-1.5 rounded bg-gradient-to-r from-red-900/50 to-rose-900/60 hover:brightness-110 text-rose-200 border border-rose-700/50 text-[11px] font-serif font-bold transition flex items-center gap-1 cursor-pointer shrink-0 shadow-sm"
                      >
                        <Swords className="w-3.5 h-3.5 text-rose-300" />
                        <span>Khiêu Chiến (-25 MP)</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed font-serif">
                      {boss.description}
                    </p>

                    {/* Lựa chọn Thần Thông kích hoạt */}
                    {(equippedTT1?.activeSkill || equippedTT2?.activeSkill) && (
                      <div className="p-2 rounded bg-black/40 border border-amber-900/30 flex items-center justify-between flex-wrap gap-1.5">
                        <span className="text-[9px] text-amber-400 font-serif flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" /> Kích hoạt Thần Thông:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {equippedTT1?.activeSkill && (
                            <button
                              onClick={() => executeCombatSimulation('realm', {
                                name: boss.name,
                                realm: boss.realm,
                                power: boss.stats.power,
                                element: bossElem,
                                difficulty: boss.difficulty
                              }, equippedTT1.id)}
                              className="px-2 py-1 rounded bg-amber-950/60 hover:bg-amber-900/70 text-amber-200 border border-amber-600/40 text-[10px] font-serif font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                            >
                              <Flame className="w-3 h-3 text-amber-400" />
                              <span>{equippedTT1.activeSkill.name}</span>
                            </button>
                          )}
                          {equippedTT2?.activeSkill && (
                            <button
                              onClick={() => executeCombatSimulation('realm', {
                                name: boss.name,
                                realm: boss.realm,
                                power: boss.stats.power,
                                element: bossElem,
                                difficulty: boss.difficulty
                              }, equippedTT2.id)}
                              className="px-2 py-1 rounded bg-purple-950/60 hover:bg-purple-900/70 text-purple-200 border border-purple-600/40 text-[10px] font-serif font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                            >
                              <Shield className="w-3 h-3 text-purple-400" />
                              <span>{equippedTT2.activeSkill.name}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1 pt-1 border-t border-zinc-800/40 text-[10px] font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">
                          Lực chiến Boss: <strong className="text-amber-300">{boss.stats.power.toLocaleString()}</strong>
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border ${comparisonBadge}`}>
                          {comparisonText}
                        </span>
                      </div>
                      <div className="text-[9px] text-emerald-400/90 truncate pt-0.5">
                        Thưởng rơi: Tu Vi, Linh Thạch, Tinh Huyết (100%), Mảnh Cổ Bảo & Đan Dược
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CHẾ ĐỘ 2: TRẤN MA THÁP (100 TẦNG LEO THÁP) */}
      {/* ======================================================== */}
      {battleMode === 'tower' && (
        <div className="space-y-3">
          {/* Header Thông Tin Tháp */}
          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-950/50 via-[#130b1e] to-indigo-950/40 border border-purple-800/40 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-serif font-bold text-purple-200">
                  Trấn Ma Tháp - Cửu Trọng Phong Ấn
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/60 border border-purple-600/50 text-purple-200 font-mono">
                  Tầng {currentTowerFloor}/100
                </span>
              </div>
              <span className="text-[10px] font-mono text-purple-300">
                ✨ Tinh Phách Tháp: <strong>{player.towerPoints || 0}</strong>
              </span>
            </div>

            <p className="text-[10px] text-zinc-400 font-serif leading-relaxed">
              Trấn Ma Tháp giam cầm vạn cổ hung ma. Cứ mỗi 5 tầng trấn áp Đại Yêu Tướng, mỗi 10 tầng gặp Ma Quân Thượng Cổ mang theo Rương Cổ Bảo Thí Luyện.
            </p>
          </div>

          {/* Card Tầng Tháp Hiện Tại */}
          <div className="p-3.5 bg-[#0e0e15] rounded-lg border border-purple-900/30 space-y-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-sm text-purple-100">
                    {towerFloorInfo.bossName}
                  </h4>
                  <span className={`text-[9px] px-2 py-0.5 rounded border font-mono ${
                    towerFloorInfo.type === 'overlord'
                      ? 'bg-rose-950/60 text-rose-300 border-rose-600/60 font-bold animate-pulse'
                      : towerFloorInfo.type === 'elite'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-600/60 font-bold'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                  }`}>
                    {towerFloorInfo.type === 'overlord' ? '👑 Ma Quân Thượng Cổ' : towerFloorInfo.type === 'elite' ? '⚡ Đại Yêu Tướng' : 'Quái Dị Thú'}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${ELEMENT_COLORS[towerFloorInfo.element]}`}>
                    {ELEMENT_ICONS[towerFloorInfo.element]} {ELEMENT_NAMES[towerFloorInfo.element]}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded border font-mono bg-amber-950/60 border-amber-600/40 text-amber-300 flex items-center gap-0.5" title="Khí Vận Trấn Ma Tháp">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    <span>Khí Vận: {Math.min(99, 50 + towerFloorInfo.realmLevel * 2)}</span>
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-serif italic mt-1">
                  "{towerFloorInfo.description}"
                </p>
              </div>

              <button
                onClick={() => executeCombatSimulation('tower', {
                  name: towerFloorInfo.bossName,
                  realm: towerFloorInfo.realmLevel,
                  power: towerFloorInfo.combatPower,
                  element: towerFloorInfo.element,
                  difficulty: towerFloorInfo.type === 'overlord' ? 'legendary' : towerFloorInfo.type === 'elite' ? 'hard' : 'medium'
                })}
                className="px-3 py-2 rounded bg-gradient-to-r from-purple-800 to-indigo-700 hover:brightness-110 text-white border border-purple-500/50 text-xs font-serif font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.3)] shrink-0"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Trảm Ma Leo Tầng (-25 MP)</span>
              </button>
            </div>

            {/* Chi tiết lực chiến & phần thưởng tầng */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono bg-black/40 p-2 rounded border border-purple-900/20">
              <div>
                <span className="text-zinc-500 block">Lực Chiến</span>
                <span className="text-amber-300 font-bold">{towerFloorInfo.combatPower.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Tu Vi Nhận</span>
                <span className="text-emerald-300 font-bold">+{towerFloorInfo.rewards.tuVi.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Tinh Phách</span>
                <span className="text-purple-300 font-bold">+{towerFloorInfo.rewards.towerPoints}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Tinh Huyết</span>
                <span className="text-rose-300 font-bold">+{towerFloorInfo.rewards.tinhHuyet} (100%)</span>
              </div>
            </div>

            {towerFloorInfo.rewards.specialChest && (
              <div className="p-2 rounded bg-amber-950/30 border border-amber-700/40 text-[10px] text-amber-200 flex items-center gap-1.5 font-serif">
                <Gift className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>Vượt mốc tầng đặc biệt: Mở khóa <strong>[{towerFloorInfo.rewards.specialChest}]</strong> chứa Thần Binh Tàn Phiến & Mảnh Cổ Bảo!</span>
              </div>
            )}
          </div>

          {/* Các Mốc Trấn Ma Trọng Điểm */}
          <div className="p-3 bg-[#0e0e15] rounded-lg border border-purple-900/20 space-y-2">
            <span className="text-xs font-serif font-bold text-zinc-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-400" /> Các Mốc Phong Ấn Trọng Yếu:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
              {[10, 25, 50, 100].map(floor => (
                <div
                  key={floor}
                  className={`p-2 rounded border ${
                    currentTowerFloor > floor
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                      : currentTowerFloor === floor
                      ? 'bg-purple-950/40 border-purple-600/50 text-purple-200 animate-pulse'
                      : 'bg-black/30 border-zinc-800/50 text-zinc-500'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>Tầng {floor}</span>
                    {currentTowerFloor > floor && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <div className="text-[9px] mt-0.5">
                    {floor === 10 ? 'Ma Quân Bậc 1' : floor === 25 ? 'Đại Yêu Chúa' : floor === 50 ? 'Thiên Vực Ma Tôn' : 'Thái Sơ Ma Tổ'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CHẾ ĐỘ 3: MA THÚ XUẤT THẾ (WORLD BOSS) */}
      {/* ======================================================== */}
      {battleMode === 'world_boss' && (
        <div className="space-y-3">
          {/* Card Ma Thú Khổng Lồ */}
          <div className="p-3.5 rounded-lg bg-gradient-to-r from-red-950/50 via-[#180909] to-amber-950/40 border border-red-800/40 space-y-3 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Skull className="w-4 h-4 text-red-500" />
                  <h4 className="font-serif font-bold text-sm text-rose-200">
                    {WORLD_BOSS_CONFIG.name}
                  </h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950/80 text-rose-300 border border-red-700/60 font-mono">
                    Hệ {ELEMENT_NAMES[WORLD_BOSS_CONFIG.element]}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-serif italic mt-0.5">
                  "{WORLD_BOSS_CONFIG.title}"
                </p>
              </div>

              <button
                onClick={() => executeCombatSimulation('world_boss', {
                  name: WORLD_BOSS_CONFIG.name,
                  realm: WORLD_BOSS_CONFIG.realmLevel,
                  power: WORLD_BOSS_CONFIG.power,
                  element: WORLD_BOSS_CONFIG.element,
                  difficulty: 'legendary'
                })}
                className="px-3 py-2 rounded bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 hover:brightness-110 text-white font-serif font-bold text-xs shadow-[0_0_12px_rgba(225,29,72,0.4)] transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Dồn Lực Trảm Ma (-35 MP)</span>
              </button>
            </div>

            {/* Thanh Khí Huyết Ma Thú */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                <span className="text-rose-300">Khí Huyết Sinh Mệnh Hung Thú:</span>
                <span className="text-rose-200 font-bold">
                  {Math.max(0, WORLD_BOSS_CONFIG.maxHp - worldBossDamage).toLocaleString()} / {WORLD_BOSS_CONFIG.maxHp.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-red-900/50">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-300 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                  style={{
                    width: `${Math.max(0, Math.min(100, Math.floor(((WORLD_BOSS_CONFIG.maxHp - worldBossDamage) / WORLD_BOSS_CONFIG.maxHp) * 100)))}%`
                  }}
                />
              </div>
            </div>

            {/* Thống kê sát thương người chơi */}
            <div className="p-2 rounded bg-black/40 border border-red-900/30 flex justify-between items-center text-[10px] font-mono">
              <span className="text-zinc-400">Sát thương tích lũy của đạo hữu:</span>
              <span className="text-amber-300 font-bold text-xs">{worldBossDamage.toLocaleString()} ST</span>
            </div>
          </div>

          {/* Danh Sách Mốc Thưởng Sát Thương */}
          <div className="space-y-2">
            <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5 px-1">
              <Gift className="w-3.5 h-3.5 text-amber-400" /> Mốc Thưởng Sát Thương Tích Lũy:
            </span>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
              {WORLD_BOSS_CONFIG.milestones.map((ms, idx) => {
                const isReached = worldBossDamage >= ms.damageReq;
                const isClaimed = claimedMilestones.includes(idx);

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border transition flex items-center justify-between gap-2 ${
                      isClaimed
                        ? 'bg-zinc-900/50 border-zinc-800 text-zinc-500'
                        : isReached
                        ? 'bg-gradient-to-r from-amber-950/40 to-[#140b0b] border-amber-600/50 shadow-sm'
                        : 'bg-[#0e0e15] border-zinc-800/50'
                    }`}
                  >
                    <div>
                      <div className="font-serif font-bold text-xs text-amber-200 flex items-center gap-1.5">
                        <span>{ms.title}</span>
                        {isClaimed && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded font-mono">
                            Đã Nhận
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">
                        {ms.rewards.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleClaimWorldBossReward(idx)}
                      disabled={!isReached || isClaimed}
                      className={`px-3 py-1.5 rounded font-serif font-bold text-[11px] transition cursor-pointer shrink-0 ${
                        isClaimed
                          ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                          : isReached
                          ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:brightness-110 text-white shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      {isClaimed ? 'Đã Nhận' : isReached ? 'Lĩnh Thưởng' : 'Chưa Đạt'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CHẾ ĐỘ 4: THIÊN KIÊU BẢNG (SIMULATED ASYNC PVP LADDER) */}
      {/* ======================================================== */}
      {battleMode === 'pvp_ladder' && (
        <PvPLadderView
          player={player}
          onUpdatePlayer={onUpdatePlayer}
          onShowToast={onShowToast}
          onAddLog={onAddLog}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL CHIẾN BÁO ĐỐI KHÁNG TRỰC QUAN (INTERACTIVE COMBAT MODAL) */}
      {/* ======================================================== */}
      {combatModalOpen && currentReport && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className={`cophong-card w-full max-w-2xl bg-[#0c0c14] border border-amber-700/40 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col max-h-[92vh] ${isScreenShaking ? 'animate-screen-shake-subtle' : ''}`}>
            {/* Header Modal */}
            <div className="p-3.5 border-b border-amber-900/30 flex justify-between items-center bg-gradient-to-r from-amber-950/40 via-[#140f0c] to-amber-950/30">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-amber-200 text-sm tracking-wide">
                  CHIẾN BÁO ĐỐI KHÁNG THÍ LUYỆN
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/50 border border-amber-800/40 text-amber-300 font-mono">
                  {currentModalMode === 'tower' ? 'Trấn Ma Tháp' : currentModalMode === 'world_boss' ? 'Ma Thú Thế Giới' : 'Trảm Yêu'}
                </span>
              </div>
              <button
                onClick={handleConfirmCombatFinish}
                className="text-zinc-400 hover:text-zinc-200 p-1 rounded hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Vùng đối đầu 2 Cột: Nhân Vật vs Boss (Kèm Floating Numbers & Slash) */}
            <div className="p-3 sm:p-4 border-b border-zinc-800/80 bg-black/50 grid grid-cols-2 gap-3 sm:gap-4 relative overflow-hidden">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-red-950/90 border border-red-500/70 flex items-center justify-center font-serif font-black text-xs text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.6)]">
                VS
              </div>

              {/* CỘT TRÁI: NHÂN VẬT */}
              <div className="relative space-y-2 p-2.5 rounded-xl bg-gradient-to-b from-blue-950/30 via-[#0e121e]/40 to-transparent border border-blue-900/40 shadow-sm overflow-hidden">
                <FloatingDamageOverlay
                  popups={playerPopups}
                  isSlashing={playerSlashing}
                  slashIsCrit={playerSlashCrit}
                />

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-600/50 flex items-center justify-center text-lg shadow-[0_0_10px_rgba(59,130,246,0.3)] shrink-0">
                    🧘
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-serif font-bold text-xs text-blue-200 truncate">
                      {player.tongMon ? `${player.tongMon} Đạo Hữu` : 'Bản Thể Đạo Hữu'}
                    </div>
                    <div className="text-[9px] text-zinc-400 font-mono">
                      Cảnh Giới Tầng {player.currentRealm}
                    </div>
                  </div>
                </div>

                {/* Dị Tượng Lĩnh Vực HUD Badges */}
                {currentReport.activeResonances && currentReport.activeResonances.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    {currentReport.activeResonances.map((res: any) => (
                      <div
                        key={res.resonanceId}
                        title={`【Dị Tượng: ${res.name}】: ${res.effectDescription}`}
                        className="group relative px-1.5 py-0.5 rounded bg-black/70 border border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.4)] flex items-center gap-1 cursor-help text-[9px] font-serif"
                      >
                        <span className="text-[10px]">{res.auraVisual?.icon || '🌟'}</span>
                        <span className="text-amber-200 font-bold hidden sm:inline">{res.name}</span>
                        {/* Tooltip hover */}
                        <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-30 w-48 p-2 rounded bg-black/95 border border-amber-500/60 text-[10px] text-zinc-200 shadow-xl font-sans">
                          <div className="font-serif font-bold text-amber-300">
                            {res.auraVisual?.icon} 【Dị Tượng: {res.name}】
                          </div>
                          <p className="text-[9px] text-zinc-400 mt-0.5">{res.effectDescription}</p>
                          <div className="text-[8px] text-zinc-500 mt-1 font-mono">
                            Thần Thông: {res.sourceSkillName} • Khí Linh: {res.spiritName}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* HP Nhân Vật với SmoothHealthBar 2 Lớp */}
                <SmoothHealthBar
                  currentHp={currentReport.rounds[selectedRoundIndex]?.playerHpAfter ?? currentReport.finalPlayerHp}
                  maxHp={currentReport.playerMaxHp}
                  label="Sinh Lực"
                  barColor="bg-gradient-to-r from-emerald-500 via-sky-500 to-blue-500"
                  trailingColor="bg-amber-600/60"
                  heightClass="h-2"
                />

                <div className="text-[9px] font-mono text-zinc-400 flex justify-between pt-0.5">
                  <span>Chân Nguyên: <strong className="text-cyan-300">{player.linhLuc || 0} MP</strong></span>
                  <span>Lực Chiến: <strong className="text-amber-300">{combatPower.toLocaleString()}</strong></span>
                </div>
              </div>

              {/* CỘT PHẢI: MA THÚ */}
              <div className="relative space-y-2 p-2.5 rounded-xl bg-gradient-to-b from-red-950/30 via-[#180e12]/40 to-transparent border border-red-900/40 shadow-sm overflow-hidden">
                <FloatingDamageOverlay
                  popups={bossPopups}
                  isSlashing={bossSlashing}
                  slashIsCrit={bossSlashCrit}
                />

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-600/50 flex items-center justify-center text-lg shadow-[0_0_10px_rgba(239,68,68,0.3)] shrink-0">
                    {getBossAvatar(currentModalMode, currentReport.bossName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-serif font-bold text-xs text-rose-200 truncate">
                        {currentReport.bossName}
                      </span>
                      <span className={`text-[8px] px-1 py-0.2 rounded border font-mono shrink-0 ${ELEMENT_COLORS[currentReport.bossElement]}`}>
                        {ELEMENT_ICONS[currentReport.bossElement]}
                      </span>
                    </div>
                    <div className="text-[9px] text-zinc-400 font-mono">
                      Cảnh Giới Tầng {currentReport.bossRealm} • {ELEMENT_NAMES[currentReport.bossElement]}
                    </div>
                  </div>
                </div>

                {/* HP Boss với SmoothHealthBar 2 Lớp */}
                <SmoothHealthBar
                  currentHp={currentReport.rounds[selectedRoundIndex]?.bossHpAfter ?? currentReport.finalBossHp}
                  maxHp={currentReport.bossMaxHp}
                  label="Ma Khí"
                  barColor="bg-gradient-to-r from-red-600 via-rose-500 to-amber-400"
                  trailingColor="bg-amber-600/70"
                  heightClass="h-2"
                />

                <div className="text-[9px] font-mono text-zinc-400 flex justify-between pt-0.5">
                  <span>Phẩm Cấp: <strong className="text-purple-300">{currentReport.bossDifficulty || 'Hung Thú'}</strong></span>
                  <span>Thuộc Tính: <strong className="text-amber-300">{ELEMENT_NAMES[currentReport.bossElement]}</strong></span>
                </div>
              </div>
            </div>

            {/* Diễn biến theo hiệp (Round Switcher) */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
              <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-2 flex-wrap">
                {/* Điều khiển Auto-Play & Bỏ qua */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setAutoPlay(prev => !prev);
                      audioEngine.playClickSound(0.5);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-serif transition cursor-pointer border ${
                      autoPlay
                        ? 'bg-amber-950/80 border-amber-500/70 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                    }`}
                    title={autoPlay ? 'Tạm dừng tự động diễn biến' : 'Bật tự động diễn biến từng hiệp'}
                  >
                    {autoPlay ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-zinc-300" />}
                    <span>{autoPlay ? 'Tạm Dừng' : 'Tự Động'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowOutcome(true);
                      setAutoPlay(false);
                      audioEngine.playClickSound(0.5);
                      if (currentReport.victory) {
                        audioEngine.playBreakthroughSuccessSound(0.9);
                      }
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-serif transition cursor-pointer bg-zinc-900 hover:bg-amber-950/60 border border-zinc-700 hover:border-amber-600/50 text-amber-300"
                    title="Bỏ qua diễn biến và xem ngay kết quả"
                  >
                    <FastForward className="w-3 h-3 text-yellow-400" />
                    <span>Xem Kết Cục</span>
                  </button>
                </div>

                {/* Các nút Hiệp 1, Hiệp 2... */}
                <div className="flex gap-1 overflow-x-auto py-0.5 max-w-full">
                  {currentReport.rounds.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedRoundIndex(i);
                        setShowOutcome(false);
                        setAutoPlay(false);
                        audioEngine.playClickSound(0.5);
                      }}
                      className={`px-2.5 py-1 rounded text-[10px] font-serif transition cursor-pointer font-bold shrink-0 ${
                        selectedRoundIndex === i && !showOutcome
                          ? 'bg-amber-950/80 text-amber-200 border border-amber-600/50 shadow'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      Hiệp {r.round}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setShowOutcome(true);
                      setAutoPlay(false);
                      audioEngine.playClickSound(0.5);
                      if (currentReport.victory) {
                        audioEngine.playBreakthroughSuccessSound(0.9);
                      }
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-serif transition cursor-pointer font-bold shrink-0 ${
                      showOutcome
                        ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow'
                        : 'bg-zinc-900 text-amber-300 hover:text-amber-200 border border-zinc-800'
                    }`}
                  >
                    Kết Cục ⚡
                  </button>
                </div>
              </div>

              {/* BANNER TUYỆT KỸ HỢP KÍCH ĐẠO LỮ NẾU ĐƯỢC KÍCH HOẠT */}
              {currentReport.companionUltimateTriggered && (
                <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/60 via-purple-950/50 to-amber-950/60 border border-rose-500/70 shadow-[0_0_20px_rgba(244,63,94,0.3)] space-y-1.5 relative overflow-hidden animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{currentReport.companionAvatar || '✨'}</span>
                      <div>
                        <div className="text-[11px] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200 uppercase tracking-wide">
                          Tuyệt Kỹ Hợp Kích: {currentReport.companionUltimateName}
                        </div>
                        <div className="text-[9px] font-mono text-rose-300">
                          {currentReport.companionName} x Đạo Hữu Đồng Lực Hợp Nhất
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-rose-900/80 text-rose-200 border border-rose-500 font-serif font-bold uppercase shadow">
                      Hợp Kích Trợ Chiến
                    </span>
                  </div>
                  {currentReport.companionUltimateQuote && (
                    <div className="text-[10px] text-amber-200/90 font-serif italic pl-2 border-l-2 border-rose-400">
                      "{currentReport.companionUltimateQuote}"
                    </div>
                  )}
                  {currentReport.companionUltimateDesc && (
                    <div className="text-[9px] text-zinc-300 font-serif">
                      {currentReport.companionUltimateDesc}
                    </div>
                  )}
                </div>
              )}

              {/* Chi tiết hiệp đang chọn */}
              {!showOutcome && currentReport.rounds[selectedRoundIndex] && (() => {
                const roundLog = currentReport.rounds[selectedRoundIndex];
                return (
                  <div className="space-y-2.5 animate-in fade-in duration-150">
                    {/* Hành động nhân vật */}
                    <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-900/30 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-serif font-bold text-blue-300">
                        <span className="flex items-center gap-1.5">
                          <Swords className="w-3.5 h-3.5 text-blue-400" />
                          <span>Chiêu Thức Đạo Hữu (Hiệp {roundLog.round}):</span>
                        </span>
                        <span className="font-mono text-emerald-400">
                          -{roundLog.playerAction.damage.toLocaleString()} HP Boss
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-300 leading-relaxed font-serif">
                        {roundLog.playerAction.description}
                      </p>
                      {roundLog.playerAction.hpRegen ? (
                        <div className="text-[9px] text-rose-300 font-mono flex items-center gap-1 pt-0.5">
                          <Heart className="w-3 h-3 text-rose-400" />
                          <span>Kim Thân Hồi Phục: +{roundLog.playerAction.hpRegen.toLocaleString()} HP</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Phản đòn của Boss */}
                    <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-serif font-bold text-rose-300">
                        <span className="flex items-center gap-1.5">
                          <Skull className="w-3.5 h-3.5 text-rose-400" />
                          <span>Boss Phản Kích [{roundLog.bossAction.skillName}]:</span>
                        </span>
                        <span className="font-mono text-rose-400">
                          {roundLog.bossAction.damage > 0 ? `-${roundLog.bossAction.damage.toLocaleString()} HP Bản Thân` : 'Né Tránh / Vô Hại'}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-300 leading-relaxed font-serif">
                        {roundLog.bossAction.description}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* BẢNG TỔNG KẾT KẾT CỤC CHIẾN ĐẤU */}
              {showOutcome && (
                <div className="space-y-3 animate-in zoom-in-95 duration-200">
                  {currentReport.victory ? (
                    <div className="p-4 rounded-xl bg-gradient-to-b from-amber-950/40 via-[#18120c] to-amber-950/20 border border-amber-600/60 text-center space-y-3 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                      <div className="inline-flex p-2 rounded-full bg-amber-500/20 border border-amber-400/40 shadow-inner">
                        <Award className="w-8 h-8 text-yellow-400 animate-bounce" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-base text-amber-200 tracking-wide">
                          ⚔️ ĐẠI THẮNG QUANG VINH - TRẢM DIỆT MA THÚ!
                        </h4>
                        <p className="text-xs text-amber-300/80 font-serif mt-0.5">
                          Nguyên thần ma thú vỡ tan, trời quang mây tạnh, thiên địa phản hồi linh khí!
                        </p>
                      </div>

                      {/* Danh sách Chiến lợi phẩm nhận được */}
                      {currentReport.rewards && (
                        <div className="bg-black/50 p-3 rounded-lg border border-amber-900/40 text-[11px] font-mono space-y-2 text-left">
                          <div className="text-amber-400 font-serif font-bold flex items-center gap-1.5 border-b border-zinc-800 pb-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Chiến Lợi Phẩm Thu Nạp Vào Túi Trữ Vật:
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-zinc-300">
                            <span>✨ Tu Vi: <strong className="text-emerald-300">+{currentReport.rewards.tuVi.toLocaleString()}</strong></span>
                            <span>💎 Linh Thạch: <strong className="text-amber-300">+{currentReport.rewards.linhThach.toLocaleString()}</strong></span>
                            <span>🩸 Tinh Huyết Yêu Thú: <strong className="text-rose-300">+{currentReport.rewards.tinhHuyet} (100%)</strong></span>
                            <span>👑 Danh Vọng: <strong className="text-cyan-300">+{currentReport.rewards.danhVong}</strong></span>
                          </div>

                          {(currentReport.rewards.droppedOre || currentReport.rewards.droppedPill || currentReport.rewards.droppedManual) && (
                            <div className="pt-1.5 border-t border-zinc-800/60 space-y-1">
                              {currentReport.rewards.droppedOre && (
                                <div className="text-amber-300 flex items-center gap-1.5">
                                  <Package className="w-3 h-3 text-amber-400" />
                                  <span>Đoạt được Khoáng Vật: [{currentReport.rewards.droppedOre.name}] x{currentReport.rewards.droppedOre.quantity || 1}</span>
                                </div>
                              )}
                              {currentReport.rewards.droppedPill && (
                                <div className="text-emerald-300 flex items-center gap-1.5">
                                  <Package className="w-3 h-3 text-emerald-400" />
                                  <span>Nhặt được Đan Dược: [{currentReport.rewards.droppedPill.name}] x{currentReport.rewards.droppedPill.quantity || 1}</span>
                                </div>
                              )}
                              {currentReport.rewards.droppedManual && (
                                <div className="text-purple-300 flex items-center gap-1.5">
                                  <Package className="w-3 h-3 text-purple-400" />
                                  <span>Tịch thu Bí Tịch: [{currentReport.rewards.droppedManual.name}] ({currentReport.rewards.droppedManual.grade})</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-gradient-to-b from-red-950/40 via-[#180a0a] to-red-950/20 border border-red-700/60 text-center space-y-3">
                      <div className="inline-flex p-2 rounded-full bg-red-500/20 border border-red-500/40">
                        <AlertTriangle className="w-7 h-7 text-rose-400" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-base text-rose-300 tracking-wide">
                          💀 THẤT BẠI TRONG GIAO TRANH
                        </h4>
                        <p className="text-xs text-rose-300/80 font-serif mt-0.5">
                          Ma khí quá mức hung tàn, chân nguyên hao tổn, đạo hữu đành tạm lui bảo toàn tính mạng.
                        </p>
                      </div>

                      {/* Chẩn đoán chiến thuật */}
                      <div className="bg-black/50 p-3 rounded-lg border border-red-900/40 text-[11px] text-left space-y-1">
                        <div className="text-rose-400 font-serif font-bold flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-rose-400" /> Chẩn Đoán Căn Nguyên Bại Trận:
                        </div>
                        <p className="text-zinc-300 font-serif leading-relaxed text-[10px]">
                          {currentReport.lossReason || 'Lực chiến tổng thể chưa đủ áp chế ma thú.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-3 border-t border-amber-900/30 bg-[#0e0e15] flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-mono">
                {showOutcome ? 'Trận đấu kết thúc' : `Đang xem: Hiệp ${selectedRoundIndex + 1}/${currentReport.rounds.length}`}
              </span>

              <div className="flex gap-2">
                {!showOutcome && (
                  <button
                    onClick={() => {
                      if (selectedRoundIndex < currentReport.rounds.length - 1) {
                        setSelectedRoundIndex(prev => prev + 1);
                      } else {
                        setShowOutcome(true);
                      }
                    }}
                    className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-serif font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <span>Hiệp Tiếp →</span>
                  </button>
                )}

                <button
                  onClick={handleConfirmCombatFinish}
                  className="px-4 py-1.5 rounded bg-gradient-to-r from-amber-600 to-yellow-600 hover:brightness-110 text-white font-serif font-bold text-xs shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{currentReport.victory ? 'Thu Nạp Chiến Lợi Phẩm' : 'Dưỡng Thương Rút Lui'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleTab;
