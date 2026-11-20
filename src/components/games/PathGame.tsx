import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';
import type { PathConfig } from '../../game/types';
import { useSfx } from '../../game/useSfx';
import { starsFromMistakes, type GameProps } from './shared';
import { StarRow } from '../StarRow';

const k = (x: number, y: number) => `${x},${y}`;

function shortestPath(config: PathConfig): number {
  const rocks = new Set(config.rocks);
  const [sx, sy] = config.start;
  const [ex, ey] = config.end;
  const seen = new Set<string>([k(sx, sy)]);
  let frontier: [number, number, number][] = [[sx, sy, 1]];
  while (frontier.length) {
    const next: [number, number, number][] = [];
    for (const [x, y, d] of frontier) {
      if (x === ex && y === ey) return d;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        const key = k(nx, ny);
        if (nx < 0 || ny < 0 || nx >= config.cols || ny >= config.rows) continue;
        if (rocks.has(key) || seen.has(key)) continue;
        seen.add(key);
        next.push([nx, ny, d + 1]);
      }
    }
    frontier = next;
  }
  return Infinity;
}

export function PathGame({ config, onComplete, onMistake }: GameProps<PathConfig>) {
  const play = useSfx();
  const rocks = useMemo(() => new Set(config.rocks), [config.rocks]);
  const startKey = k(config.start[0], config.start[1]);
  const endKey = k(config.end[0], config.end[1]);

  const [frozen, setFrozen] = useState<Set<string>>(() => new Set([startKey, endKey]));
  const [won, setWon] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [nudge, setNudge] = useState<string | null>(null);

  const optimal = useMemo(() => shortestPath(config), [config]);
  const minExtra = Math.max(0, optimal - 2);
  const usedExtra = Math.max(0, frozen.size - 2);
  const stars = usedExtra <= minExtra + 1 ? 3 : usedExtra <= minExtra + 4 ? 2 : 1;

  useEffect(() => {
    if (won) return;
    // Flood fill from the west bank across frozen tiles
    const queue: [number, number][] = [[config.start[0], config.start[1]]];
    const seen = new Set<string>([startKey]);
    while (queue.length) {
      const [x, y] = queue.shift()!;
      if (k(x, y) === endKey) {
        setWon(true);
        play('correct');
        return;
      }
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        const key = k(nx, ny);
        if (!frozen.has(key) || seen.has(key)) continue;
        seen.add(key);
        queue.push([nx, ny]);
      }
    }
  }, [frozen, won, startKey, endKey, config.start, play]);

  function tap(x: number, y: number) {
    if (won) return;
    const key = k(x, y);
    if (rocks.has(key)) {
      setMistakes((m) => m + 1);
      onMistake?.();
      setNudge('Rocks are too solid to freeze — find another way around.');
      play('wrong');
      return;
    }
    if (key === startKey || key === endKey) return;
    setFrozen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setNudge(null);
    play('tap');
  }

  function reset() {
    setFrozen(new Set([startKey, endKey]));
    setWon(false);
    setNudge(null);
    play('tap');
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/75">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/80" /> tap water to freeze it
        </span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 font-bold text-white/75">
          Ice tiles: {frozen.size}
        </span>
      </div>

      <div className="mx-auto w-full max-w-lg">
        <div className="flex items-center justify-between px-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-white/65">
          <span>West bank</span>
          <span>East bank</span>
        </div>
        <div
          data-testid="path-board"
          className="grid gap-1.5 rounded-2xl bg-[#123a5c]/60 p-2 shadow-inner"
          style={{ gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: config.rows }, (_, y) =>
            Array.from({ length: config.cols }, (_, x) => {
              const key = k(x, y);
              const isRock = rocks.has(key);
              const isStart = key === startKey;
              const isEnd = key === endKey;
              const isIce = frozen.has(key);
              return (
                <button
                  key={key}
                  data-testid={`cell-${x}-${y}`}
                  onClick={() => tap(x, y)}
                  aria-label={
                    isRock ? 'Rock' : isStart ? 'West bank' : isEnd ? 'East bank flag' : isIce ? 'Ice tile' : 'Water'
                  }
                  className={[
                    'relative grid aspect-square place-items-center rounded-xl border text-lg transition sm:text-xl',
                    isRock
                      ? 'border-white/10 bg-gradient-to-br from-[#6f6889] to-[#403a58] cursor-not-allowed'
                      : isEnd
                        ? 'border-mint/60 bg-gradient-to-br from-[#d7fff0] to-[#9fe8c9] text-[#1c6e52]'
                        : isStart
                          ? 'border-white/50 bg-gradient-to-br from-[#eafaff] to-[#a8dcf5] text-[#2b6486]'
                          : isIce
                            ? 'border-white/70 bg-gradient-to-br from-[#f2fdff] to-[#a8dcf5] text-[#2f6f92] shadow-[0_0_14px_rgba(168,220,245,.45)]'
                            : 'border-white/15 bg-gradient-to-br from-[#3f8fd8] to-[#23649b] hover:border-white/40 hover:from-[#4fa8e8]',
                  ].join(' ')}
                >
                  {isRock ? (
                    <span aria-hidden="true">🪨</span>
                  ) : isEnd ? (
                    <span aria-hidden="true">🚩</span>
                  ) : isStart ? (
                    <span aria-hidden="true">🏘️</span>
                  ) : isIce ? (
                    <span aria-hidden="true">❄️</span>
                  ) : (
                    <span className="text-[10px] text-white/30" aria-hidden="true">
                      ~
                    </span>
                  )}
                  {isIce && !isStart && !isEnd && (
                    <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/50" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      <p className="text-center text-xs text-white/65">{config.hint}</p>

      <AnimatePresence>
        {nudge && !won && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-coral"
          >
            {nudge}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="min-h-[84px]">
        <AnimatePresence mode="wait">
          {won ? (
            <motion.div
              key="won"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-mint/40 bg-mint/15 p-4 text-center sm:flex-row sm:text-left"
            >
              <div className="flex-1">
                <p className="font-display text-lg font-semibold">The ice path is ready! 🧊</p>
                <p className="text-sm text-white/75">You used {frozen.size} ice tiles. Every step is safe now.</p>
              </div>
              <StarRow value={stars} size={22} animate />
              <button
                onClick={() => onComplete({ stars, mistakes })}
                className="btn-primary px-5 py-2.5 text-base"
              >
                Walk across
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-white/70">
                Freeze tiles that touch each other, all the way to the flag.
              </p>
              <button onClick={reset} className="btn-ghost px-3 py-1.5 text-xs">
                <RotateCcw className="h-3.5 w-3.5" /> Reset ice
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
