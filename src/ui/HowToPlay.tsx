import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { PLAYABLE } from '../game/characters';

export default function HowToPlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b2a52]/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="card-kid relative max-h-[88vh] w-full max-w-2xl overflow-y-auto p-6 sm:p-8"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="font-display text-3xl font-bold text-slate-800">How to play</h2>
            <p className="mt-1 text-slate-500">Walk the island, use each hero’s real power, and change the world for everyone.</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-sky-50 p-4">
                <h3 className="font-display text-lg font-bold text-sky-900">On a computer</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-sky-900/80">
                  <li>
                    <b>← →</b> or <b>A D</b> — walk
                  </li>
                  <li>
                    <b>Space</b> / <b>W</b> — jump (hold for higher, hold in air to glide as Doraemon)
                  </li>
                  <li>
                    <b>E</b> — pick up, talk, plant, carry, rescue
                  </li>
                  <li>
                    <b>Q</b> — hero ability (zap, freeze, magnet, swing, fly…)
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl bg-rose-50 p-4">
                <h3 className="font-display text-lg font-bold text-rose-900">On a tablet or phone</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-rose-900/80">
                  <li>Slide the joystick on the left to walk.</li>
                  <li>Tap JUMP on the right. Hold it to jump higher.</li>
                  <li>Tap E to pick up or talk.</li>
                  <li>Hold Q to use your hero power.</li>
                </ul>
                <p className="mt-3 rounded-xl bg-white/70 p-2 text-xs font-semibold text-rose-700">Landscape works best — the island is wide!</p>
              </div>
            </div>

            <h3 className="mt-6 font-display text-xl font-bold text-slate-800">Every hero can do something no one else can</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {PLAYABLE.map((c) => (
                <div key={c.id} className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5">
                  <span className="mt-0.5 rounded-lg bg-white px-2 py-1 text-[11px] font-black uppercase tracking-wide text-violet-600 shadow-sm">
                    {c.name}
                  </span>
                  <p className="text-xs leading-snug text-slate-600">
                    <b>{c.ability}</b> — {c.hint}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
              <b>The world remembers.</b> Fix the windmill as Doraemon, then switch to Pikachu — the blades are still spinning, the lamps
              you light stay lit, and the ice bridge Elsa builds is still there for everyone.
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
              Prototype note: heroes are drawn with code as recognisable placeholder sprites, not official artwork. All characters belong to
              their original creators.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
