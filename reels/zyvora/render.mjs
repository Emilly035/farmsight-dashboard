// Renderiza scene.html quadro a quadro (deterministicamente, via window.render(t)).
// Uso: node render.mjs <pasta-de-saida> [fps] [duracao]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const outDir = process.argv[2] ?? 'frames';
const fps = Number(process.argv[3] ?? 30);
const duration = Number(process.argv[4] ?? 15);
mkdirSync(outDir, { recursive: true });

const here = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(pathToFileURL(path.join(here, 'scene.html')).href);
await page.evaluate(() => document.fonts.ready);

const total = Math.round(fps * duration);
for (let i = 0; i < total; i++) {
  await page.evaluate(t => window.render(t), i / fps);
  await page.screenshot({ path: path.join(outDir, `f${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 95 });
  if (i % 60 === 0) console.log(`frame ${i}/${total}`);
}
await browser.close();
