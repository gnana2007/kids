# CharacterVerse — One World. Many Adventures.

A genuinely playable **2D platformer-adventure** for children. The island of Everlight is one
connected world: you pick a beloved hero (Doraemon, Pikachu, Elsa, Spider-Man, Iron Man,
Shinchan, Barbie, Chhota Bheem), walk, jump and use that hero's **real ability**, and every
change you make — lamps lit, gears fitted, ice bridges frozen, machines repaired — stays
**visible to every other hero** and survives reloads.

This is a working game, not a mockup: Phaser 3 drives movement, physics, collisions,
abilities, missions and the animated world. React only draws the menus, HUD and touch
controls around the canvas.

---

## Play it

```bash
npm install        # installs dependencies
npm run dev        # → http://localhost:5173
```

Production build & preview:

```bash
npm run build      # type-checks + bundles to dist/
npm run preview    # → http://localhost:4173
```

## Controls

| Action | Desktop | Touch |
| --- | --- | --- |
| Walk | `←` `→` / `A` `D` | Virtual joystick (left) |
| Jump (hold for higher) | `Space` / `W` | JUMP button |
| Pick up / talk / plant / carry / rescue | `E` | E button |
| Hero ability | `Q` | Q button (hold) |

Hero abilities are physical, not quiz-based:

- **Doraemon – Gadget Pocket:** the magnet pulls iron gears across the world; holding jump
  in the air glides with the Bamboo Copter.
- **Pikachu – Thunder Zap:** standing near a lamp post (or pressing `Q`) charges it with a
  bolt of lightning.
- **Elsa – Ice Magic:** freeze river water into a solid, walkable ice bridge.
- **Spider-Man – Web Swing:** grapple a glowing anchor and swing up to high ledges.
- **Iron Man – Jet Thrusters:** hold `Q` in the air to fly; repair machines with parts.
- **Shinchan – Silly Dance:** makes everyone giggle; hunt the three lost toys.
- **Barbie – Style Switch:** changes outfit sparkles; plant flowers in the garden beds.
- **Chhota Bheem – Super Strength:** lift wood crates and carry them to the hearth.

## The shared world

Everything is saved locally (`localStorage`, key `characterverse:world:v1`) the moment it
happens. Flags drive the world's look and physics:

| Mission | World change |
| --- | --- |
| The Windmill's Gears (Doraemon) | Windmill blades spin again |
| Lights of Village Square (Pikachu) | Lamps glow gold |
| The Missing Toys (Shinchan) | Toys gather at the playground |
| Firewood for the Hearth (Bheem) | Hearth fire blazes |
| Bloom the Whisper Garden (Barbie) | Garden flowers bloom |
| Bridge of Ice (Elsa) | A walkable ice bridge appears (for everyone) |
| Snowbound Friends (Spider-Man) | Rescued friends warm up by the castle |
| The Frozen Generator (Iron Man) | Generator hums with light |

Because the world is one continuous map (Cartoon Village → Magical Forest → Frozen
Kingdom), you can switch heroes mid-run from the HUD: the island stays exactly as you left
it. The River blocks the Frozen Kingdom until Elsa builds her bridge — a designed
"switch heroes" moment.

## Architecture

```
src/
├─ game/
│  ├─ characters.ts        # 8 playable heroes + ~80 more shown as "coming soon"
│  ├─ missions.ts          # 8 character missions -> world flags
│  ├─ world.ts             # zone data: terrain, platforms, water, things
│  ├─ save.ts              # localStorage persistence
│  ├─ input.ts             # shared input state (keyboard + touch)
│  ├─ bus.ts               # scene ↔ React event bus + HUD state
│  ├─ sound.ts             # WebAudio sound effects
│  ├─ scenes/
│  │  ├─ BootScene.ts      # generates all art textures (no assets to load)
│  │  └─ WorldScene.ts     # movement, physics, abilities, missions, world state
│  ├─ art/
│  │  ├─ sprites.ts        # procedural animated character sheets (8 frames)
│  │  └─ scenery.ts        # procedural backgrounds, tiles, props, fx
│  └─ PhaserGame.tsx       # React wrapper that owns one Phaser game
├─ screens/                # Title, Character Select, Island Map, Game (HUD+overlays)
└─ ui/                     # shared UI pieces + How-to-play
```

Design decisions:

- **No artistic assets to load.** Every sprite, background, prop and effect is drawn with
  canvas at boot, so the game works offline and has no licensing risk.
- **Art is honest.** Heroes are stylised, recognisable *placeholder* drawings — they are
  not official licensed artwork, and the game never claims otherwise.
- **Missions are exploration, not quizzes.** No multiple choice, no Q&A — every objective
  is movement, physics or a character power.
- **Game logic lives in Phaser; React never touches the world** except through the bus
  (pause, switch hero, HUD state).

## Testing

The game ships Playwright smoke/E2E scripts (edge channel on Windows). They verify real
gameplay: movement, jumping, E pick-up, grapple, flight, the touch joystick, all 8 mission
completions, hero switching, zone travel, and persistence across reloads.

```bash
npm run preview          # terminal 1
URL=http://localhost:4173 npm run test:e2e      # full mission story (8/8)
URL=http://localhost:4173 node scripts/controls.mjs   # input + travel + touch
URL=http://localhost:4173 node scripts/smoke.mjs      # quick screen pass
URL=http://localhost:4173 node scripts/final.mjs      # persistence, hero switch, reset
```

Pass state: all assertions green, zero console errors/warnings. Screenshots land in `shots/`
(gitignored).

## Status & roadmap

**Done (playable now):** 8 heroes with abilities, 3 connected lands, 8 missions, shared
persistent world, character switching, touch controls, procedural art, save/reset, E2E.

**Not built (intentionally):** Pokémon Forest, Superhero City, Future Laboratory, Mountain
Village, Magical Castle and Ocean World are shown on the map as previews ("coming soon");
~80 additional heroes are listed in the catalogue but locked. Adding a land = adding one
`ZoneDef` to `src/game/world.ts`; adding a hero = one sprite painter + one `MissionDef`.

**Licensing note:** replace the procedural sprites with licensed artwork for commercial
release; the sprite system is a single canvas painter per character, so swapping art is
contained.

## Built with

React 18 · Vite · TypeScript · Phaser 3.90 · Tailwind CSS · Framer Motion · Lucide.