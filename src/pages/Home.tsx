import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Sparkles, Star } from 'lucide-react';
import { Sparkles as Motes, StarField } from '../components/Sparkles';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { missionCharacters } from '../game/characters';
import { missionById, missionForCharacter, storyMissions } from '../game/missions';
import { useProgress } from '../game/progress';

export function Home() {
  const navigate = useNavigate();
  const { totalStars, completedCount, storyDone, isCompleted } = useProgress();

  const doneChapters = storyMissions.filter((m) => isCompleted(m.id));
  const lastMission = doneChapters[doneChapters.length - 1];
  const nextChapter = storyMissions.find((m) => !isCompleted(m.id));

  return (
    <div className="relative min-h-[calc(100vh-88px)] overflow-hidden px-4 pb-16 pt-6 sm:px-6">
      <StarField count={46} />
      <Motes count={18} />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-grape/40 blur-3xl" />
        <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-sky/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blush/20 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
            <Sparkles className="h-4 w-4 text-sun" />
            A magical island adventure
          </div>

          <h1 className="font-display text-[clamp(2.9rem,9vw,5.4rem)] font-bold leading-[0.95] text-shadow-soft">
            Character
            <span className="bg-gradient-to-r from-sun via-coral to-blush bg-clip-text text-transparent">Verse</span>
          </h1>

          <p className="mt-3 max-w-xl font-display text-xl text-white/85 sm:text-2xl">One World. Many Adventures.</p>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            Meet your favourite characters, solve playful challenges, and watch the whole island change because of what
            you do.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <button onClick={() => navigate('/characters')} className="btn-primary px-7 py-4 text-xl">
                Start Adventure
                <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>
            <Link to="/world" className="btn-ghost">
              <Compass className="h-5 w-5 text-mint" />
              Explore the Island
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-sun text-sun" />
              {totalStars} stars collected
            </span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>{completedCount} of 8 adventures played</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>{storyDone}/5 shared story chapters</span>
          </div>

          {lastMission && (
            <Link
              to={`/adventure/${lastMission.id}`}
              className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 transition hover:bg-white/15"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-mint to-sky text-[#12312a]">
                <Compass className="h-5 w-5" />
              </span>
              <span className="text-left">
                <span className="block text-xs font-bold uppercase tracking-wider text-white/60">
                  Play again · Chapter {lastMission.chapter}
                </span>
                <span className="font-display text-base font-semibold">{lastMission.title}</span>
              </span>
              <ArrowRight className="ml-1 h-4 w-4 text-white/60" />
            </Link>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mx-auto aspect-square w-full max-w-[460px]"
        >
          <div className="absolute inset-6 rounded-full border border-white/15" />
          <div className="absolute inset-14 rounded-full border border-white/10" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl" />

          <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-sun via-coral to-blush text-[#2b2140] shadow-pop">
            <Sparkles className="h-11 w-11" />
          </div>

          {missionCharacters.map((character, i) => {
            const angle = (i / missionCharacters.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 40;
            const left = 50 + Math.cos(angle) * radius;
            const top = 50 + Math.sin(angle) * radius;
            const mission = missionForCharacter(character.id);
            return (
              <motion.button
                key={character.id}
                onClick={() => mission && navigate(`/adventure/${mission.id}`)}
                whileHover={{ scale: 1.12, zIndex: 10 }}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${left}%`, top: `${top}%` }}
                aria-label={`Play ${character.name}'s adventure`}
                title={`${character.name} · ${character.ability}`}
              >
                <CharacterAvatar character={character} size="md" className="animate-floaty" />
                <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1d1345]/90 px-2 py-0.5 text-[10px] font-bold opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  {character.name}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <p className="mx-auto mt-12 max-w-2xl text-center font-display text-base text-white/55 sm:text-lg">
        “Your Favourite Characters. Your Biggest Adventures. One World You Create.”
      </p>

      {nextChapter && storyDone > 0 && (
        <div className="mx-auto mt-6 flex max-w-md justify-center">
          <Link to={`/adventure/${nextChapter.id}`} className="btn-ghost text-sm">
            Next chapter: {missionById(nextChapter.id)?.title}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
