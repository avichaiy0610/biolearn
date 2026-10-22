// node scripts/figure-shots.mjs <out-dir> <width> <slug...>   (dev server on :3123)
// Screenshots every lesson figure (<figure>) of each slug to <out-dir>/<slug>_<i>.png, then writes contact sheets of
// up to 8 figures each (<out-dir>/sheet_<n>.png) for a quick visual check next to scripts/figure-audit.mjs.
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
const [outDir, width, ...slugs] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: Number(width), height: 900 }, deviceScaleFactor: 2 });
const shots = [];
for (const slug of slugs) {
  const r = await p.goto(`http://localhost:3123/he/learn/${slug}`, { waitUntil: "networkidle", timeout: 180000 });
  if (r?.status() !== 200) { console.log(slug, "HTTP", r?.status()); continue; }
  const figs = await p.$$("figure");
  for (let i = 0; i < figs.length; i++) {
    const f = path.join(outDir, `${slug}_${i}.png`);
    await figs[i].screenshot({ path: f });
    shots.push(f);
  }
  console.log(slug, "figures:", figs.length);
}
for (let s = 0; s * 8 < shots.length; s++) {
  const cells = shots.slice(s * 8, s * 8 + 8).map((f) => `<div><p>${path.basename(f)}</p><img src="data:image/png;base64,${fs.readFileSync(f).toString("base64")}"></div>`).join("");
  await p.setViewportSize({ width: 1000, height: 800 });
  await p.setContent(`<html><body style="margin:0;background:#888;display:grid;grid-template-columns:1fr 1fr;gap:6px;width:1000px">${cells}<style>img{width:490px;display:block;background:#fff}p{margin:0;font:12px Arial;color:#fff}</style></body></html>`);
  await p.screenshot({ path: path.join(outDir, `sheet_${s + 1}.png`), fullPage: true });
}
await b.close();
