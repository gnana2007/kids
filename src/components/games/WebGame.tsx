import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import type { WebConfig } from '../../game/types';
import { useSfx } from '../../game/useSfx';
import { starsFromMistakes, type GameProps } from './shared';
import { StarRow } from '../StarRow';

export function WebGame({ config, onComplete, onMistake }: GameProps<WebConfig>) {
  const play = useSfx();
  const [progress, setProgress] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [broken, setBroken] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [shake, setShake] = useState<string | null>(null);

  const byId = Object.fromEntries(config.anchors.map((a) => [a.id, a]));
  const complete = progress >= config.order.length;

  function tapAnchor(id: string) {
    if (complete) return;
    const anchor = byId[id];
    if (!anchor) return;
    if (broken.includes(id)) return;

    if (anchor.weak) {
      setBroken((b) => [...b, id]);
      setMistakes((m) => m + 1);
      onMistake?.();
      setMsg(`${anchor.label} crumbled! Look for a shiny bolted anchor instead.`);
      setShake(id);
      window.setTimeout(() => setShake(null), 450);
      play('wrong');
      return;
    }

    if (config.order[progress] === id) {
      setProgress((p) => p + 1);
      setMsg(null);
      play('sparkle');
    } else {
      setMistakes((m) => m + 1);
      onMistake?.();
      setMsg('Keep working outward — the next steel bolt along the way is the one to grab.');
      setShake(id);
      window.setTimeout(() => setShake(null), 450);
      play('wrong');
    }
  }

  const stars = starsFromMistakes(mistakes);
  const chain = config.order.slice(0, progress);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/15">
        <svg viewBox="0 0 100 62" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="webSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a1a5c" />
              <stop offset="60%" stopColor="#4b2b86" />
              <stop offset="100%" stopColor="#2b3f7a" />
            </linearGradient>
            <linearGradient id="cliff" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8d7fb8" />
              <stop offset="100%" stopColor="#4c4074" />
            </linearGradient>
          </defs>
          <rect width="100" height="62" fill="url(#webSky)" />
          {[
            [14, 10],
            [38, 6],
            [66, 12],
            [86, 7],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="0.5" fill="#fff" opacity="0.7" />
          ))}
          <circle cx="78" cy="12" r="4" fill="#ffe08a" opacity="0.25" />
          <circle cx="78" cy="12" r="2.2" fill="#fff3c4" opacity="0.85" />

          {/* gorge */}
          <rect x="16" y="34" width="72" height="28" fill="#160e33" />
          <path d="M 16 34 q 36 12 72 0 l 0 28 l -72 0 z" fill="#1d1341" />
          <path d="M 26 48 q 24 -6 48 0" stroke="#3a2c6e" strokeWidth="1.2" fill="none" />
          <path d="M 32 54 q 18 -4 36 0" stroke="#3a2c6e" strokeWidth="1" fill="none" />

          {/* cliffs */}
          <path d="M 0 6 L 20 6 L 22 34 L 18 62 L 0 62 Z" fill="url(#cliff)" />
          <path d="M 100 6 L 80 6 L 78 34 L 82 62 L 100 62 Z" fill="url(#cliff)" />
          <path d="M 0 6 L 20 6 L 20.6 12 L 0 12 Z" fill="#9fe0c0" opacity="0.8" />
          <path d="M 100 6 L 80 6 L 79.4 12 L 100 12 Z" fill="#9fe0c0" opacity="0.8" />

          {/* buildings */}
          <g>
            <rect x="3" y="16" width="7" height="14" rx="1" fill="#c9b8e8" opacity="0.7" />
            <rect x="8" y="10" width="6" height="20" rx="1" fill="#e3d6ff" opacity="0.6" />
            <rect x="84" y="12" width="7" height="18" rx="1" fill="#c9b8e8" opacity="0.7" />
            <rect x="90" y="18" width="6" height="12" rx="1" fill="#e3d6ff" opacity="0.6" />
          </g>

          {/* web lines */}
          {chain.slice(0, -1).map((id, i) => {
            const a = byId[id];
            const b = byId[chain[i + 1]];
            if (!a || !b) return null;
            return (
              <g key={`${id}-${b.id}`}>
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  d={`M ${a.x} ${a.y * 0.62} Q ${(a.x + b.x) / 2} ${(a.y + b.y) * 0.31 - 2} ${b.x} ${b.y * 0.62}`}
                  fill="none"
                  stroke="#eef3ff"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={`M ${a.x} ${a.y * 0.62} Q ${(a.x + b.x) / 2} ${(a.y + b.y) * 0.31 - 2} ${b.x} ${b.y * 0.62}`}
                  fill="none"
                  stroke="#b9c9ff"
                  strokeWidth="3"
                  strokeDasharray="1 3"
                  opacity="0.5"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            );
          })}

          {/* finished bridge deck */}
          {complete && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {Array.from({ length: 13 }, (_, i) => {
                const t = i / 12;
                const x = 18 + t * 64;
                const y = 34 + Math.sin(t * Math.PI) * 2;
                return <rect key={i} x={x} y={y} width="4.2" height="1.6" rx="0.4" fill="#ffe0b0" opacity="0.95" />;
              })}
              <path d="M 18 35.6 Q 50 40 82 35.6" stroke="#ffd166" strokeWidth="0.5" fill="none" opacity="0.7" />
            </motion.g>
          )}
        </svg>

        {/* anchor buttons */}
        {config.anchors.map((anchor) => {
          const isBroken = broken.includes(anchor.id);
          const used = chain.includes(anchor.id);
          return (
            <motion.button
              key={anchor.id}
              data-testid={`anchor-${anchor.id}`}
              onClick={() => tapAnchor(anchor.id)}
              disabled={isBroken || complete}
              whileHover={!isBroken ? { scale: 1.1 } : undefined}
              animate={shake === anchor.id ? { rotate: [0, -8, 8, -5, 0] } : { rotate: 0 }}
              style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              aria-label={anchor.label}
              title={anchor.label}
            >
              <span
                className={[
                  'grid h-10 w-10 place-items-center rounded-full border-2 text-base shadow-pop transition sm:h-11 sm:w-11 sm:text-lg',
                  isBroken
                    ? 'border-white/10 bg-[#2a1f4d]/60 opacity-40 saturate-0'
                    : used
                      ? 'border-mint bg-gradient-to-br from-mint to-[#2f9a74] text-[#0d2b21]'
                      : anchor.weak
                        ? 'border-coral/70 bg-gradient-to-br from-[#8a5a5a] to-[#5a3540]'
                        : 'border-white/70 bg-gradient-to-br from-[#ffd166] to-[#c98a2b]',
                ].join(' ')}
              >
                {isBroken ? '💥' : used ? <Check className="h-4 w-4" strokeWidth={3} /> : anchor.weak ? '🧱' : '🔩'}
              </span>
              {!isBroken && (
                <span className="pointer-events-none absolute left-1/2 top-full mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-[#160d33]/85 px-1.5 py-0.5 text-[9px] font-bold text-white/80 group-hover:block sm:block sm:opacity-70">
                  {anchor.label}
                </span>
              )}
            </motion.button>
          );
        })}

        <div className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-[#160d33]/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/70">
          west bank ⇒ east bank
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" /> bolted steel = strong
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#8a5a5a]" /> loose brick = weak
        </span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 font-bold text-white/90">
          Anchors: {progress}/{config.order.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {msg && (
          <motion.p key={msg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-sm text-coral">
            {msg}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="min-h-[76px]">
        {complete ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-mint/40 bg-mint/15 p-4 text-center sm:flex-row sm:text-left"
          >
            <div className="flex-1">
              <p className="font-display text-lg font-semibold">The web bridge is swinging over the gorge! 🕸️</p>
              <p className="text-sm text-white/75">Strong anchors on both banks keep it steady.</p>
            </div>
            <StarRow value={stars} size={22} animate />
            <button onClick={() => onComplete({ stars, mistakes })} className="btn-primary px-4 py-2.5 text-base">
              Cross the bridge
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <p className="text-center text-xs text-white/65">
            Tap the strong anchors in order, from the west bank to the east bank.
          </p>
        )}
      </div>
    </div>
  );
}
