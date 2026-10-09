// hooks/useSound.ts
// Hook quản lý trạng thái âm thanh, lưu cấu hình vào localStorage và tương tác với Web Audio Controller

import { useState, useEffect, useCallback, useRef } from 'react';
import { SoundSettings, SFXType } from '@/lib/types';
import { audioEngine, DEFAULT_SOUND_SETTINGS } from '@/lib/audio-engine';

export const SOUND_STORAGE_KEY = 'tutien_sound_settings';

export interface UseSoundReturn {
  settings: SoundSettings;
  playSFX: (type: SFXType, isCrit?: boolean, volumeScale?: number) => void;
  toggleMute: () => void;
  toggleBgm: () => void;
  setBgmVolume: (val: number) => void;
  setSfxVolume: (val: number) => void;
  unlockAudio: () => Promise<boolean>;
}

export function useSound(): UseSoundReturn {
  const [settings, setSettings] = useState<SoundSettings>(DEFAULT_SOUND_SETTINGS);
  const isLoadedRef = useRef<boolean>(false);

  // 1. Khởi tạo cấu hình từ localStorage khi mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged: SoundSettings = {
          isMuted: typeof parsed.isMuted === 'boolean' ? parsed.isMuted : DEFAULT_SOUND_SETTINGS.isMuted,
          bgmVolume: typeof parsed.bgmVolume === 'number' ? Math.max(0, Math.min(1, parsed.bgmVolume)) : DEFAULT_SOUND_SETTINGS.bgmVolume,
          sfxVolume: typeof parsed.sfxVolume === 'number' ? Math.max(0, Math.min(1, parsed.sfxVolume)) : DEFAULT_SOUND_SETTINGS.sfxVolume,
          bgmEnabled: typeof parsed.bgmEnabled === 'boolean' ? parsed.bgmEnabled : DEFAULT_SOUND_SETTINGS.bgmEnabled
        };
        setSettings(merged);
        audioEngine.applySettings(merged);
      } else {
        audioEngine.applySettings(DEFAULT_SOUND_SETTINGS);
      }
    } catch {
      audioEngine.applySettings(DEFAULT_SOUND_SETTINGS);
    }

    isLoadedRef.current = true;
  }, []);

  // 2. Lắng nghe tương tác đầu tiên của người dùng để unlock AudioContext (Tránh browser Autoplay Policy)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleFirstInteraction = () => {
      audioEngine.unlockAudio();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // 3. Hàm lưu và áp dụng cấu hình
  const updateSettings = useCallback((updater: (prev: SoundSettings) => SoundSettings) => {
    setSettings(prev => {
      const next = updater(prev);
      audioEngine.applySettings(next);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Bỏ qua lỗi quota storage
        }
      }
      return next;
    });
  }, []);

  // Bật / Tắt toàn bộ âm thanh
  const toggleMute = useCallback(() => {
    // Nếu người dùng bấm tương tác thì đồng thời kích hoạt unlock
    audioEngine.unlockAudio();
    updateSettings(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, [updateSettings]);

  // Bật / Tắt riêng Nhạc Nền (BGM)
  const toggleBgm = useCallback(() => {
    audioEngine.unlockAudio();
    updateSettings(prev => ({ ...prev, bgmEnabled: !prev.bgmEnabled }));
  }, [updateSettings]);

  // Điều chỉnh âm lượng Nhạc Nền
  const setBgmVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    updateSettings(prev => ({ ...prev, bgmVolume: clamped }));
  }, [updateSettings]);

  // Điều chỉnh âm lượng Hiệu Ứng (SFX)
  const setSfxVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    updateSettings(prev => ({ ...prev, sfxVolume: clamped }));
  }, [updateSettings]);

  // Phát hiệu ứng âm thanh
  const playSFX = useCallback((type: SFXType, isCrit = false, volumeScale = 1.0) => {
    audioEngine.playSFX(type, isCrit, volumeScale);
  }, []);

  const unlockAudio = useCallback(async () => {
    return audioEngine.unlockAudio();
  }, []);

  return {
    settings,
    playSFX,
    toggleMute,
    toggleBgm,
    setBgmVolume,
    setSfxVolume,
    unlockAudio
  };
}
