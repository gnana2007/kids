export interface MissionSave {
  progress: string[];
  done: boolean;
}

export interface SaveData {
  version: 2;
  character: string;
  flags: string[];
  missions: Record<string, MissionSave>;
  zone: string;
  started: boolean;
}

const KEY = 'characterverse:world:v1';

export const defaultSave = (): SaveData => ({
  version: 2,
  character: 'doraemon',
  flags: [],
  missions: {},
  zone: 'village',
  started: false,
});

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return {
      version: 2,
      character: typeof parsed.character === 'string' ? parsed.character : 'doraemon',
      flags: Array.isArray(parsed.flags) ? parsed.flags.filter((f) => typeof f === 'string') : [],
      missions: parsed.missions && typeof parsed.missions === 'object' ? parsed.missions : {},
      zone: typeof parsed.zone === 'string' ? parsed.zone : 'village',
      started: Boolean(parsed.started),
    };
  } catch {
    return defaultSave();
  }
}

export function writeSave(data: SaveData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* private mode / storage full: keep playing for this session */
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Merge helper used by the game scene, keeps a single source of truth. */
export function patchSave(patch: Partial<SaveData>): SaveData {
  const next = { ...loadSave(), ...patch };
  writeSave(next);
  return next;
}
