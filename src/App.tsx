import { useCallback, useState } from 'react';
import Title from './screens/Title';
import CharacterSelect from './screens/CharacterSelect';
import WorldSelect from './screens/WorldSelect';
import GameScreen from './screens/GameScreen';
import HowToPlay from './ui/HowToPlay';
import { clearSave, loadSave, writeSave, type SaveData } from './game/save';
import { characterById, PLAYABLE } from './game/characters';

type Screen = 'title' | 'select' | 'world';

interface Run {
  zone: string;
  character: string;
  key: number;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [save, setSave] = useState<SaveData>(() => loadSave());
  const [selected, setSelected] = useState<string>(() => loadSave().character);
  const [run, setRun] = useState<Run | null>(null);
  const [help, setHelp] = useState(false);
  const [askReset, setAskReset] = useState(false);

  const refresh = useCallback(() => setSave(loadSave()), []);

  const persist = useCallback((patch: Partial<SaveData>) => {
    const next = { ...loadSave(), ...patch };
    writeSave(next);
    setSave(next);
  }, []);

  const chooseHero = (id: string) => {
    setSelected(id);
    if (characterById(id)?.playable) persist({ character: id });
  };

  const enterZone = (zone: string) => {
    const hero = characterById(selected)?.playable ? selected : PLAYABLE[0].id;
    persist({ character: hero, zone, started: true });
    setRun({ zone, character: hero, key: Date.now() });
  };

  const travel = (zone: string) => {
    const hero = loadSave().character;
    persist({ zone });
    setRun({ zone, character: hero, key: Date.now() });
  };

  const exitGame = () => {
    const latest = loadSave();
    setRun(null);
    setSelected(latest.character);
    setSave(latest);
    setScreen('world');
  };

  const doReset = () => {
    clearSave();
    setSave(loadSave());
    setSelected('doraemon');
    setAskReset(false);
    setRun(null);
    setScreen('title');
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {screen === 'title' && (
        <Title
          save={save}
          onStart={() => {
            setSelected(save.character);
            setScreen('select');
          }}
          onContinue={() => setScreen('world')}
          onHowTo={() => setHelp(true)}
        />
      )}

      {screen === 'select' && (
        <CharacterSelect
          save={save}
          selected={selected}
          onSelect={chooseHero}
          onConfirm={() => {
            persist({ character: selected, started: true });
            setScreen('world');
          }}
          onBack={() => setScreen('title')}
        />
      )}

      {screen === 'world' && (
        <WorldSelect
          save={save}
          hero={selected}
          onEnter={enterZone}
          onBack={() => setScreen('select')}
          onReset={() => setAskReset(true)}
          onHowTo={() => setHelp(true)}
        />
      )}

      {run && (
        <div key={run.key} className="fixed inset-0 z-30">
          <GameScreen zone={run.zone} character={run.character} onExit={exitGame} onTravel={travel} />
        </div>
      )}

      <HowToPlay open={help} onClose={() => setHelp(false)} />

      {askReset && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#16264d]/50 p-4 backdrop-blur-sm" onClick={() => setAskReset(false)}>
          <div className="card-kid w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold text-slate-800">Reset the whole island?</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              This clears every mission, lit lamp, repaired machine and the ice bridge from this browser. It cannot be undone.
            </p>
            <div className="mt-4 flex gap-2">
              <button className="btn btn-ghost flex-1 py-2.5 text-sm" onClick={() => setAskReset(false)}>
                Keep my world
              </button>
              <button className="btn btn-primary flex-1 py-2.5 text-sm" onClick={doReset}>
                Reset everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
