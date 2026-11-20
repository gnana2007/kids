import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import type { MatchConfig, MatchPart, MatchSlot } from '../../game/types';
import { useSfx } from '../../game/useSfx';
import { starsFromMistakes, type GameProps } from './shared';
import { StarRow } from '../StarRow';

export function MatchGame({ config, onComplete, onMistake }: GameProps<MatchConfig>) {
  const play = useSfx();
  const [filled, setFilled] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [msg, setMsg] = useState<{ text: string; tone: 'ok' | 'bad' } | null>(null);
  const [shakeSlot, setShakeSlot] = useState<string | null>(null);

  const partById = useMemo(() => Object.fromEntries(config.parts.map((p) => [p.id, p])), [config.parts]);
  const usedPartIds = Object.values(filled);
  const tray = config.parts.filter((p) => !usedPartIds.includes(p.id));
  const complete = Object.keys(filled).length === config.slots.length;
  const stars = starsFromMistakes(mistakes);

  function attempt(partId: string, slot: MatchSlot) {
    const part = partById[partId];
    if (!part || filled[slot.id]) return;
    if (part.slotId === slot.id) {
      setFilled((f) => ({ ...f, [slot.id]: partId }));
      setSelected(null);
      setMsg({ text: `${part.emoji} ${part.label} fits the ${slot.label} perfectly!`, tone: 'ok' });
      play('correct');
    } else {
      setMistakes((m) => m + 1);
      onMistake?.();
      setMsg({
        text: part.slotId
          ? `Not that slot — the ${slot.label} needs ${slot.hint.toLowerCase()}.`
          : `${part.emoji} ${part.label} does not belong here. Try a real part!`,
        tone: 'bad',
      });
      setShakeSlot(slot.id);
      window.setTimeout(() => setShakeSlot(null), 420);
      play('wrong');
    }
  }

  function onPartClick(part: MatchPart) {
    setSelected((s) => (s === part.id ? null : part.id));
    setMsg({ text: `Now tap the slot where the ${part.label} belongs.`, tone: 'ok' });
    play('tap');
  }

  function onSlotClick(slot: MatchSlot) {
    if (filled[slot.id]) return;
    if (!selected) {
      setMsg({ text: 'First pick a part from the tray below.', tone: 'bad' });
      return;
    }
    attempt(selected, slot);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>{config.intro}</span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 font-bold text-white/75">
          {Object.keys(filled).length}/{config.slots.length} placed
        </span>
      </div>

      {/* Slots */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {config.slots.map((slot) => {
          const partId = filled[slot.id];
          const part = partId ? partById[partId] : null;
          const isHover = hovered === slot.id;
          return (
            <motion.button
              key={slot.id}
              data-testid={`slot-${slot.id}`}
              onClick={() => onSlotClick(slot)}
              onDragOver={(e) => {
                e.preventDefault();
                setHovered(slot.id);
              }}
              onDragLeave={() => setHovered((h) => (h === slot.id ? null : h))}
              onDrop={(e) => {
                e.preventDefault();
                setHovered(null);
                const id = e.dataTransfer.getData('text/plain');
                if (id) attempt(id, slot);
              }}
              animate={shakeSlot === slot.id ? { x: [0, -7, 7, -4, 0] } : { x: 0 }}
              className={[
                'relative flex min-h-[124px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed p-2.5 text-center transition',
                part
                  ? 'border-mint border-solid bg-mint/15'
                  : isHover
                    ? 'border-sun bg-sun/15'
                    : selected
                      ? 'border-white/40 bg-white/10 hover:border-sun'
                      : 'border-white/20 bg-white/[0.06]',
              ].join(' ')}
              aria-label={`${slot.label} slot${part ? `, filled with ${part.label}` : ', empty'}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">{slot.label}</span>
              <span className="text-3xl">{part ? part.emoji : slot.emoji}</span>
              <span className="text-[11px] text-white/65">{part ? part.label : slot.hint}</span>
              {part && (
                <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-mint text-[#0d2b21]">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tray */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-2.5">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
          Parts tray · tap a part, then a slot
        </p>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {tray.map((part) => (
              <motion.button
                key={part.id}
                data-testid={`part-${part.id}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                draggable
                onDragStart={(e) => {
                  const ev = e as unknown as React.DragEvent;
                  ev.dataTransfer?.setData('text/plain', part.id);
                  setSelected(part.id);
                }}
                onClick={() => onPartClick(part)}
                whileHover={{ y: -3 }}
                className={[
                  'flex w-[76px] cursor-grab flex-col items-center gap-0.5 rounded-xl border-2 p-2 text-center transition active:cursor-grabbing',
                  selected === part.id
                    ? 'border-sun bg-sun/20 shadow-[0_0_18px_rgba(255,209,102,.35)]'
                    : 'border-white/15 bg-[#2a1f52] hover:border-white/40',
                ].join(' ')}
                aria-pressed={selected === part.id}
                aria-label={part.label}
              >
                <span className="text-2xl">{part.emoji}</span>
                <span className="text-[10px] font-bold leading-tight text-white/80">{part.label}</span>
              </motion.button>
            ))}
          </AnimatePresence>
          {tray.length === 0 && <p className="py-2 text-xs text-white/40">Tray empty — everything is in place!</p>}
        </div>
      </div>

      <div className="min-h-[78px]">
        <AnimatePresence mode="wait">
          {complete ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-mint/40 bg-mint/15 p-4 text-center sm:flex-row sm:text-left"
            >
              <div className="flex-1">
                <p className="font-display text-lg font-semibold">Everything is in place! ✨</p>
                <p className="text-sm text-white/75">{config.poweredBy}</p>
              </div>
              <StarRow value={stars} size={22} animate />
              <button onClick={() => onComplete({ stars, mistakes })} className="btn-primary px-4 py-2.5 text-base">
                Finish
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            msg && (
              <motion.p
                key={msg.text}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`pt-3 text-center text-sm ${msg.tone === 'ok' ? 'text-white/70' : 'text-coral'}`}
              >
                {msg.text}
              </motion.p>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
