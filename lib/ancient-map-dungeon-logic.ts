// lib/ancient-map-dungeon-logic.ts
// Pure Business Logic Phân Hệ "Mảnh Tàn Đồ Kỳ Ngộ & Thượng Cổ Bí Cảnh"
// (Secret Realm Map Fragments & Ancient Dungeons Engine)

import {
  FragmentDirection,
  AncientDungeonTier,
  MapFragmentItem,
  CompleteAncientMapItem,
  AncientDungeonStage,
  GuaranteedDivineReward,
  AncientDungeonInstance,
  AncientMapVaultState,
  AncientMapSetDefinition
} from '@/lib/types/ancient-map-dungeon';
import { PlayerStats, Boss, Equipment } from '@/lib/types';
import { MeditationStanceType } from '@/lib/types/meditation';
import { battleBoss, BattleResult } from '@/lib/game-logic/combat';

// ============================================================================
// 1. DANH MỤC CÁC BỘ TÀN ĐỒ & THƯỢNG CỔ BÍ CẢNH (REGISTRY)
// ============================================================================
export const ANCIENT_MAP_SETS_REGISTRY: Record<string, AncientMapSetDefinition> = {
  // Bộ 1: Thái Cổ Kiếm Chủng (Tier 2 - Kim Đan Sơ Kỳ / Index 16)
  thai_co_kiem_chung: {
    id: 'thai_co_kiem_chung',
    name: 'Thái Cổ Kiếm Chủng Tàn Đồ',
    shortName: 'Thái Cổ Kiếm Chủng',
    tier: 2,
    targetDungeonName: 'Thái Cổ Kiếm Chủng Bí Cảnh',
    requiredRealmIndex: 16, // Kim Đan Sơ Kỳ
    realmRequirementName: 'Kim Đan Sơ Kỳ',
    synthesisCostStones: 5000,
    description: 'Thượng cổ kiếm trủng chôn vùi vạn thanh thần kiếm, ẩn chứa tàn niệm vô thượng của Kiếm Tổ.',
    fragments: {
      dong: {
        id: 'frag_kiem_chung_dong',
        setId: 'thai_co_kiem_chung',
        setName: 'Thái Cổ Kiếm Chủng',
        direction: 'dong',
        pieceIndex: 1,
        rarityTier: 2,
        dropRateWeight: 25,
        description: 'Mảnh Đông ghi chép trận đồ dẫn đường vào Kiếm Trủng.',
        lore: 'Đông Phương Thanh Long Kiếm Trận, kiếm khí như lôi.'
      },
      tay: {
        id: 'frag_kiem_chung_tay',
        setId: 'thai_co_kiem_chung',
        setName: 'Thái Cổ Kiếm Chủng',
        direction: 'tay',
        pieceIndex: 2,
        rarityTier: 2,
        dropRateWeight: 25,
        description: 'Mảnh Tây ghi lại cấm chế hộ sơn của Thần Kiếm Thao Thiết.',
        lore: 'Tây Phương Bạch Hổ Sát Khí, vạn binh quy tông.'
      },
      nam: {
        id: 'frag_kiem_chung_nam',
        setId: 'thai_co_kiem_chung',
        setName: 'Thái Cổ Kiếm Chủng',
        direction: 'nam',
        pieceIndex: 3,
        rarityTier: 2,
        dropRateWeight: 25,
        description: 'Mảnh Nam chỉ dẫn lối vào Cổ Kiếm Trận Đài.',
        lore: 'Nam Phương Chu Tước Chân Hỏa, tôi luyện phôi kiếm ngàn năm.'
      },
      bac: {
        id: 'frag_kiem_chung_bac',
        setId: 'thai_co_kiem_chung',
        setName: 'Thái Cổ Kiếm Chủng',
        direction: 'bac',
        pieceIndex: 4,
        rarityTier: 2,
        dropRateWeight: 25,
        description: 'Mảnh Bắc khắc họa Thần Niệm Kiếm Tổ và bí quyết mở quan kiếm cốt.',
        lore: 'Bắc Phương Huyền Vũ Kiếm Giáp, bất phá bất diệt.'
      }
    },
    stagesConfig: [
      {
        stageIndex: 1,
        stageName: 'Ải 1: Cổ Kiếm Trận Đài',
        enemyName: 'Cổ Thần Kiếm Trận Linh',
        enemyTitle: 'Hộ Trận Trận Linh',
        enemyRealm: 16,
        enemyStats: {
          hp: 25000,
          maxHp: 25000,
          atk: 650,
          def: 350,
          speed: 120,
          critRate: 10
        },
        specialAura: 'Vạn Kiếm Quy Tông: Kiếm khí hộ thân giảm 15% thương tổn nhận vào.'
      },
      {
        stageIndex: 2,
        stageName: 'Ải 2: Thần Kiếm Thao Thiết',
        enemyName: 'Kiếm Thú Thao Thiết',
        enemyTitle: 'Thủ Hộ Dị Thú',
        enemyRealm: 18,
        enemyStats: {
          hp: 45000,
          maxHp: 45000,
          atk: 950,
          def: 500,
          speed: 135,
          critRate: 15
        },
        specialAura: 'Thôn Phệ Kiếm Khí: Tăng 20% sát thương bạo kích.'
      },
      {
        stageIndex: 3,
        stageName: 'Ải 3: Kiếm Tổ Quan Mộ',
        enemyName: 'Thái Cổ Kiếm Tổ Tàn Niệm',
        enemyTitle: 'Tàn Niệm Tiên Nhân (Boss)',
        enemyRealm: 20,
        enemyStats: {
          hp: 85000,
          maxHp: 85000,
          atk: 1450,
          def: 750,
          speed: 150,
          critRate: 20
        },
        specialAura: 'Tru Tiên Tuyệt Diệt: Đòn đánh mang theo kiếm khí đoạn tuyệt sinh cơ.'
      }
    ],
    guaranteedRewards: {
      equipmentId: 'wp_thai_co_tru_tien_kiem',
      equipmentName: 'Thái Cổ Tru Tiên Kiếm (Phôi)',
      divineWeaponType: 'Thần Binh Độc Bản',
      equipmentSlot: 'weapon',
      equipmentStats: {
        powerBonus: 3500,
        atkBonus: 850,
        hpBonus: 3500,
        mpBonus: 1000,
        speedBonus: 45,
        critRateBonus: 15,
        critDmgBonus: 35,
        description: 'Thần binh truyền thừa từ Thái Cổ Kiếm Chủng, kiếm khí ngút trời, đoạn tuyệt vạn dặm sinh cơ.'
      },
      spiritStones: 50000,
      rareMaterials: [
        { id: 'ore_huyen_thiet_co', name: 'Thái Cổ Huyền Thiết', amount: 5 },
        { id: 'ore_chan_long_cot', name: 'Chân Long Cốt', amount: 2 }
      ]
    }
  },

  // Bộ 2: Chân Long Di Tích (Tier 3 - Nguyên Anh Sơ Kỳ / Index 21)
  chan_long_di_tich: {
    id: 'chan_long_di_tich',
    name: 'Chân Long Di Tích Cổ Quyển',
    shortName: 'Chân Long Di Tích',
    tier: 3,
    targetDungeonName: 'Chân Long Di Tích Động Thiên',
    requiredRealmIndex: 21, // Nguyên Anh Sơ Kỳ
    realmRequirementName: 'Nguyên Anh Sơ Kỳ',
    synthesisCostStones: 15000,
    description: 'Bản đồ dẫn tới long huyệt của Thượng Cổ Chân Long, nơi lắng đọng Long Châu bất diệt.',
    fragments: {
      dong: {
        id: 'frag_chan_long_dong',
        setId: 'chan_long_di_tich',
        setName: 'Chân Long Di Tích',
        direction: 'dong',
        pieceIndex: 1,
        rarityTier: 3,
        dropRateWeight: 25,
        description: 'Mảnh Đông khắc họa Long Môn và thềm ngọc tiến cảnh.',
        lore: 'Ngư Dược Long Môn, huyết mạch thức tỉnh.'
      },
      tay: {
        id: 'frag_chan_long_tay',
        setId: 'chan_long_di_tich',
        setName: 'Chân Long Di Tích',
        direction: 'tay',
        pieceIndex: 2,
        rarityTier: 3,
        dropRateWeight: 25,
        description: 'Mảnh Tây ghi chép lối tắt qua Ma Long Quật.',
        lore: 'U Minh Nghịch Lân, xúc phạm tất tru.'
      },
      nam: {
        id: 'frag_chan_long_nam',
        setId: 'chan_long_di_tich',
        setName: 'Chân Long Di Tích',
        direction: 'nam',
        pieceIndex: 3,
        rarityTier: 3,
        dropRateWeight: 25,
        description: 'Mảnh Nam đánh dấu phong ấn Hỏa Long Trì.',
        lore: 'Xích Viêm Long Tức, thiêu đốt nhật nguyệt.'
      },
      bac: {
        id: 'frag_chan_long_bac',
        setId: 'chan_long_di_tich',
        setName: 'Chân Long Di Tích',
        direction: 'bac',
        pieceIndex: 4,
        rarityTier: 3,
        dropRateWeight: 25,
        description: 'Mảnh Bắc chỉ đường tới Long Cung Chân Điện nơi ngự Long Châu.',
        lore: 'Cửu Thiên Long Ngâm, vạn thú thần phục.'
      }
    },
    stagesConfig: [
      {
        stageIndex: 1,
        stageName: 'Ải 1: Long Huyết Cổ Trận',
        enemyName: 'Long Huyết Thạch Cự Nhân',
        enemyTitle: 'Hộ Vệ Cổ Trận',
        enemyRealm: 21,
        enemyStats: {
          hp: 60000,
          maxHp: 60000,
          atk: 1200,
          def: 800,
          speed: 130,
          critRate: 12
        },
        specialAura: 'Thạch Giáp Long Khí: Phòng ngự cực kỳ kiên cố.'
      },
      {
        stageIndex: 2,
        stageName: 'Ải 2: Hắc Huyết Long Xà',
        enemyName: 'Thái Cổ Ma Long Xà',
        enemyTitle: 'Thủ Hộ Dị Thú',
        enemyRealm: 23,
        enemyStats: {
          hp: 110000,
          maxHp: 110000,
          atk: 1800,
          def: 1100,
          speed: 150,
          critRate: 18
        },
        specialAura: 'Kịch Độc Long Diễm: Ăn mòn chân nguyên đối thủ mỗi lượt.'
      },
      {
        stageIndex: 3,
        stageName: 'Ải 3: Chân Long Hóa Thân',
        enemyName: 'Thái Hư Chân Long Tàn Hồn',
        enemyTitle: 'Chân Long Tàn Hồn (Boss)',
        enemyRealm: 25,
        enemyStats: {
          hp: 220000,
          maxHp: 220000,
          atk: 2600,
          def: 1600,
          speed: 175,
          critRate: 25
        },
        specialAura: 'Chân Long Long Uy: Trấn áp tinh thần, công thủ toàn diện.'
      }
    ],
    guaranteedRewards: {
      equipmentId: 'art_thai_hu_long_chau',
      equipmentName: 'Thái Hư Long Châu',
      divineWeaponType: 'Dị Bảo Thiên Giai',
      equipmentSlot: 'artifact',
      equipmentStats: {
        powerBonus: 5800,
        atkBonus: 400,
        defBonus: 600,
        hpBonus: 15000,
        mpBonus: 5000,
        speedBonus: 60,
        critRateBonus: 10,
        critDmgBonus: 20,
        description: 'Chân Long Nội Đan lưu lại từ thượng cổ di tích, tỏa ra hào quang Chân Long Hộ Thể, hóa giải thương tổn.'
      },
      spiritStones: 120000,
      rareMaterials: [
        { id: 'ore_hon_don_tinh', name: 'Hỗn Độn Tinh Thạch', amount: 3 },
        { id: 'herb_thai_so_than_thao', name: 'Thái Sơ Thần Thảo', amount: 2 }
      ]
    }
  },

  // Bộ 3: Hỗn Độn Tiên Phủ (Tier 4 - Hóa Thần Sơ Kỳ / Index 26)
  hon_don_tien_phu: {
    id: 'hon_don_tien_phu',
    name: 'Hỗn Độn Tiên Phủ Bí Lục',
    shortName: 'Hỗn Độn Tiên Phủ',
    tier: 4,
    targetDungeonName: 'Hỗn Độn Tiên Phủ Cung Khuyết',
    requiredRealmIndex: 26, // Hóa Thần Sơ Kỳ
    realmRequirementName: 'Hóa Thần Sơ Kỳ',
    synthesisCostStones: 30000,
    description: 'Mật lục thái sơ mở ra Hỗn Độn Tiên Phủ trôi dạt giữa hư không vết nứt thời gian.',
    fragments: {
      dong: {
        id: 'frag_hon_don_dong',
        setId: 'hon_don_tien_phu',
        setName: 'Hỗn Độn Tiên Phủ',
        direction: 'dong',
        pieceIndex: 1,
        rarityTier: 4,
        dropRateWeight: 25,
        description: 'Mảnh Đông mở lối Vô Cực Môn.',
        lore: 'Vô Cực sinh Thái Cực, Tiên Khí lượn lờ.'
      },
      tay: {
        id: 'frag_hon_don_tay',
        setId: 'hon_don_tien_phu',
        setName: 'Hỗn Độn Tiên Phủ',
        direction: 'tay',
        pieceIndex: 2,
        rarityTier: 4,
        dropRateWeight: 25,
        description: 'Mảnh Tây định vị Hư Không Toái Phiến.',
        lore: 'Không Gian Liệt Phùng, vạn vật giai không.'
      },
      nam: {
        id: 'frag_hon_don_nam',
        setId: 'hon_don_tien_phu',
        setName: 'Hỗn Độn Tiên Phủ',
        direction: 'nam',
        pieceIndex: 3,
        rarityTier: 4,
        dropRateWeight: 25,
        description: 'Mảnh Nam khắc ấn Thái Sơ Thần Viêm Đàn.',
        lore: 'Hỗn Độn Chân Hỏa, luyện hóa chư thiên.'
      },
      bac: {
        id: 'frag_hon_don_bac',
        setId: 'hon_don_tien_phu',
        setName: 'Hỗn Độn Tiên Phủ',
        direction: 'bac',
        pieceIndex: 4,
        rarityTier: 4,
        dropRateWeight: 25,
        description: 'Mảnh Bắc giải mã Tiên Phủ Hạch Tâm nơi phong ấn Khai Thiên Phủ.',
        lore: 'Hỗn Độn Sơ Khai, thiên địa phân minh.'
      }
    },
    stagesConfig: [
      {
        stageIndex: 1,
        stageName: 'Ải 1: Hỗn Độn Trận Khôi',
        enemyName: 'Hỗn Độn Trận Linh Thần Khôi',
        enemyTitle: 'Hộ Phủ Khôi Lỗi',
        enemyRealm: 26,
        enemyStats: {
          hp: 150000,
          maxHp: 150000,
          atk: 2500,
          def: 1800,
          speed: 160,
          critRate: 15
        },
        specialAura: 'Thái Cực Bất Diệt: Kháng 20% sát thương ngũ hành.'
      },
      {
        stageIndex: 2,
        stageName: 'Ải 2: Thao Ngưu Dị Thú',
        enemyName: 'Hỗn Độn Thao Ngưu Thần Thú',
        enemyTitle: 'Thủ Hộ Thần Thú',
        enemyRealm: 28,
        enemyStats: {
          hp: 280000,
          maxHp: 280000,
          atk: 3600,
          def: 2500,
          speed: 180,
          critRate: 22
        },
        specialAura: 'Man Hoang Chi Lực: Công kích mang theo chấn động hư không.'
      },
      {
        stageIndex: 3,
        stageName: 'Ải 3: Hỗn Độn Tiên Tôn',
        enemyName: 'Thái Sơ Tiên Tôn Tàn Niệm',
        enemyTitle: 'Tàn Niệm Tiên Tôn (Boss)',
        enemyRealm: 30,
        enemyStats: {
          hp: 550000,
          maxHp: 550000,
          atk: 5200,
          def: 3800,
          speed: 210,
          critRate: 30
        },
        specialAura: 'Khai Thiên Tịch Địa: Uy áp tuyệt đỉnh khiến đối phương tiêu hao gấp đôi chân nguyên.'
      }
    ],
    guaranteedRewards: {
      equipmentId: 'wp_hon_don_khai_thien_phu',
      equipmentName: 'Hỗn Độn Khai Thiên Phủ',
      divineWeaponType: 'Thần Binh Tối Thượng',
      equipmentSlot: 'weapon',
      equipmentStats: {
        powerBonus: 10500,
        atkBonus: 2200,
        defBonus: 1200,
        hpBonus: 25000,
        mpBonus: 8000,
        speedBonus: 90,
        critRateBonus: 25,
        critDmgBonus: 50,
        description: 'Khai thiên thần binh ẩn chứa khí Thái Sơ Hỗn Độn, một búa bổ ra khai thiên tịch địa.'
      },
      spiritStones: 300000,
      rareMaterials: [
        { id: 'ore_hon_don_bang', name: 'Hỗn Độn Thần Băng', amount: 5 },
        { id: 'ore_bat_diet_tien_tinh', name: 'Bất Diệt Tiên Tinh', amount: 3 }
      ]
    }
  }
};

export const DIRECTIONS_ORDER: FragmentDirection[] = ['dong', 'tay', 'nam', 'bac'];

export const DIRECTION_NAMES: Record<FragmentDirection, string> = {
  dong: 'Đông',
  tay: 'Tây',
  nam: 'Nam',
  bac: 'Bắc'
};

// ============================================================================
// 2. KHỞI TẠO VAULT STATE AN TOÀN (DEFAULT STATE)
// ============================================================================
export function createDefaultAncientMapVault(): AncientMapVaultState {
  return {
    fragmentsInventory: {},
    synthesizedMaps: [],
    activeDungeon: null,
    clearedDungeonsCount: 0
  };
}

// ============================================================================
// 3. HÀM XÚC XẮC RƠI MẢNH KHI NHẬP ĐỊNH (ROLL MEDITATION FRAGMENT)
// ============================================================================
export function rollMeditationMapFragment(
  locationId: string,
  stance: MeditationStanceType,
  _hourIndex: number,
  playerRealmIndex: number,
  simulatedRoll?: number,
  simulatedSetId?: string,
  simulatedPieceIndex?: 1 | 2 | 3 | 4
): MapFragmentItem | null {
  // Tính tỷ lệ rơi cơ sở
  // Cơ sở: 3% (0.03)
  // Hiểm cảnh: tăng lên 6% (0.06)
  // Tại Thần Ma Cổ Chiến Trường hoặc Hỏa Diễm Thiên Sơn: cộng thêm 3% (+0.03)
  let dropChance = 0.03;
  if (stance === 'hiem_canh') {
    dropChance = 0.06;
  }
  if (locationId === 'than_ma_co_chien_truong' || locationId === 'hoa_diem_thien_son') {
    dropChance += 0.03;
  }

  const roll = simulatedRoll !== undefined ? simulatedRoll : Math.random();
  if (roll >= dropChance) {
    return null;
  }

  // Lọc các bộ di tích phù hợp với cảnh giới nhân vật
  const allSets = Object.values(ANCIENT_MAP_SETS_REGISTRY);
  // Cho phép rơi các bộ có requiredRealmIndex <= playerRealmIndex + 5 (hoặc tối thiểu là bộ tier 2)
  let eligibleSets = allSets.filter(s => playerRealmIndex >= Math.max(0, s.requiredRealmIndex - 5));
  if (eligibleSets.length === 0) {
    eligibleSets = [ANCIENT_MAP_SETS_REGISTRY.thai_co_kiem_chung];
  }

  // Chọn bộ di tích
  let chosenSet = eligibleSets[0];
  if (simulatedSetId && ANCIENT_MAP_SETS_REGISTRY[simulatedSetId]) {
    chosenSet = ANCIENT_MAP_SETS_REGISTRY[simulatedSetId];
  } else {
    chosenSet = eligibleSets[Math.floor(Math.random() * eligibleSets.length)];
  }

  // Chọn 1 trong 4 mảnh Đông, Tây, Nam, Bắc
  const directions: FragmentDirection[] = ['dong', 'tay', 'nam', 'bac'];
  let chosenDir: FragmentDirection = 'dong';
  if (simulatedPieceIndex && simulatedPieceIndex >= 1 && simulatedPieceIndex <= 4) {
    chosenDir = directions[simulatedPieceIndex - 1];
  } else {
    chosenDir = directions[Math.floor(Math.random() * directions.length)];
  }

  return chosenSet.fragments[chosenDir];
}

// ============================================================================
// 4. HÀM THẨM ĐỊNH & GHÉP MẢNH TÀN ĐỒ (ATOMIC MAP SYNTHESIS)
// ============================================================================
export interface SynthesizeAncientMapResult {
  success: boolean;
  vault: AncientMapVaultState;
  createdMap?: CompleteAncientMapItem;
  spiritStonesCost: number;
  reason?: string;
}

export function synthesizeAncientMap(
  vault: AncientMapVaultState,
  setId: string,
  playerSpiritStones: number
): SynthesizeAncientMapResult {
  const setDef = ANCIENT_MAP_SETS_REGISTRY[setId];
  if (!setDef) {
    return {
      success: false,
      vault,
      spiritStonesCost: 0,
      reason: `Bộ di tích 【${setId}】 không tồn tại trong điển tịch thượng cổ!`
    };
  }

  // Kiểm tra chi phí Linh Thạch
  if (playerSpiritStones < setDef.synthesisCostStones) {
    return {
      success: false,
      vault,
      spiritStonesCost: setDef.synthesisCostStones,
      reason: `Linh Thạch không đủ! Cần ${setDef.synthesisCostStones.toLocaleString()} Linh Thạch để ngưng tụ nguyên khí ghép bí đồ.`
    };
  }

  // Kiểm tra 4 mảnh Đông, Tây, Nam, Bắc của đúng bộ di tích này
  const requiredFragments = [
    setDef.fragments.dong,
    setDef.fragments.tay,
    setDef.fragments.nam,
    setDef.fragments.bac
  ];

  const currentInventory = { ...(vault.fragmentsInventory || {}) };
  for (const frag of requiredFragments) {
    const ownedCount = currentInventory[frag.id] || 0;
    if (ownedCount < 1) {
      return {
        success: false,
        vault,
        spiritStonesCost: setDef.synthesisCostStones,
        reason: `Còn thiếu mảnh 【${frag.setName} • Mảnh ${DIRECTION_NAMES[frag.direction]}】! Cần thu thập đủ bộ 4 mảnh Đông - Tây - Nam - Bắc để hợp nhất.`
      };
    }
  }

  // Trừ nguyên tử mỗi mảnh 1 chiếc (Atomic Deduction)
  for (const frag of requiredFragments) {
    currentInventory[frag.id] = (currentInventory[frag.id] || 0) - 1;
    if (currentInventory[frag.id] <= 0) {
      delete currentInventory[frag.id];
    }
  }

  // Khởi tạo Bí Đồ hoàn chỉnh
  const createdMap: CompleteAncientMapItem = {
    id: `map_${setId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    setId: setDef.id,
    name: setDef.name,
    tier: setDef.tier,
    targetDungeonName: setDef.targetDungeonName,
    requiredRealmIndex: setDef.requiredRealmIndex,
    description: setDef.description,
    synthesizedAt: Date.now(),
    spiritStonesCost: setDef.synthesisCostStones
  };

  const updatedVault: AncientMapVaultState = {
    ...vault,
    fragmentsInventory: currentInventory,
    synthesizedMaps: [...(vault.synthesizedMaps || []), createdMap]
  };

  return {
    success: true,
    vault: updatedVault,
    createdMap,
    spiritStonesCost: setDef.synthesisCostStones
  };
}

// ============================================================================
// 5. HÀM KHỞI TẠO PHÓ BẢN CỔ ĐẠI (OPEN ANCIENT DUNGEON INSTANCE)
// ============================================================================
export interface OpenDungeonResult {
  success: boolean;
  vault: AncientMapVaultState;
  instance?: AncientDungeonInstance;
  reason?: string;
}

export function openAncientDungeonInstance(
  vault: AncientMapVaultState,
  mapId: string,
  playerRealmIndex: number
): OpenDungeonResult {
  // Kiểm tra phó bản đang mở dở dang
  const active = vault.activeDungeon;
  if (active && !active.isCompleted && active.expiresAt > Date.now()) {
    return {
      success: false,
      vault,
      reason: `Hiện tại đang có phó bản 【${active.dungeonName}】 chưa kết thúc! Hãy vượt ải hoặc đợi khi cổng không gian đóng lại.`
    };
  }

  // Tìm Bí Đồ trong kho
  const mapItem = (vault.synthesizedMaps || []).find(m => m.id === mapId);
  if (!mapItem) {
    return {
      success: false,
      vault,
      reason: `Không tìm thấy Bí Đồ tương ứng trong Tàng Bảo Các!`
    };
  }

  const setDef = ANCIENT_MAP_SETS_REGISTRY[mapItem.setId];
  if (!setDef) {
    return {
      success: false,
      vault,
      reason: `Dữ liệu di tích của Bí Đồ này đã thất truyền!`
    };
  }

  // Kiểm tra cảnh giới người chơi
  if (playerRealmIndex < mapItem.requiredRealmIndex) {
    return {
      success: false,
      vault,
      reason: `Cảnh giới của bạn chưa đủ để khai mở phó bản này! Yêu cầu tối thiểu đạt [${setDef.realmRequirementName}].`
    };
  }

  // Xóa Bí Đồ khỏi danh sách (tiêu hao Bí Đồ)
  const remainingMaps = vault.synthesizedMaps.filter(m => m.id !== mapId);

  // Sinh 3 tầng ải với dữ liệu cấu hình
  const stages: AncientDungeonStage[] = setDef.stagesConfig.map(s => ({
    stageIndex: s.stageIndex,
    stageName: s.stageName,
    enemyName: s.enemyName,
    enemyTitle: s.enemyTitle,
    enemyRealm: s.enemyRealm,
    enemyStats: { ...s.enemyStats },
    specialAura: s.specialAura,
    isCleared: false
  }));

  const instance: AncientDungeonInstance = {
    instanceId: `dungeon_${mapItem.setId}_${Date.now()}`,
    mapSetId: setDef.id,
    dungeonName: setDef.targetDungeonName,
    tier: setDef.tier,
    openedAt: Date.now(),
    expiresAt: Date.now() + 2 * 3600 * 1000, // Tồn tại 2 giờ thực tế
    currentStageIndex: 1,
    stages,
    isCompleted: false,
    guaranteedRewards: JSON.parse(JSON.stringify(setDef.guaranteedRewards))
  };

  const updatedVault: AncientMapVaultState = {
    ...vault,
    synthesizedMaps: remainingMaps,
    activeDungeon: instance
  };

  return {
    success: true,
    vault: updatedVault,
    instance
  };
}

// ============================================================================
// 6. HÀM GIẢI QUYẾT TRẬN ĐÁNH & TRAO THƯỞNG (RESOLVE DUNGEON STAGE BATTLE)
// ============================================================================
export interface ResolveDungeonStageResult {
  victory: boolean;
  battleReport: BattleResult;
  updatedPlayer: PlayerStats;
  updatedVault: AncientMapVaultState;
  rewardsClaimed?: GuaranteedDivineReward;
  error?: string;
}

export function resolveDungeonStageBattle(
  player: PlayerStats,
  vault: AncientMapVaultState,
  stageIndex: 1 | 2 | 3,
  usedSkillManualId?: string,
  options?: { forceVictory?: boolean }
): ResolveDungeonStageResult {
  const instance = vault.activeDungeon;
  if (!instance) {
    return {
      victory: false,
      battleReport: { victory: false, message: 'Không có phó bản nào đang mở!', flavorText: '' },
      updatedPlayer: player,
      updatedVault: vault,
      error: 'Không có phó bản nào đang mở!'
    };
  }

  // Kiểm tra thời hạn phó bản
  if (Date.now() > instance.expiresAt) {
    const expiredVault = {
      ...vault,
      activeDungeon: null
    };
    return {
      victory: false,
      battleReport: { victory: false, message: 'Phó bản cổ đại đã sụp đổ do hết thời gian tồn tại!', flavorText: '' },
      updatedPlayer: player,
      updatedVault: expiredVault,
      error: 'Phó bản cổ đại đã hết hạn tồn tại!'
    };
  }

  if (instance.isCompleted) {
    return {
      victory: false,
      battleReport: { victory: false, message: 'Phó bản đã được chinh phục hoàn tất!', flavorText: '' },
      updatedPlayer: player,
      updatedVault: vault,
      error: 'Phó bản này đã được chinh phục hoàn tất!'
    };
  }

  if (instance.currentStageIndex !== stageIndex) {
    return {
      victory: false,
      battleReport: { victory: false, message: `Ải hiện tại là Ải ${instance.currentStageIndex}!`, flavorText: '' },
      updatedPlayer: player,
      updatedVault: vault,
      error: `Ải hiện tại là Ải ${instance.currentStageIndex}, không thể khiêu chiến Ải ${stageIndex}!`
    };
  }

  const stage = instance.stages.find(s => s.stageIndex === stageIndex);
  if (!stage) {
    return {
      victory: false,
      battleReport: { victory: false, message: 'Dữ liệu ải không hợp lệ!', flavorText: '' },
      updatedPlayer: player,
      updatedVault: vault,
      error: 'Dữ liệu ải không hợp lệ!'
    };
  }

  // Xây dựng Boss Object để đưa vào combat engine
  const boss: Boss = {
    id: `dungeon_boss_${instance.mapSetId}_stage_${stageIndex}`,
    name: stage.enemyName,
    realm: stage.enemyRealm,
    hp: stage.enemyStats.hp,
    maxHp: stage.enemyStats.maxHp,
    atk: stage.enemyStats.atk,
    def: stage.enemyStats.def,
    speed: stage.enemyStats.speed,
    stats: {
      power: stage.enemyStats.atk * 10,
      defense: stage.enemyStats.def * 10,
      speed: stage.enemyStats.speed,
      hp: stage.enemyStats.hp,
      maxHp: stage.enemyStats.maxHp,
      atk: stage.enemyStats.atk
    },
    description: `${stage.enemyTitle} trấn giữ ${stage.stageName}. ${stage.specialAura || ''}`,
    drops: {
      tuVi: 1000 * stageIndex * instance.tier,
      linhThach: 500 * stageIndex * instance.tier
    },
    rewards: {
      tuVi: 1000 * stageIndex * instance.tier,
      linhThach: 500 * stageIndex * instance.tier,
      danhVong: 10 * stageIndex * instance.tier
    }
  };

  const battleReport = battleBoss(player, boss, usedSkillManualId);
  if (options?.forceVictory) {
    battleReport.victory = true;
  }

  let updatedPlayer: PlayerStats = JSON.parse(JSON.stringify(player));
  let updatedVault: AncientMapVaultState = JSON.parse(JSON.stringify(vault));
  const activeInstance = updatedVault.activeDungeon!;
  const currentStage = activeInstance.stages.find(s => s.stageIndex === stageIndex)!;

  let rewardsClaimed: GuaranteedDivineReward | undefined = undefined;

  if (battleReport.victory) {
    currentStage.isCleared = true;

    if (stageIndex < 3) {
      // Chuyển sang ải tiếp theo
      activeInstance.currentStageIndex = (stageIndex + 1) as 2 | 3;
    } else {
      // Đã vượt qua Ải 3 (Boss cuối) -> Chinh phục hoàn tất phó bản!
      activeInstance.isCompleted = true;
      updatedVault.clearedDungeonsCount = (updatedVault.clearedDungeonsCount || 0) + 1;

      // Trao thưởng thần binh độc bản và dị bảo
      const rewards = activeInstance.guaranteedRewards;
      rewardsClaimed = rewards;

      // 1. Linh Thạch
      updatedPlayer.linhThach = (updatedPlayer.linhThach || 0) + (rewards.spiritStones || 0);

      // 2. Thần Binh Trang Bị
      if (rewards.equipmentStats && rewards.equipmentSlot) {
        if (!updatedPlayer.inventory) {
          updatedPlayer.inventory = {
            equipment: [],
            pills: [],
            herbs: [],
            ores: []
          };
        }
        if (!Array.isArray(updatedPlayer.inventory.equipment)) {
          updatedPlayer.inventory.equipment = [];
        }

        const newEquipment: Equipment = {
          id: rewards.equipmentId || `equip_${Date.now()}`,
          name: rewards.equipmentName,
          slot: rewards.equipmentSlot,
          type: rewards.equipmentSlot,
          grade: instance.tier >= 4 ? 'Hỗn Độn' : 'Thần Thoại',
          quality: 'cuc_pham',
          powerBonus: rewards.equipmentStats.powerBonus,
          enhancement: 0,
          atkBonus: rewards.equipmentStats.atkBonus,
          defBonus: rewards.equipmentStats.defBonus,
          hpBonus: rewards.equipmentStats.hpBonus,
          mpBonus: rewards.equipmentStats.mpBonus,
          speedBonus: rewards.equipmentStats.speedBonus,
          critRateBonus: rewards.equipmentStats.critRateBonus,
          critDmgBonus: rewards.equipmentStats.critDmgBonus,
          description: rewards.equipmentStats.description
        };

        updatedPlayer.inventory.equipment.push(newEquipment);
      }

      // 3. Nguyên Liệu Hiếm
      if (Array.isArray(rewards.rareMaterials) && rewards.rareMaterials.length > 0) {
        if (!updatedPlayer.inventory) {
          updatedPlayer.inventory = { equipment: [], pills: [], herbs: [], ores: [] };
        }
        if (!Array.isArray(updatedPlayer.inventory.ores)) {
          updatedPlayer.inventory.ores = [];
        }

        for (const mat of rewards.rareMaterials) {
          const matId = mat.id || `mat_${mat.name}`;
          const existing = updatedPlayer.inventory.ores.find((o: any) => o.id === matId);
          if (existing) {
            existing.quantity = (existing.quantity || 0) + mat.amount;
          } else {
            updatedPlayer.inventory.ores.push({
              id: matId,
              name: mat.name,
              grade: 'Thần Thoại',
              quality: 'cuc_pham',
              quantity: mat.amount,
              description: 'Nguyên liệu cổ xưa thu hoạch từ Thượng Cổ Bí Cảnh.'
            } as any);
          }
        }
      }
    }
  }

  return {
    victory: battleReport.victory,
    battleReport,
    updatedPlayer,
    updatedVault,
    rewardsClaimed
  };
}
