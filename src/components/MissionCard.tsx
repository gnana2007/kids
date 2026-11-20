import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Play, RotateCcw } from 'lucide-react';
import type { Mission } from '../game/types';
import { characterById } from '../game/characters';
import { missionById } from '../game/missions';
import { useProgress } from '../game/progress';
import { CharacterAvatar } from './CharacterAvatar';
import { StarRow } from './StarRow';

export function MissionCard({ mission, onPlay }: { mission: Mission; onPlay?: () => void }) {
  const { isCompleted, isUnlocked, starsFor } = useProgress();
  const character = characterById(mission.characterId);
  const unlocked = isUnlocked(mission);
  const done = isCompleted(mission.id);
  const stars = starsFor(mission.id);
  const prereq = mission.prereq ? missionById(mission.prereq) : undefined;

  if (!character) return null;

  return (
    <motion.div
      whileHover={unlocked ? { y: -3 } : undefined}
      className={`relative flex flex-col gap-3 overflow-hidden rounded-3xl border p-4 transition ${
        unlocked
          ? 'border-white/20 bg-white/10 hover:border-white/35 hover:bg-white/15'
          : 'border-white/10 bg-black/20'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <CharacterAvatar character={character} size="md" />
          {done && (
            <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-mint text-[11px] text-[#0d2b21] shadow">
              ✓
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {mission.chapter && (
              <span className="pill bg-grape/40 text-[9px] text-white/85">Story ch. {mission.chapter}</span>
            )}
            <span className="pill bg-white/10 text-[9px] text-white/60">{character.name}</span>
          </div>
          <h4 className="mt-1 font-display text-base font-semibold leading-snug">{mission.title}</h4>
          <p className="line-clamp-2 text-xs text-white/60">{mission.tagline}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        {done ? <StarRow value={stars} size={16} /> : <span className="text-[11px] text-white/45">3 stars to earn</span>}

        {unlocked ? (
          <Link
            to={`/adventure/${mission.id}`}
            onClick={onPlay}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
              done
                ? 'bg-white/15 text-white hover:bg-white/25'
                : 'bg-gradient-to-r from-sun to-coral text-[#2b2140] shadow-pop hover:brightness-105'
            }`}
          >
            {done ? <RotateCcw className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            {done ? 'Play again' : 'Play'}
            {!done && <ArrowRight className="h-3.5 w-3.5" />}
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-xs font-bold text-white/55">
            <Lock className="h-3 w-3" />
            Finish {prereq ? `“${prereq.title}”` : 'the first chapter'}
          </span>
        )}
      </div>
    </motion.div>
  );
}
