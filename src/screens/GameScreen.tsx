import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Map as MapIcon,
  HelpCircle,
  Maximize,
  Pause,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import PhaserGame from '../game/PhaserGame';
import { bus, hudDefaults, type HudState } from '../game/bus';
import { held, press } from '../game/input';
import { loadSave, type SaveData } from '../game/save';
import { setMuted as setSfxMuted, isMuted } from '../game/sound';
import { PLAYABLE, characterById } from '../game/characters';
import { MISSIONS } from '../game/missions';
import { CharacterPortrait, MissionDots } from '../ui/bits';
import HowToPlay from '../ui/HowToPlay';

interface Props {
  zone: string;
  character: string;
  onExit: () => void;
  onTravel: (zone: string) => void;
}

export default function GameScreen({ zone, character, onExit, onTravel }: Props) {
  const [hud, setHud] = useState<HudState>({ ...hudDefaults, characterId: character, zoneId: zone });
  const [save, setSave] = useState<SaveData>(() => loadSave());
  const [overlay, setOverlay] = useState<'switch' | 'map' | 'help' | null>(null);
  const [toast, setToast] = useState<{ title: string; reward: string; zone: string } | null>(null);
  const [muted, setMutedState] = useState(isMuted());
  const [isTouch] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches);
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    const offHud = bus.on('hud', (p) => setHud(p as HudState));
    const offSave = bus.on('save-changed', () => setSave(loadSave()));
    const offComplete = bus.on('mission-complete', (p) => {
      const m = p as { title: string; reward: string; zone: string };
      setToast(m);
      setIntro(false);
    });
    return () => {
      offHud();
      offSave();
      offComplete();
    };
  }, []);

  useEffect(() => {
    setSave(loadSave());
  }, [hud.flags]);

  // pause the world whenever an overlay is open
  useEffect(() => {
    bus.emit('cv:pause', overlay !== null || intro);
  }, [overlay, intro]);

  const toggleMute = () => {
    const next = !muted;
    setMutedState(next);
    setSfxMuted(next);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  };

  const hero = characterById(hud.characterId) ?? PLAYABLE[0];
  const mission = MISSIONS.find((m) => m.id === hud.missionId);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#9fe0ff]">
      <PhaserGame zone={zone} character={character} />

      {/* top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-2.5 sm:p-3">
        <div className="pointer-events-auto flex items-center gap-2">
          <button className="hud-glass flex h-11 w-11 items-center justify-center rounded-2xl text-slate-600 active:scale-95" onClick={onExit} aria-label="Exit to world map">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            className="hud-glass flex items-center gap-2 rounded-2xl py-1.5 pl-1.5 pr-3 active:scale-95"
            onClick={() => setOverlay('switch')}
          >
            <CharacterPortrait id={hud.characterId} size={32} />
            <span className="hidden text-left sm:block">
              <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Playing</span>
              <span className="block font-display text-sm font-bold leading-none text-slate-700">{hero.name}</span>
            </span>
            <Zap className="h-4 w-4 text-amber-500" />
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            className="hud-glass flex h-11 w-11 items-center justify-center rounded-2xl text-slate-600 active:scale-95"
            onClick={() => setOverlay('map')}
            aria-label="Island map"
          >
            <MapIcon className="h-5 w-5" />
          </button>
          <button className="hud-glass h-11 w-11 rounded-2xl text-slate-600 active:scale-95" onClick={toggleMute} aria-label="Sound">
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <button
            className="hud-glass flex h-11 w-11 items-center justify-center rounded-2xl text-slate-600 active:scale-95"
            onClick={toggleFullscreen}
            aria-label="Fullscreen"
          >
            <Maximize className="h-5 w-5" />
          </button>
          <button
            className="hud-glass hidden h-11 w-11 items-center justify-center rounded-2xl text-slate-600 active:scale-95 sm:flex"
            onClick={() => setOverlay('help')}
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* mission card */}
      <div className="pointer-events-none absolute inset-x-0 top-[4.4rem] z-20 flex justify-center px-3">
        {mission && !intro && (
          <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="hud-glass pointer-events-auto w-full max-w-md rounded-2xl px-3.5 py-2.5">
            <div className="flex items-center gap-3">
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-bold leading-tight text-slate-800">
                  {hud.done ? `✦ ${mission.title} — complete!` : mission.title}
                </p>
                <p className="line-clamp-2 text-[10px] font-semibold leading-snug text-slate-500">{hud.done ? 'Switch hero to explore a new story' : hud.missionGoal}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">{hud.objectiveLabel}</p>
                <div className="mt-1 flex items-center justify-end gap-1.5">
                  <MissionDots progress={hud.progress} total={hud.total} />
                  <span className="text-[11px] font-black text-slate-600">
                    {hud.done ? '✓' : `${hud.progress}/${hud.total}`}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* interaction prompt */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[7.6rem] z-20 flex justify-center px-3 sm:bottom-24">
        {hud.prompt && !intro && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="hud-glass flex items-center gap-2 rounded-full px-3 py-1.5">
            <span className="rounded-lg bg-gradient-to-b from-violet-500 to-violet-600 px-2 py-0.5 text-[11px] font-black text-white shadow-sm">
              {hud.prompt.includes('(Q)') ? 'Q' : 'E'}
            </span>
            <span className="text-xs font-extrabold text-slate-700">{hud.prompt}</span>
          </motion.div>
        )}
      </div>

      {/* desktop ability hint */}
      {!isTouch && (
      <div className="hud-glass desktop-hints pointer-events-none absolute bottom-24 right-4 z-20 hidden rounded-2xl px-3 py-2 text-[11px] font-bold leading-snug text-slate-600 sm:block">
        <span className="text-amber-600">Q</span> {hud.abilityName || 'hero power'}
        <br />
        <span className="text-slate-500">←→ move · Space jump · E interact</span>
      </div>
      )}

      {/* touch controls */}
      <TouchControls />

      {/* overlays */}
      <AnimatePresence>
        {overlay === 'switch' && (
          <Overlay onClose={() => setOverlay(null)} title="Switch heroes">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {PLAYABLE.map((c) => {
                const m = MISSIONS.find((x) => x.character === c.id);
                const mDone = m ? Boolean(save.missions[m.id]?.done) : false;
                const active = c.id === hud.characterId;
                return (
                  <button
                    key={c.id}
                    onClick={() => bus.emit('cv:set-character', c.id)}
                    className={`rounded-2xl border-2 p-2.5 text-left transition ${
                      active ? 'border-violet-400 bg-violet-50 shadow-md' : 'border-slate-100 bg-white hover:border-violet-200'
                    }`}
                  >
                    <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-amber-50 p-1">
                      <CharacterPortrait id={c.id} size={64} />
                    </div>
                    <p className="mt-1.5 truncate font-display text-xs font-bold text-slate-800">{c.name}</p>
                    <p className="truncate text-[10px] font-semibold text-slate-400">{c.ability}</p>
                    <p className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-black ${mDone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {mDone ? 'DONE' : 'OPEN'}
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-center text-[11px] font-semibold text-slate-500">
              Your hero appears right here in the world — the island stays exactly as you left it.
            </p>
          </Overlay>
        )}

        {overlay === 'map' && (
          <Overlay onClose={() => setOverlay(null)} title="Island map">
            <div className="grid gap-2.5 sm:grid-cols-3">
              {['village', 'forest', 'frozen'].map((zid) => {
                const z = ZONES_FOR_OVERLAY[zid];
                const zoneMissions = MISSIONS.filter((m) => m.zone === zid);
                const zDone = zoneMissions.filter((m) => save.missions[m.id]?.done).length;
                const here = zid === hud.zoneId;
                return (
                  <div key={zid} className={`rounded-2xl border-2 bg-white p-3 ${here ? 'border-amber-300' : 'border-slate-100'}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-sm font-bold text-slate-800">{z.name}</h3>
                      {here && <span className="rounded-full bg-amber-100 px-1.5 text-[9px] font-black text-amber-600">HERE</span>}
                    </div>
                    <div className="mt-0.5 text-2xl">{z.emoji}</div>
                    <p className="mt-1 text-[10px] font-semibold text-slate-400">
                      {zDone}/{zoneMissions.length} stories complete
                    </p>
                    <button
                      className={`btn mt-2 w-full py-2 text-xs ${here ? 'btn-ghost' : 'btn-primary'}`}
                      disabled={here}
                      onClick={() => onTravel(zid)}
                    >
                      {here ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      {here ? 'You are here' : 'Travel here'}
                    </button>
                  </div>
                );
              })}
            </div>
          </Overlay>
        )}
      </AnimatePresence>

      <HowToPlay open={overlay === 'help'} onClose={() => setOverlay(null)} />

      {/* mission complete toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="absolute inset-x-0 top-[10.5rem] z-30 flex justify-center px-4"
          >
            <div className="card-kid flex w-full max-w-md items-center gap-3 p-4" onClick={() => setToast(null)}>
              <span className="rounded-2xl bg-gradient-to-br from-amber-200 to-rose-200 p-2">
                <Sparkles className="h-6 w-6 text-rose-500" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold text-slate-800">✦ {toast.title} complete!</p>
                <p className="text-[11px] font-semibold leading-snug text-slate-500">{toast.reward}</p>
              </div>
              <X className="h-4 w-4 shrink-0 text-slate-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* intro / tutorial */}
      <AnimatePresence>
        {intro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-[#16264d]/55 p-4 backdrop-blur-[2px]"
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="card-kid max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-amber-100 p-1.5">
                  <CharacterPortrait id={hud.characterId} size={72} />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-800">You are {hero.name}!</h2>
                  <p className="text-xs font-bold text-violet-600">{hero.ability}</p>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">{hero.hint}</p>
              {mission && (
                <div className="mt-3 rounded-2xl bg-amber-50 p-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-amber-600">Your story</p>
                  <p className="font-display text-base font-bold text-amber-900">{mission.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-amber-800/90">{mission.goal}</p>
                </div>
              )}
              <div className="mt-4 rounded-2xl bg-sky-50 p-3 text-xs font-semibold leading-relaxed text-sky-900/90">
                <b>Desktop:</b> ← → walk · Space jump · E pick up · Q power. <b>Touch:</b> joystick + big buttons. Follow the yellow
                markers!
              </div>
              <button className="btn btn-primary mt-4 w-full" onClick={() => setIntro(false)}>
                <Play className="h-4 w-4 fill-white" /> Let's go!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ZONES_FOR_OVERLAY: Record<string, { name: string; emoji: string }> = {
  village: { name: 'Cartoon Village', emoji: '🏘️' },
  forest: { name: 'Magical Forest', emoji: '🍄' },
  frozen: { name: 'Frozen Kingdom', emoji: '❄️' },
};

function Overlay({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-[#16264d]/45 p-3 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="card-kid max-h-[86vh] w-full max-w-2xl overflow-y-auto p-4 sm:p-5"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function TouchControls() {
  const stickRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const activeRef = useRef(false);
  const R = 52;

  const onMove = (e: React.PointerEvent) => {
    if (!activeRef.current) return;
    const el = stickRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const len = Math.hypot(dx, dy);
    if (len > R) {
      dx = (dx / len) * R;
      dy = (dy / len) * R;
    }
    setKnob({ x: dx, y: dy });
    const dead = 14;
    held.left = dx < -dead;
    held.right = dx > dead;
  };

  const onUp = () => {
    activeRef.current = false;
    held.left = held.right = false;
    setKnob({ x: 0, y: 0 });
  };

  const onDown = (e: React.PointerEvent) => {
    activeRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    onMove(e);
  };

  return (
    <div className="touch-controls pointer-events-none absolute inset-x-0 bottom-2 z-20 flex items-end justify-between px-3 select-none">
      {/* joystick */}
      <div
        ref={stickRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="pointer-events-auto relative h-28 w-28 rounded-full border-4 border-white/70 bg-white/25 backdrop-blur-sm"
        style={{ touchAction: 'none' }}
      >
        <span className="absolute inset-3 rounded-full border-2 border-white/40" />
        <span
          className="absolute left-1/2 top-1/2 h-12 w-12 rounded-full bg-white/90 shadow-lg"
          style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
        />
      </div>

      {/* action buttons */}
      <div className="pointer-events-auto flex items-end gap-3">
        <ActionButton label="Q" sub="power" onDown={() => {
          held.ability = true;
          press('ability');
        }} onUp={() => (held.ability = false)} />
        <ActionButton
          label="E"
          sub="use"
          onDown={() => press('interact')}
        />
        <ActionButton
          label="JUMP"
          big
          onDown={() => {
            held.up = true;
            press('jump');
          }}
          onUp={() => (held.up = false)}
        />
      </div>
    </div>
  );
}

function ActionButton({
  label,
  sub,
  big,
  onDown,
  onUp,
}: {
  label: string;
  sub?: string;
  big?: boolean;
  onDown: () => void;
  onUp?: () => void;
}) {
  const size = big ? 'h-20 w-20 text-sm' : 'h-14 w-14 text-base';
  return (
    <button
      className={`${size} flex flex-col items-center justify-center rounded-full border-4 border-white/80 font-display font-black text-[#1c1240] shadow-[0_6px_0_rgba(44,40,104,.35)] ${
        big ? 'bg-gradient-to-b from-amber-200 to-amber-400' : 'bg-gradient-to-b from-sky-200 to-sky-400'
      } active:translate-y-1`}
      style={{ touchAction: 'none' }}
      onPointerDown={(e) => {
        e.preventDefault();
        onDown();
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        onUp?.();
      }}
      onPointerLeave={onUp}
      onPointerCancel={onUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      {label}
      {sub && <span className="text-[8px] font-black uppercase opacity-70">{sub}</span>}
    </button>
  );
}