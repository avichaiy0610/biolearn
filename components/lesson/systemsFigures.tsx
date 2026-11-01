/* Original quantitative diagrams. Equations, verification and limitations:
   visual-lab/systems/learning-card.md. No curve is hand-fitted to a claimed value. */
import type React from "react";
import { BLUE, ORANGE, INK, MUTED, LINE, He as StandardHe, La } from "./biochemFigures";
const TEAL = "#0f766e", PURPLE = "#7c3aed", RED = "#b91c1c";
type XY = [number, number];
type Series = { name: string; color: string; points: XY[]; dash?: boolean };
const seq = (n: number) => Array.from({ length: n }, (_, i) => i);
const sample = (f: (x: number) => number, a: number, b: number, n = 200): XY[] => seq(n + 1).map(i => { const x = a + (b - a) * i / n; return [x, f(x)]; });
const hill = (x: number, n = 2, K = 1) => x ** n / (K ** n + x ** n);
function root(f: (x: number) => number, a: number, b: number) {
  if (f(a) * f(b) > 0) throw new Error("Root is not bracketed");
  for (let i = 0; i < 70; i++) { const c = (a + b) / 2; if (f(a) * f(c) <= 0) b = c; else a = c; }
  return (a + b) / 2;
}
// Fixed-step RK4, small step independent of the plotted sampling grid.
function integrate(f: (t: number, x: number[]) => number[], init: number[], end: number, dt = .001) {
  const rows: number[][] = [[0, ...init]]; let x = [...init];
  const n = Math.round(end / dt); dt = end / n;
  for (let i = 0; i < n; i++) {
    const t = i * dt, k1 = f(t, x), k2 = f(t + dt / 2, x.map((v, j) => v + dt * k1[j] / 2)), k3 = f(t + dt / 2, x.map((v, j) => v + dt * k2[j] / 2)), k4 = f(t + dt, x.map((v, j) => v + dt * k3[j]));
    x = x.map((v, j) => v + dt * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]) / 6); rows.push([(i + 1) * dt, ...x]);
  }
  return rows;
}
function points(rows: number[][], col = 1, offset = 0, stride = 15): XY[] { return rows.filter((_, i) => i % stride === 0 || i === rows.length - 1).map(r => [r[0] + offset, r[col]]); }
function crossing(rows: number[][], target: number, col = 1) { const i = rows.findIndex(r => r[col] >= target); if (i < 1) return rows[i]?.[0] ?? NaN; const a = rows[i - 1], b = rows[i]; return a[0] + (target - a[col]) / (b[col] - a[col]) * (b[0] - a[0]); }
function He(p: React.ComponentProps<typeof StandardHe>) {
  const children = typeof p.children === "string" ? p.children.replace(/[−+]?[A-Za-z0-9α-ωΑ-ΩΔβτλ][A-Za-z0-9_α-ωΑ-ΩΔβτλ²³⁴⁺⁻·−/().,=+*^ %:<>→↔≈≤≥-]*/g, m => "\u2066" + m.trimEnd() + "\u2069" + m.slice(m.trimEnd().length)) : p.children;
  return <StandardHe {...p}>{children}</StandardHe>;
}
function Fig({ h, label, children }: { h: number; label: string; children: React.ReactNode }) { return <svg viewBox={`0 0 480 ${h}`} className="w-full h-auto" role="img" aria-label={label}><title>{label}</title>{children}</svg>; }
function Note({ y, children, color = MUTED }: { y: number; children: string; color?: string }) { return <He x={240} y={y} size={19} color={color}>{children}</He>; }
function Panel({ y, h, title, children, color = BLUE }: { y: number; h: number; title: string; children: React.ReactNode; color?: string }) { return <g transform={`translate(0 ${y})`}><rect x={8} width={464} height={h} rx={14} fill="#f8fafc" stroke={LINE}/><He x={240} y={32} size={23} color={color} bold>{title}</He>{children}</g>; }
function Arrow({ x1, y1, x2, y2, color = INK, inhibit = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; inhibit?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a);
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2}/>{inhibit ? <path d={`M${x2 + 7 * s} ${y2 - 7 * c} L${x2 - 7 * s} ${y2 + 7 * c}`} stroke={color} strokeWidth={3}/> : <path d={`M${x2 - 10 * c + 5 * s} ${y2 - 10 * s - 5 * c} L${x2} ${y2} L${x2 - 10 * c - 5 * s} ${y2 - 10 * s + 5 * c}`} fill="none" stroke={color} strokeWidth={2}/>}</g>;
}
function Node({ x, y, name, color = BLUE }: { x: number; y: number; name: string; color?: string }) { const w=Math.max(62,name.length*18);return <g><rect x={x - w/2} y={y - 23} width={w} height={46} rx={10} fill="white" stroke={color} strokeWidth={2}/><La x={x} y={y + 8} size={23} color={color} bold>{name}</La></g>; }
// Full-width plot; legends and numerical annotations live below the axes, never on a curve.
function Plot({ y, title, series, xr, yr, xt, yt, xLabel = "t", yLabel = "x", logX = false, logY = false, vlines = [], hlines = [], dots = [], bands = [] }: {
  y: number; title: string; series: Series[]; xr: [number, number]; yr: [number, number]; xt: number[]; yt: number[]; xLabel?: string; yLabel?: string; logX?: boolean; logY?: boolean;
  vlines?: number[]; hlines?: number[]; dots?: { x: number; y: number; color?: string; open?: boolean }[]; bands?: { a: number; b: number; color: string }[];
}) {
  const trX = (v: number) => logX ? Math.log10(v) : v, trY = (v: number) => logY ? Math.log10(v) : v;
  const sx = (v: number) => 78 + 350 * (trX(v) - trX(xr[0])) / (trX(xr[1]) - trX(xr[0]));
  const sy = (v: number) => 276 - 196 * (trY(v) - trY(yr[0])) / (trY(yr[1]) - trY(yr[0]));
  const fmt = (v: number) => Number.isInteger(v) ? String(v) : String(Number(v.toPrecision(3)));
  return <Panel y={y} h={345 + series.length * 28} title={title}>
    <La x={82} y={62} size={18} anchor="start">{yLabel}</La>
    {bands.map((v, i) => <rect key={i} x={sx(v.a)} y={80} width={sx(v.b) - sx(v.a)} height={196} fill={v.color} opacity={.09}/>)}
    {vlines.map((x, i) => <line key={i} x1={sx(x)} x2={sx(x)} y1={80} y2={276} stroke={MUTED} strokeWidth={1} strokeDasharray="4 5"/>)}
    {hlines.map((v, i) => <line key={i} x1={78} x2={428} y1={sy(v)} y2={sy(v)} stroke={MUTED} strokeWidth={1} strokeDasharray="4 5"/>)}
    <path d="M78 80 V276 H428" fill="none" stroke={INK} strokeWidth={1.5}/>
    {xt.map(x => <g key={x}><line x1={sx(x)} x2={sx(x)} y1={276} y2={282} stroke={INK}/><La x={sx(x)} y={304} size={17}>{fmt(x)}</La></g>)}
    {yt.map(v => <g key={v}><line x1={72} x2={78} y1={sy(v)} y2={sy(v)} stroke={INK}/><La x={64} y={sy(v) + 6} size={17} anchor="end">{fmt(v)}</La></g>)}
    <La x={428} y={331} size={18} anchor="end">{xLabel}</La>
    {series.map(s => <path key={s.name} d={s.points.filter(p => p.every(Number.isFinite)).map((p, i) => `${i ? "L" : "M"}${sx(p[0]).toFixed(2)} ${sy(p[1]).toFixed(2)}`).join(" ")} fill="none" stroke={s.color} strokeWidth={2.8} strokeDasharray={s.dash ? "7 5" : undefined}/>)}
    {dots.map((p, i) => <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={4.5} fill={p.open ? "white" : p.color ?? INK} stroke={p.color ?? INK} strokeWidth={2}/>)}
    {series.map((s, i) => <g key={s.name}><line x1={48} x2={80} y1={357 + 28 * i} y2={357 + 28 * i} stroke={s.color} strokeWidth={3} strokeDasharray={s.dash ? "6 4" : undefined}/><He x={266} y={363 + 28 * i} size={19} color={s.color}>{s.name}</He></g>)}
  </Panel>;
}
const s = (name: string, color: string, f: (x: number) => number, a: number, b: number, dash = false, events: number[] = []): Series => ({ name, color, points: [...sample(f, a, b), ...events.flatMap(t => [[t-1e-9,f(t-1e-9)],[t,f(t)]] as XY[])].sort((p,q)=>p[0]-q[0]), dash });
const pulse = (t: number, D: number, amp = 1, alpha = 1) => amp / alpha * (t <= D ? 1 - Math.exp(-alpha * t) : (1 - Math.exp(-alpha * D)) * Math.exp(-alpha * (t - D)));
const narStar = root(x => 20 / (1 + x ** 4) - x, 0, 20);
const nar = integrate((_, [x]) => [20 / (1 + x ** 4) - x], [0], 5);
const parStar = root(x => 1 + 9 * hill(x) - x, 1, 12);
const par = integrate((_, [x]) => [1 + 9 * hill(x) - x], [0], 6);
const narSlope = -80 * narStar ** 3 / (1 + narStar ** 4) ** 2 - 1;
const iffl = integrate((_, [Y, Z]) => [1 - Y, 1 / (1 + Y / .2) - Z], [0, 0], 11);
const ifflPeak = iffl.reduce((a, b) => b[2] > a[2] ? b : a);
const production = (x: number) => .1 + 2 * hill(x, 4);
const bistable = [[0, .5], [.5, 1.5], [1.5, 3]].map(([a, b]) => root(x => production(x) - x, a, b));
const slope = (x: number) => 8 * x ** 3 / (1 + x ** 4) ** 2 - 1;
const foldX = root(slope, .1, 1), foldS = foldX - production(foldX);
const toggleSym = root(x => 3 / (1 + x * x) - x, 0, 3);
const toggleLo = (3 - Math.sqrt(5)) / 2, toggleHi = (3 + Math.sqrt(5)) / 2;
const cross = sample(M => M, .3, .7, 100).map(([M]) => { const r = integrate((_, [U, W]) => [2 * M / (1 + W ** 3) - U, 2 * (1 - M) / (1 + U ** 3) - W], [0, 0], 70, .025).at(-1)!; return [M, r[1], r[2]]; });
const ratio = (w: number, K: number) => w * (K + 1 - w) / ((1 - w) * (K + w));
const modified = (r: number, K: number) => root(w => r * (1 - w) / (K + 1 - w) - w / (K + w), 0, 1);
const neff = (K: number) => Math.log(81) / Math.log(ratio(.9, K) / ratio(.1, K));
// Independent Dormand-Prince 5(4). This is not a claim to reproduce MATLAB's step controller.
function adaptive(f: (t: number, x: number) => number, end: number, rtol = 1e-3) {
  const A = [[], [1 / 5], [3 / 40, 9 / 40], [44 / 45, -56 / 15, 32 / 9], [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729], [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656], [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]];
  const C = [0, .2, .3, .8, 8 / 9, 1, 1], B4 = [5179 / 57600, 0, 7571 / 16695, 393 / 640, -92097 / 339200, 187 / 2100, 1 / 40];
  let t = 0, x = 0, h = .02; const rows: XY[] = [[t, x]];
  for (let iter = 0; t < end - 1e-12 && iter < 100000; iter++) {
    h = Math.min(h, end - t); const k: number[] = [];
    for (let j = 0; j < 7; j++) k.push(f(t + C[j] * h, x + h * A[j].reduce((sum, a, z) => sum + a * k[z], 0)));
    const x5 = x + h * A[6].reduce((sum, a, z) => sum + a * k[z], 0), x4 = x + h * B4.reduce((sum, a, z) => sum + a * k[z], 0);
    const err = Math.abs(x5 - x4) / (rtol * (1e-3 + Math.max(Math.abs(x), Math.abs(x5))));
    if (err <= 1) { t += h; x = x5; rows.push([t, x]); }
    h *= Math.max(.15, Math.min(4, .9 * (err || 1e-12) ** (-.2)));
  }
  return rows;
}
const adaptiveSteps = adaptive((_, x) => 10 - .5 * x, 10, 1e-5);
const naivePulse = adaptive((t, x) => (t < 5 ? 10 : 0) - .5 * x, 10);
export const SYSTEMS_CHECKS = {
  hill: [.25, .5, 1, 2, 4].map(u => [u, hill(u)]),
  nar: { star: narStar, half: crossing(nar, narStar / 2), slope: narSlope, tau: -1 / narSlope },
  positive: { star: parStar, half: crossing(par, parStar / 2) },
  iffl: { peak: ifflPeak[2], time: ifflPeak[0] + 1, steady: 1 / 6, ratio: ifflPeak[2] * 6, half: crossing(iffl, 1 / 12, 2) },
  bistable: bistable.map(x => ({ x, slope: slope(x) })),
  hysteresis: { foldX, foldS, atS02: [root(x => production(x) + .2 - x, 0, foldX), root(x => production(x) + .2 - x, foldX, 1.4), root(x => production(x) + .2 - x, 1.4, 3)], atS028: [root(x => production(x) + .28 - x, 0, foldX), root(x => production(x) + .28 - x, foldX, 1.4), root(x => production(x) + .28 - x, 1.4, 3)] },
  toggle: { symmetric: toggleSym, stable: [toggleLo, toggleHi] },
  crossRepression: [.45, .48, .5, .52, .55].map(M => { const r = integrate((_, [U, W]) => [2 * M / (1 + W ** 3) - U, 2 * (1 - M) / (1 + U ** 3) - W], [0, 0], 100, .01).at(-1)!; return [M, r[1], r[2]]; }),
  gradient: [.5, .2, .05].map(v => -20 * Math.log(v)), shift: 20 * Math.LN2,
  zeroOrder: [10, 1, .1, .01].map(K => ({ K, neff: neff(K), values: [.8, .9, 1, 1.1, 1.25].map(r => modified(r, K)) })),
  ode: { analytic4: 20 * (1 - Math.exp(-2)), dp54: [1e-3, 1e-6, 1e-9].map(rt => [rt, adaptive((_, x) => 10 - .5 * x, 4, rt).at(-1)![1]]), split5: pulse(5, 5, 10, .5), split10: pulse(10, 5, 10, .5), naive10: naivePulse.at(-1)![1] },
  membrane: [5, 10, 20, 50, 100].map(t => [t, 1 - Math.exp(-t / 20)]),
  frequency: [1, 5, 8, 20, 50, 100].map(f => [f, 1 / Math.sqrt(1 + (2 * Math.PI * f * .02) ** 2)]), cutoff: 1 / (2 * Math.PI * .02),
  integral: { exactPeaks: [3, 7], baseline: 1 },
};

function InputOutput() { return <div>
  <Fig h={455} label="אותו מעגל עם גבול סביב התהליך או סביב מקור האות והתהליך">
  <Panel y={8} h={384} title="אותו מעגל · שני גבולות אפשריים">
    {[0, 1].map(i => <g key={i} transform={`translate(0 ${i * 155})`}><rect x={i ? 34 : 184} y={62} width={i ? 342 : 192} height={94} rx={14} fill="#eff6ff" stroke={BLUE} strokeDasharray="6 5"/><Node x={90} y={109} name="u" color={TEAL}/><Node x={235} y={109} name="x"/><Node x={414} y={109} name="y" color={ORANGE}/><Arrow x1={125} y1={109} x2={197} y2={109}/><Arrow x1={273} y1={109} x2={376} y2={109}/><He x={240} y={188} size={19}>{i ? "מקור האות כלול: גם הוא משתנה מצב" : "האות חיצוני: רק התהליך הוא מצב"}</He></g>)}
  </Panel>
  <La x={240} y={432} size={22}>dx/dt = u − x; x(0) = 0</La>
  </Fig>
  <div className="systems-response-grid grid grid-cols-1 gap-3 md:grid-cols-2">
    <Fig h={470} label="תגובת מדרגה מחושבת למערכת בעלת זמן דעיכה אחד"><Plot y={8} title="מדרגה · הקלט נשאר" series={[s("קלט", MUTED, () => 1, 0, 4, true), s("תגובה", BLUE, t => 1 - Math.exp(-t), 0, 4)]} xr={[0, 4]} yr={[0, 1.15]} xt={[0, 1, 2, 3, 4]} yt={[0, .5, 1]} hlines={[.5]} vlines={[Math.LN2]}/><La x={240} y={448} size={23}>x(t)=1−exp(−t)</La></Fig>
    <Fig h={470} label="תגובת פולס בשלושה משכים ושיא תלוי משך"><Plot y={8} title="פולס · משך קובע את השיא" series={[.2, .5, .7].map((D, i) => s(`משך ${D}`, [TEAL, ORANGE, PURPLE][i], t => pulse(t, D), 0, 3, false, [D]))} xr={[0, 3]} yr={[0, .6]} xt={[0, 1, 2, 3]} yt={[0, .25, .5]} hlines={[.5]}/></Fig>
  </div>
  <Fig h={225} label="שיא הפולס אחד פחות אקספוננט שלילי של המשך וסף מחצית במשך לוגריתם שתיים">
    <La x={240} y={36} size={22}>x(D) = 1 − exp(−D)</La><La x={240} y={74} size={22}>D = 0.2 / 0.5 / 0.7 → 0.181 / 0.393 / 0.503</La><Note y={120} color={RED}>חציית סף של חצי דורשת משך מספיק</Note><La x={240} y={158} size={23}>D ≥ ln 2 = 0.6931</La><Note y={201}>הגבול המקווקו הוא בחירת המודל</Note>
  </Fig>
</div>; }

function Ode45() { return <Fig h={1640} label="צעדי אינטגרציה מסתגלים לעומת רשת פלט, סבילות וקלט לא רציף">
  <Plot y={8} title="צעדים פנימיים ≠ זמני דיווח" series={[s("פתרון · כחול: צעד, כתום: פלט", BLUE, t => 20 * (1 - Math.exp(-.5 * t)), 0, 10)]} xr={[0, 10]} yr={[0, 21]} xt={[0, 2, 5, 10]} yt={[0, 10, 20]} yLabel="x (nM)" xLabel="t (min)" dots={[...adaptiveSteps.map(([x,y])=>({x,y,color:BLUE})),...[0,2,5,10].map(x=>({x,y:20*(1-Math.exp(-.5*x)),color:ORANGE,open:true}))]}/>
  <Panel y={405} h={210} title="שתי קבוצות סימונים על אותו ציר">
    <path d="M65 86 H430 M65 146 H430" stroke={LINE} fill="none"/>
    {adaptiveSteps.map(([t], i) => <line key={i} x1={65 + t * 36.5} x2={65 + t * 36.5} y1={77} y2={95} stroke={BLUE} strokeWidth={2}/>)}
    {[0, 2, 5, 10].map(t => <line key={t} x1={65 + t * 36.5} x2={65 + t * 36.5} y1={137} y2={155} stroke={ORANGE} strokeWidth={3}/>)}
    <Note y={121} color={BLUE}>צעדי חישוב · ריצת DP5(4) עצמאית</Note><Note y={188} color={ORANGE}>פלט מבוקש · ערכים מדווחים באינטרפולציה</Note>
  </Panel>
  <Panel y={639} h={298} title="בדיקת סבילות · הנתונים מהיחידה">
    <La x={240} y={78} size={21}>RelTol                 x(4)</La>
    {["10⁻³          17.292559", "10⁻⁶          17.293293", "10⁻⁹          17.293294"].map((v, i) => <La key={v} x={240} y={120 + i * 37} size={23} color={[ORANGE, TEAL, BLUE][i]}>{v}</La>)}
    <La x={240} y={244} size={22}>analytic: 17.293294</La><Note y={280}>המספרים הנומריים תלויים במימוש הפותר</Note>
  </Panel>
  <Plot y={963} title="כיבוי קלט בזמן 5 · לפצל בנקודת הקפיצה" series={[{name:"ללא פיצול · DP5(4) עצמאי",color:ORANGE,points:naivePulse,dash:true},s("פיצול · פתרון אנליטי", BLUE, t => pulse(t, 5, 10, .5), 0, 10)]} xr={[0, 10]} yr={[0, 21]} xt={[0, 5, 10]} yt={[0, 10, 20]} vlines={[5]}/>
  <La x={240} y={1416} size={23}>x(5) = 18.3583; x(10) = 1.5069</La><Note y={1455}>באי־רציפות גם גרף חלק עלול להטעות</Note>
  <Note y={1501} color={RED}>רשת פלט צפופה אינה בדיקת דיוק</Note><Note y={1540}>לחשיפת צעדי MATLAB: יש להגדיר Refine=1</Note><Note y={1580}>צעדי ההדגמה אינם צעדי הרצה של MATLAB</Note><Note y={1620}>הפתרון הרציף אומת מול הנוסחה האנליטית</Note>
</Fig>; }

function InputFunction() { return <Fig h={770} label="פונקציות היל מחושבות עם סף חצי וקירוב לוגי">
  <Plot y={8} title="חדות שונה · אותו ריכוז חצי" series={[...[1, 2, 4].map((n, i) => s(`מקדם היל ${n}`, [TEAL, BLUE, PURPLE][i], u => hill(u, n), 0, 4)), {name:"קירוב שער לוגי",color:ORANGE,dash:true,points:[[0,0],[1,0],[1,1],[4,1]]}]} xr={[0, 4]} yr={[0, 1.08]} xt={[0, 1, 2, 3, 4]} yt={[0, .5, 1]} xLabel="u / K" yLabel="f(u)" vlines={[1]} dots={[{x:1,y:.5}]}/>
  <La x={240} y={505} size={23}>f(u) = uⁿ / (Kⁿ + uⁿ); K = 1</La><La x={240} y={551} size={21}>u: 0.25 / 0.5 / 1 / 2 / 4</La><La x={240} y={589} size={21}>n=2: 0.059 / 0.200 / 0.500 / 0.800 / 0.941</La><Note y={641}>הקו האנכי מסמן את ריכוז החצי</Note><Note y={683}>מקדם היל הוא מדד אפקטיבי לחדות</Note><Note y={726}>השער הלוגי הוא קירוב, לא עקומת קישור</Note>
</Fig>; }

function NarSimple() { return <Fig h={1580} label="משוב עצמי שלילי מאיץ, השוואה במצב יציב תואם, הרפיה מקומית ומשוב חיובי">
  <Plot y={8} title="משוב שלילי · אותה רמה סופית" series={[{name:"משוב שלילי עצמי",color:BLUE,points:points(nar)},s("מעגל פשוט תואם",ORANGE,t=>narStar*(1-Math.exp(-t)),0,5)]} xr={[0,5]} yr={[0,2]} xt={[0,1,2,3,4,5]} yt={[0,1,2]} hlines={[narStar/2]} vlines={[crossing(nar,narStar/2),Math.LN2]}/>
  <La x={240} y={449} size={21}>α=1; K=1; n=4; β=20; x*=1.7868</La><La x={240} y={490} size={22}>t½: 0.0519 vs 0.6931</La>
  <Plot y={525} title="סטייה קטנה · הרפיה ליד המצב היציב" series={[s("משוב: שיפוע −4.64",BLUE,t=>Math.exp(narSlope*t),0,3),s("פשוט: שיפוע −1",ORANGE,t=>Math.exp(-t),0,3)]} xr={[0,3]} yr={[0,1.1]} xt={[0,1,2,3]} yt={[0,.5,1]} yLabel="δ(t) / δ(0)"/>
  <La x={240} y={972} size={22}>τ = −1/f′(x*): 0.2154 vs 1.000</La><Note y={1010}>הרפיה מקומית אינה זמן מחצית ממדרגה מלאה</Note>
  <Plot y={1040} title="משוב חיובי · מתחיל לאט" series={[{name:"משוב חיובי",color:PURPLE,points:points(par)},s("מעגל פשוט תואם",ORANGE,t=>parStar*(1-Math.exp(-t)),0,6)]} xr={[0,6]} yr={[0,10.5]} xt={[0,2,4,6]} yt={[0,5,10]}/>
  <La x={240} y={1488} size={21}>dx/dt = 1 + 9x²/(1+x²) − x</La><La x={240} y={1530} size={22}>x*=9.9093; t½=1.2362 vs 0.6931</La><Note y={1568}>בדוגמה הזו יש מצב יציב יחיד</Note>
</Fig>; }

function FflStructure({ incoherent = false }: { incoherent?: boolean }) { return <Fig h={655} label={incoherent ? "הפעלה ישירה ודיכוי עקיף מושהה בלולאה אי קוהרנטית" : "לולאה קוהרנטית ושער לוגי כבחירה עצמאית"}>
  <Panel y={8} h={365} title={incoherent ? "אות אחד · מסלולים מנוגדים" : "אות אחד · שני מסלולים מפעילים"}>
    <Node x={95} y={110} name="X"/><Node x={372} y={110} name="Y" color={TEAL}/><Node x={240} y={278} name="Z" color={ORANGE}/>
    <Arrow x1={134} y1={110} x2={333} y2={110} color={TEAL}/><Arrow x1={111} y1={143} x2={208} y2={246} color={BLUE}/><Arrow x1={353} y1={145} x2={270} y2={244} color={incoherent?RED:TEAL} inhibit={incoherent}/>
    <La x={234} y={87} size={24} color={TEAL}>+</La><La x={131} y={211} size={24} color={BLUE}>+</La><La x={349} y={212} size={24} color={incoherent?RED:TEAL}>{incoherent?"−":"+"}</La><Note y={340}>חץ = הפעלה · קו חוסם = דיכוי</Note>
  </Panel>
  {incoherent ? <><Panel y={398} h={177} title="ההבדל הוא בתזמון"><He x={240} y={85} size={22} color={BLUE}>המסלול הישיר פועל מיד</He><He x={240} y={132} size={22} color={RED}>הדיכוי מחכה להצטברות המתווך</He></Panel><Note y={622}>פער הזמנים מאפשר ספייק גם בקלט קבוע</Note></> : <><Panel y={398} h={177} title="השער הוא בחירה נוספת של המודל"><La x={132} y={91} size={26} color={PURPLE}>AND</La><La x={348} y={91} size={26} color={ORANGE}>OR</La><He x={132} y={140} size={20}>צריך את שניהם</He><He x={348} y={140} size={20}>מספיק אחד</He></Panel><Note y={622}>הטופולוגיה אינה קובעת איך משלבים קלטים</Note></>}
</Fig>; }
const onsetAND = 1 + Math.LN2, offOR = 6 + Math.log(2 * (1 - Math.exp(-5)));
const gateZ = (t: number, and: boolean, short = false) => { const on = and ? onsetAND : 1, off = short ? 1.4 : and ? 6 : offOR; if (and && short) return 0; return t < on ? 0 : pulse(t - on, off - on); };
function FflAndOr() { return <Fig h={1130} label="תגובות AND ו OR מחושבות, עיכוב בכניסה מול ביציאה וסינון פולס קצר">
  <Plot y={8} title="אותה רשת · ההשהיה מחליפה צד" series={[s("שער AND",BLUE,t=>gateZ(t,true),0,10,false,[onsetAND,6]),s("שער OR",ORANGE,t=>gateZ(t,false),0,10,false,[1,offOR]),{name:"קלט X",color:MUTED,dash:true,points:[[0,0],[1,0],[1,1],[6,1],[6,0],[10,0]]}]} xr={[0,10]} yr={[0,1.1]} xt={[0,1,3,6,8,10]} yt={[0,.5,1]} yLabel="Z" vlines={[onsetAND,6.5]} dots={[{x:6.5,y:gateZ(6.5,true),color:BLUE},{x:6.5,y:gateZ(6.5,false),color:ORANGE}]}/>
  <La x={240} y={479} size={22}>AND: t_on = 1 + ln 2 = 1.693</La><La x={240} y={517} size={22}>OR: t_on = 1 (no delay)</La><La x={240} y={555} size={22}>t=6.5: AND=0.5984; OR=0.9959</La>
  <Plot y={594} title="פולס באורך 0.4 · רק OR מגיב" series={[s("שער AND",BLUE,t=>gateZ(t,true,true),0,4),s("שער OR",ORANGE,t=>gateZ(t,false,true),0,4,false,[1,1.4])]} xr={[0,4]} yr={[0,.5]} xt={[0,1,2,3,4]} yt={[0,.25,.5]} vlines={[1,1.4]} yLabel="Z"/>
  <La x={240} y={1045} size={22}>Zmax: AND=0; OR=1−exp(−0.4)=0.3297</La><Note y={1091}>הפולס קצר מכדי להעלות את Y מעל הסף</Note>
</Fig>; }
function IfflPulse() { return <Fig h={735} label="לולאה אי קוהרנטית מול מעגל פשוט מותאם, ספייק והאצה מחושבים">
  <Plot y={8} title="הקלט נשאר · הפלט עולה ואז יורד" series={[{name:"לולאה אי־קוהרנטית",color:BLUE,points:[[0,0],[1,0],...points(iffl,2,1)]},s("מעגל פשוט תואם",ORANGE,t=>t<1?0:(1-Math.exp(-(t-1)))/6,0,12)]} xr={[0,12]} yr={[0,.26]} xt={[0,1,4,8,12]} yt={[0,.1,.2]} hlines={[1/6,1/12]} vlines={[ifflPeak[0]+1]} yLabel="Z" dots={[{x:ifflPeak[0]+1,y:ifflPeak[2],color:BLUE}]}/>
  <La x={240} y={453} size={22}>Kz=0.2; βy=αy=βz=αz=1</La><La x={240} y={495} size={23}>{`peak=${ifflPeak[2].toFixed(4)}; t=${(ifflPeak[0]+1).toFixed(3)}; Z*=0.1667`}</La><La x={240} y={537} size={23}>peak / Z* = 1.379</La><La x={240} y={579} size={22}>{`t½: ${crossing(iffl,1/12,2).toFixed(4)} vs ln 2 = 0.6931`}</La><Note y={625}>זמני המחצית נספרים מרגע הדלקת הקלט</Note><Note y={668}>הקו התחתון מסמן חצי מן הרמה הסופית</Note><Note y={712}>התגובה אינה חוזרת לאפס: הסתגלות חלקית</Note>
</Fig>; }

function Bistable1D() { return <Fig h={920} label="שלוש נקודות שיווי משקל של ייצור ופירוק עם יציבות ואגני משיכה">
  <Plot y={8} title="ייצור = פירוק · שלושה חיתוכים" series={[s("ייצור",BLUE,production,0,2.5),s("פירוק",ORANGE,x=>x,0,2.5)]} xr={[0,2.5]} yr={[0,2.6]} xt={[0,.5,1,1.5,2,2.5]} yt={[0,1,2]} xLabel="x" yLabel="rate" dots={bistable.map((x,i)=>({x,y:x,color:i===1?RED:TEAL,open:i===1}))} bands={[{a:0,b:bistable[1],color:BLUE},{a:bistable[1],b:2.5,color:ORANGE}]}/>
  <La x={240} y={452} size={21}>production = 0.1 + 2x⁴/(1+x⁴)</La><La x={240} y={492} size={21}>degradation = x</La>
  <Panel y={528} h={232} title="השיפוע קובע יציבות">
    {bistable.map((x,i)=><g key={i}><La x={125} y={85+i*52} size={22}>{x.toFixed(4)}</La><La x={267} y={85+i*52} size={21}>{slope(x).toFixed(2)}</La><He x={398} y={85+i*52} size={20} color={i===1?RED:TEAL}>{i===1?"לא יציב":"יציב"}</He></g>)}
  </Panel>
  <Panel y={785} h={115} title="שני אגני משיכה"><Arrow x1={193} y1={77} x2={75} y2={77} color={BLUE}/><Arrow x1={285} y1={77} x2={406} y2={77} color={ORANGE}/><La x={240} y={85} size={21} color={RED}>0.907</La></Panel>
</Fig>; }
function Hysteresis() {
  // Parametrization S(x)=x-production(x) resolves the fold without interpolation across it.
  const branch = (a:number,b:number):XY[]=>sample(x=>x,a,b,240).map(([x])=>[x-production(x),x]);
  const upperAtFold = root(x=>production(x)+foldS-x,1.5,3);
  return <Fig h={895} label="סריקת קלט מחושבת עם קפיצה בענף הנמוך וחזרה לאפס על הענף הגבוה">
    <Plot y={8} title="העלאה והורדה · המצב זוכר את הדרך" series={[{name:"העלאה · ענף נמוך",color:BLUE,points:branch(bistable[0],foldX)}, {name:"ענף לא יציב",color:RED,dash:true,points:branch(foldX,bistable[1])}, {name:"ענף גבוה · נשאר בחזרה",color:ORANGE,points:branch(bistable[2],root(x=>production(x)+.4-x,1.5,3))}]} xr={[0,.4]} yr={[0,2.6]} xt={[0,.1,.2,.3,.4]} yt={[0,1,2]} xLabel="S" yLabel="x*" vlines={[foldS]} dots={[{x:0,y:bistable[0],color:BLUE},{x:0,y:bistable[2],color:ORANGE}]}/>
    <Arrow x1={78+350*foldS/.4} y1={8+276-196*foldX/2.6} x2={78+350*foldS/.4} y2={8+276-196*upperAtFold/2.6} color={PURPLE}/>
    <Arrow x1={78+350*.06/.4} y1={8+276-196*root(x=>production(x)+.06-x,0,foldX)/2.6} x2={78+350*.16/.4} y2={8+276-196*root(x=>production(x)+.16-x,0,foldX)/2.6} color={BLUE}/>
    <Arrow x1={78+350*.34/.4} y1={8+276-196*root(x=>production(x)+.34-x,1.5,3)/2.6} x2={78+350*.16/.4} y2={8+276-196*root(x=>production(x)+.16-x,1.5,3)/2.6} color={ORANGE}/>
    <La x={240} y={485} size={23}>S_fold=0.28379; x_fold=0.52502</La>
    <Panel y={525} h={235} title="לא חוזר לנקודת ההתחלה" color={ORANGE}><La x={240} y={85} size={23}>S: 0 → 0.4 → 0</La><La x={240} y={130} size={23}>{`x: 0.1002 → ${root(x=>production(x)+.4-x,2,3).toFixed(3)} → 1.9772`}</La><Note y={178}>חזרה בקלט לאפס משאירה את המערכת גבוהה</Note><Note y={216}>בטווח קלט לא־שלילי אין קפיצה חזרה למטה</Note></Panel>
    <La x={240} y={808} size={21}>dx/dt = 0.1 + S + 2x⁴/(1+x⁴) − x</La><Note y={853}>החץ האנכי מסמן קפיצה אחרי אובדן היציבות</Note>
  </Fig>;
}
function Nullclines() { const U=sample(v=>v,0,3,200).map(([v])=>[3/(1+v*v),v] as XY); return <Fig h={760} label="שתי נאלקלינות מחושבות במתג דיכוי הדדי, שדה כיוונים ושלושה חיתוכים">
  <Plot y={8} title="הנאלקלינות מחלקות את המישור" series={[{name:"נגזרת u מתאפסת",color:BLUE,points:U},s("נגזרת v מתאפסת",ORANGE,u=>3/(1+u*u),0,3)]} xr={[0,3.1]} yr={[0,3.1]} xt={[0,1,2,3]} yt={[0,1,2,3]} xLabel="u" yLabel="v" dots={[{x:toggleLo,y:toggleHi,color:TEAL},{x:toggleHi,y:toggleLo,color:TEAL},{x:toggleSym,y:toggleSym,color:RED,open:true}]}/>
  {seq(7).flatMap(i=>seq(7).map(j=>{const u=.2+i*.44,v=.2+j*.44,du=3/(1+v*v)-u,dv=3/(1+u*u)-v,n=Math.hypot(du,dv);const x=78+350*u/3.1,y=8+276-196*v/3.1;return <Arrow key={`${i}-${j}`} x1={x-5*du/n} y1={y+3*dv/n} x2={x+5*du/n} y2={y-3*dv/n} color="#94a3b8"/>;}))}
  <La x={240} y={454} size={22}>β=3; n=2</La><La x={240} y={496} size={22} color={TEAL}>(u,v) = (0.382,2.618), (2.618,0.382)</La><La x={240} y={538} size={22} color={RED}>u=v=1.2134: unstable</La><Note y={583}>נקודות מלאות: יציבות · חלולה: אוכף</Note><Note y={627}>החצים האפורים מחושבים משתי הנגזרות</Note><Note y={672}>שתי העקומות יורדות; הן אינן עקומות S</Note><Note y={716}>האיור מציג ריכוזים, לא מסלולי זמן</Note>
</Fig>; }

function Gradient() { return <Fig h={1070} label="מפל מעריכי, שלושה ספים והזזת גבול בעקבות הכפלת המקור">
  <Plot y={8} title="מפל רציף · שלוש קריאות סף" series={[s("המפל המנורמל",BLUE,x=>Math.exp(-x/20),0,80)]} xr={[0,80]} yr={[0,1.05]} xt={[0,20,40,60,80]} yt={[0,.5,1]} xLabel="x (µm)" yLabel="M / M₀" hlines={[.5,.2,.05]} vlines={SYSTEMS_CHECKS.gradient}/>
  <La x={240} y={422} size={22}>M(x)=M₀ exp(−x/20); λ=20 µm</La><La x={240} y={463} size={21}>threshold: 0.5 / 0.2 / 0.05</La><La x={240} y={503} size={21}>boundary: 13.86 / 32.19 / 59.91 µm</La>
  <Plot y={541} title="הכפלת המקור · הגבול אינו קבוע" series={[s("מקור בעוצמה 1",BLUE,x=>Math.exp(-x/20),0,80),s("מקור בעוצמה 2",ORANGE,x=>2*Math.exp(-x/20),0,80)]} xr={[0,80]} yr={[0,2.1]} xt={[0,20,40,60,80]} yt={[0,1,2]} xLabel="x (µm)" yLabel="M" hlines={[.2]} vlines={[20*Math.log(5),20*Math.log(10)]}/>
  <La x={240} y={989} size={22}>32.19 → 46.05 µm; Δx=λ ln 2=13.86 µm</La><Note y={1033}>סף קבוע בריכוז מוחלט, לא אחוז מהמקור החדש</Note>
</Fig>; }
function CrossRepression() { return <Fig h={1110} label="חידוד מחושב בדיכוי הדדי ושתי הסטות גבול זהות לאחר הכפלת המקור">
  <Plot y={8} title="הבדל קטן בקלט · הבדל גדול בפלט" series={[{name:"הגן U",color:BLUE,points:cross.map(r=>[r[0],r[1]])},{name:"הגן W",color:ORANGE,points:cross.map(r=>[r[0],r[2]])}]} xr={[.3,.7]} yr={[0,1.5]} xt={[.3,.4,.5,.6,.7]} yt={[0,.5,1,1.5]} xLabel="M" yLabel="U, W" vlines={[.5]}/>
  <La x={240} y={449} size={21}>β=2; α=1; n=3; U(0)=W(0)=0</La><La x={240} y={490} size={21}>M=0.45: U=0.441; W=1.013</La><La x={240} y={531} size={21}>M=0.55: U=1.013; W=0.441</La>
  <Panel y={569} h={396} title="חדות אינה עמידות לשינוי המקור" color={RED}>
    {[{t:"מודל סף",a:32.19,b:46.05,c:BLUE},{t:"דיכוי הדדי",a:13.86,b:27.73,c:ORANGE}].map((v,i)=><g key={v.t}><He x={240} y={88+i*139} size={22} color={v.c}>{v.t}</He><Arrow x1={70+v.a*6} y1={123+i*139} x2={70+v.b*6} y2={123+i*139} color={v.c}/><La x={240} y={166+i*139} size={22} color={v.c}>{`${v.a.toFixed(2)} → ${v.b.toFixed(2)} µm`}</La></g>)}
    <La x={240} y={362} size={24} color={RED}>Δx = 20 ln 2 = 13.86 µm</La>
  </Panel><Note y={1009}>שני המודלים קוראים אותו מפל מעריכי</Note><Note y={1051}>הדיכוי מחדד את ההחלטה, לא מייצב את מיקומה</Note><Note y={1093}>ערכי הפרמטרים שוחזרו מן הטבלה והתרגיל</Note>
</Fig>; }

function CovalentCycle() { return <Fig h={660} label="מחזור קינאז פוספטאז עם שימור מפורש של כלל המצע">
  <Panel y={8} h={398} title="המרה לשני כיוונים · מאגר נשמר">
    <Node x={105} y={195} name="W"/><Node x={375} y={195} name="W*" color={ORANGE}/>
    <path d="M105 161 Q240 45 375 161 M375 232 Q240 348 105 232" fill="none" stroke={LINE} strokeWidth={2}/><Arrow x1={350} y1={142} x2={375} y2={161} color={BLUE}/><Arrow x1={130} y1={251} x2={105} y2={232} color={TEAL}/>
    <He x={240} y={85} size={22} color={BLUE}>קינאז · הוספת פוספט</He><He x={240} y={329} size={22} color={TEAL}>פוספטאז · הסרת פוספט</He><La x={240} y={180} size={20}>ATP → ADP</La><La x={240} y={225} size={20}>H₂O → Pi</La><Note y={374}>הסכמה אינה מציגה קומפלקסי ביניים</Note>
  </Panel><La x={240} y={457} size={25}>W + W* = W_total = constant</La><La x={240} y={506} size={23}>w* = W* / W_total</La><Note y={557}>מצב יציב: קצב ההמרה שווה לקצב ההחזרה</Note><Note y={600}>במודל אין ייצור או פירוק של המאגר</Note><Note y={641}>לא בקנה מידה; הכוכבית מסמנת שינוי קוולנטי</Note>
</Fig>; }
function ZeroOrder() { return <Fig h={895} label="עקומות מחושבות של מחזור קוולנטי בארבע רמות רוויה ומקדמי היל אפקטיביים">
  <Plot y={8} title="רוויה מחדדת · בלי שיתופיות" series={[10,1,.1,.01].map((K,i)=>s(`K=${K} · היל אפקטיבי ${neff(K).toFixed(2)}`,[TEAL,BLUE,PURPLE,ORANGE][i],r=>modified(r,K),.5,1.5))} xr={[.5,1.5]} yr={[0,1.05]} xt={[.5,.75,1,1.25,1.5]} yt={[0,.5,1]} xLabel="Vk / Vp" yLabel="w*" vlines={[1]}/>
  <La x={240} y={508} size={21}>K₁=K₂=K; Vp=1</La><La x={240} y={549} size={20}>Vk(1−w*)/(K+1−w*) = w*/(K+w*)</La><La x={240} y={593} size={21}>n_eff = ln(81) / ln(r₉₀/r₁₀)</La>
  <Panel y={633} h={207} title="חד־ערכית · ללא היסטרזיס" color={RED}><Note y={87}>לכל יחס קצבים יש מצב יציב יחיד</Note><Note y={132}>העלאה והורדה עוברות באותה עקומה</Note><Note y={177}>תגובה חדה אינה הוכחה לדו־יציבות</Note></Panel><Note y={878}>הקבועים מנורמלים לכמות המצע הכוללת</Note>
</Fig>; }

// Constructive counterexample: two explicitly defined dynamics agree at t=1.
const rising = (t:number)=>(1-Math.exp(-t))/(1-Math.exp(-1));
const transient = (t:number)=>t*Math.exp(1-t);
function DoseTime() {return <Fig h={1010} label="דוגמה מתמטית לשתי דינמיקות שונות עם אותה מנה תגובה בזמן מדידה קבוע">
  <Plot y={8} title="בזמן המדידה · אותה מנה–תגובה" series={[s("מערכת עולה",BLUE,u=>hill(u),0,5),s("מערכת חולפת",ORANGE,u=>hill(u),0,5,true)]} xr={[0,5]} yr={[0,1.1]} xt={[0,1,2,3,4,5]} yt={[0,.5,1]} xLabel="u" yLabel="y(t=1)"/>
  <Plot y={434} title="באותו קלט · מהלכי זמן שונים" series={[s("מערכת עולה",BLUE,t=>.5*rising(t),0,6),s("מערכת חולפת",ORANGE,t=>.5*transient(t),0,6)]} xr={[0,6]} yr={[0,.9]} xt={[0,1,2,4,6]} yt={[0,.5]} yLabel="y(u=1)" vlines={[1]}/>
  <La x={240} y={884} size={20}>y₁=f(u)(1−e⁻ᵗ)/(1−e⁻¹)</La><La x={240} y={924} size={20}>y₂=f(u)·t·e¹⁻ᵗ; f(u)=u²/(1+u²)</La><Note y={969}>דוגמת נגד מחושבת; אינה התאמה לניסוי</Note>
</Fig>; }

const NFKB:[number,number][]=[[0.00,0.0500],[0.14,0.0548],[0.29,0.0589],[0.43,0.0625],[0.57,0.0656],[0.71,0.0683],[0.86,0.0707],[1.00,0.0728],[1.02,0.0730],[1.21,0.0772],[1.41,0.0838],[1.60,0.0927],[1.80,0.1037],[1.99,0.1164],[2.19,0.1305],[2.38,0.1455],[2.58,0.1606],[2.77,0.1752],[2.96,0.1885],[3.16,0.1998],[3.35,0.2088],[3.55,0.2153],[3.74,0.2192],[3.94,0.2208],[4.13,0.2205],[4.33,0.2187],[4.52,0.2157],[4.72,0.2119],[4.91,0.2077],[5.10,0.2032],[5.30,0.1988],[5.49,0.1945],[5.69,0.1904],[5.88,0.1867],[6.08,0.1833],[6.27,0.1804],[6.47,0.1778],[6.66,0.1757],[6.85,0.1739],[7.05,0.1725],[7.24,0.1714],[7.44,0.1706],[7.63,0.1701],[7.83,0.1699],[8.02,0.1698],[8.22,0.1699],[8.41,0.1702],[8.61,0.1706],[8.80,0.1710],[8.99,0.1716],[9.19,0.1721],[9.38,0.1727],[9.58,0.1733],[9.77,0.1738],[9.97,0.1743],[10.16,0.1748],[10.36,0.1752],[10.55,0.1756],[10.74,0.1760],[10.94,0.1763],[11.13,0.1765],[11.33,0.1767],[11.52,0.1768],[11.72,0.1769],[11.91,0.1769],[12.11,0.1770],[12.30,0.1770],[12.50,0.1769],[12.69,0.1769],[12.88,0.1768],[13.08,0.1768],[13.27,0.1767],[13.47,0.1766],[13.66,0.1765],[13.86,0.1764],[14.05,0.1764],[14.25,0.1763],[14.44,0.1762],[14.63,0.1762],[14.83,0.1761],[15.02,0.1761],[15.22,0.1761],[15.41,0.1760],[15.61,0.1760],[15.80,0.1760],[16.00,0.1760],[16.19,0.1760],[16.39,0.1760],[16.58,0.1760],[16.77,0.1760],[16.97,0.1760],[17.16,0.1760],[17.36,0.1760],[17.55,0.1760],[17.75,0.1760],[17.94,0.1760],[18.14,0.1761],[18.33,0.1761],[18.52,0.1761],[18.72,0.1761],[18.91,0.1761],[19.11,0.1761],[19.30,0.1761],[19.50,0.1761],[19.69,0.1761],[19.89,0.1761],[20.08,0.1761],[20.28,0.1761],[20.47,0.1761],[20.66,0.1761],[20.86,0.1761],[21.05,0.1761],[21.25,0.1761],[21.44,0.1761],[21.64,0.1761],[21.83,0.1761],[22.03,0.1761],[22.22,0.1761],[22.41,0.1761],[22.61,0.1761],[22.80,0.1761],[23.00,0.1761],[23.19,0.1761],[23.39,0.1761],[23.58,0.1761],[23.78,0.1761],[23.97,0.1761],[24.17,0.1761],[24.36,0.1761],[24.55,0.1761],[24.75,0.1761],[24.94,0.1761],[25.14,0.1761],[25.33,0.1761],[25.53,0.1761],[25.72,0.1761],[25.92,0.1761],[26.11,0.1761],[26.30,0.1761],[26.50,0.1761],[26.69,0.1761],[26.89,0.1761],[27.08,0.1761],[27.28,0.1761],[27.47,0.1761],[27.67,0.1761],[27.86,0.1761],[28.06,0.1761],[28.25,0.1761],[28.44,0.1761],[28.64,0.1761],[28.83,0.1761],[29.03,0.1761],[29.22,0.1761],[29.42,0.1761],[29.61,0.1761],[29.81,0.1761],[30.00,0.1761]];
function Nfkb() { return <Fig h={1402} label="משוב NF kappa B דרך יצירת המעכב, מהלך השיא הדועך והשוואת קידוד עוצמה ומשך">
  <Panel y={8} h={378} title="הפלט מפעיל את יצירת המעכב">
    <rect x={25} y={65} width={270} height={250} rx={32} fill="#eff6ff" stroke={BLUE}/><He x={160} y={100} size={20}>גרעין</He><Node x={160} y={159} name="NF-κB"/><Node x={160} y={265} name="mRNA" color={TEAL}/><Node x={384} y={265} name="IκB" color={RED}/><Arrow x1={160} y1={191} x2={160} y2={233} color={TEAL}/><Arrow x1={200} y1={265} x2={345} y2={265} color={TEAL}/><path d="M384 232 V159 H214" stroke={RED} fill="none" strokeWidth={2}/><path d="M214 149 V169" stroke={RED} strokeWidth={3}/><He x={384} y={107} size={19} color={RED}>עיכוב מושהה</He><Note y={350}>אות חיצוני מגביר פירוק של המעכב</Note>
  </Panel>
  <Plot y={411} title="שיא בולט ותנודות דועכות" series={[{name:"NF-κB גרעיני",color:BLUE,points:NFKB}]} xr={[0,30]} yr={[0,0.24]} xt={[0,5,10,15,20,25,30]} yt={[0,0.05,0.1,0.15,0.2]} hlines={[0.1761]} yLabel="NF-κB"/>
  <La x={240} y={831} size={21}>שיאים: 0.2209 · 0.1770 · 0.1761</La><La x={240} y={866} size={21}>בזמנים: 4.00 · 12.16 · 20.46</La>
  <Plot y={903} title="אותו אינטגרל · רק שיא אחד חוצה סף" series={[s("קצר וחזק · 4 למשך 1",BLUE,t=>pulse(t,1,4,.5),0,20,false,[1]),s("ארוך וחלש · 1 למשך 4",ORANGE,t=>pulse(t,4,1,.5),0,20,false,[4])]} xr={[0,20]} yr={[0,3.6]} xt={[0,4,8,12,16,20]} yt={[0,1,2,3]} hlines={[2]} yLabel="y"/>
  <La x={240} y={1346} size={21}>dy/dt=u−0.5y; peaks: 3.148 / 1.729</La><La x={240} y={1382} size={21}>∫₀²⁰ y dt = 7.9995 / 7.9988; threshold=2</La>
</Fig>; }

function AdaptationDefinition() {return <Fig h={1020} label="קלט נשאר גבוה, הסתגלות מדויקת וחלקית, ומשתנה פנימי שנשאר ברמה חדשה">
  <Plot y={8} title="הקלט נשאר · הפלט חוזר" series={[{name:"קלט",color:MUTED,dash:true,points:[[0,1],[1,1],[1,3],[10,3]]},s("הסתגלות מדויקת",BLUE,t=>t<1?1:1+2*Math.exp(-(t-1)),0,10,false,[1]),s("הסתגלות חלקית",ORANGE,t=>t<1?1:1.5+1.5*Math.exp(-4*(t-1)/3),0,10,false,[1])]} xr={[0,10]} yr={[0,3.3]} xt={[0,1,5,10]} yt={[0,1,2,3]} hlines={[1]} yLabel="input, output"/>
  <Plot y={463} title="המשתנה הפנימי אינו חוזר" series={[s("משתנה אינטגרלי A",TEAL,t=>t<1?0:2*(1-Math.exp(-(t-1))),0,10)]} xr={[0,10]} yr={[0,2.2]} xt={[0,1,5,10]} yt={[0,1,2]} yLabel="A"/>
  <La x={240} y={879} size={20}>S: 1→3; y=S−A; A′=y−1</La><La x={240} y={919} size={20}>partial: A′=y−1−A/3</La><Note y={963}>דוגמה מחושבת; הקלט אינו פולס</Note>
</Fig>; }
const integralY=(t:number)=>1+(t>=10?2*Math.exp(-(t-10)):0)+(t>=30?6*Math.exp(-(t-30)):0);
const inputS=(t:number)=>t<10?1:t<30?3:9;
function IntegralFeedback() {return <Fig h={1420} label="משוב אינטגרלי מחושב למדרגות אחת שלוש תשע והשוואה למשוב פרופורציונלי">
  <Panel y={8} h={247} title="הדיוק נובע מצורת המשוואה"><La x={240} y={86} size={25}>dA/dt = k(y−y₀); y=S−A</La><La x={240} y={134} size={25}>dA/dt=0 ⇒ y=y₀</La><Note y={181}>בכל מצב יציב מתכנס, עם משתנה שאינו רווי</Note><Note y={221}>הדיוק אינו תלוי בקלט; הבסיס נקבע בפרמטרים</Note></Panel>
  <Plot y={281} title="שתי מדרגות · אותה חזרה לבסיס" series={[s("פלט עם אינטגרל",BLUE,integralY,0,60,false,[10,30]),s("פלט פרופורציונלי",ORANGE,t=>inputS(t)/3,0,60,false,[10,30])]} xr={[0,60]} yr={[0,7.5]} xt={[0,10,30,60]} yt={[0,1,3,5,7]} yLabel="y" hlines={[1]} vlines={[10,30]}/>
  <La x={240} y={732} size={22}>k=1; y₀=1; S: 1→3→9</La><La x={240} y={775} size={22}>exact peaks: 3, 7; steady: 1, 1, 1</La><La x={240} y={818} size={22}>proportional (g=2): 0.333, 1, 3</La>
  <Plot y={854} title="האינטגרל שומר את התיקון" series={[s("המשתנה A",TEAL,t=>inputS(t)-integralY(t),0,60,false,[10,30])]} xr={[0,60]} yr={[0,8.5]} xt={[0,10,30,60]} yt={[0,2,4,6,8]} yLabel="A"/>
  <Note y={1269}>זמני המדרגות וקצב 1 הם בחירת המחשה מפורשת</Note><Note y={1310}>במדרגה הראשונה A עדיין 0, ולכן השיא הוא 3</Note><Note y={1351}>במדרגה השנייה A כבר 2, ולכן השיא הוא 7</Note><Note y={1392}>פותר שלא מפצל בנקודות הקפיצה יפספס את השיאים</Note>
</Fig>; }
function Chemotaxis() {return <Fig h={1120} label="מתילציה כמשתנה אינטגרלי, הוספה קבועה והסרה תלוית פעילות">
  <Panel y={8} h={329} title="המתילציה צוברת את שגיאת הפעילות">
    <path d="M35 143 H204 M276 143 H445 M35 158 H204 M276 158 H445" stroke={TEAL} strokeWidth={3}/><path d="M204 119 Q240 97 276 119 L266 182 Q240 199 214 182Z" fill="#dbeafe" stroke={BLUE} strokeWidth={2}/><La x={240} y={152} size={23}>R</La><He x={105} y={91} size={20} color={BLUE}>הוספה קבועה</He><He x={370} y={91} size={20} color={RED}>הסרה לפי פעילות</He><Arrow x1={105} y1={108} x2={200} y2={121} color={BLUE}/><Arrow x1={282} y1={177} x2={373} y2={111} color={RED}/><La x={240} y={243} size={24}>dm/dt = a − c·activity</La><La x={240} y={289} size={22}>steady activity = a/c</La>
  </Panel>
  <Plot y={363} title="הפעילות חוזרת · המתילציה זזה" series={[s("פעילות",BLUE,t=>t<1?1:1-.5*Math.exp(-(t-1)),0,10),s("שינוי במתילציה",TEAL,t=>t<1?0:.5*(1-Math.exp(-(t-1))),0,10)]} xr={[0,10]} yr={[0,1.15]} xt={[0,1,5,10]} yt={[0,.5,1]} yLabel="normalized" vlines={[1]} hlines={[1]}/>
  <La x={240} y={810} size={21}>a=c=1; activity = 1+m−L</La><La x={240} y={853} size={21}>L: 0→0.5 at t=1; m(0)=0</La><Note y={901}>מודל מקומי לינארי להמחשה, לא התאמה ניסויית</Note><Note y={947}>תוספת מושך מפחיתה פעילות זמנית</Note><Note y={993}>מתילציה עולה עד שהפעילות שבה לבסיס</Note><Note y={1040}>הסכמה משמיטה את חלבוני התיווך</Note><Note y={1085}>הסתגלות מדויקת נשברת ברוויית המתילציה</Note>
</Fig>; }

// A finite balanced synthetic reporter population realizes the stated second moments exactly.
const reporters: XY[]=seq(64).map(i=>{const shared=Math.sqrt(.128)*Math.cos(2*Math.PI*i/64)*Math.SQRT2,a=Math.sqrt(.073)*Math.cos(6*Math.PI*i/64)*Math.SQRT2,b=Math.sqrt(.073)*Math.sin(10*Math.PI*i/64)*Math.SQRT2;return [1+shared+a,1+shared+b];});
const avg=(v:number[])=>v.reduce((a,b)=>a+b,0)/v.length;
const m1=avg(reporters.map(p=>p[0])),m2=avg(reporters.map(p=>p[1]));
export const REPORTER_CHECKS={mean:[m1,m2],intrinsic:avg(reporters.map(([a,b])=>(a-b)**2))/(2*m1*m2),extrinsic:(avg(reporters.map(([a,b])=>a*b))-m1*m2)/(m1*m2),total:avg(reporters.map(([a,b])=>((a-m1)**2+(b-m2)**2)/2))/(m1*m2)};

function NoiseSources() {return <Fig h={1015} label="שני מדווחים באותו תא ופירוק שונות משותפת לעומת שונות ייחודית">
  <Panel y={8} h={212} title="אותה סביבה תאית · אירועים נפרדים"><rect x={33} y={65} width={414} height={108} rx={43} fill="#f0fdf4" stroke={TEAL}/><Node x={130} y={117} name="c₁" color={BLUE}/><Node x={350} y={117} name="c₂" color={ORANGE}/><Arrow x1={240} y1={78} x2={173} y2={104} color={PURPLE}/><Arrow x1={240} y1={78} x2={307} y2={104} color={PURPLE}/><Note y={199}>שני צבעים באותו תא, באותם תנאים</Note></Panel>
  <Plot y={247} title="משותף לאורך האלכסון · ייחודי לרוחב" series={[{name:"קו שוויון בין המדווחים",color:MUTED,dash:true,points:[[0,0],[2,2]]}]} xr={[0,2]} yr={[0,2]} xt={[0,.5,1,1.5,2]} yt={[0,.5,1,1.5,2]} xLabel="c₁ / mean" yLabel="c₂ / mean" dots={reporters.map(([x,y])=>({x,y,color:TEAL}))}/>
  <La x={240} y={659} size={23}>η²int=0.073; η²ext=0.128</La><La x={240} y={701} size={23}>η²total=0.073+0.128=0.201</La>
  <Panel y={738} h={216} title="מה הפירוק מזהה בפועל" color={RED}><Note y={84}>שונות ייחודית למדווח מול שונות משותפת</Note><Note y={128}>זה אינו פירוק של קלט מול פנים התא</Note><Note y={172}>אי־התאמה ורעש מדידה משפיעים על הפירוק</Note></Panel><Note y={993}>אוכלוסייה סינתטית מחושבת, לא נתוני הניסוי</Note>
</Fig>; }
function Lowpass() {return <Fig h={1010} label="סטיית התקן של הפלט כפונקציה של זמן התגובה והפשרה בין סינון למהירות">
  <Plot y={8} title="סטיית התקן המדויקת מול τ" series={[]} xr={[.01,10]} yr={[.005,.3]} xt={[.01,.1,1,10]} yt={[.01,.03,.1,.3]} logX logY xLabel="τ" yLabel="SD(output)" dots={[[.01,.2294],[.1,.07089],[1,.02237],[10,.007072]].map(([x,y])=>({x,y,color:BLUE}))}/>
  <La x={240} y={394} size={22}>τ: 0.01 / 0.1 / 1 / 10</La><La x={240} y={435} size={22}>SD: 0.229 / 0.0709 / 0.0224 / 0.00707</La>
  <Panel y={470} h={239} title="אותו קבוע זמן · פשרה בין שני מדדים"><La x={91} y={79} size={20} color={TEAL}>SD</La><La x={292} y={79} size={20} color={BLUE}>t½</La><path d="M80 92 V181 H207 M281 92 V181 H408" stroke={LINE} fill="none" strokeWidth={1.5}/><Arrow x1={98} y1={105} x2={194} y2={164} color={TEAL}/><Arrow x1={298} y1={163} x2={395} y2={105} color={BLUE}/><La x={210} y={202} size={20}>τ</La><La x={411} y={202} size={20}>τ</La><Note y={229}>כיווני שינוי סכמטיים: פחות רעש, יותר זמן</Note></Panel>
  <Panel y={737} h={213} title="הצורה המנורמלת · הגבר 1 בכל τ"><La x={240} y={82} size={22}>τ·dx/dt = u−x</La><Note y={128}>המצב היציב x=u בלי תלות ב-τ</Note><La x={240} y={172} size={21}>SD = √(a/(2−a)); a = dt/τ</La></Panel><Note y={990}>ערכים אנליטיים לסכימה שביחידה</Note>
</Fig>; }

function RcMembrane() {return <Fig h={1085} label="קרום כקבל ונגד במקביל ותגובת מדרגה מחושבת בקבוע זמן עשרים מילישניות">
  <Panel y={8} h={313} title="הקרום · קבל ונתיב דליפה במקביל">
    <path d="M105 95 H375 M105 245 H375 M150 95 V145 M150 170 V245 M320 95 V122 L310 134 L330 150 L310 166 L330 182 L320 194 V245 M123 145 H177 M123 170 H177" stroke={INK} strokeWidth={2.4} fill="none"/>
    <La x={87} y={164} size={24} color={BLUE}>C</La><La x={385} y={164} size={24} color={ORANGE}>R</La><Arrow x1={55} y1={95} x2={95} y2={95} color={TEAL}/><La x={55} y={78} size={22}>I</La><La x={240} y={290} size={23}>τ=RC=20 ms</La>
  </Panel>
  <Plot y={347} title="מדרגת זרם · טעינה הדרגתית" series={[s("תגובת המתח",BLUE,t=>1-Math.exp(-t/20),0,100)]} xr={[0,100]} yr={[0,1.08]} xt={[0,20,50,100]} yt={[0,.5,1]} xLabel="t (ms)" yLabel="V / V∞" vlines={[20]} dots={SYSTEMS_CHECKS.membrane.map(([x,y])=>({x,y,color:BLUE}))}/>
  <La x={240} y={761} size={22}>V/V∞=1−exp(−t/20)</La><La x={240} y={805} size={21}>t: 5 / 10 / 20 / 50 / 100 ms</La><La x={240} y={849} size={21}>V/V∞: 0.221 / 0.393 / 0.632 / 0.918 / 0.993</La><Note y={901}>המתח הוא סטייה ממתח המנוחה</Note><Note y={947}>הנגד מייצג דליפה, לא ערוץ פעיל עם סף</Note><Note y={993}>אותה משוואה כמו ייצור ופירוק, בזמן אחר</Note><Note y={1040}>המעגל שקול לקרום; אינו ציור מולקולרי</Note>
</Fig>; }
function NeuronLowpass() {return <Fig h={1035} label="תגובת תדר מחושבת של קרום RC וזוג תאים לכיווני שינוי מנוגדים">
  <Plot y={8} title="תדר גבוה · הגבר נמוך" series={[s("מסנן RC",BLUE,z=>1/Math.sqrt(1+(2*Math.PI*z*.02)**2),1,100)]} xr={[1,100]} yr={[.05,1.05]} xt={[1,5,10,50,100]} yt={[.1,.3,1]} xLabel="f (Hz), log" yLabel="gain, log" logX logY vlines={[SYSTEMS_CHECKS.cutoff]} hlines={[1/Math.SQRT2]} dots={SYSTEMS_CHECKS.frequency.map(([x,y])=>({x,y,color:BLUE}))}/>
  <La x={240} y={420} size={22}>gain = 1/√(1+(2πfτ)²); τ=0.020 s</La><La x={240} y={462} size={23}>fc=7.96 Hz; gain(fc)=0.7071</La><La x={240} y={506} size={20}>f: 1 / 5 / 8 / 20 / 50 / 100 Hz</La><La x={240} y={547} size={20}>0.992 / 0.847 / 0.705 / 0.370 / 0.157 / 0.079</La>
  <Panel y={588} h={317} title="חלוקת עבודה · שני כיווני שינוי">
    <La x={128} y={84} size={25} color={BLUE}>ON</La><La x={352} y={84} size={25} color={ORANGE}>OFF</La><Arrow x1={128} y1={185} x2={128} y2={120} color={BLUE}/><Arrow x1={352} y1={120} x2={352} y2={185} color={ORANGE}/><He x={128} y={234} size={22}>מגיב לעלייה</He><He x={352} y={234} size={22}>מגיב לירידה</He><Note y={286}>סכמה איכותית של העדפת כיוון, לא קצב ירי</Note>
  </Panel><Note y={953}>אות סידן עשוי להוסיף סינון משלו</Note><Note y={996}>הגרף מתאר מתח פסיבי בלבד</Note>
</Fig>; }

function ModelComparison() { const cases=[
  ["תגובה חדה","שיתופיות / רוויית אנזימים","לשנות את כמות המצע הכוללת"],
  ["ספייק בקלט קבוע","לולאה אי־קוהרנטית / משוב מושהה","להפריע לקשר מן הפלט אל המעכב"],
  ["עלייה ואז ירידה","ספייק פנימי / פולס חיצוני","למדוד את הקלט במקביל"],
  ["תגובה מהירה","משוב שלילי / פירוק מהיר","למדוד פירוק כשהייצור נפסק"],
  ["ממוצע אוכלוסייה חלק","אין תנודות / תאים לא מסונכרנים","למדוד תא בודד לאורך זמן"],
];return <Fig h={1765} label="מנגנונים מתחרים, בדיקות מבחינות ופרופילי שגיאה מחושבים המדגימים זיהוי פרמטר">
  {cases.map(([title,mechanisms,test],i)=><Panel key={title} y={8+i*206} h={187} title={title} color={[BLUE,PURPLE,TEAL,ORANGE,BLUE][i]}><He x={240} y={83} size={20}>{mechanisms}</He><He x={240} y={137} size={20} color={TEAL}>{test}</He><He x={240} y={168} size={17} color={MUTED}>בדיקה שנועדה להפריד בין התחזיות</He></Panel>)}
  <Plot y={1055} title="סריקת פרמטר · להתאים מחדש את השאר" series={[s("מכפלה בלבד · פרופיל שטוח",ORANGE,()=>0,.2,3),s("מדידה נוספת · מינימום חד",BLUE,k=>(k-1)**2,.2,3)]} xr={[.2,3]} yr={[-.15,4.2]} xt={[.2,1,2,3]} yt={[0,1,2,3,4]} xLabel="k₁" yLabel="profile SSE"/>
  <La x={240} y={1503} size={21}>data: k₁k₂=1 → fit k₂=1/k₁ → SSE=0</La><La x={240} y={1545} size={21}>+ measure k₁=1 → SSE=(k₁−1)²</La><Note y={1593}>פרופילים מחושבים בדוגמה סינתטית מפורשת</Note><Note y={1634}>התאמה טובה אינה מזהה מנגנון לבדה</Note><Note y={1675} color={RED}>קלט קבוע אינו מבדיל בין שני מנגנוני הספייק</Note><Note y={1716}>שתי בדיקות תוקנו לעומת הטבלה ביחידה</Note>
</Fig>; }

export const SYSTEMS_FIGURES: Record<string,{el:()=>React.ReactElement;captionHe:string}> = {
  "sy-input-output":{el:InputOutput,captionHe:"גבול המערכת קובע מהו קלט ומהו מצב. התגובות חושבו מ־dx/dt=u−x; פולס קצר אינו מגיע לסף חצי."},
  "sy-ode45":{el:Ode45,captionHe:"צעדי חישוב וזמני פלט הם קבוצות שונות. הצעדים המוצגים מריצת Dormand–Prince עצמאית; טבלת הסבילויות מצוטטת מן היחידה, ואינה פלט MATLAB ששוחזר כאן."},
  "sy-input-function":{el:InputFunction,captionHe:"פונקציות היל מחושבות; ריכוז החצי משותף, החדות שונה. קירוב לוגי מוצג בנפרד."},
  "sy-nar-vs-simple":{el:NarSimple,captionHe:"השוואה במצב יציב תואם: משוב שלילי מאיץ, ומשוב חיובי בדוגמה מאט. הרפיה מקומית ומדרגה מלאה הן מדידות שונות."},
  "sy-ffl-structure":{el:()=> <FflStructure/>,captionHe:"לולאה קוהרנטית של הפעלה: הטופולוגיה אינה בוחרת את השער הלוגי בצומת הפלט."},
  "sy-ffl-and-or":{el:FflAndOr,captionHe:"פתרון מקוטע אנליטי: AND משהה את הכניסה ב-ln2 עבור הסף הזה, ו-OR משהה את הכיבוי. ב-OR אין השהיה בהדלקה: Z מתחיל לעלות ב-t=1 בדיוק."},
  "sy-iffl-structure":{el:()=> <FflStructure incoherent/>,captionHe:"הפעלה ישירה ודיכוי עקיף דרך מתווך מצטבר. הסכמה מציגה סימנים ותזמון, לא קצבים."},
  "sy-iffl-pulse":{el:IfflPulse,captionHe:"ספייק מחושב למרות קלט קבוע. ההשוואה למעגל פשוט נעשית באותה רמה סופית; זמני המחצית חושבו ברזולוציה גבוהה."},
  "sy-bistable-1d":{el:Bistable1D,captionHe:"חיתוכי ייצור ופירוק, יציבות מן הנגזרת ואגני משיכה משני צדי הנקודה הלא יציבה."},
  "sy-hysteresis":{el:Hysteresis,captionHe:"המשוואה כוללת 0.1+S בייצור הבסיסי. הענף הנמוך נעלם ב־S=0.28379; בחזרה ל־S=0 נשארים ב־1.9772."},
  "sy-nullclines":{el:Nullclines,captionHe:"נאלקלינות מחושבות עבור β=3,n=2 ושדה כיוונים מן המשוואות. אלה שתי עקומות יורדות, ולא עקומות S כפי שמתואר ביחידה."},
  "sy-gradient-threshold":{el:Gradient,captionHe:"מפל מעריכי עם אורך דעיכה 20 מיקרומטר. הכפלת המקור מזיזה כל סף מוחלט באותו מרחק."},
  "sy-cross-repression":{el:CrossRepression,captionHe:"חישוב עבור β=2,α=1,n=3 משחזר את טבלת הדיכוי ההדדי. החידוד אינו מקטין את הסטת הגבול בעקבות הכפלת המקור."},
  "sy-covalent-cycle":{el:CovalentCycle,captionHe:"מחזור זרחון סכמטי במאגר נשמר: המרת הצורות אינה ייצור או פירוק של המצע."},
  "sy-zero-order":{el:ZeroOrder,captionHe:"פתרונות שיווי משקל מחושבים. מקדם היל האפקטיבי מחושב מריכוזי 10% ו־90%; העקומה חד־ערכית גם כשהיא חדה מאוד."},
  "sy-dose-vs-time":{el:DoseTime,captionHe:"דוגמת נגד מתמטית מפורשת: שתי פונקציות זמן שונות מקבלות בדיוק אותה מנה–תגובה ב־t=1. זו דוגמה סינתטית ולא נתוני ניסוי."},
  "sy-nfkb":{el:Nfkb,captionHe:"משוב שלילי מושהה: הפלט מפעיל את המעכב של עצמו. העקומה היא פתרון מדויק של המודל שביחידה; פאנל העוצמה והמשך חושב בנפרד עבור dy/dt=u−0.5y."},
  "sy-adaptation-definition":{el:AdaptationDefinition,captionHe:"דוגמה לינארית מחושבת: הקלט נשאר גבוה; פלט יכול לחזור לבסיס בעוד המשתנה הפנימי זז לצמיתות."},
  "sy-integral-feedback":{el:IntegralFeedback,captionHe:"פתרון אנליטי למדרגות 1→3→9 עם k=1. השיאים המיידיים הם 3 ו־7 בדיוק, והפלט חוזר ל-1.000 אחרי כל מדרגה."},
  "sy-chemotaxis":{el:Chemotaxis,captionHe:"הוספה קבועה והסרה תלוית פעילות מממשות אינטגרל. העקומות הן דוגמה מקומית לינארית מפורשת, לא שחזור של ניסוי כימוטקסיס."},
  "sy-noise-sources":{el:NoiseSources,captionHe:"אוכלוסייה סינתטית מחושבת המשחזרת במדויק את שלושת מדדי השונות. זה אינו שחזור ההגרלה המקורית, שפרטיה חסרים."},
  "sy-lowpass":{el:Lowpass,captionHe:"סטיית התקן של הפלט יורדת כ-1/√τ בצורה המנורמלת, שבה ההגבר הוא 1 בכל τ. הערכים הם הפתרון המדויק לסכימה שביחידה."},
  "sy-rc-membrane":{el:RcMembrane,captionHe:"מעגל שקול פסיבי של הקרום ופתרון אנליטי של תגובת מדרגה עם קבוע זמן 20 מילישניות."},
  "sy-neuron-lowpass":{el:NeuronLowpass,captionHe:"הגבר RC מחושב על שני צירים לוגריתמיים; תדר החיתוך 7.96 הרץ. הסכמה התחתונה מציגה חלוקת עבודה בין כיווני שינוי."},
  "sy-model-comparison":{el:ModelComparison,captionHe:"מנגנונים מתחרים ובדיקות מבחינות. קלט קבוע אינו מפריד בין לולאה אי־קוהרנטית למשוב מושהה; השוואת מצב יציב לבדה אינה מזהה פירוק מהיר."},
};

// Captions are mixed RTL/LTR too; preserve formulas and identifiers as LTR runs.
for (const figure of Object.values(SYSTEMS_FIGURES)) figure.captionHe=figure.captionHe.replace(/[−+]?[A-Za-z0-9α-ωΑ-ΩΔβτλ][A-Za-z0-9_α-ωΑ-ΩΔβτλ²³⁴⁺⁻·−/().,=+*^ %:<>→↔≈≤≥-]*/g,m=>"\u2066"+m.trimEnd()+"\u2069"+m.slice(m.trimEnd().length));
