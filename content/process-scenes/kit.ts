// Drawing kit for the hand-authored step animations (viewBox 400x300, see lib/svg-scene.ts).
// Every helper returns plain SvgElement objects; ids must stay stable across a
// process's steps so the renderer can tween an element from one pose to the next
// (paths morph when they come from the same generator with the same point count).
import type { LegendItem, SvgElement } from "@/lib/svg-scene";

export type El = SvgElement;
export type Pt = [number, number];

export type StepDef = {
  titleHe: string; titleEn: string;
  descHe: string; descEn: string;
  elements: El[];
  highlight?: string[];
};

export type ProcessScene = {
  slug: string;
  legend: LegendItem[];
  steps: StepDef[];
};

export const NOTE = { he: "סכמטי — לא בקנה מידה", en: "Schematic — not to scale" };

/** Palette shared by all scenes (same families as the Lottie scenes). */
export const C = {
  ink: "#1e293b",
  muted: "#64748b",
  line: "#334155",
  dnaA: "#2563eb",     // template / "old" strand
  dnaB: "#db2777",     // coding / partner strand
  rung: "#cbd5e1",
  rna: "#059669",
  protein: "#7c3aed",
  proteinFill: "#ede9fe",
  enzyme: "#0ea5e9",
  enzymeFill: "#e0f2fe",
  membrane: "#d97706",
  membraneFill: "#fef3c7",
  cytosol: "#f8fafc",
  matrix: "#fff7ed",
  energy: "#f59e0b",   // ATP / high-energy
  redox: "#0d9488",    // NADH / FADH2
  co2: "#94a3b8",
  maternal: "#e11d48",
  paternal: "#2563eb",
  oxy: "#dc2626",
  deoxy: "#2563eb",
};

const f = (n: number) => Math.round(n * 10) / 10;

/* ── primitives ─────────────────────────────────────────────────────────── */

export const text = (id: string, x: number, y: number, en: string, he: string, o: Partial<El> = {}): El =>
  ({ id, type: "text", x, y, label: en, labelHe: he, ...o });

/** Label with a leader line to `to`. */
export const label = (id: string, x: number, y: number, en: string, he: string, to: Pt, o: Partial<El> = {}): El =>
  text(id, x, y, en, he, { to, ...o });

/** 5'/3' end tag (always left-to-right). */
export const tag = (id: string, x: number, y: number, s: string, color = C.ink): El =>
  ({ id, type: "text", x, y, label: s, labelHe: s, ltr: true, weight: 700, textColor: color });

export const line = (id: string, x1: number, y1: number, x2: number, y2: number, stroke = C.line, strokeWidth = 2, o: Partial<El> = {}): El =>
  ({ id, type: "line", x1, y1, x2, y2, stroke, strokeWidth, ...o });

export const arrow = (id: string, x1: number, y1: number, x2: number, y2: number, stroke = C.line, strokeWidth = 2.2, o: Partial<El> = {}): El =>
  line(id, x1, y1, x2, y2, stroke, strokeWidth, { arrow: true, ...o });

export const path = (id: string, d: string, o: Partial<El> = {}): El => ({ id, type: "path", d, ...o });

export const circle = (id: string, cx: number, cy: number, r: number, color: string, o: Partial<El> = {}): El =>
  ({ id, type: "circle", cx, cy, r, color, ...o });

export const ellipse = (id: string, cx: number, cy: number, rx: number, ry: number, color: string, o: Partial<El> = {}): El =>
  ({ id, type: "ellipse", cx, cy, rx, ry, color, ...o });

export const rect = (id: string, x: number, y: number, width: number, height: number, color: string, o: Partial<El> = {}): El =>
  ({ id, type: "rect", x, y, width, height, color, ...o });

/* ── path geometry ─────────────────────────────────────────────────────── */

export const poly = (pts: Pt[], closed = true) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"} ${f(x)} ${f(y)}`).join(" ") + (closed ? " Z" : "");

/** Smooth curve through points (Catmull-Rom → cubic Bézier). Same point count ⇒ morphable. */
export function smooth(pts: Pt[], closed = false, t = 0.5): string {
  const n = pts.length;
  const at = (i: number) => pts[closed ? (i + n) % n : Math.min(Math.max(i, 0), n - 1)];
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) / 6) * t * 2, p1[1] + ((p2[1] - p0[1]) / 6) * t * 2];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) / 6) * t * 2, p2[1] - ((p3[1] - p1[1]) / 6) * t * 2];
    d += ` C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + (closed ? " Z" : "");
}

/** Regular polygon (e.g. sugar rings: 6 = pyranose, 5 = furanose). */
export function ring(cx: number, cy: number, r: number, n: number, rot = -90): string {
  const pts: Pt[] = Array.from({ length: n }, (_, i) => {
    const a = ((rot + (360 * i) / n) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  return poly(pts);
}

/** Several straight segments in one path (base-pair rungs, ticks). */
export const segments = (segs: [Pt, Pt][]) =>
  segs.map(([a, b]) => `M ${f(a[0])} ${f(a[1])} L ${f(b[0])} ${f(b[1])}`).join(" ");

/** Wavy line (a nucleic-acid strand) from x1 to x2 around y; n points ⇒ morphable. */
export function wave(x1: number, x2: number, y: number, amp = 2.5, n = 13, phase = 0): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const x = x1 + ((x2 - x1) * i) / (n - 1);
    return [x, y + amp * Math.sin(i * 1.3 + phase)] as Pt;
  });
}

/* ── composite structures ──────────────────────────────────────────────── */

/** Double-stranded DNA ladder with 5'/3' polarity tags. Top strand runs 5'→3' left to right. */
export function dsDNA(p: string, x1: number, x2: number, y: number, o: { gap?: number; top?: string; bottom?: string; tags?: boolean; step?: number } = {}): El[] {
  const gap = o.gap ?? 14, step = o.step ?? 9;
  const yt = y - gap / 2, yb = y + gap / 2;
  const rungs: [Pt, Pt][] = [];
  for (let x = x1 + step / 2; x < x2; x += step) rungs.push([[x, yt + 1.5], [x, yb - 1.5]]);
  const els: El[] = [
    path(`${p}_r`, segments(rungs), { stroke: C.rung, strokeWidth: 2 }),
    line(`${p}_t`, x1, yt, x2, yt, o.top ?? C.dnaB, 4),
    line(`${p}_b`, x1, yb, x2, yb, o.bottom ?? C.dnaA, 4),
  ];
  if (o.tags) {
    els.push(tag(`${p}_t5`, x1 - 12, yt + 5, "5'"), tag(`${p}_t3`, x2 + 12, yt + 5, "3'"));
    els.push(tag(`${p}_b3`, x1 - 12, yb + 6, "3'"), tag(`${p}_b5`, x2 + 12, yb + 6, "5'"));
  }
  return els;
}

/** Phospholipid bilayer seen edge-on, from x1 to x2 at y (dotted heads, pale tails). */
export function bilayer(p: string, x1: number, x2: number, y: number, o: { head?: string; tail?: string; th?: number } = {}): El[] {
  const th = o.th ?? 14;
  return [
    rect(`${p}_tail`, x1, y - th / 2, x2 - x1, th, o.tail ?? "#fde68a", { rx: 0, fillOpacity: 0.7 }),
    line(`${p}_h1`, x1, y - th / 2, x2, y - th / 2, o.head ?? C.membrane, 4.5, { dash: "0.1 5.2" }),
    line(`${p}_h2`, x1, y + th / 2, x2, y + th / 2, o.head ?? C.membrane, 4.5, { dash: "0.1 5.2" }),
  ];
}

/** Mitochondrion: outer membrane, inner membrane folded into cristae, matrix. */
export function mitochondrion(p: string, cx: number, cy: number, rx: number, ry: number, o: Partial<El> = {}, depth = 0.62, folds = 5): El[] {
  const inner: Pt[] = [];
  const gap = Math.max(5, rx * 0.05), irx = rx - gap, iry = ry - gap;
  // walk around the inner membrane; along top and bottom edges push cristae inward
  const N = 48;
  for (let i = 0; i < N; i++) {
    const a = (2 * Math.PI * i) / N;
    let x = cx + irx * Math.cos(a), y = cy + iry * Math.sin(a);
    const s = Math.sin(a);
    const phase = (Math.cos(a) + 1) / 2; // 0..1 along the long axis
    const fold = Math.max(0, Math.sin(phase * Math.PI * folds * 2 - Math.PI / 2)) ** 3;
    if (Math.abs(s) > 0.35) y -= Math.sign(s) * fold * iry * depth;
    x = Math.min(Math.max(x, cx - irx), cx + irx);
    inner.push([x, y]);
  }
  return [
    ellipse(`${p}_om`, cx, cy, rx, ry, "#fed7aa", { stroke: "#c2410c", strokeWidth: 2.2, ...o }),
    path(`${p}_im`, smooth(inner, true, 0.35), { color: "#ffedd5", stroke: "#ea580c", strokeWidth: 1.8 }),
  ];
}

/** Codon width on the mRNA (one ribosomal site = one codon). */
export const CODON = 44;

/**
 * Ribosome with the mRNA running through at y = cy. Large subunit above (E, P, A
 * sites, each one codon wide; P is centred on cx), small subunit below.
 * `alpha` keeps tRNAs inside visible.
 */
export function ribosome(p: string, cx: number, cy: number, o: { sites?: boolean; large?: boolean; small?: boolean; h?: number } = {}): El[] {
  const sw = CODON, w = sw * 3 + 22, h = o.h ?? 118;
  const els: El[] = [];
  if (o.large !== false) {
    els.push(path(`${p}_L`, smooth([[cx - w / 2, cy - 5], [cx - w / 2 - 2, cy - h * 0.55], [cx - w / 4, cy - h], [cx + w / 4, cy - h], [cx + w / 2 + 2, cy - h * 0.55], [cx + w / 2, cy - 5]], false, 0.6) + " Z",
      { color: "#bfdbfe", fillOpacity: 0.55, stroke: "#1d4ed8", strokeWidth: 2 }));
    // exit tunnel for the growing polypeptide
    els.push(path(`${p}_tun`, `M ${f(cx - 4)} ${f(cy - 80)} L ${f(cx - 4)} ${f(cy - h + 2)} M ${f(cx + 6)} ${f(cy - 80)} L ${f(cx + 6)} ${f(cy - h + 2)}`, { stroke: "#93c5fd", strokeWidth: 1.2, dash: "3 3" }));
    if (o.sites) {
      ["E", "P", "A"].forEach((s, i) => {
        const sx = cx - sw * 1.5 + i * sw;
        els.push(rect(`${p}_s${s}`, sx + 1.5, cy - 80, sw - 3, 76, "#ffffff", { fillOpacity: 0.35, stroke: "#60a5fa", strokeWidth: 1.2, rx: 5, dash: "3 2" }));
        els.push(text(`${p}_t${s}`, sx + sw / 2, cy + 56, s, s, { ltr: true, weight: 700, textColor: "#1d4ed8" }));
      });
    }
  }
  if (o.small !== false) {
    els.push(ellipse(`${p}_S`, cx, cy + 17, w / 2 - 2, 19, "#dbeafe", { fillOpacity: 0.8, stroke: "#1d4ed8", strokeWidth: 2 }));
  }
  return els;
}

/** mRNA strand (x0→x1 at y, 5' on the left) with codon letters under it, one codon per CODON px starting at `c0`. */
export function mrna(p: string, x0: number, x1: number, y: number, c0: number, codons: string[], o: { colors?: Record<number, string> } = {}): El[] {
  const els: El[] = [line(`${p}_s`, x0, y, x1, y, C.rna, 4)];
  const ticks: [Pt, Pt][] = [];
  codons.forEach((c, i) => {
    const x = c0 + i * CODON;
    ticks.push([[x, y - 5], [x, y + 5]]);
    els.push(text(`${p}_c${i}`, x + CODON / 2, y + 21, c, c, { ltr: true, weight: 700, fontSize: 16.5, textColor: o.colors?.[i] ?? "#065f46" }));
  });
  ticks.push([[c0 + codons.length * CODON, y - 5], [c0 + codons.length * CODON, y + 5]]);
  els.splice(1, 0, path(`${p}_k`, segments(ticks), { stroke: "#047857", strokeWidth: 1.5 }));
  return els;
}

/** tRNA silhouette: anticodon loop bottom at (x, y) (sits on the mRNA), amino acid on top. */
export const TRNA_K = 1.3;
export function trna(p: string, x: number, y: number, o: { anticodon?: string; aa?: string; aaColor?: string; body?: string } = {}): El[] {
  const body = o.body ?? "#fef3c7", k = TRNA_K;
  const P = (dx: number, dy: number): Pt => [x + dx * k, y + dy * k];
  const d = smooth([P(-12, 0), P(-9, -14), P(-19, -22), P(-12, -30), P(-5, -28), P(-5, -38), P(5, -38), P(5, -28), P(12, -30), P(19, -22), P(9, -14), P(12, 0)], false, 0.5) + " Z";
  const els: El[] = [
    path(`${p}_body`, d, { color: body, stroke: "#b45309", strokeWidth: 1.8 }),
    line(`${p}_acc`, x + 2 * k, y - 38 * k, x + 2 * k, y - 46 * k, "#b45309", 2),
    circle(`${p}_aa`, x + 2 * k, y - 52 * k, 8, o.aaColor ?? C.protein, { stroke: "#fff", strokeWidth: 1.5, opacity: o.aa ? 1 : 0 }),
  ];
  if (o.anticodon) els.push(text(`${p}_ac`, x, y - 4, o.anticodon, o.anticodon, { ltr: true, weight: 700, fontSize: 16.5, textColor: "#92400e" }));
  return els;
}

/** A capsule-shaped chromatid from (cx, y1) to (cx, y2) with a centromere pinch at `cen` (0..1). Morphable. */
export function chromatid(cx: number, y1: number, y2: number, w = 7, cen = 0.5, tilt = 0): string {
  const L = y2 - y1, yc = y1 + L * cen;
  const pts: Pt[] = [
    [cx, y1 - w * 0.2], [cx + w * 0.8, y1 + w * 0.5], [cx + w, (y1 + yc) / 2], [cx + w * 0.55, yc], [cx + w, (yc + y2) / 2], [cx + w * 0.8, y2 - w * 0.5],
    [cx, y2 + w * 0.2], [cx - w * 0.8, y2 - w * 0.5], [cx - w, (yc + y2) / 2], [cx - w * 0.55, yc], [cx - w, (y1 + yc) / 2], [cx - w * 0.8, y1 + w * 0.5],
  ];
  if (tilt) {
    const a = (tilt * Math.PI) / 180, mx = cx, my = (y1 + y2) / 2;
    for (const q of pts) {
      const dx = q[0] - mx, dy = q[1] - my;
      q[0] = mx + dx * Math.cos(a) - dy * Math.sin(a);
      q[1] = my + dx * Math.sin(a) + dy * Math.cos(a);
    }
  }
  return smooth(pts, true, 0.55);
}

/** Replicated chromosome = two sister chromatids side by side (+ optional coloured tip from crossing over). */
export function chromosome(p: string, cx: number, y1: number, y2: number, color: string, o: { w?: number; cen?: number; tip?: { color: string; sister: 0 | 1; frac: number }; tilt?: number } = {}): El[] {
  const w = o.w ?? 6;
  const els: El[] = [
    path(`${p}_a`, chromatid(cx - w * 0.95, y1, y2, w, o.cen ?? 0.5, o.tilt ?? 0), { color, stroke: "#0f172a", strokeWidth: 1 }),
    path(`${p}_b`, chromatid(cx + w * 0.95, y1, y2, w, o.cen ?? 0.5, o.tilt ?? 0), { color, stroke: "#0f172a", strokeWidth: 1 }),
  ];
  if (o.tip) {
    const sx = cx + (o.tip.sister ? w * 0.95 : -w * 0.95);
    const ty2 = y1 + (y2 - y1) * o.tip.frac;
    els.push(path(`${p}_x`, chromatid(sx, y1, ty2, w * 0.92, 0.5), { color: o.tip.color, stroke: "#0f172a", strokeWidth: 1 }));
  }
  return els;
}

/** Plain (unreplicated / separated) single chromatid, with optional crossover tip. */
export function single(p: string, cx: number, y1: number, y2: number, color: string, o: { w?: number; cen?: number; tip?: { color: string; frac: number } } = {}): El[] {
  const w = o.w ?? 6;
  const els: El[] = [path(`${p}_a`, chromatid(cx, y1, y2, w, o.cen ?? 0.5), { color, stroke: "#0f172a", strokeWidth: 1 })];
  if (o.tip) els.push(path(`${p}_x`, chromatid(cx, y1, y1 + (y2 - y1) * o.tip.frac, w * 0.92, 0.5), { color: o.tip.color, stroke: "#0f172a", strokeWidth: 1 }));
  return els;
}

/** Hide an element (keeps its id alive so it fades out in place). */
export const gone = (els: El[]): El[] => els.map((e) => ({ ...e, opacity: 0 }));

/** Rounded badge with centred text (e.g. "ATP", "NADH"). */
export function badge(p: string, cx: number, cy: number, s: string, color: string, o: { w?: number; he?: string } = {}): El[] {
  const w = o.w ?? Math.max(34, s.length * 9.5 + 12);
  return [
    rect(`${p}_bg`, cx - w / 2, cy - 12, w, 24, "#ffffff", { stroke: color, strokeWidth: 2, rx: 12 }),
    text(`${p}_tx`, cx, cy + 6, s, o.he ?? s, { ltr: !o.he, weight: 700, textColor: color }),
  ];
}
