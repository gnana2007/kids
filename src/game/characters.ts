export type CategoryId = 'cartoons' | 'pokemon' | 'heroes' | 'disney' | 'indian' | 'popular';

export interface Character {
  id: string;
  name: string;
  category: CategoryId;
  emoji: string;
  /** One-line special ability shown on the card */
  ability: string;
  /** Card gradient: [from, to] */
  colors: [string, string];
  playable?: boolean;
  missionId?: string;
  /** Where on the island this character lives */
  home?: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  colors: [string, string];
}

export const categories: Category[] = [
  { id: 'cartoons', label: 'Classic Cartoons', emoji: '📺', colors: ['#ff9a9e', '#fecfef'] },
  { id: 'pokemon', label: 'Pokémon', emoji: '⚡', colors: ['#ffd452', '#ff8a3d'] },
  { id: 'heroes', label: 'Superheroes', emoji: '🦸', colors: ['#5aa9ff', '#7a5cff'] },
  { id: 'disney', label: 'Disney & Fantasy', emoji: '🏰', colors: ['#a78bfa', '#f0abfc'] },
  { id: 'indian', label: 'Indian Cartoons', emoji: '🪔', colors: ['#ffb86b', '#ff6b6b'] },
  { id: 'popular', label: 'Popular Favourites', emoji: '🌈', colors: ['#4fd1c5', '#3b82f6'] },
];

export const characters: Character[] = [
  // ───────────────────────── Classic Cartoons ─────────────────────────
  {
    id: 'doraemon',
    name: 'Doraemon',
    category: 'cartoons',
    emoji: '🐱',
    ability: 'Gadget Inventor',
    colors: ['#64c8ff', '#2b7fe0'],
    playable: true,
    missionId: 'm-doraemon',
    home: 'workshop',
  },
  { id: 'nobita', name: 'Nobita', category: 'cartoons', emoji: '👦', ability: 'Quick Thinker', colors: ['#ffd36b', '#f2a33c'], home: 'village' },
  { id: 'shizuka', name: 'Shizuka', category: 'cartoons', emoji: '👧', ability: 'Kind Helper', colors: ['#ff9ecb', '#f26fa8'], home: 'village' },
  { id: 'gian', name: 'Gian', category: 'cartoons', emoji: '🎤', ability: 'Super Strength', colors: ['#ffb072', '#e2703a'], home: 'village' },
  { id: 'suneo', name: 'Suneo', category: 'cartoons', emoji: '🧢', ability: 'Clever Trader', colors: ['#b2c7ff', '#6f8fe0'], home: 'village' },
  {
    id: 'shinchan',
    name: 'Shinchan',
    category: 'cartoons',
    emoji: '😜',
    ability: 'Mystery Detective',
    colors: ['#ffd166', '#ff8fab'],
    playable: true,
    missionId: 'm-shinchan',
    home: 'city',
  },
  { id: 'himawari', name: 'Himawari', category: 'cartoons', emoji: '🍼', ability: 'Shiny Collecting', colors: ['#ffe0f0', '#ffb3d9'], home: 'village' },
  { id: 'kazama', name: 'Kazama', category: 'cartoons', emoji: '🤓', ability: 'Fact Finder', colors: ['#9be7ff', '#4fa8d8'], home: 'city' },
  { id: 'nene', name: 'Nene', category: 'cartoons', emoji: '🎀', ability: 'Bunny Tamer', colors: ['#ffc2dd', '#ff86b5'], home: 'village' },
  { id: 'masao', name: 'Masao', category: 'cartoons', emoji: '🙂', ability: 'Brave Heart', colors: ['#c7f0d8', '#7ed0a0'], home: 'village' },
  { id: 'heidi', name: 'Heidi', category: 'cartoons', emoji: '🏔️', ability: 'Mountain Guide', colors: ['#a8e6cf', '#5bbf9a'], home: 'mountain' },
  { id: 'peter', name: 'Peter', category: 'cartoons', emoji: '🐐', ability: 'Goat Whisperer', colors: ['#ffe08a', '#d9a441'], home: 'mountain' },
  { id: 'tom', name: 'Tom', category: 'cartoons', emoji: '🐈', ability: 'Sneaky Pounce', colors: ['#cfd8e3', '#8a97a8'], home: 'village' },
  { id: 'jerry', name: 'Jerry', category: 'cartoons', emoji: '🐭', ability: 'Tiny Escape', colors: ['#ffd9a0', '#e0a458'], home: 'village' },
  { id: 'mickey', name: 'Mickey Mouse', category: 'cartoons', emoji: '🐭', ability: 'Magic Conductor', colors: ['#ff8a8a', '#d94a4a'], home: 'castle' },
  { id: 'minnie', name: 'Minnie Mouse', category: 'cartoons', emoji: '🎀', ability: 'Style Sparkle', colors: ['#ff9ecb', '#e5548d'], home: 'castle' },
  { id: 'mrbean', name: 'Mr. Bean', category: 'cartoons', emoji: '🕴️', ability: 'Silly Solutions', colors: ['#d9c28f', '#9c8153'], home: 'city' },

  // ───────────────────────── Pokémon ─────────────────────────
  {
    id: 'pikachu',
    name: 'Pikachu',
    category: 'pokemon',
    emoji: '⚡',
    ability: 'Electric Power',
    colors: ['#ffe066', '#ffa41b'],
    playable: true,
    missionId: 'm-pikachu',
    home: 'lab',
  },
  { id: 'ash', name: 'Ash', category: 'pokemon', emoji: '🧢', ability: 'Never Gives Up', colors: ['#7fd1ff', '#2f8ddb'], home: 'lab' },
  { id: 'eevee', name: 'Eevee', category: 'pokemon', emoji: '🦊', ability: 'Many Evolutions', colors: ['#f7d9a8', '#c99654'], home: 'forest' },
  { id: 'charizard', name: 'Charizard', category: 'pokemon', emoji: '🐉', ability: 'Blazing Wings', colors: ['#ff9a5a', '#d63b26'], home: 'mountain' },
  { id: 'bulbasaur', name: 'Bulbasaur', category: 'pokemon', emoji: '🌱', ability: 'Vine Growth', colors: ['#b8e986', '#5fa83a'], home: 'forest' },
  { id: 'squirtle', name: 'Squirtle', category: 'pokemon', emoji: '🐢', ability: 'Water Spray', colors: ['#a8dcff', '#3f9bd6'], home: 'river' },
  { id: 'jigglypuff', name: 'Jigglypuff', category: 'pokemon', emoji: '🎵', ability: 'Sleepy Song', colors: ['#ffc0e0', '#f58ab8'], home: 'village' },
  { id: 'snorlax', name: 'Snorlax', category: 'pokemon', emoji: '😴', ability: 'Giant Nap', colors: ['#b7c4d6', '#5c7186'], home: 'mountain' },
  { id: 'meowth', name: 'Meowth', category: 'pokemon', emoji: '💰', ability: 'Coin Charm', colors: ['#ffe9b0', '#d6a54a'], home: 'city' },
  { id: 'mewtwo', name: 'Mewtwo', category: 'pokemon', emoji: '🔮', ability: 'Mind Power', colors: ['#d3b8ff', '#8a5cf6'], home: 'lab' },
  { id: 'lucario', name: 'Lucario', category: 'pokemon', emoji: '🥋', ability: 'Aura Sense', colors: ['#8fd6ff', '#2f6fb5'], home: 'mountain' },
  { id: 'greninja', name: 'Greninja', category: 'pokemon', emoji: '🌊', ability: 'Swift Ninja', colors: ['#7fb8e8', '#254e8a'], home: 'river' },
  { id: 'gengar', name: 'Gengar', category: 'pokemon', emoji: '👻', ability: 'Shadow Tricks', colors: ['#c2a8e8', '#5b3d8f'], home: 'forest' },
  { id: 'piplup', name: 'Piplup', category: 'pokemon', emoji: '🐧', ability: 'Ice Walker', colors: ['#b9e6ff', '#4d9fd6'], home: 'river' },

  // ───────────────────────── Superheroes ─────────────────────────
  {
    id: 'ironman',
    name: 'Iron Man',
    category: 'heroes',
    emoji: '🤖',
    ability: 'Build & Power',
    colors: ['#ff6b5a', '#c22a1c'],
    playable: true,
    missionId: 'm-ironman',
    home: 'lab',
  },
  {
    id: 'spiderman',
    name: 'Spider-Man',
    category: 'heroes',
    emoji: '🕷️',
    ability: 'Web Slinging',
    colors: ['#ff5a6e', '#1f4fb8'],
    playable: true,
    missionId: 'm-spiderman',
    home: 'river',
  },
  { id: 'hulk', name: 'Hulk', category: 'heroes', emoji: '💪', ability: 'Mega Strength', colors: ['#9fe870', '#3f9a35'], home: 'mountain' },
  { id: 'thor', name: 'Thor', category: 'heroes', emoji: '🔨', ability: 'Thunder Strike', colors: ['#9bc4ff', '#3a63b8'], home: 'castle' },
  { id: 'cap', name: 'Captain America', category: 'heroes', emoji: '🛡️', ability: 'Shield Guard', colors: ['#8fb8ff', '#2a4ea8'], home: 'village' },
  { id: 'blackpanther', name: 'Black Panther', category: 'heroes', emoji: '🐾', ability: 'Silent Speed', colors: ['#a9a4ff', '#3a3170'], home: 'forest' },
  { id: 'batman', name: 'Batman', category: 'heroes', emoji: '🦇', ability: 'Detective Mind', colors: ['#8f9bb3', '#2b3446'], home: 'city' },
  { id: 'superman', name: 'Superman', category: 'heroes', emoji: '🦸', ability: 'Sky Flight', colors: ['#8ab8ff', '#c33b3b'], home: 'city' },
  { id: 'wonderwoman', name: 'Wonder Woman', category: 'heroes', emoji: '⚔️', ability: 'Truth Lasso', colors: ['#ffb36b', '#c33b6b'], home: 'castle' },
  { id: 'ben10', name: 'Ben 10', category: 'heroes', emoji: '⌚', ability: 'Alien Switch', colors: ['#a7f36b', '#2f9a4a'], home: 'lab' },

  // ───────────────────────── Disney & Fantasy ─────────────────────────
  {
    id: 'elsa',
    name: 'Elsa',
    category: 'disney',
    emoji: '❄️',
    ability: 'Ice Magic',
    colors: ['#a5e9ff', '#5b8def'],
    playable: true,
    missionId: 'm-elsa',
    home: 'river',
  },
  { id: 'anna', name: 'Anna', category: 'disney', emoji: '🧣', ability: 'Fearless Heart', colors: ['#ffb3a7', '#e0755f'], home: 'castle' },
  { id: 'olaf', name: 'Olaf', category: 'disney', emoji: '⛄', ability: 'Warm Hugs', colors: ['#e8f6ff', '#9fc9e8'], home: 'river' },
  {
    id: 'barbie',
    name: 'Barbie',
    category: 'disney',
    emoji: '👗',
    ability: 'Creative Designer',
    colors: ['#ff9ed2', '#f4529f'],
    playable: true,
    missionId: 'm-barbie',
    home: 'castle',
  },
  { id: 'moana', name: 'Moana', category: 'disney', emoji: '🌺', ability: 'Ocean Navigator', colors: ['#7fe3d0', '#1f9fb5'], home: 'river' },
  { id: 'rapunzel', name: 'Rapunzel', category: 'disney', emoji: '💇', ability: 'Glowing Hair', colors: ['#ffe9a8', '#d9a63c'], home: 'castle' },
  { id: 'cinderella', name: 'Cinderella', category: 'disney', emoji: '👠', ability: 'Dance Grace', colors: ['#d6e4ff', '#8fa8e8'], home: 'castle' },
  { id: 'ariel', name: 'Ariel', category: 'disney', emoji: '🧜', ability: 'Sea Song', colors: ['#ffb0d4', '#2fb9a8'], home: 'river' },
  { id: 'tinkerbell', name: 'Tinker Bell', category: 'disney', emoji: '🧚', ability: 'Pixie Dust', colors: ['#d8ffb0', '#7bc94a'], home: 'forest' },
  { id: 'simba', name: 'Simba', category: 'disney', emoji: '🦁', ability: 'Brave Roar', colors: ['#ffd08a', '#d98a2b'], home: 'mountain' },
  { id: 'mufasa', name: 'Mufasa', category: 'disney', emoji: '👑', ability: 'Wise Leader', colors: ['#ffc46b', '#b06a1f'], home: 'mountain' },
  { id: 'toothless', name: 'Toothless', category: 'disney', emoji: '🐲', ability: 'Night Flight', colors: ['#a8b6d6', '#2c3550'], home: 'mountain' },
  { id: 'hiccup', name: 'Hiccup', category: 'disney', emoji: '🦿', ability: 'Dragon Trainer', colors: ['#b8d6a0', '#5f8f4a'], home: 'mountain' },
  { id: 'harry', name: 'Harry Potter', category: 'disney', emoji: '🪄', ability: 'Spellcasting', colors: ['#d9b8ff', '#6b3fa0'], home: 'castle' },
  { id: 'hermione', name: 'Hermione', category: 'disney', emoji: '📚', ability: 'Book Genius', colors: ['#e8c48a', '#9c6b2f'], home: 'castle' },
  { id: 'ron', name: 'Ron', category: 'disney', emoji: '🧙', ability: 'Loyal Friend', colors: ['#ffc08a', '#b85f2f'], home: 'castle' },

  // ───────────────────────── Indian Cartoons ─────────────────────────
  {
    id: 'bheem',
    name: 'Chhota Bheem',
    category: 'indian',
    emoji: '🏹',
    ability: 'Laddoo Strength',
    colors: ['#ffcf6b', '#e07a1f'],
    playable: true,
    missionId: 'm-bheem',
    home: 'village',
  },
  { id: 'chutki', name: 'Chutki', category: 'indian', emoji: '🌸', ability: 'Flower Charm', colors: ['#ffc0cb', '#e8688f'], home: 'village' },
  { id: 'raju', name: 'Raju', category: 'indian', emoji: '🧒', ability: 'Fast Runner', colors: ['#9fe0c0', '#3f9a6b'], home: 'village' },
  { id: 'jaggu', name: 'Jaggu', category: 'indian', emoji: '🐒', ability: 'Tree Swings', colors: ['#ffd9a0', '#b07a35'], home: 'forest' },
  { id: 'motu', name: 'Motu', category: 'indian', emoji: '🥞', ability: 'Big Appetite', colors: ['#ffd166', '#e08f2b'], home: 'village' },
  { id: 'patlu', name: 'Patlu', category: 'indian', emoji: '🧅', ability: 'Clever Plans', colors: ['#b8e0a0', '#5f9a4a'], home: 'village' },
  { id: 'shiva', name: 'Shiva', category: 'indian', emoji: '🚴', ability: 'Daring Stunts', colors: ['#8fd0ff', '#2f7fb5'], home: 'city' },
  { id: 'hattori', name: 'Ninja Hattori', category: 'indian', emoji: '🥷', ability: 'Ninja Moves', colors: ['#a0b8d8', '#3a4a6b'], home: 'forest' },
  { id: 'kenichi', name: 'Kenichi', category: 'indian', emoji: '🎽', ability: 'Lucky Guess', colors: ['#ffd9b0', '#d98a52'], home: 'city' },
  { id: 'singham', name: 'Little Singham', category: 'indian', emoji: '🚔', ability: 'Justice Charge', colors: ['#ffb072', '#c94a2b'], home: 'city' },
  { id: 'mightyraju', name: 'Mighty Raju', category: 'indian', emoji: '💫', ability: 'Super Speed', colors: ['#8fe8e0', '#2f9a9a'], home: 'city' },
  { id: 'roll21', name: 'Roll No. 21', category: 'indian', emoji: '🎒', ability: 'Classroom Capers', colors: ['#c2b0ff', '#6b4fb0'], home: 'city' },
  { id: 'tenali', name: 'Tenali Rama', category: 'indian', emoji: '🪔', ability: 'Witty Riddles', colors: ['#ffd98a', '#c28a2b'], home: 'castle' },
  { id: 'pakdam', name: 'Pakdam Pakdai', category: 'indian', emoji: '🐕', ability: 'Chase Champion', colors: ['#d8c0a0', '#8a6848'], home: 'village' },

  // ───────────────────────── Popular Favourites ─────────────────────────
  { id: 'bluey', name: 'Bluey', category: 'popular', emoji: '🐶', ability: 'Play Ideas', colors: ['#9fd8ff', '#3f8fd8'], home: 'village' },
  { id: 'bingo', name: 'Bingo', category: 'popular', emoji: '🐕', ability: 'Little Giggles', colors: ['#ffc9a0', '#e08a52'], home: 'village' },
  { id: 'peppa', name: 'Peppa Pig', category: 'popular', emoji: '🐷', ability: 'Puddle Jump', colors: ['#ffb3d9', '#e86ba8'], home: 'village' },
  { id: 'george', name: 'George', category: 'popular', emoji: '🐽', ability: 'Dino Roar', colors: ['#ffe0b3', '#d9a05a'], home: 'village' },
  { id: 'spongebob', name: 'SpongeBob', category: 'popular', emoji: '🧽', ability: 'Bubble Blowing', colors: ['#ffe98a', '#d9b83c'], home: 'river' },
  { id: 'patrick', name: 'Patrick', category: 'popular', emoji: '⭐', ability: 'Silly Ideas', colors: ['#ffb3c9', '#e86b9a'], home: 'river' },
  { id: 'sandy', name: 'Sandy', category: 'popular', emoji: '🐿️', ability: 'Science Fun', colors: ['#c9e8a0', '#7fa84a'], home: 'lab' },
  { id: 'chase', name: 'Chase', category: 'popular', emoji: '🐕‍🦺', ability: 'Sniff & Solve', colors: ['#a8c8ff', '#3f63b5'], home: 'city' },
  { id: 'marshall', name: 'Marshall', category: 'popular', emoji: '🚒', ability: 'Fire Rescue', colors: ['#ff9a8a', '#d94a3a'], home: 'village' },
  { id: 'skye', name: 'Skye', category: 'popular', emoji: '🚁', ability: 'Sky Rescue', colors: ['#ffc2e8', '#c96bb5'], home: 'mountain' },
  { id: 'rubble', name: 'Rubble', category: 'popular', emoji: '🚜', ability: 'Dig & Build', colors: ['#ffe08a', '#c9a03c'], home: 'village' },
  { id: 'kevin', name: 'Kevin', category: 'popular', emoji: '🍌', ability: 'Banana Plans', colors: ['#ffe98a', '#d9b83c'], home: 'lab' },
  { id: 'stuart', name: 'Stuart', category: 'popular', emoji: '🎸', ability: 'Rock Star', colors: ['#c9b3ff', '#7a5ce8'], home: 'lab' },
  { id: 'bob', name: 'Bob', category: 'popular', emoji: '🧸', ability: 'Teddy Hugs', colors: ['#b3e8ff', '#4f9fd8'], home: 'lab' },
  { id: 'sonic', name: 'Sonic', category: 'popular', emoji: '💨', ability: 'Sonic Speed', colors: ['#8fc9ff', '#2f5fd8'], home: 'mountain' },
  { id: 'tails', name: 'Tails', category: 'popular', emoji: '🦊', ability: 'Flying Tails', colors: ['#ffd48a', '#d98a2b'], home: 'mountain' },
  { id: 'knuckles', name: 'Knuckles', category: 'popular', emoji: '✊', ability: 'Power Punch', colors: ['#ff9a8a', '#c94a3a'], home: 'mountain' },
  { id: 'mario', name: 'Mario', category: 'popular', emoji: '🍄', ability: 'Jump Master', colors: ['#ff8a8a', '#d92b2b'], home: 'city' },
  { id: 'luigi', name: 'Luigi', category: 'popular', emoji: '👻', ability: 'Ghost Courage', colors: ['#a0e8a0', '#3f9a4a'], home: 'city' },
  { id: 'peach', name: 'Princess Peach', category: 'popular', emoji: '🍑', ability: 'Royal Kindness', colors: ['#ffb3d9', '#e86bb5'], home: 'castle' },
  { id: 'yoshi', name: 'Yoshi', category: 'popular', emoji: '🦖', ability: 'Egg Toss', colors: ['#b3f0a0', '#4fbf3f'], home: 'forest' },
  { id: 'po', name: 'Po', category: 'popular', emoji: '🐼', ability: 'Kung Fu Kick', colors: ['#ffd9a0', '#c98a4a'], home: 'mountain' },
  { id: 'tigress', name: 'Tigress', category: 'popular', emoji: '🐯', ability: 'Silent Strike', colors: ['#ffb36b', '#d96b1f'], home: 'mountain' },
  { id: 'naruto', name: 'Naruto', category: 'popular', emoji: '🍥', ability: 'Shadow Clones', colors: ['#ffc46b', '#e8861f'], home: 'forest' },
  { id: 'sasuke', name: 'Sasuke', category: 'popular', emoji: '⚡', ability: 'Lightning Blade', colors: ['#b3b3ff', '#4a3fa8'], home: 'forest' },
  { id: 'sakura', name: 'Sakura', category: 'popular', emoji: '🌸', ability: 'Healing Hands', colors: ['#ffb3d0', '#e85b8f'], home: 'forest' },
  { id: 'goku', name: 'Goku', category: 'popular', emoji: '🥋', ability: 'Energy Blast', colors: ['#ffb36b', '#d95a1f'], home: 'mountain' },
  { id: 'vegeta', name: 'Vegeta', category: 'popular', emoji: '🔥', ability: 'Royal Pride', colors: ['#a8b8ff', '#3f4fa8'], home: 'mountain' },
  { id: 'gohan', name: 'Gohan', category: 'popular', emoji: '📖', ability: 'Hidden Power', colors: ['#c9e8a0', '#6f9a3f'], home: 'mountain' },
  { id: 'luffy', name: 'Luffy', category: 'popular', emoji: '🏴‍☠️', ability: 'Stretchy Arms', colors: ['#ff9a8a', '#d94a2b'], home: 'river' },
  { id: 'zoro', name: 'Zoro', category: 'popular', emoji: '⚔️', ability: 'Three Swords', colors: ['#a0e8c0', '#2f9a6b'], home: 'river' },
  { id: 'nami', name: 'Nami', category: 'popular', emoji: '🧭', ability: 'Weather Sense', colors: ['#ffc78a', '#d98a2b'], home: 'river' },
  { id: 'hellokitty', name: 'Hello Kitty', category: 'popular', emoji: '🎀', ability: 'Friendship Bow', colors: ['#ffd9e8', '#e86b9a'], home: 'castle' },
  { id: 'kuromi', name: 'Kuromi', category: 'popular', emoji: '💜', ability: 'Mischief Magic', colors: ['#d9b3ff', '#8a5ce8'], home: 'castle' },
  { id: 'mymelody', name: 'My Melody', category: 'popular', emoji: '🐰', ability: 'Sweet Baking', colors: ['#ffc9d9', '#e8688f'], home: 'castle' },
  { id: 'finn', name: 'Finn', category: 'popular', emoji: '🗡️', ability: 'Hero Heart', colors: ['#a8e8ff', '#2f9ad8'], home: 'forest' },
  { id: 'jake', name: 'Jake', category: 'popular', emoji: '🐕', ability: 'Stretchy Shape', colors: ['#ffe08a', '#d9a03c'], home: 'forest' },
];

export const characterById = (id: string) => characters.find((c) => c.id === id);
export const missionCharacters = characters.filter((c) => c.playable);
