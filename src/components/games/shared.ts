export interface GameResult {
  stars: number;
  mistakes: number;
}

export function starsFromMistakes(mistakes: number): number {
  if (mistakes <= 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}

export interface GameProps<TConfig> {
  config: TConfig;
  onComplete: (result: GameResult) => void;
  onMistake?: () => void;
}
