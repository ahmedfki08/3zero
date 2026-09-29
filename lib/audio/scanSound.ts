'use client';

let audioCtx: AudioContext | null = null;
let isSoundEnabled = true;

const STORAGE_KEY = '3zero_event_sound_enabled';

export function getSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored !== null ? stored === 'true' : true;
}

export function setSoundEnabled(enabled: boolean): void {
  isSoundEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a quick subtle click/tick during the scanner pass
 */
export function playSweepTick(volume = 0.08): void {
  if (!getSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // AudioContext silently handled
  }
}

/**
 * Plays a crisp dual-tone confirmation beep upon successful scan
 */
export function playConfirmationBeep(volume = 0.14): void {
  if (!getSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Tone 1: 880 Hz (A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(volume, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Tone 2: 1320 Hz (E6 - major fifth harmonic)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.07);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(volume * 1.1, now + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.13);

    osc2.start(now + 0.07);
    osc2.stop(now + 0.23);
  } catch {
    // AudioContext silently handled
  }
}
