import Phaser from 'phaser';
import { missionFor, type MissionDef } from '../missions';
import { GROUND_Y, VIEW_H, WORLD_WIDTH, ZONES, zoneAt, zoneById, type Thing, type ZoneDef } from '../world';
import { loadSave, writeSave, type SaveData } from '../save';
import { bus, type HudState } from '../bus';
import { consume, held, press, releaseAll, clearQueue } from '../input';
import { playableById } from '../characters';
import { sfx } from '../sound';
import { ANIM } from '../art/sprites';

interface Runtime {
  thing: Thing;
  obj: Phaser.GameObjects.Image | Phaser.Physics.Arcade.Sprite;
  glow?: Phaser.GameObjects.Image;
  extra?: Phaser.GameObjects.GameObject;
  w: number;
  h: number;
  taken?: boolean;
  lit?: boolean;
  open?: boolean;
  carrying?: boolean;
}

const ZONE = 2600;

const ABILITY_KEY: Record<string, string> = {
  doraemon: 'Magnet Hand',
  pikachu: 'Thunder Zap',
  elsa: 'Ice Magic',
  spiderman: 'Web Swing',
  ironman: 'Jet Thrusters',
  shinchan: 'Silly Dance',
  barbie: 'Style Switch',
  bheem: 'Super Stomp',
};

export class WorldScene extends Phaser.Scene {
  private save!: SaveData;
  private characterId = 'doraemon';
  private zone!: ZoneDef;
  private player!: Phaser.Physics.Arcade.Sprite;
  private solids!: Phaser.Physics.Arcade.StaticGroup;
  private crateGroup!: Phaser.Physics.Arcade.Group;
  private things: Runtime[] = [];
  private markers: Phaser.GameObjects.Sprite[] = [];
  private npcs: { obj: Phaser.GameObjects.Image; label: Phaser.GameObjects.Text }[] = [];
  private bgLayers: Phaser.GameObjects.TileSprite[] = [];
  private midLayers: Phaser.GameObjects.TileSprite[] = [];
  private waters: Phaser.GameObjects.TileSprite[] = [];
  private mission!: MissionDef;
  private prompt: { label: string; key: string; id: string; x: number; y: number } | null = null;
  private markersDirty = true;
  private lastSafe = new Phaser.Math.Vector2(160, 500);
  private onGround = false;
  private lastGround = 0;
  private jumpBuffered = 0;
  private facing = 1;
  private abilityUntil = 0;
  private abilityCd = 0;
  private zoneId = 'village';
  private hudTimer = 0;
  private hudLast = '';
  private paused = false;
  private carried: Runtime | null = null;
  private copter?: Phaser.GameObjects.Image;
  private aura?: Phaser.GameObjects.Image;
  private swirl = 0;
  private outfit = 0;
  private busy = false;
  private toysShown = false;

  constructor() {
    super('world');
  }

  init(data: { zone?: string; character?: string }) {
    this.save = loadSave();
    this.characterId = data.character ?? this.save.character ?? 'doraemon';
    if (!playableById(this.characterId)) this.characterId = 'doraemon';
    this.zone = zoneById((data.zone as never) ?? 'village') ?? ZONES[0];
    this.zoneId = this.zone.id;
    this.mission = missionFor(this.characterId)!;
    this.things = [];
    this.markers = [];
    this.npcs = [];
    this.bgLayers = [];
    this.midLayers = [];
    this.waters = [];
    this.carried = null;
    this.paused = false;
    this.busy = false;
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, 1200);
    this.solids = this.physics.add.staticGroup();
    this.crateGroup = this.physics.add.group();
    releaseAll();

    this.buildBackground();
    this.buildTerrain();
    this.buildWater();
    this.buildThings();
    this.buildParticles();
    this.buildPlayer();
    this.setupInput();
    this.setupBus();
    this.setupCamera();

    this.applyFlags();
    this.rebuildMarkers();
    this.emitHud(true);
    this.showZoneBanner();

    this.events.once('shutdown', () => this.teardown());
    this.exposeDebug();
  }

  /* ───────────────────────────── build ───────────────────────────── */

  private buildBackground() {
    ZONES.forEach((zone) => {
      const bg = this.add
        .tileSprite(zone.x, 0, zone.width, VIEW_H, `bg-${zone.id}`)
        .setOrigin(0, 0)
        .setDepth(-30);
      const mid = this.add
        .tileSprite(zone.x, 0, zone.width, VIEW_H, `mid-${zone.id}`)
        .setOrigin(0, 0)
        .setDepth(-20)
        .setAlpha(0.92);
      this.bgLayers.push(bg);
      this.midLayers.push(mid);
      if (zone.index > 0) {
        this.add.image(zone.x, 0, 'mist').setOrigin(0.5, 0).setDepth(-15).setAlpha(0.8);
      }

      // drifting clouds for a living sky
      for (let i = 0; i < 4; i++) {
        const cloud = this.add
          .image(zone.x + 180 + i * 620, 70 + (i % 3) * 62, 'cloud')
          .setDepth(-18)
          .setAlpha(0.55)
          .setScale(0.7 + (i % 3) * 0.25)
          .setFlipX(i % 2 === 0);
        this.tweens.add({
          targets: cloud,
          x: cloud.x + 150 + i * 20,
          duration: 22000 + i * 4000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.inOut',
        });
      }
    });
  }

  private addSolidBox(cx: number, cy: number, w: number, h: number) {
    const zone = this.add.zone(cx, cy, w, h);
    this.solids.add(zone);
    return zone;
  }

  private buildTerrain() {
    ZONES.forEach((zone) => {
      zone.ground.forEach((seg) => {
        this.add.tileSprite(seg.x, seg.y, seg.w, 720 - seg.y + 40, `ground-${zone.id}`).setOrigin(0, 0).setDepth(5);
        this.addSolidBox(seg.x + seg.w / 2, seg.y + (720 - seg.y + 40) / 2, seg.w, 720 - seg.y + 40);
      });
      zone.platforms.forEach((p) => {
        this.add.tileSprite(p.x, p.y, p.w, 28, `platform-${zone.id}`).setOrigin(0, 0).setDepth(6);
        this.addSolidBox(p.x + p.w / 2, p.y + 14, p.w, 24);
      });
    });
  }

  private buildWater() {
    ZONES.forEach((zone) => {
      zone.water.forEach((gap) => {
        const w = this.add
          .tileSprite(gap.x, GROUND_Y + 8, gap.w, 200, `water-${zone.id}`)
          .setOrigin(0, 0)
          .setDepth(4)
          .setAlpha(0.92);
        this.waters.push(w);
      });
    });
  }

  private buildThings() {
    ZONES.forEach((zone) => {
      zone.things.forEach((t) => this.spawnThing(t, zone));
    });
  }

  private spawnThing(t: Thing, _zone: ZoneDef) {
    switch (t.type) {
      case 'house': {
        const img = this.add
          .image(t.x, t.y + 2, `house-${t.variant ?? 0}`)
          .setOrigin(0.5, 1)
          .setDepth(t.y);
        this.things.push({ thing: t, obj: img, w: 160, h: 156 });
        return;
      }
      case 'tree': {
        const img = this.add
          .image(t.x, t.y + 2, `tree-${t.variant ?? 0}`)
          .setOrigin(0.5, 1)
          .setDepth(t.y);
        this.things.push({ thing: t, obj: img, w: 160, h: 210 });
        return;
      }
      case 'mushroom':
      case 'bush':
      case 'rock':
      case 'haystack': {
        const img = this.add.image(t.x, t.y + 2, t.type).setOrigin(0.5, 1).setDepth(t.y);
        this.things.push({ thing: t, obj: img, w: 80, h: 70 });
        return;
      }
      case 'castle': {
        const img = this.add.image(t.x, t.y + 4, 'castle').setOrigin(0.5, 1).setDepth(t.y);
        this.things.push({ thing: t, obj: img, w: 440, h: 340 });
        return;
      }
      case 'sign': {
        const img = this.add.image(t.x, t.y + 2, 'sign').setOrigin(0.5, 1).setDepth(t.y);
        const label = this.add
          .text(t.x, t.y - 78, t.label ?? '', {
            fontFamily: '"Baloo 2", "Fredoka", sans-serif',
            fontSize: '17px',
            color: '#3b2a1e',
            align: 'center',
            wordWrap: { width: 150 },
          })
          .setOrigin(0.5, 1)
          .setDepth(t.y + 1);
        this.things.push({ thing: t, obj: img, extra: label, w: 74, h: 96 });
        return;
      }
      case 'windmill': {
        const tower = this.add.image(t.x, t.y + 2, 'windmill-tower').setOrigin(0.5, 1).setDepth(t.y);
        const blades = this.add.image(t.x, t.y - 158, 'windmill-blades').setOrigin(0.5, 0.5).setDepth(t.y + 2);
        blades.setAngle(24);
        const rt: Runtime = { thing: t, obj: tower, extra: blades, w: 150, h: 250 };
        this.things.push(rt);
        return;
      }
      case 'lamp': {
        const lit = this.save.flags.includes('lamps');
        const img = this.add.image(t.x, t.y + 2, lit ? 'lamp-on' : 'lamp-off').setOrigin(0.5, 1).setDepth(t.y);
        const glow = this.add
          .image(t.x, t.y - 130, 'glow')
          .setDepth(t.y - 1)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setScale(1.35)
          .setAlpha(lit ? 0.85 : 0);
        const rt: Runtime = { thing: t, obj: img, glow, w: 60, h: 170, lit };
        this.things.push(rt);
        return;
      }
      case 'gear':
      case 'toy':
      case 'part': {
        const texture = t.type === 'gear' ? 'gear' : t.type === 'toy' ? 'toy' : 'part';
        const sprite = this.physics.add.sprite(t.x, t.y - 26, texture);
        const doneFlag = t.type === 'gear' ? 'windmill' : t.type === 'toy' ? 'toys' : 'generator';
        const already = this.save.flags.includes(doneFlag);
        sprite.setDepth(t.y + 3).setVisible(!already);
        (sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        sprite.setData('homeY', t.y - 26);
        this.tweens.add({
          targets: sprite,
          y: t.y - 34,
          duration: 1100 + Math.random() * 400,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.inOut',
        });
        const glow = t.type === 'part'
          ? this.add.image(t.x, t.y - 26, 'glow').setBlendMode(Phaser.BlendModes.ADD).setScale(0.7).setAlpha(0.5).setDepth(t.y + 2)
          : undefined;
        this.things.push({ thing: t, obj: sprite, glow, w: 44, h: 44, taken: already });
        return;
      }
      case 'crate': {
        const sprite = this.physics.add.sprite(t.x, t.y - 28, 'crate');
        const woodDone = this.save.flags.includes('firewood');
        sprite.setDepth(t.y).setVisible(!woodDone);
        this.crateGroup.add(sprite);
        (sprite.body as Phaser.Physics.Arcade.Body).setSize(44, 42);
        this.things.push({ thing: t, obj: sprite, w: 52, h: 52, taken: woodDone });
        return;
      }
      case 'hearth': {
        const img = this.add.image(t.x, t.y + 2, 'hearth').setOrigin(0.5, 1).setDepth(t.y);
        const fire = this.add
          .image(t.x, t.y - 58, 'glow')
          .setBlendMode(Phaser.BlendModes.ADD)
          .setScale(1.1)
          .setAlpha(this.save.flags.includes('firewood') ? 0.95 : 0.35)
          .setDepth(t.y + 1);
        this.tweens.add({ targets: fire, scale: 1.3, alpha: this.save.flags.includes('firewood') ? 0.75 : 0.2, duration: 700, yoyo: true, repeat: -1 });
        this.things.push({ thing: t, obj: img, glow: fire, w: 110, h: 90 });
        return;
      }
      case 'flowerBed': {
        const bloom = this.save.flags.includes('garden');
        const img = this.add.image(t.x, t.y + 2, bloom ? 'flower-bloom' : 'flower-empty').setOrigin(0.5, 1).setDepth(t.y);
        this.things.push({ thing: t, obj: img, w: 60, h: 44, taken: bloom });
        return;
      }
      case 'generator': {
        const img = this.add.image(t.x, t.y + 4, 'generator').setOrigin(0.5, 1).setDepth(t.y);
        const glow = this.add
          .image(t.x, t.y - 60, 'glow')
          .setBlendMode(Phaser.BlendModes.ADD)
          .setScale(1.1)
          .setAlpha(this.save.flags.includes('generator') ? 0.9 : 0)
          .setDepth(t.y + 1);
        this.things.push({ thing: t, obj: img, glow, w: 130, h: 130 });
        return;
      }
      case 'villager': {
        if (this.save.flags.includes('rescued')) {
          const img = this.add.image(t.x, t.y + 2, 'villager-warm').setOrigin(0.5, 1).setDepth(t.y).setVisible(false);
          this.things.push({ thing: t, obj: img, w: 48, h: 64, taken: true });
          return;
        }
        const img = this.add.image(t.x, t.y + 2, 'villager').setOrigin(0.5, 1).setDepth(t.y);
        this.tweens.add({ targets: img, y: t.y - 6, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        this.things.push({ thing: t, obj: img, w: 48, h: 64 });
        return;
      }
      case 'npc': {
        const img = this.add
          .image(t.x, t.y + 2, 'villager')
          .setOrigin(0.5, 1)
          .setDepth(t.y)
          .setTint(Phaser.Display.Color.HexStringToColor(t.color ?? '#ffffff').color);
        const label = this.add
          .text(t.x, t.y - 66, t.label ?? '', {
            fontFamily: '"Baloo 2", "Fredoka", sans-serif',
            fontSize: '15px',
            color: '#ffffff',
            stroke: '#2b2b4b',
            strokeThickness: 4,
          })
          .setOrigin(0.5, 1)
          .setDepth(t.y + 1);
        this.npcs.push({ obj: img, label });
        this.things.push({ thing: t, obj: img, extra: label, w: 48, h: 64 });
        this.tweens.add({ targets: [img, label], y: '-=4', duration: 1200 + Math.random() * 400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        return;
      }
    }
  }

  private buildParticles() {
    const forest = ZONES[1];
    const frozen = ZONES[2];
    const village = ZONES[0];
    this.add
      .particles(0, 0, 'snow', {
        x: { min: village.x, max: village.x + village.width },
        y: 40,
        lifespan: 9000,
        frequency: 420,
        quantity: 1,
        scale: { min: 0.6, max: 1.1 },
        alpha: { start: 0, end: 0.9, ease: 'Sine.inOut' },
        tint: [0xffd166, 0xff9a3c, 0x9be38a],
        speedY: { min: 16, max: 34 },
        speedX: { min: -26, max: 26 },
        rotate: { start: 0, end: 360 },
        gravityY: 6,
        blendMode: 'NORMAL',
      })
      .setDepth(700);

    this.add
      .particles(0, 0, 'spark', {
        x: { min: forest.x, max: forest.x + forest.width },
        y: { min: 260, max: 520 },
        lifespan: 5200,
        frequency: 260,
        quantity: 1,
        scale: { start: 0.9, end: 0.2 },
        alpha: { start: 0, end: 1 },
        tint: [0xb8ff9f, 0x9be3ff, 0xffe9a8],
        speedY: { min: -12, max: 12 },
        speedX: { min: -8, max: 8 },
        blendMode: 'ADD',
        emitting: true,
      })
      .setDepth(720);

    this.add
      .particles(0, 0, 'snow', {
        x: { min: frozen.x, max: frozen.x + frozen.width },
        y: -10,
        lifespan: 12000,
        frequency: 90,
        quantity: 1,
        scale: { min: 0.4, max: 1.2 },
        alpha: { start: 0.95, end: 0.4 },
        speedY: { min: 30, max: 80 },
        speedX: { min: -30, max: 10 },
        gravityY: 12,
        blendMode: 'NORMAL',
      })
      .setDepth(760);
  }

  private buildPlayer() {
    const spawnX = this.zone.spawn.x;
    this.player = this.physics.add.sprite(spawnX, this.zone.spawn.y, `hero-${this.characterId}`);
    this.player.setDepth(600).setCollideWorldBounds(false);
    this.player.setMaxVelocity(420, 900);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 44);
    body.setOffset(20, 16);
    body.setGravityY(0);
    this.physics.add.collider(this.player, this.solids);
    this.physics.add.collider(this.crateGroup, this.solids);

    this.createHeroAnims(this.characterId);
    this.player.play(`hero-${this.characterId}-idle`);

    this.copter = this.add.image(spawnX, 0, 'copter').setDepth(650).setVisible(false).setScale(0.9);
    this.aura = this.add.image(spawnX, 0, 'glow').setDepth(560).setBlendMode(Phaser.BlendModes.ADD).setScale(1.4).setAlpha(0);

    this.lastSafe.set(spawnX, 500);
  }

  private createHeroAnims(id: string) {
    const key = `hero-${id}`;
    const defs: [string, number[], number, number][] = [
      ['idle', ANIM.idle, 3, -1],
      ['walk', ANIM.walk, 10, -1],
      ['jump', ANIM.jump, 6, 0],
      ['power', ANIM.power, 8, 0],
    ];
    defs.forEach(([name, frames, frameRate, repeat]) => {
      const animKey = `${key}-${name}`;
      if (this.anims.exists(animKey)) return;
      this.anims.create({
        key: animKey,
        frames: this.anims.generateFrameNumbers(key, { frames }),
        frameRate,
        repeat,
      });
    });
  }

  private setupCamera() {
    const cam = this.cameras.main;
    cam.setBounds(0, 0, WORLD_WIDTH, VIEW_H);
    cam.startFollow(this.player, true, 0.12, 0.12);
    cam.setDeadzone(120, 80);
    cam.setBackgroundColor('#9fe0ff');
    this.applyZoom();
    this.scale.on('resize', () => this.applyZoom());
  }

  private applyZoom() {
    const zoom = Phaser.Math.Clamp(this.scale.height / VIEW_H, 0.55, 1.6);
    this.cameras.main.setZoom(zoom);
    this.cameras.main.setFollowOffset(0, 30);
  }

  /* ───────────────────────────── input ───────────────────────────── */

  private setupInput() {
    const kb = this.input.keyboard;
    if (!kb) return;
    kb.addCapture(['LEFT', 'RIGHT', 'UP', 'DOWN', 'SPACE', 'W', 'A', 'S', 'D', 'E', 'Q']);
    const map: Record<string, keyof typeof held> = {
      LEFT: 'left',
      A: 'left',
      RIGHT: 'right',
      D: 'right',
      UP: 'up',
      W: 'up',
      DOWN: 'down',
      S: 'down',
      SPACE: 'up',
    };
    const set = (key: string, value: boolean) => {
      const dir = map[key];
      if (dir) held[dir] = value;
      if (key === 'Q') held.ability = value;
      if (!value) return;
      if (key === 'UP' || key === 'W' || key === 'SPACE') press('jump');
      if (key === 'E') press('interact');
      if (key === 'Q') press('ability');
      if (key === 'SPACE') this.jumpBuffered = this.time.now;
    };
    this.input.keyboard!.on('keydown', (e: KeyboardEvent) => {
      const key = e.code.replace('Key', '').replace('Arrow', '').toUpperCase();
      if (['LEFT', 'RIGHT', 'UP', 'DOWN', 'SPACE'].includes(key)) e.preventDefault();
      if (e.repeat) return;
      set(key, true);
    });
    this.input.keyboard!.on('keyup', (e: KeyboardEvent) => {
      const key = e.code.replace('Key', '').replace('Arrow', '').toUpperCase();
      set(key, false);
    });
  }

  private setupBus() {
    const onCharacter = (payload: unknown) => this.setCharacter(String(payload));
    const onPause = (payload: unknown) => this.setPaused(Boolean(payload));
    bus.on('cv:set-character', onCharacter);
    bus.on('cv:pause', onPause);
    this.events.once('shutdown', () => {
      bus.off('cv:set-character', onCharacter);
      bus.off('cv:pause', onPause);
    });
  }

  private teardown() {
    this.markers.forEach((m) => m.destroy());
    this.markers = [];
    releaseAll();
  }

  /* ───────────────────────────── update ───────────────────────────── */

  update(time: number, delta: number) {
    if (this.paused) return;
    const dt = Math.min(delta, 32) / 1000;
    this.swirl += dt;

    this.handleMovement(time, dt);
    this.handleAbilityHeld(time, dt);
    this.handleActions();
    this.updatePrompt();
    this.updateZone();
    this.updateVisuals(time, dt);
    this.updateCarried();
    this.checkFall();

    if (time - this.hudTimer > 120) {
      this.hudTimer = time;
      this.emitHud();
    }
    if (this.markersDirty) {
      this.markersDirty = false;
      this.rebuildMarkers();
    }
  }

  private handleMovement(time: number, dt: number) {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    this.onGround = body.blocked.down || body.touching.down;
    if (this.onGround) this.lastGround = time;

    const speed = 250;
    let vx = 0;
    if (held.left) vx -= speed;
    if (held.right) vx += speed;
    if (vx !== 0) {
      this.facing = Math.sign(vx);
      this.player.setFlipX(this.facing < 0);
    }
    // keep momentum while airborne (a little)
    if (vx !== 0) body.setVelocityX(vx);
    else if (this.onGround) body.setVelocityX(Phaser.Math.Linear(body.velocity.x, 0, 0.35));
    else body.setVelocityX(Phaser.Math.Linear(body.velocity.x, 0, 0.08));

    const coyote = time - this.lastGround < 110;
    if (consume('jump')) this.jumpBuffered = time;
    if (this.jumpBuffered && time - this.jumpBuffered < 140 && coyote && !this.busy) {
      this.jumpBuffered = 0;
      body.setVelocityY(-600);
      sfx('jump');
      this.dust(this.player.x, this.player.y + 26);
    }

    // variable jump height
    if (!held.up && body.velocity.y < -220) body.setVelocityY(body.velocity.y * 0.86);

    // Doraemon glides with the bamboo copter while holding jump
    if (this.characterId === 'doraemon' && !this.onGround && body.velocity.y > 40 && held.up) {
      body.setVelocityY(70);
      if (this.copter) {
        this.copter.setVisible(true).setPosition(this.player.x, this.player.y - 34 + Math.sin(this.swirl * 12) * 2);
        this.copter.rotation += dt * 18;
      }
      if (Math.random() < 0.2) this.puff(this.player.x, this.player.y - 30);
    } else if (this.copter) {
      this.copter.setVisible(false);
    }

    // animation state
    const anim = !this.onGround ? 'jump' : Math.abs(body.velocity.x) > 20 ? 'walk' : 'idle';
    const key = `hero-${this.characterId}-${anim}`;
    if (this.player.anims.currentAnim?.key !== key) this.player.play(key, true);

    // depth by y so the hero walks behind/in front of props
    this.player.setDepth(this.player.y + 30);
    if (this.aura) this.aura.setPosition(this.player.x, this.player.y);

    if (this.onGround && !this.overWater(this.player.x)) {
      this.lastSafe.set(this.player.x, this.player.y);
    }
  }

  private overWater(x: number) {
    return this.zone.water.some((w) => x > w.x - 10 && x < w.x + w.w + 10);
  }

  private handleAbilityHeld(time: number, dt: number) {
    if (this.characterId !== 'ironman' || this.busy) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (held.ability && !this.onGround) {
      body.setVelocityY(Math.max(body.velocity.y - 1500 * dt, -420));
      if (this.aura) this.aura.setAlpha(0.55).setTint(0x8fe8ff);
      this.puff(this.player.x, this.player.y + 22);
      if (Math.random() < 0.5) this.puff(this.player.x - 12, this.player.y + 24);
      if (Math.random() < 0.5) this.puff(this.player.x + 12, this.player.y + 24);
    } else if (this.aura) {
      this.aura.setAlpha(0);
    }
  }

  /* ───────────────────────────── actions ───────────────────────────── */

  private handleActions() {
    if (consume('interact')) this.doInteract();
    if (consume('ability')) this.doAbility();
  }

  private doAbility() {
    if (this.busy) return;
    if (this.time.now < this.abilityUntil) return;
    const id = this.characterId;
    const player = this.player;

    switch (id) {
      case 'pikachu': {
        const lamp = this.nearestThing('lamp', 210);
        this.zap(lamp ? lamp.obj.x : player.x + this.facing * 90, lamp ? lamp.obj.y - 120 : player.y - 10);
        if (lamp && !lamp.lit) this.chargeLamp(lamp);
        else sfx('zap');
        this.abilityLast = 650;
        break;
      }
      case 'elsa': {
        const gap = this.nearestGap(140);
        if (gap) this.freezeGap(gap);
        else {
          this.iceBurst(player.x, player.y);
          this.bubble('Stand next to the river water!');
        }
        this.abilityLast = 600;
        break;
      }
      case 'doraemon': {
        const gears = this.things.filter((r) => r.thing.type === 'gear' && !r.taken && Phaser.Math.Distance.Between(r.obj.x, r.obj.y, player.x, player.y) < 340);
        if (gears.length) {
          gears.forEach((g, i) => this.magnetGear(g, i * 90));
          sfx('collect');
        } else {
          this.bubble('Magnet ready — get closer to a gear');
        }
        this.abilityLast = 500;
        break;
      }
      case 'spiderman': {
        const anchor = this.nearestAnchor(520);
        if (anchor) this.grapple(anchor.x, anchor.y);
        else this.bubble('No anchor in range');
        this.abilityLast = 800;
        break;
      }
      case 'ironman': {
        if (this.onGround) {
          const body = player.body as Phaser.Physics.Arcade.Body;
          body.setVelocityY(-360);
          sfx('jump');
        }
        this.flashAura(0x8fe8ff);
        this.abilityLast = 220;
        break;
      }
      case 'shinchan': {
        this.dance();
        this.abilityLast = 900;
        break;
      }
      case 'barbie': {
        this.outfit = (this.outfit + 1) % 3;
        this.flashAura([0xff8ad1, 0xb48cff, 0xffd166][this.outfit]);
        this.sparkle(player.x, player.y - 10, [0xff8ad1, 0xffd166, 0xb48cff], 10);
        sfx('collect');
        this.abilityLast = 400;
        break;
      }
      case 'bheem': {
        this.stomp();
        this.abilityLast = 700;
        break;
      }
    }
    this.abilityUntil = this.time.now + this.abilityLast;
  }

  private abilityLast = 500;

  private doInteract() {
    if (this.busy) return;
    const p = this.prompt;
    if (!p) return;
    switch (p.key) {
      case 'gear': {
        const rt = this.things.find((r) => r.thing.id === p.id);
        if (rt) this.magnetGear(rt, 0);
        break;
      }
      case 'windmill': {
        if (this.gearCount() >= 3) this.finishMission();
        break;
      }
      case 'lamp': {
        const rt = this.things.find((r) => r.thing.id === p.id);
        if (rt && !rt.lit) this.chargeLamp(rt);
        break;
      }
      case 'toy': {
        const rt = this.things.find((r) => r.thing.id === p.id);
        if (rt) this.collectThing(rt);
        break;
      }
      case 'part': {
        const rt = this.things.find((r) => r.thing.id === p.id);
        if (rt) this.collectThing(rt);
        break;
      }
      case 'crate': {
        const rt = this.things.find((r) => r.thing.id === p.id);
        if (rt) this.pickCrate(rt);
        break;
      }
      case 'hearth': {
        if (this.carried) this.deliverCrate();
        else this.bubble('Carry a wood crate here!');
        break;
      }
      case 'flower': {
        const rt = this.things.find((r) => r.thing.id === p.id);
        if (rt) this.plantFlower(rt);
        break;
      }
      case 'villager': {
        const rt = this.things.find((r) => r.thing.id === p.id);
        if (rt) this.rescueVillager(rt);
        break;
      }
      case 'generator': {
        if (this.partCount() >= 3) this.finishMission();
        else this.bubble('Find all three machine parts first');
        break;
      }
      case 'npc': {
        const npc = this.npcs.find((n) => n.obj === this.things.find((r) => r.thing.id === p.label)?.obj);
        if (npc) this.bubble(`${npc.label.text}: ${this.npcLine(npc.label.text)}`);
        break;
      }
      case 'sign': {
        this.bubble(p.label);
        break;
      }
      case 'gap': {
        const gap = this.nearestGap(140);
        if (gap) this.freezeGap(gap);
        break;
      }
      case 'gate': {
        this.bubble('Walk further to explore the next land!');
        break;
      }
    }
  }

  private npcLine(name: string) {
    const lines: Record<string, string> = {
      Chutki: 'The windmill is stuck again. Gears everywhere!',
      Raju: 'Have you seen the lamps? They are all dark.',
      Nobita: 'Doraemon! Your gadgets are amazing.',
      Jaggu: 'The garden beds are empty. The bees are sad.',
      Tinker: 'Flowers make the whole forest sparkle.',
      Anna: 'The river is too wide to cross. Elsa can freeze it!',
      Olaf: 'I love warm hugs… and warm hearths!',
    };
    return lines[name] ?? 'What an adventure today!';
  }

  /* ───────────────────────────── interaction logic ───────────────────────────── */

  private chargeLamp(rt: Runtime) {
    if (rt.lit) return;
    rt.lit = true;
    (rt.obj as Phaser.GameObjects.Image).setTexture('lamp-on');
    rt.glow?.setAlpha(0.85);
    this.sparkle(rt.obj.x, rt.obj.y - 130, [0xfff3b0, 0xffd166], 12);
    sfx('zap');
    if (this.characterId === 'pikachu') this.addProgress(rt.thing.id, 3);
    this.markersDirty = true;
  }

  private collectThing(rt: Runtime) {
    if (rt.taken) return;
    rt.taken = true;
    (rt.obj as Phaser.GameObjects.Sprite).setVisible(false);
    rt.glow?.setVisible(false);
    if (this.characterId === 'shinchan') {
      this.addProgress(rt.thing.id, 3);
      this.dance();
    }
    if (this.characterId === 'ironman') {
      this.addProgress(rt.thing.id, 3);
    }
    this.sparkle(rt.obj.x, rt.obj.y, [0xfff3b0, 0x8fe8ff], 10);
    sfx('collect');
    this.markersDirty = true;
  }

  private magnetGear(rt: Runtime, delay = 0) {
    if (rt.taken) return;
    rt.taken = true;
    const target = this.player;
    this.time.delayedCall(delay, () => {
      this.tweens.add({
        targets: rt.obj,
        x: target.x,
        y: target.y - 6,
        scale: 0.4,
        duration: 340,
        ease: 'Cubic.in',
        onComplete: () => {
          rt.obj.setVisible(false);
          rt.glow?.setVisible(false);
          this.sparkle(target.x, target.y, [0xffffff, 0xffd166], 8);
          sfx('collect');
          if (this.characterId === 'doraemon') this.addProgress(rt.thing.id, 3);
        },
      });
    });
    this.markersDirty = true;
  }

  private pickCrate(rt: Runtime) {
    if (this.carried) {
      this.dropCrate();
      return;
    }
    if (rt.carrying) return;
    if (this.characterId !== 'bheem') {
      this.bubble('Too heavy! Chhota Bheem can lift this.');
      return;
    }
    rt.carrying = true;
    this.carried = rt;
    const body = (rt.obj as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.Body;
    body.enable = false;
    sfx('carry');
    this.bubble('Crate lifted — carry it to the hearth');
  }

  private dropCrate() {
    const rt = this.carried;
    if (!rt) return;
    rt.carrying = false;
    const body = (rt.obj as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.Body;
    body.enable = true;
    (rt.obj as Phaser.Physics.Arcade.Sprite).setPosition(this.player.x + this.facing * 40, this.player.y - 20);
    this.carried = null;
    this.markersDirty = true;
  }

  private deliverCrate() {
    const rt = this.carried;
    if (!rt) return;
    this.carried = null;
    rt.taken = true;
    rt.carrying = false;
    (rt.obj as Phaser.GameObjects.Sprite).setVisible(false);
    this.sparkle(rt.obj.x, rt.obj.y, [0xff9a3c, 0xffd166], 12);
    sfx('collect');
    this.addProgress(rt.thing.id, 3);
    this.markersDirty = true;
  }

  private plantFlower(rt: Runtime) {
    if (rt.taken) return;
    rt.taken = true;
    (rt.obj as Phaser.GameObjects.Image).setTexture('flower-bloom');
    this.sparkle(rt.obj.x, rt.obj.y - 20, [0xff8ad1, 0xffd166, 0xb48cff], 14);
    sfx('collect');
    if (this.characterId === 'barbie') this.addProgress(rt.thing.id, 3);
    this.markersDirty = true;
  }

  private rescueVillager(rt: Runtime) {
    if (rt.taken) return;
    rt.taken = true;
    this.sparkle(rt.obj.x, rt.obj.y - 20, [0xffffff, 0x8fe8ff], 10);
    this.tweens.add({
      targets: rt.obj,
      alpha: 0,
      y: rt.obj.y - 40,
      duration: 500,
      onComplete: () => rt.obj.setVisible(false),
    });
    sfx('collect');
    this.addProgress(rt.thing.id, 2);
    this.bubble('Friend rescued!');
    this.markersDirty = true;
  }

  private freezeGap(gap: { id: string; x: number; w: number }) {
    if (this.save.flags.includes('icebridge')) return;
    if (this.frozenGaps.has(gap.id)) return;
    this.frozenGaps.add(gap.id);
    const cx = gap.x + gap.w / 2;
    const y = GROUND_Y - 18;
    const ice = this.add.tileSprite(gap.x + gap.w / 2, y, gap.w, 40, 'ice-platform').setDepth(8);
    this.addSolidBox(cx, y + 16, gap.w, 30);
    ice.setAlpha(0);
    this.tweens.add({ targets: ice, alpha: 1, duration: 260 });
    this.iceBurst(cx, y);
    sfx('freeze');
    this.addProgress(gap.id, 3);
    this.markersDirty = true;
  }

  private frozenGaps = new Set<string>();

  private dance() {
    this.bubbles('♪ ♫ ♪', 0xff8ad1);
    sfx('collect');
    this.tweens.add({ targets: this.player, angle: this.facing * 10, duration: 120, yoyo: true, repeat: 2, onComplete: () => this.player.setAngle(0) });
    this.npcs.forEach((n) => {
      if (Phaser.Math.Distance.Between(n.obj.x, n.obj.y, this.player.x, this.player.y) < 420) {
        this.tweens.add({ targets: n.obj, y: n.obj.y - 18, duration: 150, yoyo: true, repeat: 2, ease: 'Quad.out' });
        this.sparkle(n.obj.x, n.obj.y - 50, [0xff8ad1, 0xffd166], 4);
      }
    });
    this.things
      .filter((r) => r.thing.type === 'crate' && !r.taken)
      .forEach((r) => {
        if (Phaser.Math.Distance.Between(r.obj.x, r.obj.y, this.player.x, this.player.y) < 320) {
          const body = (r.obj as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.Body;
          body.setVelocityY(-240);
        }
      });
  }

  private stomp() {
    this.cameras.main.shake(200, 0.006);
    this.things
      .filter((r) => r.thing.type === 'crate' && !r.taken && !r.carrying)
      .forEach((r) => {
        if (Phaser.Math.Distance.Between(r.obj.x, r.obj.y, this.player.x, this.player.y) < 260) {
          const body = (r.obj as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.Body;
          body.setVelocityY(-300);
          body.setVelocityX(Phaser.Math.Between(-60, 60));
        }
      });
    this.sparkle(this.player.x, this.player.y + 20, [0xffd166, 0xffffff], 12);
    sfx('repair');
  }

  /* ───────────────────────────── prompts ───────────────────────────── */

  private nearestThing(type: string, radius: number): Runtime | null {
    let best: Runtime | null = null;
    let bestD = radius;
    this.things.forEach((r) => {
      if (r.thing.type !== type || r.taken) return;
      const d = Phaser.Math.Distance.Between(r.obj.x, r.obj.y, this.player.x, this.player.y);
      if (d < bestD) {
        bestD = d;
        best = r;
      }
    });
    return best as Runtime | null;
  }

  private nearestAnchor(radius: number): { x: number; y: number } | null {
    let best: { x: number; y: number } | null = null;
    let bestD = radius;
    this.zone.anchors.forEach((a) => {
      const d = Phaser.Math.Distance.Between(a.x, a.y, this.player.x, this.player.y);
      if (d < bestD) {
        bestD = d;
        best = a;
      }
    });
    return best as { x: number; y: number } | null;
  }

  private updatePrompt() {
    const id = this.characterId;
    const cand: { label: string; key: string; id: string; x: number; y: number; d: number }[] = [];
    const push = (label: string, key: string, thingId: string, x: number, y: number, range = 120) => {
      const d = Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y);
      if (d < range) cand.push({ label, key, id: thingId, x, y, d });
    };

    this.things.forEach((r) => {
      if (r.taken) return;
      const t = r.thing;
      const x = r.obj.x;
      const y = r.obj.y;
      if (t.type === 'gear' && id === 'doraemon' && !this.litGears().has(t.id)) push('Magnet the gear', 'gear', t.id, x, y, 115);
      if (t.type === 'lamp' && id === 'pikachu' && !r.lit) push('Zap the lamp', 'lamp', t.id, x, y, 130);
      if (t.type === 'toy' && id === 'shinchan') push('Pick up the toy', 'toy', t.id, x, y, 115);
      if (t.type === 'crate' && id === 'bheem' && !this.carried) push('Lift the crate', 'crate', t.id, x, y, 115);
      if (t.type === 'flowerBed' && id === 'barbie' && !r.taken) push('Plant a flower', 'flower', t.id, x, y, 115);
      if (t.type === 'villager' && id === 'spiderman' && !r.taken) push('Rescue the villager', 'villager', t.id, x, y, 125);
      if (t.type === 'part' && id === 'ironman') push('Collect the part', 'part', t.id, x, y, 115);
      if (t.type === 'npc') push(`Talk to ${t.label ?? 'friend'}`, 'npc', t.id, x, y, 120);
      if (t.type === 'sign') push(t.label ?? 'Read the sign', 'sign', t.id, x, y, 120);
    });

    if (id === 'doraemon' && this.gearCount() >= 3 && !this.save.flags.includes('windmill')) {
      const wm = this.things.find((r) => r.thing.type === 'windmill');
      if (wm) push('Fit the three gears', 'windmill', 'windmill', wm.obj.x, wm.obj.y - 40, 160);
    }
    if (id === 'bheem' && !this.save.flags.includes('firewood')) {
      const h = this.things.find((r) => r.thing.type === 'hearth');
      if (h) push(this.carried ? 'Drop the crate here' : 'Warm the hearth', 'hearth', 'hearth', h.obj.x, h.obj.y - 30, 160);
    }
    if (id === 'ironman' && this.partCount() >= 3 && !this.save.flags.includes('generator')) {
      const g = this.things.find((r) => r.thing.type === 'generator');
      if (g) push('Repair the generator', 'generator', 'generator', g.obj.x, g.obj.y - 50, 170);
    }
    if (id === 'elsa') {
      const gap = this.nearestGap(150);
      if (gap) push('Freeze the water (Q)', 'gap', gap.id, gap.x + gap.w / 2, GROUND_Y - 30, 260);
    } else if (!this.save.flags.includes('icebridge')) {
      const gap = this.nearestGap(120);
      if (gap) cand.push({ label: 'The river blocks the way — Elsa can freeze it!', key: 'gate', id: 'gate', x: gap.x + gap.w / 2, y: GROUND_Y - 30, d: 999 });
    }

    cand.sort((a, b) => a.d - b.d);
    const best = cand[0];
    this.prompt = best
      ? { label: best.label, key: best.key, id: best.id, x: best.x, y: best.y }
      : null;
  }

  private nearestGap(radius: number): { id: string; x: number; w: number } | null {
    let best: { id: string; x: number; w: number } | null = null;
    let bestD = Infinity;
    this.zone.water.forEach((gap) => {
      if (this.frozenGaps.has(gap.id) || this.save.flags.includes('icebridge')) return;
      const d = Math.abs(gap.x + gap.w / 2 - this.player.x);
      if (d < gap.w / 2 + radius && d < bestD && Math.abs(this.player.y - (GROUND_Y - 30)) < 170) {
        bestD = d;
        best = gap;
      }
    });
    return best;
  }

  /* ───────────────────────────── world state ───────────────────────────── */

  private addProgress(id: string, total: number) {
    const mission = this.mission;
    if (!mission) return;
    const st = this.save.missions[mission.id] ?? { progress: [], done: false };
    if (!st.progress.includes(id)) st.progress.push(id);
    this.save.missions[mission.id] = st;
    writeSave(this.save);
    this.emitHud(true);
    this.markersDirty = true;
    const count = st.progress.length;
    this.floatText(`+1 ${mission.objective.verb.split(' ')[0]}`, this.player.x, this.player.y - 40, '#fff3b0');
    if (count >= total) {
      if (mission.id === 'm-windmill' || mission.id === 'm-generator') {
        this.bubble(mission.id === 'm-windmill' ? 'Now fit the gears in the windmill!' : 'Now repair the generator!');
      } else {
        this.finishMission();
      }
    }
  }

  private finishMission() {
    const mission = this.mission;
    if (!mission) return;
    const st = this.save.missions[mission.id] ?? { progress: [], done: false };
    if (st.done) return;
    st.done = true;
    this.save.missions[mission.id] = st;
    if (!this.save.flags.includes(mission.flag)) this.save.flags.push(mission.flag);
    writeSave(this.save);
    this.applyFlags();
    this.markersDirty = true;
    this.emitHud(true);
    sfx('win');
    this.cameras.main.flash(260, 255, 255, 255);
    this.confetti(this.player.x, this.player.y - 60);
    bus.emit('mission-complete', { id: mission.id, title: mission.title, reward: mission.reward, zone: this.zoneId });
  }

  private applyFlags() {
    const flags = this.save.flags;
    // windmill
    const wm = this.things.find((r) => r.thing.type === 'windmill');
    if (wm && wm.extra) {
      const blades = wm.extra as Phaser.GameObjects.Image;
      this.tweens.killTweensOf(blades);
      if (flags.includes('windmill')) {
        blades.setAngle(0);
        this.tweens.add({ targets: blades, angle: 360, duration: 9000, repeat: -1 });
        wm.obj.clearTint();
      } else {
        blades.setAngle(24);
        blades.setTint(0x9a8f80);
      }
    }
    // lamps
    this.things
      .filter((r) => r.thing.type === 'lamp')
      .forEach((r) => {
        r.lit = flags.includes('lamps');
        (r.obj as Phaser.GameObjects.Image).setTexture(r.lit ? 'lamp-on' : 'lamp-off');
        r.glow?.setAlpha(r.lit ? 0.85 : 0);
      });
    // garden
    this.things
      .filter((r) => r.thing.type === 'flowerBed')
      .forEach((r) => (r.obj as Phaser.GameObjects.Image).setTexture(flags.includes('garden') ? 'flower-bloom' : 'flower-empty'));
    // hearth
    this.things
      .filter((r) => r.thing.type === 'hearth')
      .forEach((r) => r.glow?.setAlpha(flags.includes('firewood') ? 0.95 : 0.3));
    // generator
    this.things
      .filter((r) => r.thing.type === 'generator')
      .forEach((r) => r.glow?.setAlpha(flags.includes('generator') ? 0.85 : 0));
    // rescued friends now warm themselves by the castle
    if (flags.includes('rescued')) {
      const rescued = this.things.filter((r) => r.thing.type === 'villager' && r.taken);
      rescued.forEach((r, i) => {
        const obj = r.obj as Phaser.GameObjects.Image;
        obj.setTexture('villager-warm').setVisible(true).setAlpha(1);
        obj.setPosition(ZONE * 2 + 2280 + i * 55, GROUND_Y - 2).setDepth(GROUND_Y);
        obj.setOrigin(0.5, 1);
      });
    }
    // toys returned to the playground
    if (flags.includes('toys') && !this.toysShown) {
      this.toysShown = true;
      [2225, 2290, 2350].forEach((x, i) => {
        const toy = this.add.image(x, GROUND_Y - 6, 'toy').setDepth(GROUND_Y - 1).setScale(0.85 + i * 0.05);
        this.tweens.add({ targets: toy, y: toy.y - 8, duration: 900 + i * 120, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      });
    }
    // ice bridge (every land, so it is rebuilt wherever the player starts)
    if (flags.includes('icebridge')) {
      ZONES.filter((z) => z.id === 'frozen').forEach((zone) => {
        zone.water.forEach((gap) => {
          if (this.frozenGaps.has(gap.id)) return;
          this.frozenGaps.add(gap.id);
          const y = GROUND_Y - 18;
          this.add.tileSprite(gap.x + gap.w / 2, y, gap.w, 40, 'ice-platform').setDepth(8);
          this.addSolidBox(gap.x + gap.w / 2, y + 16, gap.w, 30);
        });
      });
    }
  }

  private gearCount() {
    return (this.save.missions['m-windmill']?.progress.length ?? 0);
  }
  private partCount() {
    return (this.save.missions['m-generator']?.progress.length ?? 0);
  }
  private litGears() {
    return new Set(this.save.missions['m-windmill']?.progress ?? []);
  }

  private rebuildMarkers() {
    this.markers.forEach((m) => m.destroy());
    this.markers = [];
    if (!this.mission) return;
    const st = this.save.missions[this.mission.id] ?? { progress: [], done: false };
    if (st.done) return;
    const done = new Set(st.progress);
    const mark = (x: number, y: number) => {
      const m = this.add.sprite(x, y, 'marker').setDepth(2200).setScale(0.9);
      this.tweens.add({ targets: m, y: y - 14, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.markers.push(m);
    };
    switch (this.characterId) {
      case 'doraemon': {
        if (done.size >= 3) {
          const wm = this.things.find((r) => r.thing.type === 'windmill');
          if (wm) mark(wm.obj.x, wm.obj.y - 230);
        } else {
          this.things.filter((r) => r.thing.type === 'gear' && !done.has(r.thing.id)).forEach((r) => mark(r.obj.x, r.obj.y - 50));
        }
        break;
      }
      case 'pikachu':
        this.things.filter((r) => r.thing.type === 'lamp' && !done.has(r.thing.id)).forEach((r) => mark(r.obj.x, r.obj.y - 185));
        break;
      case 'shinchan':
        this.things.filter((r) => r.thing.type === 'toy' && !done.has(r.thing.id)).forEach((r) => mark(r.obj.x, r.obj.y - 46));
        break;
      case 'bheem':
        this.things.filter((r) => r.thing.type === 'crate' && !done.has(r.thing.id)).forEach((r) => mark(r.obj.x, r.obj.y - 52));
        break;
      case 'barbie':
        this.things.filter((r) => r.thing.type === 'flowerBed').forEach((r) => mark(r.obj.x, r.obj.y - 58));
        break;
      case 'elsa':
        this.zone.water.filter((g) => !done.has(g.id)).forEach((g) => mark(g.x + g.w / 2, 420));
        break;
      case 'spiderman':
        this.things.filter((r) => r.thing.type === 'villager' && !done.has(r.thing.id)).forEach((r) => mark(r.obj.x, r.obj.y - 82));
        break;
      case 'ironman': {
        this.things.filter((r) => r.thing.type === 'part' && !done.has(r.thing.id)).forEach((r) => mark(r.obj.x, r.obj.y - 46));
        if (done.size >= 3) {
          const g = this.things.find((r) => r.thing.type === 'generator');
          if (g) mark(g.obj.x, g.obj.y - 140);
        }
        break;
      }
    }
  }

  /* ───────────────────────────── fx ───────────────────────────── */

  private sparkle(x: number, y: number, tints: number[], count = 8) {
    const e = this.add.particles(x, y, 'spark', {
      speed: { min: 40, max: 170 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 520,
      quantity: count,
      tint: tints,
      blendMode: 'ADD',
      emitting: false,
    });
    e.setDepth(2500);
    e.explode(count);
    this.time.delayedCall(700, () => e.destroy());
  }

  private iceBurst(x: number, y: number) {
    this.sparkle(x, y, [0xdff4ff, 0x8fd0ff, 0xffffff], 18);
    this.cameras.main.flash(120, 200, 240, 255);
  }

  private confetti(x: number, y: number) {
    const e = this.add.particles(x, y, 'spark', {
      speed: { min: 120, max: 320 },
      angle: { min: 200, max: 340 },
      gravityY: 500,
      lifespan: 1400,
      scale: { start: 1.3, end: 0.2 },
      quantity: 40,
      tint: [0xffd166, 0xff8ad1, 0x8fe8ff, 0xb8ff9f],
      blendMode: 'ADD',
      emitting: false,
    });
    e.setDepth(2600);
    e.explode(40);
    this.time.delayedCall(1800, () => e.destroy());
  }

  private dust(x: number, y: number) {
    const e = this.add.particles(x, y, 'spark', {
      speed: { min: 20, max: 70 },
      angle: { min: 210, max: 330 },
      lifespan: 400,
      scale: { start: 0.6, end: 0 },
      quantity: 6,
      tint: [0xffffff, 0xfff3b0],
      emitting: false,
    });
    e.setDepth(700);
    e.explode(6);
    this.time.delayedCall(500, () => e.destroy());
  }

  private puff(x: number, y: number) {
    if (Math.random() > 0.35) return;
    const e = this.add.particles(x, y, 'spark', {
      speed: { min: 10, max: 40 },
      lifespan: 320,
      scale: { start: 0.5, end: 0 },
      quantity: 1,
      tint: [0x8fe8ff, 0xffffff],
      blendMode: 'ADD',
      emitting: false,
    });
    e.setDepth(650);
    e.explode(1);
    this.time.delayedCall(380, () => e.destroy());
  }

  private bubbles(text: string, color: number) {
    const t = this.add
      .text(this.player.x, this.player.y - 60, text, {
        fontFamily: '"Baloo 2", "Fredoka", sans-serif',
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#7a3f8a',
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(2700);
    this.tweens.add({
      targets: t,
      y: t.y - 50,
      alpha: 0,
      duration: 900,
      onComplete: () => t.destroy(),
    });
    void color;
  }

  private bubble(text: string) {
    const t = this.add
      .text(this.player.x, this.player.y - 64, text, {
        fontFamily: '"Baloo 2", "Fredoka", sans-serif',
        fontSize: '17px',
        color: '#2b2b4b',
        backgroundColor: '#fffdf2',
        padding: { x: 12, y: 8 },
        align: 'center',
        wordWrap: { width: 320 },
      })
      .setOrigin(0.5)
      .setDepth(2700);
    this.tweens.add({ targets: t, y: t.y - 26, alpha: 0, delay: 1500, duration: 600, onComplete: () => t.destroy() });
  }

  private floatText(text: string, x: number, y: number, color: string) {
    const t = this.add
      .text(x, y, text, {
        fontFamily: '"Baloo 2", "Fredoka", sans-serif',
        fontSize: '22px',
        color,
        stroke: '#2b2b4b',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(2700);
    this.tweens.add({ targets: t, y: y - 40, alpha: 0, duration: 800, onComplete: () => t.destroy() });
  }

  private zap(x: number, y: number) {
    const gfx = this.add.graphics().setDepth(2400);
    const sx = this.player.x;
    const sy = this.player.y - 10;
    gfx.lineStyle(4, 0xfff3b0, 1);
    gfx.beginPath();
    gfx.moveTo(sx, sy);
    const steps = 6;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      gfx.lineTo(
        Phaser.Math.Linear(sx, x, t) + Phaser.Math.Between(-12, 12),
        Phaser.Math.Linear(sy, y, t) + Phaser.Math.Between(-12, 12),
      );
    }
    gfx.strokePath();
    gfx.lineStyle(1.5, 0xffffff, 1);
    gfx.strokePath();
    this.sparkle(x, y, [0xfff3b0, 0xffffff], 10);
    this.tweens.add({ targets: gfx, alpha: 0, duration: 260, onComplete: () => gfx.destroy() });
  }

  private grapple(x: number, y: number) {
    this.busy = true;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.enable = false;
    const line = this.add.graphics().setDepth(2400);
    sfx('jump');
    this.tweens.add({
      targets: this.player,
      x,
      y: y + 26,
      duration: 460,
      ease: 'Cubic.out',
      onUpdate: () => {
        line.clear();
        line.lineStyle(3, 0xffffff, 1);
        line.beginPath();
        line.moveTo(this.player.x, this.player.y - 20);
        line.lineTo(x, y);
        line.strokePath();
      },
      onComplete: () => {
        line.destroy();
        body.enable = true;
        body.setVelocity(0, 120);
        this.busy = false;
        this.sparkle(x, y, [0xffffff, 0x8fe8ff], 8);
      },
    });
  }

  private flashAura(color: number) {
    if (!this.aura) return;
    this.aura.setTint(color).setAlpha(0.8);
    this.tweens.add({ targets: this.aura, alpha: 0, duration: 500 });
  }

  private showZoneBanner() {
    const zone = this.zone;
    const text = this.add
      .text(this.scale.width / 2, 210, zone.name, {
        fontFamily: '"Baloo 2", "Fredoka", sans-serif',
        fontSize: '30px',
        color: '#ffffff',
        stroke: '#2b2b4b',
        strokeThickness: 7,
        backgroundColor: 'rgba(43,43,75,0.45)',
        padding: { x: 18, y: 6 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(3000)
      .setAlpha(0);
    text.setPosition(this.scale.width / 2, 210);
    this.tweens.add({ targets: text, alpha: 1, duration: 500, hold: 1400, yoyo: true, onComplete: () => text.destroy() });
  }

  /* ───────────────────────────── per-frame helpers ───────────────────────────── */

  private updateZone() {
    const zone = zoneAt(this.player.x);
    if (zone.id === this.zoneId) return;
    this.zoneId = zone.id;
    this.zone = zone;
    this.save.zone = zone.id;
    writeSave(this.save);
    this.showZoneBanner();
    this.markersDirty = true;
    this.emitHud(true);
  }

  private updateVisuals(_time: number, dt: number) {
    this.waters.forEach((w) => {
      w.tilePositionX += dt * 18;
    });
    if (this.aura && !this.aura.alpha) this.aura.setPosition(this.player.x, this.player.y);
    if (this.copter && !this.copter.visible) this.copter.setPosition(this.player.x, this.player.y - 34);
    if (this.carried) {
      const c = this.carried.obj as Phaser.Physics.Arcade.Sprite;
      c.setPosition(this.player.x + this.facing * 6, this.player.y - 48);
    }
  }

  private updateCarried() {
    if (!this.carried) return;
    const body = (this.carried.obj as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.Body;
    body.enable = false;
  }

  private checkFall() {
    if (this.player.y > 760) {
      this.player.setPosition(this.lastSafe.x, this.lastSafe.y - 40);
      (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
      this.cameras.main.flash(180, 120, 190, 255);
      this.bubble('Whoops! Back to the path');
    }
  }

  /* ───────────────────────────── HUD / debug ───────────────────────────── */

  private emitHud(force = false) {
    const st = this.save.missions[this.mission?.id ?? ''] ?? { progress: [], done: false };
    const done = this.mission ? (st.done || this.save.flags.includes(this.mission.flag)) : false;
    const hud: HudState = {
      zoneId: this.zoneId,
      zoneName: zoneAt(this.player.x).name,
      characterId: this.characterId,
      missionId: this.mission?.id ?? null,
      missionTitle: this.mission?.title ?? '',
      missionGoal: this.mission?.goal ?? '',
      objectiveLabel: this.mission?.objective.label ?? '',
      progress: Math.min(st.progress.length, this.mission?.objective.total ?? 0),
      total: this.mission?.objective.total ?? 0,
      done,
      prompt: this.prompt?.label ?? null,
      abilityName: ABILITY_KEY[this.characterId] ?? '',
      abilityReady: this.time.now >= this.abilityUntil,
      carried: Boolean(this.carried),
      flags: [...this.save.flags],
    };
    const key = JSON.stringify(hud);
    if (!force && key === this.hudLast) return;
    this.hudLast = key;
    bus.emit('hud', hud);
    bus.emit('save-changed');
  }

  private setCharacter(id: string) {
    if (!playableById(id) || id === this.characterId) {
      this.setPaused(false);
      return;
    }
    if (this.carried) this.dropCrate();
    this.characterId = id;
    this.save.character = id;
    writeSave(this.save);
    this.mission = missionFor(id)!;
    this.player.setTexture(`hero-${id}`);
    this.createHeroAnims(id);
    this.player.play(`hero-${id}-idle`);
    this.player.setAngle(0);
    this.abilityUntil = 0;
    this.markersDirty = true;
    this.sparkle(this.player.x, this.player.y, [0xffffff, 0xffd166, 0x8fe8ff], 16);
    this.setPaused(false);
    this.emitHud(true);
    bus.emit('character-changed', id);
  }

  private setPaused(value: boolean) {
    if (this.paused === value) return;
    this.paused = value;
    releaseAll();
    if (value) clearQueue();
    // the scene can be shutting down while React still broadcasts a pause
    try {
      if (value) {
        if (this.scene.isActive()) this.scene.pause();
      } else if (this.scene.isPaused()) {
        this.scene.resume();
      }
    } catch {
      /* scene already destroyed */
    }
  }

  private exposeDebug() {
    (window as unknown as Record<string, unknown>).__cv = {
      state: () => ({
        x: Math.round(this.player.x),
        y: Math.round(this.player.y),
        character: this.characterId,
        zone: this.zoneId,
        flags: [...this.save.flags],
        mission: this.mission?.id,
        progress: this.save.missions[this.mission?.id ?? '']?.progress ?? [],
        done: Boolean(this.save.missions[this.mission?.id ?? '']?.done),
        prompt: this.prompt?.label ?? null,
        carried: Boolean(this.carried),
        frozenGaps: [...this.frozenGaps],
        markerCount: this.markers.length,
      }),
      warp: (x: number, y = 480) => {
        this.player.setPosition(x, y);
        (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
        this.lastSafe.set(x, y);
      },
      interact: () => this.doInteract(),
      ability: () => this.doAbility(),
      press: (a: 'jump' | 'interact' | 'ability') => press(a),
      hold: (k: 'left' | 'right' | 'up' | 'down', v: boolean) => {
        held[k] = v;
      },
      setCharacter: (id: string) => this.setCharacter(id),
    };
  }
}

function sprRange(y: number, groundY: number) {
  return y < groundY - 120 ? 130 : 120;
}
