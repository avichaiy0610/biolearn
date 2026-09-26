// Composite structures the admin-panel AI may place with one element:
//   {"id":"rib","type":"use","shape":"ribosome","x":200,"y":190}
// expandComposites() replaces each with the real drawing from kit.ts (the same
// helpers the hand-polished scenes use), so AI drafts start from real biology
// instead of circles. Parts get ids "<id>_<part>" — reuse the same id and shape
// across steps and the parts tween together.
import {
  C, badge, bilayer, chromosome, circle, dsDNA, ellipse, mitochondrion, mrna, path, ribosome, ring, single, smooth, trna,
  type El, type Pt,
} from "./kit";

export type UseElement = { id: string; type: "use"; shape: string; [k: string]: unknown };

const num = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) ? v : d);
const str = (v: unknown, d: string) => (typeof v === "string" && v ? v : d);

function nucleus(id: string, cx: number, cy: number, r: number): El[] {
  const pores: [number, number][] = [0, 60, 120, 180, 240, 300].map((a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)]);
  return [
    circle(`${id}_env`, cx, cy, r, "#fef3c7", { stroke: "#b45309", strokeWidth: 2.2 }),
    circle(`${id}_inner`, cx, cy, r - 4, "none", { stroke: "#d97706", strokeWidth: 1.4 }),
    ...pores.map(([x, y], i) => circle(`${id}_pore${i}`, x, y, 2.6, "#ffffff", { stroke: "#92400e", strokeWidth: 1.2 })),
    circle(`${id}_nucleolus`, cx - r * 0.2, cy - r * 0.1, r * 0.28, "#fcd34d", { stroke: "#a16207", strokeWidth: 1 }),
  ];
}

function enzyme(id: string, cx: number, cy: number, r: number, color: string): El[] {
  // globular protein with an active-site cleft on top
  const pts: Pt[] = [[cx - r, cy], [cx - r * 0.8, cy - r * 0.75], [cx - r * 0.25, cy - r * 0.9], [cx, cy - r * 0.45], [cx + r * 0.25, cy - r * 0.9], [cx + r * 0.8, cy - r * 0.75], [cx + r, cy], [cx + r * 0.7, cy + r * 0.8], [cx, cy + r], [cx - r * 0.7, cy + r * 0.8]];
  return [path(`${id}`, smooth(pts, true), { color, stroke: "#334155", strokeWidth: 1.8 })];
}

// 26S proteasome: 20S core (α7β7β7α7 rings) with 19S caps; (x, y) = top-left, 76 × 178
function proteasome(id: string, x: number, y: number): El[] {
  const W = 76;
  return [
    path(`${id}_cap1`, `M ${x + 4} ${y + 34} L ${x + 14} ${y} L ${x + W - 14} ${y} L ${x + W - 4} ${y + 34} Z`, { color: "#ddd6fe", stroke: "#6d28d9", strokeWidth: 2 }),
    ...[0, 1, 2, 3].map((i) => ({ id: `${id}_ring${i}`, type: "rect" as const, x, y: y + 36 + i * 27, width: W, height: 25, color: i === 0 || i === 3 ? "#99f6e4" : "#5eead4", rx: 5, stroke: "#0f766e", strokeWidth: 1.8 })),
    path(`${id}_cap2`, `M ${x + 4} ${y + 146} L ${x + W - 4} ${y + 146} L ${x + W - 14} ${y + 178} L ${x + 14} ${y + 178} Z`, { color: "#ddd6fe", stroke: "#6d28d9", strokeWidth: 2 }),
  ];
}

function cell(id: string, cx: number, cy: number, rx: number, ry: number): El[] {
  return [
    ellipse(`${id}`, cx, cy, rx, ry, "#f0fdf4", { stroke: "#16a34a", strokeWidth: 2.5 }),
    ellipse(`${id}_in`, cx, cy, rx - 5, ry - 5, "none", { stroke: C.membrane, strokeWidth: 1.4, dash: "0.1 5" }),
  ];
}

export function expandUse(u: UseElement): El[] {
  const id = u.id, x = num(u.x, 200), y = num(u.y, 150);
  switch (u.shape) {
    case "dsDNA": return dsDNA(id, num(u.x1, 20), num(u.x2, 380), y, { tags: u.tags !== false, gap: num(u.gap, 14) });
    case "mrna": return mrna(id, num(u.x1, 14), num(u.x2, 386), y, num(u.c0, 110), Array.isArray(u.codons) ? (u.codons as unknown[]).map(String).slice(0, 8) : []);
    case "ribosome": return ribosome(id, x, y, { sites: u.sites !== false });
    case "trna": return trna(id, x, y, { anticodon: typeof u.anticodon === "string" ? u.anticodon : undefined, aa: u.aa ? "aa" : undefined, aaColor: str(u.aaColor, C.protein) });
    case "bilayer": return bilayer(id, num(u.x1, 0), num(u.x2, 400), y, { th: num(u.th, 14) });
    case "mitochondrion": return mitochondrion(id, num(u.cx, x), num(u.cy, y), num(u.rx, 70), num(u.ry, 42), {}, 0.3, 5);
    case "chromosome": return chromosome(id, x, num(u.y1, y - 30), num(u.y2, y + 30), str(u.color, C.maternal), { cen: num(u.cen, 0.45) });
    case "chromatid": return single(id, x, num(u.y1, y - 30), num(u.y2, y + 30), str(u.color, C.maternal), { cen: num(u.cen, 0.45) });
    case "badge": return badge(id, x, y, str(u.text, "ATP"), str(u.color, C.energy));
    case "sugar": return [path(id, ring(x, y, num(u.r, 20), u.ring === 5 ? 5 : 6), { color: "#fde68a", stroke: "#b45309", strokeWidth: 2 })];
    case "nucleus": return nucleus(id, num(u.cx, x), num(u.cy, y), num(u.r, 45));
    case "enzyme": return enzyme(id, num(u.cx, x), num(u.cy, y), num(u.r, 24), str(u.color, "#c7d2fe"));
    case "cell": return cell(id, num(u.cx, x), num(u.cy, y), num(u.rx, 170), num(u.ry, 120));
    case "proteasome": return proteasome(id, x, y);
    default: return [];
  }
}

export const COMPOSITE_SHAPES = ["dsDNA", "mrna", "ribosome", "trna", "bilayer", "mitochondrion", "chromosome", "chromatid", "badge", "sugar", "nucleus", "enzyme", "cell", "proteasome"];

/** Short reference for the AI prompt. */
export const COMPOSITE_DOC = `COMPOSITES — one element draws a real structure: {"id":"...","type":"use","shape":"<name>", params}
  dsDNA        x1,x2,y            double helix ladder, 5'/3' tags; top strand 5'→3' left→right
  mrna         x1,x2,y,c0,codons  mRNA line with codon letters (codons: ["AUG","UUC",...], 44px each from c0)
  ribosome     x,y                x = P-site centre, y = mRNA level; large subunit above with E/P/A sites, small below
  trna         x,y,anticodon,aa   y = bottom of anticodon loop (sits on the mRNA); aa:true shows the amino acid
  bilayer      x1,x2,y            phospholipid bilayer edge-on (membranes)
  mitochondrion cx,cy,rx,ry       outer membrane + folded inner membrane (cristae)
  nucleus      cx,cy,r            double envelope with pores + nucleolus
  cell         cx,cy,rx,ry        plasma membrane outline
  chromosome   x,y1,y2,color      replicated chromosome (two sister chromatids, centromere)
  chromatid    x,y1,y2,color      single chromatid
  enzyme       cx,cy,r,color      globular protein with active-site cleft
  sugar        x,y,ring           ring:6 pyranose (glucose) / 5 furanose (fructose)
  badge        x,y,text,color     rounded molecule tag: "ATP","NADH","CO₂"
  proteasome   x,y                26S proteasome (19S caps + 20S barrel), x,y = top-left, 76×178`;

/** Replace every "use" element with its drawn parts; everything else passes through. */
export function expandComposites(elements: unknown[]): El[] {
  const out: El[] = [];
  for (const e of elements) {
    if (!e || typeof e !== "object") continue;
    const el = e as Record<string, unknown>;
    if (el.type === "use" && typeof el.id === "string" && typeof el.shape === "string") {
      const parts = expandUse(el as UseElement);
      const op = typeof el.opacity === "number" ? el.opacity : undefined;
      out.push(...(op === undefined ? parts : parts.map((p) => ({ ...p, opacity: op }))));
    } else out.push(el as El);
  }
  return out;
}
