import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Mission } from './types';
import { ISLAND_BADGE, MAX_STARS, missions, storyMissions } from './missions';

const STORAGE_KEY = 'characterverse:progress:v1';

export interface ProgressState {
  stars: Record<string, number>;
  badges: string[];
  flags: string[];
  lastMission?: string;
  updatedAt?: number;
}

const emptyState: ProgressState = { stars: {}, badges: [], flags: [] };

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      stars: parsed.stars && typeof parsed.stars === 'object' ? parsed.stars : {},
      badges: Array.isArray(parsed.badges) ? parsed.badges.filter((b) => typeof b === 'string') : [],
      flags: Array.isArray(parsed.flags) ? parsed.flags.filter((f) => typeof f === 'string') : [],
      lastMission: typeof parsed.lastMission === 'string' ? parsed.lastMission : undefined,
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : undefined,
    };
  } catch {
    return emptyState;
  }
}

interface ProgressContextValue extends ProgressState {
  totalStars: number;
  maxStars: number;
  completedCount: number;
  hasFlag: (flag: string) => boolean;
  isCompleted: (missionId: string) => boolean;
  isUnlocked: (mission: Mission) => boolean;
  starsFor: (missionId: string) => number;
  completeMission: (mission: Mission, stars: number) => { newBadges: string[] };
  resetProgress: () => void;
  storyDone: number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => (typeof window === 'undefined' ? emptyState : load()));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked — the game still works for this session */
    }
  }, [state]);

  const completeMission = useCallback(
    (mission: Mission, stars: number) => {
      const storyDoneNow = storyMissions.every((m) => m.id === mission.id || state.stars[m.id] !== undefined);
      const candidates = [mission.badge.id, ...(storyDoneNow ? [ISLAND_BADGE.id] : [])];
      const newBadges = candidates.filter((b) => !state.badges.includes(b));

      setState((prev) => {
        const bestStars = Math.max(prev.stars[mission.id] ?? 0, Math.min(3, Math.max(1, stars)));
        const nextStars = { ...prev.stars, [mission.id]: bestStars };
        const badges = [...prev.badges];
        const flags = [...prev.flags];

        candidates.forEach((b) => {
          if (!badges.includes(b)) badges.push(b);
        });
        if (!flags.includes(mission.worldFlag)) flags.push(mission.worldFlag);

        return { stars: nextStars, badges, flags, lastMission: mission.id, updatedAt: Date.now() };
      });

      return { newBadges };
    },
    [state.stars, state.badges]
  );

  const resetProgress = useCallback(() => setState(emptyState), []);

  const value = useMemo<ProgressContextValue>(() => {
    const totalStars = Object.values(state.stars).reduce((sum, s) => sum + (Number(s) || 0), 0);
    return {
      ...state,
      totalStars,
      maxStars: MAX_STARS,
      completedCount: missions.filter((m) => state.stars[m.id] !== undefined).length,
      hasFlag: (flag) => state.flags.includes(flag),
      isCompleted: (id) => state.stars[id] !== undefined,
      isUnlocked: (mission) => !mission.prereq || state.stars[mission.prereq] !== undefined,
      starsFor: (id) => state.stars[id] ?? 0,
      completeMission,
      resetProgress,
      storyDone: storyMissions.filter((m) => state.stars[m.id] !== undefined).length,
    };
  }, [state, completeMission, resetProgress]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
