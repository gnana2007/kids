import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { portrait } from '../game/art/sprites';
import { MISSIONS } from '../game/missions';

export function CharacterPortrait({ id, size = 96, className = '' }: { id: string; size?: number; className?: string }) {
  return (
    <img
      src={portrait(id, 168)}
      width={size}
      height={size}
      alt={id}
      draggable={false}
      className={`no-select select-none ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <motion.h1
        initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 140, damping: 12 }}
        className={`title-glow font-display font-bold tracking-tight ${small ? 'text-4xl' : 'text-[clamp(2rem,10.5vw,3.75rem)] sm:text-6xl lg:text-7xl xl:text-8xl'}`}
      >
        CharacterVerse
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className={`font-display font-semibold text-white/95 drop-shadow-[0_2px_0_rgba(60,40,110,0.35)] ${small ? 'text-sm' : 'mt-2 text-lg sm:text-2xl'}`}
      >
        One World. Many Adventures.
      </motion.p>
    </div>
  );
}

export function Cloud({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full bg-white/80 blur-[1px] ${className}`}
      style={{ animation: `floaty ${9 + delay}s ease-in-out infinite`, animationDelay: `${delay}s` }}
    >
      <div className="absolute -left-8 top-3 h-10 w-14 rounded-full bg-white/80" />
      <div className="absolute -right-8 top-4 h-8 w-12 rounded-full bg-white/80" />
    </div>
  );
}

export function SparkleField({ count = 18 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, i) => {
    const left = (i * 37) % 100;
    const top = (i * 61) % 100;
    const size = 4 + (i % 4) * 2;
    return { left, top, size, i };
  });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((s) => (
        <span
          key={s.i}
          className="absolute rounded-full bg-white/70"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            boxShadow: '0 0 10px rgba(255,255,255,.9)',
            animation: `floaty ${4 + (s.i % 5)}s ease-in-out infinite`,
            animationDelay: `${(s.i % 7) * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

export function MissionDots({ progress, total }: { progress: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rounded-full transition ${
            i < progress ? 'bg-gradient-to-b from-amber-300 to-orange-400 shadow-[0_0_0_2px_rgba(255,255,255,.8)]' : 'bg-slate-300/70'
          }`}
        />
      ))}
    </div>
  );
}

export function completedCount(missions: Record<string, { done: boolean }>) {
  return MISSIONS.filter((m) => missions[m.id]?.done).length;
}

export function StarChip({ done }: { done: number }) {
  return (
    <span className="pill">
      <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
      {done}/{MISSIONS.length} missions
    </span>
  );
}

export function SparklesRow() {
  return (
    <span className="inline-flex items-center gap-1 text-amber-200">
      <Sparkles className="h-4 w-4" />
      <Sparkles className="h-4 w-4" />
      <Sparkles className="h-4 w-4" />
    </span>
  );
}
