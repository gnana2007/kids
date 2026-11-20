import { Star } from 'lucide-react';

export function StarRow({
  value,
  max = 3,
  size = 24,
  animate = false,
}: {
  value: number;
  max?: number;
  size?: number;
  animate?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-1" aria-label={`${value} of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < value;
        return (
          <Star
            key={i}
            style={{
              width: size,
              height: size,
              animationDelay: animate ? `${i * 0.14}s` : undefined,
            }}
            className={[
              filled ? 'fill-sun text-sun drop-shadow-[0_2px_6px_rgba(255,201,75,.6)]' : 'fill-white/10 text-white/30',
              animate && filled ? 'animate-popIn' : '',
            ].join(' ')}
          />
        );
      })}
    </div>
  );
}
