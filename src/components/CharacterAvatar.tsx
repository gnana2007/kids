import type { Character } from '../game/characters';

type Size = 'sm' | 'md' | 'lg' | 'xl';

const sizes: Record<Size, { box: string; emoji: string }> = {
  sm: { box: 'h-10 w-10', emoji: 'text-xl' },
  md: { box: 'h-16 w-16', emoji: 'text-3xl' },
  lg: { box: 'h-24 w-24', emoji: 'text-5xl' },
  xl: { box: 'h-32 w-32 sm:h-40 sm:w-40', emoji: 'text-6xl sm:text-7xl' },
};

export function CharacterAvatar({
  character,
  size = 'md',
  ring = true,
  className = '',
}: {
  character: Character;
  size?: Size;
  ring?: boolean;
  className?: string;
}) {
  const s = sizes[size];
  return (
    <div
      className={`relative grid place-items-center rounded-full ${s.box} ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 22%, #ffffffcc 0%, transparent 42%), linear-gradient(145deg, ${character.colors[0]}, ${character.colors[1]})`,
        boxShadow: `0 10px 26px -10px ${character.colors[1]}cc, ${ring ? 'inset 0 0 0 3px rgba(255,255,255,.55)' : 'none'}`,
      }}
      aria-hidden="true"
    >
      <span className={`${s.emoji} drop-shadow-[0_3px_6px_rgba(0,0,0,.35)] select-none`}>{character.emoji}</span>
      <span className="pointer-events-none absolute -left-1 top-1 h-3 w-3 rounded-full bg-white/70 blur-[1px]" />
    </div>
  );
}
