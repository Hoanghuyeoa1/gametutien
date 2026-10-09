// lib/audio-engine.ts
// Bộ điều khiển âm thanh Tiên Hiệp thuần túy bằng Web Audio API
// 100% Procedural Audio Synthesis - Không phụ thuộc file MP3 ngoài, không lo 404, hỗ trợ Offline hoàn hảo

import { SFXType, SoundSettings } from '@/lib/types';

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  isMuted: false,
  bgmVolume: 0.20, // Âm lượng nền tĩnh tâm, êm dịu, không lấn át
  sfxVolume: 0.65,
  bgmEnabled: true
};

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private masterCompressor: DynamicsCompressorNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private settings: SoundSettings = { ...DEFAULT_SOUND_SETTINGS };
  private isUnlocked: boolean = false;

  // BGM Mountain Air Breeze Nodes
  private breezeSource: AudioBufferSourceNode | null = null;
  private breezeFilter: BiquadFilterNode | null = null;
  private breezeGain: GainNode | null = null;
  private breezeLfo: OscillatorNode | null = null;
  private breezeLfoGain: GainNode | null = null;

  // BGM Guqin / Guzheng Timers & State
  private bgmPhraseTimer: NodeJS.Timeout | null = null;
  private activeNoteTimers: NodeJS.Timeout[] = [];
  private isBgmPlaying: boolean = false;

  constructor() {
    // Không khởi tạo AudioContext trong constructor để tránh vi phạm browser autoplay policy và lỗi SSR
  }

  /**
   * Khởi tạo an toàn và lazy Web Audio Context kèm Master Dynamics Compressor / Limiter
   */
  private initContext(): boolean {
    if (typeof window === 'undefined') return false;
    if (this.ctx) return true;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;

      this.ctx = new AudioCtx();

      // 1. Master Dynamics Compressor / Limiter: Chống méo tiếng (anti-clipping), bảo vệ loa laptop/tai nghe
      this.masterCompressor = this.ctx.createDynamicsCompressor();
      this.masterCompressor.threshold.setValueAtTime(-24, this.ctx.currentTime);
      this.masterCompressor.knee.setValueAtTime(30, this.ctx.currentTime);
      this.masterCompressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.masterCompressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.masterCompressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      // Master Gain -> Master Compressor -> Destination
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.settings.isMuted ? 0 : 1, this.ctx.currentTime);
      this.masterGain.connect(this.masterCompressor);
      this.masterCompressor.connect(this.ctx.destination);

      // BGM Gain -> Master Gain
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.settings.bgmEnabled ? this.settings.bgmVolume : 0, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      // SFX Gain -> Master Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.settings.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      return true;
    } catch (e) {
      console.warn('Web Audio API không được hỗ trợ hoặc bị chặn:', e);
      return false;
    }
  }

  /**
   * Mở khóa AudioContext khi người dùng tương tác lần đầu tiên (Click/Keydown)
   */
  public async unlockAudio(): Promise<boolean> {
    if (this.isUnlocked && this.ctx && this.ctx.state === 'running') {
      return true;
    }

    if (!this.initContext() || !this.ctx) {
      return false;
    }

    try {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      this.isUnlocked = true;

      // Nếu BGM đang bật nhưng chưa chạy vì bị chặn trước đó thì kích hoạt
      if (this.settings.bgmEnabled && !this.settings.isMuted && !this.isBgmPlaying) {
        this.startAmbientBGM();
      }

      return true;
    } catch {
      return false;
    }
  }

  // =========================================================================
  // CẤU HÌNH & ĐIỀU CHỈNH ÂM LƯỢNG
  // =========================================================================

  public applySettings(newSettings: Partial<SoundSettings>) {
    this.settings = { ...this.settings, ...newSettings };

    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.settings.isMuted ? 0 : 1, now, 0.05);
    }

    if (this.bgmGain) {
      const targetBgm = this.settings.bgmEnabled ? this.settings.bgmVolume : 0;
      this.bgmGain.gain.setTargetAtTime(targetBgm, now, 0.05);
    }

    if (this.sfxGain) {
      this.sfxGain.gain.setTargetAtTime(this.settings.sfxVolume, now, 0.05);
    }

    // Quản lý BGM bật/tắt
    if (!this.settings.bgmEnabled || this.settings.isMuted) {
      this.stopAmbientBGM();
    } else if (this.settings.bgmEnabled && !this.settings.isMuted && !this.isBgmPlaying && this.isUnlocked) {
      this.startAmbientBGM();
    }
  }

  public getSettings(): SoundSettings {
    return { ...this.settings };
  }

  // =========================================================================
  // HIỆU ỨNG ÂM THANH TIÊN HIỆP PROCEDURAL (SFX SYNTHESIZER)
  // =========================================================================

  /**
   * ⚡ Thiên Kiếp Lôi Đình: Tiếng sấm rền vang khi lôi kiếp giáng thế
   * Sử dụng White Noise Buffer đi qua Lowpass Filter quét 800Hz -> 50Hz kèm Decay
   */
  public playThunderSound(volumeScale = 1.0) {
    if (this.settings.isMuted || !this.initContext() || !this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const duration = 2.2;

    try {
      // 1. Tạo buffer tiếng ồn trắng (White noise)
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // 2. Lowpass Biquad Filter quét tần số mô phỏng tiếng sấm từ xa dội lại
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, now);
      filter.frequency.exponentialRampToValueAtTime(55, now + duration);

      // 3. Gain Envelope cho sấm: gắt ban đầu rồi rền vang kéo dài
      const gain = ctx.createGain();
      const peakVol = Math.max(0.01, 0.8 * volumeScale);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peakVol, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // 4. Oscillator âm trầm phụ trợ (Sub-bass rumble 65Hz -> 25Hz)
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(65, now);
      subOsc.frequency.exponentialRampToValueAtTime(25, now + duration);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(peakVol * 0.7, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Kết nối mạng audio
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      subOsc.connect(subGain);
      subGain.connect(this.sfxGain);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
      subOsc.start(now);
      subOsc.stop(now + duration);
    } catch {
      // Bỏ qua lỗi audio node
    }
  }

  /**
   * ⚔️ Kiếm Khí Trảm Yêu: Tiếng vung kiếm xé gió và va chạm bạo kích
   * Oscillator quét nhanh 1200Hz -> 180Hz kết hợp Bandpass filter (kèm âm kim loại nếu Crit)
   */
  public playSwordSlashSound(volumeScale = 1.0, isCritical = false) {
    if (this.settings.isMuted || !this.initContext() || !this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const duration = isCritical ? 0.35 : 0.20;

    try {
      // 1. Tiếng xé gió (Blade Whoosh)
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(isCritical ? 1400 : 1100, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + duration);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(3.5, now);

      const gain = ctx.createGain();
      const peakVol = Math.max(0.01, (isCritical ? 0.9 : 0.6) * volumeScale);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peakVol, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + duration);

      // 2. Nếu Bạo Kích: Thêm tiếng ngân kim khí (Metallic Ring Chime)
      if (isCritical) {
        const chimeOsc = ctx.createOscillator();
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(2489, now + 0.03); // Nốt D#7

        const chimeGain = ctx.createGain();
        chimeGain.gain.setValueAtTime(0.4 * volumeScale, now + 0.03);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.sfxGain);

        chimeOsc.start(now + 0.03);
        chimeOsc.stop(now + 0.55);
      }
    } catch {
      // Bỏ qua lỗi audio node
    }
  }

  /**
   * 🔮 Luyện Đan Khai Lò: Âm thanh đan hỏa cộng hưởng và chuông khánh đỉnh đan
   * 2 Oscillator sóng sin hòa âm 520Hz & 1040Hz tạo độ vang thanh thoát
   */
  public playAlchemyFurnaceSound(volumeScale = 1.0) {
    if (this.settings.isMuted || !this.initContext() || !this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const duration = 1.4;

    try {
      const freqs = [523.25, 1046.50]; // C5 và C6 harmonic
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const gain = ctx.createGain();
        const baseVol = (idx === 0 ? 0.45 : 0.25) * volumeScale;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(baseVol, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch {
      // Bỏ qua lỗi
    }
  }

  /**
   * ✨ Đột Phá Kim Quang: Hợp âm ngũ cung thăng hoa (Cung - Thương - Giốc - Chủy)
   * Arpeggio 4 nốt mang lại cảm giác phi thăng thoát tục
   */
  public playBreakthroughSuccessSound(volumeScale = 1.0) {
    if (this.settings.isMuted || !this.initContext() || !this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Ngũ cung thăng thiên: C4 (261.63Hz) - E4 (329.63Hz) - G4 (392.00Hz) - C5 (523.25Hz) - E5 (659.25Hz)
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
    const noteDuration = 0.9;

    try {
      notes.forEach((freq, i) => {
        const noteStart = now + i * 0.11;
        const osc = ctx.createOscillator();
        osc.type = 'triangle'; // Âm thanh ấm áp như tiếng đàn cổ tranh
        osc.frequency.setValueAtTime(freq, noteStart);

        const gain = ctx.createGain();
        const vol = 0.35 * volumeScale;
        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(vol, noteStart + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(noteStart);
        osc.stop(noteStart + noteDuration + 0.05);
      });
    } catch {
      // Bỏ qua lỗi
    }
  }

  /**
   * 🔘 Click UI Thao Tác: Tiếng gõ ngọc/trúc thanh thoát
   */
  public playClickSound(volumeScale = 1.0) {
    if (this.settings.isMuted || !this.initContext() || !this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const duration = 0.05;

    try {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1250, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18 * volumeScale, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Bỏ qua lỗi
    }
  }

  /**
   * Dispatch SFX theo type
   */
  public playSFX(type: SFXType, isCrit = false, volumeScale = 1.0) {
    switch (type) {
      case 'thunder':
        this.playThunderSound(volumeScale);
        break;
      case 'slash':
        this.playSwordSlashSound(volumeScale, isCrit);
        break;
      case 'alchemy':
        this.playAlchemyFurnaceSound(volumeScale);
        break;
      case 'breakthrough':
        this.playBreakthroughSuccessSound(volumeScale);
        break;
      case 'click':
        this.playClickSound(volumeScale);
        break;
    }
  }

  // =========================================================================
  // NHẠC NỀN CỔ PHONG THIỀN ĐỊNH (PROCEDURAL AMBIENT BGM)
  // XIANXIA AMBIENT PAD & SOFT GUZHENG PENTATONIC ARPEGGIOS
  // =========================================================================

  /**
   * Tạo AudioBuffer Pink Noise (thuật toán Paul Kellet) kèm crossfade 2 đầu
   * để lặp vô tận (loop = true) mượt mà, không tiếng click hay giật méo sóng
   */
  private createPinkNoiseBuffer(ctx: AudioContext, durationSeconds = 6.0): AudioBuffer {
    const bufferSize = Math.floor(ctx.sampleRate * durationSeconds);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.10;
      b6 = white * 0.115926;
    }

    // Crossfade 0.5s ở 2 đầu biên để khi loop hoàn toàn liền mạch không giật
    const fadeLen = Math.floor(ctx.sampleRate * 0.5);
    for (let i = 0; i < fadeLen; i++) {
      const ratio = i / fadeLen;
      output[i] = output[i] * ratio + output[bufferSize - fadeLen + i] * (1 - ratio);
    }

    return noiseBuffer;
  }

  /**
   * Khởi động BGM Cổ Phong Thiền Định
   * 1. Gió Tiên Sơn (Pink Noise lọc Bandpass 480Hz kèm LFO 0.04Hz cực nhẹ 0.025)
   * 2. Cổ Cầm Ngũ Cung (Cụm 2 - 3 nốt lướt êm ái, cách nhau 8s - 14s)
   */
  public startAmbientBGM() {
    if (this.isBgmPlaying) return;
    if (!this.initContext() || !this.ctx || !this.bgmGain) return;
    if (!this.settings.bgmEnabled || this.settings.isMuted) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    try {
      // 1. LỚP GIÓ TIÊN SƠN (SOFT MOUNTAIN BREEZE)
      const pinkBuffer = this.createPinkNoiseBuffer(ctx, 6.0);
      this.breezeSource = ctx.createBufferSource();
      this.breezeSource.buffer = pinkBuffer;
      this.breezeSource.loop = true;

      // Bandpass filter 480Hz (Q = 1.0) giữ lại dải gió rào rào êm ả như rừng trúc, loại bỏ 100% sub-bass rè loa
      this.breezeFilter = ctx.createBiquadFilter();
      this.breezeFilter.type = 'bandpass';
      this.breezeFilter.frequency.setValueAtTime(480, now);
      this.breezeFilter.Q.setValueAtTime(1.0, now);

      // Gain gió nhẹ nhàng (0.026) với fade-in 1.2s tránh bụp tiếng
      this.breezeGain = ctx.createGain();
      this.breezeGain.gain.setValueAtTime(0.0001, now);
      this.breezeGain.gain.linearRampToValueAtTime(0.026, now + 1.2);

      // LFO hình sin tần số cực thấp (0.04Hz, chu kỳ 25s) tạo gió thoảng từng cơn
      this.breezeLfo = ctx.createOscillator();
      this.breezeLfo.type = 'sine';
      this.breezeLfo.frequency.setValueAtTime(0.04, now);

      this.breezeLfoGain = ctx.createGain();
      this.breezeLfoGain.gain.setValueAtTime(0.010, now);

      // Kết nối LFO điều chế âm lượng gió
      this.breezeLfo.connect(this.breezeLfoGain);
      this.breezeLfoGain.connect(this.breezeGain.gain);

      // Kết nối chuỗi âm thanh gió
      this.breezeSource.connect(this.breezeFilter);
      this.breezeFilter.connect(this.breezeGain);
      this.breezeGain.connect(this.bgmGain);

      this.breezeSource.start(now);
      this.breezeLfo.start(now);

      this.isBgmPlaying = true;

      // 2. LỚP CỔ CẦM NGŨ CUNG (GENTLE GUZHENG PHRASES)
      // Phát cụm đàn đầu tiên sau 1.8s để người chơi cảm nhận gió tĩnh trước, sau đó lướt đàn
      this.bgmPhraseTimer = setTimeout(() => {
        this.playSoftGuzhengPhrase();
        this.scheduleNextGuzhengPhrase();
      }, 1800);
    } catch (e) {
      console.warn('Lỗi khi kích hoạt BGM:', e);
      this.isBgmPlaying = false;
    }
  }

  // Alias
  public startBgm() {
    this.startAmbientBGM();
  }

  /**
   * Phát 1 nốt đàn tranh / cổ cầm với âm sắc 80% Sine + 20% Triangle
   * và đường cong ADSR mượt mà (Attack 0.05s, Decay/Release 3.0s)
   */
  private playGuzhengNote(freq: number, startTime: number) {
    if (!this.ctx || !this.bgmGain) return;
    const ctx = this.ctx;
    const noteDuration = 3.2;

    try {
      // 1. Sóng Sine cơ bản (ấm áp, trong trẻo, không chói)
      const sineOsc = ctx.createOscillator();
      sineOsc.type = 'sine';
      sineOsc.frequency.setValueAtTime(freq, startTime);

      // 2. Sóng Triangle (âm sắc dây tơ kim mộc)
      const triOsc = ctx.createOscillator();
      triOsc.type = 'triangle';
      triOsc.frequency.setValueAtTime(freq, startTime);

      // Envelope Gain
      const noteGain = ctx.createGain();
      const peakVol = 0.080; // Âm lượng nhẹ nhàng, thanh tao

      // ADSR Envelope:
      // Attack 0.05s tránh tiếng "click"
      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.linearRampToValueAtTime(peakVol, startTime + 0.05);
      // Decay & Release 3.0s ngân vang dần tan vào thinh không
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);

      // Trộn âm 80% Sine / 20% Triangle
      const sineGain = ctx.createGain();
      sineGain.gain.setValueAtTime(0.80, startTime);

      const triGain = ctx.createGain();
      triGain.gain.setValueAtTime(0.20, startTime);

      sineOsc.connect(sineGain);
      triOsc.connect(triGain);

      sineGain.connect(noteGain);
      triGain.connect(noteGain);

      // Lowpass Filter ở 1300Hz loại bỏ tạp âm cao gắt
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1300, startTime);

      noteGain.connect(filter);
      filter.connect(this.bgmGain);

      sineOsc.start(startTime);
      sineOsc.stop(startTime + noteDuration + 0.05);

      triOsc.start(startTime);
      triOsc.stop(startTime + noteDuration + 0.05);

      // Tự động giải phóng AudioNode sau khi hoàn thành
      const delayMs = Math.max(10, (startTime - ctx.currentTime + noteDuration + 0.1) * 1000);
      const timer = setTimeout(() => {
        try {
          sineOsc.disconnect();
          triOsc.disconnect();
          sineGain.disconnect();
          triGain.disconnect();
          noteGain.disconnect();
          filter.disconnect();
        } catch {}
        this.activeNoteTimers = this.activeNoteTimers.filter(t => t !== timer);
      }, delayMs);

      this.activeNoteTimers.push(timer);
    } catch {
      // Bỏ qua lỗi audio node
    }
  }

  /**
   * Chơi một cụm 2 - 3 nốt lướt chậm rãi (Arpeggio Phrase) theo ngũ cung cổ phong
   */
  private playSoftGuzhengPhrase() {
    if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
    if (!this.settings.bgmEnabled || this.settings.isMuted) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Bảng tần số ngũ cung cổ phong (Cung - Thương - Giốc - Chủy - Vũ)
    const pentatonicMap: Record<string, number> = {
      C4: 261.63,
      D4: 293.66,
      E4: 329.63,
      G4: 392.00,
      A4: 440.00,
      C5: 523.25,
      D5: 587.33,
      E5: 659.25
    };

    // Các mô-típ lướt phím cổ cầm kinh điển
    const motifs = [
      ['G4', 'A4', 'C5'],
      ['D4', 'G4', 'E4'],
      ['E4', 'G4'],
      ['A4', 'C5', 'D5'],
      ['C4', 'E4', 'G4'],
      ['E4', 'A4', 'G4'],
      ['D4', 'E4', 'A4'],
      ['G4', 'C5'],
      ['A4', 'E5', 'D5'],
      ['G4', 'D5', 'C5'],
      ['C4', 'G4', 'A4'],
      ['D4', 'A4', 'G4']
    ];

    const chosen = motifs[Math.floor(Math.random() * motifs.length)];
    const noteInterval = 0.35 + Math.random() * 0.12; // 0.35s - 0.47s giữa các nốt

    chosen.forEach((noteName, idx) => {
      const freq = pentatonicMap[noteName];
      if (freq) {
        this.playGuzhengNote(freq, now + idx * noteInterval);
      }
    });
  }

  /**
   * Lên lịch cho cụm đàn kế tiếp (ngẫu nhiên 8000ms - 14000ms)
   */
  private scheduleNextGuzhengPhrase() {
    if (!this.isBgmPlaying) return;
    const nextInterval = 8000 + Math.random() * 6000;
    this.bgmPhraseTimer = setTimeout(() => {
      this.playSoftGuzhengPhrase();
      this.scheduleNextGuzhengPhrase();
    }, nextInterval);
  }

  /**
   * Dừng BGM êm ái (Fade-out 0.4s tránh tiếng bụp ngắt đột ngột)
   */
  public stopAmbientBGM() {
    if (this.bgmPhraseTimer) {
      clearTimeout(this.bgmPhraseTimer);
      this.bgmPhraseTimer = null;
    }

    // Xóa toàn bộ timer nốt đàn đang chờ
    this.activeNoteTimers.forEach(t => clearTimeout(t));
    this.activeNoteTimers = [];

    // Fade-out tiếng gió trước khi ngắt hoàn toàn
    if (this.breezeGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.breezeGain.gain.setValueAtTime(this.breezeGain.gain.value, now);
        this.breezeGain.gain.linearRampToValueAtTime(0.0001, now + 0.35);
      } catch {}
    }

    const prevBreezeSource = this.breezeSource;
    const prevBreezeFilter = this.breezeFilter;
    const prevBreezeGain = this.breezeGain;
    const prevBreezeLfo = this.breezeLfo;
    const prevBreezeLfoGain = this.breezeLfoGain;

    this.breezeSource = null;
    this.breezeFilter = null;
    this.breezeGain = null;
    this.breezeLfo = null;
    this.breezeLfoGain = null;

    setTimeout(() => {
      try {
        if (prevBreezeSource) {
          prevBreezeSource.stop();
          prevBreezeSource.disconnect();
        }
        if (prevBreezeFilter) prevBreezeFilter.disconnect();
        if (prevBreezeGain) prevBreezeGain.disconnect();
        if (prevBreezeLfo) {
          prevBreezeLfo.stop();
          prevBreezeLfo.disconnect();
        }
        if (prevBreezeLfoGain) prevBreezeLfoGain.disconnect();
      } catch {}
    }, 400);

    this.isBgmPlaying = false;
  }

  // Alias
  public stopBgm() {
    this.stopAmbientBGM();
  }
}

// Singleton Audio Engine instance
export const audioEngine = new AudioManager();
