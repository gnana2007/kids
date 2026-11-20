import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, RotateCcw, Sparkles } from 'lucide-react';
import { WorldMap } from '../components/WorldMap';
import { MissionCard } from '../components/MissionCard';
import { ISLAND_BADGE, locationById, missions, storyMissions } from '../game/missions';
import { characters } from '../game/characters';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { worldChanges } from '../game/worldChanges';
import { useProgress } from '../game/progress';
import type { LocationId } from '../game/types';

const firstOpen = (isUnlocked: (m: (typeof missions)[number]) => boolean, isCompleted: (id: string) => boolean) =>
  missions.find((m) => isUnlocked(m) && !isCompleted(m.id))?.location ??
  missions.find((m) => !isCompleted(m.id))?.location ??
  'village';

export function WorldMapPage() {
  const { isUnlocked, isCompleted, storyDone, totalStars, badges, hasFlag, resetProgress, lastMission } = useProgress();
  const [selected, setSelected] = useState<LocationId | null>(() => null);
  const [confirmReset, setConfirmReset] = useState(false);

  const defaultLocation = useMemo(() => firstOpen(isUnlocked, isCompleted), [isUnlocked, isCompleted]);
  const activeId = selected ?? defaultLocation;
  const location = locationById(activeId)!;
  const here = missions.filter((m) => m.location === activeId);

  return (
    <div className="mx-auto max-w-6xl px-3 pb-16 pt-5 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 px-1">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">Step 2 of 2 · Explore the island</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">The island you are rebuilding</h1>
          <p className="mt-1 max-w-2xl text-sm text-white/65 sm:text-base">
            Every adventure changes CharacterVerse for good. Finish one chapter and the whole island remembers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/55">Story</div>
            <div className="font-display text-lg font-semibold">{storyDone}/5</div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/55">Stars</div>
            <div className="flex items-center gap-1 font-display text-lg font-semibold">
              {totalStars}
              <Sparkles className="h-3.5 w-3.5 text-sun" />
            </div>
          </div>
          <div className="hidden rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-center sm:block">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/55">Badges</div>
            <div className="font-display text-lg font-semibold">{badges.length}</div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <WorldMap selected={activeId} onSelect={(id) => setSelected(id)} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <motion.section
          key={activeId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold">
                <span className="mr-2">{location.emoji}</span>
                {location.name}
              </h2>
              <p className="mt-0.5 text-sm text-white/65">{location.blurb}</p>
            </div>
            <span className="pill shrink-0 bg-white/10 text-[10px] text-white/60">
              {here.length} {here.length === 1 ? 'adventure' : 'adventures'}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {here.map((m) => (
              <MissionCard key={m.id} mission={m} />
            ))}
            {here.length === 0 && (
              <div className="sm:col-span-2">
                <p className="text-sm text-white/70">
                  Quiet for now — this corner of the island is waiting for its own adventure.
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-white/40">adventures coming soon</p>
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-white/10 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Friends in {location.name}</p>
            <div className="scrollbar-slim mt-2 flex gap-3 overflow-x-auto pb-1">
              {characters
                .filter((c) => c.home === activeId)
                .slice(0, 9)
                .map((c) => (
                  <div key={c.id} className="flex w-12 shrink-0 flex-col items-center gap-1">
                    <CharacterAvatar character={c} size="sm" />
                    <span className="w-full truncate text-center text-[9px] font-bold text-white/60">
                      {c.name.split(' ')[0]}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </motion.section>

        <div className="flex flex-col gap-4">
          <section className="card p-4 sm:p-5">
            <h2 className="font-display text-lg font-semibold">Your island so far</h2>
            <ul className="mt-3 grid gap-1.5">
              {worldChanges.map((change) => {
                const done = hasFlag(change.flag);
                return (
                  <li
                    key={change.flag}
                    className={`flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm transition ${
                      done ? 'bg-mint/15 text-white' : 'text-white/35'
                    }`}
                  >
                    <span className={done ? '' : 'grayscale opacity-60'}>{change.emoji}</span>
                    <span className={done ? '' : 'line-through decoration-white/20'}>{change.label}</span>
                    {done && <span className="ml-auto text-xs font-bold text-mint">done</span>}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="card p-4 sm:p-5">
            <h2 className="font-display text-lg font-semibold">Badge album</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[...missions.map((m) => m.badge), ISLAND_BADGE].map((badge) => {
                const earned = badges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition ${
                      earned ? 'border-sun/40 bg-sun/10' : 'border-white/10 bg-white/[0.04] opacity-45'
                    }`}
                    title={badge.name}
                  >
                    <span className="text-xl">{badge.emoji}</span>
                    <span className="text-[9px] font-bold leading-tight text-white/75">{badge.name}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="card p-4 sm:p-5">
            <h2 className="font-display text-lg font-semibold">Story road</h2>
            <ol className="mt-3 space-y-2">
              {storyMissions.map((m) => {
                const done = isCompleted(m.id);
                const open = isUnlocked(m);
                return (
                  <li key={m.id} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                        done ? 'bg-mint text-[#0d2b21]' : open ? 'bg-sun/80 text-[#2b2140]' : 'bg-white/10 text-white/45'
                      }`}
                    >
                      {done ? '✓' : m.chapter}
                    </span>
                    {open ? (
                      <Link to={`/adventure/${m.id}`} className="truncate hover:underline">
                        {m.title}
                      </Link>
                    ) : (
                      <span className="truncate text-white/40">{m.title}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/characters" className="btn-ghost flex-1 text-sm">
              <Compass className="h-4 w-4 text-mint" />
              All characters
            </Link>
            {lastMission && (
              <Link to={`/adventure/${lastMission}`} className="text-[10px] font-bold uppercase tracking-wider text-white/35 hover:text-white/70">
                last played
              </Link>
            )}
            <button
              onClick={() => (confirmReset ? (resetProgress(), setConfirmReset(false)) : setConfirmReset(true))}
              className={`inline-flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-bold transition ${
                confirmReset
                  ? 'border-coral bg-coral/20 text-coral'
                  : 'border-white/15 bg-white/5 text-white/55 hover:text-white/80'
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {confirmReset ? 'Tap again to erase' : 'New game'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
