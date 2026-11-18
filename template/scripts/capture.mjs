// Screenshots of a product's real screens, for research and for rebuilding them as scenes.
//
//   node scripts/capture.mjs login <url>        opens a browser window: sign in yourself, then press Enter here.
//                                               The session is saved to .auth/state.json (git-ignored).
//   node scripts/capture.mjs shots <shots.json> screenshots each page in the list into public/screens/.
//
// shots.json: [{ "name": "dashboard", "url": "https://staging.example.com/dash", "width": 1440, "height": 900,
//                "wait": 1500, "selector": "optional: screenshot only this element", "full": false }]
//
// Rules: sign in yourself (the agent never types a password). Use a staging or demo account. Before a screenshot
// goes into a video, every name, email, phone number and amount on it must be made up: rebuild the screen with
// invented data, or blur it. Never put a real customer's data on screen.
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const STATE = join(root, '.auth/state.json');
const [mode, target] = process.argv.slice(2);

if (mode === 'login' && target) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(target);
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  await rl.question('Sign in in the browser window, then press Enter here to save the session... ');
  rl.close();
  mkdirSync(dirname(STATE), { recursive: true });
  await context.storageState({ path: STATE });
  await browser.close();
  console.log(`Saved the session to ${STATE}`);
} else if (mode === 'shots' && target) {
  const shots = JSON.parse(readFileSync(target, 'utf8'));
  const browser = await chromium.launch();
  const context = await browser.newContext(existsSync(STATE) ? { storageState: STATE } : {});
  mkdirSync(join(root, 'public/screens'), { recursive: true });
  for (const shot of shots) {
    const page = await context.newPage();
    await page.setViewportSize({ width: shot.width ?? 1440, height: shot.height ?? 900 });
    await page.goto(shot.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(shot.wait ?? 1000);
    const path = join(root, 'public/screens', `${shot.name}.png`);
    if (shot.selector) await page.locator(shot.selector).first().screenshot({ path });
    else await page.screenshot({ path, fullPage: !!shot.full });
    console.log(path);
    await page.close();
  }
  await browser.close();
} else {
  console.error('Usage: node scripts/capture.mjs login <url> | shots <shots.json>');
  process.exit(2);
}
