import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Compass, Map as MapIcon, RotateCcw, Sparkles } from 'lucide-react';
import { PLAYABLE, characterById } from '../game/characters';
import { MISSIONS } from '../game/missions';
import { PREVIEW_ZONES, ZONES } from '../game/world';
import type { SaveData } from '../game/save';
import { CharacterPortrait, StarChip, completedCount } from '../ui/bits';

interface Props {
  save: SaveData;
  hero: string;
  onEnter: (zone: string) => void;
  onBack: () => void;
  onReset: () => void;
  onHowTo: () => void;
}

const ZONE_STYLE: Record<string, { sky: string; hill: string; emoji: string; icon: string }> = {
  village: { sky: 'from-[#bfeaff] to-[#ffe9c9]', hill: '#7bd07a', emoji: '🏘️', icon: 'Windmill, cottages & hearth' },
  forest: { sky: 'from-[#b6ffe8] to-[#d9fff0]', hill: '#3fae74', emoji: '🍄', icon: 'Glowing woods & garden' },
  frozen: { sky: 'from-[#a8c8ef] to-[#eaf6ff]', hill: '#cfe6ff', emoji: '❄️', icon: 'Ice river & castle' },
};

const EXPLORE: Record<string, string> = {
  village: 'Free explore: Chutki, Raju and Nobita wander the square — talk to them with E.',
  forest: 'Free explore: catch fireflies, bounce on mushrooms and meet Jaggu the monkey.',
  frozen: 'Free explore: Anna and Olaf wait by the castle — the snow falls all day.',
};

const FLAG_LABELS: Record<string, string> = {
  windmill: 'Windmill spinning',
  lamps: 'Village lamps lit',
  toys: 'Toys back home',
  firewood: 'Hearth fire burning',
  garden: 'Whisper Garden blooming',
  icebridge: 'Ice bridge across the river',
  rescued: 'Snowbound friends rescued',
  generator: 'Castle generator humming',
};

export default function WorldSelect({ save, hero, onEnter, onBack, onReset, onHowTo }: Props) {
  const current = characterById(hero) ?? PLAYABLE[0];
  const done = completedCount(save.missions);
  const flags = save.flags.filter((f) => FLAG_LABELS[f]);

  return (
    <div className="sky-bg relative flex h-full w-full flex-col overflow-hidden">
      <div className="relative z-10 flex items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <button className="btn btn-ghost py-2 text-sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Heroes
        </button>
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-slate-800 sm:text-3xl">The Island of Everlight</h1>
          <p className="text-xs font-semibold text-slate-500">One shared world · your changes stay for every hero</p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <StarChip done={done} />
        </div>
      </div>

      <div className="hide-scrollbar relative z-10 flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          {/* hero strip */}
          <div className="card-kid flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-amber-100 p-1">
                <CharacterPortrait id={current.id} size={64} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-violet-500">Exploring as</p>
                <p className="font-display text-xl font-bold leading-tight text-slate-800">{current.name}</p>
                <p className="text-xs font-semibold text-slate-500">{current.ability}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-ghost py-2 text-xs" onClick={onHowTo}>
                Controls
              </button>
              <button className="btn btn-ghost py-2 text-xs" onClick={onReset}>
                <RotateCcw className="h-3.5 w-3.5" /> Reset world
              </button>
            </div>
          </div>

          {/* lands */}
          <div className="grid gap-3 lg:grid-cols-3">
            {ZONES.map((zone, i) => {
              const style = ZONE_STYLE[zone.id];
              const missions = MISSIONS.filter((m) => m.zone === zone.id);
              const zoneDone = missions.filter((m) => save.missions[m.id]?.done).length;
              return (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex flex-col overflow-hidden rounded-[1.7rem] border-[3px] border-white bg-white shadow-[0_10px_0_rgba(140,160,210,.25)]"
                >
                  <div className={`relative h-28 bg-gradient-to-b ${style.sky} px-4 pt-3`}>
                    <div
                      className="absolute inset-x-0 bottom-0 h-16"
                      style={{
                        background: style.hill,
                        borderTopLeftRadius: '60% 100%',
                        borderTopRightRadius: '40% 100%',
                        opacity: 0.85,
                      }}
                    />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600/70">Land {i + 1}</p>
                        <h2 className="font-display text-2xl font-bold leading-tight text-slate-800">{zone.name}</h2>
                        <p className="mt-0.5 max-w-[190px] text-[11px] font-semibold leading-snug text-slate-600">{style.icon}</p>
                      </div>
                      <span className="text-4xl drop-shadow-md">{style.emoji}</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col space-y-1.5 p-3">
                    {missions.map((m) => {
                      const finished = Boolean(save.missions[m.id]?.done);
                      const heroOfMission = characterById(m.character);
                      return (
                        <div key={m.id} className="flex items-center gap-2 rounded-xl bg-slate-50 px-2 py-1.5">
                          {heroOfMission && <CharacterPortrait id={heroOfMission.id} size={30} />}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-extrabold leading-tight text-slate-700">{m.title}</p>
                            <p className="text-[10px] font-semibold text-slate-400">{heroOfMission?.name}</p>
                          </div>
                          {finished ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          ) : (
                            <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-black text-amber-600">
                              OPEN
                            </span>
                          )}
                        </div>
                      );
                    })}
                    <p className="mt-auto rounded-xl bg-white/60 px-2 py-1 text-[10px] font-semibold leading-snug text-slate-500">{EXPLORE[zone.id]}</p>
                    <button className="btn btn-primary mt-1 w-full py-2.5 text-sm" onClick={() => onEnter(zone.id)}>
                      <Compass className="h-4 w-4" /> Walk into {zone.name.split(' ')[0]}
                      <span className="ml-auto rounded-full bg-white/25 px-1.5 text-[10px] font-black">
                        {zoneDone}/{missions.length}
                      </span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* world state */}
          <div className="card-kid p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="font-display text-lg font-bold text-slate-800">Your world right now</h3>
              <span className="pill ml-auto">{flags.length} changes</span>
            </div>
            {flags.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {flags.map((f) => (
                  <span key={f} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">
                    ✓ {FLAG_LABELS[f]}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-xs font-semibold text-slate-500">
                The island is waiting. Finish a mission and its change stays here — visible to every other hero.
              </p>
            )}
          </div>

          {/* coming soon */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-slate-700">
              <MapIcon className="h-4 w-4" /> Lands on the horizon
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {PREVIEW_ZONES.map((z) => (
                <div key={z.id} className="rounded-2xl border-2 border-white/70 bg-white/55 p-2.5 text-center">
                  <div className="text-2xl">{z.emoji}</div>
                  <p className="mt-0.5 text-[11px] font-extrabold leading-tight text-slate-600">{z.name}</p>
                  <p className="mt-0.5 text-[9px] font-semibold leading-tight text-slate-400">{z.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="relative z-10 pb-2 text-center text-[10px] font-semibold text-slate-500/80">
        Progress saves in this browser · {done}/{MISSIONS.length} missions complete
      </p>
    </div>
  );
}
