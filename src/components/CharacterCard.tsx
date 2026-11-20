import { forwardRef } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Character } from '../game/characters';
import { CharacterAvatar } from './CharacterAvatar';
import { StarRow } from './StarRow';

export type CardState = 'ready' | 'locked' | 'soon' | 'done';

const stateLabel: Record<CardState, string> = {
  ready: 'Adventure ready',
  locked: 'Story locked',
  soon: 'Coming soon',
  done: 'Completed',
};

export interface CharacterCardProps {
  character: Character;
  state: CardState;
  stars?: number;
  onSelect: (character: Character, state: CardState) => void;
  index?: number;
}

export const CharacterCard = forwardRef<HTMLButtonElement, CharacterCardProps>(function CharacterCard(
  { character, state, stars = 0, onSelect, index = 0 },
  ref
) {
  const dim = state === 'soon' || state === 'locked';
  return (
    <motion.button
      ref={ref}
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.3) }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(character, state)}
      className="group relative flex h-full flex-col items-center rounded-3xl border border-white/15 bg-white/10 p-4 text-center shadow-card backdrop-blur-xl transition-colors hover:border-white/35 hover:bg-white/15"
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-3xl opacity-40 blur-xl transition-opacity group-hover:opacity-70"
        style={{ background: `linear-gradient(180deg, ${character.colors[0]}, transparent)` }}
        aria-hidden="true"
      />

      <span className="absolute right-2.5 top-2.5">
        {state === 'soon' && (
          <span className="pill bg-white/15 text-[10px] text-white/75">soon</span>
        )}
        {state === 'locked' && (
          <span className="pill bg-black/30 text-[10px] text-white/70">
            <Lock className="h-3 w-3" /> locked
          </span>
        )}
        {state === 'done' && (
          <span className="pill bg-mint/25 text-[10px] text-mint">done</span>
        )}
      </span>

      <div className={`relative mt-2 transition ${dim ? 'opacity-70 grayscale-[35%]' : ''}`}>
        <CharacterAvatar character={character} size="lg" />
        {state === 'ready' && (
          <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-sun text-[#2b2140] shadow-pop">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold leading-tight">{character.name}</h3>
      <p className="mt-0.5 line-clamp-2 text-xs text-white/65">{character.ability}</p>

      <div className="mt-auto pt-3">
        {state === 'done' ? (
          <StarRow value={stars} size={16} />
        ) : (
          <span
            className={`text-[11px] font-bold uppercase tracking-wider ${
              state === 'ready' ? 'text-mint' : state === 'soon' ? 'text-white/60' : 'text-white/55'
            }`}
          >
            {stateLabel[state]}
          </span>
        )}
      </div>
    </motion.button>
  );
});
