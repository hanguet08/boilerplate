let audioContext: AudioContext | null = null;

/** Short two-tone chime via WebAudio (no asset needed). Silently no-ops before the first user gesture. */
export const playNewOrderSound = () => {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    audioContext = audioContext ?? new Ctx();
    const ctx = audioContext;
    [880, 1175].forEach((frequency, index) => {
      const start = ctx.currentTime + index * 0.18;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.4, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.17);
    });
  } catch {
    // audio is best-effort
  }
};

export const vibrate = (pattern: number[] = [200, 100, 200]) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern);
};
