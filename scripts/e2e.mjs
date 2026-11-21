import { chromium } from 'playwright-core';
import fs from 'node:fs';

const URL = process.env.URL || 'http://localhost:4173/';
const shots = 'shots';
fs.mkdirSync(shots, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-gl=angle'] });
const page = await browser.newPage({ viewport: { width: 1366, height: 800 } });
const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));

const log = (...a) => console.log(...a);
const state = () => page.evaluate(() => window.__cv.state());
const warp = (x, y = 480) => page.evaluate(([x, y]) => window.__cv.warp(x, y), [x, y]);
const ability = () => page.evaluate(() => window.__cv.ability());
const interact = () => page.evaluate(() => window.__cv.interact());
const wait = (ms) => page.waitForTimeout(ms);
function assert(cond, msg) {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg);
  log('  ✓', msg);
}

await page.goto(URL, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await wait(600);
await page.getByRole('button', { name: /Start Adventure/ }).click();
await wait(400);
await page.screenshot({ path: `${shots}/02-characters.png` });
await page.getByRole('button', { name: /Take me to the island/ }).click();
await wait(400);
await page.screenshot({ path: `${shots}/03-world.png` });
await page.getByRole('button', { name: /Walk into Cartoon/i }).click();
await wait(1500);
await page.screenshot({ path: `${shots}/04-intro.png` });
const letsGo = page.getByRole('button', { name: /Let's go/ });
if (await letsGo.isVisible().catch(() => false)) await letsGo.click();
await wait(700);

log('\n— Doraemon: magnet 3 gears, repair windmill —');
let s = await state();
assert(s.character === 'doraemon' && s.mission === 'm-windmill', 'Doraemon mission active');
assert(s.markerCount === 3, 'three gear markers visible');

for (const [x, y] of [[720, 500], [1500, 320], [2060, 500]]) {
  await warp(x, y);
  await wait(500);
  await ability();
  await wait(900);
}
s = await state();
assert(s.progress.length === 3, 'all three gears magneted (' + s.progress.length + ')');
await page.screenshot({ path: `${shots}/07-doraemon-gears.png` });

await warp(430, 500);
await wait(400);
assert((await state()).prompt === 'Fit the three gears', 'windmill prompt appears');
await interact();
await wait(900);
s = await state();
assert(s.flags.includes('windmill'), 'world flag windmill set');
assert(s.done === true, 'mission marked done');
await page.screenshot({ path: `${shots}/08-windmill-fixed.png` });

log('\n— Switch hero to Pikachu —');
await page.evaluate(() => window.__cv.setCharacter('pikachu'));
await wait(700);
s = await state();
assert(s.character === 'pikachu', 'character switched in same world');
assert(s.mission === 'm-lamps', 'Pikachu mission loaded');
assert(s.flags.includes('windmill'), 'Doraemon world change persists after switch');
assert(s.markerCount === 3, 'three lamp markers');
for (const x of [210, 1010, 1760]) {
  await warp(x, 500);
  await wait(350);
  await ability();
  await wait(800);
}
s = await state();
assert(s.flags.includes('lamps'), 'lamps lit flag set');
await page.screenshot({ path: `${shots}/09-lamps.png` });

log('\n— Switch to Elsa and build the ice bridge —');
await page.evaluate(() => window.__cv.setCharacter('elsa'));
await wait(600);
for (const x of [5900, 6500, 7050]) {
  await page.evaluate((x) => window.__cv.warp(x, 520), x);
  await wait(700);
  await ability();
  await wait(800);
}
s = await state();
assert(s.flags.includes('icebridge'), 'ice bridge flag set after three freezes');
assert(s.frozenGaps.length === 3, 'three ice platforms created');
await page.screenshot({ path: `${shots}/10-icebridge.png` });

log('\n— Reload: world changes persist —');
await page.reload({ waitUntil: 'networkidle' });
await wait(600);
const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('characterverse:world:v1')));
assert(saved.flags.includes('windmill') && saved.flags.includes('lamps') && saved.flags.includes('icebridge'), 'flags saved in localStorage');
await page.getByRole('button', { name: /Continue/ }).click();
await wait(400);
await page.getByRole('button', { name: /Walk into Cartoon/i }).click();
await wait(1600);
if (await letsGo.isVisible().catch(() => false)) await letsGo.click();
await wait(600);
s = await state();
assert(s.flags.includes('windmill'), 'windmill still fixed after reload');
assert(s.frozenGaps.length === 3, 'ice bridge rebuilt from saved flag');
await page.screenshot({ path: `${shots}/11-reloaded.png` });


log('\n— Shinchan: find the three toys —');
await page.evaluate(() => window.__cv.setCharacter('shinchan'));
await wait(600);
for (const [x, y] of [[300, 390], [2000, 410], [2390, 510]]) {
  await warp(x, y);
  await wait(650);
  await interact();
  await wait(550);
}
s = await state();
assert(s.flags.includes('toys'), 'toys mission complete');
await page.screenshot({ path: `${shots}/12-shinchan.png` });

log('\n— Chhota Bheem: carry three crates to the hearth —');
await page.evaluate(() => window.__cv.setCharacter('bheem'));
await wait(600);
for (const x of [1180, 1300, 1420]) {
  await warp(x, 500);
  await wait(500);
  await interact();
  await wait(300);
  await warp(2090, 500);
  await wait(550);
  await interact();
  await wait(400);
}
s = await state();
assert(s.flags.includes('firewood'), 'firewood mission complete');
await page.screenshot({ path: `${shots}/13-bheem.png` });

log('\n— Barbie: plant three flowers in the forest —');
await page.evaluate(() => window.__cv.setCharacter('barbie'));
await wait(600);
for (const x of [2940, 3680, 4760]) {
  await warp(x, 520);
  await wait(600);
  await interact();
  await wait(550);
}
s = await state();
assert(s.flags.includes('garden'), 'garden mission complete');
await page.screenshot({ path: `${shots}/14-barbie-forest.png` });

log('\n— Spider-Man: grapple up and rescue two villagers —');
await page.evaluate(() => window.__cv.setCharacter('spiderman'));
await wait(600);
for (const [ax, lx] of [[7180, 7160], [7480, 7460]]) {
  await warp(ax - 120, 530);
  await wait(500);
  await ability();
  await wait(900);
  await warp(lx, 300);
  await wait(750);
  await interact();
  await wait(550);
}
s = await state();
assert(s.flags.includes('rescued'), 'rescue mission complete');
await page.screenshot({ path: `${shots}/15-spiderman.png` });

log('\n— Iron Man: recover parts and repair the generator —');
await page.evaluate(() => window.__cv.setCharacter('ironman'));
await wait(600);
for (const [x, y] of [[5670, 510], [6220, 380], [6560, 320]]) {
  await warp(x, y);
  await wait(650);
  await interact();
  await wait(500);
}
await warp(6830, 505);
await wait(650);
s = await state();
if (s.prompt !== 'Repair the generator') log('   (prompt was', s.prompt, ')');
await interact();
await wait(750);
s = await state();
assert(s.flags.includes('generator'), 'generator mission complete');
await page.screenshot({ path: `${shots}/16-ironman-generator.png` });

const all = await page.evaluate(() => JSON.parse(localStorage.getItem('characterverse:world:v1')));
const doneCount = Object.values(all.missions).filter((m) => m.done).length;
assert(doneCount === 8, 'all eight missions saved complete (' + doneCount + ')');

console.log('\nERRORS', JSON.stringify(errors, null, 1));
if (errors.length) process.exitCode = 1;
await browser.close();
