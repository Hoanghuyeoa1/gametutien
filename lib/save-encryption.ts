// lib/save-encryption.ts
// Pure Engine mã hóa, giải mã chuỗi Base64 "Tiên Thư Lưu Trữ", nén dữ liệu, tạo Checksum Adler-32 chống gian lận & hư hỏng file
// Quản lý 3 khe lưu trữ Snapshot đa tầng (Multi-slot Snapshots)

import type { PlayerStats } from '@/lib/types/player';
import { normalizePlayerData, repairCorruptedSaveData, STORAGE_KEY } from '@/lib/save-migration';
import realmsData from '@/data/realms-data.json';

export const SAVE_ENCRYPTION_PREFIX = 'GTT_SAVE_V1$';

export const SAVE_SLOT_KEYS = {
  1: 'gametutien_save_slot_1',
  2: 'gametutien_save_slot_2',
  3: 'gametutien_save_slot_3',
} as const;

export const SLOT_TITLES: Record<1 | 2 | 3, string> = {
  1: 'Bản Lưu Tự Động Chính (Slot 1)',
  2: 'Bản Lưu Tự Động 30 Phút (Slot 2)',
  3: 'Mốc Trọng Đại / Trước Đột Phá (Slot 3)',
};

export interface SaveSlotMetadata {
  slot: 1 | 2 | 3;
  key: string;
  title: string;
  exists: boolean;
  characterName?: string;
  realmName?: string;
  realmLevel?: number;
  combatPower?: number;
  linhThach?: number;
  savedAt?: number;
  savedAtFormatted?: string;
  reason?: string;
}

export interface ImportResult {
  success: boolean;
  data?: PlayerStats;
  errorMessage?: string;
}

/**
 * Thuật toán băm Checksum Adler-32 thuần JS (tốc độ cao, tính toán deterministic, 8 hex chars)
 */
export function calculateChecksum(str: string): string {
  let a = 1;
  let b = 0;
  const MOD_ADLER = 65521;
  for (let i = 0; i < str.length; i++) {
    a = (a + str.charCodeAt(i)) % MOD_ADLER;
    b = (b + a) % MOD_ADLER;
  }
  const checksum = (b << 16) | a;
  return (checksum >>> 0).toString(16).padStart(8, '0');
}

/**
 * Encode chuỗi UTF-8 sang Base64 an toàn trên cả Browser và Node.js
 */
function utf8ToBase64(str: string): string {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  }
  return Buffer.from(str, 'utf-8').toString('base64');
}

/**
 * Decode chuỗi Base64 về chuỗi UTF-8 an toàn trên cả Browser và Node.js
 */
function base64ToUtf8(b64: string): string {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(b64), (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  }
  return Buffer.from(b64, 'base64').toString('utf-8');
}

/**
 * Xuất dữ liệu nhân vật thành chuỗi Tiên Thư Mã Hóa
 * Định dạng: GTT_SAVE_V1$[CHECKSUM]$[BASE64_PAYLOAD]
 */
export function exportSaveToEncryptedString(player: PlayerStats): string {
  const jsonStr = JSON.stringify(player);
  const checksum = calculateChecksum(jsonStr);
  const payloadBase64 = utf8ToBase64(jsonStr);
  return `${SAVE_ENCRYPTION_PREFIX}${checksum}$${payloadBase64}`;
}

/**
 * Kiểm tra xem chuỗi có phải là Tiên Thư mã hóa hay không
 */
export function isEncryptedSaveString(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  return str.trim().startsWith(SAVE_ENCRYPTION_PREFIX);
}

/**
 * Giải mã và kiểm tra tính toàn vẹn của chuỗi Tiên Thư
 */
export function importSaveFromEncryptedString(encryptedStr: string): ImportResult {
  if (!encryptedStr || typeof encryptedStr !== 'string') {
    return {
      success: false,
      errorMessage: 'Chuỗi Tiên Thư trống rỗng hoặc không đúng định dạng văn bản!',
    };
  }

  const cleanStr = encryptedStr.trim();

  // Kiểm tra tiền tố phiên bản
  if (!cleanStr.startsWith(SAVE_ENCRYPTION_PREFIX)) {
    // Thử fallback xem người dùng có paste JSON thô không
    if (cleanStr.startsWith('{') && cleanStr.endsWith('}')) {
      try {
        let parsed = JSON.parse(cleanStr);
        parsed = repairCorruptedSaveData(parsed);
        const normalized = normalizePlayerData(parsed);
        return { success: true, data: normalized };
      } catch {
        return {
          success: false,
          errorMessage: 'Chuỗi không có tiền tố Tiên Thư [GTT_SAVE_V1$] và JSON thô bị lỗi cấu trúc!',
        };
      }
    }
    return {
      success: false,
      errorMessage: 'Tiền tố Tiên Thư không hợp lệ! Chuỗi phải bắt đầu bằng "GTT_SAVE_V1$".',
    };
  }

  // Tách 3 thành phần: ['GTT_SAVE_V1', checksum, payload]
  const parts = cleanStr.split('$');
  if (parts.length < 3) {
    return {
      success: false,
      errorMessage: 'Cấu trúc Tiên Thư bị khiếm khuyết (thiếu mã kiểm tra Checksum hoặc nội dung Payload)!',
    };
  }

  const checksumExpected = parts[1];
  const payloadBase64 = parts.slice(2).join('$'); // Đề phòng trường hợp payload có ký tự $

  if (!checksumExpected || !payloadBase64) {
    return {
      success: false,
      errorMessage: 'Mã Checksum hoặc nội dung Base64 bị rỗng!',
    };
  }

  // Giải mã Base64 -> JSON string
  let jsonStr: string;
  try {
    jsonStr = base64ToUtf8(payloadBase64);
  } catch (err: any) {
    return {
      success: false,
      errorMessage: `Không thể giải mã dữ liệu Base64: ${err?.message || 'Ký tự mã hóa không hợp lệ'}!`,
    };
  }

  // Xác minh Checksum khớp 100% (chống cắt xén, chỉnh sửa tùy tiện)
  const checksumCalculated = calculateChecksum(jsonStr);
  const checksumPayload = calculateChecksum(payloadBase64);
  if (checksumCalculated !== checksumExpected && checksumPayload !== checksumExpected) {
    return {
      success: false,
      errorMessage: `Mã kiểm tra Checksum không khớp! (Kỳ vọng: ${checksumExpected} | Tính được: ${checksumCalculated}). Dữ liệu đã bị hư hại hoặc sửa đổi trái phép!`,
    };
  }

  // Parse JSON và chuẩn hóa qua Clean Architecture
  let parsed: any;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (err: any) {
    return {
      success: false,
      errorMessage: `Lỗi phân tích cú pháp JSON sau khi giải mã: ${err?.message || 'Dữ liệu không hoàn chỉnh'}!`,
    };
  }

  if (!parsed || typeof parsed !== 'object') {
    return {
      success: false,
      errorMessage: 'Dữ liệu sau khi giải mã không phải là đối tượng hợp lệ của Tiên Thư!',
    };
  }

  try {
    const repaired = repairCorruptedSaveData(parsed);
    const normalized = normalizePlayerData(repaired);
    return {
      success: true,
      data: normalized,
    };
  } catch (err: any) {
    return {
      success: false,
      errorMessage: `Lỗi chuẩn hóa dữ liệu nhân vật: ${err?.message || 'Cấu trúc không tương thích'}!`,
    };
  }
}

/**
 * Trích xuất Metadata vắn tắt từ dữ liệu người chơi
 */
export function extractPlayerMetadata(
  player: PlayerStats,
  slot: 1 | 2 | 3,
  reason?: string
): SaveSlotMetadata {
  const realmIdx = Math.max(0, Math.min(realmsData.length - 1, player.currentRealm ?? 0));
  const realmObj = (realmsData as any[])[realmIdx] || { name: 'Phàm Nhân' };
  const savedAt = player.lastActiveTimestamp || Date.now();

  const dateObj = new Date(savedAt);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const savedAtFormatted = `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())} - ${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}/${dateObj.getFullYear()}`;

  return {
    slot,
    key: SAVE_SLOT_KEYS[slot],
    title: SLOT_TITLES[slot],
    exists: true,
    characterName: player.name || 'Vô Danh Tu Sĩ',
    realmName: realmObj.name || 'Luyện Khí',
    realmLevel: realmIdx,
    combatPower: player.combatPower ?? 0,
    linhThach: player.linhThach ?? 0,
    savedAt,
    savedAtFormatted,
    reason,
  };
}

/**
 * Lấy thông tin Metadata của 1 khe lưu trữ Snapshot
 */
export function getSlotMetadata(slot: 1 | 2 | 3): SaveSlotMetadata {
  const key = SAVE_SLOT_KEYS[slot];
  if (typeof window === 'undefined') {
    return {
      slot,
      key,
      title: SLOT_TITLES[slot],
      exists: false,
    };
  }

  try {
    let raw = localStorage.getItem(key);
    // Nếu slot 1 rỗng, fallback sang legacy STORAGE_KEY
    if (!raw && slot === 1) {
      raw = localStorage.getItem(STORAGE_KEY);
    }

    if (!raw) {
      return {
        slot,
        key,
        title: SLOT_TITLES[slot],
        exists: false,
      };
    }

    const parsed = JSON.parse(raw);
    const meta = extractPlayerMetadata(parsed, slot);
    return meta;
  } catch {
    return {
      slot,
      key,
      title: SLOT_TITLES[slot],
      exists: false,
    };
  }
}

/**
 * Lấy danh sách thông tin cả 3 khe Snapshot
 */
export function getAllSlotsMetadata(): SaveSlotMetadata[] {
  return [getSlotMetadata(1), getSlotMetadata(2), getSlotMetadata(3)];
}

/**
 * Lưu dữ liệu nhân vật vào 1 khe Snapshot cụ thể
 */
export function saveToSlot(
  slot: 1 | 2 | 3,
  player: PlayerStats,
  reason?: string
): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const key = SAVE_SLOT_KEYS[slot];
    const toSave: PlayerStats = {
      ...player,
      lastActiveTimestamp: Date.now(),
    };
    const jsonStr = JSON.stringify(toSave);
    localStorage.setItem(key, jsonStr);

    // Nếu lưu vào slot 1 -> đồng bộ luôn với legacy STORAGE_KEY
    if (slot === 1) {
      localStorage.setItem(STORAGE_KEY, jsonStr);
    }

    // Lưu kèm reason vào key metadata riêng nếu có
    if (reason) {
      localStorage.setItem(`${key}_reason`, reason);
    }
    return true;
  } catch (e) {
    console.error(`Lỗi khi lưu vào slot ${slot}:`, e);
    return false;
  }
}

/**
 * Đọc dữ liệu nhân vật từ 1 khe Snapshot
 */
export function loadFromSlot(slot: 1 | 2 | 3): PlayerStats | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = SAVE_SLOT_KEYS[slot];
    let raw = localStorage.getItem(key);
    if (!raw && slot === 1) {
      raw = localStorage.getItem(STORAGE_KEY);
    }
    if (!raw) return null;

    let parsed = JSON.parse(raw);
    parsed = repairCorruptedSaveData(parsed);
    return normalizePlayerData(parsed);
  } catch (e) {
    console.error(`Lỗi khi đọc từ slot ${slot}:`, e);
    return null;
  }
}
