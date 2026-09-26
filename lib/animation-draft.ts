// Turns raw AI animation output into v2 step data (see lib/svg-scene.ts) and
// runs the automated standard check. Used by the admin routes that create
// drafts (ProcessDraft) — drafts are never shown on the public site.
import type { LegendItem, SvgElement } from "@/lib/svg-scene";
import { expandComposites } from "@/content/process-scenes/composites";
import { NOTE } from "@/content/process-scenes/kit";
import { checkAnimation, type Finding, type StepLike } from "@/lib/animation-standards";

const TYPES = new Set(["circle", "rect", "path", "text", "line", "ellipse"]);
const NUM = ["x", "y", "cx", "cy", "r", "rx", "ry", "width", "height", "x1", "y1", "x2", "y2", "strokeWidth", "fontSize", "opacity", "weight", "fillOpacity"] as const;
const STR = ["d", "label", "labelHe", "short", "shortHe", "color", "stroke", "textColor", "dash"] as const;

function clean(raw: SvgElement): SvgElement | null {
  if (!raw || typeof raw.id !== "string" || !TYPES.has(raw.type)) return null;
  const el: SvgElement = { id: raw.id.slice(0, 60), type: raw.type };
  const r = raw as unknown as Record<string, unknown>;
  const o = el as unknown as Record<string, unknown>;
  for (const k of NUM) if (typeof r[k] === "number" && Number.isFinite(r[k])) o[k] = r[k];
  for (const k of STR) if (typeof r[k] === "string") o[k] = (r[k] as string).slice(0, k === "d" ? 4000 : 120);
  if (raw.anchor === "start" || raw.anchor === "end" || raw.anchor === "middle") el.anchor = raw.anchor;
  if (raw.ltr === true) el.ltr = true;
  if (raw.arrow === true) el.arrow = true;
  if (raw.halo === false) el.halo = false;
  if (Array.isArray(raw.to) && raw.to.length === 2 && raw.to.every((n) => typeof n === "number")) el.to = [raw.to[0], raw.to[1]];
  return el;
}

function legendOf(raw: unknown): LegendItem[] {
  if (!Array.isArray(raw)) return [];
  const sw = new Set(["line", "dash", "dot", "ring", "arrow"]);
  return raw
    .filter((l): l is Record<string, unknown> => !!l && typeof l === "object")
    .filter((l) => typeof l.color === "string" && typeof l.he === "string" && typeof l.en === "string")
    .slice(0, 7)
    .map((l) => ({ color: l.color as string, he: l.he as string, en: l.en as string, swatch: (sw.has(l.swatch as string) ? l.swatch : "dot") as LegendItem["swatch"] }));
}

/** One element per id: a later definition replaces an earlier one but keeps its paint order. */
function mergeById(els: SvgElement[]): SvgElement[] {
  const at = new Map<string, number>();
  const out: SvgElement[] = [];
  for (const e of els) {
    const i = at.get(e.id);
    if (i === undefined) { at.set(e.id, out.length); out.push(e); } else out[i] = e;
  }
  return out;
}

export function toDraftSteps(rawSteps: object[], rawLegend?: unknown): { steps: StepLike[]; findings: Finding[] } {
  const legend = legendOf(rawLegend);
  const steps: StepLike[] = rawSteps.map((s) => {
    const st = s as Record<string, unknown>;
    const elements = mergeById(expandComposites(Array.isArray(st.elements) ? st.elements : []).map(clean).filter((e): e is SvgElement => !!e));
    const highlight = Array.isArray(st.highlight) ? st.highlight.filter((h): h is string => typeof h === "string") : [];
    return {
      titleHe: String(st.titleHe ?? ""), titleEn: String(st.titleEn ?? ""),
      descHe: String(st.descHe ?? ""), descEn: String(st.descEn ?? ""),
      svgData: JSON.stringify({ v: 2, elements, highlight, legend, note: NOTE }),
    };
  });
  return { steps, findings: checkAnimation(steps) };
}

/** Normalise AI output and store it as a pending draft (never shown publicly). */
export async function saveDraft(d: {
  topicId: string; subtopicId?: string | null; targetSlug?: string | null; proposedSlug: string;
  nameHe: string; nameEn: string; feedback?: string | null; raw: { steps: object[]; legend: unknown[] };
}) {
  const { prisma } = await import("@/lib/prisma");
  const { steps, findings } = toDraftSteps(d.raw.steps, d.raw.legend);
  return prisma.processDraft.create({
    data: {
      topicId: d.topicId, subtopicId: d.subtopicId ?? null, targetSlug: d.targetSlug ?? null, proposedSlug: d.proposedSlug,
      nameHe: d.nameHe, nameEn: d.nameEn, feedback: d.feedback ?? null,
      steps: JSON.stringify(steps), issues: JSON.stringify(findings),
    },
  });
}
