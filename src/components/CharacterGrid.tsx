import { AnimatePresence, motion } from 'framer-motion';
import type { Character } from '../game/characters';
import { CharacterCard, type CardState } from './CharacterCard';

export interface GridItem {
  character: Character;
  state: CardState;
  stars: number;
}

export function CharacterGrid({ items, onSelect }: { items: GridItem[]; onSelect: (c: Character, s: CardState) => void }) {
  if (items.length === 0) {
    return (
      <div className="card mx-auto mt-10 max-w-md p-8 text-center">
        <p className="text-4xl">🔎</p>
        <h3 className="mt-2 font-display text-xl">No characters found</h3>
        <p className="mt-1 text-sm text-white/65">Try another name, or clear the filters to see everyone.</p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => (
          <CharacterCard
            key={item.character.id}
            character={item.character}
            state={item.state}
            stars={item.stars}
            onSelect={onSelect}
            index={i}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
