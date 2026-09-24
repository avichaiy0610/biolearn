// Minimal Lottie (bodymovin 5.x) builder used by scripts/lottie/build.mjs.
// Scenes are described as a list of "states" on a shared timeline; every
// animated property is keyframed at the same times with the same easing, so
// things that must stay attached (e.g. a microtubule end and a kinetochore)
// interpolate in lockstep.

const EASE = { i: { x: [0.45], y: [1] }, o: { x: [0.55], y: [0] } };

export function rgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
}

const arr = (v) => (Array.isArray(v) ? v : [v]);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** Static value or keyframes. `keys` = [[frame, value], ...]. Consecutive equal values collapse. */
export function prop(keys) {
  if (!Array.isArray(keys) || !Array.isArray(keys[0])) return { a: 0, k: keys };
  const ks = keys.filter((k, i) => i === 0 || i === keys.length - 1 || !(same(k[1], keys[i - 1][1]) && same(k[1], keys[i + 1][1])));
  if (ks.every((k) => same(k[1], ks[0][1]))) return { a: 0, k: ks[0][1] };
  return {
    a: 1,
    k: ks.map(([t, v], i) => (i < ks.length - 1 ? { t, s: arr(v), ...EASE } : { t, s: arr(v) })),
  };
}

/** Bezier path from points. smooth=true uses Catmull-Rom tangents. */
export function bez(points, { closed = false, smooth = false, tension = 0.5 } = {}) {
  const n = points.length;
  const i = [], o = [];
  for (let k = 0; k < n; k++) {
    if (!smooth) { i.push([0, 0]); o.push([0, 0]); continue; }
    const prev = points[closed ? (k - 1 + n) % n : Math.max(k - 1, 0)];
    const next = points[closed ? (k + 1) % n : Math.min(k + 1, n - 1)];
    const tx = ((next[0] - prev[0]) / 2) * tension, ty = ((next[1] - prev[1]) / 2) * tension;
    i.push([-tx, -ty]); o.push([tx, ty]);
  }
  return { i, o, v: points, c: closed };
}

/** Path shape; `keys` is a single bezier or [[frame, bezier], ...]. */
export function path(keys) {
  if (Array.isArray(keys)) {
    const ks = keys;
    if (ks.every((k) => same(k[1], ks[0][1]))) return { ty: "sh", d: 1, ks: { a: 0, k: ks[0][1] } };
    return { ty: "sh", d: 1, ks: { a: 1, k: ks.map(([t, v], idx) => (idx < ks.length - 1 ? { t, s: [v], ...EASE } : { t, s: [v] })) } };
  }
  return { ty: "sh", d: 1, ks: { a: 0, k: keys } };
}

export const ellipse = (w, h, p = [0, 0]) => ({ ty: "el", d: 1, p: prop(p), s: prop([w, h]) });
export const rect = (w, h, r = 0, p = [0, 0]) => ({ ty: "rc", d: 1, p: prop(p), s: prop([w, h]), r: prop(r) });
export const fill = (c, o = 100) => ({ ty: "fl", c: prop(Array.isArray(c) ? c.map(([t, h]) => [t, rgb(h)]) : rgb(c)), o: prop(o), r: 1 });
export function stroke(c, w, { o = 100, dash, cap = 2 } = {}) {
  const s = { ty: "st", c: prop(Array.isArray(c) ? c.map(([t, h]) => [t, rgb(h)]) : rgb(c)), o: prop(o), w: prop(w), lc: cap, lj: 2, ml: 4 };
  if (dash) s.d = [{ n: "d", nm: "dash", v: prop(dash[0]) }, { n: "g", nm: "gap", v: prop(dash[1]) }, { n: "o", nm: "offset", v: prop(0) }];
  return s;
}
export const trim = (start, end) => ({ ty: "tm", s: prop(start), e: prop(end), o: prop(0), m: 1 });

export function group(items, tr = {}) {
  return {
    ty: "gr",
    it: [
      ...items,
      { ty: "tr", p: prop(tr.p ?? [0, 0]), a: prop(tr.a ?? [0, 0]), s: prop(tr.s ?? [100, 100]), r: prop(tr.r ?? 0), o: prop(tr.o ?? 100), sk: prop(0), sa: prop(0) },
    ],
  };
}

let IND = 0;
export function resetIds() { IND = 0; }

/** Shape layer. Transform values are static values or keyframe lists. */
export function layer(nm, shapes, t = {}, op) {
  const ind = ++IND;
  return {
    ddd: 0, ind, ty: 4, nm, sr: 1, ao: 0, ip: 0, op, st: 0, bm: 0,
    ...(t.parent ? { parent: t.parent } : {}),
    ks: {
      o: prop(t.o ?? 100),
      r: prop(t.r ?? 0),
      p: prop(t.p ?? [0, 0, 0]),
      a: prop(t.a ?? [0, 0, 0]),
      s: prop(t.s ?? [100, 100, 100]),
    },
    shapes,
  };
}

export function comp({ nm, w, h, fr, op, layers, markers }) {
  // Lottie draws the first layer on top.
  return { v: "5.7.4", fr, ip: 0, op, w, h, nm, ddd: 0, assets: [], layers: [...layers].reverse().map((l) => ({ ...l, op })), markers };
}

/** Keyframes for a property sampled from a list of states: [[frame, stateIndex], ...] → fn(state). */
export function track(times, states, fn) {
  return times.map((t, i) => [t, fn(states[i], i)]);
}
