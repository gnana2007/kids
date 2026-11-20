import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, Map, RotateCcw, Sparkles, Star, Trophy, Users } from 'lucide-react';
import { missionById, storyMissions } from '../game/missions';
import { characterById } from '../game/characters';
import { useProgress } from '../game/progress';
import { changeByFlag } from '../game/worldChanges';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { StarRow } from '../components/StarRow';
import { RewardPopup } from '../components/RewardPopup';
import { Sparkles as Motes, StarField } from '../components/Sparkles';

interface ResultState {
  stars?: number;
  mistakes?: number;
  earnedBadge?: boolean;
  earnedIsland?: boolean;
}

export function Results() {
  const { missionId } = useParams();
  const routerState = (useLocation().state ?? null) as ResultState | null;
  const mission = missionId ? missionById(missionId) : undefined;
  const character = mission ? characterById(mission.characterId) : undefined;
  const { starsFor, totalStars, badges, isCompleted } = useProgress();

  const stars = routerState?.stars ?? (mission ? starsFor(mission.id) : 0);
  const [popup, setPopup] = useState<boolean>(Boolean(routerState?.earnedBadge));

  useEffect(() => {
    if (mission) document.title = `Mission complete: ${mission.title} · CharacterVerse`;
  }, [mission]);

  if (!mission || !character) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
        <span className="text-5xl">🎈</span>
        <h1 className="font-display text-2xl font-semibold">No mission to show yet</h1>
        <Link to="/world" className="btn-primary">
          <Map className="h-5 w-5" /> To the island
        </Link>
      </div>
    );
  }

  const next = mission.next ? missionById(mission.next) : undefined;
  const nextCharacter = next ? characterById(next.characterId) : undefined;
  const change = changeByFlag(mission.worldFlag);
  const isFinalChapter = Boolean(mission.chapter) && mission.id === storyMissions[storyMissions.length - 1].id;
  const storyCompleted = storyMissions.every((m) => isCompleted(m.id));

  return (
    <div className="relative mx-auto max-w-3xl px-3 pb-16 pt-4 sm:px-6">
      <StarField count={26} />
      <Motes count={12} />

      <RewardPopup
        open={popup}
        onClose={() => setPopup(false)}
        character={character}
        missionTitle={mission.title}
        reward={{
          badgeName: mission.badge.name,
          badgeEmoji: mission.badge.emoji,
          stars,
          islandBadge: Boolean(routerState?.earnedIsland),
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className="card overflow-hidden"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-white/15 to-transparent px-5 pb-6 pt-7 text-center sm:px-8">
          <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-sun/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 top-10 h-52 w-52 rounded-full bg-blush/20 blur-3xl" />

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-sun">Mission complete</p>

          <div className="mx-auto mt-4 w-fit">
            <motion.div
              initial={{ scale: 0.7, rotate: -6 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 14 }}
            >
              <CharacterAvatar character={character} size="xl" />
            </motion.div>
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{mission.title}</h1>
          <p className="text-sm text-white/60">
            {character.name} · {mission.tagline}
          </p>

          <div className="mt-4 flex justify-center">
            <StarRow value={stars} size={40} animate />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-bold">
              <Star className="h-3.5 w-3.5 fill-sun text-sun" /> {totalStars} stars in total
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-bold">
              <Trophy className="h-3.5 w-3.5 text-blush" /> {badges.length} badges
            </span>
            {routerState?.mistakes === 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/20 px-3 py-1 font-bold text-mint">
                Perfect run!
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
          <div className="rounded-2xl border border-sun/30 bg-sun/10 p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-sun">
              <Lightbulb className="h-3.5 w-3.5" /> What you learned
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/90">{mission.learn}</p>
          </div>

          <div className="rounded-2xl border border-mint/30 bg-mint/10 p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-mint">
              <Map className="h-3.5 w-3.5" /> Your island changed
            </p>
            <div className="mt-2 flex items-center gap-2">
              <motion.span
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 260 }}
                className="text-3xl"
              >
                {change?.emoji ?? '✨'}
              </motion.span>
              <p className="text-sm font-semibold text-white/90">{change?.label ?? 'A new corner of the island woke up'}</p>
            </div>
            <Link to="/world" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-mint hover:underline">
              See it on the map <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 sm:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 8, -6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.4 }}
                  className="text-3xl"
                >
                  {mission.badge.emoji}
                </motion.span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                    {routerState && routerState.earnedBadge === false ? 'Badge already collected' : 'Badge earned'}
                  </p>
                  <p className="font-display text-base font-semibold">{mission.badge.name}</p>
                </div>
              </div>

              {mission.chapter && (
                <div className="ml-auto flex items-center gap-1.5">
                  {storyMissions.map((m) => (
                    <span
                      key={m.id}
                      title={m.title}
                      className={`h-2.5 w-2.5 rounded-full ${isCompleted(m.id) ? 'bg-mint' : 'bg-white/20'}`}
                    />
                  ))}
                  <span className="ml-1 text-[10px] font-bold uppercase tracking-wider text-white/45">story</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 p-4 sm:flex-row sm:items-center sm:px-6">
          {next && nextCharacter ? (
            <div className="flex flex-1 items-center gap-3">
              <CharacterAvatar character={nextCharacter} size="sm" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                  Next · Chapter {next.chapter}
                </p>
                <p className="truncate font-display text-sm font-semibold">{next.title}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                {isFinalChapter || storyCompleted ? 'The village is safe' : 'Adventure saved'}
              </p>
              <p className="font-display text-sm font-semibold">
                {isFinalChapter || storyCompleted
                  ? 'The shared story is complete — try the side adventures!'
                  : 'Explore the island for more stories.'}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Link to={`/adventure/${mission.id}`} className="btn-ghost px-3 py-2 text-xs">
              <RotateCcw className="h-3.5 w-3.5" /> Replay
            </Link>
            <Link to="/characters" className="btn-ghost px-3 py-2 text-xs">
              <Users className="h-3.5 w-3.5" /> Heroes
            </Link>
            {next ? (
              <Link to={`/adventure/${next.id}`} className="btn-primary px-5 py-2.5 text-base">
                Continue adventure
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link to="/world" className="btn-primary px-5 py-2.5 text-base">
                <Map className="h-4 w-4" /> Back to the island
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      <p className="mt-6 text-center text-xs text-white/45">
        <Sparkles className="mr-1 inline h-3.5 w-3.5 text-sun" />
        Keep going — every adventure changes CharacterVerse a little more.
      </p>
    </div>
  );
}
