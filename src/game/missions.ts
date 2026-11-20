import type { Location, Mission } from './types';

export const locations: Location[] = [
  { id: 'village', name: 'Sunny Village', emoji: '🏘️', blurb: 'Cozy cottages, a big bell and the busiest bakery on the island.', x: 33, y: 68 },
  { id: 'forest', name: 'Whisper Forest', emoji: '🌳', blurb: 'Glowing mushrooms and friendly creatures between the tall trees.', x: 15, y: 36 },
  { id: 'river', name: 'Frozen River', emoji: '🌊', blurb: 'The river that carries magic from the mountain to the sea.', x: 53, y: 74 },
  { id: 'lab', name: 'Spark Lab', emoji: '🔬', blurb: 'Wires, gears and inventions that beep and whirr all night.', x: 79, y: 57 },
  { id: 'mountain', name: 'Cloud Peak', emoji: '⛰️', blurb: 'Snowy peaks where the wind sings and dragons glide past.', x: 85, y: 24 },
  { id: 'castle', name: 'Storybook Castle', emoji: '🏰', blurb: 'The heart of CharacterVerse, full of books, balls and wonder.', x: 49, y: 34 },
  { id: 'city', name: 'Lantern City', emoji: '🌆', blurb: 'Tall towers, tiny trams and a market that never sleeps.', x: 68, y: 84 },
];

export const locationById = (id: string) => locations.find((l) => l.id === id);

export const missions: Mission[] = [
  // ───────────────────── Chapter 1 ─────────────────────
  {
    id: 'm-elsa',
    characterId: 'elsa',
    title: 'The Frozen River',
    tagline: 'Freeze a safe path over the stormy water',
    location: 'river',
    chapter: 1,
    next: 'm-doraemon',
    story: [
      'A wild storm burst the riverbanks of CharacterVerse and swept the old bridge away.',
      'Now the village is cut off and the water is too wild to wade through.',
      'Elsa can calm the river. Tap the water to freeze sparkling stepping stones of ice.',
    ],
    goal: 'Freeze an unbroken path of ice from the west bank to the east bank.',
    learn: 'Water turns into solid ice when it gets very cold — and thick ice is strong enough to hold you.',
    badge: { id: 'b-ice', name: 'Ice Pathfinder', emoji: '❄️' },
    worldFlag: 'river-frozen',
    game: {
      kind: 'path',
      intro: 'Tap water tiles to freeze them. Rocks cannot be frozen — find a way around them!',
      cols: 6,
      rows: 5,
      rocks: ['2,0', '1,0', '3,1', '3,2', '1,3', '3,4'],
      start: [0, 2],
      end: [5, 2],
      hint: 'Start at the glowing ice on the left, then freeze tiles that touch each other all the way to the flag.',
    },
  },

  // ───────────────────── Chapter 2 ─────────────────────
  {
    id: 'm-doraemon',
    characterId: 'doraemon',
    title: 'The Gadget Rescue',
    tagline: 'Pick the right gadget for every job',
    location: 'village',
    chapter: 2,
    prereq: 'm-elsa',
    next: 'm-spiderman',
    story: [
      'Elsa’s ice path is ready — but the storm dropped heavy iron planks into the river.',
      'Doraemon opens his pocket. So many gadgets! Which one solves each problem?',
      'Think about the job, then pick the gadget that fits it best.',
    ],
    goal: 'Use four gadgets to clear the riverside and help the builders.',
    learn: 'Engineers pick tools by asking “what does this job need?” — lift, light, grip or travel.',
    badge: { id: 'b-gadget', name: 'Gadget Genius', emoji: '🔧' },
    worldFlag: 'supply-crane',
    game: {
      kind: 'choice',
      intro: 'Every gadget does one special job. Choose carefully!',
      rounds: [
        {
          prompt: 'Heavy iron planks are lying at the bottom of the river. Which gadget grabs them?',
          scene: '🌉💧',
          options: [
            { id: 'a', emoji: '🧲', label: 'Big Magnet', note: 'Pulls iron toward it' },
            { id: 'b', emoji: '🎈', label: 'Balloon Bundle', note: 'Floats upward' },
            { id: 'c', emoji: '🍦', label: 'Ice Cream Maker', note: 'Makes cold treats' },
          ],
          answer: 'a',
          success: 'The giant magnet snaps onto the iron planks and lifts them out of the water!',
        },
        {
          prompt: 'The sun has gone down and the builders cannot see. Which gadget helps?',
          scene: '🌙🏗️',
          options: [
            { id: 'a', emoji: '🌂', label: 'Umbrella Hat', note: 'Keeps rain off' },
            { id: 'b', emoji: '🔦', label: 'Torch Beam', note: 'Makes bright light' },
            { id: 'c', emoji: '🥁', label: 'Drum Kit', note: 'Makes loud sound' },
          ],
          answer: 'b',
          success: 'A warm beam of light turns the riverside bright as day!',
        },
        {
          prompt: 'A long roof beam must be lifted high into the air. Which gadget does that?',
          scene: '🏠⬆️',
          options: [
            { id: 'a', emoji: '🎣', label: 'Fishing Rod', note: 'Long and thin' },
            { id: 'b', emoji: '🚁', label: 'Bamboo Copter', note: 'Spins and flies' },
            { id: 'c', emoji: '🪃', label: 'Boomerang', note: 'Comes back to you' },
          ],
          answer: 'b',
          success: 'The spinning blades push air down, so the beam floats up — just like a helicopter!',
        },
        {
          prompt: 'Everyone must reach the village in one second. Which gadget is fastest?',
          scene: '🚀🏘️',
          options: [
            { id: 'a', emoji: '🖼️', label: 'Picture Frame', note: 'Shows a picture' },
            { id: 'b', emoji: '🪟', label: 'Glass Window', note: 'Lets light through' },
            { id: 'c', emoji: '🚪', label: 'Anywhere Door', note: 'Opens somewhere else' },
          ],
          answer: 'c',
          success: 'One step through the Anywhere Door and the whole team is home!',
        },
      ],
    },
  },

  // ───────────────────── Chapter 3 ─────────────────────
  {
    id: 'm-spiderman',
    characterId: 'spiderman',
    title: 'Web Bridge Across the Gorge',
    tagline: 'Choose strong anchor points for a spider web bridge',
    location: 'river',
    chapter: 3,
    prereq: 'm-doraemon',
    next: 'm-ironman',
    story: [
      'The ice stepping stones help people on foot — but the supply carts need a real bridge.',
      'Spider-Man can spin one out of webs, if he finds strong places to tie them.',
      'Tap only the strong steel bolts, in order from the west bank to the east bank.',
    ],
    goal: 'Anchor four web lines on solid bolts to build a bridge.',
    learn: 'A bridge stays up when both ends are tied to something strong and steady — anchors matter more than length.',
    badge: { id: 'b-web', name: 'Web Weaver', emoji: '🕸️' },
    worldFlag: 'web-bridge',
    game: {
      kind: 'web',
      intro: 'Loose bricks and cracked stones will snap. Look for bolted steel.',
      anchors: [
        { id: 'a1', label: 'West Ledge Bolt', x: 14, y: 52 },
        { id: 'a2', label: 'Loose Brick', x: 30, y: 74, weak: true },
        { id: 'a3', label: 'Steel Bolt', x: 39, y: 44 },
        { id: 'a4', label: 'Cracked Stone', x: 53, y: 70, weak: true },
        { id: 'a5', label: 'Steel Bolt', x: 64, y: 38 },
        { id: 'a6', label: 'East Ledge Bolt', x: 86, y: 50 },
      ],
      order: ['a1', 'a3', 'a5', 'a6'],
    },
  },

  // ───────────────────── Chapter 4 ─────────────────────
  {
    id: 'm-ironman',
    characterId: 'ironman',
    title: 'Power Up the Village',
    tagline: 'Assemble Iron Man’s machine part by part',
    location: 'lab',
    chapter: 4,
    prereq: 'm-spiderman',
    next: 'm-bheem',
    story: [
      'The web bridge is holding! But the village generator is still dark and cold.',
      'Iron Man has a machine that can power every lamp on the island — it just needs building.',
      'Drag each part into the slot where it belongs. Watch out for silly parts!',
    ],
    goal: 'Fit four correct parts into Iron Man’s power machine.',
    learn: 'A machine works when every part does its own job: the core makes power, the chip controls it, the armour protects it.',
    badge: { id: 'b-power', name: 'Power Engineer', emoji: '⚡' },
    worldFlag: 'power-restored',
    game: {
      kind: 'match',
      intro: 'Tap a part, then tap the slot — or drag it across.',
      slots: [
        { id: 'core', label: 'Power Core', emoji: '🔆', accepts: 'p-core', hint: 'Makes the energy' },
        { id: 'chip', label: 'Control Chip', emoji: '🧩', accepts: 'p-chip', hint: 'Tells the machine what to do' },
        { id: 'armor', label: 'Armour Plate', emoji: '🛡️', accepts: 'p-armor', hint: 'Keeps it safe' },
        { id: 'glove', label: 'Repulsor Glove', emoji: '🖐️', accepts: 'p-glove', hint: 'Shoots a beam' },
      ],
      parts: [
        { id: 'p-core', emoji: '💠', label: 'Glowing Core', slotId: 'core' },
        { id: 'p-chip', emoji: '🧠', label: 'Smart Chip', slotId: 'chip' },
        { id: 'p-armor', emoji: '🥏', label: 'Metal Plate', slotId: 'armor' },
        { id: 'p-glove', emoji: '🧤', label: 'Power Glove', slotId: 'glove' },
        { id: 'x1', emoji: '🍌', label: 'Banana' },
        { id: 'x2', emoji: '🧦', label: 'Sock' },
      ],
      poweredBy: 'The Power Core hums, the chip blinks green and every lamp in CharacterVerse switches on!',
    },
  },

  // ───────────────────── Chapter 5 ─────────────────────
  {
    id: 'm-bheem',
    characterId: 'bheem',
    title: 'The Village Rescue',
    tagline: 'Carry the right supplies to every villager',
    location: 'village',
    chapter: 5,
    prereq: 'm-ironman',
    story: [
      'The lights are on and the bridge is fixed. Now the villagers need help!',
      'Chhota Bheem’s cart is full of supplies, and he needs a helper with a plan.',
      'Match each supply to the right place in the village.',
    ],
    goal: 'Deliver four supplies to the right village spots.',
    learn: 'Big rescues work best as a team with a plan: repair first, then feed, water and care for everyone.',
    badge: { id: 'b-hero', name: 'Village Hero', emoji: '🏅' },
    worldFlag: 'villagers-safe',
    game: {
      kind: 'match',
      intro: 'Tap a supply, then tap the village spot that needs it.',
      slots: [
        { id: 'roof', label: 'Broken Roof', emoji: '🏚️', accepts: 's-hammer', hint: 'Needs fixing' },
        { id: 'pot', label: 'Empty Kitchen', emoji: '🍲', accepts: 's-rice', hint: 'Needs food' },
        { id: 'well', label: 'Dry Well', emoji: '🪣', accepts: 's-water', hint: 'Needs water' },
        { id: 'clinic', label: 'Village Clinic', emoji: '💉', accepts: 's-med', hint: 'Needs medicine' },
      ],
      parts: [
        { id: 's-hammer', emoji: '🔨', label: 'Hammer & Nails', slotId: 'roof' },
        { id: 's-rice', emoji: '🍚', label: 'Rice Pot', slotId: 'pot' },
        { id: 's-water', emoji: '🪣', label: 'Full Bucket', slotId: 'well' },
        { id: 's-med', emoji: '💊', label: 'Herbal Medicine', slotId: 'clinic' },
        { id: 'x1', emoji: '⚽', label: 'Football' },
        { id: 'x2', emoji: '🌸', label: 'Flower' },
      ],
      poweredBy: 'The roof is patched, food is cooking, water is flowing and everyone is well again!',
    },
  },

  // ───────────────────── Independent adventures ─────────────────────
  {
    id: 'm-pikachu',
    characterId: 'pikachu',
    title: 'Lights of Lightning Hill',
    tagline: 'Connect the circuit that brings the lamps back',
    location: 'lab',
    story: [
      'A sleepy cloud swallowed the lamps of Lightning Hill.',
      'Pikachu’s electricity can light them again, but the circuit must form a complete loop.',
      'Tap the parts in the order the electricity travels.',
    ],
    goal: 'Build a full circuit from the battery to the bulb, then test a material.',
    learn: 'Electricity needs a closed loop to flow, and metal lets it pass while rubber and wood block it.',
    badge: { id: 'b-spark', name: 'Circuit Spark', emoji: '🔌' },
    worldFlag: 'lightning-lights',
    game: {
      kind: 'circuit',
      intro: 'Follow the path the electricity takes: from the battery, through the wires, to the bulb.',
      nodes: [
        { id: 'battery', emoji: '🔋', label: 'Battery', x: 12, y: 72, hint: 'The energy starts here' },
        { id: 'wire', emoji: '🔌', label: 'Wire', x: 32, y: 72, hint: 'Carries the current' },
        { id: 'switch', emoji: '🔘', label: 'Switch', x: 50, y: 50, hint: 'Opens and closes the loop' },
        { id: 'coil', emoji: '🌀', label: 'Coil', x: 66, y: 28, hint: 'Makes the bulb glow' },
        { id: 'bulb', emoji: '💡', label: 'Bulb', x: 82, y: 28, hint: 'The light comes out here' },
      ],
      order: ['battery', 'wire', 'switch', 'coil', 'bulb'],
      bonus: {
        prompt: 'The lamps stay dark. Which material will let electricity flow through the wire?',
        options: [
          { id: 'a', emoji: '🥄', label: 'Metal Spoon', note: 'Shiny and hard' },
          { id: 'b', emoji: '🥢', label: 'Wooden Stick', note: 'From a tree' },
          { id: 'c', emoji: '🎈', label: 'Rubber Balloon', note: 'Stretchy' },
        ],
        answer: 'a',
        success: 'Metal is a conductor — it lets electricity zoom through. Wood and rubber are insulators!',
      },
    },
  },
  {
    id: 'm-shinchan',
    characterId: 'shinchan',
    title: 'The Pudding Mystery',
    tagline: 'Spot the clues and solve a silly case',
    location: 'city',
    story: [
      'Someone ate the last pudding in Lantern City. Mum is not happy.',
      'Shinchan has his detective hat on (sideways) and needs a sharp pair of eyes.',
      'Look carefully at each clue before you choose.',
    ],
    goal: 'Solve four little mysteries using clues and careful looking.',
    learn: 'Detectives find the one clue that fits the question — looking closely is a superpower.',
    badge: { id: 'b-detective', name: 'Little Detective', emoji: '🔍' },
    worldFlag: 'mystery-solved',
    game: {
      kind: 'choice',
      intro: 'Read the question, then tap the clue that answers it.',
      rounds: [
        {
          prompt: 'The pudding bowl is empty. Which clue shows that someone walked away with it?',
          scene: '🍮❓',
          options: [
            { id: 'a', emoji: '👣', label: 'Muddy Footprints', note: 'Someone was here' },
            { id: 'b', emoji: '📺', label: 'TV Remote', note: 'For watching' },
            { id: 'c', emoji: '🎵', label: 'Music Note', note: 'A sound' },
            { id: 'd', emoji: '🥄', label: 'Clean Spoon', note: 'Still in the drawer' },
          ],
          answer: 'a',
          success: 'Footprints! Small muddy ones, tip-toeing straight to the door.',
        },
        {
          prompt: 'Which food does NOT belong in a fruit basket?',
          scene: '🧺❓',
          options: [
            { id: 'a', emoji: '🍎', label: 'Apple' },
            { id: 'b', emoji: '🍕', label: 'Pizza' },
            { id: 'c', emoji: '🍌', label: 'Banana' },
            { id: 'd', emoji: '🍇', label: 'Grapes' },
          ],
          answer: 'b',
          success: 'Pizza is a snack, not a fruit. The others all grow on plants!',
        },
        {
          prompt: 'Something squeaked in the dark. Which tool helps a detective look for clues?',
          scene: '🌙🔦',
          options: [
            { id: 'a', emoji: '🍦', label: 'Ice Cream' },
            { id: 'b', emoji: '🛏️', label: 'Pillow' },
            { id: 'c', emoji: '🔦', label: 'Flashlight' },
            { id: 'd', emoji: '🎈', label: 'Balloon' },
          ],
          answer: 'c',
          success: 'A flashlight! And there is the squeaky toy under the sofa.',
        },
        {
          prompt: 'Only one shape fits the hole in the fence. Which one?',
          scene: '⭐🕳️',
          options: [
            { id: 'a', emoji: '⬛', label: 'Square' },
            { id: 'b', emoji: '🔺', label: 'Triangle' },
            { id: 'c', emoji: '⭐', label: 'Star' },
            { id: 'd', emoji: '🟢', label: 'Circle' },
          ],
          answer: 'c',
          success: 'The star-shaped hole needs a star-shaped piece. Shapes give us clues too!',
        },
      ],
    },
  },
  {
    id: 'm-barbie',
    characterId: 'barbie',
    title: 'Starlight Fashion Studio',
    tagline: 'Design a gala look with colours that sing',
    location: 'castle',
    story: [
      'The castle is hosting the Starlight Gala tonight and there is still one empty outfit stand.',
      'Barbie needs a designer with a brave eye for colour.',
      'Pick a dress, hair, accessory and shoes — then check how the colours work together.',
    ],
    goal: 'Complete a gala outfit and match the colours with care.',
    learn: 'Colours that sit near each other (like pink and purple) blend gently, and colours from opposite sides of the wheel pop.',
    badge: { id: 'b-colour', name: 'Colour Artist', emoji: '🎨' },
    worldFlag: 'studio-open',
    game: {
      kind: 'design',
      intro: 'There is no wrong look — every choice makes a new creation.',
      brief: 'Starlight Gala · Create one show-stopping look.',
      dresses: [
        { id: 'rose', name: 'Rose', hue: 340, color: '#ff7aa8' },
        { id: 'sky', name: 'Sky', hue: 200, color: '#5ec8ff' },
        { id: 'mint', name: 'Mint', hue: 155, color: '#5fe0b0' },
        { id: 'sun', name: 'Sun', hue: 45, color: '#ffd166' },
        { id: 'lilac', name: 'Lilac', hue: 280, color: '#b48cff' },
      ],
      hairs: [
        { id: 'raven', name: 'Raven', hue: 255, color: '#5b3f8f' },
        { id: 'gold', name: 'Gold', hue: 42, color: '#f4b860' },
        { id: 'rosegold', name: 'Rose Gold', hue: 10, color: '#ff9d8a' },
        { id: 'ocean', name: 'Ocean', hue: 195, color: '#59b6d6' },
      ],
      accessories: [
        { id: 'crown', name: 'Star Crown', emoji: '👑' },
        { id: 'wand', name: 'Star Wand', emoji: '🪄' },
        { id: 'flower', name: 'Flower Pin', emoji: '🌸' },
        { id: 'bow', name: 'Silk Bow', emoji: '🎀' },
      ],
      shoes: [
        { id: 'glass', name: 'Glass Slippers', emoji: '🩰' },
        { id: 'boots', name: 'Star Boots', emoji: '🥾' },
        { id: 'sneakers', name: 'Spark Sneakers', emoji: '👟' },
        { id: 'heels', name: 'Glitter Heels', emoji: '👠' },
      ],
    },
  },
];

export const missionById = (id: string) => missions.find((m) => m.id === id);
export const missionForCharacter = (characterId: string) => missions.find((m) => m.characterId === characterId);
export const storyMissions = missions
  .filter((m) => m.chapter)
  .sort((a, b) => (a.chapter ?? 0) - (b.chapter ?? 0));
export const MAX_STARS = missions.length * 3;
export const ISLAND_BADGE = { id: 'b-island', name: 'Island Guardian', emoji: '🌟' };
