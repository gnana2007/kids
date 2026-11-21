import type { CharacterId, ZoneId } from './characters';

export interface MissionDef {
  id: string;
  character: CharacterId;
  zone: ZoneId;
  title: string;
  blurb: string;
  goal: string;
  /** World flag set when finished */
  flag: string;
  objective: { label: string; total: number; verb: string };
  reward: string;
}

export const MISSIONS: MissionDef[] = [
  {
    id: 'm-windmill',
    character: 'doraemon',
    zone: 'village',
    title: "The Windmill's Gears",
    blurb: 'The village windmill has lost its gears and the bread oven is cold.',
    goal: 'Pull all three iron gears to the windmill with the magnet, then fit them in.',
    flag: 'windmill',
    objective: { label: 'Gears found', total: 3, verb: 'Magnet the gear' },
    reward: 'The windmill spins and fresh bread fills the square.',
  },
  {
    id: 'm-lamps',
    character: 'pikachu',
    zone: 'village',
    title: 'Lights of Village Square',
    blurb: "A sleepy cloud stole the power from the village lamps.",
    goal: 'Stand near each lamp post and zap it with Thunder.',
    flag: 'lamps',
    objective: { label: 'Lamps lit', total: 3, verb: 'Zap the lamp' },
    reward: 'Warm golden light spreads across the whole square.',
  },
  {
    id: 'm-toys',
    character: 'shinchan',
    zone: 'village',
    title: 'The Missing Toys',
    blurb: 'Shinchan hid the playground toys — and now he cannot find them.',
    goal: 'Search the village and pick up the three lost toys.',
    flag: 'toys',
    objective: { label: 'Toys found', total: 3, verb: 'Pick up the toy' },
    reward: 'The playground is noisy and happy again.',
  },
  {
    id: 'm-firewood',
    character: 'bheem',
    zone: 'village',
    title: 'Firewood for the Hearth',
    blurb: 'The village hearth is cold and the evening is chilly.',
    goal: 'Lift the three wood crates and carry them to the hearth.',
    flag: 'firewood',
    objective: { label: 'Crates delivered', total: 3, verb: 'Carry to the hearth' },
    reward: 'A crackling fire warms every cottage in the village.',
  },
  {
    id: 'm-garden',
    character: 'barbie',
    zone: 'forest',
    title: 'Bloom the Whisper Garden',
    blurb: 'The forest garden beds are empty and the bees have nowhere to go.',
    goal: 'Find the three empty garden beds and plant a flower in each.',
    flag: 'garden',
    objective: { label: 'Flowers planted', total: 3, verb: 'Plant the flower' },
    reward: 'The forest glows with colour and humming bees.',
  },
  {
    id: 'm-icebridge',
    character: 'elsa',
    zone: 'frozen',
    title: 'Bridge of Ice',
    blurb: 'The river has split the Frozen Kingdom in two.',
    goal: 'Freeze the three river stretches into a solid ice bridge.',
    flag: 'icebridge',
    objective: { label: 'Ice bridges made', total: 3, verb: 'Freeze the water' },
    reward: 'A glittering ice road now joins the whole kingdom.',
  },
  {
    id: 'm-rescue',
    character: 'spiderman',
    zone: 'frozen',
    title: 'Snowbound Friends',
    blurb: 'Two villagers are stuck on the high snowy ledges.',
    goal: 'Web-swing up to the ledges and help both villagers down.',
    flag: 'rescued',
    objective: { label: 'Villagers rescued', total: 2, verb: 'Rescue the villager' },
    reward: 'Everybody is safe by the castle fire.',
  },
  {
    id: 'm-generator',
    character: 'ironman',
    zone: 'frozen',
    title: 'The Frozen Generator',
    blurb: 'The kingdom generator is cracked and dark.',
    goal: 'Collect the three machine parts, then repair the generator.',
    flag: 'generator',
    objective: { label: 'Parts recovered', total: 3, verb: 'Collect the part' },
    reward: 'Lights glow across the castle and the snow melts from the roofs.',
  },
];

export const missionFor = (characterId: string) => MISSIONS.find((m) => m.character === characterId);
export const missionById = (id: string) => MISSIONS.find((m) => m.id === id);
export const missionsInZone = (zone: ZoneId) => MISSIONS.filter((m) => m.zone === zone);
