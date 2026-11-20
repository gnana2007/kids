import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Sparkles, X } from 'lucide-react';
import { categories, characters, missionCharacters, type CategoryId, type Character } from '../game/characters';
import { missionForCharacter } from '../game/missions';
import { useProgress } from '../game/progress';
import { CharacterGrid, type GridItem } from '../components/CharacterGrid';
import { CharacterAvatar } from '../components/CharacterAvatar';
import type { CardState } from '../components/CharacterCard';

type Filter = 'all' | CategoryId;

export function CharacterSelection() {
  const navigate = useNavigate();
  const { isCompleted, starsFor, isUnlocked } = useProgress();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<Character | null>(null);

  const items = useMemo<GridItem[]>(() => {
    const q = query.trim().toLowerCase();
    return characters
      .filter((c) => (filter === 'all' ? true : c.category === filter))
      .filter((c) =>
        q
          ? `${c.name} ${c.ability} ${c.category}`.toLowerCase().includes(q)
          : true
      )
      .map((character) => {
        const mission = missionForCharacter(character.id);
        let state: CardState = 'soon';
        let stars = 0;
        if (character.playable && mission) {
          if (isCompleted(mission.id)) {
            state = 'done';
            stars = starsFor(mission.id);
          } else {
            state = isUnlocked(mission) ? 'ready' : 'locked';
          }
        }
        return { character, state, stars };
      })
      .sort((a, b) => {
        const rank = (s: CardState) => (s === 'ready' ? 0 : s === 'done' ? 1 : s === 'locked' ? 2 : 3);
        return rank(a.state) - rank(b.state) || a.character.name.localeCompare(b.character.name);
      });
  }, [filter, query, isCompleted, starsFor, isUnlocked]);

  const readyCount = missionCharacters.length;

  function handleSelect(character: Character, state: CardState) {
    if (state === 'soon') {
      setPreview(character);
      return;
    }
    const mission = missionForCharacter(character.id);
    if (mission) navigate(`/adventure/${mission.id}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">Step 1 of 2 · Pick your hero</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Who is joining the adventure?</h1>
          <p className="mt-1 text-sm text-white/65 sm:text-base">
            {readyCount} adventures are open now. Everyone else is waiting for their story to be written.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs text-white/75">
          <Sparkles className="h-4 w-4 text-sun" />
          Tap a hero card to begin
        </div>
      </div>

      {/* Search */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search a character, like Pikachu or Elsa…"
            aria-label="Search characters"
            className="w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 pl-12 pr-10 font-body text-base text-white placeholder:text-white/45 shadow-card outline-none backdrop-blur-xl transition focus:border-sun/70 focus:bg-white/15"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white/15 hover:bg-white/25"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="scrollbar-slim -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label="All heroes" emoji="✨" />
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            active={filter === c.id}
            onClick={() => setFilter(c.id)}
            label={c.label}
            emoji={c.emoji}
            colors={c.colors}
          />
        ))}
      </div>

      <div className="mt-5">
        <CharacterGrid items={items} onSelect={handleSelect} />
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-[#150c33]/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${preview.name} adventure coming soon`}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="w-full max-w-sm rounded-3xl border border-white/20 bg-[#241756] p-6 text-center shadow-card"
            >
              <div className="mx-auto w-fit">
                <CharacterAvatar character={preview} size="xl" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold">{preview.name}</h3>
              <p className="text-sm text-white/65">{preview.ability}</p>
              <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm text-white/80">
                This adventure is still being written! ✍️<br />
                Eight heroes are ready to play right now.
              </div>
              <div className="mt-5 flex flex-col gap-2">
                <button className="btn-primary w-full" onClick={() => setPreview(null)}>
                  Meet another hero
                </button>
                <button className="btn-ghost w-full text-base" onClick={() => navigate('/world')}>
                  See the island map
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  emoji,
  colors,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  emoji: string;
  colors?: [string, string];
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
        active
          ? 'border-transparent text-[#241756] shadow-pop'
          : 'border-white/15 bg-white/10 text-white/80 hover:bg-white/20'
      }`}
      style={active ? { background: `linear-gradient(135deg, ${colors?.[0] ?? '#ffe08a'}, ${colors?.[1] ?? '#ff9a76'})` } : undefined}
    >
      <span aria-hidden="true">{emoji}</span>
      {label}
    </button>
  );
}
