import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles } from 'lucide-react';
import type { DesignConfig } from '../../game/types';
import { useSfx } from '../../game/useSfx';
import type { GameProps } from './shared';

export function DesignGame({ config, onComplete }: GameProps<DesignConfig>) {
  const play = useSfx();
  const [dress, setDress] = useState<string | null>(null);
  const [hair, setHair] = useState<string | null>(null);
  const [accessory, setAccessory] = useState<string | null>(null);
  const [shoes, setShoes] = useState<string | null>(null);

  const dressSw = config.dresses.find((d) => d.id === dress);
  const hairSw = config.hairs.find((h) => h.id === hair);
  const acc = config.accessories.find((a) => a.id === accessory);
  const shoe = config.shoes.find((s) => s.id === shoes);

  const ready = Boolean(dressSw && hairSw && acc && shoe);

  const harmony = useMemo(() => {
    if (!dressSw || !hairSw) return null;
    const raw = Math.abs(dressSw.hue - hairSw.hue);
    const diff = Math.min(raw, 360 - raw);
    if (diff <= 40) return { type: 'analogous' as const, label: 'Soft harmony', note: 'Colours that sit side by side blend beautifully.' };
    if (diff >= 140) return { type: 'complementary' as const, label: 'Bold contrast', note: 'Opposite colours make each other pop!' };
    return { type: 'neutral' as const, label: 'Playful mix', note: 'A brave combination — designers try everything.' };
  }, [dressSw, hairSw]);

  function finish() {
    if (!ready) return;
    play('win');
    onComplete({ stars: harmony && harmony.type !== 'neutral' ? 3 : 2, mistakes: 0 });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      {/* Preview */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#3a2a6e] to-[#221645] p-3">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-blush/30 blur-3xl" />
        </div>
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">{config.brief}</p>

        <svg viewBox="0 0 200 340" className="mx-auto h-[300px] w-full sm:h-[340px]" role="img" aria-label="Outfit preview">
          <defs>
            <linearGradient id="dressShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
            </linearGradient>
            <radialGradient id="stage">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="100" cy="180" r="110" fill="url(#stage)" />
          <ellipse cx="100" cy="322" rx="62" ry="9" fill="#000" opacity="0.25" />

          {/* hair behind */}
          <ellipse cx="100" cy="92" rx="44" ry="50" fill={hairSw?.color ?? '#5b3f8f'} opacity={hairSw ? 1 : 0.35} />
          {/* legs */}
          <g stroke="#ffdcbd" strokeWidth="10" strokeLinecap="round">
            <line x1="88" y1="248" x2="86" y2="298" />
            <line x1="112" y1="248" x2="114" y2="298" />
          </g>
          {/* dress */}
          <motion.path
            key={dress ?? 'none'}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            d="M 76 128 Q 100 120 124 128 L 138 250 Q 100 264 62 250 Z"
            fill={dressSw?.color ?? '#8a7fb5'}
            opacity={dressSw ? 1 : 0.45}
          />
          <path d="M 76 128 Q 100 120 124 128 L 138 250 Q 100 264 62 250 Z" fill="url(#dressShade)" opacity="0.55" />
          {/* waist ribbon */}
          <path d="M 74 160 Q 100 172 126 160 L 124 170 Q 100 182 76 170 Z" fill="#ffffff" opacity="0.55" />
          {/* arms */}
          <g stroke="#ffdcbd" strokeWidth="9" strokeLinecap="round">
            <line x1="78" y1="138" x2="62" y2="196" />
            <line x1="122" y1="138" x2="138" y2="196" />
          </g>
          {/* neck + head */}
          <rect x="94" y="112" width="12" height="16" rx="5" fill="#f3c9a5" />
          <circle cx="100" cy="92" r="30" fill="#ffdcbd" />
          {/* fringe */}
          <path
            d="M 70 86 Q 74 56 100 56 Q 126 56 130 86 Q 120 68 100 70 Q 82 72 70 86 Z"
            fill={hairSw?.color ?? '#5b3f8f'}
            opacity={hairSw ? 1 : 0.35}
          />
          {/* face */}
          <circle cx="89" cy="92" r="2.6" fill="#3a2a52" />
          <circle cx="111" cy="92" r="2.6" fill="#3a2a52" />
          <path d="M 93 104 Q 100 110 107 104" stroke="#e2717f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <circle cx="82" cy="100" r="4" fill="#ff9ecb" opacity="0.5" />
          <circle cx="118" cy="100" r="4" fill="#ff9ecb" opacity="0.5" />

          {/* accessory */}
          {acc && (
            <motion.text
              key={acc.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              x={acc.id === 'crown' ? 100 : acc.id === 'wand' ? 146 : 126}
              y={acc.id === 'crown' ? 48 : acc.id === 'wand' ? 188 : 62}
              fontSize={acc.id === 'wand' ? 26 : 24}
              textAnchor="middle"
            >
              {acc.emoji}
            </motion.text>
          )}

          {/* shoes */}
          <g fontSize="18" textAnchor="middle">
            <text x="86" y="312">{shoe?.emoji ?? '👣'}</text>
            <text x="114" y="312">{shoe?.emoji ?? '👣'}</text>
          </g>
        </svg>

        <div className="mt-1 text-center">
          {harmony && dressSw && hairSw ? (
            <p className="text-xs text-white/75">
              <span className="font-bold text-sun">{harmony.label}</span> · {harmony.note}
            </p>
          ) : (
            <p className="text-xs text-white/45">Pick colours and pieces to see the look come alive.</p>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        <Group title="Dress colour" icon={<Palette className="h-3.5 w-3.5" />}>
          {config.dresses.map((d) => (
            <button
              key={d.id}
              data-testid={`dress-${d.id}`}
              onClick={() => {
                setDress(d.id === dress ? null : d.id);
                play('tap');
              }}
              aria-pressed={dress === d.id}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 p-1.5 transition ${
                dress === d.id ? 'border-sun bg-white/15' : 'border-white/15 bg-white/5 hover:border-white/40'
              }`}
            >
              <span className="h-7 w-7 rounded-full ring-2 ring-white/40" style={{ background: d.color }} />
              <span className="text-[10px] font-bold text-white/75">{d.name}</span>
            </button>
          ))}
        </Group>

        <Group title="Hair colour" icon={<Sparkles className="h-3.5 w-3.5" />}>
          {config.hairs.map((h) => (
            <button
              key={h.id}
              data-testid={`hair-${h.id}`}
              onClick={() => {
                setHair(h.id === hair ? null : h.id);
                play('tap');
              }}
              aria-pressed={hair === h.id}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 p-1.5 transition ${
                hair === h.id ? 'border-sun bg-white/15' : 'border-white/15 bg-white/5 hover:border-white/40'
              }`}
            >
              <span className="h-7 w-7 rounded-full ring-2 ring-white/40" style={{ background: h.color }} />
              <span className="text-[10px] font-bold text-white/75">{h.name}</span>
            </button>
          ))}
        </Group>

        <Group title="Accessory">
          {config.accessories.map((a) => (
            <button
              key={a.id}
              data-testid={`accessory-${a.id}`}
              onClick={() => {
                setAccessory(a.id === accessory ? null : a.id);
                play('tap');
              }}
              aria-pressed={accessory === a.id}
              className={`flex flex-col items-center gap-0.5 rounded-xl border-2 px-2 py-1.5 transition ${
                accessory === a.id ? 'border-sun bg-white/15' : 'border-white/15 bg-white/5 hover:border-white/40'
              }`}
            >
              <span className="text-xl">{a.emoji}</span>
              <span className="text-[10px] font-bold text-white/75">{a.name}</span>
            </button>
          ))}
        </Group>

        <Group title="Shoes">
          {config.shoes.map((s) => (
            <button
              key={s.id}
              data-testid={`shoes-${s.id}`}
              onClick={() => {
                setShoes(s.id === shoes ? null : s.id);
                play('tap');
              }}
              aria-pressed={shoes === s.id}
              className={`flex flex-col items-center gap-0.5 rounded-xl border-2 px-2 py-1.5 transition ${
                shoes === s.id ? 'border-sun bg-white/15' : 'border-white/15 bg-white/5 hover:border-white/40'
              }`}
            >
              <span className="text-xl">{s.emoji}</span>
              <span className="text-[10px] font-bold text-white/75">{s.name}</span>
            </button>
          ))}
        </Group>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <button data-testid="design-finish" onClick={finish} disabled={!ready} className="btn-primary flex-1 text-base disabled:cursor-not-allowed disabled:opacity-40">
            {ready ? 'Show the look on stage ✨' : 'Pick one from each group'}
          </button>
          <button
            onClick={() => {
              setDress(null);
              setHair(null);
              setAccessory(null);
              setShoes(null);
            }}
            className="btn-ghost px-3 py-2 text-xs"
          >
            Restyle
          </button>
        </div>
      </div>
    </div>
  );
}

function Group({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-2.5">
      <p className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
        {icon}
        {title}
      </p>
      <div className="grid grid-cols-5 gap-1.5">{children}</div>
    </div>
  );
}
