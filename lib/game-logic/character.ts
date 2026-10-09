// lib/game-logic/character.ts
import {
  PlayerStats,
  LinhCanElement,
  EquippedManualSlots
} from '@/lib/types';
import { DEFAULT_MANUALS } from '@/lib/manuals-data';
import { rollRandomPhysiques, createDefaultPhysique } from '@/lib/physique-data';
import { GAME_CONSTANTS } from '@/lib/game-constants';
import {
  rollLinhCanOnReborn,
  ELEMENT_ICONS,
  ELEMENT_NAMES
} from '@/lib/elemental-system';
import { rollDestinyOnReborn } from '@/lib/destiny-data';
import { createDefaultLinhDien } from '@/lib/garden-data';
import { createDefaultSectState } from '@/lib/sect-data';
import { createDefaultStorageBag, createDefaultArtisanState } from '@/lib/inventory-data';
import { createDefaultMerchantState } from '@/lib/merchant-data';
import { STARTER_GEMS } from '@/lib/forging-gem-data';
import { createDefaultCompanionsState } from '@/lib/companions-data';
import { createDefaultAchievementsState } from '@/lib/achievements-data';
import { createDefaultStorylineState } from '@/lib/storyline-data';
import { createDefaultAbodeState } from '@/lib/abode-data';
import { createDefaultPhysiqueState } from '@/lib/physique-system-data';
import { createDefaultSoulState } from '@/lib/soul-data';
import { createDefaultTuViEmpowermentState } from '@/lib/tu-vi-empowerment-data';
import { getMaxKhiHuyet, getMaxLinhLuc } from './stats';


// SAVE/LOAD HELPERS
// ============================================

export function createNewPlayer(): PlayerStats {
  const canCot = GAME_CONSTANTS.STARTING_CAN_COT;
  const tamCanh = GAME_CONSTANTS.STARTING_TAM_CANH;
  const ngoTinh = GAME_CONSTANTS.STARTING_NGO_TINH;
  const currentRealm = 0;
  const initialPhysiques = rollRandomPhysiques();
  const primaryPhysique = initialPhysiques[0] || createDefaultPhysique();
  const initialRoot = rollLinhCanOnReborn();
  const initialDestiny = rollDestinyOnReborn();
  const maxHP = getMaxKhiHuyet(canCot, currentRealm, undefined, undefined, initialPhysiques, undefined, initialRoot, initialDestiny);
  const maxMP = getMaxLinhLuc(tamCanh, ngoTinh, currentRealm, undefined, undefined, undefined, initialRoot);
  
  return {
    tuVi: 0,
    canCot,
    ngoTinh,
    khiVan: GAME_CONSTANTS.STARTING_KHI_VAN,
    tamCanh,
    linhThach: GAME_CONSTANTS.STARTING_LINH_THACH,
    danhVong: 0,
    currentRealm,
    khiHuyet: maxHP,
    maxKhiHuyet: maxHP,
    linhLuc: maxMP,
    maxLinhLuc: maxMP,
    linhCan: initialRoot,
    physique: primaryPhysique,
    physiques: initialPhysiques,
    destiny: initialDestiny,
    equippedManuals: {},
    tinhHuyetYeuThu: 0,
    age: 16,
    maxLifespan: 100,
    lifespanPillsUsed: 0,
    isToaHoaWarning: false,
    inventory: {
      pills: [
        {
          id: 'pill_tich_coc',
          name: 'Tích Cốc Đan',
          grade: 'Nhất Giai',
          quality: 'thuong_pham',
          effectType: 'sustain',
          effectValue: 1,
          quantity: 10,
          description: 'Đan dược cơ bản giúp ích khí nạp thực, 1 viên no 1 năm mà không cần ăn uống ngũ cốc.'
        }
      ],
      herbs: [],
      ores: [],
      manuals: [],
      equipments: [],
      books: [],
      bags: [],
      gems: [...STARTER_GEMS],
      forgingEssence: 0
    },
    manuals: [],
    equipment: {},
    activeBuffs: {},
    linhDien: createDefaultLinhDien(),
    sectState: createDefaultSectState(),
    storageBag: createDefaultStorageBag(),
    alchemyArtisan: createDefaultArtisanState('alchemy', false),
    forgingArtisan: createDefaultArtisanState('forging', false),
    merchantState: createDefaultMerchantState(),
    companionsState: createDefaultCompanionsState(),
    achievementsState: createDefaultAchievementsState(),
    storylineState: createDefaultStorylineState(),
    abodeState: createDefaultAbodeState(),
    physiqueState: createDefaultPhysiqueState(),
    soulState: createDefaultSoulState(),
    dungeonRunState: null,
    auctionState: null,
    ancestralState: {
      activeBuff: null,
      totalOfferingsMade: 0,
      protectionTriggersCount: 0
    },
    customSectState: {
      isFounded: false,
      sectName: '',
      mountainName: '',
      doctrine: 'chinh_dao',
      reputation: 0,
      sectVault: { linhThach: 0, herbs: {}, ores: {}, lastHarvestTimestamp: Date.now() },
      disciples: [],
      chosenInheritorId: null,
      lastRecruitmentTimestamp: 0,
      facilities: { mainHallLevel: 1, herbGardenFacilityLevel: 1, mineralVeinFacilityLevel: 1, guardianArrayLevel: 1 }
    },
    tuViEmpowermentState: createDefaultTuViEmpowermentState(),
    craftingSupplySettings: {
      autoBuyMissing: false
    }
  };
}


