type Handler = (payload: unknown) => void;

class Bus {
  private map = new Map<string, Set<Handler>>();

  on(event: string, fn: Handler) {
    if (!this.map.has(event)) this.map.set(event, new Set());
    this.map.get(event)!.add(fn);
    return () => this.off(event, fn);
  }

  off(event: string, fn: Handler) {
    this.map.get(event)?.delete(fn);
  }

  emit(event: string, payload?: unknown) {
    this.map.get(event)?.forEach((fn) => fn(payload));
  }
}

export const bus = new Bus();

export interface HudState {
  zoneId: string;
  zoneName: string;
  characterId: string;
  missionId: string | null;
  missionTitle: string;
  missionGoal: string;
  objectiveLabel: string;
  progress: number;
  total: number;
  done: boolean;
  prompt: string | null;
  abilityName: string;
  abilityReady: boolean;
  carried: boolean;
  flags: string[];
}

export const hudDefaults: HudState = {
  zoneId: 'village',
  zoneName: 'Cartoon Village',
  characterId: 'doraemon',
  missionId: null,
  missionTitle: '',
  missionGoal: '',
  objectiveLabel: '',
  progress: 0,
  total: 0,
  done: false,
  prompt: null,
  abilityName: '',
  abilityReady: true,
  carried: false,
  flags: [],
};
