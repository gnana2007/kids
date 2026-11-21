export type Category = 'cartoons' | 'pokemon' | 'heroes' | 'disney' | 'indian' | 'popular';
export type CharacterId =
  | 'doraemon'
  | 'pikachu'
  | 'elsa'
  | 'spiderman'
  | 'ironman'
  | 'shinchan'
  | 'barbie'
  | 'bheem';
export type ZoneId = 'village' | 'forest' | 'frozen' | 'lab' | 'city' | 'mountain' | 'castle' | 'ocean' | 'pokemon';

export interface CharacterDef {
  id: string;
  name: string;
  category: Category;
  /** Short ability name shown in UI */
  ability: string;
  /** One line describing the physical ability */
  hint: string;
  playable: boolean;
  /** Zone this character calls home (used for the world screen + spawn suggestions) */
  home: ZoneId;
}

export const categories: { id: Category; label: string; emoji: string; tint: string }[] = [
  { id: 'cartoons', label: 'Classic Cartoons', emoji: '📺', tint: '#ff9a9e' },
  { id: 'pokemon', label: 'Pokémon', emoji: '⚡', tint: '#ffd452' },
  { id: 'heroes', label: 'Superheroes', emoji: '🦸', tint: '#5aa9ff' },
  { id: 'disney', label: 'Disney & Fantasy', emoji: '🏰', tint: '#a78bfa' },
  { id: 'indian', label: 'Indian Cartoons', emoji: '🪔', tint: '#ffb86b' },
  { id: 'popular', label: 'More Toons & Games', emoji: '🌈', tint: '#4fd1c5' },
];

export const PLAYABLE: CharacterDef[] = [
  {
    id: 'doraemon',
    name: 'Doraemon',
    category: 'cartoons',
    ability: 'Gadget Pocket',
    hint: 'Magnet pulls metal gears · hold Jump to glide with the Bamboo Copter',
    playable: true,
    home: 'village',
  },
  {
    id: 'pikachu',
    name: 'Pikachu',
    category: 'pokemon',
    ability: 'Thunder Zap',
    hint: 'Charge lamps and machines with a bolt of electricity',
    playable: true,
    home: 'village',
  },
  {
    id: 'elsa',
    name: 'Elsa',
    category: 'disney',
    ability: 'Ice Magic',
    hint: 'Freeze river water into a solid ice bridge',
    playable: true,
    home: 'frozen',
  },
  {
    id: 'spiderman',
    name: 'Spider-Man',
    category: 'heroes',
    ability: 'Web Swing',
    hint: 'Grapple to glowing anchors and swing up high ledges',
    playable: true,
    home: 'frozen',
  },
  {
    id: 'ironman',
    name: 'Iron Man',
    category: 'heroes',
    ability: 'Jet Thrusters',
    hint: 'Hold Ability to fly · repair machines with collected parts',
    playable: true,
    home: 'frozen',
  },
  {
    id: 'shinchan',
    name: 'Shinchan',
    category: 'cartoons',
    ability: 'Silly Dance',
    hint: 'Find lost toys with E · dance to make everyone giggle',
    playable: true,
    home: 'village',
  },
  {
    id: 'barbie',
    name: 'Barbie',
    category: 'disney',
    ability: 'Style Switch',
    hint: 'Plant flowers with E · press Q to change the outfit',
    playable: true,
    home: 'forest',
  },
  {
    id: 'bheem',
    name: 'Chhota Bheem',
    category: 'indian',
    ability: 'Super Strength',
    hint: 'Lift crates with E and carry them to the village hearth',
    playable: true,
    home: 'village',
  },
];

/** Extra friends for the catalogue — visible with their story still to come. */
const COMING: Omit<CharacterDef, 'playable'>[] = [
  { id: 'nobita', name: 'Nobita', category: 'cartoons', ability: 'Quick Thinking', hint: '', home: 'village' },
  { id: 'shizuka', name: 'Shizuka', category: 'cartoons', ability: 'Kind Helper', hint: '', home: 'village' },
  { id: 'gian', name: 'Gian', category: 'cartoons', ability: 'Big Voice', hint: '', home: 'village' },
  { id: 'suneo', name: 'Suneo', category: 'cartoons', ability: 'Clever Trader', hint: '', home: 'village' },
  { id: 'himawari', name: 'Himawari', category: 'cartoons', ability: 'Shiny Things', hint: '', home: 'village' },
  { id: 'kazama', name: 'Kazama', category: 'cartoons', ability: 'Fact Finder', hint: '', home: 'village' },
  { id: 'heidi', name: 'Heidi', category: 'cartoons', ability: 'Mountain Guide', hint: '', home: 'mountain' },
  { id: 'peter', name: 'Peter', category: 'cartoons', ability: 'Goat Whisperer', hint: '', home: 'mountain' },
  { id: 'tom', name: 'Tom', category: 'cartoons', ability: 'Sneaky Pounce', hint: '', home: 'village' },
  { id: 'jerry', name: 'Jerry', category: 'cartoons', ability: 'Tiny Escape', hint: '', home: 'village' },
  { id: 'mickey', name: 'Mickey Mouse', category: 'cartoons', ability: 'Magic Conductor', hint: '', home: 'castle' },
  { id: 'minnie', name: 'Minnie Mouse', category: 'cartoons', ability: 'Style Sparkle', hint: '', home: 'castle' },
  { id: 'ash', name: 'Ash', category: 'pokemon', ability: 'Never Give Up', hint: '', home: 'pokemon' },
  { id: 'eevee', name: 'Eevee', category: 'pokemon', ability: 'Many Evolutions', hint: '', home: 'pokemon' },
  { id: 'charizard', name: 'Charizard', category: 'pokemon', ability: 'Blazing Wings', hint: '', home: 'pokemon' },
  { id: 'bulbasaur', name: 'Bulbasaur', category: 'pokemon', ability: 'Vine Growth', hint: '', home: 'pokemon' },
  { id: 'squirtle', name: 'Squirtle', category: 'pokemon', ability: 'Water Spray', hint: '', home: 'pokemon' },
  { id: 'jigglypuff', name: 'Jigglypuff', category: 'pokemon', ability: 'Sleepy Song', hint: '', home: 'pokemon' },
  { id: 'snorlax', name: 'Snorlax', category: 'pokemon', ability: 'Giant Nap', hint: '', home: 'pokemon' },
  { id: 'meowth', name: 'Meowth', category: 'pokemon', ability: 'Coin Charm', hint: '', home: 'pokemon' },
  { id: 'mewtwo', name: 'Mewtwo', category: 'pokemon', ability: 'Mind Power', hint: '', home: 'pokemon' },
  { id: 'lucario', name: 'Lucario', category: 'pokemon', ability: 'Aura Sense', hint: '', home: 'pokemon' },
  { id: 'greninja', name: 'Greninja', category: 'pokemon', ability: 'Swift Ninja', hint: '', home: 'pokemon' },
  { id: 'hulk', name: 'Hulk', category: 'heroes', ability: 'Mega Strength', hint: '', home: 'city' },
  { id: 'thor', name: 'Thor', category: 'heroes', ability: 'Thunder Strike', hint: '', home: 'castle' },
  { id: 'cap', name: 'Captain America', category: 'heroes', ability: 'Shield Guard', hint: '', home: 'city' },
  { id: 'blackpanther', name: 'Black Panther', category: 'heroes', ability: 'Silent Speed', hint: '', home: 'forest' },
  { id: 'batman', name: 'Batman', category: 'heroes', ability: 'Detective Mind', hint: '', home: 'city' },
  { id: 'superman', name: 'Superman', category: 'heroes', ability: 'Sky Flight', hint: '', home: 'city' },
  { id: 'wonderwoman', name: 'Wonder Woman', category: 'heroes', ability: 'Truth Lasso', hint: '', home: 'castle' },
  { id: 'ben10', name: 'Ben 10', category: 'heroes', ability: 'Alien Switch', hint: '', home: 'lab' },
  { id: 'anna', name: 'Anna', category: 'disney', ability: 'Fearless Heart', hint: '', home: 'frozen' },
  { id: 'olaf', name: 'Olaf', category: 'disney', ability: 'Warm Hugs', hint: '', home: 'frozen' },
  { id: 'moana', name: 'Moana', category: 'disney', ability: 'Ocean Navigator', hint: '', home: 'ocean' },
  { id: 'rapunzel', name: 'Rapunzel', category: 'disney', ability: 'Glowing Hair', hint: '', home: 'castle' },
  { id: 'cinderella', name: 'Cinderella', category: 'disney', ability: 'Dance Grace', hint: '', home: 'castle' },
  { id: 'ariel', name: 'Ariel', category: 'disney', ability: 'Sea Song', hint: '', home: 'ocean' },
  { id: 'tinkerbell', name: 'Tinker Bell', category: 'disney', ability: 'Pixie Dust', hint: '', home: 'forest' },
  { id: 'simba', name: 'Simba', category: 'disney', ability: 'Brave Roar', hint: '', home: 'mountain' },
  { id: 'toothless', name: 'Toothless', category: 'disney', ability: 'Night Flight', hint: '', home: 'mountain' },
  { id: 'hiccup', name: 'Hiccup', category: 'disney', ability: 'Dragon Trainer', hint: '', home: 'mountain' },
  { id: 'harry', name: 'Harry Potter', category: 'disney', ability: 'Spellcasting', hint: '', home: 'castle' },
  { id: 'hermione', name: 'Hermione', category: 'disney', ability: 'Book Genius', hint: '', home: 'castle' },
  { id: 'chutki', name: 'Chutki', category: 'indian', ability: 'Flower Charm', hint: '', home: 'village' },
  { id: 'raju', name: 'Raju', category: 'indian', ability: 'Fast Runner', hint: '', home: 'village' },
  { id: 'jaggu', name: 'Jaggu', category: 'indian', ability: 'Tree Swings', hint: '', home: 'forest' },
  { id: 'motu', name: 'Motu', category: 'indian', ability: 'Big Appetite', hint: '', home: 'village' },
  { id: 'patlu', name: 'Patlu', category: 'indian', ability: 'Clever Plans', hint: '', home: 'village' },
  { id: 'shiva', name: 'Shiva', category: 'indian', ability: 'Daring Stunts', hint: '', home: 'city' },
  { id: 'hattori', name: 'Ninja Hattori', category: 'indian', ability: 'Ninja Moves', hint: '', home: 'forest' },
  { id: 'kenichi', name: 'Kenichi', category: 'indian', ability: 'Lucky Guess', hint: '', home: 'village' },
  { id: 'singham', name: 'Little Singham', category: 'indian', ability: 'Justice Charge', hint: '', home: 'city' },
  { id: 'mightyraju', name: 'Mighty Raju', category: 'indian', ability: 'Super Speed', hint: '', home: 'city' },
  { id: 'tenali', name: 'Tenali Rama', category: 'indian', ability: 'Witty Riddles', hint: '', home: 'castle' },
  { id: 'roll21', name: 'Roll No. 21', category: 'indian', ability: 'Classroom Capers', hint: '', home: 'city' },
  { id: 'bluey', name: 'Bluey', category: 'popular', ability: 'Play Ideas', hint: '', home: 'village' },
  { id: 'bingo', name: 'Bingo', category: 'popular', ability: 'Little Giggles', hint: '', home: 'village' },
  { id: 'peppa', name: 'Peppa Pig', category: 'popular', ability: 'Puddle Jump', hint: '', home: 'village' },
  { id: 'george', name: 'George', category: 'popular', ability: 'Dino Roar', hint: '', home: 'village' },
  { id: 'spongebob', name: 'SpongeBob', category: 'popular', ability: 'Bubble Blowing', hint: '', home: 'ocean' },
  { id: 'patrick', name: 'Patrick', category: 'popular', ability: 'Silly Ideas', hint: '', home: 'ocean' },
  { id: 'chase', name: 'Chase', category: 'popular', ability: 'Sniff & Solve', hint: '', home: 'city' },
  { id: 'marshall', name: 'Marshall', category: 'popular', ability: 'Fire Rescue', hint: '', home: 'village' },
  { id: 'skye', name: 'Skye', category: 'popular', ability: 'Sky Rescue', hint: '', home: 'mountain' },
  { id: 'kevin', name: 'Kevin', category: 'popular', ability: 'Banana Plans', hint: '', home: 'lab' },
  { id: 'stuart', name: 'Stuart', category: 'popular', ability: 'Rock Star', hint: '', home: 'lab' },
  { id: 'bob', name: 'Bob', category: 'popular', ability: 'Teddy Hugs', hint: '', home: 'lab' },
  { id: 'sonic', name: 'Sonic', category: 'popular', ability: 'Sonic Speed', hint: '', home: 'mountain' },
  { id: 'tails', name: 'Tails', category: 'popular', ability: 'Flying Tails', hint: '', home: 'mountain' },
  { id: 'mario', name: 'Mario', category: 'popular', ability: 'Jump Master', hint: '', home: 'city' },
  { id: 'luigi', name: 'Luigi', category: 'popular', ability: 'Ghost Courage', hint: '', home: 'city' },
  { id: 'yoshi', name: 'Yoshi', category: 'popular', ability: 'Egg Toss', hint: '', home: 'forest' },
  { id: 'po', name: 'Po', category: 'popular', ability: 'Kung Fu Kick', hint: '', home: 'mountain' },
  { id: 'naruto', name: 'Naruto', category: 'popular', ability: 'Shadow Clones', hint: '', home: 'forest' },
  { id: 'goku', name: 'Goku', category: 'popular', ability: 'Energy Blast', hint: '', home: 'mountain' },
  { id: 'luffy', name: 'Luffy', category: 'popular', ability: 'Stretchy Arms', hint: '', home: 'ocean' },
  { id: 'hellokitty', name: 'Hello Kitty', category: 'popular', ability: 'Friendship Bow', hint: '', home: 'castle' },
  { id: 'finn', name: 'Finn', category: 'popular', ability: 'Hero Heart', hint: '', home: 'forest' },
];

export const ALL_CHARACTERS: CharacterDef[] = [
  ...PLAYABLE,
  ...COMING.map((c) => ({ ...c, playable: false })),
];

export const characterById = (id: string) => ALL_CHARACTERS.find((c) => c.id === id);
export const playableById = (id: string) => PLAYABLE.find((c) => c.id === id);
