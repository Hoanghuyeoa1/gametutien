// lib/game-logic/stats.ts
import { PlayerStats, Manual, Physique } from '@/lib/types';
import { GAME_CONSTANTS, getMaxStatLimit } from '@/lib/game-constants';
import { calculateCombatStats } from '@/lib/destiny-data';
import { getBodyRefinementStats, getSoulCultivationStats } from '@/lib/body-soul-data';
import { getBondedCompanionBuffs } from '@/lib/companions-data';
import { getManualSynergy } from '@/lib/elemental-system';
import { TITLES_CONFIG } from '@/lib/achievements-data';
import { getItemQualityMultiplier } from '@/lib/item-quality-data';
import { getRefinementStatsBonus } from '@/lib/physique-data';
import { calculateTotalPhysiqueStats } from '@/lib/physique-logic';
import { calculateMeridianCombatBonuses } from '@/lib/tu-vi-empowerment-logic';
import { calculateLearnedManualsModifiers } from '@/lib/manuals-shop-logic';
import { calculateActiveBeastsBuffs } from '@/lib/beasts-shop-logic';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as { id: number }[];

// PLAYER STATE UPDATE
// ============================================

export function updatePlayerStats(
  player: PlayerStats,
  changes: Partial<PlayerStats>
): PlayerStats {
  const updated = { ...player };
  
  Object.keys(changes).forEach(key => {
    const k = key as keyof PlayerStats;
    if (changes[k] !== undefined) {
      if (typeof updated[k] === 'number' && typeof changes[k] === 'number') {
        const changeVal = changes[k] as number;
        if (!isNaN(changeVal) && Number.isFinite(changeVal)) {
          const curVal = isNaN(updated[k] as number) ? 0 : (updated[k] as number);
          (updated[k] as number) = curVal + changeVal;
          
          if (k === 'currentRealm') {
            (updated[k] as number) = Math.max(0, Math.min(realmsData.length - 1, Math.floor(updated[k] as number)));
          } else if (k === 'khiVan') {
            const maxCap = getMaxStatLimit(updated.currentRealm || 0);
            (updated[k] as number) = Math.max(GAME_CONSTANTS.MIN_STAT, updated[k] as number);
          } else if (k === 'canCot' || k === 'ngoTinh' || k === 'tamCanh') {
            const maxCap = getMaxStatLimit(updated.currentRealm || 0);
            (updated[k] as number) = Math.max(
              GAME_CONSTANTS.MIN_STAT,
              Math.min(maxCap, updated[k] as number)
            );
          }
          
          if (k === 'tuVi' || k === 'linhThach' || k === 'danhVong') {
            (updated[k] as number) = Math.max(0, updated[k] as number);
          }
        }
      }
    }
  });
  
  return updated;
}

// ============================================
// COMBAT POWER & ATTRIBUTE HELPERS
// ============================================

export function calculateCombatPower(player: PlayerStats): number {
  const realm = player.currentRealm;
  const realmPower = realm === 0 ? 500 : Math.floor(Math.pow(realm, 2.55) * 60);
  const statPower = (player.canCot * 50) + (player.ngoTinh * 35) + (player.tamCanh * 25);
  const tuViPower = Math.floor(player.tuVi / 100);
  
  let base = realmPower + statPower + tuViPower;
  
  // Equipment power + Gems & Affixes
  const equippedPowerItems = player.equipment || (player as any).equippedEquipment;
  if (equippedPowerItems) {
    Object.values(equippedPowerItems).forEach((eq: any) => {
      if (eq) {
        const qMult = getItemQualityMultiplier(eq.quality || 'thuong_pham');
        const atkVal = eq.equipmentStats?.atk || eq.stats?.atk || 0;
        const defVal = eq.equipmentStats?.def || eq.stats?.def || 0;
        const hpVal = eq.equipmentStats?.maxHp || eq.stats?.maxHp || 0;
        const spdVal = eq.equipmentStats?.speed || eq.stats?.speed || 0;
        const tierPower = (atkVal * 2) + (defVal * 2) + Math.floor(hpVal / 5) + (spdVal * 3);
        let eqPower = tierPower > 0
          ? Math.floor(tierPower * (1 + (eq.enhancement || 0) * 0.15))
          : Math.floor((eq.powerBonus || 0) * qMult * (1 + (eq.enhancement || 0) * 0.15));

        // Thêm chiến lực từ Linh Ngọc khảm nạm
        if (eq.sockets) {
          eq.sockets.forEach((s: any) => {
            if (s.gem?.statBonus) {
              const b = s.gem.statBonus;
              eqPower += (b.congKich || 0) * 2 + (b.phongNgu || 0) * 2 + Math.floor((b.maxKhiHuyet || 0) / 10) + (b.tocDo || 0) * 4;
            }
          });
        }

        // Thêm chiến lực từ Affixes tẩy luyện
        if (eq.affixes) {
          eq.affixes.forEach((a: any) => {
            eqPower += a.value * 20; // Mỗi % affix tăng 20 điểm chiến lực
          });
        }

        base += eqPower;
      }
    });
  }

  // Refinement power bonus from physique
  if (player.physique) {
    const { powerBonus } = getRefinementStatsBonus(player.physique.refinementStage, player.physique.refinementLevel);
    base += powerBonus;
  }

  // Thần Thông & Công Pháp power bonus (với Synergy bonus +50% nếu đã trang bị)
  let manualCombatBonusPercent = 0;
  if (player.manuals) {
    player.manuals.forEach((m: Manual) => {
      if (m.level > 0) {
        const isEquipped = player.equippedManuals && (
          player.equippedManuals.tamPhap === m.id ||
          player.equippedManuals.theThuat === m.id ||
          player.equippedManuals.thanThong1 === m.id ||
          player.equippedManuals.thanThong2 === m.id
        );
        const synergy = getManualSynergy(m, player.linhCan);
        const synergyMultiplier = (isEquipped && synergy.isSynergy) ? 1.5 : 1.0;

        if (m.powerBonusPerLevel) {
          base += Math.floor(m.level * m.powerBonusPerLevel * synergyMultiplier);
        }
        if (m.level >= m.maxLevel && m.maxLevelPassive?.combatBonusPercent) {
          manualCombatBonusPercent += m.maxLevelPassive.combatBonusPercent * synergyMultiplier;
        }
      }
    });
  }

  // Spirit Beasts combat power (Chiến Thú & Tọa Kỵ)
  const beastBuffs = calculateActiveBeastsBuffs(player);
  base += beastBuffs.combatPower;
  
  // Linh Căn damage bonus
  const linhCanMultiplier = player.linhCan ? (1 + player.linhCan.damageBonus / 100) : 1;
  
  // Thể chất (Physique) damage & crit bonus (cộng dồn đa thể chất)
  const activePhysiques = (player.physiques && player.physiques.length > 0)
    ? player.physiques
    : (player.physique ? [player.physique] : []);

  let totalPhysiqueDmgPercent = 0;
  let totalPhysiqueCritDmg = 0;
  for (const p of activePhysiques) {
    totalPhysiqueDmgPercent += (p.damageBonusPercent || 0);
    totalPhysiqueCritDmg += (p.critDamageBonus || 0);
  }

  const physiqueDamageMultiplier = 1 + (totalPhysiqueDmgPercent / 100);
  const critMultiplier = 1 + (totalPhysiqueCritDmg / 200);

  // Pill combat buff
  const pillBuffMultiplier = (player.activeBuffs?.combatBuffBattlesLeft && player.activeBuffs.combatBuffBattlesLeft > 0)
    ? (1 + (player.activeBuffs.combatBuffPercent || 20) / 100)
    : 1;

  const manualMultiplier = 1 + (manualCombatBonusPercent / 100);

  // Destiny (Mệnh Cách) ATK / Crit multiplier
  const destinyAtkMultiplier = player.destiny?.effects?.atkBonusPercent ? (1 + player.destiny.effects.atkBonusPercent / 100) : 1;
  const destinyCritMultiplier = player.destiny?.effects?.critDmgBonus ? (1 + player.destiny.effects.critDmgBonus / 200) : 1;

  // Learned Manuals (Công Pháp Cửu Giai) multiplier
  const manualMods = calculateLearnedManualsModifiers(player.manualsState?.learnedManualIds || []);
  const learnedManualMultiplier = 1 + ((manualMods.atkPercent || 0) / 100) + ((manualMods.critDmgPercent || 0) / 200);

  return Math.floor(base * linhCanMultiplier * physiqueDamageMultiplier * critMultiplier * pillBuffMultiplier * manualMultiplier * destinyAtkMultiplier * destinyCritMultiplier * learnedManualMultiplier);
}

export function getMaxKhiHuyet(
  canCot: number,
  currentRealm: number,
  equipment?: PlayerStats['equipment'],
  manuals?: PlayerStats['manuals'],
  physique?: Physique | Physique[],
  equippedManuals?: PlayerStats['equippedManuals'],
  linhCan?: PlayerStats['linhCan'],
  destiny?: PlayerStats['destiny'],
  bodyRefinement?: PlayerStats['bodyRefinement'],
  companionsState?: PlayerStats['companionsState'],
  physiqueState?: PlayerStats['physiqueState'],
  tuViEmpowermentState?: PlayerStats['tuViEmpowermentState'],
  manualsState?: PlayerStats['manualsState'],
  beastsState?: PlayerStats['beastsState']
): number {
  let hp = 300 + (canCot * 25) + (currentRealm * 250);

  const physList: Physique[] = Array.isArray(physique)
    ? physique
    : (physique ? [physique] : []);

  // Bonus from Body Refinement (Tôi Thể) - lấy từ thể chất chủ tu
  if (physList[0]) {
    const { hpBonus } = getRefinementStatsBonus(physList[0].refinementStage, physList[0].refinementLevel);
    hp += hpBonus;
  }

  // Bonus từ Cảnh Giới Nhục Thân (Hệ Thống Thể Tu Mở Rộng)
  if (bodyRefinement) {
    const { hpBonus } = getBodyRefinementStats(bodyRefinement);
    hp += hpBonus;
  }

  // Bonus từ Huyền Công Luyện Thể (Expanded Physique System)
  if (physiqueState) {
    const pStats = calculateTotalPhysiqueStats(physiqueState);
    if (pStats.hp) {
      hp += pStats.hp;
    }
  }

  if (equipment) {
    Object.values(equipment).forEach((eq: any) => {
      const explicitHp = eq?.equipmentStats?.maxHp || eq?.stats?.maxHp;
      if (explicitHp) {
        const enhanceMod = 1 + (eq.enhancement || 0) * 0.15;
        hp += Math.floor(explicitHp * enhanceMod);
      } else if (eq?.hpBonus) {
        const qMult = getItemQualityMultiplier(eq.quality || 'thuong_pham');
        hp += Math.floor(eq.hpBonus * qMult * (1 + (eq.enhancement || 0) * 0.15));
      }
      // Khí Huyết từ Linh Ngọc khảm nạp
      if (eq?.sockets) {
        eq.sockets.forEach((s: any) => {
          if (s.gem?.statBonus?.maxKhiHuyet) {
            hp += s.gem.statBonus.maxKhiHuyet;
          }
        });
      }
    });
  }

  let hpPercentBonus = 0;
  if (manuals) {
    manuals.forEach((m: Manual) => {
      if (m.type === 'the_thuat' && m.level > 0) {
        const isEquipped = equippedManuals?.theThuat === m.id;
        const synergy = getManualSynergy(m, linhCan);
        const synergyMultiplier = (isEquipped && synergy.isSynergy) ? 1.5 : 1.0;

        if (m.hpBonusPerLevel) hp += Math.floor(m.level * m.hpBonusPerLevel * synergyMultiplier);
        if (m.level >= m.maxLevel && m.maxLevelPassive?.hpPercentBonus) {
          hpPercentBonus += m.maxLevelPassive.hpPercentBonus * synergyMultiplier;
        }
      }
    });
  }

  // Physique HP bonus percentage (cộng dồn toàn bộ thể chất)
  for (const p of physList) {
    if (p.hpBonusPercent) {
      hpPercentBonus += p.hpBonusPercent;
    }
  }

  // Destiny HP bonus (Hoang Cổ Thánh Thể mệnh cách x2 = +100%)
  if (destiny?.effects?.hpBonusPercent) {
    hpPercentBonus += destiny.effects.hpBonusPercent;
  }

  // Companion Buffs HP bonus (Long Thiền Nhi kết duyên +25% HP tối đa)
  if (companionsState) {
    const compBuffs = getBondedCompanionBuffs({ companionsState } as PlayerStats);
    if (compBuffs.hpBonusPercent) {
      hpPercentBonus += compBuffs.hpBonusPercent;
    }
  }

  // Meridian HP bonus (Nhâm Mạch: Thần Khí Quy Nguyên)
  if (tuViEmpowermentState) {
    const meridianBonuses = calculateMeridianCombatBonuses(tuViEmpowermentState);
    if (meridianBonuses.maxHpPercent) {
      hpPercentBonus += meridianBonuses.maxHpPercent;
    }
  }

  // Learned Manuals HP bonus (Hộ Thể Cương Khí: Kim Cương Bất Hoại Thể...)
  if (manualsState?.learnedManualIds?.length) {
    const manualMods = calculateLearnedManualsModifiers(manualsState.learnedManualIds);
    if (manualMods.maxHpPercent) {
      hpPercentBonus += manualMods.maxHpPercent;
    }
  }

  // Spirit Beasts HP bonus (Hộ Thể Ngự Thú: Thiềm Thừ, Băng Tinh Hùng, Cự Ngao, Huyền Vũ...)
  if (beastsState) {
    const beastBuffs = calculateActiveBeastsBuffs({ beastsState } as PlayerStats);
    if (beastBuffs.hpBonusFlat > 0) {
      hp += beastBuffs.hpBonusFlat;
    }
  }

  if (hpPercentBonus > 0) {
    hp = Math.floor(hp * (1 + hpPercentBonus / 100));
  }
  return hp;
}

export function getMaxLinhLuc(
  tamCanh: number,
  ngoTinh: number,
  currentRealm: number,
  equipment?: PlayerStats['equipment'],
  manuals?: PlayerStats['manuals'],
  equippedManuals?: PlayerStats['equippedManuals'],
  linhCan?: PlayerStats['linhCan']
): number {
  let mp = 150 + (tamCanh * 15) + (ngoTinh * 10) + (currentRealm * 150);
  if (equipment) {
    Object.values(equipment).forEach(eq => {
      if (eq?.mpBonus) {
        const qMult = getItemQualityMultiplier(eq.quality || 'thuong_pham');
        mp += Math.floor(eq.mpBonus * qMult * (1 + eq.enhancement * 0.15));
      }
      // Chân Nguyên từ Linh Ngọc khảm nạp
      if (eq?.sockets) {
        eq.sockets.forEach(s => {
          if (s.gem?.statBonus?.maxLinhLuc) {
            mp += s.gem.statBonus.maxLinhLuc;
          }
        });
      }
    });
  }
  if (manuals) {
    manuals.forEach((m: Manual) => {
      if (m.type === 'tam_phap' && m.level > 0 && m.mpBonusPerLevel) {
        const isEquipped = equippedManuals?.tamPhap === m.id;
        const synergy = getManualSynergy(m, linhCan);
        const synergyMultiplier = (isEquipped && synergy.isSynergy) ? 1.5 : 1.0;
        mp += Math.floor(m.level * m.mpBonusPerLevel * synergyMultiplier);
      }
    });
  }
  return mp;
}

// ============================================
