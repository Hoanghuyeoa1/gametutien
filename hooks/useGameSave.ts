// hooks/useGameSave.ts
// Hook quản lý vòng đời dữ liệu nhân vật: Tải, Lưu, Tự động lưu, Mã hóa chuỗi Tiên Thư Base64 & Multi-slot Snapshots

import { useState, useEffect, useCallback, useRef } from 'react';
import { PlayerStats } from '@/lib/types';
import { createNewPlayer } from '@/lib/game-logic';
import {
  loadGameSave,
  saveGameData,
  exportSaveToJson,
  importSaveFromJson,
  STORAGE_KEY
} from '@/lib/save-migration';
import {
  exportSaveToEncryptedString,
  importSaveFromEncryptedString,
  saveToSlot,
  loadFromSlot,
  getAllSlotsMetadata,
  SaveSlotMetadata,
  SLOT_TITLES
} from '@/lib/save-encryption';

export interface UseGameSaveOptions {
  onInitialLoaded?: (isNew: boolean) => void;
  onToast?: (msg: string) => void;
  onLog?: (title: string, content: string, type: 'system' | 'danger') => void;
}

export interface UseGameSaveReturn {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  isLoaded: boolean;
  saveProgress: () => boolean;
  exportSave: () => string;
  importSave: (jsonString: string) => boolean;
  resetProgress: () => PlayerStats;
  // Tính năng Tiên Thư Bản Thể & Multi-Slot Snapshots
  handleExportString: () => string;
  handleImportString: (encryptedOrJsonStr: string) => boolean;
  handleRestoreSnapshot: (slotIndex: 1 | 2 | 3) => boolean;
  handleSaveSnapshot: (slotIndex: 1 | 2 | 3, reason?: string) => boolean;
  saveMilestoneSnapshot: (reason?: string) => boolean;
  getSnapshotsList: () => SaveSlotMetadata[];
}

export function useGameSave(options?: UseGameSaveOptions): UseGameSaveReturn {
  const [player, setPlayer] = useState<PlayerStats>(createNewPlayer());
  const [isLoaded, setIsLoaded] = useState(false);
  const isInitialMount = useRef(true);

  // 1. Tải dữ liệu lúc khởi chạy Client
  useEffect(() => {
    const { player: loadedPlayer, isNew } = loadGameSave();
    setPlayer(loadedPlayer);
    setIsLoaded(true);

    if (options?.onInitialLoaded) {
      options.onInitialLoaded(isNew);
    } else {
      if (isNew) {
        options?.onLog?.(
          'Tỉnh Giấc Phàm Trần',
          'Ngươi mở mắt tại một sơn thôn hẻo lánh, bắt đầu bước vào con đường vấn đỉnh trường sinh.',
          'system'
        );
      } else {
        options?.onLog?.(
          'Khởi Động Đạo Thể',
          'Cảm ứng thiên địa, đánh thức Thể Chất Tiên Thiên, Linh Căn và Tiên Duyên Đạo Lữ...',
          'system'
        );
      }
    }
  }, []);

  // 2. Tự động lưu sau khi player thay đổi (debounce 1000ms vào Slot 1 & legacy key)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!isLoaded) return;

    const timer = setTimeout(() => {
      saveGameData(player);
      saveToSlot(1, player, 'Lưu tự động định kỳ');
    }, 1000);

    return () => clearTimeout(timer);
  }, [player, isLoaded]);

  // 2b. Tự động lưu luân phiên Snapshot 30 phút vào Slot 2 (Anti-Loss Snapshot)
  useEffect(() => {
    if (!isLoaded) return;
    const interval = setInterval(() => {
      saveToSlot(2, player, 'Bản lưu tự động luân phiên (30 phút)');
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [player, isLoaded]);

  // 3. Đảm bảo lưu trước khi đóng trình duyệt
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isLoaded) {
        const toSave = { ...player, lastActiveTimestamp: Date.now() };
        saveGameData(toSave);
        saveToSlot(1, toSave, 'Lưu trước khi thoát');
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [player, isLoaded]);

  // Lưu tiến trình thủ công vào Slot 1 & legacy
  const saveProgress = useCallback((): boolean => {
    const success = saveGameData(player);
    saveToSlot(1, player, 'Lưu thủ công');
    if (success) {
      options?.onToast?.('Đạo hạnh đã khắc sâu vào Ngọc Giản linh hồn (Đã Lưu)!');
      options?.onLog?.('Lưu Tiến Trình', 'Đạo hữu đã phong ấn nguyên thần, lưu lại tiến cảnh tu vi.', 'system');
    } else {
      options?.onToast?.('Lỗi lưu trữ!');
      options?.onLog?.('Lỗi Lưu Trữ', 'Không thể ghi dữ liệu vào Ngọc Giản.', 'danger');
    }
    return success;
  }, [player, options]);

  // Xuất file save JSON truyền thống
  const exportSave = useCallback((): string => {
    return exportSaveToJson(player);
  }, [player]);

  // Nhập file save JSON truyền thống
  const importSave = useCallback((jsonString: string): boolean => {
    try {
      const imported = importSaveFromJson(jsonString);
      setPlayer(imported);
      saveToSlot(1, imported, 'Nhập từ file JSON');
      options?.onToast?.('Nhập dữ liệu lưu trữ thành công!');
      options?.onLog?.('Nhập Tiến Trình', 'Đã đồng bộ hóa nguyên thần từ Ngọc Giản truyền tải.', 'system');
      return true;
    } catch (err: any) {
      options?.onToast?.(err.message || 'Lỗi khi nhập dữ liệu!');
      options?.onLog?.('Nhập Thất Bại', err.message || 'Cấu trúc dữ liệu không tương thích.', 'danger');
      return false;
    }
  }, [options]);

  // Xuất chuỗi mã hóa Tiên Thư Bản Thể và copy Clipboard
  const handleExportString = useCallback((): string => {
    const encrypted = exportSaveToEncryptedString(player);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(encrypted).catch(err => {
        console.warn('Clipboard write error:', err);
      });
    }
    options?.onToast?.('Đã sao chép Tiên Thư Bản Thể vào bộ nhớ tạm!');
    options?.onLog?.(
      'Xuất Tiên Thư Bản Thể',
      'Đã kết tinh toàn bộ căn cơ, cảnh giới và tài nguyên thành chuỗi phù văn mã hóa an toàn.',
      'system'
    );
    return encrypted;
  }, [player, options]);

  // Nhập và khôi phục từ chuỗi mã hóa Tiên Thư (kèm kiểm tra Checksum)
  const handleImportString = useCallback((encryptedOrJsonStr: string): boolean => {
    try {
      const result = importSaveFromEncryptedString(encryptedOrJsonStr);
      if (!result.success || !result.data) {
        const errorMsg = result.errorMessage || 'Dữ liệu Tiên Thư bị lỗi hoặc bị chỉnh sửa!';
        options?.onToast?.(errorMsg);
        options?.onLog?.('Khôi Phục Tiên Thư Thất Bại', errorMsg, 'danger');
        return false;
      }

      const imported = result.data;
      setPlayer(imported);
      saveGameData(imported);
      saveToSlot(1, imported, 'Khôi phục từ Tiên Thư Bản Thể');

      options?.onToast?.('Khôi phục Tiên Thư Bản Thể thành công!');
      options?.onLog?.(
        'Khôi Phục Đạo Quả',
        `Đã kích hoạt Tiên Thư! Chào mừng đạo hữu [${imported.name}] trở lại Tiên Giới.`,
        'system'
      );
      return true;
    } catch (err: any) {
      const msg = err?.message || 'Lỗi giải mã chuỗi lưu trữ!';
      options?.onToast?.(msg);
      options?.onLog?.('Khôi Phục Tiên Thư Thất Bại', msg, 'danger');
      return false;
    }
  }, [options]);

  // Khôi phục từ một trong 3 khe Snapshot
  const handleRestoreSnapshot = useCallback((slotIndex: 1 | 2 | 3): boolean => {
    try {
      const loaded = loadFromSlot(slotIndex);
      if (!loaded) {
        options?.onToast?.(`Khe lưu trữ [${SLOT_TITLES[slotIndex]}] hiện đang trống!`);
        return false;
      }

      setPlayer(loaded);
      saveGameData(loaded);
      saveToSlot(1, loaded, `Khôi phục từ ${SLOT_TITLES[slotIndex]}`);

      options?.onToast?.(`Đã khôi phục thành công từ ${SLOT_TITLES[slotIndex]}!`);
      options?.onLog?.(
        'Khôi Phục Snapshot',
        `Đã hồi phục đạo quả từ ${SLOT_TITLES[slotIndex]} (Thời điểm: ${new Date(loaded.lastActiveTimestamp || Date.now()).toLocaleString('vi-VN')}).`,
        'system'
      );
      return true;
    } catch (err: any) {
      options?.onToast?.(err?.message || 'Lỗi khi khôi phục snapshot!');
      return false;
    }
  }, [options]);

  // Lưu thủ công vào khe Snapshot
  const handleSaveSnapshot = useCallback((slotIndex: 1 | 2 | 3, reason?: string): boolean => {
    const success = saveToSlot(slotIndex, player, reason || 'Lưu thủ công');
    if (success) {
      options?.onToast?.(`Đã lưu thành công vào [${SLOT_TITLES[slotIndex]}]!`);
    } else {
      options?.onToast?.(`Lỗi khi lưu vào [${SLOT_TITLES[slotIndex]}]!`);
    }
    return success;
  }, [player, options]);

  // Lưu mốc trọng đại trước khi Đột Phá / Luân Hồi vào Slot 3
  const saveMilestoneSnapshot = useCallback((reason?: string): boolean => {
    return handleSaveSnapshot(3, reason || 'Trước mốc trọng đại');
  }, [handleSaveSnapshot]);

  // Lấy danh sách metadata của 3 slot
  const getSnapshotsList = useCallback((): SaveSlotMetadata[] => {
    return getAllSlotsMetadata();
  }, []);

  // Đặt lại tiến trình
  const resetProgress = useCallback((): PlayerStats => {
    const fresh = createNewPlayer();
    try {
      localStorage.removeItem(STORAGE_KEY);
      saveGameData(fresh);
      saveToSlot(1, fresh, 'Khởi tạo mới');
    } catch (e) {
      console.error(e);
    }
    setPlayer(fresh);
    options?.onToast?.('Đã khởi tạo lại đạo kiếp phàm nhân mới!');
    return fresh;
  }, [options]);

  return {
    player,
    setPlayer,
    isLoaded,
    saveProgress,
    exportSave,
    importSave,
    resetProgress,
    handleExportString,
    handleImportString,
    handleRestoreSnapshot,
    handleSaveSnapshot,
    saveMilestoneSnapshot,
    getSnapshotsList
  };
}
