import { useCallback, useEffect, useRef } from 'react';

type SfxName = 'tap' | 'correct' | 'wrong' | 'win' | 'sparkle';

/** Tiny WebAudio sound kit — no assets, no network, safe when audio is blocked. */
export function useSfx() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensure = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      try {
        ctxRef.current = new Ctor();
      } catch {
        return null;
      }
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const tone = useCallback(
    (ctx: AudioContext, freq: number, start: number, dur: number, type: OscillatorType, gain = 0.08) => {
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      amp.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      amp.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
      amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
      osc.connect(amp).connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.02);
    },
    []
  );

  const play = useCallback(
    (name: SfxName) => {
      const ctx = ensure();
      if (!ctx) return;
      switch (name) {
        case 'tap':
          tone(ctx, 520, 0, 0.07, 'sine', 0.05);
          break;
        case 'correct':
          tone(ctx, 660, 0, 0.12, 'triangle', 0.08);
          tone(ctx, 880, 0.09, 0.16, 'triangle', 0.07);
          break;
        case 'wrong':
          tone(ctx, 220, 0, 0.16, 'sawtooth', 0.05);
          tone(ctx, 174, 0.1, 0.2, 'sawtooth', 0.04);
          break;
        case 'sparkle':
          tone(ctx, 1046, 0, 0.08, 'sine', 0.04);
          tone(ctx, 1318, 0.06, 0.1, 'sine', 0.035);
          break;
        case 'win':
          [523, 659, 784, 1046].forEach((f, i) => tone(ctx, f, i * 0.11, 0.22, 'triangle', 0.07));
          break;
      }
    },
    [ensure, tone]
  );

  useEffect(() => () => {
    void ctxRef.current?.close().catch(() => undefined);
    ctxRef.current = null;
  }, []);

  return play;
}
