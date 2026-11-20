import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { Character } from '../game/characters';
import { CharacterAvatar } from './CharacterAvatar';
import { StarRow } from './StarRow';

export interface RewardData {
  badgeName: string;
  badgeEmoji: string;
  stars: number;
  islandBadge?: boolean;
}

export function RewardPopup({
  open,
  onClose,
  character,
  reward,
  missionTitle,
}: {
  open: boolean;
  onClose: () => void;
  character: Character;
  reward: RewardData;
  missionTitle: string;
}) {
  const sparks = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    return { id: i, x: Math.cos(angle) * 110, y: Math.sin(angle) * 110, delay: i * 0.03, emoji: ['✨', '⭐', '💫', '🌟'][i % 4] };
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-[#140b30]/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Mission reward"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.82, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/25 bg-[#241756] p-6 text-center shadow-card"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,209,102,.35),transparent_60%)]" />

            {/* radial spark burst */}
            <div className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
              {sparks.map((s) => (
                <motion.span
                  key={s.id}
                  className="absolute text-lg"
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                  animate={{ x: s.x, y: s.y, opacity: [0, 1, 0], scale: 1 }}
                  transition={{ duration: 1.4, delay: 0.15 + s.delay, ease: 'easeOut' }}
                  aria-hidden="true"
                >
                  {s.emoji}
                </motion.span>
              ))}
            </div>

            <p className="relative text-xs font-bold uppercase tracking-[0.22em] text-sun">Mission complete</p>

            <div className="relative mx-auto mt-4 w-fit">
              <motion.div initial={{ scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 240 }}>
                <CharacterAvatar character={character} size="xl" ring={false} />
              </motion.div>
            </div>

            <h2 className="relative mt-3 font-display text-2xl font-bold">{missionTitle}</h2>

            <div className="relative mt-3 flex justify-center">
              <StarRow value={reward.stars} size={34} animate />
            </div>

            <div className="relative mt-5 rounded-2xl border border-sun/40 bg-sun/10 p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sun">New badge</p>
              <div className="mt-1 flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 8, -6, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2 }}
                  className="text-3xl"
                >
                  {reward.badgeEmoji}
                </motion.span>
                <span className="font-display text-lg font-semibold">{reward.badgeName}</span>
              </div>
              {reward.islandBadge && (
                <p className="mt-1 text-xs text-mint">Plus the island badge: 🌟 Island Guardian!</p>
              )}
            </div>

            <button onClick={onClose} className="btn-primary relative mt-5 w-full">
              <Sparkles className="h-5 w-5" /> See what changed
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
