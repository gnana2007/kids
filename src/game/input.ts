export type Held = 'left' | 'right' | 'up' | 'down' | 'ability';
export type Action = 'jump' | 'interact' | 'ability';

/** Held directions — shared by keyboard, touch joystick and UI buttons. */
export const held: Record<Held, boolean> = { left: false, right: false, up: false, down: false, ability: false };

/** One-shot actions, consumed by the scene each frame. */
const queued: Record<Action, boolean> = { jump: false, interact: false, ability: false };

export function press(action: Action) {
  queued[action] = true;
}

export function consume(action: Action): boolean {
  if (!queued[action]) return false;
  queued[action] = false;
  return true;
}

export function clearQueue() {
  queued.jump = queued.interact = queued.ability = false;
}

export function setHeld(key: Held, value: boolean) {
  held[key] = value;
}

export function releaseAll() {
  held.left = held.right = held.up = held.down = held.ability = false;
  clearQueue();
}
