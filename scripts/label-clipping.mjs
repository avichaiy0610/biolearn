// Clipped-label check for every polished scene (he + en): any visible label outside the 400-wide frame.
//   npx next dev -p 3200;  node scripts/label-clipping.mjs [base=http://localhost:3200] [width=900]
import { chromium } from "playwright";
import { execSync } from "child_process";
const base = process.argv[2] ?? "http://localhost:3200";
const width = Number(process.argv[3] ?? 900);
const slugs = execSync(`npx tsx -e "import('./content/process-scenes/index.ts').then(m => console.log(m.PROCESS_SCENES.map(s => s.slug).join(' ')))"`, { encoding: "utf8", shell: true }).trim().split(/\s+/);
const b = await chromium.launch();
let total = 0; const bad = [];
for (const lang of ["he", "en"]) {
  const p = await b.newPage({ viewport: { width, height: 900 } });
  for (const slug of slugs) {
    await p.goto(`${base}/${lang}/dev-scenes/${slug}`, { waitUntil: "networkidle", timeout: 120000 }).catch(() => {});
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll("section[data-step]").forEach((sec) => {
        const svg = sec.querySelector('svg[viewBox="0 0 400 300"]'); if (!svg) return;
        svg.querySelectorAll("text").forEach((t) => {
          if (getComputedStyle(t).display === "none" || !t.textContent.trim()) return;
          const sr = svg.getBoundingClientRect(), r = t.getBoundingClientRect(); if (r.width === 0) return;
          const k = 400 / sr.width, x0 = (r.left - sr.left) * k, x1 = (r.right - sr.left) * k;
          if (x0 < -1 || x1 > 401) out.push(`${sec.dataset.step}: "${t.textContent}" [${x0.toFixed(0)}..${x1.toFixed(0)}]`);
        });
      });
      return out;
    });
    total++;
    for (const x of r) bad.push(`${lang} ${slug} ${x}`);
  }
  await p.close();
}
console.log("pages", total, "overflowing labels", bad.length); console.log(bad.slice(0, 40).join("\n"));
await b.close();
