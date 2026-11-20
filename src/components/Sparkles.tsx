import { useMemo } from 'react';

/** Soft floating motes of magic — pure CSS animation, no canvas. */
export function Sparkles({ count = 26, className = '' }: { count?: number; className?: string }) {
  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Deterministic pseudo-random so the layout is stable between renders
        const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
        return {
          id: i,
          left: r(1) * 100,
          size: 3 + r(2) * 7,
          delay: r(3) * 18,
          duration: 16 + r(4) * 16,
          dx: (r(5) - 0.5) * 160,
          hue: ['#ffe08a', '#a5e9ff', '#ffb3d9', '#b8ffd9'][Math.floor(r(6) * 4)],
        };
      }),
    [count]
  );

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {motes.map((m) => (
        <span
          key={m.id}
          className="absolute bottom-[-10vh] rounded-full animate-drift"
          style={{
            left: `${m.left}%`,
            width: m.size,
            height: m.size,
            background: m.hue,
            boxShadow: `0 0 ${m.size * 4}px ${m.hue}`,
            animationDelay: `-${m.delay}s`,
            animationDuration: `${m.duration}s`,
            ['--dx' as string]: `${m.dx}px`,
          }}
        />
      ))}
    </div>
  );
}

/** Twinkling star field used behind hero sections. */
export function StarField({ count = 40 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((Math.sin(i * 34.17 + n * 91.7) * 5317.31) % 1 + 1) % 1;
        return { id: i, left: r(1) * 100, top: r(2) * 100, size: 1 + r(3) * 2.5, delay: r(4) * 4 };
      }),
    [count]
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, opacity: 0.7, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  );
}
