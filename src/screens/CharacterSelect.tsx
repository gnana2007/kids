import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Lock, Search, Sparkles } from 'lucide-react';
import { ALL_CHARACTERS, PLAYABLE, categories, characterById, type Category } from '../game/characters';
import { MISSIONS } from '../game/missions';
import { ZONES } from '../game/world';
import type { SaveData } from '../game/save';
import { CharacterPortrait, StarChip, completedCount } from '../ui/bits';

interface Props {
  save: SaveData;
  selected: string;
  onSelect: (id: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export default function CharacterSelect({ save, selected, onSelect, onConfirm, onBack }: Props) {
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const hero = characterById(selected) ?? PLAYABLE[0];
  const mission = MISSIONS.find((m) => m.character === hero.id);

  const list = useMemo(() => {
    const source = showAll ? ALL_CHARACTERS : ALL_CHARACTERS.filter((c) => c.playable);
    return source.filter((c) => {
      const catOk = category === 'all' || c.category === category;
      const q = query.trim().toLowerCase();
      const qOk = !q || c.name.toLowerCase().includes(q) || c.ability.toLowerCase().includes(q) || c.category.includes(q);
      return catOk && qOk;
    });
  }, [category, query, showAll]);

  return (
    <div className="sky-bg relative flex h-full w-full flex-col overflow-y-auto lg:overflow-hidden">
      <div className="relative z-10 flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button className="btn btn-ghost py-2 text-sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-slate-800 sm:text-3xl">Choose your hero</h1>
          <p className="text-xs font-semibold text-slate-500">Each hero changes the island in a different way</p>
        </div>
        <div className="hidden sm:block">
          <StarChip done={completedCount(save.missions)} />
        </div>
      </div>

      {/* sticky action for phones */}
      <div className="sticky bottom-0 z-30 mx-4 mb-1 flex items-center gap-2 rounded-2xl border-2 border-white bg-white/90 p-2 shadow-lg backdrop-blur lg:hidden">
        <CharacterPortrait id={hero.id} size={40} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold leading-tight text-slate-800">{hero.name}</p>
          <p className="truncate text-[10px] font-semibold text-slate-500">{hero.playable ? hero.ability : 'Coming soon'}</p>
        </div>
        <button className="btn btn-primary px-4 py-2.5 text-sm" onClick={onConfirm} disabled={!hero.playable}>
          Let's go
        </button>
      </div>

      <div className="relative z-10 flex flex-1 flex-col gap-4 px-4 pb-4 lg:min-h-0 lg:flex-row lg:px-6">
        {/* catalogue */}
        <div className="flex flex-col lg:min-h-0 lg:flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search heroes"
                className="w-44 rounded-xl border-2 border-white bg-white/85 py-2 pl-9 pr-3 text-sm font-semibold text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-violet-300"
              />
            </div>
            <button
              className={`pill cursor-pointer transition ${!showAll ? '!border-violet-300 !bg-violet-100 !text-violet-700' : ''}`}
              onClick={() => setShowAll(false)}
            >
              Playable {PLAYABLE.length}
            </button>
            <button
              className={`pill cursor-pointer transition ${showAll ? '!border-violet-300 !bg-violet-100 !text-violet-700' : ''}`}
              onClick={() => setShowAll(true)}
            >
              All friends {ALL_CHARACTERS.length}
            </button>
          </div>

          <div className="hide-scrollbar mt-2 flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setCategory('all')}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
                category === 'all' ? 'bg-slate-800 text-white shadow' : 'bg-white/70 text-slate-500 hover:bg-white'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
                  category === c.id ? 'bg-slate-800 text-white shadow' : 'bg-white/70 text-slate-500 hover:bg-white'
                }`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          <div className="hide-scrollbar mt-3 grid auto-rows-min grid-cols-2 gap-2.5 pb-2 sm:grid-cols-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto xl:grid-cols-4">
            {list.map((c) => {
              const active = c.id === selected;
              const missionDone = c.playable && save.missions[MISSIONS.find((m) => m.character === c.id)?.id ?? '']?.done;
              return (
                <motion.button
                  layout
                  key={c.id}
                  onClick={() => {
                    if (c.playable) onSelect(c.id);
                  }}
                  whileHover={c.playable ? { y: -3 } : undefined}
                  className={`relative flex items-center gap-2.5 rounded-2xl border-2 p-2.5 text-left transition ${
                    active
                      ? 'border-violet-400 bg-white shadow-[0_0_0_4px_rgba(167,139,250,.3)]'
                      : c.playable
                        ? 'border-white bg-white/80 shadow-[0_4px_0_rgba(140,160,210,.2)] hover:bg-white'
                        : 'cursor-default border-white/60 bg-white/45 opacity-80'
                  }`}
                >
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-sky-100 to-violet-100">
                    {c.playable ? (
                      <CharacterPortrait id={c.id} size={62} />
                    ) : (
                      <span className="font-display text-xl font-bold text-slate-400">{c.name.slice(0, 1)}</span>
                    )}
                    {!c.playable && (
                      <span className="absolute inset-0 flex items-center justify-center bg-white/55">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-bold leading-tight text-slate-800">{c.name}</p>
                    <p className="truncate text-[11px] font-semibold text-slate-500">{c.playable ? c.ability : 'Story coming soon'}</p>
                  </div>
                  {active && <Check className="h-5 w-5 shrink-0 text-violet-600" />}
                  {missionDone && !active && (
                    <span className="absolute right-1.5 top-1.5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-black text-white">
                      DONE
                    </span>
                  )}
                </motion.button>
              );
            })}
            {!list.length && (
              <div className="col-span-full rounded-2xl bg-white/70 p-6 text-center text-sm font-semibold text-slate-500">
                No hero found. Try another name or category.
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 rounded-2xl bg-white/60 p-2.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your shared world</span>
            {['Cartoon Village', 'Magical Forest', 'Frozen Kingdom'].map((z, i) => (
              <span key={z} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-slate-600 shadow-sm">
                {['🏘️', '🍄', '❄️'][i]} {z}
              </span>
            ))}
            <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-600">
              {save.flags.length} world changes saved
            </span>
          </div>
        </div>

        {/* detail */}
        <div className="w-full shrink-0 pb-2 lg:w-[340px]">
          <div className="card-kid relative overflow-hidden p-4 sm:p-5">
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-amber-200/70 to-rose-200/40 blur-xl" />
            <div className="relative flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-sky-100 via-white to-amber-100 p-1 shadow-inner">
                <CharacterPortrait id={hero.id} size={92} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-violet-500">
                  {categories.find((c) => c.id === hero.category)?.label}
                </p>
                <h2 className="font-display text-2xl font-bold leading-tight text-slate-800">{hero.name}</h2>
                <p className="text-xs font-semibold text-slate-500">{hero.playable ? hero.ability : 'Story in the making'}</p>
              </div>
            </div>

            {hero.playable ? (
              <>
                <p className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs font-semibold leading-snug text-slate-600">{hero.hint}</p>
                {mission && (
                  <div className="mt-2.5 rounded-xl bg-amber-50 p-2.5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-amber-600">Story mission · {zoneName(hero.home)}</p>
                    <p className="font-display text-sm font-bold text-amber-900">{mission.title}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-amber-800/80">{mission.goal}</p>
                    {save.missions[mission.id]?.done && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-black text-emerald-600">
                        <Sparkles className="h-3 w-3" /> Already complete — replay for fun
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="mt-3 rounded-xl bg-slate-100 p-3 text-xs font-semibold text-slate-500">
                {hero.name} will join the island in a future update. The eight playable heroes already have full adventures.
              </div>
            )}

            <button className="btn btn-primary mt-4 w-full" onClick={onConfirm} disabled={!hero.playable}>
              {hero.playable ? 'Take me to the island' : 'Not playable yet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function zoneName(id: string) {
  return ZONES.find((z) => z.id === id)?.name ?? 'the island';
}
