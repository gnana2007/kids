# CharacterVerse

**One World. Many Characters. Endless Adventures.**

A playable children's adventure game built with React, Vite, TypeScript, Tailwind CSS and Framer Motion.
Choose a hero, solve a hands-on challenge, and watch the shared island of CharacterVerse change because of
what you did.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle in dist/
npm run preview  # serve the production build
```

No backend, accounts, API keys or network calls are used at runtime. Progress lives in `localStorage`
(key: `characterverse:progress:v1`).

---

## What is playable

### The shared story — “The Storm on the River”

Five linked chapters, each unlocking the next. Every chapter permanently changes the island map.

| Ch. | Hero        | Challenge                                        | World change                  |
| --- | ----------- | ------------------------------------------------ | ----------------------------- |
| 1   | Elsa        | Freeze a connected ice path across the river     | Ice path appears              |
| 2   | Doraemon    | Pick the right gadget for each riverside job     | Gadget crane on the bank      |
| 3   | Spider-Man  | Anchor a web bridge on strong bolts only         | Web bridge over the gorge     |
| 4   | Iron Man    | Assemble the village power machine               | Village windows light up      |
| 5   | Chhota Bheem| Deliver each rescue supply to the right place    | Villagers back home           |

Completing all five also awards the **🌟 Island Guardian** badge.

### Side adventures

| Hero     | Challenge                                            | World change                 |
| -------- | ---------------------------------------------------- | ---------------------------- |
| Pikachu  | Build a circuit in the right order + conduction test | Lightning Hill lamps light   |
| Shinchan | Solve four clue puzzles                              | Lantern City mystery solved  |
| Barbie   | Design a gala look with colour harmony               | Castle gala bunting appears  |

### Games technology

Every challenge is a real, stateful mini-game — no static mockups:

- **Path puzzle** (`PathGame`) — grids, flood-fill connectivity, shortest-path star scoring
- **Choice rounds** (`ChoiceGame`) — clue questions with hints and retries
- **Circuit builder** (`CircuitGame`) — ordered node tapping with animated current + material quiz
- **Anchor puzzle** (`WebGame`) — weak vs. strong anchors, SVG web lines drawn as you go
- **Part matching** (`MatchGame`) — HTML5 drag-and-drop *and* tap-a-part-then-a-slot for touch
- **Design studio** (`DesignGame`) — live SVG outfit preview; colour-harmony scoring teaches colour theory

Stars: 3 per mission, fewer for fumbles (except the design studio, which rewards colour harmony).
Best scores persist.

---

## The character catalogue

`src/game/characters.ts` holds **89 characters** across six categories — Classic Cartoons, Pokémon,
Superheroes, Disney & Fantasy, Indian Cartoons and Popular Favourites. The eight playable heroes are
marked `playable`; everyone else is a selectable preview with a friendly “story still being written”
sheet.

The catalogue is data-driven: add a character object and (optionally) a mission in
`src/game/missions.ts` to make it playable.

---

## Project structure

```
src/
  components/
    Navbar, CharacterCard, CharacterGrid, CharacterAvatar, StarRow,
    WorldMap (SVG island + interactive pins), MissionCard,
    GameInteraction (dispatcher), RewardPopup, Sparkles / StarField
    games/   ChoiceGame, PathGame, CircuitGame, WebGame, MatchGame, DesignGame
  game/
    characters.ts   catalogue + categories
    missions.ts     missions, locations, story order, learning lines
    types.ts        discriminated-union game configs
    progress.tsx    localStorage progress context (stars, badges, world flags)
    worldChanges.ts names of the visual changes for each flag
    useSfx.ts       tiny WebAudio sound kit (no assets)
  pages/
    Home, CharacterSelection, WorldMapPage, Adventure, Results
  App.tsx / main.tsx
```

Routes: `/` · `/characters` · `/world` · `/adventure/:missionId` · `/results/:missionId`

World changes are stored as simple flags (`river-frozen`, `web-bridge`, …) and read by the SVG map, so
the island rendering is entirely derived from progress.

---

## Testing

`scripts/e2e.mjs` drives the whole game in a real browser (Microsoft Edge via Playwright): it plays all
eight adventures through to the results screen, checks the learning text, verifies the world-map flags,
checks the coming-soon sheet and captures desktop + mobile screenshots.

```bash
npm i -D playwright        # once
npx vite build && npx vite preview --port 4173
node scripts/e2e.mjs
```

It expects `http://localhost:4173` and writes screenshots to `shots/`.

---

## Design notes

- **Kid-first UI**: oversized tap targets, one clear primary action per screen, no dense dashboards.
- **Accessibility**: semantic buttons/links, `aria-label`s on every icon-only control, visible focus
  rings, `prefers-reduced-motion` support, text contrast kept readable on the dark sky.
- **Responsive**: 2-column mobile grids, horizontally scrollable filter chips, SVG game boards that
  scale with their container.
- **No external art**: characters are represented by emoji emblems on gradient orbs so the prototype
  needs no licensed assets. For a commercial release, swap in licensed or original artwork —
  see “Licensing” below.

## Licensing note

This is a learning prototype. Character names are used as playful references only. For public or
commercial deployment, use licensed character assets with permission, or replace them with original
characters inspired by broad archetypes (e.g. “the gadget cat”, “the ice queen”) so nothing protected
is copied.
