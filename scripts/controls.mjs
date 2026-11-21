import { chromium } from 'playwright-core';
const URL = 'http://localhost:4173/';
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-gl=angle'] });
const errors = [];
const ctx = await browser.newContext({ viewport: { width: 1366, height: 800 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const state = () => page.evaluate(() => window.__cv.state());
const wait = (ms) => page.waitForTimeout(ms);
const assert = (c, m) => { if (!c) throw new Error('FAIL: ' + m); console.log('  ✓', m); };

await page.goto(URL, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await wait(400);
await page.getByRole('button', { name: /Start Adventure/ }).click();
await page.getByRole('button', { name: /Take me to the island/ }).click();
await page.getByRole('button', { name: /Walk into Cartoon/i }).click();
await wait(1400);
const go = page.getByRole('button', { name: /Let's go/ });
if (await go.isVisible().catch(() => false)) await go.click();
await wait(500);

console.log('— keyboard movement —');
const y0 = (await state()).y;
await page.keyboard.down('ArrowRight');
await wait(600);
await page.keyboard.up('ArrowRight');
const s1 = await state();
assert(s1.x > 220, 'arrow key walks right');
let s2 = s1;
for (let i = 0; i < 3 && s2.y >= s1.y - 20; i++) {
  await page.keyboard.down('Space');
  await wait(220);
  s2 = await state();
  await page.keyboard.up('Space');
  await wait(250);
}
assert(s2.y < s1.y - 20, 'space jumps (y ' + s1.y + ' → ' + s2.y + ')');
await wait(800);

console.log('— E pick-up without magnet —');
await page.evaluate(() => window.__cv.warp(720, 520));
await wait(500);
assert((await state()).prompt === 'Magnet the gear', 'gear prompt next to gear');
await page.keyboard.press('KeyE');
await wait(900);
assert((await state()).progress.length === 1, 'E collected a gear');

console.log('— Spider-Man grapple —');
await page.evaluate(() => window.__cv.setCharacter('spiderman'));
await wait(400);
await page.evaluate(() => window.__cv.warp(7060, 530));
await wait(500);
const before = await state();
await page.evaluate(() => window.__cv.ability());
await wait(700);
const after = await state();
assert(after.y < before.y - 120, 'grapple lifts Spider-Man up (' + before.y + ' → ' + after.y + ')');

console.log('— Iron Man flight —');
await page.evaluate(() => window.__cv.setCharacter('ironman'));
await wait(400);
await page.evaluate(() => window.__cv.warp(6400, 520));
await wait(500);
const f0 = await state();
await page.keyboard.down('Space');
await wait(120);
await page.keyboard.up('Space');
await page.keyboard.down('KeyQ');
await wait(550);
await page.keyboard.up('KeyQ');
const f1 = await state();
assert(f1.y < f0.y - 100, 'thrusters lift Iron Man higher than a jump (' + f0.y + ' → ' + f1.y + ')');

console.log('— mission complete toast —');
await page.evaluate(() => window.__cv.setCharacter('pikachu'));
await wait(300);
for (const x of [210, 1010, 1760]) {
  await page.evaluate((x) => window.__cv.warp(x, 500), x);
  await wait(350);
  await page.evaluate(() => window.__cv.ability());
  await wait(700);
}
await wait(400);
const toast = page.getByText(/complete!/).first();
assert(await toast.isVisible(), 'mission complete banner appears');
const hudText = await page.locator('body').innerText();
assert(hudText.includes('Lights of Village Square'), 'HUD mission card updates');

console.log('— travel via island map —');
await page.getByRole('button', { name: /Island map/ }).click();
await wait(500);
await page.getByRole('button', { name: /Travel here/ }).first().click();
await wait(1700);
const go3 = page.getByRole('button', { name: /Let's go/ });
if (await go3.isVisible().catch(() => false)) await go3.click();
await wait(600);
assert((await state()).zone === 'forest', 'travelled to the Magical Forest');

console.log('— touch controls —');
const mob = await browser.newPage({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
mob.on('pageerror', (e) => errors.push('mobile: ' + e.message));
await mob.goto(URL, { waitUntil: 'networkidle' });
await wait(500);
const cont = mob.getByRole('button', { name: /Continue/ });
if (await cont.isVisible().catch(() => false)) {
  await cont.click();
} else {
  await mob.getByRole('button', { name: /Start Adventure/ }).click();
}
await wait(400);
if (await mob.getByRole('button', { name: /Take me to the island/ }).isVisible().catch(() => false)) {
  await mob.getByRole('button', { name: /Take me to the island/ }).click();
  await wait(300);
}
await mob.getByRole('button', { name: /Walk into Cartoon/i }).click();
await wait(1300);
const go2 = mob.getByRole('button', { name: /Let's go/ });
if (await go2.isVisible().catch(() => false)) await go2.click();
await wait(500);
const mx0 = (await mob.evaluate(() => window.__cv.state())).x;
const stick = mob.locator('.touch-controls > div').first();
const box = await stick.boundingBox();
await mob.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await mob.mouse.down();
await mob.mouse.move(box.x + box.width / 2 + 42, box.y + box.height / 2, { steps: 4 });
await wait(900);
await mob.mouse.up();
const mx1 = (await mob.evaluate(() => window.__cv.state())).x;
assert(mx1 > mx0 + 40, 'virtual joystick moves the hero (' + mx0 + ' → ' + mx1 + ')');
const jy0 = (await mob.evaluate(() => window.__cv.state())).y;
await mob.getByRole('button', { name: /^JUMP/ }).dispatchEvent('pointerdown');
await wait(160);
const jy1 = (await mob.evaluate(() => window.__cv.state())).y;
await mob.getByRole('button', { name: /^JUMP/ }).dispatchEvent('pointerup');
assert(jy1 < jy0 - 15, 'JUMP button makes the hero jump');

console.log('\nERRORS', JSON.stringify(errors));
if (errors.length) process.exitCode = 1;
await browser.close();
