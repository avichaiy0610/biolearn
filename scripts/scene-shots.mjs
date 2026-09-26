// Visual check for animations (CLAUDE.md → "Animation drafts workflow").
//   npx next dev -p 3200            (the preview route only exists in development)
//   node scripts/scene-shots.mjs <slug | draft-<id>> [lang=he] [width=900] [base=http://localhost:3200]
// Screenshots every step's card from /<lang>/dev-scenes/<slug> into
// .shots/M_<slug>_<lang>_<width>.png (one montage) and reports console errors.
// Check at 900 (desktop) and 390 (phone), in he and en.
import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync(".shots", { recursive: true });
const [slug, lang = "he", width = "900", base = "http://localhost:3200"] = process.argv.slice(2);
const W = Number(width);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: 900 }, deviceScaleFactor: W < 500 ? 2 : 1 });
const errs = [];
p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errs.push(m.text().slice(0, 200)); });
await p.goto(`${base}/${lang}/dev-scenes/${slug}`, { waitUntil: "networkidle", timeout: 120000 });
await p.waitForTimeout(1800);
const n = await p.locator("section[data-step]").count();
const shots = [];
for (let i = 0; i < n; i++) {
  const card = p.locator(`section[data-step="${i}"] .rounded-2xl`).first();
  await card.scrollIntoViewIfNeeded();
  await p.waitForTimeout(150);
  const f = `.shots/sc_${slug.slice(0, 20)}_${lang}_${W}_${i}.png`;
  await card.screenshot({ path: f });
  shots.push(f);
}
const imgs = shots.map((f) => `<img src="data:image/png;base64,${fs.readFileSync(f).toString("base64")}" style="width:${W < 500 ? 390 : 700}px;margin:3px;vertical-align:top">`).join("");
const pg = await b.newPage({ viewport: { width: W < 500 ? 1200 : 1420, height: 600 } });
await pg.setContent(`<body style="margin:0;background:#999">${imgs}</body>`);
const out = `.shots/M_${slug.slice(0, 20)}_${lang}_${W}.png`;
await pg.screenshot({ path: out, fullPage: true });
console.log(out, "steps:", n, errs.length ? "\nconsole:\n" + [...new Set(errs)].slice(0, 8).join("\n") : "");
await b.close();
