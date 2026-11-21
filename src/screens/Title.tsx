import { motion } from 'framer-motion';
import { BookOpen, Play, Sparkles } from 'lucide-react';
import { PLAYABLE } from '../game/characters';
import { portrait } from '../game/art/sprites';
import type { SaveData } from '../game/save';
import { Cloud, Logo, SparkleField, StarChip, completedCount } from '../ui/bits';

interface Props {
  save: SaveData;
  onStart: () => void;
  onContinue: () => void;
  onHowTo: () => void;
}

const FLOATERS = ['doraemon', 'pikachu', 'elsa', 'spiderman', 'ironman', 'bheem'];

export default function Title({ save, onStart, onContinue, onHowTo }: Props) {
  const done = completedCount(save.missions);
  return (
    <div className="sky-bg relative flex h-full w-full flex-col overflow-hidden">
      <SparkleField count={22} />
      <Cloud className="left-[6%] top-[12%] h-14 w-32" delay={1} />
      <Cloud className="right-[10%] top-[18%] h-10 w-24" delay={3} />
      <Cloud className="left-[24%] top-[34%] h-8 w-20 opacity-70" delay={2} />
      <Cloud className="right-[26%] top-[40%] h-12 w-28 opacity-80" delay={4} />

      {/* floating heroes */}
      {FLOATERS.map((id, i) => {
        const hero = PLAYABLE.find((h) => h.id === id)!;
        const positions = [
          { left: '5%', top: '24%' },
          { left: '16%', top: '48%' },
          { right: '7%', top: '23%' },
          { right: '18%', top: '47%' },
          { left: '8%', top: '66%' },
          { right: '9%', top: '65%' },
        ];
        const pos = positions[i];
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 30, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.09, type: 'spring', stiffness: 130 }}
            className="absolute hidden xl:block"
            style={{ ...pos }}
          >
            <div className="animate-floaty" style={{ animationDelay: `${i * 0.4}s` }}>
              <div className="flex flex-col items-center">
                <div className="rounded-[2rem] border-4 border-white/90 bg-white/30 p-1 shadow-[0_16px_30px_rgba(60,90,150,.25)] backdrop-blur-sm">
                  <img src={portrait(id, 168)} alt={hero.name} className="h-20 w-20 select-none sm:h-24 sm:w-24" draggable={false} />
                </div>
                <span className="mt-2 rounded-full bg-white/85 px-3 py-0.5 text-xs font-extrabold text-slate-700 shadow-sm">{hero.name}</span>
              </div>
            </div>
          </motion.div>
        );
      })}

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-2">
          <span className="pill bg-white/80 text-[11px] uppercase tracking-[0.18em] text-violet-600">
            <Sparkles className="h-3.5 w-3.5" /> A real 2D platformer
          </span>
          <StarChip done={done} />
        </motion.div>

        <Logo />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 max-w-xl text-balance text-base font-semibold text-slate-600 sm:text-lg"
        >
          Walk into a hand-drawn island, meet eight heroes, and use their real powers to bring one shared world back to life.
        </motion.p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button className="btn btn-primary px-8 py-4 text-lg" onClick={onStart}>
            <Play className="h-5 w-5 fill-white" /> {save.started ? 'Choose a hero' : 'Start Adventure'}
          </button>
          {save.started && (
            <button className="btn btn-ghost" onClick={onContinue}>
              Continue · {done}/{8} missions
            </button>
          )}
          <button className="btn btn-ghost" onClick={onHowTo}>
            <BookOpen className="h-4 w-4" /> How to play
          </button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-500">
          <span className="pill">8 playable heroes</span>
          <span className="pill">3 connected lands</span>
          <span className="pill">8 exploration missions</span>
          <span className="pill">world saves automatically</span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-emerald-300/30 to-transparent" />
      <p className="relative z-10 px-4 pb-3 text-center text-[10px] font-semibold leading-snug text-slate-600/90 sm:text-[11px]">
        Fan-made prototype · character sprites are original code-drawn placeholders · characters belong to their creators
      </p>
    </div>
  );
}
