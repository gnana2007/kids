import type { Mission } from '../game/types';
import { ChoiceGame } from './games/ChoiceGame';
import { PathGame } from './games/PathGame';
import { CircuitGame } from './games/CircuitGame';
import { WebGame } from './games/WebGame';
import { MatchGame } from './games/MatchGame';
import { DesignGame } from './games/DesignGame';
import type { GameResult } from './games/shared';

export function GameInteraction({
  mission,
  onComplete,
  onMistake,
}: {
  mission: Mission;
  onComplete: (result: GameResult) => void;
  onMistake?: () => void;
}) {
  const game = mission.game;
  switch (game.kind) {
    case 'choice':
      return <ChoiceGame config={game} onComplete={onComplete} onMistake={onMistake} />;
    case 'path':
      return <PathGame config={game} onComplete={onComplete} onMistake={onMistake} />;
    case 'circuit':
      return <CircuitGame config={game} onComplete={onComplete} onMistake={onMistake} />;
    case 'web':
      return <WebGame config={game} onComplete={onComplete} onMistake={onMistake} />;
    case 'match':
      return <MatchGame config={game} onComplete={onComplete} onMistake={onMistake} />;
    case 'design':
      return <DesignGame config={game} onComplete={onComplete} onMistake={onMistake} />;
  }
}

export const gameKindLabel: Record<Mission['game']['kind'], string> = {
  choice: 'Choose the right answer',
  path: 'Build a path',
  circuit: 'Connect the circuit',
  web: 'Pick strong anchors',
  match: 'Match the parts',
  design: 'Design & create',
};
