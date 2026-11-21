import type { ZoneId } from './characters';

export const ZONE_WIDTH = 2600;
export const WORLD_WIDTH = ZONE_WIDTH * 3;
export const GROUND_Y = 560;
export const VIEW_W = 1280;
export const VIEW_H = 720;

export interface GroundSeg {
  x: number;
  w: number;
  y: number;
}
export interface PlatformDef {
  x: number;
  y: number;
  w: number;
}
export interface WaterDef {
  x: number;
  w: number;
  id: string;
}
export interface AnchorDef {
  x: number;
  y: number;
}
export type ThingType =
  | 'windmill'
  | 'lamp'
  | 'gear'
  | 'toy'
  | 'crate'
  | 'hearth'
  | 'flowerBed'
  | 'iceGap'
  | 'villager'
  | 'generator'
  | 'part'
  | 'npc'
  | 'sign'
  | 'house'
  | 'tree'
  | 'mushroom'
  | 'bush'
  | 'castle'
  | 'rock'
  | 'lily'
  | 'haystack';

export interface Thing {
  id: string;
  type: ThingType;
  x: number;
  y: number;
  variant?: number;
  label?: string;
  color?: string;
}

export interface ZoneDef {
  id: ZoneId;
  name: string;
  blurb: string;
  index: number;
  x: number;
  width: number;
  playable: boolean;
  palette: {
    skyTop: string;
    skyBottom: string;
    far: string;
    mid: string;
    groundTop: string;
    groundBody: string;
    accent: string;
  };
  spawn: { x: number; y: number };
  ground: GroundSeg[];
  platforms: PlatformDef[];
  water: WaterDef[];
  anchors: AnchorDef[];
  things: Thing[];
  weather: 'leaves' | 'snow' | 'fireflies' | 'none';
}

export const ZONES: ZoneDef[] = [
  {
    id: 'village',
    name: 'Cartoon Village',
    blurb: 'Cottage roofs, a big windmill and the warmest hearth on the island.',
    index: 0,
    x: 0,
    width: ZONE_WIDTH,
    playable: true,
    palette: {
      skyTop: '#7fd8ff',
      skyBottom: '#e6f9ff',
      far: '#a9e3b8',
      mid: '#5fb98d',
      groundTop: '#78d06f',
      groundBody: '#8a5a34',
      accent: '#ffcf6b',
    },
    spawn: { x: 160, y: 520 },
    ground: [{ x: -60, w: ZONE_WIDTH + 120, y: GROUND_Y }],
    platforms: [
      { x: 250, y: 440, w: 190 },
      { x: 1080, y: 470, w: 200 },
      { x: 1420, y: 380, w: 210 },
      { x: 1980, y: 450, w: 190 },
      { x: 2320, y: 350, w: 180 },
    ],
    water: [],
    anchors: [],
    weather: 'leaves',
    things: [
      { id: 'windmill', type: 'windmill', x: 380, y: GROUND_Y },
      { id: 'lamp-1', type: 'lamp', x: 210, y: GROUND_Y },
      { id: 'lamp-2', type: 'lamp', x: 1010, y: GROUND_Y },
      { id: 'lamp-3', type: 'lamp', x: 1760, y: GROUND_Y },
      { id: 'gear-1', type: 'gear', x: 720, y: GROUND_Y },
      { id: 'gear-2', type: 'gear', x: 1510, y: 372 },
      { id: 'gear-3', type: 'gear', x: 2060, y: GROUND_Y },
      { id: 'hearth', type: 'hearth', x: 2100, y: GROUND_Y },
      { id: 'crate-1', type: 'crate', x: 1180, y: GROUND_Y },
      { id: 'crate-2', type: 'crate', x: 1300, y: GROUND_Y },
      { id: 'crate-3', type: 'crate', x: 1420, y: GROUND_Y },
      { id: 'toy-1', type: 'toy', x: 300, y: 430 },
      { id: 'toy-2', type: 'toy', x: 2390, y: GROUND_Y },
      { id: 'toy-3', type: 'toy', x: 1970, y: 440 },
      { id: 'house-1', type: 'house', x: 120, y: GROUND_Y, variant: 0 },
      { id: 'house-2', type: 'house', x: 560, y: GROUND_Y, variant: 1 },
      { id: 'house-3', type: 'house', x: 900, y: GROUND_Y, variant: 2 },
      { id: 'house-4', type: 'house', x: 1620, y: GROUND_Y, variant: 0 },
      { id: 'tree-1', type: 'tree', x: 680, y: GROUND_Y, variant: 0 },
      { id: 'tree-2', type: 'tree', x: 1260, y: GROUND_Y, variant: 1 },
      { id: 'tree-3', type: 'tree', x: 1900, y: GROUND_Y, variant: 0 },
      { id: 'hay-1', type: 'haystack', x: 830, y: GROUND_Y },
      { id: 'bush-1', type: 'bush', x: 1000, y: GROUND_Y },
      { id: 'bush-2', type: 'bush', x: 2210, y: GROUND_Y },
      { id: 'npc-1', type: 'npc', x: 520, y: GROUND_Y, label: 'Chutki', color: '#ff9ecb' },
      { id: 'npc-2', type: 'npc', x: 1230, y: GROUND_Y, label: 'Raju', color: '#7fd6a0' },
      { id: 'npc-3', type: 'npc', x: 1880, y: GROUND_Y, label: 'Nobita', color: '#ffd166' },
      { id: 'sign-1', type: 'sign', x: 2530, y: GROUND_Y, label: 'Magical Forest →' },
    ],
  },
  {
    id: 'forest',
    name: 'Magical Forest',
    blurb: 'Glowing mushrooms, floating stones and a garden waiting to bloom.',
    index: 1,
    x: ZONE_WIDTH,
    width: ZONE_WIDTH,
    playable: true,
    palette: {
      skyTop: '#4fd1c5',
      skyBottom: '#e8fff6',
      far: '#3f9a7a',
      mid: '#2c7a5f',
      groundTop: '#63d18f',
      groundBody: '#5c4026',
      accent: '#b48cff',
    },
    spawn: { x: ZONE_WIDTH + 140, y: 520 },
    ground: [
      { x: ZONE_WIDTH - 60, w: 1900, y: GROUND_Y },
      { x: ZONE_WIDTH + 1980, w: 700, y: GROUND_Y },
    ],
    platforms: [
      { x: ZONE_WIDTH + 260, y: 430, w: 190 },
      { x: ZONE_WIDTH + 560, y: 350, w: 160 },
      { x: ZONE_WIDTH + 900, y: 430, w: 210 },
      { x: ZONE_WIDTH + 1500, y: 400, w: 200 },
      { x: ZONE_WIDTH + 1760, y: 320, w: 170 },
    ],
    water: [{ id: 'gully', x: ZONE_WIDTH + 1840, w: 140 }],
    anchors: [],
    weather: 'fireflies',
    things: [
      { id: 'flower-1', type: 'flowerBed', x: ZONE_WIDTH + 340, y: GROUND_Y },
      { id: 'flower-2', type: 'flowerBed', x: ZONE_WIDTH + 1080, y: GROUND_Y },
      { id: 'flower-3', type: 'flowerBed', x: ZONE_WIDTH + 2160, y: GROUND_Y },
      { id: 'tree-1', type: 'tree', x: ZONE_WIDTH + 120, y: GROUND_Y, variant: 1 },
      { id: 'tree-2', type: 'tree', x: ZONE_WIDTH + 760, y: GROUND_Y, variant: 0 },
      { id: 'tree-3', type: 'tree', x: ZONE_WIDTH + 1420, y: GROUND_Y, variant: 1 },
      { id: 'tree-4', type: 'tree', x: ZONE_WIDTH + 2020, y: GROUND_Y, variant: 0 },
      { id: 'tree-5', type: 'tree', x: ZONE_WIDTH + 2380, y: GROUND_Y, variant: 1 },
      { id: 'mush-1', type: 'mushroom', x: ZONE_WIDTH + 430, y: GROUND_Y },
      { id: 'mush-2', type: 'mushroom', x: ZONE_WIDTH + 1620, y: GROUND_Y },
      { id: 'mush-3', type: 'mushroom', x: ZONE_WIDTH + 2260, y: GROUND_Y },
      { id: 'rock-1', type: 'rock', x: ZONE_WIDTH + 1240, y: GROUND_Y },
      { id: 'bush-1', type: 'bush', x: ZONE_WIDTH + 620, y: GROUND_Y },
      { id: 'bush-2', type: 'bush', x: ZONE_WIDTH + 1920, y: GROUND_Y },
      { id: 'npc-1', type: 'npc', x: ZONE_WIDTH + 880, y: GROUND_Y, label: 'Jaggu', color: '#d9a05a' },
      { id: 'npc-2', type: 'npc', x: ZONE_WIDTH + 1880, y: GROUND_Y, label: 'Tinker', color: '#b8ff9f' },
      { id: 'sign-1', type: 'sign', x: ZONE_WIDTH + 70, y: GROUND_Y, label: '← Village' },
      { id: 'sign-2', type: 'sign', x: ZONE_WIDTH + 2510, y: GROUND_Y, label: 'Frozen Kingdom →' },
    ],
  },
  {
    id: 'frozen',
    name: 'Frozen Kingdom',
    blurb: 'A frozen river, a snowy castle and a generator that must be saved.',
    index: 2,
    x: ZONE_WIDTH * 2,
    width: ZONE_WIDTH,
    playable: true,
    palette: {
      skyTop: '#2b3f7a',
      skyBottom: '#bfe8ff',
      far: '#cfe6ff',
      mid: '#9fc0e0',
      groundTop: '#ffffff',
      groundBody: '#b9cde2',
      accent: '#8fd0ff',
    },
    spawn: { x: ZONE_WIDTH * 2 + 140, y: 520 },
    ground: [
      { x: ZONE_WIDTH * 2 - 60, w: 720, y: GROUND_Y },
      { x: ZONE_WIDTH * 2 + 900, w: 480, y: GROUND_Y },
      { x: ZONE_WIDTH * 2 + 1580, w: 320, y: GROUND_Y },
      { x: ZONE_WIDTH * 2 + 2140, w: 480, y: GROUND_Y },
    ],
    platforms: [
      { x: ZONE_WIDTH * 2 + 300, y: 430, w: 170 },
      { x: ZONE_WIDTH * 2 + 980, y: 420, w: 180 },
      { x: ZONE_WIDTH * 2 + 1320, y: 360, w: 180 },
      { x: ZONE_WIDTH * 2 + 1740, y: 430, w: 170 },
      { x: ZONE_WIDTH * 2 + 1900, y: 330, w: 190 },
      { x: ZONE_WIDTH * 2 + 2200, y: 340, w: 180 },
    ],
    water: [
      { id: 'gap-1', x: ZONE_WIDTH * 2 + 660, w: 240 },
      { id: 'gap-2', x: ZONE_WIDTH * 2 + 1380, w: 200 },
      { id: 'gap-3', x: ZONE_WIDTH * 2 + 1900, w: 240 },
    ],
    anchors: [
      { x: ZONE_WIDTH * 2 + 1980, y: 220 },
      { x: ZONE_WIDTH * 2 + 2280, y: 240 },
    ],
    weather: 'snow',
    things: [
      { id: 'gen', type: 'generator', x: ZONE_WIDTH * 2 + 1660, y: GROUND_Y },
      { id: 'part-1', type: 'part', x: ZONE_WIDTH * 2 + 470, y: GROUND_Y },
      { id: 'part-2', type: 'part', x: ZONE_WIDTH * 2 + 1020, y: 420 },
      { id: 'part-3', type: 'part', x: ZONE_WIDTH * 2 + 1360, y: 360 },
      { id: 'stuck-1', type: 'villager', x: ZONE_WIDTH * 2 + 1960, y: 330 },
      { id: 'stuck-2', type: 'villager', x: ZONE_WIDTH * 2 + 2260, y: 340 },
      { id: 'castle', type: 'castle', x: ZONE_WIDTH * 2 + 2520, y: GROUND_Y },
      { id: 'tree-1', type: 'tree', x: ZONE_WIDTH * 2 + 180, y: GROUND_Y, variant: 2 },
      { id: 'tree-2', type: 'tree', x: ZONE_WIDTH * 2 + 1120, y: GROUND_Y, variant: 2 },
      { id: 'tree-3', type: 'tree', x: ZONE_WIDTH * 2 + 1740, y: GROUND_Y, variant: 2 },
      { id: 'rock-1', type: 'rock', x: ZONE_WIDTH * 2 + 300, y: GROUND_Y },
      { id: 'rock-2', type: 'rock', x: ZONE_WIDTH * 2 + 1300, y: GROUND_Y },
      { id: 'npc-1', type: 'npc', x: ZONE_WIDTH * 2 + 560, y: GROUND_Y, label: 'Anna', color: '#ffb3a7' },
      { id: 'npc-2', type: 'npc', x: ZONE_WIDTH * 2 + 2300, y: GROUND_Y, label: 'Olaf', color: '#eaf6ff' },
      { id: 'sign-1', type: 'sign', x: ZONE_WIDTH * 2 + 60, y: GROUND_Y, label: '← Forest' },
    ],
  },
];

export const zoneById = (id: ZoneId) => ZONES.find((z) => z.id === id);
export const zoneAt = (x: number) => ZONES.find((z) => x >= z.x && x < z.x + z.width) ?? ZONES[0];

/** Zones that exist in this build. Everything else is a preview on the world screen. */
export const PREVIEW_ZONES: { id: ZoneId; name: string; emoji: string; note: string }[] = [
  { id: 'pokemon', name: 'Pokémon Forest', emoji: '⚡', note: 'Pikachu is waiting inside Magical Forest' },
  { id: 'city', name: 'Superhero City', emoji: '🌆', note: 'Swinging in soon' },
  { id: 'lab', name: 'Future Laboratory', emoji: '🔬', note: 'Iron Man is building it' },
  { id: 'mountain', name: 'Mountain Village', emoji: '⛰️', note: 'Snowed in for now' },
  { id: 'castle', name: 'Magical Castle', emoji: '🏰', note: 'Gala preparations underway' },
  { id: 'ocean', name: 'Ocean World', emoji: '🌊', note: 'Diving in soon' },
];
