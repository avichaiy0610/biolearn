/* Figures for the biostatistics units (Technion 134154). Curves are computed from the distribution formulas and
   the simulated panels from a seeded generator, so every number drawn is the number in the text. Labels sit beside
   bars, curves and lines, never on them. Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, BLUE, GREEN, INK, MUTED, ORANGE, He, La, scale, curve, dash } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

const RED = "#b91c1c";
const PURPLE = "#7c3aed";
const TEAL = "#0f766e";
const FILL = { blue: "#dbeafe", green: "#dcfce7", orange: "#ffedd5", purple: "#ede9fe", yellow: "#fef3c7", gray: "#f1f5f9", red: "#fee2e2", teal: "#ccfbf1" };

const Svg = ({ w = 480, h, label, children }: { w?: number; h: number; label: string; children: React.ReactNode }) => (
  <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label={label}>
    <ArrowDefs />
    {children}
  </svg>
);

// ── math ─────────────────────────────────────────────────────────────────────
const LANCZOS = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61503916999185, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
function lgamma(z: number): number {
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  z -= 1;
  let a = 0.99999999999980993;
  const t = z + 7.5;
  LANCZOS.forEach((c, i) => { a += c / (z + i + 1); });
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}
const normPdf = (x: number, m = 0, s = 1) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
const tPdf = (x: number, df: number) => Math.exp(lgamma((df + 1) / 2) - lgamma(df / 2) - 0.5 * Math.log(df * Math.PI) - ((df + 1) / 2) * Math.log(1 + (x * x) / df));
const chiPdf = (x: number, k: number) => (x <= 0 ? 0 : Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.log(2) - lgamma(k / 2)));
const fPdf = (x: number, d1: number, d2: number) =>
  x <= 0 ? 0 : Math.exp(0.5 * (d1 * Math.log(d1 * x) + d2 * Math.log(d2) - (d1 + d2) * Math.log(d1 * x + d2)) - Math.log(x) - (lgamma(d1 / 2) + lgamma(d2 / 2) - lgamma((d1 + d2) / 2)));
// Mean of n independent exponentials with mean 1: gamma with shape n and rate n.
const meanExpPdf = (x: number, n: number) => (x <= 0 ? 0 : Math.exp(n * Math.log(n) + (n - 1) * Math.log(x) - n * x - lgamma(n)));
const binom = (n: number, k: number, p: number) => Math.exp(lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1) + k * Math.log(p) + (n - k) * Math.log(1 - p));
// Numerical integral (Simpson) — for tail areas drawn in the figures.
function area(f: (x: number) => number, a: number, b: number, n = 400) {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}
const rng = (seed: number) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const gauss = (r: () => number) => () => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const sd = (v: number[]) => { const m = mean(v); return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1)); };
const pearson = (x: number[], y: number[]) => {
  const mx = mean(x), my = mean(y);
  let sxy = 0, sxx = 0, syy = 0;
  x.forEach((xi, i) => { sxy += (xi - mx) * (y[i] - my); sxx += (xi - mx) ** 2; syy += (y[i] - my) ** 2; });
  return sxy / Math.sqrt(sxx * syy);
};
// Shaded region under a curve between a and b, closed down to the axis.
function fillArea(f: (x: number) => number, a: number, b: number, s: { sx: (v: number) => number; sy: (v: number) => number }, n = 80) {
  let d = `M${s.sx(a).toFixed(1)} ${s.sy(0).toFixed(1)}`;
  for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; d += `L${s.sx(x).toFixed(1)} ${s.sy(f(x)).toFixed(1)}`; }
  return d + `L${s.sx(b).toFixed(1)} ${s.sy(0).toFixed(1)}Z`;
}
const fmt = (v: number, d = 2) => v.toFixed(d);

// Plain x axis with ticks (no arrow): for density plots.
function XAxis({ x0, x1, y, ticks, s, size = 10 }: { x0: number; x1: number; y: number; ticks: [number, string][]; s: { sx: (v: number) => number }; size?: number }) {
  return (
    <g>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={INK} strokeWidth={1.3} />
      {ticks.map(([v, l]) => (
        <g key={l + v}>
          <line x1={s.sx(v)} y1={y} x2={s.sx(v)} y2={y + 4} stroke={INK} strokeWidth={1} />
          <La x={s.sx(v)} y={y + 16} size={size} color={MUTED}>{l}</La>
        </g>
      ))}
    </g>
  );
}
function Box({ x, y, w, h, fill, stroke, children, size = 11, bold }: { x: number; y: number; w: number; h: number; fill: string; stroke: string; children: React.ReactNode; size?: number; bold?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <He x={x + w / 2} y={y + h / 2 + size * 0.36} size={size} bold={bold}>{children}</He>
    </g>
  );
}

// ── bs-describing-data ───────────────────────────────────────────────────────
function VariableTypes() {
  const leaf = (x: number, title: string, ex: string, c: string, f: string) => (
    <g>
      <Box x={x} y={150} w={104} h={34} fill={f} stroke={c} size={11} bold>{title}</Box>
      <He x={x + 52} y={204} size={9.5} color={MUTED}>{ex}</He>
    </g>
  );
  return (
    <Svg h={226} label="סוגי משתנים: משתנה קטגורי מתחלק לשמי (למשל סוג דם) ולסודר (למשל דרגת חומרה). משתנה כמותי מתחלק לבדיד (למשל מספר ביצים בקן) ולרציף (למשל משקל).">
      <Box x={180} y={14} w={120} h={34} fill={FILL.gray} stroke={MUTED} size={12} bold>משתנה</Box>
      <Box x={330} y={78} w={120} h={34} fill={FILL.orange} stroke={ORANGE} size={11.5} bold>קטגורי (איכותי)</Box>
      <Box x={30} y={78} w={120} h={34} fill={FILL.blue} stroke={BLUE} size={11.5} bold>כמותי</Box>
      <Arrow x1={270} y1={50} x2={360} y2={76} color={MUTED} width={1.3} />
      <Arrow x1={210} y1={50} x2={120} y2={76} color={MUTED} width={1.3} />
      <Arrow x1={420} y1={114} x2={434} y2={148} color={MUTED} width={1.2} />
      <Arrow x1={362} y1={114} x2={318} y2={148} color={MUTED} width={1.2} />
      <Arrow x1={118} y1={114} x2={152} y2={148} color={MUTED} width={1.2} />
      <Arrow x1={60} y1={114} x2={46} y2={148} color={MUTED} width={1.2} />
      {leaf(370, "שמי", "סוג דם, מין, זן", ORANGE, FILL.orange)}
      {leaf(254, "סודר", "דרגת חומרה 1–4", ORANGE, FILL.orange)}
      {leaf(130, "בדיד", "מספר ביצים בקן", BLUE, FILL.blue)}
      {leaf(14, "רציף", "משקל, ריכוז, זמן", BLUE, FILL.blue)}
    </Svg>
  );
}

function DistributionShapes() {
  // Three densities binned into histograms; mean (solid) and median (dashed) marked.
  const g2 = (x: number) => (x <= 0 ? 0 : x * Math.exp(-x)); // gamma(2,1): mean 2, median ≈ 1.678
  const panels = [
    { title: "סימטרית", f: (x: number) => normPdf(x, 3, 1), mean: 3, median: 3, c: BLUE },
    { title: "אסימטרית ימנית", f: (x: number) => g2(x * 1.0), mean: 2, median: 1.678, c: ORANGE },
    { title: "אסימטרית שמאלית", f: (x: number) => g2(6 - x), mean: 4, median: 6 - 1.678, c: PURPLE },
  ];
  const W = 150;
  return (
    <Svg h={210} label="שלוש צורות של התפלגות. בהתפלגות סימטרית הממוצע והחציון שווים. באסימטריה ימנית יש זנב ארוך לימין והממוצע גדול מהחציון. באסימטריה שמאלית הזנב לשמאל והממוצע קטן מהחציון.">
      {panels.map((p, k) => {
        const x0 = 14 + k * (W + 10), x1 = x0 + W;
        const s = scale(x0, x1, 160, 50, 0, 6, 0, 0.42);
        const bins = Array.from({ length: 12 }, (_, i) => i * 0.5);
        return (
          <g key={k}>
            {bins.map((b) => {
              const h = area(p.f, b, b + 0.5, 20) / 0.5;
              return <rect key={b} x={s.sx(b) + 0.5} y={s.sy(h)} width={s.sx(0.5) - s.sx(0) - 1} height={s.sy(0) - s.sy(h)} fill={FILL.gray} stroke={MUTED} strokeWidth={0.8} />;
            })}
            <line x1={x0} y1={160} x2={x1} y2={160} stroke={INK} strokeWidth={1.2} />
            <line x1={s.sx(p.mean)} y1={160} x2={s.sx(p.mean)} y2={42} stroke={p.c} strokeWidth={2} />
            <line x1={s.sx(p.median)} y1={160} x2={s.sx(p.median)} y2={42} stroke={GREEN} strokeWidth={2} {...dash} />
            <He x={(x0 + x1) / 2} y={24} size={11} bold color={p.c}>{p.title}</He>
          </g>
        );
      })}
      <line x1={330} y1={190} x2={354} y2={190} stroke={INK} strokeWidth={2} />
      <He x={325} y={194} size={10} anchor="end">ממוצע</He>
      <line x1={190} y1={190} x2={214} y2={190} stroke={GREEN} strokeWidth={2} {...dash} />
      <He x={185} y={194} size={10} anchor="end">חציון</He>
    </Svg>
  );
}

const LEAF = [4.1, 4.8, 5.0, 5.2, 5.5, 5.6, 5.9, 6.0, 6.2, 6.4, 6.7, 7.0, 7.3, 7.8, 11.2];
function quantile7(v: number[], q: number) { const s = [...v].sort((a, b) => a - b); const h = (s.length - 1) * q, lo = Math.floor(h); return s[lo] + (h - lo) * (s[Math.min(lo + 1, s.length - 1)] - s[lo]); }
function Boxplot() {
  const s = scale(40, 450, 0, 0, 3, 12, 0, 1);
  const q1 = quantile7(LEAF, 0.25), md = quantile7(LEAF, 0.5), q3 = quantile7(LEAF, 0.75), iqr = q3 - q1;
  const hiFence = q3 + 1.5 * iqr;
  const inside = LEAF.filter((v) => v <= hiFence && v >= q1 - 1.5 * iqr);
  const wLo = Math.min(...inside), wHi = Math.max(...inside);
  const y = 96;
  return (
    <Svg h={250} label={`תרשים קופסה של אורך 15 עלים בסנטימטרים. הרבעון הראשון ${fmt(q1)}, החציון ${fmt(md, 1)}, הרבעון השלישי ${fmt(q3)}, הטווח הבין-רבעוני ${fmt(iqr)}. השפמים מגיעים עד 4.1 ועד 7.8. העלה באורך 11.2 רחוק מהגבול ${fmt(hiFence)} ולכן מסומן כערך חריג.`}>
      <rect x={s.sx(q1)} y={y - 22} width={s.sx(q3) - s.sx(q1)} height={44} fill={FILL.blue} stroke={BLUE} strokeWidth={1.6} />
      <line x1={s.sx(md)} y1={y - 22} x2={s.sx(md)} y2={y + 22} stroke={BLUE} strokeWidth={2.6} />
      <line x1={s.sx(wLo)} y1={y} x2={s.sx(q1)} y2={y} stroke={INK} strokeWidth={1.4} />
      <line x1={s.sx(q3)} y1={y} x2={s.sx(wHi)} y2={y} stroke={INK} strokeWidth={1.4} />
      <line x1={s.sx(wLo)} y1={y - 10} x2={s.sx(wLo)} y2={y + 10} stroke={INK} strokeWidth={1.4} />
      <line x1={s.sx(wHi)} y1={y - 10} x2={s.sx(wHi)} y2={y + 10} stroke={INK} strokeWidth={1.4} />
      <circle cx={s.sx(11.2)} cy={y} r={4.5} fill="#fff" stroke={RED} strokeWidth={1.8} />
      <line x1={s.sx(hiFence)} y1={y - 30} x2={s.sx(hiFence)} y2={y + 30} stroke={RED} strokeWidth={1} {...dash} />
      {/* labels above the box */}
      <La x={s.sx(q1)} y={y - 30} size={10.5} color={BLUE}>Q1</La>
      <He x={s.sx(md)} y={y - 46} size={10.5} color={BLUE}>חציון</He>
      <La x={s.sx(q3)} y={y - 30} size={10.5} color={BLUE}>Q3</La>
      <He x={s.sx(hiFence)} y={y - 38} size={9.5} color={RED}>Q3 + 1.5·IQR</He>
      <He x={s.sx(11.2)} y={y - 14} size={10} color={RED}>חריג</He>
      <He x={s.sx(wLo) + 4} y={y - 16} size={9.5} color={MUTED}>שפם</He>
      {/* the raw data under the box */}
      {LEAF.map((v, i) => <circle key={i} cx={s.sx(v)} cy={168 - (LEAF.slice(0, i).filter((u) => Math.abs(u - v) < 0.12).length) * 9} r={3.5} fill={ORANGE} />)}
      <XAxis x0={40} x1={450} y={178} s={s} ticks={[[4, "4"], [6, "6"], [8, "8"], [10, "10"], [12, "12"]]} />
      <He x={245} y={214} size={10.5} color={MUTED}>אורך עלה (ס״מ) — כל נקודה היא עלה אחד</He>
      <He x={245} y={236} size={10} color={MUTED}>{`IQR = ${fmt(q3)} − ${fmt(q1)} = ${fmt(iqr)}`}</He>
    </Svg>
  );
}

function SameMeanDifferentSd() {
  const r = rng(11), g = gauss(r);
  const a = Array.from({ length: 20 }, () => 50 + 2 * g());
  const b = Array.from({ length: 20 }, () => 50 + 8 * g());
  const shift = (v: number[]) => { const m = mean(v); return v.map((x) => x - m + 50); };
  const A = shift(a), B = shift(b);
  const s = scale(40, 450, 0, 0, 25, 75, 0, 1);
  const row = (v: number[], y: number, c: string, title: string) => (
    <g>
      {v.map((x, i) => <circle key={i} cx={s.sx(x)} cy={y + (i % 3) * 7 - 7} r={3.6} fill={c} fillOpacity={0.8} />)}
      <He x={460} y={y - 24} size={10.5} anchor="end" bold color={c}>{title}</He>
      <He x={40} y={y - 24} size={10} anchor="start" color={c}>{`ס״ת ${fmt(sd(v), 1)}`}</He>
    </g>
  );
  return (
    <Svg h={200} label={`שתי קבוצות של 20 מדידות, לשתיהן ממוצע 50. בקבוצה א סטיית התקן ${fmt(sd(A), 1)}, בקבוצה ב ${fmt(sd(B), 1)}. הממוצע לבדו לא מספר את ההבדל.`}>
      {row(A, 54, BLUE, "קבוצה א")}
      {row(B, 124, ORANGE, "קבוצה ב")}
      <line x1={s.sx(50)} y1={30} x2={s.sx(50)} y2={150} stroke={INK} strokeWidth={1.2} {...dash} />
      <XAxis x0={40} x1={450} y={156} s={s} ticks={[[30, "30"], [40, "40"], [50, "50"], [60, "60"], [70, "70"]]} />
      <He x={s.sx(50)} y={192} size={10} color={MUTED}>ממוצע 50 בשתי הקבוצות</He>
    </Svg>
  );
}

// ── bs-probability ───────────────────────────────────────────────────────────
function TestTree() {
  const node = (x: number, y: number, w: number, lines: [string, string], c: string, f: string) => (
    <g>
      <rect x={x} y={y} width={w} height={42} rx={8} fill={f} stroke={c} strokeWidth={1.4} />
      <He x={x + w / 2} y={y + 17} size={10.5} bold color={c}>{lines[0]}</He>
      <He x={x + w / 2} y={y + 33} size={10}>{lines[1]}</He>
    </g>
  );
  return (
    <Svg h={290} label="עץ הסתברות לבדיקת סקר על 10,000 איש, שכיחות 1%, רגישות 95% וסגוליות 90%. 100 חולים: 95 חיוביים ו-5 שליליים. 9,900 בריאים: 990 חיוביים ו-8,910 שליליים. מתוך 1,085 חיוביים רק 95 חולים — כ-8.8%.">
      {node(180, 10, 120, ["10,000 נבדקים", ""], INK, FILL.gray)}
      {node(330, 90, 120, ["חולים", "100"], RED, FILL.red)}
      {node(30, 90, 120, ["בריאים", "9,900"], GREEN, FILL.green)}
      <Arrow x1={276} y1={54} x2={358} y2={88} color={MUTED} width={1.3} />
      <Arrow x1={204} y1={54} x2={120} y2={88} color={MUTED} width={1.3} />
      <He x={346} y={64} size={9.5} color={RED}>שכיחות 1%</He>
      <He x={136} y={64} size={9.5} color={GREEN}>99%</He>
      {node(394, 180, 80, ["חיובי", "95"], RED, "#fff")}
      {node(306, 180, 80, ["שלילי", "5"], MUTED, "#fff")}
      {node(94, 180, 80, ["חיובי", "990"], ORANGE, "#fff")}
      {node(6, 180, 80, ["שלילי", "8,910"], MUTED, "#fff")}
      <Arrow x1={414} y1={134} x2={430} y2={178} color={MUTED} width={1.2} />
      <Arrow x1={366} y1={134} x2={350} y2={178} color={MUTED} width={1.2} />
      <Arrow x1={114} y1={134} x2={130} y2={178} color={MUTED} width={1.2} />
      <Arrow x1={66} y1={134} x2={50} y2={178} color={MUTED} width={1.2} />
      <La x={444} y={154} size={9.5} anchor="start" color={RED}>95%</La>
      <La x={36} y={154} size={9.5} anchor="end" color={GREEN}>90%</La>
      <He x={474} y={20} size={9.5} anchor="end" color={MUTED}>רגישות 95% · סגוליות 90%</He>
      <rect x={60} y={238} width={360} height={44} rx={8} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.2} />
      <He x={240} y={256} size={10.5} bold>{"P(חולה | חיובי) = 95 / (95 + 990) ≈ 8.8%"}</He>
      <He x={240} y={274} size={10} color={MUTED}>רוב התוצאות החיוביות — אצל בריאים, כי הבריאים רבים</He>
    </Svg>
  );
}

// ── bs-random-variables-binomial ─────────────────────────────────────────────
function BinomialPmf() {
  const panel = (x0: number, n: number, p: number, c: string, f: string) => {
    const x1 = x0 + 200;
    const s = scale(x0 + 10, x1, 170, 40, -0.5, n + 0.5, 0, 0.3);
    const bw = s.sx(1) - s.sx(0) - 4;
    return (
      <g>
        {Array.from({ length: n + 1 }, (_, k) => {
          const pk = binom(n, k, p);
          return (
            <g key={k}>
              <rect x={s.sx(k) - bw / 2} y={s.sy(pk)} width={bw} height={170 - s.sy(pk)} fill={f} stroke={c} strokeWidth={1.1} />
              <La x={s.sx(k)} y={186} size={9.5} color={MUTED}>{k}</La>
            </g>
          );
        })}
        <line x1={x0 + 6} y1={170} x2={x1 + 4} y2={170} stroke={INK} strokeWidth={1.2} />
        <La x={(x0 + x1) / 2} y={24} size={11} bold color={c}>{`n = ${n}, p = ${p}`}</La>
        <line x1={s.sx(n * p)} y1={36} x2={s.sx(n * p)} y2={170} stroke={INK} strokeWidth={1} {...dash} />
        <La x={s.sx(n * p) + 4} y={44} size={9.5} anchor="start" color={INK}>{`np = ${n * p}`}</La>
      </g>
    );
  };
  return (
    <Svg h={226} label="שתי התפלגויות בינומיות עם 10 ניסויים. כש-p שווה 0.25 ההתפלגות אסימטרית ימנית ומרכזה ב-2.5. כש-p שווה 0.5 היא סימטרית סביב 5.">
      {panel(20, 10, 0.25, ORANGE, FILL.orange)}
      {panel(258, 10, 0.5, BLUE, FILL.blue)}
      <He x={240} y={214} size={10} color={MUTED}>מספר ההצלחות k · גובה העמודה = P(X = k)</He>
    </Svg>
  );
}

// ── bs-normal-clt ────────────────────────────────────────────────────────────
function NormalRule() {
  const s = scale(30, 450, 190, 30, -3.6, 3.6, 0, 0.42);
  const band = (k: number, f: string) => <path d={fillArea(normPdf, -k, k, s)} fill={f} />;
  return (
    <Svg h={262} label="ההתפלגות הנורמלית: כ-68% מהשטח בטווח של סטיית תקן אחת מהממוצע, כ-95% בטווח של שתיים (ליתר דיוק 1.96), וכ-99.7% בטווח של שלוש.">
      {band(3, "#eef2ff")}
      {band(2, "#c7d2fe")}
      {band(1, "#93c5fd")}
      <path d={curve(normPdf, -3.6, 3.6, s)} fill="none" stroke={BLUE} strokeWidth={2.2} />
      <XAxis x0={30} x1={450} y={190} s={s} ticks={[[-3, "μ−3σ"], [-2, "μ−2σ"], [-1, "μ−σ"], [0, "μ"], [1, "μ+σ"], [2, "μ+2σ"], [3, "μ+3σ"]]} size={9.5} />
      {[[1, "68%", 222], [2, "95%", 238], [3, "99.7%", 254]].map(([k, l, y]) => (
        <g key={l as string}>
          <line x1={s.sx(-(k as number))} y1={(y as number) - 4} x2={s.sx(k as number)} y2={(y as number) - 4} stroke={MUTED} strokeWidth={1} />
          <La x={s.sx(k as number) + 6} y={y as number} size={10} anchor="start" color={INK} bold>{l as string}</La>
        </g>
      ))}
    </Svg>
  );
}

function Clt() {
  const s = scale(40, 450, 200, 30, 0, 3, 0, 2.3);
  const ns: [number, string][] = [[1, ORANGE], [2, PURPLE], [5, TEAL], [30, BLUE]];
  return (
    <Svg h={250} label="משפט הגבול המרכזי. ההתפלגות במקור — מעריכית, אסימטרית מאוד (n = 1). התפלגות הממוצע של 2, של 5 ושל 30 תצפיות נעשית צרה וסימטרית יותר סביב התוחלת 1, ומתקרבת לצורת פעמון.">
      {ns.map(([n, c]) => <path key={n} d={curve((x) => Math.min(meanExpPdf(x, n), 2.3), 0.001, 3, s, 300)} fill="none" stroke={c} strokeWidth={2} />)}
      <line x1={s.sx(1)} y1={30} x2={s.sx(1)} y2={200} stroke={INK} strokeWidth={1} {...dash} />
      <XAxis x0={40} x1={450} y={200} s={s} ticks={[[0, "0"], [1, "μ = 1"], [2, "2"], [3, "3"]]} />
      <La x={s.sx(0.12)} y={40} size={10.5} anchor="start" color={ORANGE} bold>n = 1</La>
      <La x={s.sx(0.5)} y={s.sy(0.736) - 12} size={10.5} color={PURPLE} bold>n = 2</La>
      <La x={s.sx(1.5)} y={s.sy(0.62)} size={10.5} anchor="start" color={TEAL} bold>n = 5</La>
      <La x={s.sx(1.22)} y={s.sy(2.0)} size={10.5} anchor="start" color={BLUE} bold>n = 30</La>
      <He x={245} y={238} size={10} color={MUTED}>התפלגות ממוצע המדגם · המקור: התפלגות מעריכית עם תוחלת 1</He>
    </Svg>
  );
}

// ── bs-confidence-intervals ──────────────────────────────────────────────────
function CiCoverage() {
  // 25 samples of n = 10 from N(100, 15²); 95% t-interval (t₀.₉₇₅,₉ = 2.262) for each.
  const r = rng(2024), g = gauss(r), T = 2.262;
  const rows = Array.from({ length: 25 }, () => {
    const v = Array.from({ length: 10 }, () => 100 + 15 * g());
    const m = mean(v), half = (T * sd(v)) / Math.sqrt(10);
    return { lo: m - half, hi: m + half, m };
  });
  const miss = rows.filter((q) => q.lo > 100 || q.hi < 100).length;
  const s = scale(40, 450, 0, 0, 70, 130, 0, 1);
  return (
    <Svg h={330} label={`25 מדגמים של 10 תצפיות מאוכלוסייה שתוחלתה 100. לכל מדגם רווח סמך של 95%. ${25 - miss} מהרווחים כוללים את 100, ו-${miss} לא (באדום).`}>
      <line x1={s.sx(100)} y1={16} x2={s.sx(100)} y2={272} stroke={INK} strokeWidth={1.4} {...dash} />
      {rows.map((q, i) => {
        const y = 24 + i * 10;
        const out = q.lo > 100 || q.hi < 100;
        const c = out ? RED : BLUE;
        return (
          <g key={i}>
            <line x1={s.sx(q.lo)} y1={y} x2={s.sx(q.hi)} y2={y} stroke={c} strokeWidth={out ? 2.4 : 1.6} />
            <circle cx={s.sx(q.m)} cy={y} r={2.4} fill={c} />
          </g>
        );
      })}
      <XAxis x0={40} x1={450} y={278} s={s} ticks={[[70, "70"], [85, "85"], [100, "μ = 100"], [115, "115"], [130, "130"]]} />
      <He x={245} y={312} size={10.5} color={INK}>{`${25 - miss} מתוך 25 רווחים כוללים את μ · ${miss} לא (אדום)`}</He>
      <He x={245} y={326} size={9.5} color={MUTED}>הרווחים זזים ממדגם למדגם; μ קבוע</He>
    </Svg>
  );
}

function TvsNormal() {
  const s = scale(30, 450, 190, 30, -4, 4, 0, 0.42);
  return (
    <Svg h={230} label="התפלגות t עם 2 ועם 5 דרגות חופש לעומת ההתפלגות הנורמלית הסטנדרטית. ל-t זנבות עבים יותר; ככל שדרגות החופש עולות, היא מתקרבת לנורמלית.">
      <path d={curve(normPdf, -4, 4, s)} fill="none" stroke={BLUE} strokeWidth={2.2} />
      <path d={curve((x) => tPdf(x, 5), -4, 4, s)} fill="none" stroke={TEAL} strokeWidth={2} {...dash} />
      <path d={curve((x) => tPdf(x, 2), -4, 4, s)} fill="none" stroke={ORANGE} strokeWidth={2} />
      <XAxis x0={30} x1={450} y={190} s={s} ticks={[[-3, "−3"], [-2, "−2"], [-1, "−1"], [0, "0"], [1, "1"], [2, "2"], [3, "3"]]} />
      <He x={s.sx(0.55)} y={s.sy(0.405)} size={10.5} anchor="start" color={BLUE} bold>נורמלית Z</He>
      <La x={s.sx(2.9)} y={s.sy(0.09) - 8} size={10.5} anchor="start" color={ORANGE} bold>t, df = 2</La>
      <La x={s.sx(-1.25)} y={s.sy(0.3) - 6} size={10.5} anchor="end" color={TEAL} bold>t, df = 5</La>
      <He x={240} y={222} size={10} color={MUTED}>הזנבות של t עבים יותר — לכן הערך הקריטי גדול יותר</He>
    </Svg>
  );
}

// ── bs-hypothesis-testing ────────────────────────────────────────────────────
function PValue() {
  const df = 14, tObs = 2.3;
  const f = (x: number) => tPdf(x, df);
  const tail = area(f, tObs, 12, 800);
  const s = scale(30, 450, 180, 30, -4.2, 4.2, 0, 0.42);
  return (
    <Svg h={236} label={`מבחן t דו-צדדי עם 14 דרגות חופש. הסטטיסטי הנצפה 2.3. ערך p הוא השטח בשני הזנבות מעבר ל-2.3 ול-מינוס 2.3: כ-${fmt(2 * tail, 3)}.`}>
      <path d={fillArea(f, tObs, 4.2, s)} fill={FILL.red} />
      <path d={fillArea(f, -4.2, -tObs, s)} fill={FILL.red} />
      <path d={curve(f, -4.2, 4.2, s)} fill="none" stroke={BLUE} strokeWidth={2.2} />
      <line x1={s.sx(tObs)} y1={60} x2={s.sx(tObs)} y2={180} stroke={RED} strokeWidth={1.6} />
      <line x1={s.sx(-tObs)} y1={60} x2={s.sx(-tObs)} y2={180} stroke={RED} strokeWidth={1.2} {...dash} />
      <He x={s.sx(tObs) + 4} y={52} size={10.5} anchor="start" color={RED} bold>t נצפה = 2.3</He>
      <La x={s.sx(-tObs) - 4} y={52} size={10.5} anchor="end" color={RED}>−2.3</La>
      <La x={s.sx(3.3)} y={s.sy(0.03) - 14} size={10} color={RED}>{fmt(tail, 3)}</La>
      <La x={s.sx(-3.3)} y={s.sy(0.03) - 14} size={10} color={RED}>{fmt(tail, 3)}</La>
      <He x={s.sx(0)} y={s.sy(0.2)} size={10.5} color={BLUE}>התפלגות t בהנחת H₀</He>
      <XAxis x0={30} x1={450} y={180} s={s} ticks={[[-3, "−3"], [-2, "−2"], [-1, "−1"], [0, "0"], [1, "1"], [2, "2"], [3, "3"]]} />
      <He x={240} y={226} size={10.5} bold>{`p = ${fmt(tail, 3)} + ${fmt(tail, 3)} ≈ ${fmt(2 * tail, 3)}`}</He>
    </Svg>
  );
}

function ErrorTypes() {
  const d = 2.5, crit = 1.645;
  const f0 = (x: number) => normPdf(x, 0, 1), f1 = (x: number) => normPdf(x, d, 1);
  const s = scale(30, 450, 190, 40, -3, 6, 0, 0.42);
  const beta = area(f1, -6, crit, 600);
  return (
    <Svg h={262} label={`מבחן חד-צדדי ברמת מובהקות 5%. הערך הקריטי 1.645. השטח מימין לו תחת H₀ הוא α, טעות מסוג ראשון. אם האמת היא H₁ (מרכז 2.5), השטח משמאל לערך הקריטי הוא β, טעות מסוג שני — כ-${fmt(beta, 2)}, והעוצמה כ-${fmt(1 - beta, 2)}.`}>
      <path d={fillArea(f1, -3, crit, s)} fill={FILL.orange} />
      <path d={fillArea(f0, crit, 6, s)} fill={FILL.red} />
      <path d={curve(f0, -3, 6, s)} fill="none" stroke={BLUE} strokeWidth={2.2} />
      <path d={curve(f1, -3, 6, s)} fill="none" stroke={PURPLE} strokeWidth={2.2} />
      <line x1={s.sx(crit)} y1={40} x2={s.sx(crit)} y2={190} stroke={INK} strokeWidth={1.4} {...dash} />
      <He x={s.sx(crit)} y={32} size={10} color={INK}>ערך קריטי 1.645</He>
      <La x={s.sx(-0.9)} y={s.sy(0.3) - 8} size={11} anchor="end" color={BLUE} bold>H₀</La>
      <La x={s.sx(3.4)} y={s.sy(0.3) - 8} size={11} anchor="start" color={PURPLE} bold>H₁</La>
      <La x={s.sx(2.25)} y={178} size={11} color={RED} bold>α</La>
      <La x={s.sx(1.0)} y={178} size={11} color={ORANGE} bold>β</La>
      <XAxis x0={30} x1={450} y={190} s={s} ticks={[[-2, "−2"], [0, "0"], [2, "2"], [2.5, ""], [4, "4"], [6, "6"]]} />
      <He x={240} y={226} size={10.5}>{`α = 0.05 · β ≈ ${fmt(beta, 2)} · עוצמה = 1 − β ≈ ${fmt(1 - beta, 2)}`}</He>
      <He x={240} y={246} size={10} color={MUTED}>הזזת הקו ימינה מקטינה את α ומגדילה את β</He>
    </Svg>
  );
}

// ── bs-two-means ─────────────────────────────────────────────────────────────
const PAIRED_BEFORE = [112, 128, 135, 141, 150, 158, 166, 175];
const PAIRED_AFTER = [118, 131, 141, 145, 157, 161, 173, 179];
function PairedVsIndependent() {
  const s = { sy: (v: number) => 220 - ((v - 100) / 90) * 180 };
  const xs = [80, 160, 320, 400];
  return (
    <Svg h={270} label="אותם 16 מספרים בשני ניסויים. משמאל — שתי קבוצות נפרדות: הפיזור בין הפרטים גדול וההבדל בין הקבוצות נבלע בו. מימין — אותם פרטים לפני ואחרי: כל קו עולה, וההפרש עקבי.">
      <He x={120} y={20} size={11} bold color={MUTED}>שתי קבוצות בלתי תלויות</He>
      <He x={360} y={20} size={11} bold color={TEAL}>מדגם מזווג: אותם פרטים</He>
      {PAIRED_BEFORE.map((v, i) => <circle key={`a${i}`} cx={xs[0] + ((i % 3) - 1) * 8} cy={s.sy(v)} r={4} fill={BLUE} fillOpacity={0.8} />)}
      {PAIRED_AFTER.map((v, i) => <circle key={`b${i}`} cx={xs[1] + ((i % 3) - 1) * 8} cy={s.sy(v)} r={4} fill={ORANGE} fillOpacity={0.8} />)}
      {PAIRED_BEFORE.map((v, i) => (
        <g key={`p${i}`}>
          <line x1={xs[2]} y1={s.sy(v)} x2={xs[3]} y2={s.sy(PAIRED_AFTER[i])} stroke={TEAL} strokeWidth={1.4} />
          <circle cx={xs[2]} cy={s.sy(v)} r={4} fill={BLUE} />
          <circle cx={xs[3]} cy={s.sy(PAIRED_AFTER[i])} r={4} fill={ORANGE} />
        </g>
      ))}
      <line x1={40} y1={222} x2={200} y2={222} stroke={INK} strokeWidth={1} />
      <line x1={280} y1={222} x2={440} y2={222} stroke={INK} strokeWidth={1} />
      <He x={xs[0]} y={240} size={10} color={BLUE}>ביקורת</He>
      <He x={xs[1]} y={240} size={10} color={ORANGE}>טיפול</He>
      <He x={xs[2]} y={240} size={10} color={BLUE}>לפני</He>
      <He x={xs[3]} y={240} size={10} color={ORANGE}>אחרי</He>
      <He x={240} y={262} size={10} color={MUTED}>הפרשי הזוגות: 6, 3, 6, 4, 7, 3, 7, 4 — הבדל עקבי שקשה לראות משמאל</He>
    </Svg>
  );
}

// ── bs-categorical ───────────────────────────────────────────────────────────
function ChiSquareDist() {
  const s = scale(40, 450, 190, 30, 0, 16, 0, 0.55);
  const crit = 7.815;
  return (
    <Svg h={236} label="התפלגות חי-בריבוע עם 1, 3 ו-6 דרגות חופש. ככל שדרגות החופש עולות היא זזה ימינה. לשלוש דרגות חופש, הערך הקריטי ברמת 5% הוא 7.81; השטח מימינו מוצלל.">
      <path d={fillArea((x) => chiPdf(x, 3), crit, 16, s)} fill={FILL.red} />
      <path d={curve((x) => chiPdf(x, 1), 0.4, 16, s, 300)} fill="none" stroke={ORANGE} strokeWidth={2} />
      <path d={curve((x) => chiPdf(x, 3), 0.01, 16, s, 300)} fill="none" stroke={BLUE} strokeWidth={2.2} />
      <path d={curve((x) => chiPdf(x, 6), 0.01, 16, s, 300)} fill="none" stroke={PURPLE} strokeWidth={2} />
      <line x1={s.sx(crit)} y1={70} x2={s.sx(crit)} y2={190} stroke={RED} strokeWidth={1.4} {...dash} />
      <La x={s.sx(crit) + 4} y={66} size={10} anchor="start" color={RED}>7.81</La>
      <La x={s.sx(0.55)} y={s.sy(0.5)} size={10.5} anchor="start" color={ORANGE} bold>df = 1</La>
      <La x={s.sx(2.2)} y={s.sy(0.27)} size={10.5} anchor="start" color={BLUE} bold>df = 3</La>
      <La x={s.sx(5.6)} y={s.sy(0.135) - 8} size={10.5} anchor="start" color={PURPLE} bold>df = 6</La>
      <La x={s.sx(12.5)} y={s.sy(0.06)} size={10} color={RED}>5% (df = 3)</La>
      <XAxis x0={40} x1={450} y={190} s={s} ticks={[[0, "0"], [4, "4"], [8, "8"], [12, "12"], [16, "16"]]} />
      <He x={245} y={226} size={10} color={MUTED}>ערכי χ² אינם שליליים; דוחים רק בזנב הימני</He>
    </Svg>
  );
}

function ContingencyTable() {
  // Observed and expected counts for the worked example (smoking × low birth weight style, kept generic).
  const obs = [[30, 70], [20, 130]];
  const rowT = obs.map((r) => r[0] + r[1]), colT = [obs[0][0] + obs[1][0], obs[0][1] + obs[1][1]], N = rowT[0] + rowT[1];
  const exp = obs.map((r, i) => r.map((_, j) => (rowT[i] * colT[j]) / N));
  const cell = (x: number, y: number, o: number, e: number) => (
    <g>
      <rect x={x} y={y} width={110} height={52} fill="#fff" stroke={MUTED} strokeWidth={1} />
      <La x={x + 55} y={y + 24} size={14} bold color={INK}>{o}</La>
      <He x={x + 55} y={y + 43} size={9.5} color={ORANGE}>{`צפוי ${fmt(e, 1)}`}</He>
    </g>
  );
  return (
    <Svg h={250} label={`טבלת שכיחויות 2×2: זן עמיד ורגיש מול מוות או הישרדות אחרי טיפול. בתאים — הנצפה, ומתחתיו הצפוי בהנחת אי-תלות (סכום השורה כפול סכום העמודה חלקי ${N}).`}>
      <He x={292} y={26} size={10.5} bold>מת</He>
      <He x={182} y={26} size={10.5} bold>שרד</He>
      <He x={86} y={26} size={10.5} bold color={MUTED}>סה״כ</He>
      <He x={404} y={68} size={10.5} bold>זן א</He>
      <He x={404} y={120} size={10.5} bold>זן ב</He>
      <He x={404} y={168} size={10.5} bold color={MUTED}>סה״כ</He>
      {cell(237, 40, obs[0][0], exp[0][0])}
      {cell(127, 40, obs[0][1], exp[0][1])}
      {cell(237, 92, obs[1][0], exp[1][0])}
      {cell(127, 92, obs[1][1], exp[1][1])}
      <La x={86} y={70} size={12} color={MUTED}>{rowT[0]}</La>
      <La x={86} y={122} size={12} color={MUTED}>{rowT[1]}</La>
      <La x={292} y={170} size={12} color={MUTED}>{colT[0]}</La>
      <La x={182} y={170} size={12} color={MUTED}>{colT[1]}</La>
      <La x={86} y={170} size={12} bold color={INK}>{N}</La>
      <rect x={40} y={190} width={400} height={48} rx={8} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.1} />
      <He x={240} y={209} size={10.5}>{`צפוי בתא (זן א, מת) = ${rowT[0]} × ${colT[0]} / ${N} = ${fmt(exp[0][0], 0)}`}</He>
      <He x={240} y={228} size={10} color={MUTED}>{`שיעור תמותה: זן א ${Math.round((100 * obs[0][0]) / rowT[0])}%, זן ב ${Math.round((100 * obs[1][0]) / rowT[1])}%`}</He>
    </Svg>
  );
}

// ── bs-correlation ───────────────────────────────────────────────────────────
function ScatterGallery() {
  const make = (seed: number, kind: "lin" | "curve" | "outlier", rho: number) => {
    const r = rng(seed), g = gauss(r);
    const x = Array.from({ length: 30 }, () => g());
    let y: number[];
    if (kind === "lin") y = x.map((xi) => rho * xi + Math.sqrt(1 - rho * rho) * g());
    else if (kind === "curve") y = x.map((xi) => xi * xi + 0.25 * g());
    else { y = x.map(() => g()); x[29] = 6; y[29] = 6; }
    return { x, y, r: pearson(x, y) };
  };
  const panels = [make(3, "lin", 0.9), make(5, "lin", 0.5), make(8, "lin", 0), make(13, "lin", -0.7), make(21, "curve", 0), make(34, "outlier", 0)];
  const titles = ["קשר חזק", "קשר בינוני", "אין קשר", "קשר שלילי", "קשר לא ליניארי", "נקודה חריגה אחת"];
  return (
    <Svg h={350} label={`שישה תרשימי פיזור עם מקדם המתאם של פירסון בכל אחד: ${panels.map((p, i) => `${titles[i]} r = ${fmt(p.r)}`).join("; ")}. בקשר מעוקל r קרוב לאפס אף שיש קשר חזק, ונקודה חריגה אחת יכולה ליצור r גבוה.`}>
      {panels.map((p, i) => {
        const cx = 10 + (2 - (i % 3)) * 156, cy = 4 + Math.floor(i / 3) * 172;
        const xs = p.x, ys = p.y;
        const s = scale(cx + 12, cx + 136, cy + 116, cy + 16, Math.min(...xs) - 0.3, Math.max(...xs) + 0.3, Math.min(...ys) - 0.3, Math.max(...ys) + 0.3);
        return (
          <g key={i}>
            <rect x={cx + 4} y={cy + 6} width={140} height={120} rx={6} fill="#fff" stroke={FILL.gray} strokeWidth={1.4} />
            {xs.map((xi, j) => <circle key={j} cx={s.sx(xi)} cy={s.sy(ys[j])} r={2.6} fill={i === 5 && j === 29 ? RED : BLUE} fillOpacity={0.85} />)}
            <He x={cx + 74} y={cy + 142} size={10} bold>{titles[i]}</He>
            <La x={cx + 74} y={cy + 158} size={10} color={MUTED}>{`r = ${fmt(p.r)}`}</La>
          </g>
        );
      })}
    </Svg>
  );
}

// ── bs-regression ────────────────────────────────────────────────────────────
// Temperature (°C) vs growth rate (divisions/hour) — the worked example's data.
export const REG_X = [18, 20, 22, 24, 26, 28, 30, 32];
export const REG_Y = [0.42, 0.55, 0.51, 0.68, 0.74, 0.71, 0.88, 0.93];
function fitLine(x: number[], y: number[]) {
  const mx = mean(x), my = mean(y);
  let sxy = 0, sxx = 0;
  x.forEach((xi, i) => { sxy += (xi - mx) * (y[i] - my); sxx += (xi - mx) ** 2; });
  const b = sxy / sxx;
  return { b, a: my - b * mx };
}
function RegressionResiduals() {
  const { a, b } = fitLine(REG_X, REG_Y);
  const s = scale(70, 450, 220, 30, 16, 34, 0.3, 1.0);
  const k = 5; // highlighted point (x = 28)
  const yhat = a + b * REG_X[k];
  return (
    <Svg h={276} label={`קו הרגרסיה ŷ = ${fmt(a, 3)} + ${fmt(b, 4)}x על נתוני קצב הגדילה מול טמפרטורה. הקווים האנכיים הם השאריות — המרחק של כל נקודה מהקו. שיטת הריבועים הפחותים בוחרת את הקו שסכום ריבועי השאריות שלו מינימלי.`}>
      {REG_X.map((xi, i) => <line key={i} x1={s.sx(xi)} y1={s.sy(REG_Y[i])} x2={s.sx(xi)} y2={s.sy(a + b * xi)} stroke={ORANGE} strokeWidth={1.5} />)}
      <line x1={s.sx(16.5)} y1={s.sy(a + b * 16.5)} x2={s.sx(33.5)} y2={s.sy(a + b * 33.5)} stroke={BLUE} strokeWidth={2.2} />
      {REG_X.map((xi, i) => <circle key={i} cx={s.sx(xi)} cy={s.sy(REG_Y[i])} r={4.2} fill={i === k ? RED : INK} />)}
      <line x1={70} y1={220} x2={458} y2={220} stroke={INK} strokeWidth={1.3} />
      <line x1={70} y1={220} x2={70} y2={26} stroke={INK} strokeWidth={1.3} />
      {[18, 22, 26, 30, 34].map((v) => <La key={v} x={s.sx(v)} y={236} size={10} color={MUTED}>{v}</La>)}
      {[0.4, 0.6, 0.8, 1.0].map((v) => <La key={v} x={62} y={s.sy(v) + 4} size={10} anchor="end" color={MUTED}>{v.toFixed(1)}</La>)}
      <He x={260} y={256} size={10.5} color={MUTED}>טמפרטורה (°C)</He>
      <He x={22} y={130} size={10.5} color={MUTED} rotate={-90}>קצב גדילה (חלוקות/שעה)</He>
      <He x={s.sx(28) + 8} y={s.sy(REG_Y[k]) + 18} size={10} anchor="start" color={RED}>{`שארית = ${fmt(REG_Y[k] - yhat, 3)}`}</He>
      <La x={s.sx(31)} y={s.sy(a + b * 31) - 26} size={11} anchor="end" color={BLUE} bold>{`ŷ = ${fmt(a, 3)} + ${fmt(b, 4)}x`}</La>
    </Svg>
  );
}

function ResidualPatterns() {
  const r = rng(77), g = gauss(r);
  const fitted = Array.from({ length: 40 }, (_, i) => i / 39);
  const sets = [
    { t: "תקין: פס אקראי", c: GREEN, y: fitted.map(() => 0.35 * g()) },
    { t: "משפך: שונות לא שווה", c: ORANGE, y: fitted.map((f) => (0.08 + 0.7 * f) * g()) },
    { t: "קשת: הקשר לא ליניארי", c: RED, y: fitted.map((f) => 2.2 * (f - 0.5) ** 2 - 0.18 + 0.08 * g()) },
  ];
  return (
    <Svg h={200} label="שלושה תרשימי שאריות מול ערכים חזויים. משמאל לימין בעברית: פס אקראי סביב אפס — ההנחות סבירות; צורת משפך — השונות גדלה עם הערך החזוי; צורת קשת — המודל הליניארי מחמיץ עקמומיות.">
      {sets.map((set, k) => {
        const x0 = 330 - k * 158;
        const s = scale(x0, x0 + 140, 150, 40, -0.05, 1.05, -1.2, 1.2);
        return (
          <g key={k}>
            <rect x={x0 - 4} y={34} width={148} height={122} rx={6} fill="#fff" stroke={FILL.gray} strokeWidth={1.4} />
            <line x1={x0} y1={s.sy(0)} x2={x0 + 140} y2={s.sy(0)} stroke={MUTED} strokeWidth={1} {...dash} />
            {fitted.map((f, i) => <circle key={i} cx={s.sx(f)} cy={s.sy(Math.max(-1.15, Math.min(1.15, set.y[i])))} r={2.4} fill={set.c} />)}
            <He x={x0 + 70} y={24} size={10} bold color={set.c}>{set.t}</He>
          </g>
        );
      })}
      <He x={240} y={180} size={10} color={MUTED}>ציר אופקי: ערך חזוי ŷ · ציר אנכי: שארית · הקו המקווקו: אפס</He>
    </Svg>
  );
}

// ── bs-anova ─────────────────────────────────────────────────────────────────
export const ANOVA_GROUPS = [[12, 14, 11, 13, 15], [16, 18, 17, 15, 19], [13, 15, 16, 14, 12]];
function AnovaPartition() {
  const gm = mean(ANOVA_GROUPS.flat());
  const s = { sy: (v: number) => 210 - ((v - 9) / 12) * 180 };
  const xs = [380, 240, 100];
  const names = ["דשן א", "דשן ב", "ביקורת"];
  const cols = [BLUE, ORANGE, PURPLE];
  return (
    <Svg h={262} label={`שלוש קבוצות של חמישה צמחים. הקו המקווקו הוא הממוצע הכללי ${fmt(gm, 1)}. הקווים הקצרים הם ממוצעי הקבוצות 13, 17 ו-14. השונות בין הקבוצות היא מרחק ממוצעי הקבוצות מהממוצע הכללי; השונות בתוך הקבוצות היא פיזור הצמחים סביב ממוצע הקבוצה שלהם.`}>
      <line x1={30} y1={s.sy(gm)} x2={450} y2={s.sy(gm)} stroke={INK} strokeWidth={1.2} {...dash} />
      <He x={170} y={s.sy(gm) - 7} size={10} color={INK}>{`ממוצע כללי ${fmt(gm, 1)}`}</He>
      {ANOVA_GROUPS.map((g, k) => {
        const m = mean(g);
        return (
          <g key={k}>
            {g.map((v, i) => <circle key={i} cx={xs[k] - 24 + i * 12} cy={s.sy(v)} r={4.2} fill={cols[k]} fillOpacity={0.85} />)}
            <line x1={xs[k] - 36} y1={s.sy(m)} x2={xs[k] + 36} y2={s.sy(m)} stroke={cols[k]} strokeWidth={2.6} />
            <He x={xs[k]} y={232} size={10.5} bold color={cols[k]}>{names[k]}</He>
            <La x={xs[k] + 40} y={s.sy(m) + 4} size={10} anchor="start" color={cols[k]}>{fmt(m, 0)}</La>
          </g>
        );
      })}
      <Arrow x1={xs[1] + 52} y1={s.sy(gm)} x2={xs[1] + 52} y2={s.sy(17) + 3} color={GREEN} width={1.6} />
      <He x={xs[1] + 58} y={s.sy(16) + 2} size={9.5} anchor="start" color={GREEN}>בין</He>
      <Arrow x1={xs[0] - 50} y1={s.sy(13)} x2={xs[0] - 50} y2={s.sy(11) - 3} color={RED} width={1.6} />
      <He x={xs[0] - 56} y={s.sy(12)} size={9.5} anchor="end" color={RED}>בתוך</He>
      <He x={240} y={254} size={10} color={MUTED}>גובה צמח (ס״מ) · F = שונות בין הקבוצות / שונות בתוך הקבוצות</He>
    </Svg>
  );
}

function FDist() {
  const d1 = 2, d2 = 12, crit = 3.885;
  const f = (x: number) => fPdf(x, d1, d2);
  const s = scale(40, 450, 180, 30, 0, 10, 0, 1.0);
  const fObs = 26 / 3; // the worked example: MSB 21.67 / MSW 2.5
  const p = area(f, fObs, 60, 2000);
  return (
    <Svg h={226} label={`התפלגות F עם 2 ו-12 דרגות חופש. הערך הקריטי ברמת 5% הוא 3.89. סטטיסטי F נצפה 8.67 נמצא מעבר לו, וערך p כ-${fmt(p, 3)}.`}>
      <path d={fillArea(f, crit, 10, s)} fill={FILL.red} />
      <path d={curve(f, 0.001, 10, s, 300)} fill="none" stroke={BLUE} strokeWidth={2.2} />
      <line x1={s.sx(crit)} y1={70} x2={s.sx(crit)} y2={180} stroke={RED} strokeWidth={1.3} {...dash} />
      <La x={s.sx(crit)} y={64} size={10} color={RED}>3.89</La>
      <line x1={s.sx(fObs)} y1={100} x2={s.sx(fObs)} y2={180} stroke={INK} strokeWidth={1.8} />
      <He x={s.sx(fObs)} y={92} size={10} color={INK} bold>F נצפה 8.67</He>
      <La x={s.sx(1.1)} y={s.sy(0.62)} size={10.5} anchor="start" color={BLUE} bold>F(2, 12)</La>
      <La x={s.sx(5.2)} y={s.sy(0.03) - 10} size={10} color={RED}>5%</La>
      <XAxis x0={40} x1={450} y={180} s={s} ticks={[[0, "0"], [2, "2"], [4, "4"], [6, "6"], [8, "8"], [10, "10"]]} />
      <He x={245} y={216} size={10} color={MUTED}>{`השטח מימין ל-8.67: p ≈ ${fmt(p, 3)}`}</He>
    </Svg>
  );
}

export const STATS_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "bs-variable-types": { el: VariableTypes, captionHe: "סוג המשתנה קובע איזה תיאור ואיזה מבחן מתאימים. משתנה סודר נשאר קטגורי גם כשמקודדים אותו במספרים." },
  "bs-distribution-shapes": { el: DistributionShapes, captionHe: "באסימטריה הממוצע נמשך לכיוון הזנב, והחציון נשאר קרוב למרכז רוב התצפיות. מחושב מהתפלגויות מוגדרות." },
  "bs-boxplot": { el: Boxplot, captionHe: "תרשים קופסה של 15 עלים. הרבעונים חושבו בשיטת האינטרפולציה הליניארית; תוכנות שונות (וגם SPSS) עשויות לתת רבעונים מעט שונים. ערך מסומן כחריג — סימן לבדוק אותו, לא למחוק אותו." },
  "bs-same-mean-different-sd": { el: SameMeanDifferentSd, captionHe: "שתי קבוצות עם אותו ממוצע ופיזור שונה מאוד. נתונים מדומים." },
  "bs-test-tree": { el: TestTree, captionHe: "הסתברות מותנית בעץ: P(חולה | חיובי) שונה מאוד מ-P(חיובי | חולה). מספרים להמחשה." },
  "bs-binomial-pmf": { el: BinomialPmf, captionHe: "התפלגות בינומית: אותו n, הסתברות הצלחה שונה. מחושב מנוסחת ההתפלגות." },
  "bs-normal-rule": { el: NormalRule, captionHe: "כלל 68–95–99.7 בהתפלגות הנורמלית. מחושב." },
  "bs-clt": { el: Clt, captionHe: "התפלגות הממוצע של n תצפיות מהתפלגות מעריכית. המשפט עוסק בהתפלגות הממוצע — לא בהתפלגות התצפיות עצמן. מחושב." },
  "bs-ci-coverage": { el: CiCoverage, captionHe: "הדמיה: 25 רווחי סמך של 95% (מבחן t, n = 10). בטווח הארוך כ-95% מהרווחים כוללים את μ; במדגם אחד לא יודעים אם הוא מהם." },
  "bs-t-vs-normal": { el: TvsNormal, captionHe: "התפלגות t לעומת Z. מחושב." },
  "bs-pvalue": { el: PValue, captionHe: "ערך p במבחן t דו-צדדי: ההסתברות לקבל תוצאה קיצונית לפחות כמו שנצפתה, אם H₀ נכונה. מחושב." },
  "bs-error-types": { el: ErrorTypes, captionHe: "טעות מסוג ראשון ושני במבחן חד-צדדי. מחושב עבור הפרש של 2.5 שגיאות תקן." },
  "bs-paired": { el: PairedVsIndependent, captionHe: "מדגם מזווג מסלק את ההבדלים בין הפרטים. אותם מספרים בשני הצדדים." },
  "bs-chi-square-dist": { el: ChiSquareDist, captionHe: "התפלגות χ². מחושב." },
  "bs-contingency": { el: ContingencyTable, captionHe: "נצפה וצפוי בטבלת 2×2. הצפוי מחושב מהשוליים בלבד — כאילו אין קשר בין השורות לעמודות." },
  "bs-scatter-r": { el: ScatterGallery, captionHe: "מקדם המתאם של פירסון מודד קשר ליניארי בלבד — תמיד מסתכלים על התרשים. נתונים מדומים; r חושב מהנקודות המוצגות." },
  "bs-regression-residuals": { el: RegressionResiduals, captionHe: "קו הריבועים הפחותים והשאריות, לנתוני התרגיל הפתור. מחושב." },
  "bs-residual-patterns": { el: ResidualPatterns, captionHe: "תרשימי שאריות: פס אקראי, משפך וקשת. נתונים מדומים." },
  "bs-anova-partition": { el: AnovaPartition, captionHe: "פירוק השונות בניתוח שונות חד-גורמי, לנתוני התרגיל הפתור." },
  "bs-f-dist": { el: FDist, captionHe: "התפלגות F עם 2 ו-12 דרגות חופש. מחושב." },
};
