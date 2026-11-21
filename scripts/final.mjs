import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-gl=angle'] });
const ctx = await b.newContext({ viewport: { width: 1366, height: 800 } });
const p = await ctx.newPage();
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const wait = (ms) => p.waitForTimeout(ms);
const assert = (c, m) => { if (!c) throw new Error('FAIL: ' + m); console.log('  ✓', m); };

await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.clear());
await p.reload({ waitUntil: 'networkidle' });
await wait(400);
// set up save: finished world + last hero ironman
await p.evaluate(() => {
  const flags = ['windmill', 'lamps', 'toys', 'firewood', 'garden', 'icebridge', 'rescued', 'generator'];
  const missions = {
    'm-windmill': ['gear-1', 'gear-2', 'gear-3'], 'm-lamps': ['lamp-1', 'lamp-2', 'lamp-3'],
    'm-toys': ['toy-1', 'toy-2', 'toy-3'], 'm-firewood': ['crate-1', 'crate-2', 'crate-3'],
    'm-garden': ['flower-1', 'flower-2', 'flower-3'], 'm-icebridge': ['gap-1', 'gap-2', 'gap-3'],
    'm-rescue': ['stuck-1', 'stuck-2'], 'm-generator': ['part-1', 'part-2', 'part-3'],
  };
  const out = { version: 2, character: 'ironman', flags, zone: 'frozen', started: true, missions: {} };
  for (const [k, v] of Object.entries(missions)) out.missions[k] = { progress: v, done: true };
  localStorage.setItem('characterverse:world:v1', JSON.stringify(out));
});
await p.reload({ waitUntil: 'networkidle' });
await wait(500);
await p.getByRole('button', { name: /Continue/ }).click();
await wait(500);
const worldText = await p.locator('body').innerText();
assert(worldText.includes('Iron Man'), 'world screen shows the last played hero');
assert(worldText.includes('8 changes'), 'world screen lists all 8 world changes');
await p.getByRole('button', { name: /Walk into Frozen/i }).click();
await wait(1600);
const go = p.getByRole('button', { name: /Let's go/ });
if (await go.isVisible().catch(() => false)) await go.click();
await wait(500);
let st = await p.evaluate(() => window.__cv.state());
assert(st.flags.length === 8, 'all flags loaded in the world');
assert(st.prompt === null || !st.prompt.includes('gear'), 'no stale collectibles prompting');
await p.screenshot({ path: 'shots/50-complete-world.png' });

// in-game switch should be reflected when leaving
await p.evaluate(() => window.__cv.setCharacter('bheem'));
await wait(500);
await p.getByRole('button', { name: /Exit to world map/ }).click();
await wait(600);
const afterExit = await p.locator('body').innerText();
assert(afterExit.includes('Chhota Bheem'), 'world screen follows an in-game hero switch');

// reload persistence of chosen hero
await p.reload({ waitUntil: 'networkidle' });
await wait(500);
await p.getByRole('button', { name: /Continue/ }).click();
await wait(400);
assert((await p.locator('body').innerText()).includes('Chhota Bheem'), 'selected hero persists after reload');

// reset flow
await p.getByRole('button', { name: /Reset world/ }).click();
await wait(300);
await p.getByRole('button', { name: /Reset everything/ }).click();
await wait(500);
const cleared = await p.evaluate(() => localStorage.getItem('characterverse:world:v1'));
assert(!cleared || JSON.parse(cleared).flags.length === 0, 'reset clears world flags');
const titleText = await p.locator('body').innerText();
assert(titleText.includes('Start Adventure'), 'reset returns to the title screen');

console.log('\nERRORS', JSON.stringify(errors));
if (errors.length) process.exitCode = 1;
await b.close();
