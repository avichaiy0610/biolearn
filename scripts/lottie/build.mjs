// Builds the vector (Lottie) process animations into public/lottie/*.json.
//   node scripts/lottie/build.mjs
// Each scene has 6 steps on a shared timeline: step k spans frames
// [STEP*k, STEP*(k+1)); motion happens in the first MOVE frames, then holds.
// The player (components/lottie/LottieProcessPlayer.tsx) plays one step at a
// time and draws the Hebrew/English labels (components/lottie/scenes.ts) on top.
//
// Both scenes are schematic (not to scale). Scientific reference for what is
// drawn at each stage: Campbell Biology 12e ch. 12 & 16; Alberts MBoC 7e ch. 5 & 17.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { prop, bez, path as shPath, ellipse, rect, fill, stroke, trim, group, layer, comp, resetIds, arc, poly } from "./lib.mjs";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../public/lottie");
const W = 800, H = 480, FR = 30, STEP = 90, MOVE = 60, STEPS = 6, OP = STEP * STEPS;

// times [0, 60, 90, 150, ...] ↔ state index [0, 1, 1, 2, 2, ...]
const TIMES = [0];
const IDX = [0];
for (let k = 0; k < STEPS; k++) {
  TIMES.push(STEP * k + MOVE); IDX.push(k + 1);
  TIMES.push(STEP * (k + 1)); IDX.push(k + 1);
}
const tr = (states, fn) => TIMES.map((t, i) => [t, fn(states[IDX[i]], IDX[i])]);
const markers = Array.from({ length: STEPS }, (_, k) => ({ tm: STEP * k, cm: `step${k + 1}`, dr: STEP }));
const background = (color) => layer("background", [group([rect(W, H), fill(color)], { p: [W / 2, H / 2] })], {}, OP);
const S7 = Array.from({ length: 7 }, (_, s) => ({ s }));

/* ═══════════════════════════════ MITOSIS ═══════════════════════════════
   States: 0 = late G2 (start of prophase), 1 = end of prophase,
   2 = prometaphase, 3 = metaphase, 4 = anaphase, 5 = telophase, 6 = cytokinesis.
   2n = 4 (two homologous pairs, maternal red / paternal blue); the number of
   chromosomes is constant. DNA was already replicated in S phase — nothing is
   replicated here: from prophase on every chromosome is two sister chromatids. */

function mitosis() {
  resetIds();
  const CX = 400, CY = 250;

  // chromosome: [id, color, length]; homologs share a length (A/A2 long, B/B2 short)
  const CHROMS = [["A", "#2563eb", 66], ["A2", "#dc2626", 66], ["B", "#2563eb", 42], ["B2", "#dc2626", 42]];

  // Chromosome centers + rotation for states 0..3 (inside the nucleus → metaphase plate)
  const C = {
    A:  [[350, 215, 25], [350, 215, 25], [372, 182, 12], [400, 168, 0]],
    A2: [[447, 205, -35], [447, 205, -35], [426, 228, -10], [400, 222, 0]],
    B:  [[362, 297, 70], [362, 297, 70], [386, 292, 25], [400, 274, 0]],
    B2: [[455, 292, -15], [455, 292, -15], [418, 318, -8], [400, 316, 0]],
  };
  const POLE_POS = { A: [0, -58], A2: [10, -18], B: [4, 22], B2: [-4, 56] };
  const TELO_POS = { A: [-10, -22], A2: [12, -6], B: [-10, 10], B2: [10, 22] };
  const NUC_X = [232, 568]; // daughter nuclei (telophase)

  // Centrosomes: side by side above the nucleus at the start of prophase, then to the poles.
  const poleL = [[382, 118], [190, 250], [190, 250], [190, 250], [150, 250], [138, 250], [138, 250]];
  const poleR = [[418, 118], [610, 250], [610, 250], [610, 250], [650, 250], [662, 250], [662, 250]];

  const rot = (x, y, deg) => { const r = (deg * Math.PI) / 180; return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)]; };

  // Chromatid state: side -1 (goes to the left pole) / +1 (right pole)
  function chromatid(id, side, L, s) {
    if (s <= 3) {
      const [cx, cy, r] = C[id][s];
      const [ox, oy] = rot(6 * side, 0, r);
      return { p: [cx + ox, cy + oy], r, shape: s === 0 ? "wiggle" : "x", w: s === 0 ? 3 : 12, o: s === 0 ? 0 : 100 };
    }
    const baseX = side < 0 ? 210 : 590;
    if (s === 4) {
      const [dx, dy] = POLE_POS[id];
      return { p: [baseX - side * dx * 0.3, CY + dy], r: 0, shape: side < 0 ? "vL" : "vR", w: 11, o: 100 };
    }
    const [dx, dy] = TELO_POS[id];
    return { p: [(side < 0 ? NUC_X[0] : NUC_X[1]) + dx * -side, CY + 5 + dy], r: side * 20, shape: "loose", w: 4, o: 75 };
  }
  function chromatidPath(shape, L, side) {
    const a = L / 2;
    const P = {
      wiggle: [[0, -0.75 * L], [10, -0.37 * L], [0, 0], [-10, 0.37 * L], [0, 0.75 * L]],
      // telophase: decondensing chromatin, compact enough to sit inside the new nucleus
      loose: [[0, -0.4 * L], [8, -0.2 * L], [0, 0], [-8, 0.2 * L], [0, 0.4 * L]],
      // sister arms splay away from each other; the pair touches at the centromere
      x: [[-4 * -side, -a], [-1 * -side, -a / 2], [0, 0], [-1 * -side, a / 2], [-4 * -side, a]],
      // anaphase: centromere leads toward the pole, arms trail behind
      vL: [[a * 0.72, -a * 0.72], [a * 0.36, -a * 0.36], [0, 0], [a * 0.36, a * 0.36], [a * 0.72, a * 0.72]],
      vR: [[-a * 0.72, -a * 0.72], [-a * 0.36, -a * 0.36], [0, 0], [-a * 0.36, a * 0.36], [-a * 0.72, a * 0.72]],
    }[shape];
    return bez(P, { smooth: shape === "wiggle" || shape === "loose" });
  }

  // 8-vertex membrane: two lobes + a waist so the furrow can pinch while the lobes
  // stay round. Exact Bézier arc handles at pinch 0 (see git history for the math).
  function membrane(rx, ry, pinch) {
    const p = pinch, lerp = (a, b) => a + (b - a) * p;
    const A = 0.349, B = 0.183, Sn = 0.854, Co = 0.52;
    const waist = ry - p * (ry - 5);
    const lx = rx * 0.52, ly = ry * lerp(Sn, 1);
    const kv = A * ry * (1 + 0.4 * p);
    const kw = B * rx * (1 - 0.9 * p);
    const hx = (f) => lerp(f * Sn * rx, 0.24 * rx), hy = (f) => lerp(f * Co * ry, 0);
    return {
      v: [[CX + rx, CY], [CX + lx, CY + ly], [CX, CY + waist], [CX - lx, CY + ly], [CX - rx, CY], [CX - lx, CY - ly], [CX, CY - waist], [CX + lx, CY - ly]],
      i: [[0, -kv], [hx(A), -hy(A)], [kw, 0], [hx(B), hy(B)], [0, kv], [-hx(A), hy(A)], [-kw, 0], [-hx(B), -hy(B)]],
      o: [[0, kv], [-hx(B), hy(B)], [-kw, 0], [-hx(A), -hy(A)], [0, -kv], [hx(B), -hy(B)], [kw, 0], [hx(A), hy(A)]],
      c: true,
    };
  }
  const CELL = [[280, 160, 0], [280, 160, 0], [280, 160, 0], [280, 160, 0], [310, 148, 0.12], [310, 148, 0.55], [310, 148, 0.97]];

  const layers = [background("#ffffff")];

  // ── plasma membrane: a bilayer hint (outer dark line + inner light line) ──
  const memO = [[0, 100], [STEP * 5 + 40, 100], [STEP * 5 + 58, 0]];
  layers.push(layer("cell", [
    group([shPath(tr(S7, ({ s }) => { const [rx, ry, p] = CELL[s]; return membrane(rx - 4, ry - 4, p); })), stroke("#6ee7b7", 1.5)]),
    group([shPath(tr(S7, ({ s }) => membrane(...CELL[s]))), fill("#f0fdf4"), stroke("#059669", 3)]),
  ], { o: memO }, OP));
  const dO = [[0, 0], [STEP * 5 + 40, 0], [STEP * 5 + 58, 100]];
  for (const x of [205, 595]) {
    layers.push(layer(`daughter-${x}`, [
      group([ellipse(292, 282), stroke("#6ee7b7", 1.5)], { p: [x, CY] }),
      group([ellipse(300, 290), fill("#f0fdf4"), stroke("#059669", 3)], { p: [x, CY] }),
    ], { o: dO }, OP));
  }

  // ── mitochondria: context only (makes the drawing read as an animal cell);
  //    they are partitioned between the two daughter cells ──
  const MITO = [
    { pos: [[238, 168], [238, 168], [238, 168], [238, 168], [264, 164], [176, 176], [170, 176]], r: 28 },
    { pos: [[244, 336], [244, 336], [244, 336], [244, 336], [264, 336], [180, 330], [176, 330]], r: -22 },
    { pos: [[562, 168], [562, 168], [562, 168], [562, 168], [536, 164], [624, 176], [630, 176]], r: -28 },
    { pos: [[556, 336], [556, 336], [556, 336], [556, 336], [536, 336], [620, 330], [624, 330]], r: 22 },
  ];
  MITO.forEach((m, k) => {
    layers.push(layer(`mito-${k}`, [
      group([shPath(bez([[-9, -1], [-5, 3], [-1, -2], [3, 3], [7, -1]], { smooth: true })), stroke("#ea580c", 1.2)]),
      group([ellipse(30, 13), fill("#ffedd5"), stroke("#ea580c", 1.5)]),
    ], { p: tr(S7, ({ s }) => [...m.pos[s], 0]), r: m.r, o: 80 }, OP));
  });

  // ── nucleus: double membrane with pores (dashes), intact until prometaphase ──
  const NX = CX, NY = CY, NRX = 125, NRY = 105;
  const envO = [[0, 100], [STEP, 100], [STEP + 8, 0]];
  layers.push(layer("nucleus", [
    group([ellipse(NRX * 2 - 7, NRY * 2 - 7), stroke("#d97706", 1.6, { dash: [34, 5] })], { p: [NX, NY] }),
    group([ellipse(NRX * 2, NRY * 2), fill("#fef3c7", 70), stroke("#b45309", 2.4, { dash: [34, 5] })], { p: [NX, NY] }),
  ], { o: envO }, OP));
  // envelope fragments (vesicles) as it disassembles in prometaphase
  const FRAGS = 12;
  for (let k = 0; k < FRAGS; k++) {
    const a0 = (360 / FRAGS) * k + 4, a1 = a0 + 20, mid = ((a0 + a1) / 2) * (Math.PI / 180);
    const drift = [Math.cos(mid) * 26, Math.sin(mid) * 22];
    layers.push(layer(`env-frag-${k}`, [group([shPath(arc(NX, NY, NRX, NRY, a0, a1, 4)), stroke("#b45309", 2.4)])], {
      p: [[0, [0, 0, 0]], [STEP, [0, 0, 0]], [STEP + MOVE, [...drift, 0]]],
      o: [[0, 0], [STEP, 0], [STEP + 6, 100], [STEP + MOVE, 45], [STEP * 2 + 30, 0]],
    }, OP));
  }
  layers.push(layer("nucleolus", [group([ellipse(40, 34), fill("#92400e", 80)], { p: [438, 275] })], { o: [[0, 100], [45, 0]] }, OP));
  const threads = [
    [[310, 220], [340, 190], [372, 222], [402, 196], [430, 230]],
    [[330, 280], [360, 250], [392, 282], [420, 256], [470, 262]],
    [[372, 160], [400, 185], [430, 165], [462, 190], [482, 222]],
    [[318, 250], [345, 312], [380, 320], [410, 305], [452, 318]],
  ];
  layers.push(layer("chromatin", threads.map((pts, i) => group([shPath(bez(pts, { smooth: true })), stroke(i % 2 ? "#dc2626" : "#2563eb", 2.2, { o: 80 })])),
    { o: [[0, 100], [45, 0]] }, OP));

  // daughter nuclei (double membrane) + nucleoli reform in telophase
  for (const x of NUC_X) {
    layers.push(layer(`dnuc-${x}`, [
      group([ellipse(123, 105), stroke("#d97706", 1.4, { dash: [24, 4] })]),
      group([ellipse(130, 112), fill("#fef3c7", 55), stroke("#b45309", 2.2, { dash: [24, 4] })]),
    ], {
      p: [x, CY + 5, 0],
      o: tr(S7, ({ s }) => (s >= 5 ? 100 : 0)),
      s: tr(S7, ({ s }) => (s >= 5 ? [100, 100, 100] : [55, 55, 100])),
    }, OP));
    layers.push(layer(`dnucleolus-${x}`, [group([ellipse(22, 18), fill("#92400e", 75)])], {
      p: [x + (x < CX ? 30 : -30), CY + 28, 0],
      o: [[0, 0], [STEP * 4 + 35, 0], [STEP * 4 + MOVE, 100]],
    }, OP));
  }

  // ── spindle ──
  // Polar (interpolar) microtubules: only after the envelope breaks down; they
  // overlap at the equator and lengthen in anaphase, pushing the poles apart.
  const polarO = tr(S7, ({ s }) => ([2, 3, 4].includes(s) ? 75 : 0));
  for (const [side, pole] of [[-1, poleL], [1, poleR]]) {
    for (const dy of [-70, -22, 26, 72]) {
      layers.push(layer(`polar-${side}-${dy}`, [group([
        shPath(tr(S7, ({ s }) => {
          const [px, py] = pole[s];
          const reach = s >= 4 ? 70 : 38;
          return bez([[px, py], [CX + side * -reach, CY + dy]], {});
        })),
        stroke("#94a3b8", 1.6),
      ])], { o: polarO }, OP));
    }
  }
  // Kinetochore microtubules: grow from each pole and capture the kinetochore
  // facing it (prometaphase), shorten in anaphase, disassemble in telophase.
  const kmtO = tr(S7, ({ s }) => (s >= 2 && s <= 4 ? 100 : 0));
  const kmtTrim = [[0, 0], [STEP + 12, 0], [STEP + MOVE, 100]];
  for (const [id, , L] of CHROMS) {
    for (const side of [-1, 1]) {
      const pole = side < 0 ? poleL : poleR;
      layers.push(layer(`kmt-${id}-${side}`, [group([
        shPath(tr(S7, ({ s }) => {
          const c = chromatid(id, side, L, s);
          return bez([pole[s], [c.p[0] + side * 8, c.p[1]]], {});
        })),
        trim(0, kmtTrim), stroke("#0d9488", 2.4),
      ])], { o: kmtO }, OP));
    }
  }

  // ── chromatids (above the spindle) ──
  const kinO = tr(S7, ({ s }) => (s >= 2 && s <= 4 ? 100 : 0));
  for (const [id, color, L] of CHROMS) {
    for (const side of [-1, 1]) {
      layers.push(layer(`chromatid-${id}-${side}`, [
        // kinetochore: a plate on the centromere, facing that chromatid's pole
        group([rect(5, 15, 2, [side * 8, 0]), fill("#7c3aed")], { o: kinO }),
        group([ellipse(7, 7), fill("#111827")], { o: tr(S7, ({ s }) => (s >= 1 && s <= 4 ? 100 : 0)) }),
        group([shPath(tr(S7, ({ s }) => chromatidPath(chromatid(id, side, L, s).shape, L, side))), stroke(color, tr(S7, ({ s }) => chromatid(id, side, L, s).w))]),
      ], {
        p: tr(S7, ({ s }) => [...chromatid(id, side, L, s).p, 0]),
        r: tr(S7, ({ s }) => chromatid(id, side, L, s).r),
        o: TIMES.map((t, i) => [t, i === 0 ? 0 : chromatid(id, side, L, IDX[i]).o]),
      }, OP));
    }
  }
  // Centromeric cohesin holding the sisters together; it disappears at the very
  // start of anaphase (cleaved by separase), *before* the chromatids move apart.
  for (const [id] of CHROMS) {
    layers.push(layer(`cohesin-${id}`, [group([rect(16, 5, 2.5), fill("#f59e0b"), stroke("#92400e", 1)])], {
      p: tr(S7, ({ s }) => { const [x, y] = C[id][Math.min(Math.max(s, 1), 3)]; return [x, y, 0]; }),
      r: tr(S7, ({ s }) => C[id][Math.min(Math.max(s, 1), 3)][2]),
      o: [[0, 0], [30, 0], [MOVE, 100], [STEP * 3, 100], [STEP * 3 + 8, 0]],
    }, OP));
  }

  // ── centrosomes: pericentriolar material + a pair of perpendicular centrioles,
  //    with astral microtubules radiating toward the cortex ──
  for (const [nm, pole] of [["L", poleL], ["R", poleR]]) {
    const rays = Array.from({ length: 12 }, (_, k) => {
      const a = (k / 12) * Math.PI * 2;
      return group([shPath(bez([[Math.cos(a) * 15, Math.sin(a) * 15], [Math.cos(a) * 46, Math.sin(a) * 46]], {})), stroke("#a8a29e", 1.3)]);
    });
    layers.push(layer(`centrosome-${nm}`, [
      group([rect(5, 16, 1.5), fill("#78350f")], { p: [-4, 0] }),
      group([rect(16, 5, 1.5), fill("#78350f")], { p: [5, 4] }),
      group([ellipse(28, 28), fill("#fde68a", 85), stroke("#d97706", 1)]),
      group(rays, { o: tr(S7, ({ s }) => (s === 0 ? 25 : s >= 6 ? 50 : 85)) }),
    ], { p: tr(S7, ({ s }) => [...pole[s], 0]) }, OP));
  }

  // ── contractile ring (actin–myosin) in cross-section at the furrow ──
  for (const side of [-1, 1]) {
    layers.push(layer(`ring-${side}`, [group([ellipse(12, 12), fill("#e11d48"), stroke("#881337", 1)])], {
      p: tr(S7, ({ s }) => { const [, ry, pinch] = CELL[s]; const y = CY + side * (ry - pinch * (ry - 6)); return [CX, y + side * -2, 0]; }),
      o: [[0, 0], [STEP * 4 + 20, 0], [STEP * 4 + MOVE, 100], [STEP * 5 + 40, 100], [STEP * 5 + 58, 0]],
    }, OP));
  }

  // Draw order: nuclei and fragments below the spindle and chromatids.
  const under = layers.filter((l) => /^(dnuc|dnucleolus)-/.test(l.nm));
  const rest = layers.filter((l) => !/^(dnuc|dnucleolus)-/.test(l.nm));
  const at = rest.findIndex((l) => l.nm.startsWith("polar-"));
  rest.splice(at, 0, ...under);
  return comp({ nm: "mitosis", w: W, h: H, fr: FR, op: OP, layers: rest, markers });
}

/* ═══════════════════════════ DNA REPLICATION ═══════════════════════════
   One replication fork moving to the right (bacterial-style naming: DNA pol III,
   DNA pol I). Top template runs 3'→5' left to right, bottom template 5'→3', so
   the new top strand grows continuously toward the fork (leading) and the new
   bottom strand is made in pieces away from the fork (lagging). Every new DNA
   segment carries an arrowhead at its growing 3' end. */

function dnaReplication() {
  resetIds();
  const TOP = 150, BOT = 350, DT = 236, DB = 264, MID = 250; // arm / duplex y
  const LEAD_Y = 172, LAG_Y = 328;                               // new strands, inside the arms
  const F = [40, 430, 430, 540, 640, 640, 640];                 // fork x at the end of each state

  const strand = (fx, yArm, yDup) => ({
    v: [[-120, yArm], [fx - 75, yArm], [fx, yDup], [900, yDup]],
    i: [[0, 0], [-10, 0], [-38, 0], [0, 0]],
    o: [[10, 0], [38, 0], [10, 0], [0, 0]],
    c: false,
  });
  const seg = (x1, x2, y) => bez([[x1, y], [Math.max(x1, x2), y]], {});
  // arrowhead pointing +1 (right) or -1 (left), tip at the origin
  const head = (dir) => shPath(poly([[0, 0], [-dir * 14, -9], [-dir * 14, 9]]));

  const layers = [background("#ffffff")];

  // base pairs of the unreplicated duplex (rungs)
  layers.push(layer("rungs", [group([
    shPath(tr(S7, ({ s }) => bez([[F[s] + 10, MID], [900, MID]], {}))),
    stroke("#cbd5e1", 26, { dash: [3, 9], cap: 1 }),
  ])], {}, OP));

  // parental (template) strands
  for (const [nm, yArm, yDup] of [["top", TOP, DT], ["bottom", BOT, DB]]) {
    layers.push(layer(`parent-${nm}`, [group([shPath(tr(S7, ({ s }) => strand(F[s], yArm, yDup))), stroke("#1e3a8a", 7)])], {}, OP));
  }

  // ── leading strand: one primer, then continuous 5'→3' synthesis toward the fork ──
  const leadEnd = [280, 280, 280, 470, 570, 570, 570];
  const primerColor = tr(S7, ({ s }) => (s >= 5 ? "#16a34a" : "#f97316"));
  layers.push(layer("lead-primer", [group([shPath(seg(250, 280, LEAD_Y)), stroke(primerColor, 7)])], {
    o: [[0, 0], [STEP + 10, 0], [STEP + 40, 100]],
  }, OP));
  layers.push(layer("lead-dna", [group([shPath(tr(S7, ({ s }) => seg(280, leadEnd[s], LEAD_Y))), stroke("#16a34a", 7)])], {
    o: [[0, 0], [STEP * 2, 0], [STEP * 2 + 5, 100]],
  }, OP));
  layers.push(layer("lead-3end", [group([head(1), fill("#15803d")])], {
    p: tr(S7, ({ s }) => [leadEnd[s] + 12, LEAD_Y, 0]),
    o: [[0, 0], [STEP * 2, 0], [STEP * 2 + 10, 100]],
  }, OP));

  // ── lagging strand: Okazaki fragments, each primed at its 5' (right) end and
  //    extended 5'→3' leftward, away from the fork ──
  const OKZ = [
    { primer: [330, 350], left: 232, primedAt: STEP + 20 },      // primed in step 2
    { primer: [450, 470], left: 355, primedAt: STEP * 3 + 5 },   // primed in step 4
    { primer: [550, 570], left: 475, primedAt: STEP * 3 + 5 },
  ];
  const lagLeft = (f, s) => (s >= 4 ? f.left : f.primer[0]);
  OKZ.forEach((f, k) => {
    layers.push(layer(`frag-primer-${k}`, [group([shPath(seg(f.primer[0], f.primer[1], LAG_Y)), stroke(primerColor, 7)])], {
      o: [[0, 0], [f.primedAt, 0], [f.primedAt + 20, 100]],
    }, OP));
    const sealed = (s) => (s >= 6 && k > 0 ? 5 : 0); // ligase closes the nick to the previous fragment
    layers.push(layer(`frag-dna-${k}`, [group([shPath(tr(S7, ({ s }) => seg(lagLeft(f, s) - sealed(s), f.primer[0], LAG_Y))), stroke("#16a34a", 7)])], {
      o: [[0, 0], [STEP * 3, 0], [STEP * 3 + 5, 100]],
    }, OP));
    // 3' arrowhead while the fragment is growing; hidden once the nick is sealed
    layers.push(layer(`frag-3end-${k}`, [group([head(-1), fill("#15803d")])], {
      p: tr(S7, ({ s }) => [lagLeft(f, s) - 12, LAG_Y, 0]),
      o: [[0, 0], [STEP * 3, 0], [STEP * 3 + 10, 100], ...(k > 0 ? [[STEP * 5, 100], [STEP * 5 + 30, 0]] : [])],
    }, OP));
  });

  // ── proteins: schematic shapes chosen to hint at function (not real structures) ──
  // Topoisomerase ahead of the fork: a two-lobed clamp across the duplex.
  layers.push(layer("topoisomerase", [
    group([ellipse(22, 34), fill("#f59e0b", 92), stroke("#92400e", 1.5)], { p: [-11, -14] }),
    group([ellipse(22, 34), fill("#fbbf24", 92), stroke("#92400e", 1.5)], { p: [11, 14] }),
  ], { p: tr(S7, ({ s }) => [Math.min(F[s] + 120, 722), MID, 0]), o: tr(S7, ({ s }) => (s === 0 ? 0 : 100)) }, OP)); // stays clear of the 5'/3' end labels
  // Helicase at the fork: a hexameric ring (six subunits around a central channel).
  const hexa = Array.from({ length: 6 }, (_, k) => {
    const a = (k / 6) * Math.PI * 2;
    return group([ellipse(15, 15), fill(k % 2 ? "#8b5cf6" : "#7c3aed"), stroke("#ffffff", 1.5)], { p: [Math.cos(a) * 14, Math.sin(a) * 14] });
  });
  layers.push(layer("helicase", [group([ellipse(12, 12), fill("#ffffff")]), ...hexa], {
    p: tr(S7, ({ s }) => [F[s] + 6, MID, 0]), o: tr(S7, ({ s }) => (s === 0 ? 35 : 100)),
  }, OP));
  // SSB tetramers on the exposed single-stranded template just behind the fork.
  const ssb = [0, 1, 2, 3].map((k) => group([ellipse(9, 9), fill("#0ea5e9"), stroke("#ffffff", 1)], { p: [(k % 2) * 9 - 4.5, Math.floor(k / 2) * 9 - 4.5] }));
  for (const [k, dx, y] of [[0, -30, 290], [1, -52, 312], [2, -30, 210], [3, -52, 188]]) {
    const top = y < MID;
    layers.push(layer(`ssb-${k}`, ssb, {
      p: tr(S7, ({ s }) => [F[s] + dx, y, 0]),
      o: tr(S7, ({ s }) => (s === 0 ? 0 : top && s >= 3 ? 0 : 100)),
    }, OP));
  }
  // Primase: a small RNA polymerase with an active-site notch.
  const primasePos = [[265, LEAD_Y + 22], [265, LEAD_Y + 22], [340, LAG_Y - 22], [340, LAG_Y - 22], [560, LAG_Y - 22], [560, LAG_Y - 22], [560, LAG_Y - 22]];
  layers.push(layer("primase", [
    group([ellipse(8, 8), fill("#ffffff")], { p: [0, 7] }),
    group([rect(30, 20, 9), fill("#14b8a6"), stroke("#0f766e", 1.5)]),
  ], {
    p: tr(S7, ({ s }) => [...primasePos[s], 0]),
    // on for priming in step 2 and step 4, gone once the primers are laid
    o: [[0, 0], [STEP, 0], [STEP + 12, 100], [STEP + MOVE, 100], [STEP + MOVE + 15, 0], [STEP * 3, 0], [STEP * 3 + 10, 100], [STEP * 3 + MOVE, 100], [STEP * 3 + MOVE + 15, 0]],
  }, OP));
  // DNA polymerase III: a "hand" (palm + thumb) riding on a sliding-clamp ring.
  const pol3 = (dir) => [
    group([ellipse(22, 22), stroke("#1e40af", 4)], { p: [-dir * 22, 0] }),             // sliding clamp around the DNA, behind the enzyme
    group([ellipse(18, 12), fill("#3b82f6"), stroke("#ffffff", 1.5)], { p: [dir * 8, -20] }), // thumb
    group([ellipse(50, 38), fill("#2563eb", 94), stroke("#ffffff", 2)]),               // palm
  ];
  layers.push(layer("pol3-lead", pol3(1), {
    p: tr(S7, ({ s }) => [Math.max(leadEnd[s], 300) - 14, LEAD_Y, 0]),
    o: [[0, 0], [STEP * 2, 0], [STEP * 2 + 10, 100], [STEP * 5, 100], [STEP * 5 + 15, 0]],
  }, OP));
  layers.push(layer("pol3-lag", pol3(-1), {
    p: tr(S7, ({ s }) => [s <= 3 ? 452 : 368, LAG_Y, 0]),
    o: [[0, 0], [STEP * 3, 0], [STEP * 3 + 10, 100], [STEP * 4 - 10, 100], [STEP * 4, 0]],
  }, OP));
  // DNA polymerase I (smaller, no clamp) moves over the primers, replacing RNA with DNA.
  layers.push(layer("pol1", [
    group([ellipse(12, 10), fill("#f9a8d4")], { p: [-10, -4] }),
    group([ellipse(38, 28), fill("#db2777", 94), stroke("#ffffff", 1.5)]),
  ], {
    p: [[0, [575, LAG_Y - 26, 0]], [STEP * 4, [575, LAG_Y - 26, 0]], [STEP * 4 + MOVE, [330, LAG_Y - 26, 0]]],
    o: [[0, 0], [STEP * 4, 0], [STEP * 4 + 8, 100], [STEP * 5 - 5, 100], [STEP * 5, 0]],
  }, OP));
  // DNA ligase: a C-shaped clamp closing each nick.
  for (const x of [352, 472]) {
    layers.push(layer(`ligase-${x}`, [group([shPath(arc(0, 0, 13, 13, 40, 320, 6)), stroke("#65a30d", 7)])], {
      p: [x, LAG_Y - 24, 0], r: 90,
      o: [[0, 0], [STEP * 5, 0], [STEP * 5 + 15, 100]],
    }, OP));
  }

  return comp({ nm: "dna-replication", w: W, h: H, fr: FR, op: OP, layers, markers });
}

fs.mkdirSync(OUT, { recursive: true });
for (const [name, build] of [["mitosis", mitosis], ["dna-replication", dnaReplication]]) {
  const json = JSON.stringify(build());
  fs.writeFileSync(path.join(OUT, `${name}.json`), json);
  console.log(`public/lottie/${name}.json  ${(json.length / 1024).toFixed(1)} KB`);
}
