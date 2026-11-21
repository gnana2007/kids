import Phaser from 'phaser';
import { createScenery } from '../art/scenery';
import { WorldScene } from './WorldScene';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create() {
    createScenery(this);
    const start = (this.registry.get('cv:start') as { zone?: string; character?: string }) ?? {};
    this.scene.start('world', start);
  }
}
