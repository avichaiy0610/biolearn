// Shared model for step animations stored in ProcessStep.svgData (viewBox 400x300).
// Rendered by components/ProcessAnimation.tsx (SVG) and ProcessInlineVideo.tsx (canvas).
//
// v1 = the original LLM-generated scenes. v2 = hand-authored scenes built by
// scripts/svg-scenes/build.mjs: they opt out of the legacy chromosome heuristic
// and add Hebrew labels, leader lines, dashes, legend and a "not to scale" note.
import { svgLabel } from "@/lib/svg-labels-he";
import { isolatePrimes } from "@/lib/text";

export type SvgElement = {
  id: string;
  type: "circle" | "rect" | "path" | "text" | "line" | "ellipse";
  x?: number; y?: number;
  cx?: number; cy?: number;
  r?: number; rx?: number; ry?: number;
  width?: number; height?: number;
  x1?: number; y1?: number; x2?: number; y2?: number;
  d?: string;
  label?: string;
  color?: string;
  stroke?: string;
  strokeWidth?: number;
  textColor?: string;
  fontSize?: number;
  opacity?: number;
  // v2 additions
  labelHe?: string;
  short?: string;       // shorter English label for narrow screens
  shortHe?: string;     // shorter Hebrew label for narrow screens
  weight?: number;      // font weight
  anchor?: "start" | "middle" | "end";
  ltr?: boolean;        // force left-to-right (5'/3' tags, formulas)
  to?: [number, number]; // leader line from the label to this point
  dash?: string;        // stroke-dasharray
  arrow?: boolean;      // arrowhead at the end of a line/path
  fillOpacity?: number;
  halo?: boolean;       // white outline behind text (default true)
};

export type LegendItem = { color: string; he: string; en: string; swatch?: "line" | "dash" | "dot" | "ring" | "arrow" };

export type SceneData = {
  v?: number;
  elements: SvgElement[];
  highlight?: string[];
  legend?: LegendItem[];
  note?: { he: string; en: string };
};

export const V2_MIN_LABEL = 16.5; // ≈14 CSS px on a 390px phone (viewBox 400 wide)

export function parseSvgData(raw: string): SceneData {
  try {
    const p = JSON.parse(raw);
    return {
      v: typeof p?.v === "number" ? p.v : 1,
      elements: Array.isArray(p?.elements) ? p.elements : [],
      highlight: Array.isArray(p?.highlight) ? p.highlight : undefined,
      legend: Array.isArray(p?.legend) ? p.legend : undefined,
      note: p?.note && typeof p.note.he === "string" ? p.note : undefined,
    };
  } catch {
    return { v: 1, elements: [] };
  }
}

export function allElementIds(scenes: SceneData[]): string[] {
  const seen = new Map<string, boolean>(); // id -> is text
  for (const s of scenes) for (const el of s.elements) if (!seen.has(el.id)) seen.set(el.id, el.type === "text");
  const ids = [...seen.keys()];
  // v2 scenes: labels always paint above the drawing
  if (scenes.length && scenes.every((s) => (s.v ?? 1) >= 2)) return [...ids.filter((i) => !seen.get(i)), ...ids.filter((i) => seen.get(i))];
  return ids;
}

/** Element as it should appear at `stepIndex`; one that left the scene fades out from its last pose. */
export function elementAtStep(id: string, stepIndex: number, scenes: SceneData[]): SvgElement | null {
  const found = scenes[stepIndex]?.elements.find((e) => e.id === id);
  if (found) return found;
  for (let i = stepIndex - 1; i >= 0; i--) {
    const prev = scenes[i].elements.find((e) => e.id === id);
    if (prev) return { ...prev, opacity: 0 };
  }
  return null;
}

/** `anchor` in scene data is visual (start = text extends to the right); SVG/canvas flip it in RTL. */
export function textAnchorFor(el: SvgElement, rtl: boolean): "start" | "middle" | "end" {
  const a = el.anchor ?? "middle";
  if (a === "middle" || !rtl) return a;
  return a === "start" ? "end" : "start";
}

export function labelText(el: SvgElement, lang: string, short = false): string {
  if (lang === "he") {
    const he = (short && el.shortHe) || el.labelHe;
    if (he) return isolatePrimes(he);
    return svgLabel((short && el.short) || el.label || "", lang);
  }
  return (short && el.short) || el.label || "";
}

export function fontSizeOf(el: SvgElement, v2: boolean, min: number): number {
  return Math.max(v2 ? V2_MIN_LABEL : min, el.fontSize ?? (v2 ? V2_MIN_LABEL : 11));
}

/** Start point of a leader line: the edge of the (estimated) label box nearest the target. */
export function leaderStart(el: SvgElement, text: string, size: number): [number, number] {
  const [tx, ty] = el.to!;
  const x = el.x ?? 0, y = el.y ?? 0;
  const w = text.length * size * 0.55 + 6, h = size * 1.1;
  const cx = el.anchor === "start" ? x + w / 2 : el.anchor === "end" ? x - w / 2 : x;
  const cy = y - size * 0.32;
  const dx = tx - cx, dy = ty - cy;
  if (Math.abs(dx) * h > Math.abs(dy) * w) return [cx + Math.sign(dx) * w / 2, cy + (dy * (w / 2)) / Math.abs(dx || 1)];
  return [cx + (dx * (h / 2)) / Math.abs(dy || 1), cy + Math.sign(dy) * h / 2];
}
