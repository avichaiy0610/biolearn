// Automated part of the animation standard (CLAUDE.md → "Animation standards").
// It cannot judge biology, but it catches everything mechanical: v2 format,
// Hebrew labels, legend, note, label size, leaders, layout bounds and
// generic-shape-only scenes. Publishing a draft requires zero "error" findings;
// the visual check (desktop + 390px) is still done by a person/Claude.
import { parseSvgData, V2_MIN_LABEL, type SceneData } from "@/lib/svg-scene";

export type StepLike = { titleHe: string; titleEn: string; descHe: string; descEn: string; svgData: string };
export type Finding = { level: "error" | "warn"; step: number | null; msg: string };

const HEBREW = /[֐-׿]/;
const inBox = (x?: number, y?: number) => x === undefined || y === undefined || (x >= -2 && x <= 402 && y >= -2 && y <= 302);

export function checkAnimation(steps: StepLike[]): Finding[] {
  const out: Finding[] = [];
  const err = (step: number | null, msg: string) => out.push({ level: "error", step, msg });
  const warn = (step: number | null, msg: string) => out.push({ level: "warn", step, msg });

  if (steps.length < 3) err(null, `only ${steps.length} steps (need at least 3)`);
  if (steps.length > 12) warn(null, `${steps.length} steps — consider fewer, denser steps`);

  const scenes: SceneData[] = steps.map((s) => parseSvgData(s.svgData));
  if (!scenes.every((s) => (s.v ?? 1) >= 2)) err(null, "not v2 scene data (legacy renderer path)");
  if (!scenes.some((s) => s.legend && s.legend.length >= 2)) err(null, "no visual legend (need at least 2 items)");
  if (!scenes.some((s) => s.note?.he && s.note?.en)) err(null, 'no "schematic, not to scale" note');

  const anyPath = scenes.some((sc) => sc.elements.some((e) => e.type === "path" && (e.opacity ?? 1) > 0));
  if (steps.length && !anyPath) err(null, "no drawn structures anywhere — only generic circles/boxes (use real structures or composites)");

  steps.forEach((st, i) => {
    const n = i + 1;
    if (!st.titleHe.trim() || !st.titleEn.trim()) err(n, "missing title (he/en)");
    if (!HEBREW.test(st.titleHe)) err(n, "Hebrew title has no Hebrew text");
    if (st.descHe.trim().length < 60 || st.descEn.trim().length < 60) warn(n, "description is very short");
    if (!HEBREW.test(st.descHe)) err(n, "Hebrew description has no Hebrew text");

    const els = scenes[i].elements;
    const ids = new Set<string>();
    for (const e of els) {
      if (ids.has(e.id)) err(n, `duplicate element id "${e.id}"`);
      ids.add(e.id);
    }
    const visible = els.filter((e) => (e.opacity ?? 1) > 0);
    const shapes = visible.filter((e) => e.type !== "text");
    const texts = visible.filter((e) => e.type === "text");
    if (shapes.length < 5) err(n, `only ${shapes.length} drawn shapes — the scene is too sparse`);
    // Circles are fine as parts of a structure (petals, globular proteins, mtDNA
    // rings); a scene made only of circles/ellipses/boxes with no drawn structure
    // (path) is the old generic look.
    const paths = shapes.filter((e) => e.type === "path").length;
    const generic = shapes.filter((e) => e.type === "circle" || e.type === "ellipse").length;
    if (shapes.length && paths === 0) warn(n, "no drawn structures (paths) in this step — fine for diagrams (Punnett square, pedigree), otherwise use real structures");
    else if (shapes.length >= 8 && generic / shapes.length > 0.85) warn(n, `${generic}/${shapes.length} shapes are circles/ellipses — check they read as real structures`);
    if (texts.length === 0) err(n, "no labels");

    for (const t of texts) {
      const label = t.labelHe ?? "";
      const isTag = t.ltr && (t.label ?? "").length <= 6; // 5'/3' tags, codons, symbols
      if (!label && !isTag) err(n, `label "${t.label}" has no Hebrew (labelHe)`);
      if (label && !isTag && !t.ltr && !HEBREW.test(label) && /[a-z]{4,}/i.test(label)) warn(n, `label "${label}" looks untranslated`);
      if ((t.fontSize ?? V2_MIN_LABEL) < V2_MIN_LABEL) warn(n, `label "${t.label}" below ${V2_MIN_LABEL} (renderer enlarges it; check layout)`);
      if (!inBox(t.x, t.y)) err(n, `label "${t.label}" is outside the 400×300 canvas`);
      if (t.to && !inBox(t.to[0], t.to[1])) err(n, `leader of "${t.label}" points outside the canvas`);
      const long = (label || t.label || "").length > 18;
      if (long && !(t.shortHe && t.short)) warn(n, `long label "${label || t.label}" has no short mobile variant`);
    }
    const leaders = texts.filter((t) => t.to).length;
    if (texts.length >= 3 && leaders === 0) warn(n, "no leader lines — labels should point at structures");
    for (const e of shapes) {
      if (!inBox(e.cx ?? e.x ?? e.x1, e.cy ?? e.y ?? e.y1)) warn(n, `element "${e.id}" starts outside the canvas`);
    }
  });
  return out;
}

export const hasErrors = (f: Finding[]) => f.some((x) => x.level === "error");

export function formatFindings(f: Finding[]): string {
  if (!f.length) return "✓ meets the automated standard checks";
  return f.map((x) => `${x.level === "error" ? "✗" : "!"} ${x.step ? `step ${x.step}: ` : ""}${x.msg}`).join("\n");
}
