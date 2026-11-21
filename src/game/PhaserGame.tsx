import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { WorldScene } from './scenes/WorldScene';

interface Props {
  zone: string;
  character: string;
}

/**
 * Mounts one Phaser game per run. Everything inside the world (movement, physics,
 * abilities, missions, world changes) is handled by Phaser — React only draws menus.
 */
export default function PhaserGame({ zone, character }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!host.current) return;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: host.current,
      backgroundColor: '#9fe0ff',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
      },
      physics: {
        default: 'arcade',
        arcade: { gravity: { x: 0, y: 1500 }, debug: false },
      },
      render: { antialias: true, roundPixels: true, powerPreference: 'high-performance' },
      scene: [BootScene, WorldScene],
    });
    game.registry.set('cv:start', { zone, character });
    gameRef.current = game;

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
    // one game instance per run; in-game character switching uses the bus
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={host} className="absolute inset-0 h-full w-full [&>canvas]:!h-full [&>canvas]:!w-full" />;
}
