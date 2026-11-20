import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Compass, Lock, Play, Sparkles } from 'lucide-react';
import { missionById, missionById as byId, locationById } from '../game/missions';
import { characterById } from '../game/characters';
import { useProgress } from '../game/progress';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { GameInteraction, gameKindLabel } from '../components/GameInteraction';
import type { GameResult } from '../components/games/shared';
import { useSfx } from '../game/useSfx';

type Phase = 'brief' | 'play';

export function Adventure() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const play = useSfx();
  const mission = missionId ? missionById(missionId) : undefined;
  const character = mission ? characterById(mission.characterId) : undefined;
  const { isUnlocked, isCompleted, starsFor, completeMission } = useProgress();
  const [phase, setPhase] = useState<Phase>('brief');
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    setPhase('brief');
    setMistakes(0);
  }, [missionId]);

  useEffect(() => {
    if (mission) document.title = `${mission.title} · CharacterVerse`;
  }, [mission]);

  if (!mission || !character) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
        <span className="text-5xl">🧭</span>
        <h1 className="font-display text-2xl font-semibold">This adventure is lost in the magical fog</h1>
        <Link to="/world" className="btn-primary">
          <Compass className="h-5 w-5" /> Back to the island
        </Link>
      </div>
    );
  }

  const locked = !isUnlocked(mission);
  const done = isCompleted(mission.id);
  const prereq = mission.prereq ? byId(mission.prereq) : undefined;
  const locationName = locationById(mission.location)?.name ?? mission.location;

  function handleComplete(result: GameResult) {
    const { newBadges } = completeMission(mission!, result.stars);
    play('win');
    navigate(`/results/${mission!.id}`, {
      state: { stars: result.stars, mistakes: result.mistakes, earnedBadge: newBadges.includes(mission!.badge.id), earnedIsland: newBadges.includes('b-island') },
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-3 pb-16 pt-5 sm:px-6">
      <AnimatePresence mode="wait">
        {locked ? (
          <motion.div key="lock" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="card mx-auto mt-8 max-w-xl p-6 text-center">
            <div className="mx-auto w-fit">
              <CharacterAvatar character={character} size="xl" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-semibold">{mission.title}</h1>
            <p className="mt-1 text-sm text-white/65">with {character.name}</p>
            <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-white/80">
              <span className="mb-1 inline-flex items-center gap-1.5 font-bold text-sun">
                <Lock className="h-4 w-4" /> Story locked
              </span>
              <p className="mt-1">
                This is Chapter {mission.chapter} of the shared island story. It opens after you finish{' '}
                <span className="font-bold">{prereq ? `“${prereq.title}”` : 'the earlier chapters'}</span>.
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
              {prereq && (
                <button onClick={() => navigate(`/adventure/${prereq.id}`)} className="btn-primary">
                  <Play className="h-5 w-5" /> Go to “{prereq.title}”
                </button>
              )}
              <Link to="/world" className="btn-ghost">
                <Compass className="h-5 w-5 text-mint" /> Island map
              </Link>
            </div>
          </motion.div>
        ) : phase === 'brief' ? (
          <motion.div key="brief" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/55 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="card overflow-hidden">
              <div className="relative bg-gradient-to-br from-white/12 to-transparent px-5 pb-5 pt-6 sm:px-7">
                <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full opacity-30 blur-3xl" style={{ background: character.colors[0] }} />
                <div className="flex flex-wrap items-center gap-2">
                  {mission.chapter ? (
                    <span className="pill bg-grape/50 text-white/90">Story chapter {mission.chapter} of 5</span>
                  ) : (
                    <span className="pill bg-sky/30 text-sky">Independent adventure</span>
                  )}
                  <span className="pill bg-white/10 text-white/65">{gameKindLabel[mission.game.kind]}</span>
                </div>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <CharacterAvatar character={character} size="xl" />
                  <div>
                    <h1 className="font-display text-3xl font-bold sm:text-4xl">{mission.title}</h1>
                    <p className="mt-1 font-display text-lg text-white/70">{mission.tagline}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {mission.story.map((line, i) => (
                    <p key={i} className="flex gap-2.5 rounded-xl bg-white/[0.06] px-3.5 py-2.5 text-sm leading-relaxed text-white/85">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sun/90 text-xs font-bold text-[#2b2140]">
                        {i + 1}
                      </span>
                      {line}
                    </p>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-mint/30 bg-mint/10 px-4 py-3">
                  <p className="flex-1 text-sm text-white/90">
                    <span className="mr-1.5">🎯</span>
                    {mission.goal}
                  </p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
                    Location: {locationName}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                {done && (
                  <p className="text-sm text-mint">
                    You completed this before with {starsFor(mission.id)} stars — can you do even better?
                  </p>
                )}
                <div className="flex flex-wrap gap-2 sm:ml-auto">
                  {done && (
                    <Link to="/world" className="btn-ghost px-4 py-2 text-sm">
                      Back to map
                    </Link>
                  )}
                  <button data-testid="start-mission" onClick={() => { play('tap'); setPhase('play'); }} className="btn-primary px-7 py-3.5 text-lg">
                    {done ? 'Play again' : 'Start mission'}
                    <Play className="h-5 w-5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="play" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <CharacterAvatar character={character} size="sm" />
                <div className="min-w-0">
                  <h1 className="truncate font-display text-lg font-semibold sm:text-xl">{mission.title}</h1>
                  <p className="truncate text-xs text-white/55">{mission.goal}</p>
                </div>
              </div>
              <button
                onClick={() => setPhase('brief')}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:bg-white/20"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Mission briefing
              </button>
            </div>

            <div className="card p-3.5 sm:p-5">
              <GameInteraction mission={mission} onComplete={handleComplete} onMistake={() => setMistakes((m) => m + 1)} />
            </div>

            {mistakes > 0 && (
              <p className="mt-3 text-center text-xs text-white/40">
                Little fumbles: {mistakes}. No big deal — the island just wants a hero who keeps trying.
              </p>
            )}

            <div className="mt-4 flex items-center justify-center gap-3 text-xs">
              <Link to="/world" className="inline-flex items-center gap-1.5 text-white/50 transition hover:text-white">
                <BookOpen className="h-3.5 w-3.5" /> Save & leave
              </Link>
              <span className="h-1 w-1 rounded-full bg-white/25" />
              <span className="inline-flex items-center gap-1.5 text-white/50">
                <Sparkles className="h-3.5 w-3.5 text-sun" /> earn stars & a badge
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Small helper so location labels read nicely on the briefing */
declare module '../game/types' {
  interface Mission {
    locationLabel?: string;
  }
}