import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Star, Trophy, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProgress } from '../game/progress';

export function Navbar() {
  const { totalStars, badges, completedCount } = useProgress();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex max-w-6xl items-center gap-2 rounded-3xl border border-white/15 bg-[#1d1345]/70 px-3 py-2 shadow-card backdrop-blur-xl sm:gap-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          {!isHome && (
            <button
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white/90 transition hover:bg-white/20"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="CharacterVerse home">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sun to-coral text-[#2b2140] shadow-pop">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="truncate font-display text-lg font-semibold tracking-tight sm:text-xl">
              Character<span className="text-sun">Verse</span>
            </span>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <motion.div
            key={totalStars}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 text-sm font-bold"
            title="Stars collected"
          >
            <Star className="h-4 w-4 fill-sun text-sun" />
            <span>{totalStars}</span>
          </motion.div>

          <Link
            to="/world"
            className="hidden items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 text-sm font-bold transition hover:bg-white/20 sm:flex"
            title="World map"
          >
            <Map className="h-4 w-4 text-mint" />
            <span>{completedCount}/8</span>
          </Link>

          <Link
            to="/world"
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 text-sm font-bold transition hover:bg-white/20"
            title="Badges collected — see them on the island"
          >
            <Trophy className="h-4 w-4 text-blush" />
            <span>{badges.length}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
