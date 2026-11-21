import { chromium } from 'playwright-core';
const URL = 'http://localhost:4173/';
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-gl=angle'] });
const page = await browser.newPage({ viewport: { width: 1366, height: 800 } });
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await page.goto(URL, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.screenshot({ path: 'shots/19-title.png' });
await page.getByRole('button', { name: /Start Adventure/ }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: 'shots/20-characters.png' });
// pick Elsa before travelling
await page.getByRole('button', { name: /Elsa/ }).first().click();
await page.waitForTimeout(300);
await page.getByRole('button', { name: /Take me to the island/ }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: 'shots/21-world.png' });

// Elsa in the frozen kingdom
await page.getByRole('button', { name: /Walk into Frozen/i }).click();
await page.waitForTimeout(1400);
const go = page.getByRole('button', { name: /Let's go/ });
if (await go.isVisible().catch(() => false)) await go.click();
await page.evaluate(() => window.__cv.warp(5700, 500));
await page.waitForTimeout(700);
await page.screenshot({ path: 'shots/22-frozen.png' });
await page.evaluate(() => window.__cv.warp(5780, 520));
await page.waitForTimeout(500);
await page.evaluate(() => window.__cv.ability());
await page.waitForTimeout(900);
await page.screenshot({ path: 'shots/23-frozen-ice.png' });

// switch hero overlay
await page.evaluate(() => window.__cv.warp(5400, 480));
await page.waitForTimeout(600);
await page.getByRole('button', { name: /Playing/ }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: 'shots/24-switch.png' });
await page.getByRole('button', { name: /Close/ }).click();
await page.waitForTimeout(300);

// forest
await page.evaluate(() => window.__cv.setCharacter('barbie'));
await page.evaluate(() => window.__cv.warp(2900, 500));
await page.waitForTimeout(1200);
await page.screenshot({ path: 'shots/25-forest.png' });

// mobile landscape
const mob = await browser.newPage({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
mob.on('pageerror', (e) => console.log('MOBILE PAGEERROR', e.message));
await mob.goto(URL, { waitUntil: 'networkidle' });
await mob.waitForTimeout(500);
const cont = mob.getByRole('button', { name: /Continue/ });
if (await cont.isVisible().catch(() => false)) await cont.click();
else await mob.getByRole('button', { name: /Start Adventure/ }).click();
await mob.waitForTimeout(400);
if (await mob.getByRole('button', { name: /Take me to the island/ }).isVisible().catch(() => false)) {
  await mob.getByRole('button', { name: /Take me to the island/ }).click();
  await mob.waitForTimeout(400);
}
await mob.getByRole('button', { name: /Walk into Cartoon/i }).click();
await mob.waitForTimeout(1400);
const go2 = mob.getByRole('button', { name: /Let's go/ });
if (await go2.isVisible().catch(() => false)) await go2.click();
await mob.waitForTimeout(600);
await mob.screenshot({ path: 'shots/26-mobile.png' });

// mobile portrait
const port = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await port.goto(URL, { waitUntil: 'networkidle' });
await port.waitForTimeout(600);
await port.screenshot({ path: 'shots/27-portrait-title.png' });
console.log('done');
await browser.close();
