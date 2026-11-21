type Tone = 'ui' | 'jump' | 'collect' | 'zap' | 'freeze' | 'repair' | 'win' | 'carry';

let ctx: AudioContext | null = null;
let muted = false;

function ensure(): AudioContext | null {
  if (typeof window === 'undefined' || muted) return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function beep(c: AudioContext, freq: number, start: number, dur: number, type: OscillatorType, gain = 0.06) {
  const osc = c.createOscillator();
  const amp = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  amp.gain.setValueAtTime(0.0001, c.currentTime + start);
  amp.gain.exponentialRampToValueAtTime(gain, c.currentTime + start + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  osc.connect(amp).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.03);
}

export function sfx(tone: Tone) {
  const c = ensure();
  if (!c) return;
  switch (tone) {
    case 'ui':
      beep(c, 620, 0, 0.06, 'sine', 0.04);
      break;
    case 'jump':
      beep(c, 420, 0, 0.09, 'square', 0.035);
      beep(c, 660, 0.05, 0.08, 'square', 0.03);
      break;
    case 'collect':
      beep(c, 880, 0, 0.08, 'triangle', 0.05);
      beep(c, 1240, 0.06, 0.1, 'triangle', 0.045);
      break;
    case 'zap':
      beep(c, 1200, 0, 0.05, 'sawtooth', 0.035);
      beep(c, 300, 0.03, 0.14, 'sawtooth', 0.03);
      break;
    case 'freeze':
      beep(c, 1568, 0, 0.1, 'sine', 0.04);
      beep(c, 2093, 0.07, 0.12, 'sine', 0.03);
      break;
    case 'repair':
      beep(c, 520, 0, 0.08, 'square', 0.04);
      beep(c, 780, 0.08, 0.1, 'square', 0.04);
      break;
    case 'carry':
      beep(c, 240, 0, 0.1, 'triangle', 0.05);
      break;
    case 'win':
      [523, 659, 784, 1046].forEach((f, i) => beep(c, f, i * 0.1, 0.2, 'triangle', 0.06));
      break;
  }
}

export function setMuted(value: boolean) {
  muted = value;
}

export function isMuted() {
  return muted;
}
