import { chromium } from 'playwright-core';
import fs from 'node:fs';

const URL = process.env.URL || 'http://localhost:4173/';
const shots = 'shots';
fs.mkdirSync(shots, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-gl=angle', '--enable-webgl'] });
const page = await browser.newPage({ viewport: { width: 1366, height: 800 } });
const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
await page.screenshot({ path: `${shots}/01-title.png` });

await page.getByRole('button', { name: /Start Adventure|Choose a hero/ }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${shots}/02-characters.png` });

await page.getByRole('button', { name: /Take me to the island/ }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${shots}/03-world.png` });

await page.getByRole('button', { name: /Walk into Cartoon/i }).click();
await page.waitForTimeout(1800);
await page.screenshot({ path: `${shots}/04-intro.png` });

// dismiss intro
const letsGo = page.getByRole('button', { name: /Let's go/ });
if (await letsGo.isVisible().catch(() => false)) await letsGo.click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${shots}/05-game.png` });

const state = await page.evaluate(() => window.__cv?.state?.());
console.log('STATE', JSON.stringify(state));

// walk right for a bit
await page.keyboard.down('ArrowRight');
await page.waitForTimeout(1400);
await page.keyboard.up('ArrowRight');
await page.waitForTimeout(400);
const state2 = await page.evaluate(() => window.__cv?.state?.());
console.log('MOVED', JSON.stringify(state2));
await page.screenshot({ path: `${shots}/06-walk.png` });

console.log('ERRORS', JSON.stringify(errors, null, 1));
await browser.close();
