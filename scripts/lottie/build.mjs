// Builds the vector (Lottie) process animations into public/lottie/*.json.
//   node scripts/lottie/build.mjs
// Each scene has 6 steps on a shared timeline: step k spans frames
// [STEP*k, STEP*(k+1)); motion happens in the first MOVE frames, then holds.
// The player (components/lottie/LottieProcessPlayer.tsx) plays one step at a
// time and draws the Hebrew labels (components/lottie/scenes.ts) on top.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { rgb, prop, bez, path as shPath, ellipse, rect, fill, stroke, trim, group, layer, comp, resetIds } from "./lib.mjs";

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

/* ═══════════════════════════════ MITOSIS ═══════════════════════════════ */

function mitosis() {
  resetIds();
  const CX = 400, CY = 250;

  // chromosome: [id, color, length]; two homologous pairs (maternal red / paternal blue)
  const CHROMS = [["A", "#2563eb", 66], ["A2", "#dc2626", 66], ["B", "#2563eb", 42], ["B2", "#dc2626", 42]];

  // Chromosome centers + rotation per state (0 = start … 6 = end of cytokinesis)
  const C = {
    A:  [[350, 215, 25], [350, 215, 25], [372, 182, 12], [400, 168, 0]],
    A2: [[447, 205, -35], [447, 205, -35], [426, 228, -10], [400, 222, 0]],
    B:  [[362, 297, 70], [362, 297, 70], [386, 292, 25], [400, 274, 0]],
    B2: [[455, 292, -15], [455, 292, -15], [418, 318, -8], [400, 316, 0]],
  };
  // anaphase / telophase cluster positions for the chromatid moving to each pole
  const POLE_POS = { A: [0, -58], A2: [10, -18], B: [4, 22], B2: [-4, 56] };
  const TELO_POS = { A: [-10, -30], A2: [14, -8], B: [-12, 14], B2: [10, 28] };

  const poleL = [[382, 118], [190, 250], [190, 250], [190, 250], [150, 250], [150, 250], [150, 250]];
  const poleR = [[418, 118], [610, 250], [610, 250], [610, 250], [650, 250], [650, 250], [650, 250]];

  const S = Array.from({ length: 7 }, (_, s) => ({ s }));

  const rot = (x, y, deg) => { const r = (deg * Math.PI) / 180; return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)]; };

  // Chromatid state: side -1 (goes to left pole) / +1 (right pole)
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
    return { p: [baseX + dx * -side, CY + 5 + dy], r: side * 20, shape: "wiggle", w: 4, o: 70 };
  }
  function chromatidPath(shape, L, side) {
    const a = L / 2;
    const P = {
      wiggle: [[0, -0.75 * L], [10, -0.37 * L], [0, 0], [-10, 0.37 * L], [0, 0.75 * L]],
      x: [[-4 * -side, -a], [-1 * -side, -a / 2], [0, 0], [-1 * -side, a / 2], [-4 * -side, a]],
      vL: [[a * 0.72, -a * 0.72], [a * 0.36, -a * 0.36], [0, 0], [a * 0.36, a * 0.36], [a * 0.72, a * 0.72]],
      vR: [[-a * 0.72, -a * 0.72], [-a * 0.36, -a * 0.36], [0, 0], [-a * 0.36, a * 0.36], [-a * 0.72, a * 0.72]],
    }[shape];
    // "x": sister arms splay away from each other (side -1 splays left)
    return bez(P, { smooth: shape === "wiggle" });
  }

  // 8 vertices: two lobes + a waist, so the furrow can pinch while the lobes stay
  // round. At pinch 0 the vertices sit on the ellipse at θ = 0°, ±58.7°, ±90°, …
  // with exact Bézier arc handles (4/3·tan(Δθ/4)); pinching blends the lobe
  // handles toward horizontal and pulls the waist in.
  function membrane(rx, ry, pinch) {
    const p = pinch, lerp = (a, b) => a + (b - a) * p;
    const A = 0.349, B = 0.183;                 // handle factors for the 58.7° and 31.3° arcs
    const S = 0.854, Co = 0.52;                 // sin/cos(58.7°)
    const waist = ry - p * (ry - 5);
    const lx = rx * 0.52, ly = ry * lerp(S, 1);
    const kv = A * ry * (1 + 0.4 * p);          // right/left vertex (vertical handles)
    const kw = B * rx * (1 - 0.9 * p);          // waist (horizontal handles)
    const hx = (f) => lerp(f * S * rx, 0.24 * rx), hy = (f) => lerp(f * Co * ry, 0);
    return {
      v: [[CX + rx, CY], [CX + lx, CY + ly], [CX, CY + waist], [CX - lx, CY + ly], [CX - rx, CY], [CX - lx, CY - ly], [CX, CY - waist], [CX + lx, CY - ly]],
      i: [[0, -kv], [hx(A), -hy(A)], [kw, 0], [hx(B), hy(B)], [0, kv], [-hx(A), hy(A)], [-kw, 0], [-hx(B), -hy(B)]],
      o: [[0, kv], [-hx(B), hy(B)], [-kw, 0], [-hx(A), -hy(A)], [0, -kv], [hx(B), -hy(B)], [kw, 0], [hx(A), hy(A)]],
      c: true,
    };
  }
  const CELL = [[280, 160, 0], [280, 160, 0], [280, 160, 0], [280, 160, 0], [310, 148, 0.12], [310, 148, 0.55], [310, 148, 0.97]];

  const layers = [background("#ffffff")];

  // cell membrane (fades out at the very end of cytokinesis, replaced by two daughter cells)
  const memO = [[0, 100], [STEP * 5 + 40, 100], [STEP * 5 + 58, 0]];
  layers.push(layer("cell", [group([
    shPath(tr(S, ({ s }) => membrane(...CELL[s]))),
    fill("#ecfdf5"), stroke("#10b981", 3),
  ])], { o: memO }, OP));
  const dO = [[0, 0], [STEP * 5 + 40, 0], [STEP * 5 + 58, 100]];
  for (const x of [205, 595]) {
    layers.push(layer(`daughter-${x}`, [group([ellipse(300, 290), fill("#ecfdf5"), stroke("#10b981", 3)], { p: [x, CY] })], { o: dO }, OP));
  }

  // nucleus + nucleolus + interphase chromatin
  layers.push(layer("nucleus", [group([
    ellipse(250, 210), fill("#fef3c7", 70),
    stroke("#d97706", 3, { dash: [tr(S, ({ s }) => (s >= 2 ? 10 : 400)), tr(S, ({ s }) => (s >= 2 ? 22 : 0))] }),
  ], { p: [CX, CY] })], { o: tr(S, ({ s }) => (s >= 2 ? 0 : 100)), s: tr(S, ({ s }) => (s >= 2 ? [118, 118, 100] : [100, 100, 100])), p: [0, 0], a: [0, 0] }, OP));
  // scale around the nucleus center: use anchor+position
  layers[layers.length - 1].ks.a = prop([CX, CY, 0]);
  layers[layers.length - 1].ks.p = prop([CX, CY, 0]);

  layers.push(layer("nucleolus", [group([ellipse(40, 34), fill("#92400e", 80)], { p: [438, 275] })], { o: tr(S, ({ s }) => (s === 0 ? 100 : 0)) }, OP));
  const threads = [
    [[310, 220], [340, 190], [372, 222], [402, 196], [430, 230]],
    [[330, 280], [360, 250], [392, 282], [420, 256], [470, 262]],
    [[372, 160], [400, 185], [430, 165], [462, 190], [482, 222]],
    [[318, 250], [345, 312], [380, 320], [410, 305], [452, 318]],
  ];
  layers.push(layer("chromatin", threads.map((pts, i) => group([shPath(bez(pts, { smooth: true })), stroke(i % 2 ? "#dc2626" : "#2563eb", 2.2, { o: 80 })])),
    { o: [[0, 100], [45, 0]] }, OP));

  // spindle: polar microtubules (overlap at the equator), asters, kinetochore microtubules
  const polarO = tr(S, ({ s }) => ([2, 3, 4].includes(s) ? 70 : s === 1 ? 30 : 0));
  for (const [side, pole] of [[-1, poleL], [1, poleR]]) {
    for (const dy of [-70, -20, 25, 72]) {
      layers.push(layer(`polar-${side}-${dy}`, [group([
        shPath(tr(S, ({ s }) => {
          const [px, py] = pole[s];
          const reach = s >= 4 ? 70 : 38;
          return bez([[px, py], [CX + side * -reach, CY + dy]], {});
        })),
        stroke("#94a3b8", 1.6),
      ])], { o: polarO }, OP));
    }
  }
  const kmtO = tr(S, ({ s }) => (s >= 2 && s <= 4 ? 90 : 0));
  const kmtTrim = [[0, 0], [STEP + 15, 0], [STEP + MOVE, 100]];
  for (const [id, color, L] of CHROMS) {
    for (const side of [-1, 1]) {
      const pole = side < 0 ? poleL : poleR;
      layers.push(layer(`kmt-${id}-${side}`, [group([
        shPath(tr(S, ({ s }) => {
          const c = chromatid(id, side, L, s);
          return bez([pole[s], [c.p[0] + side * 7, c.p[1]]], {});
        })),
        trim(0, kmtTrim), stroke("#64748b", 2),
      ])], { o: kmtO }, OP));
    }
  }

  // chromatids (drawn above the spindle)
  const kinO = tr(S, ({ s }) => (s >= 2 && s <= 4 ? 100 : 0));
  for (const [id, color, L] of CHROMS) {
    for (const side of [-1, 1]) {
      layers.push(layer(`chromatid-${id}-${side}`, [
        group([rect(6, 14, 2, [side * 7, 0]), fill("#7c3aed")], { o: kinO }), // kinetochore, faces its pole
        group([ellipse(8, 8), fill("#111827")], { o: tr(S, ({ s }) => (s >= 1 && s <= 4 ? 100 : 0)) }), // centromere
        group([shPath(tr(S, ({ s }) => chromatidPath(chromatid(id, side, L, s).shape, L, side))), stroke(color, tr(S, ({ s }) => chromatid(id, side, L, s).w))]),
      ], {
        p: tr(S, ({ s }) => [...chromatid(id, side, L, s).p, 0]),
        r: tr(S, ({ s }) => chromatid(id, side, L, s).r),
        o: TIMES.map((t, i) => [t, i === 0 ? 0 : chromatid(id, side, L, IDX[i]).o]),
      }, OP));
    }
  }

  // centrosomes with asters
  for (const [nm, pole] of [["L", poleL], ["R", poleR]]) {
    const rays = Array.from({ length: 10 }, (_, k) => {
      const a = (k / 10) * Math.PI * 2;
      return group([shPath(bez([[Math.cos(a) * 14, Math.sin(a) * 14], [Math.cos(a) * 42, Math.sin(a) * 42]], {})), stroke("#94a3b8", 1.4)]);
    });
    layers.push(layer(`centrosome-${nm}`, [
      group(rays, { o: tr(S, ({ s }) => (s === 0 ? 0 : 75)) }),
      group([ellipse(26, 26), fill("#fde68a", 70)]),
      group([rect(5, 15, 1.5), fill("#b45309")], { p: [-3, 0] }),
      group([rect(15, 5, 1.5), fill("#b45309")], { p: [4, 3] }),
    ], { p: tr(S, ({ s }) => [...pole[s], 0]) }, OP));
  }

  // contractile ring (actin–myosin), seen in cross-section at the furrow
  for (const side of [-1, 1]) {
    layers.push(layer(`ring-${side}`, [group([ellipse(12, 12), fill("#e11d48")])], {
      p: tr(S, ({ s }) => { const [rx, ry, pinch] = CELL[s]; const y = CY + side * (ry - pinch * (ry - 6)); return [CX, y + side * -2, 0]; }),
      o: [[0, 0], [STEP * 4 + 20, 0], [STEP * 4 + MOVE, 100], [STEP * 5 + 40, 100], [STEP * 5 + 58, 0]],
    }, OP));
  }

  // daughter nuclei reform in telophase
  for (const x of [212, 588]) {
    layers.push(layer(`dnuc-${x}`, [group([ellipse(150, 128), fill("#fef3c7", 55), stroke("#d97706", 2.5)])], {
      p: [x, CY + 5, 0],
      o: tr(S, ({ s }) => (s >= 5 ? 100 : 0)),
      s: tr(S, ({ s }) => (s >= 5 ? [100, 100, 100] : [55, 55, 100])),
    }, OP));
  }
  // chromatids should sit inside the new nuclei: move the nuclei below them
  const nucLayers = layers.splice(layers.length - 2, 2);
  layers.splice(layers.findIndex((l) => l.nm.startsWith("polar-")), 0, ...nucLayers);

  return comp({ nm: "mitosis", w: W, h: H, fr: FR, op: OP, layers, markers });
}

/* ═══════════════════════════ DNA REPLICATION ═══════════════════════════ */

function dnaReplication() {
  resetIds();
  const TOP = 150, BOT = 350, DT = 236, DB = 264, MID = 250; // arm / duplex y
  const LEAD_Y = 172, LAG_Y = 328;                               // new strands, inside the arms
  // fork x at the end of each state
  const F = [40, 430, 430, 540, 640, 640, 640];
  const S = Array.from({ length: 7 }, (_, s) => ({ s }));

  const strand = (fx, yArm, yDup) => ({
    v: [[-120, yArm], [fx - 75, yArm], [fx, yDup], [900, yDup]],
    i: [[0, 0], [-10, 0], [-38, 0], [0, 0]],
    o: [[10, 0], [38, 0], [10, 0], [0, 0]],
    c: false,
  });
  const seg = (x1, x2, y) => bez([[x1, y], [Math.max(x1, x2), y]], {});

  const layers = [background("#ffffff")];

  // base pairs of the unreplicated duplex (dashed thick line = rungs)
  layers.push(layer("rungs", [group([
    shPath(tr(S, ({ s }) => bez([[F[s] + 6, MID], [900, MID]], {}))),
    stroke("#cbd5e1", 26, { dash: [3, 9], cap: 1 }),
  ])], {}, OP));

  // parental (template) strands
  for (const [nm, yArm, yDup] of [["top", TOP, DT], ["bottom", BOT, DB]]) {
    layers.push(layer(`parent-${nm}`, [group([shPath(tr(S, ({ s }) => strand(F[s], yArm, yDup))), stroke("#1e3a8a", 7)])], {}, OP));
  }

  // leading strand: one primer, continuous synthesis toward the fork
  const leadEnd = [250, 250, 250, 470, 570, 570, 570];
  layers.push(layer("lead-primer", [group([shPath(seg(250, 280, LEAD_Y)), stroke(tr(S, ({ s }) => (s >= 5 ? "#16a34a" : "#f97316")), 7)])], {
    o: [[0, 0], [STEP + 10, 0], [STEP + 40, 100]],
  }, OP));
  layers.push(layer("lead-dna", [group([shPath(tr(S, ({ s }) => seg(280, Math.max(280, leadEnd[s]), LEAD_Y))), stroke("#16a34a", 7)])], {
    o: [[0, 0], [STEP * 2, 0], [STEP * 2 + 5, 100]],
  }, OP));

  // lagging strand: Okazaki fragments, each primed at its right end, extended leftward (away from the fork)
  const FRAGS = [
    { primer: [330, 350], left: [[3, 232]], step: 1 }, // primed in step 2, extended in step 4
    { primer: [450, 470], left: [[3, 355]], step: 3 },
    { primer: [550, 570], left: [[3, 475]], step: 3 },
  ];
  const lagLeft = (f, s) => {
    let x = f.primer[0];
    for (const [st, v] of f.left) if (s > st) x = v;
    return x;
  };
  FRAGS.forEach((f, k) => {
    const appear = f.step === 1 ? STEP + 20 : STEP * 3 + 5;
    layers.push(layer(`frag-primer-${k}`, [group([
      shPath(seg(f.primer[0], f.primer[1], LAG_Y)),
      stroke(tr(S, ({ s }) => (s >= 5 ? "#16a34a" : "#f97316")), 7),
    ])], { o: [[0, 0], [appear, 0], [appear + 20, 100]] }, OP));
    const sealed = (s) => (s >= 6 && k > 0 ? 5 : 0); // ligase closes the nick
    layers.push(layer(`frag-dna-${k}`, [group([
      shPath(tr(S, ({ s }) => seg(lagLeft(f, s) - sealed(s), f.primer[0], LAG_Y))),
      stroke("#16a34a", 7),
    ])], { o: [[0, 0], [STEP * 3, 0], [STEP * 3 + 5, 100]] }, OP));
  });

  // enzymes
  const blob = (nm, w, h, color, pos, o, extra = []) =>
    layers.push(layer(nm, [...extra, group([ellipse(w, h), fill(color, 88), stroke("#ffffff", 2)])], { p: pos, o }, OP));

  // topoisomerase ahead of the fork, helicase at the fork
  blob("topoisomerase", 34, 50, "#f59e0b", tr(S, ({ s }) => [F[s] + 120, MID, 0]), tr(S, ({ s }) => (s === 0 ? 0 : 100)));
  blob("helicase", 40, 58, "#7c3aed", tr(S, ({ s }) => [F[s] + 4, MID, 0]), tr(S, ({ s }) => (s === 0 ? 30 : 100)),
    [group([ellipse(14, 20), fill("#ffffff", 70)])]);
  // single-strand binding proteins on the exposed template, just behind the fork
  for (const [k, dx, y] of [[0, -32, 292], [1, -52, 312], [2, -32, 208], [3, -52, 188]]) {
    const top = y < MID;
    layers.push(layer(`ssb-${k}`, [group([ellipse(13, 13), fill("#0ea5e9")])], {
      p: tr(S, ({ s }) => [F[s] + dx, y, 0]),
      o: tr(S, ({ s }) => (s === 0 ? 0 : top && s >= 3 ? 0 : 100)),
    }, OP));
  }
  // primase: primes the leading strand + fragment 1 (step 2), then fragments 2–3 (step 4)
  const primasePos = [[265, LEAD_Y + 22], [265, LEAD_Y + 22], [340, LAG_Y - 22], [340, LAG_Y - 22], [560, LAG_Y - 22], [560, LAG_Y - 22], [560, LAG_Y - 22]];
  blob("primase", 26, 22, "#14b8a6", tr(S, ({ s }) => [...primasePos[s], 0]),
    [[0, 0], [STEP, 0], [STEP + 12, 100], [STEP * 2 - 5, 100], [STEP * 2 + 10, 0], [STEP * 3, 0], [STEP * 3 + 10, 100], [STEP * 4 - 10, 100], [STEP * 4, 0]]);
  // DNA polymerase III on each strand (sliding clamp ring drawn inside)
  const clamp = [group([ellipse(18, 18), stroke("#ffffff", 3)])];
  blob("pol3-lead", 54, 40, "#2563eb", tr(S, ({ s }) => [Math.max(leadEnd[s], 300) - 6, LEAD_Y, 0]),
    [[0, 0], [STEP * 2, 0], [STEP * 2 + 10, 100], [STEP * 5, 100], [STEP * 5 + 15, 0]], clamp);
  blob("pol3-lag", 54, 40, "#2563eb", tr(S, ({ s }) => [s <= 3 ? 450 : 362, LAG_Y, 0]),
    [[0, 0], [STEP * 3, 0], [STEP * 3 + 10, 100], [STEP * 4 - 10, 100], [STEP * 4, 0]], clamp);
  // DNA polymerase I sweeps over the primers (step 5)
  blob("pol1", 40, 32, "#db2777", [[0, [575, LAG_Y - 24, 0]], [STEP * 4, [575, LAG_Y - 24, 0]], [STEP * 4 + MOVE, [330, LAG_Y - 24, 0]]],
    [[0, 0], [STEP * 4, 0], [STEP * 4 + 8, 100], [STEP * 5 - 5, 100], [STEP * 5, 0]]);
  // ligase seals the two nicks (step 6)
  for (const x of [352, 472]) {
    blob(`ligase-${x}`, 26, 26, "#65a30d", [x, LAG_Y - 22, 0], [[0, 0], [STEP * 5, 0], [STEP * 5 + 15, 100]]);
  }

  return comp({ nm: "dna-replication", w: W, h: H, fr: FR, op: OP, layers, markers });
}

fs.mkdirSync(OUT, { recursive: true });
for (const [name, build] of [["mitosis", mitosis], ["dna-replication", dnaReplication]]) {
  const json = JSON.stringify(build());
  fs.writeFileSync(path.join(OUT, `${name}.json`), json);
  console.log(`public/lottie/${name}.json  ${(json.length / 1024).toFixed(1)} KB`);
}
