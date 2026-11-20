export type LocationId = 'village' | 'forest' | 'river' | 'lab' | 'mountain' | 'castle' | 'city';

export type GameKind = 'choice' | 'path' | 'circuit' | 'web' | 'match' | 'design';

export interface Option {
  id: string;
  emoji: string;
  label: string;
  note?: string;
}

export interface ChoiceRound {
  prompt: string;
  scene: string;
  options: Option[];
  answer: string;
  success: string;
}

export interface ChoiceConfig {
  kind: 'choice';
  intro: string;
  rounds: ChoiceRound[];
}

export interface PathConfig {
  kind: 'path';
  intro: string;
  cols: number;
  rows: number;
  /** "x,y" coordinates of blocked rocks */
  rocks: string[];
  start: [number, number];
  end: [number, number];
  hint: string;
}

export interface CircuitNode {
  id: string;
  emoji: string;
  label: string;
  /** Position on the 100x100 stage, in percent */
  x: number;
  y: number;
  hint: string;
}

export interface CircuitConfig {
  kind: 'circuit';
  intro: string;
  nodes: CircuitNode[];
  order: string[];
  bonus: {
    prompt: string;
    options: Option[];
    answer: string;
    success: string;
  };
}

export interface WebAnchor {
  id: string;
  label: string;
  x: number;
  y: number;
  weak?: boolean;
}

export interface WebConfig {
  kind: 'web';
  intro: string;
  anchors: WebAnchor[];
  /** Solid anchors in left-to-right order */
  order: string[];
}

export interface MatchSlot {
  id: string;
  label: string;
  emoji: string;
  accepts: string;
  hint: string;
}

export interface MatchPart {
  id: string;
  emoji: string;
  label: string;
  slotId?: string;
}

export interface MatchConfig {
  kind: 'match';
  intro: string;
  slots: MatchSlot[];
  parts: MatchPart[];
  poweredBy: string;
}

export interface Swatch {
  id: string;
  name: string;
  hue: number;
  color: string;
}

export interface Accessory {
  id: string;
  name: string;
  emoji: string;
}

export interface DesignConfig {
  kind: 'design';
  intro: string;
  brief: string;
  dresses: Swatch[];
  hairs: Swatch[];
  accessories: Accessory[];
  shoes: Accessory[];
}

export type GameConfig = ChoiceConfig | PathConfig | CircuitConfig | WebConfig | MatchConfig | DesignConfig;

export interface Mission {
  id: string;
  characterId: string;
  title: string;
  tagline: string;
  location: LocationId;
  /** Linked story chapter (1-5). Omitted for independent missions. */
  chapter?: number;
  /** Mission that must be completed before this one in the shared story */
  prereq?: string;
  /** Next linked chapter, offered by "Continue" on the results screen */
  next?: string;
  story: string[];
  goal: string;
  /** One friendly sentence shown on the results screen */
  learn: string;
  badge: { id: string; name: string; emoji: string };
  /** World-map change unlocked by this mission */
  worldFlag: string;
  game: GameConfig;
}

export interface Location {
  id: LocationId;
  name: string;
  emoji: string;
  blurb: string;
  /** Position on the island, in percent */
  x: number;
  y: number;
}
