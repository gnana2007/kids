import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X, Zap } from 'lucide-react';
import type { CircuitConfig } from '../../game/types';
import { useSfx } from '../../game/useSfx';
import { starsFromMistakes, type GameProps } from './shared';

export function CircuitGame({ config, onComplete, onMistake }: GameProps<CircuitConfig>) {
  const play = useSfx();
  const [chain, setChain] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [phase, setPhase] = useState<'build' | 'bonus'>('build');
  const [bonusPick, setBonusPick] = useState<string | null>(null);
  const [bonusDone, setBonusDone] = useState(false);

  const byId = useMemo(() => Object.fromEntries(config.nodes.map((n) => [n.id, n])), [config.nodes]);
  const complete = chain.length === config.order.length;

  function tapNode(id: string) {
    if (phase !== 'build' || complete) return;
    if (chain.includes(id)) {
      setMsg('That part is already glowing — keep going forward.');
      return;
    }
    const expected = config.order[chain.length];
    if (id === expected) {
      const nextChain = [...chain, id];
      setChain(nextChain);
      setMsg(null);
      play('sparkle');
      if (nextChain.length === config.order.length) {
        setTimeout(() => setPhase('bonus'), 650);
      }
    } else {
      setMistakes((m) => m + 1);
      onMistake?.();
      setFlash(id);
      window.setTimeout(() => setFlash(null), 450);
      setMsg(
        chain.length === 0
          ? 'Start where the energy is made — the battery!'
          : `Hmm, the electricity flows to the ${byId[expected]?.label ?? 'next part'} next.`
      );
      play('wrong');
    }
  }

  function chooseBonus(id: string) {
    if (!config.bonus || bonusDone) return;
    setBonusPick(id);
    if (id === config.bonus.answer) {
      setBonusDone(true);
      play('correct');
    } else {
      setMistakes((m) => m + 1);
      onMistake?.();
      play('wrong');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* chain readout */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {config.order.map((id, i) => {
          const node = byId[id];
          const done = i < chain.length;
          return (
            <div key={id} className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold transition ${
                  done ? 'border-mint/60 bg-mint/20 text-mint' : 'border-white/15 bg-white/5 text-white/60'
                }`}
              >
                <span aria-hidden="true">{node?.emoji}</span>
                {node?.label}
              </span>
              {i < config.order.length - 1 && <span className="text-white/25">›</span>}
            </div>
          );
        })}
      </div>

      <div className="relative mx-auto aspect-[5/4] w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 game-stage">
        {/* circuitry backdrop */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <g stroke="#ffffff" strokeOpacity="0.09" strokeWidth="1" fill="none">
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 12} x2="100" y2={i * 12} />
            ))}
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`v${i}`} x1={i * 12} y1="0" x2={i * 12} y2="100" />
            ))}
          </g>
          {/* completed circuit path */}
          {chain.slice(0, -1).map((id, i) => {
            const a = byId[id];
            const b = byId[chain[i + 1]];
            if (!a || !b) return null;
            return (
              <g key={`${id}-${b.id}`}>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#ffd166"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  opacity="0.35"
                  strokeDasharray="8 10"
                >
                  <animate attributeName="stroke-dashoffset" from="18" to="0" dur="0.9s" repeatCount="indefinite" />
                </line>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#fff6c9"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            );
          })}
        </svg>

        {/* glowing bulb halo */}
        {complete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_30%,rgba(255,224,138,.55),transparent_45%)]"
          />
        )}

        {config.nodes.map((node) => {
          const inChain = chain.includes(node.id);
          const isFlash = flash === node.id;
          return (
            <motion.button
              key={node.id}
              data-testid={`node-${node.id}`}
              onClick={() => tapNode(node.id)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              animate={isFlash ? { x: [0, -6, 6, -4, 0] } : { x: 0 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              aria-label={`${node.label} — ${node.hint}`}
              aria-pressed={inChain}
              disabled={complete || phase === 'bonus'}
            >
              <span
                className={[
                  'relative grid h-12 w-12 place-items-center rounded-2xl border-2 text-2xl shadow-pop transition sm:h-14 sm:w-14',
                  isFlash
                    ? 'border-coral bg-coral/30'
                    : inChain
                      ? 'border-sun bg-gradient-to-br from-[#5a4a9e] to-[#3a2c6e] shadow-[0_0_22px_rgba(255,209,102,.55)]'
                      : 'border-white/25 bg-[#2e2160]/85 hover:border-white/60',
                ].join(' ')}
              >
                {node.emoji}
                {inChain && (
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-mint text-[#0d2b21]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                )}
              </span>
              <span className="mt-1 block whitespace-nowrap rounded-full bg-[#160d33]/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/75">
                {node.label}
              </span>
            </motion.button>
          );
        })}

        {complete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-mint/90 px-3 py-1 text-xs font-bold text-[#0d2b21]"
          >
            Complete loop! ⚡
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {msg && phase === 'build' && (
          <motion.p
            key={msg}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-coral"
          >
            {msg}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'bonus' && config.bonus && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-sun/40 bg-sun/10 p-4"
          >
            <div className="flex items-center gap-2 font-display text-sm font-semibold text-sun">
              <Zap className="h-4 w-4" /> Bonus test
            </div>
            <p className="mt-1 text-sm text-white/85">{config.bonus.prompt}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {config.bonus.options.map((o) => {
                const right = bonusDone && o.id === config.bonus!.answer;
                const wrong = bonusPick === o.id && !bonusDone;
                return (
                  <button
                    key={o.id}
                    data-testid={`bonus-${o.id}`}
                    onClick={() => chooseBonus(o.id)}
                    disabled={bonusDone}
                    className={[
                      'flex items-center gap-2 rounded-xl border-2 p-2.5 text-left text-sm font-semibold transition',
                      right
                        ? 'border-mint bg-mint/20'
                        : wrong
                          ? 'border-coral bg-coral/15'
                          : 'border-white/15 bg-white/5 hover:border-white/35 hover:bg-white/10',
                    ].join(' ')}
                  >
                    <span className="text-xl">{o.emoji}</span>
                    <span className="flex-1">{o.label}</span>
                    {right && <Check className="h-4 w-4 text-mint" />}
                    {wrong && <X className="h-4 w-4 text-coral" />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {bonusDone && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex flex-col items-center gap-2 rounded-xl bg-mint/15 p-3 text-center sm:flex-row sm:text-left"
                >
                  <p className="flex-1 text-sm text-white/85">{config.bonus.success}</p>
                  <button
                    onClick={() => onComplete({ stars: starsFromMistakes(mistakes), mistakes })}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    Light the lamps
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
