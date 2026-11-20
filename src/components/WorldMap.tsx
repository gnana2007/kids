import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import { locations } from '../game/missions';
import { missions } from '../game/missions';
import { useProgress } from '../game/progress';
import type { LocationId } from '../game/types';

const pinStateFor = (
  locationId: LocationId,
  isUnlocked: (m: (typeof missions)[number]) => boolean,
  isCompleted: (id: string) => boolean
) => {
  const here = missions.filter((m) => m.location === locationId);
  if (here.length === 0) return { state: 'empty' as const, count: 0, done: 0 };
  const done = here.filter((m) => isCompleted(m.id)).length;
  const open = here.some((m) => isUnlocked(m) && !isCompleted(m.id));
  if (done === here.length) return { state: 'done' as const, count: here.length, done };
  if (open) return { state: 'open' as const, count: here.length, done };
  return { state: 'locked' as const, count: here.length, done };
};

export function WorldMap({
  selected,
  onSelect,
}: {
  selected: LocationId | null;
  onSelect: (id: LocationId) => void;
}) {
  const { hasFlag, isUnlocked, isCompleted } = useProgress();

  const frozen = hasFlag('river-frozen');
  const bridge = hasFlag('web-bridge');
  const powered = hasFlag('power-restored');
  const crane = hasFlag('supply-crane');
  const safe = hasFlag('villagers-safe');
  const lanterns = hasFlag('lightning-lights');
  const solved = hasFlag('mystery-solved');
  const studio = hasFlag('studio-open');

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/15 shadow-card">
      <div className="relative w-full" style={{ aspectRatio: '1000 / 640' }}>
        <svg viewBox="0 0 1000 640" className="absolute inset-0 h-full w-full" role="img" aria-label="The island of CharacterVerse">
          <defs>
            <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1b3f7a" />
              <stop offset="55%" stopColor="#23649b" />
              <stop offset="100%" stopColor="#2e8fb0" />
            </linearGradient>
            <linearGradient id="grass" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#7fd6a0" />
              <stop offset="48%" stopColor="#4fba86" />
              <stop offset="100%" stopColor="#2f9a74" />
            </linearGradient>
            <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe9b8" />
              <stop offset="100%" stopColor="#e8c07d" />
            </linearGradient>
            <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7fd4ff" />
              <stop offset="100%" stopColor="#2f86d8" />
            </linearGradient>
            <linearGradient id="ice" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#eafaff" />
              <stop offset="55%" stopColor="#b6e9ff" />
              <stop offset="100%" stopColor="#8fd0f0" />
            </linearGradient>
            <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f2e6ff" />
              <stop offset="100%" stopColor="#b7a4dd" />
            </linearGradient>
            <linearGradient id="roof" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff9a76" />
              <stop offset="100%" stopColor="#d94a54" />
            </linearGradient>
            <linearGradient id="towerRoof" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a98bff" />
              <stop offset="100%" stopColor="#6a44c9" />
            </linearGradient>
            <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cfe6ff" />
            </linearGradient>
            <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff3b0" />
              <stop offset="100%" stopColor="#ffc94b" />
            </linearGradient>
            <radialGradient id="islandShadow">
              <stop offset="0%" stopColor="#0b2444" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0b2444" stopOpacity="0" />
            </radialGradient>
            <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="7" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sea */}
          <rect width="1000" height="640" fill="url(#sea)" />
          {[70, 190, 520, 600].map((y, i) => (
            <path
              key={i}
              d={`M -40 ${y} q 60 -14 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0`}
              fill="none"
              stroke="#bfeaff"
              strokeOpacity={0.14}
              strokeWidth={3}
            />
          ))}
          <ellipse cx="500" cy="380" rx="470" ry="270" fill="url(#islandShadow)" />

          {/* Island land */}
          <path
            d="M 128 300 C 96 196 226 130 344 142 C 432 90 566 68 664 110 C 786 100 906 172 934 282 C 982 372 930 472 842 522 C 780 592 640 612 520 592 C 398 622 258 590 198 510 C 110 470 82 388 128 300 Z"
            fill="url(#sand)"
          />
          <path
            d="M 152 300 C 124 206 240 156 350 166 C 434 118 556 96 650 132 C 760 124 876 190 902 290 C 942 370 896 456 818 502 C 758 566 632 584 520 566 C 408 594 282 564 228 492 C 148 456 122 382 152 300 Z"
            fill="url(#grass)"
          />
          <path
            d="M 180 300 C 160 226 258 186 356 192 C 438 148 548 128 636 158 C 736 152 836 210 860 296 C 892 366 852 428 786 466 C 736 522 626 540 522 524 C 420 548 310 522 264 462 C 200 430 178 366 180 300 Z"
            fill="#64c996"
            fillOpacity="0.55"
          />

          {/* Roads */}
          <g fill="none" stroke="#ffe9b8" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 12" opacity="0.5">
            <path d="M 300 400 C 360 350 420 300 480 250" />
            <path d="M 500 250 C 580 270 680 310 760 350" />
            <path d="M 500 250 C 600 320 700 420 760 460" />
            <path d="M 300 400 C 380 440 470 450 520 460" />
            <path d="M 300 400 C 380 470 520 520 660 530" />
            <path d="M 820 330 C 840 270 850 220 850 170" />
          </g>

          {/* Mountain */}
          <g>
            <path d="M 760 300 L 850 132 L 940 300 Z" fill="#8b7bb5" />
            <path d="M 700 300 L 790 190 L 880 300 Z" fill="#a08fc9" />
            <path d="M 850 132 L 800 216 L 826 208 L 850 226 L 872 204 L 900 216 Z" fill="url(#snow)" />
            <path d="M 790 190 L 758 242 L 776 236 L 792 250 L 810 232 L 824 242 Z" fill="url(#snow)" />
            {[
              [820, 260],
              [884, 276],
              [742, 268],
              [760, 210],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4" fill="#fff" opacity="0.85" />
            ))}
          </g>

          {/* Forest */}
          <g>
            {[
              [130, 250, 1.05],
              [168, 214, 0.85],
              [196, 262, 1.1],
              [120, 300, 0.9],
              [230, 232, 0.95],
              [88, 210, 0.8],
              [214, 300, 0.8],
              [150, 322, 0.95],
              [258, 262, 0.7],
            ].map(([x, y, s], i) => (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                <rect x="-4" y="8" width="8" height="16" rx="3" fill="#8a5a34" />
                <path d="M 0 -26 L 20 14 L -20 14 Z" fill={i % 3 === 0 ? '#2f8f6b' : i % 3 === 1 ? '#3aa87c' : '#27795c'} />
              </g>
            ))}
          </g>

          {/* Castle */}
          <g>
            <rect x="446" y="238" width="88" height="52" rx="6" fill="url(#stone)" />
            <rect x="424" y="214" width="26" height="76" rx="4" fill="#efe3ff" />
            <rect x="530" y="214" width="26" height="76" rx="4" fill="#efe3ff" />
            <rect x="474" y="186" width="32" height="104" rx="4" fill="#f7eeff" />
            <path d="M 424 214 L 437 176 L 450 214 Z" fill="url(#towerRoof)" />
            <path d="M 530 214 L 543 176 L 556 214 Z" fill="url(#towerRoof)" />
            <path d="M 474 188 L 490 140 L 506 188 Z" fill="url(#towerRoof)" />
            <path d="M 490 140 L 490 118" stroke="#f0d6a0" strokeWidth="3" />
            <path d="M 490 118 L 514 126 L 490 136 Z" fill={studio ? '#ffd166' : '#c98bf0'} />
            <path d="M 486 268 l 0 -22 a 10 10 0 0 1 20 0 l 0 22 z" fill="#6a44c9" />
            <circle cx="496" cy="252" r="3.5" fill="#ffe08a" />
            {studio && (
              <g>
                <path d="M 404 214 Q 490 176 578 214" stroke="#ffd166" strokeWidth="2" fill="none" />
                {[418, 446, 474, 502, 530, 558].map((x, i) => (
                  <path key={i} d={`M ${x} ${204 - Math.abs(2 - i) * 3} l 10 0 l -5 14 z`} fill={i % 2 ? '#ff9ecb' : '#ffd166'} />
                ))}
              </g>
            )}
          </g>

          {/* Village */}
          <g>
            {[
              [236, 402, 1],
              [286, 388, 0.9],
              [318, 418, 0.8],
              [214, 434, 0.75],
            ].map(([x, y, s], i) => (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                <rect x="-16" y="-4" width="32" height="26" rx="4" fill="#fff3e2" />
                <path d="M -22 -4 L 0 -24 L 22 -4 Z" fill="url(#roof)" />
                <rect x="-9" y="6" width="9" height="9" rx="2" fill={powered ? 'url(#glow)' : '#6b5a86'} />
                <rect x="4" y="6" width="9" height="9" rx="2" fill={powered ? 'url(#glow)' : '#6b5a86'} />
                {powered && <rect x="-12" y="-2" width="24" height="26" rx="6" fill="#ffe08a" opacity="0.14" filter="url(#softGlow)" />}
              </g>
            ))}
            {crane && (
              <g transform="translate(196 392)">
                <rect x="-3" y="-46" width="6" height="52" fill="#7a5f3c" />
                <rect x="-3" y="-52" width="66" height="6" rx="2" fill="#ffc94b" />
                <path d="M 56 -46 l 0 20" stroke="#d9d2e8" strokeWidth="2" />
                <path d="M 48 4 q 8 0 8 -8 l 0 -20 l 8 0 l 0 20 q 0 14 -16 14 z" fill="#ff9a76" />
                <circle cx="0" cy="8" r="9" fill="#6d4bc9" opacity="0.9" />
              </g>
            )}
            {safe && (
              <g>
                {[
                  [252, 372],
                  [272, 366],
                  [292, 372],
                ].map(([x, y], i) => (
                  <g key={i} transform={`translate(${x} ${y})`}>
                    <circle cx="0" cy="-6" r="4.5" fill="#ffd6a8" />
                    <path d="M -4 -1 h 8 l 2 12 h -12 z" fill={i % 2 ? '#5f8ce8' : '#ff7a7a'} />
                  </g>
                ))}
              </g>
            )}
          </g>

          {/* Spark Lab */}
          <g>
            <rect x="742" y="330" width="96" height="52" rx="10" fill="#dcd6f0" />
            <path d="M 760 336 a 30 30 0 0 1 60 0 z" fill="#9fe8ff" />
            <circle cx="790" cy="322" r="9" fill="#8fd0ff" stroke="#fff" strokeWidth="3" />
            <rect x="806" y="352" width="20" height="14" rx="3" fill={lanterns ? 'url(#glow)' : '#7b6ba0'} />
            <path d="M 728 330 v -30" stroke="#b9aed8" strokeWidth="4" />
            <circle cx="728" cy="296" r="6" fill={lanterns ? '#ffe066' : '#8a7fb0'} filter={lanterns ? 'url(#softGlow)' : undefined} />
            {lanterns && (
              <g filter="url(#softGlow)">
                {[
                  [700, 370],
                  [726, 392],
                  [860, 386],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="7" fill="#ffe066" />
                ))}
              </g>
            )}
          </g>

          {/* Lantern City */}
          <g>
            {[
              [626, 500, 26, 74],
              [660, 470, 22, 104],
              [690, 490, 20, 84],
              [714, 508, 18, 66],
              [736, 486, 24, 88],
            ].map(([x, y, w, h], i) => (
              <g key={i}>
                <rect x={x} y={y} width={w} height={h} rx="4" fill={i % 2 ? '#7f74b3' : '#9a8ec9'} />
                {Array.from({ length: Math.floor(h / 22) }, (_, r) =>
                  Array.from({ length: Math.max(1, Math.floor(w / 12)) }, (_, c) => (
                    <rect
                      key={`${r}-${c}`}
                      x={x + 5 + c * 12}
                      y={y + 10 + r * 22}
                      width="5"
                      height="7"
                      rx="1"
                      fill={powered && (r + c + i) % 3 === 0 ? '#ffe066' : '#4b4270'}
                      opacity={powered && (r + c + i) % 3 === 0 ? 0.95 : 0.8}
                    />
                  ))
                )}
              </g>
            ))}
            {solved && (
              <g transform="translate(700 430) scale(1.25)">
                <circle cx="0" cy="0" r="9" fill="none" stroke="#ffe08a" strokeWidth="4" />
                <path d="M 7 7 L 14 14" stroke="#ffe08a" strokeWidth="4" strokeLinecap="round" />
              </g>
            )}
          </g>

          {/* River */}
          <g>
            <path
              d="M 866 132 C 840 200 800 250 750 300 C 700 350 640 380 600 420 C 560 460 545 505 520 555 C 505 590 500 612 498 640"
              fill="none"
              stroke={frozen ? 'url(#ice)' : 'url(#water)'}
              strokeWidth="20"
              strokeLinecap="round"
              opacity="0.95"
            />
            <path
              d="M 866 132 C 840 200 800 250 750 300 C 700 350 640 380 600 420 C 560 460 545 505 520 555 C 505 590 500 612 498 640"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.55"
              strokeWidth="3"
              strokeDasharray="6 16"
              strokeLinecap="round"
            >
              {!frozen && (
                <animate attributeName="stroke-dashoffset" from="44" to="0" dur="1.6s" repeatCount="indefinite" />
              )}
            </path>
            {frozen && (
              <g stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2" fill="none">
                <path d="M 812 246 l 16 -8" />
                <path d="M 700 352 l 14 10" />
                <path d="M 596 430 l 0 16" />
                <path d="M 528 520 l 12 8" />
              </g>
            )}
          </g>

          {/* Web bridge over the river */}
          {bridge && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <path d="M 486 466 Q 552 424 622 448" fill="none" stroke="#f2f6ff" strokeWidth="7" strokeLinecap="round" />
              <path d="M 486 466 Q 552 440 622 448" fill="none" stroke="#c9d8ff" strokeWidth="2" strokeDasharray="3 6" />
              <path d="M 490 462 Q 552 444 618 446 L 618 450 Q 552 448 490 466 Z" fill="#dbe6ff" opacity="0.7" />
              {safe && (
                <g>
                  <circle cx="540" cy="450" r="4.5" fill="#ffd6a8" />
                  <path d="M 536 454 h 8 l 2 10 h -12 z" fill="#5fd3a8" />
                </g>
              )}
            </motion.g>
          )}
        </svg>

        {/* Interactive location pins */}
        {locations.map((loc) => {
          const { state, count, done } = pinStateFor(loc.id, isUnlocked, isCompleted);
          const active = selected === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => onSelect(loc.id)}
              aria-pressed={active}
              aria-label={`${loc.name}${count ? ` — ${done} of ${count} adventures done` : ''}`}
              className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            >
              <span className="relative block">
                {state === 'open' && (
                  <span className="absolute inset-0 rounded-full bg-sun/70 animate-pulseRing" aria-hidden="true" />
                )}
                <span
                  className={[
                    'relative grid h-11 w-11 place-items-center rounded-full border-2 text-lg shadow-pop transition sm:h-12 sm:w-12 sm:text-xl',
                    active ? 'scale-110 border-white' : 'border-white/70 group-hover:scale-105',
                    state === 'done'
                      ? 'bg-gradient-to-br from-mint to-[#2f9a74] text-[#0d2b21]'
                      : state === 'open'
                        ? 'bg-gradient-to-br from-sun to-coral text-[#2b2140]'
                        : 'bg-[#3a2c66]/90 text-white/70',
                  ].join(' ')}
                >
                  {state === 'done' ? <Check className="h-5 w-5" strokeWidth={3} /> : loc.emoji}
                </span>
                {state === 'locked' && count > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#241756] text-[9px] ring-1 ring-white/30">
                    <Lock className="h-3 w-3" />
                  </span>
                )}
                {state === 'open' && count > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#241756] px-1 text-[10px] font-bold text-sun ring-1 ring-white/30">
                    {count - done}
                  </span>
                )}
              </span>
              <span
                className={[
                  'pointer-events-none mt-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide backdrop-blur sm:block sm:text-[10px]',
                  active ? 'block bg-white/90 text-[#2b2140]' : 'hidden bg-[#1d1345]/70 text-white/85',
                ].join(' ')}
              >
                {loc.name}
              </span>
            </button>
          );
        })}

        {/* Legend */}
        <div className="pointer-events-none absolute left-3 top-3 hidden flex-col gap-1 rounded-2xl bg-[#120a2e]/55 px-3 py-2 text-[10px] font-bold text-white/80 backdrop-blur sm:flex sm:text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-sun to-coral" /> adventure ready
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-mint to-[#2f9a74]" /> completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3a2c66]" /> locked
          </span>
        </div>
      </div>
    </div>
  );
}
