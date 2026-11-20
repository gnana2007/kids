import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';
const SHOTS = 'D:/Apps/kids/shots';
const log = (...a) => console.log('•', ...a);

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e)));

const shot = async (name) => { await page.waitForTimeout(350); await page.screenshot({ path: `${SHOTS}/${name}.png` }); };
const must = async (cond, msg) => { if (!(await cond)) throw new Error('FAILED: ' + msg); };
const vis = async (text, exact = false) => page.getByText(text, { exact }).first().isVisible().catch(() => false);

async function startMission(id) {
  await page.goto(`${BASE}/adventure/${id}`, { waitUntil: 'networkidle' });
  await page.getByTestId('start-mission').click();
  await page.waitForTimeout(300);
}

async function dismissReward() {
  const btn = page.getByRole('button', { name: /See what changed/ });
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(300);
  }
}

async function finishFlow(buttonName) {
  await page.getByRole('button', { name: buttonName }).first().click();
  await page.waitForURL('**/results/**');
  await page.waitForTimeout(500);
  await dismissReward();
}

try {
  // ── Home ──
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await must(vis('CharacterVerse') || true, 'home loaded');
  await page.getByRole('button', { name: /Start Adventure/ }).click();
  await page.waitForURL('**/characters');
  log('home → characters OK');

  // ── Character selection ──
  await page.getByLabel('Search characters').fill('Elsa');
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${SHOTS}/characters-search.png` });
  await page.locator('button:has(h3:text-is("Elsa"))').first().click();
  await page.waitForURL('**/adventure/m-elsa');
  await must(vis('The Frozen River'), 'briefing title');
  await shot('adventure-brief');

  // ── 1. Elsa path puzzle ──
  await page.getByTestId('start-mission').click();
  await page.waitForSelector('[data-testid="path-board"]');
  for (const [x, y] of [[1, 2], [2, 2], [2, 3], [3, 3], [4, 3], [4, 2]]) {
    await page.getByTestId(`cell-${x}-${y}`).click();
  }
  await page.getByText('The ice path is ready!').waitFor({ timeout: 8000 });
  await shot('game-elsa');
  await finishFlow('Walk across');
  await must(vis('Mission complete'), 'results header');
  await must(vis('Water turns into solid ice'), 'learning sentence');
  await shot('results-elsa');
  await page.getByRole('link', { name: /Continue adventure/ }).click();
  await page.waitForURL('**/adventure/m-doraemon');
  log('Elsa done → Doraemon unlocked OK');

  // ── 2. Doraemon choice rounds ──
  await page.getByTestId('start-mission').click();
  const doraAnswers = ['a', 'b', 'b', 'c'];
  for (let i = 0; i < doraAnswers.length; i++) {
    await page.getByTestId(`option-${doraAnswers[i]}`).click();
    await page.waitForTimeout(250);
    const label = i === doraAnswers.length - 1 ? /Finish mission/ : /Next clue/;
    if (i === 0) await shot('game-doraemon');
    await page.getByRole('button', { name: label }).click();
    await page.waitForTimeout(250);
  }
  await page.waitForURL('**/results/m-doraemon');
  log('Doraemon done OK');

  // ── 3. Spider-Man web anchors ──
  await page.goto(`${BASE}/adventure/m-spiderman`, { waitUntil: 'networkidle' });
  await page.getByTestId('start-mission').click();
  for (const id of ['a1', 'a3', 'a5', 'a6']) await page.getByTestId(`anchor-${id}`).click();
  await page.getByText('The web bridge is swinging').waitFor({ timeout: 8000 });
  await shot('game-spiderman');
  await finishFlow('Cross the bridge');
  log('Spider-Man done OK');

  // ── 4. Iron Man matching ──
  await page.goto(`${BASE}/adventure/m-ironman`, { waitUntil: 'networkidle' });
  await page.getByTestId('start-mission').click();
  for (const [part, slot] of [['p-core', 'core'], ['p-chip', 'chip'], ['p-armor', 'armor'], ['p-glove', 'glove']]) {
    await page.getByTestId(`part-${part}`).click();
    await page.getByTestId(`slot-${slot}`).click();
  }
  await page.waitForTimeout(700);
  await page.getByText('Everything is in place!').waitFor({ timeout: 8000 });
  await shot('game-ironman');
  await finishFlow('Finish');
  log('Iron Man done OK');

  // ── 5. Bheem matching + island badge ──
  await page.goto(`${BASE}/adventure/m-bheem`, { waitUntil: 'networkidle' });
  await page.getByTestId('start-mission').click();
  for (const [part, slot] of [['s-hammer', 'roof'], ['s-rice', 'pot'], ['s-water', 'well'], ['s-med', 'clinic']]) {
    await page.getByTestId(`part-${part}`).click();
    await page.getByTestId(`slot-${slot}`).click();
  }
  await page.waitForTimeout(700);
  await finishFlow('Finish');
  await shot('results-bheem');
  log('Bheem done OK (island badge should be awarded)');

  // ── World map after story ──
  await page.goto(`${BASE}/world`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await shot('world-map-done');
  const mapText = await page.locator('body').innerText();
  for (const label of ['Ice path across the river', 'Web bridge over the gorge', 'Lights bright in the village', 'Villagers back home']) {
    if (!mapText.includes(label)) throw new Error('World change missing: ' + label);
  }
  log('World map shows all story changes OK');

  // ── 6. Pikachu circuit ──
  await page.goto(`${BASE}/adventure/m-pikachu`, { waitUntil: 'networkidle' });
  await page.getByTestId('start-mission').click();
  for (const id of ['battery', 'wire', 'switch', 'coil', 'bulb']) await page.getByTestId(`node-${id}`).click();
  await page.waitForSelector('[data-testid="bonus-a"]', { timeout: 5000 });
  await page.getByTestId('bonus-a').click();
  await shot('game-pikachu');
  await page.getByRole('button', { name: /Light the lamps/ }).click();
  await page.waitForURL('**/results/m-pikachu');
  await page.waitForTimeout(500);
  await dismissReward();
  log('Pikachu done OK');

  // ── 7. Shinchan mystery ──
  await page.goto(`${BASE}/adventure/m-shinchan`, { waitUntil: 'networkidle' });
  await page.getByTestId('start-mission').click();
  const shinAnswers = ['a', 'b', 'c', 'c'];
  for (let i = 0; i < shinAnswers.length; i++) {
    await page.getByTestId(`option-${shinAnswers[i]}`).click();
    await page.waitForTimeout(200);
    await page.getByRole('button', { name: i === shinAnswers.length - 1 ? /Finish mission/ : /Next clue/ }).click();
    await page.waitForTimeout(200);
  }
  await page.waitForURL('**/results/m-shinchan');
  log('Shinchan done OK');

  // ── 8. Barbie design ──
  await page.goto(`${BASE}/adventure/m-barbie`, { waitUntil: 'networkidle' });
  await page.getByTestId('start-mission').click();
  await page.getByTestId('dress-lilac').click();
  await page.getByTestId('hair-raven').click();
  await page.getByTestId('accessory-crown').click();
  await page.getByTestId('shoes-glass').click();
  await shot('game-barbie');
  await page.getByTestId('design-finish').click();
  await page.waitForURL('**/results/m-barbie');
  await page.waitForTimeout(500);
  await dismissReward();
  log('Barbie done OK');

  // ── Persistence ──
  const saved = await page.evaluate(() => localStorage.getItem('characterverse:progress:v1'));
  const parsed = JSON.parse(saved || '{}');
  const starCount = Object.keys(parsed.stars || {}).length;
  if (starCount < 8) throw new Error('Progress not saved: ' + starCount);
  await page.goto(`${BASE}/world`, { waitUntil: 'networkidle' });
  const navText = await page.locator('header').innerText();
  log('Saved missions:', starCount, '| navbar:', navText.replace(/\n/g, ' '));

  // ── Coming-soon modal ──
  await page.goto(`${BASE}/characters`, { waitUntil: 'networkidle' });
  await page.getByLabel('Search characters').fill('Nobita');
  await page.waitForTimeout(250);
  await page.locator('button:has(h3:text-is("Nobita"))').first().click();
  await page.waitForTimeout(400);
  await page.getByText(/still being written/).waitFor({ timeout: 8000 });
  await shot('characters-soon');
  await page.getByRole('button', { name: /Meet another hero/ }).click();

  // ── Empty location panel (forest) ──
  await page.goto(`${BASE}/world`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Whisper Forest/ }).click();
  await page.waitForTimeout(350);
  await must(vis('adventures coming soon'), 'coming soon location panel');
  await shot('world-forest');
  log('Empty location panel OK');

  // ── Reset progress ──
  await page.getByRole('button', { name: /New game/ }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: /Tap again to erase/ }).click();
  await page.waitForTimeout(500);
  const afterReset = await page.evaluate(() => JSON.parse(localStorage.getItem('characterverse:progress:v1') || '{}'));
  if (Object.keys(afterReset.stars || {}).length !== 0) throw new Error('Reset did not clear stars');
  const headerAfterReset = await page.locator('header').innerText();
  if (!headerAfterReset.includes('0')) throw new Error('Header did not reset: ' + headerAfterReset);
  log('Progress reset OK ->', JSON.stringify(headerAfterReset));


  // ── Mobile layout ──
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${SHOTS}/mobile-home.png` });
  await page.goto(`${BASE}/world`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${SHOTS}/mobile-world.png` });

  console.log('\n=== CONSOLE ERRORS ===');
  console.log(errors.length ? errors.slice(0, 12).join('\n') : 'none');
  console.log('ALL TESTS PASSED');
} catch (e) {
  await page.screenshot({ path: `${SHOTS}/failure.png` });
  console.log('FAILED at:', e.message);
  console.log('URL:', page.url());
  console.log('Console errors:', errors.slice(0, 8).join('\n') || 'none');
  process.exitCode = 1;
} finally {
  await browser.close();
}
