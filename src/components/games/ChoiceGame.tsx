import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Lightbulb, RotateCcw } from 'lucide-react';
import type { ChoiceConfig } from '../../game/types';
import { useSfx } from '../../game/useSfx';
import { starsFromMistakes, type GameProps } from './shared';

export function ChoiceGame({ config, onComplete, onMistake }: GameProps<ChoiceConfig>) {
  const play = useSfx();
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const current = config.rounds[round];
  const isLast = round === config.rounds.length - 1;

  useEffect(() => {
    setPicked(null);
    setSolved(false);
    setShowHint(false);
  }, [round]);

  function choose(id: string) {
    if (solved) return;
    const option = current.options.find((o) => o.id === id);
    if (!option) return;
    setPicked(id);
    if (id === current.answer) {
      setSolved(true);
      play('correct');
    } else {
      setMistakes((m) => m + 1);
      onMistake?.();
      play('wrong');
    }
    void option;
  }

  function next() {
    play('tap');
    if (isLast) {
      onComplete({ stars: starsFromMistakes(mistakes), mistakes });
    } else {
      setRound((r) => r + 1);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* progress */}
      <div className="flex items-center gap-2">
        {config.rounds.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < round ? 'bg-mint' : i === round ? 'bg-sun' : 'bg-white/15'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={round}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="text-5xl sm:text-6xl" aria-hidden="true">
              {current.scene}
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
              {round === 0 ? 'Clue' : 'Clue'} {round + 1} of {config.rounds.length}
            </p>
            <h3 className="max-w-xl font-display text-xl font-semibold leading-snug sm:text-2xl">{current.prompt}</h3>
          </div>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {current.options.map((option) => {
              const wrong = picked === option.id && !solved;
              const right = solved && option.id === current.answer;
              return (
                <motion.button
                  key={option.id}
                  data-testid={`option-${option.id}`}
                  onClick={() => choose(option.id)}
                  whileTap={{ scale: 0.97 }}
                  animate={wrong ? { x: [0, -8, 8, -5, 0] } : {}}
                  transition={{ duration: 0.35 }}
                  className={[
                    'group relative flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition',
                    right
                      ? 'border-mint bg-mint/20'
                      : wrong
                        ? 'border-coral bg-coral/15'
                        : 'border-white/15 bg-white/[0.08] hover:border-white/35 hover:bg-white/15',
                    solved && !right ? 'opacity-45' : '',
                  ].join(' ')}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-2xl">
                    {option.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-base font-semibold">{option.label}</span>
                    {option.note && <span className="block text-xs text-white/55">{option.note}</span>}
                  </span>
                  {right && (
                    <span className="ml-auto grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint text-[#0d2b21]">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="min-h-[92px]">
        <AnimatePresence mode="wait">
          {solved ? (
            <motion.div
              key="ok"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-mint/40 bg-mint/15 p-4 text-center sm:flex-row sm:text-left"
            >
              <p className="flex-1 text-sm text-white/90">
                <span className="mr-1.5">⭐</span>
                {current.success}
              </p>
              <button onClick={next} className="btn-primary px-5 py-2.5 text-base">
                {isLast ? 'Finish mission' : 'Next clue'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : picked ? (
            <motion.div
              key="no"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-coral/40 bg-coral/15 p-4 text-center sm:flex-row sm:text-left"
            >
              <p className="flex-1 text-sm text-white/90">Not quite — look again and try another one. 💡</p>
              <button
                onClick={() => setShowHint((h) => !h)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/20"
              >
                <Lightbulb className="h-3.5 w-3.5 text-sun" />
                {showHint ? 'Hide hint' : 'Hint'}
              </button>
            </motion.div>
          ) : (
            <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-3 text-center text-sm text-white/45">
              Pick the answer that fits the question.
            </motion.p>
          )}
        </AnimatePresence>

        {showHint && !solved && (
          <p className="mt-2 text-center text-xs text-sun/90">
            Hint: {current.options.find((o) => o.id === current.answer)?.note ?? 'think about what the job needs'}
          </p>
        )}
      </div>

      {mistakes > 0 && (
        <button
          onClick={() => {
            setMistakes(0);
            setRound(0);
            play('tap');
          }}
          className="mx-auto inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70"
        >
          <RotateCcw className="h-3 w-3" /> start these clues again
        </button>
      )}
    </div>
  );
}
