// node scripts/figure-audit.mjs <out.json> <slug...>   (dev server on :3123)
// For every <figure> SVG on each lesson page: find text whose box is crossed by a stroke (line, path,
// shape outline) or overlaps another text. Coordinates are in each SVG's own viewBox units.
import { chromium } from "playwright";
import fs from "fs";
const [out, ...slugs] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1000, height: 900 } });
const report = [];
for (const slug of slugs) {
  const r = await p.goto(`http://localhost:3123/he/learn/${slug}`, { waitUntil: "networkidle", timeout: 180000 });
  if (r?.status() !== 200) { report.push({ slug, error: r?.status() }); continue; }
  const figs = await p.evaluate(() => {
    const res = [];
    document.querySelectorAll("figure svg").forEach((svg, fi) => {
      const inv = svg.getScreenCTM().inverse();
      const toLocal = (x, y) => { const pt = svg.createSVGPoint(); pt.x = x; pt.y = y; const q = pt.matrixTransform(inv); return [q.x, q.y]; };
      const boxOf = (el) => { const r = el.getBoundingClientRect(); const [x1, y1] = toLocal(r.left, r.top); const [x2, y2] = toLocal(r.right, r.bottom); return [Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2)]; };
      const texts = [...svg.querySelectorAll("text")].filter((t) => t.textContent.trim()).map((t) => ({ s: t.textContent.trim().slice(0, 40), b: boxOf(t) }));
      // sample thin strokes; remember closed shapes so text inside them is not flagged by their outline
      const els = [];
      svg.querySelectorAll("line, path, polyline, rect, ellipse, circle, polygon").forEach((el) => {
        if (el.closest("defs, marker")) return;
        const cs = getComputedStyle(el); const st = el.getAttribute("stroke") || cs.stroke;
        const sw = parseFloat(el.getAttribute("stroke-width") || cs.strokeWidth || "1");
        if (!st || st === "none" || sw <= 0.5 || sw >= 6) return;
        const closed = ["rect", "ellipse", "circle", "polygon"].includes(el.tagName) || /z\s*$/i.test(el.getAttribute("d") || "");
        let len = 0; try { len = el.getTotalLength(); } catch { return; }
        const ctm = el.getScreenCTM(); const pts = [];
        const n = Math.max(8, Math.min(400, Math.round(len / 2)));
        for (let i = 0; i <= n; i++) { const q = el.getPointAtLength((len * i) / n); const pt = svg.createSVGPoint(); pt.x = q.x; pt.y = q.y; const s2 = pt.matrixTransform(ctm); pts.push(toLocal(s2.x, s2.y)); }
        els.push({ closed, bb: boxOf(el), pts });
      });
      const vb = svg.viewBox.baseVal;
      const shrink = 1.5;
      const hits = [];
      texts.forEach((t) => {
        const [x1, y1, x2, y2] = t.b;
        const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
        let c = 0;
        for (const e of els) {
          if (e.closed && cx > e.bb[0] && cx < e.bb[2] && cy > e.bb[1] && cy < e.bb[3] && x1 >= e.bb[0] - 2 && x2 <= e.bb[2] + 2 && y1 >= e.bb[1] - 2 && y2 <= e.bb[3] + 2) continue;
          c += e.pts.filter(([x, y]) => x > x1 + shrink && x < x2 - shrink && y > y1 + shrink + 1 && y < y2 - shrink - 1).length;
        }
        if (c >= 2) hits.push({ kind: "stroke", text: t.s, n: c });
        if (x1 < vb.x - 1 || x2 > vb.x + vb.width + 1) hits.push({ kind: "clipped", text: t.s });
      });
      for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
        const a = texts[i].b, c = texts[j].b;
        const ox = Math.min(a[2], c[2]) - Math.max(a[0], c[0]), oy = Math.min(a[3], c[3]) - Math.max(a[1], c[1]);
        if (ox > 3 && oy > 3) hits.push({ kind: "text-text", text: `${texts[i].s} ⟂ ${texts[j].s}` });
      }
      res.push({ fi, label: (svg.getAttribute("aria-label") || "").slice(0, 50), hits });
    });
    return res;
  });
  for (const f of figs) report.push({ slug, ...f });
  const n = figs.reduce((a, f) => a + f.hits.length, 0);
  console.log(slug, "figs", figs.length, "issues", n);
}
fs.writeFileSync(out, JSON.stringify(report, null, 1));
await b.close();
