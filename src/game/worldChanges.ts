export interface WorldChange {
  flag: string;
  label: string;
  emoji: string;
}

/** Everything a child can change on the island, in roughly the order it happens. */
export const worldChanges: WorldChange[] = [
  { flag: 'river-frozen', label: 'Ice path across the river', emoji: '❄️' },
  { flag: 'supply-crane', label: 'Gadget crane on the riverbank', emoji: '🏗️' },
  { flag: 'web-bridge', label: 'Web bridge over the gorge', emoji: '🕸️' },
  { flag: 'power-restored', label: 'Lights bright in the village', emoji: '💡' },
  { flag: 'villagers-safe', label: 'Villagers back home', emoji: '🏘️' },
  { flag: 'lightning-lights', label: 'Lightning Hill lanterns lit', emoji: '🔦' },
  { flag: 'mystery-solved', label: 'Lantern City mystery solved', emoji: '🔍' },
  { flag: 'studio-open', label: 'Castle gala ready', emoji: '🎀' },
];

export const changeByFlag = (flag: string) => worldChanges.find((c) => c.flag === flag);
