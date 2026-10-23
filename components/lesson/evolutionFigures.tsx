/* Figures for the evolution units (Technion 134133). Original drawings; graphs are computed from the models they
   illustrate (selection recursions, binomial drift with a fixed seed, Kimura's fixation probability, a logistic cline).
   Layout conventions follow Herron & Freeman, Evolutionary Analysis, and Barton et al., Evolution — never copied.
   Labels sit beside or above lines, never on them. Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, Axes, BLUE, GREEN, INK, MUTED, ORANGE, He, La, curve, dash, scale } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

const PURPLE = "#7c3aed";
const RED = "#b91c1c";
const TEAL = "#0f766e";
const FILL = { blue: "#dbeafe", green: "#dcfce7", orange: "#ffedd5", purple: "#ede9fe", yellow: "#fef3c7", gray: "#f1f5f9", red: "#fee2e2", sky: "#e0f2fe", teal: "#ccfbf1", cyto: "#fff7ed" };

const Svg = ({ w = 480, h, label, children }: { w?: number; h: number; label: string; children: React.ReactNode }) => (
  <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label={label}>
    <ArrowDefs />
    {children}
  </svg>
);
const Lead = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={1} />;
// Deterministic PRNG so the drift figure is identical on every render.
const rng = (seed: number) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const path = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");

// ── ev-tree-reading ──────────────────────────────────────────────────────────
function TreeReading() {
  const tips: [string, number][] = [["דג", 40], ["צפרדע", 90], ["עכבר", 140], ["לטאה", 190], ["ציפור", 240]];
  const TX = 330;
  const n1 = { x: 280, y: 215 }, n2 = { x: 230, y: 177.5 }, n3 = { x: 170, y: 133.75 }, r = { x: 100, y: 86.9 };
  const L = (x1: number, y1: number, x2: number, y2: number) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={2} />;
  return (
    <Svg h={290} label="עץ פילוגנטי של חמישה בעלי חוליות: הדג מתפצל ראשון, אחריו הצפרדע, אחריו העכבר, והלטאה והציפור הן קבוצות אחיות. הצמתים הם אבות קדמונים משותפים.">
      {L(50, r.y, r.x, r.y)}
      {L(r.x, tips[0][1], r.x, n3.y)}{L(r.x, tips[0][1], TX, tips[0][1])}{L(r.x, n3.y, n3.x, n3.y)}
      {L(n3.x, tips[1][1], n3.x, n2.y)}{L(n3.x, tips[1][1], TX, tips[1][1])}{L(n3.x, n2.y, n2.x, n2.y)}
      {L(n2.x, tips[2][1], n2.x, n1.y)}{L(n2.x, tips[2][1], TX, tips[2][1])}{L(n2.x, n1.y, n1.x, n1.y)}
      {L(n1.x, tips[3][1], n1.x, tips[4][1])}{L(n1.x, tips[3][1], TX, tips[3][1])}{L(n1.x, tips[4][1], TX, tips[4][1])}
      {tips.map(([t, y]) => <He key={t} x={TX + 8} y={y + 5} size={13} bold anchor="start">{t}</He>)}
      <circle cx={n1.x} cy={n1.y} r={5} fill={ORANGE} />
      <He x={150} y={266} size={10.5} color={ORANGE}>צומת — אב קדמון משותף</He>
      <Lead x1={214} y1={258} x2={276} y2={219} />
      <path d="M400 186 L406 186 L406 244 L400 244" fill="none" stroke={PURPLE} strokeWidth={1.4} />
      <He x={442} y={219} size={10} color={PURPLE}>קבוצות אחיות</He>
      <He x={74} y={106} size={10} color={MUTED}>שורש</He>
      <He x={240} y={20} size={10.5} color={MUTED}>אפשר לסובב כל צומת — העץ נשאר אותו עץ</He>
    </Svg>
  );
}

// ── ev-limb-homology ─────────────────────────────────────────────────────────
type Limb = { x: number; name: string; h1: number; h2: number; dl: number; spread: number; w?: number; skin?: "wing" | "flipper" };
function LimbHomology() {
  const C = { hum: ORANGE, rad: BLUE, car: GREEN, dig: PURPLE };
  const limbs: Limb[] = [
    { x: 420, name: "אדם", h1: 58, h2: 50, dl: 30, spread: 26 },
    { x: 300, name: "עטלף", h1: 38, h2: 52, dl: 62, spread: 74, skin: "wing" },
    { x: 180, name: "לווייתן", h1: 20, h2: 22, dl: 52, spread: 18, w: 14, skin: "flipper" },
    { x: 60, name: "חתול", h1: 50, h2: 48, dl: 14, spread: 16 },
  ];
  return (
    <Svg h={262} label="הגפה הקדמית של אדם, עטלף, לווייתן וחתול: אותן עצמות באותו סדר — עצם אחת בזרוע (כתום), שתיים באמה (כחול), שורש כף היד (ירוק) ואצבעות (סגול) — בפרופורציות שונות לפי התפקיד.">
      {limbs.map((l) => {
        const y0 = 24, w = l.w ?? 9, y1 = y0 + l.h1 + 4, y2 = y1 + l.h2 + 2, cy = y2 + 8;
        const digits = [-2, -1, 0, 1, 2].map((k) => {
          const a = ((k * l.spread) / 2) * (Math.PI / 180);
          return [l.x + Math.sin(a) * l.dl, cy + 8 + Math.cos(a) * l.dl] as [number, number];
        });
        return (
          <g key={l.name}>
            {l.skin === "wing" && <polygon points={[[l.x - 6, cy], ...digits, [l.x + 6, cy]].map((p) => p.join(",")).join(" ")} fill="#e2e8f0" stroke="none" />}
            {l.skin === "flipper" && <ellipse cx={l.x} cy={cy + 26} rx={22} ry={40} fill="#e2e8f0" stroke="none" />}
            <rect x={l.x - w / 2} y={y0} width={w} height={l.h1} rx={4} fill={C.hum} />
            <rect x={l.x - w / 2 - 1} y={y1} width={w / 2} height={l.h2} rx={3} fill={C.rad} />
            <rect x={l.x + 1} y={y1} width={w / 2} height={l.h2} rx={3} fill={C.rad} />
            {[-6, 0, 6].map((d) => <circle key={d} cx={l.x + d} cy={cy} r={3.4} fill={C.car} />)}
            {digits.map(([x, y], i) => <line key={i} x1={l.x + (i - 2) * 2.5} y1={cy + 5} x2={x} y2={y} stroke={C.dig} strokeWidth={3} strokeLinecap="round" />)}
            <He x={l.x} y={214} size={12.5} bold>{l.name}</He>
          </g>
        );
      })}
      {([[430, "עצם הזרוע", C.hum], [320, "שתי עצמות האמה", C.rad], [200, "שורש כף היד", C.car], [85, "אצבעות", C.dig]] as [number, string, string][]).map(([x, t, c]) => (
        <g key={t}>
          <rect x={x + 4} y={236} width={10} height={10} fill={c} />
          <He x={x} y={245} size={10.5} anchor="end">{t}</He>
        </g>
      ))}
    </Svg>
  );
}

// ── ev-hgt ───────────────────────────────────────────────────────────────────
const Cell = ({ x, y, rx = 34, ry = 20, c = BLUE, f = FILL.blue }: { x: number; y: number; rx?: number; ry?: number; c?: string; f?: string }) => <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={f} stroke={c} strokeWidth={1.6} />;
function Hgt() {
  return (
    <Svg h={210} label="שלושה מנגנונים של העברה אופקית של גנים בפרוקריוטים: התמרה — קליטת DNA חופשי מהסביבה; טרנסדוקציה — פאג' מעביר DNA של מאכסן אחד למאכסן הבא; הצמדה — העברת פלסמיד דרך פילוס במגע ישיר.">
      {([[400, "התמרה"], [240, "טרנסדוקציה"], [80, "הצמדה"]] as [number, string][]).map(([x, t]) => <He key={t} x={x} y={22} size={12.5} bold>{t}</He>)}
      <line x1={160} y1={30} x2={160} y2={200} stroke="#e2e8f0" />
      <line x1={320} y1={30} x2={320} y2={200} stroke="#e2e8f0" />

      <path d="M352 62 c6 -6 12 6 18 0 s12 6 18 0" fill="none" stroke={RED} strokeWidth={2.2} />
      <He x={370} y={50} size={9.5} color={RED}>DNA חופשי</He>
      <Arrow x1={386} y1={70} x2={398} y2={100} color={INK} />
      <Cell x={410} y={124} />
      <path d="M396 124 c5 -5 10 5 15 0 s10 5 15 0" fill="none" stroke={RED} strokeWidth={2} />
      <He x={400} y={172} size={10} color={MUTED}>קולט DNA מתא שמת</He>

      <Cell x={200} y={78} rx={28} ry={16} c={ORANGE} f={FILL.orange} />
      <He x={200} y={50} size={9.5} color={ORANGE}>מאכסן 1</He>
      <polygon points="246,96 256,90 266,96 266,108 256,114 246,108" fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <path d="M251 102 c3 -3 6 3 9 0" fill="none" stroke={ORANGE} strokeWidth={1.8} />
      <line x1={256} y1={114} x2={256} y2={126} stroke={PURPLE} strokeWidth={2} />
      <Arrow x1={226} y1={84} x2={244} y2={94} color={MUTED} />
      <Arrow x1={262} y1={126} x2={276} y2={140} color={MUTED} />
      <Cell x={282} y={156} rx={28} ry={16} />
      <He x={262} y={190} size={10} color={MUTED}>הפאג' מעביר DNA</He>

      <Cell x={46} y={110} rx={28} ry={18} c={GREEN} f={FILL.green} />
      <Cell x={124} y={110} rx={28} ry={18} />
      <line x1={74} y1={110} x2={96} y2={110} stroke={INK} strokeWidth={3} />
      <circle cx={40} cy={110} r={8} fill="none" stroke={PURPLE} strokeWidth={2} />
      <circle cx={130} cy={110} r={8} fill="none" stroke={PURPLE} strokeWidth={2} strokeDasharray="3 3" />
      <He x={85} y={86} size={9.5} color={MUTED}>פילוס</He>
      <He x={80} y={150} size={10} color={PURPLE}>פלסמיד מועבר</He>
      <He x={80} y={172} size={10} color={MUTED}>במגע ישיר בין תאים</He>
    </Svg>
  );
}

// ── ev-endosymbiosis ─────────────────────────────────────────────────────────
const Mito = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g>
    <ellipse cx={x} cy={y} rx={13 * s} ry={7 * s} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.2} />
    <path d={`M${x - 9 * s} ${y} l3 -4 l3 8 l3 -8 l3 8 l3 -4`} fill="none" stroke={ORANGE} strokeWidth={0.9} />
  </g>
);
const Chloro = ({ x, y, rings = 2 }: { x: number; y: number; rings?: number }) => (
  <g>
    {Array.from({ length: rings }, (_, i) => <ellipse key={i} cx={x} cy={y} rx={16 + i * 3.5} ry={9 + i * 3.5} fill={i === 0 ? FILL.green : "none"} stroke={GREEN} strokeWidth={1.1} />)}
    {[-7, 0, 7].map((d) => <rect key={d} x={x + d - 2} y={y - 5} width={4} height={10} fill={GREEN} opacity={0.6} />)}
  </g>
);
function Endosymbiosis() {
  const X = [410, 290, 170, 50];
  return (
    <Svg h={230} label="אנדוסימביוזה: תא מאכסן ארכאי בולע α-פרוטאובקטריה, שהופכת למיטוכונדריון. אאוקריוט כזה בולע ציאנובקטריה, שהופכת לכלורופלסט עם שתי ממברנות — אצה. באנדוסימביוזה משנית אאוקריוט בולע אצה, ונוצר כלורופלסט עם שלוש או ארבע ממברנות ולפעמים שריד של גרעין האצה (נוקלאומורף).">
      <circle cx={X[0]} cy={90} r={42} fill={FILL.sky} stroke={TEAL} strokeWidth={1.8} />
      <ellipse cx={X[0] + 10} cy={84} rx={14} ry={8} fill={FILL.red} stroke={RED} strokeWidth={1.4} />
      <circle cx={X[1]} cy={90} r={42} fill={FILL.cyto} stroke={MUTED} strokeWidth={1.8} />
      <circle cx={X[1] - 12} cy={86} r={13} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <Mito x={X[1] + 18} y={104} /><Mito x={X[1] + 14} y={68} s={0.8} />
      <ellipse cx={X[1] + 30} cy={40} rx={14} ry={7} fill={FILL.teal} stroke={TEAL} strokeWidth={1.4} />
      <circle cx={X[2]} cy={90} r={42} fill={FILL.cyto} stroke={MUTED} strokeWidth={1.8} />
      <circle cx={X[2] - 14} cy={98} r={11} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <Mito x={X[2] + 16} y={112} s={0.8} />
      <Chloro x={X[2] + 8} y={74} />
      <circle cx={X[3]} cy={90} r={42} fill={FILL.cyto} stroke={MUTED} strokeWidth={1.8} />
      <circle cx={X[3] - 18} cy={104} r={10} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <Chloro x={X[3] + 6} y={76} rings={4} />
      <circle cx={X[3] + 26} cy={68} r={3} fill={PURPLE} />
      {[0, 1, 2].map((i) => <Arrow key={i} x1={X[i] - 46} y1={90} x2={X[i + 1] + 46} y2={90} width={2} />)}
      {([[0, "מאכסן ארכאי בולע", "α-פרוטאובקטריה"], [1, "אאוקריוט עם מיטוכונדריון;", "בולע ציאנובקטריה"], [2, "אצה: כלורופלסט", "עם 2 ממברנות"], [3, "אאוקריוט בולע אצה:", "3–4 ממברנות"]] as [number, string, string][]).map(([i, a, b]) => (
        <g key={i}>
          <He x={X[i]} y={154} size={10.5}>{a}</He>
          <He x={X[i]} y={170} size={10.5}>{b}</He>
        </g>
      ))}
      <He x={X[0]} y={200} size={10} color={RED}>אדום — החיידק שנבלע</He>
      <He x={X[1] + 6} y={22} size={10} color={TEAL}>ציאנובקטריה</He>
      <He x={X[3] + 40} y={32} size={10} color={PURPLE}>נוקלאומורף</He>
      <Lead x1={X[3] + 36} y1={38} x2={X[3] + 28} y2={64} />
      <He x={240} y={222} size={10} color={MUTED}>ראשונית → צמחים, אצות ירוקות ואדומות; משנית → דיאטומאות, אצות חומות, אוגלנה</He>
    </Svg>
  );
}

// ── ev-animal-tree ───────────────────────────────────────────────────────────
function AnimalTree() {
  const tips: [string, number][] = [["כוריאנופלגלטים", 30], ["ספוגים", 60], ["צורבים", 90], ["פרוקי רגליים", 125], ["רכיכות", 155], ["תולעים טבעתיות", 185], ["קווצי עור", 220], ["מיתרניים (ואנחנו)", 250]];
  const TX = 320;
  const Y = Object.fromEntries(tips) as Record<string, number>;
  const lo = { x: 290, y: 170 }, pr = { x: 255, y: 147.5 }, de = { x: 275, y: 235 }, bi = { x: 205, y: 191.25 }, eu = { x: 155, y: 140.6 }, me = { x: 105, y: 100.3 }, ro = { x: 55, y: 65 };
  const L = (x1: number, y1: number, x2: number, y2: number, c = INK) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={2} />;
  const node = (n: { x: number; y: number }, a: [number, number], b: [number, number]) => (
    <g>{L(n.x, a[1], n.x, b[1])}{L(n.x, a[1], a[0], a[1])}{L(n.x, b[1], b[0], b[1])}</g>
  );
  const tick = (x: number, y: number) => <line x1={x} y1={y - 5} x2={x} y2={y + 5} stroke={RED} strokeWidth={2.4} />;
  return (
    <Svg h={275} label="עץ פשוט של בעלי החיים: כוריאנופלגלטים כקבוצת חוץ, ספוגים, צורבים, ובעלי סימטריה דו-צדדית שמתחלקים לפרוטוסטומים (פרוקי רגליים, רכיכות, תולעים טבעתיות) ולדאוטרוסטומים (קווצי עור ומיתרניים). מסומנים חידושים: רב-תאיות, רקמות, סימטריה דו-צדדית.">
      {L(30, ro.y, ro.x, ro.y)}
      {node(ro, [TX, Y["כוריאנופלגלטים"]], [me.x, me.y])}
      {node(me, [TX, Y["ספוגים"]], [eu.x, eu.y])}
      {node(eu, [TX, Y["צורבים"]], [bi.x, bi.y])}
      {node(bi, [pr.x, pr.y], [de.x, de.y])}
      {node(pr, [TX, Y["פרוקי רגליים"]], [lo.x, lo.y])}
      {node(lo, [TX, Y["רכיכות"]], [TX, Y["תולעים טבעתיות"]])}
      {node(de, [TX, Y["קווצי עור"]], [TX, Y["מיתרניים (ואנחנו)"]])}
      {tips.map(([t, y]) => <He key={t} x={TX + 6} y={y + 4} size={11} anchor="start">{t}</He>)}
      {tick(80, me.y)}{tick(130, eu.y)}{tick(180, bi.y)}
      <He x={84} y={me.y - 9} size={9.5} color={RED}>רב-תאיות</He>
      <He x={130} y={eu.y - 9} size={9.5} color={RED}>רקמות</He>
      <He x={180} y={bi.y + 18} size={9.5} color={RED}>דו-צדדיות</He>
      <path d="M432 119 L438 119 L438 191 L432 191" fill="none" stroke={BLUE} strokeWidth={1.4} />
      <He x={458} y={155} size={10} color={BLUE} rotate={-90}>פרוטוסטומים</He>
      <path d="M432 214 L438 214 L438 256 L432 256" fill="none" stroke={GREEN} strokeWidth={1.4} />
      <He x={458} y={235} size={10} color={GREEN} rotate={-90}>דאוטרוסטומים</He>
    </Svg>
  );
}

// ── ev-hominin-timeline ──────────────────────────────────────────────────────
function HomininTimeline() {
  const X = (ma: number) => 60 + ((7 - ma) / 7) * 400;
  const rows: [string, number, number, string][] = [
    ["Sahelanthropus", 7.0, 6.8, "#64748b"],
    ["Ardipithecus", 5.8, 4.4, "#a16207"],
    ["Australopithecus afarensis (לוסי)", 3.9, 2.9, ORANGE],
    ["Homo habilis", 2.4, 1.6, GREEN],
    ["Homo erectus — יוצא מאפריקה", 1.9, 0.11, TEAL],
    ["ניאנדרטלים", 0.4, 0.04, BLUE],
    ["Homo sapiens", 0.3, 0, PURPLE],
  ];
  return (
    <Svg h={262} label="ציר זמן של הומינינים, במיליוני שנים לפני היום: Sahelanthropus (כ-7), Ardipithecus (5.8–4.4), Australopithecus afarensis (3.9–2.9), Homo habilis (2.4–1.6), Homo erectus (1.9–0.1, הראשון שיצא מאפריקה), ניאנדרטלים (0.4–0.04), Homo sapiens (0.3–היום). לעתים חיו כמה מינים בו זמנית.">
      {rows.map(([t, a, b, c], i) => {
        const y = 30 + i * 26, x1 = X(a), x2 = Math.max(X(b), x1 + 4);
        const right = x2 < 300;
        return (
          <g key={t}>
            <rect x={x1} y={y - 7} width={x2 - x1} height={12} rx={4} fill={c} opacity={0.85} />
            {right ? <La x={x2 + 6} y={y + 3} size={11} anchor="start" color={c}>{t}</La> : <La x={x1 - 6} y={y + 3} size={11} anchor="end" color={c}>{t}</La>}
          </g>
        );
      })}
      <line x1={60} y1={214} x2={460} y2={214} stroke={INK} strokeWidth={1.4} />
      {[7, 6, 5, 4, 3, 2, 1, 0].map((m) => (
        <g key={m}>
          <line x1={X(m)} y1={214} x2={X(m)} y2={219} stroke={INK} />
          <La x={X(m)} y={232} size={11} color={MUTED}>{m}</La>
        </g>
      ))}
      <He x={260} y={252} size={10.5} color={MUTED}>מיליוני שנים לפני היום</He>
    </Svg>
  );
}

// ── ev-selection-trajectories ────────────────────────────────────────────────
function SelectionTrajectories() {
  const s = scale(60, 460, 230, 30, 0, 1000, 0, 1);
  const run = (wAA: number, wAa: number, waa: number) => {
    let p = 0.01; const pts: [number, number][] = [];
    for (let t = 0; t <= 1000; t++) {
      pts.push([s.sx(t), s.sy(p)]);
      const q = 1 - p, w = p * p * wAA + 2 * p * q * wAa + q * q * waa;
      p = (p * p * wAA + p * q * wAa) / w;
    }
    return path(pts);
  };
  return (
    <Svg h={290} label="תדירות של אלל מועיל לאורך 1,000 דורות, מתדירות התחלתית של 1% ויתרון של 5% להומוזיגוט. אלל דומיננטי מתפשט מהר בהתחלה ומאט ליד הקיבוע; אלל רצסיבי כמעט לא משתנה כשהוא נדיר; אלל עם השפעה מצטברת — בצורת S.">
      <Axes x0={60} y0={230} x1={460} y1={30}
        xLabel={<He x={260} y={276} size={12}>דורות</He>}
        yLabel={<He x={64} y={22} size={12} anchor="start">תדירות האלל המועיל (p)</He>} />
      {[0, 0.5, 1].map((v) => <La key={v} x={52} y={s.sy(v) + 4} size={11} anchor="end" color={MUTED}>{v}</La>)}
      {[0, 250, 500, 750, 1000].map((v) => <La key={v} x={s.sx(v)} y={248} size={11} color={MUTED}>{v}</La>)}
      <path d={run(1.05, 1.05, 1)} fill="none" stroke={ORANGE} strokeWidth={2.6} />
      <path d={run(1.05, 1.025, 1)} fill="none" stroke={BLUE} strokeWidth={2.6} />
      <path d={run(1.05, 1, 1)} fill="none" stroke={PURPLE} strokeWidth={2.6} />
      <He x={102} y={64} size={11} bold color={ORANGE}>דומיננטי</He>
      <He x={330} y={100} size={11} bold color={BLUE}>מצטבר</He>
      <He x={360} y={198} size={11} bold color={PURPLE}>רצסיבי</He>
    </Svg>
  );
}

// ── ev-selection-modes ───────────────────────────────────────────────────────
function SelectionModes() {
  const g = (x: number, m: number, sd: number) => Math.exp(-((x - m) ** 2) / (2 * sd * sd));
  const panel = (x0: number, title: string, after: (x: number) => number, c: string, note: string) => {
    const s = scale(x0, x0 + 130, 170, 50, -3.5, 3.5, 0, 1.25);
    return (
      <g key={title}>
        <He x={x0 + 65} y={28} size={12.5} bold color={c}>{title}</He>
        <line x1={x0} y1={170} x2={x0 + 130} y2={170} stroke={INK} strokeWidth={1.2} />
        <path d={curve((x) => g(x, 0, 1), -3.5, 3.5, s)} fill="none" stroke={MUTED} strokeWidth={1.8} {...dash} />
        <path d={curve(after, -3.5, 3.5, s)} fill="none" stroke={c} strokeWidth={2.6} />
        <He x={x0 + 65} y={192} size={10} color={MUTED}>{note}</He>
      </g>
    );
  };
  return (
    <Svg h={240} label="שלושה סוגי ברירה על תכונה כמותית (מקווקו — לפני הברירה; צבעוני — אחריה). מכוונת: הממוצע זז. מייצבת: הממוצע נשאר והפיזור קטן. מפצלת: שני הקצוות מועדפים וההתפלגות מתפצלת.">
      {panel(330, "מכוונת", (x) => g(x, 0.9, 0.95), BLUE, "הממוצע זז")}
      {panel(175, "מייצבת", (x) => 1.18 * g(x, 0, 0.6), GREEN, "הפיזור קטן")}
      {panel(20, "מפצלת", (x) => 0.75 * (g(x, -1.25, 0.7) + g(x, 1.25, 0.7)), ORANGE, "שני הקצוות מועדפים")}
      <He x={240} y={222} size={10.5} color={MUTED}>מקווקו — לפני הברירה; קו צבעוני — אחרי</He>
    </Svg>
  );
}

// ── ev-drift-sims ────────────────────────────────────────────────────────────
function DriftSims() {
  const G = 60;
  const sim = (N: number, seed: number) => {
    const r = rng(seed); let p = 0.5; const ps = [p];
    for (let t = 1; t <= G; t++) { let k = 0; for (let i = 0; i < 2 * N; i++) if (r() < p) k++; p = k / (2 * N); ps.push(p); }
    return ps;
  };
  const colors = [BLUE, ORANGE, GREEN, PURPLE, RED, TEAL, "#a16207", "#be185d"];
  const panel = (x0: number, N: number, title: string) => {
    const s = scale(x0, x0 + 180, 200, 40, 0, G, 0, 1);
    return (
      <g key={N}>
        <He x={x0 + 90} y={22} size={12.5} bold>{title}</He>
        <line x1={x0} y1={200} x2={x0 + 180} y2={200} stroke={INK} strokeWidth={1.2} />
        <line x1={x0} y1={200} x2={x0} y2={40} stroke={INK} strokeWidth={1.2} />
        {[0, 0.5, 1].map((v) => <La key={v} x={x0 - 6} y={s.sy(v) + 4} size={10} anchor="end" color={MUTED}>{v}</La>)}
        <La x={x0 + 180} y={216} size={10} color={MUTED}>{G}</La>
        <La x={x0} y={216} size={10} color={MUTED}>0</La>
        {colors.map((c, i) => <path key={i} d={path(sim(N, 11 + i * 7 + N).map((p, t) => [s.sx(t), s.sy(p)]))} fill="none" stroke={c} strokeWidth={1.5} opacity={0.9} />)}
      </g>
    );
  };
  return (
    <Svg h={250} label="סימולציה של סחף גנטי: שמונה אוכלוסיות שמתחילות בתדירות 0.5, לאורך 60 דורות, בלי ברירה. באוכלוסיות של 10 פרטים התדירויות קופצות, ורבות מקבעות או מאבדות את האלל; באוכלוסיות של 200 פרטים הן משתנות לאט.">
      {panel(270, 10, "N = 10")}
      {panel(40, 200, "N = 200")}
      <He x={240} y={240} size={10.5} color={MUTED}>תדירות אלל לאורך 60 דורות, 8 אוכלוסיות בכל גודל, בלי ברירה</He>
    </Svg>
  );
}

// ── ev-fst-islands ───────────────────────────────────────────────────────────
const Pie = ({ x, y, r, p }: { x: number; y: number; r: number; p: number }) => {
  const a = p * 2 * Math.PI, x2 = x + r * Math.sin(a), y2 = y - r * Math.cos(a);
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={FILL.orange} stroke={MUTED} strokeWidth={1} />
      {p > 0.999 ? <circle cx={x} cy={y} r={r} fill={BLUE} /> : p > 0.001 && <path d={`M${x} ${y} L${x} ${y - r} A${r} ${r} 0 ${p > 0.5 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`} fill={BLUE} />}
    </g>
  );
};
function FstIslands() {
  const isl = (x0: number, ps: number[], thick: number, title: string, fst: string) => {
    const pos: [number, number][] = [[x0 + 50, 70], [x0 + 150, 70], [x0 + 100, 150]];
    return (
      <g key={title}>
        <He x={x0 + 100} y={22} size={12.5} bold>{title}</He>
        {[[0, 1], [1, 2], [0, 2]].map(([a, b]) => <line key={`${a}${b}`} x1={pos[a][0]} y1={pos[a][1]} x2={pos[b][0]} y2={pos[b][1]} stroke={TEAL} strokeWidth={thick} opacity={0.6} />)}
        {pos.map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={36} ry={26} fill="#fef9c3" stroke="#ca8a04" strokeWidth={1.2} />
            <Pie x={x} y={y} r={16} p={ps[i]} />
          </g>
        ))}
        <La x={x0 + 100} y={206} size={12} bold color={PURPLE}>{fst}</La>
      </g>
    );
  };
  return (
    <Svg h={240} label="שלוש תת-אוכלוסיות (איים), עם תדירות האלל בכל אחת (כחול). מימין — מעט הגירה (קו דק): התדירויות שונות מאוד, F_ST גבוה. משמאל — הרבה הגירה (קו עבה): התדירויות דומות, F_ST נמוך.">
      {isl(260, [0.9, 0.15, 0.55], 1.2, "מעט הגירה", "F_ST גבוה")}
      {isl(20, [0.55, 0.45, 0.5], 6, "הרבה הגירה", "F_ST נמוך")}
      <rect x={140} y={222} width={10} height={10} fill={BLUE} />
      <He x={135} y={231} size={10} anchor="end">אלל A</He>
      <rect x={300} y={222} width={10} height={10} fill={FILL.orange} stroke={MUTED} />
      <He x={295} y={231} size={10} anchor="end">אלל a</He>
    </Svg>
  );
}

// ── ev-fixation-probability ──────────────────────────────────────────────────
function FixationProbability() {
  const s = scale(70, 460, 220, 30, 0, 0.02, 0, 0.05);
  const u = (N: number) => (x: number) => (x === 0 ? 1 / (2 * N) : (1 - Math.exp(-2 * x)) / (1 - Math.exp(-4 * N * x)));
  return (
    <Svg h={280} label="הסתברות הקיבוע של מוטציה מועילה חדשה כפונקציה של מקדם הברירה s (נוסחת קימורה). באוכלוסייה גדולה (N = 5,000) היא קרובה ל-2s. באוכלוסייה קטנה (N = 50), כשה-s קטן, היא קרובה להסתברות של מוטציה ניטרלית, 1/2N.">
      <Axes x0={70} y0={220} x1={460} y1={30}
        xLabel={<La x={265} y={262} size={12}>מקדם הברירה s</La>}
        yLabel={<He x={74} y={22} size={12} anchor="start">הסתברות הקיבוע</He>} />
      {[0, 0.025, 0.05].map((v) => <La key={v} x={62} y={s.sy(v) + 4} size={11} anchor="end" color={MUTED}>{v}</La>)}
      {[0, 0.005, 0.01, 0.015, 0.02].map((v) => <La key={v} x={s.sx(v)} y={238} size={11} color={MUTED}>{v}</La>)}
      <line x1={s.sx(0)} y1={s.sy(0.01)} x2={s.sx(0.02)} y2={s.sy(0.01)} stroke={MUTED} strokeWidth={1.2} {...dash} />
      <path d={curve(u(5000), 0.0001, 0.02, s)} fill="none" stroke={BLUE} strokeWidth={2.6} />
      <path d={curve(u(50), 0.0001, 0.02, s)} fill="none" stroke={ORANGE} strokeWidth={2.6} />
      <He x={s.sx(0.012)} y={s.sy(0.036)} size={11} bold color={BLUE}>N = 5,000 (≈ 2s)</He>
      <He x={s.sx(0.004)} y={s.sy(0.024)} size={11} bold color={ORANGE}>N = 50</He>
      <He x={s.sx(0.016)} y={s.sy(0.01) + 16} size={10} color={MUTED}>ניטרלי ב-N = 50: 1/2N</He>
    </Svg>
  );
}

// ── ev-cline ─────────────────────────────────────────────────────────────────
function Cline() {
  const s = scale(60, 460, 210, 50, -10, 10, 0, 1);
  const cl = (w: number) => (x: number) => 1 / (1 + Math.exp((-4 * x) / w));
  return (
    <Svg h={270} label="קליין: תדירות אלל A לאורך מרחב, כשבצד אחד A מועדף ובצד השני a מועדף. ברירה חזקה (ביחס לפיזור) יוצרת קליין צר; ברירה חלשה — קליין רחב.">
      <rect x={260} y={42} width={200} height={168} fill={FILL.blue} opacity={0.5} />
      <rect x={60} y={42} width={200} height={168} fill={FILL.orange} opacity={0.5} />
      <He x={360} y={36} size={11} color={BLUE}>כאן A מועדף</He>
      <He x={160} y={36} size={11} color={ORANGE}>כאן a מועדף</He>
      <Axes x0={60} y0={210} x1={460} y1={50}
        xLabel={<He x={260} y={252} size={12}>מיקום (ק״מ)</He>}
        yLabel={<He x={64} y={22} size={11} anchor="start">תדירות A</He>} />
      {[0, 0.5, 1].map((v) => <La key={v} x={52} y={s.sy(v) + 4} size={11} anchor="end" color={MUTED}>{v}</La>)}
      <path d={curve(cl(2), -10, 10, s)} fill="none" stroke={RED} strokeWidth={2.6} />
      <path d={curve(cl(9), -10, 10, s)} fill="none" stroke={TEAL} strokeWidth={2.6} />
      <He x={s.sx(-1.6)} y={s.sy(0.86)} size={11} bold color={RED} anchor="end">ברירה חזקה — צר</He>
      <He x={s.sx(2.8)} y={s.sy(0.35)} size={11} bold color={TEAL} anchor="start">ברירה חלשה — רחב</He>
    </Svg>
  );
}

// ── ev-mutation-selection ────────────────────────────────────────────────────
function MutationSelection() {
  const s = scale(80, 460, 220, 40, 0, 4, -7, -2);
  const bars: [string, string, number, string][] = [
    ["קצב המוטציה μ", "", 1e-6, MUTED],
    ["אלל מזיק דומיננטי", "q ≈ μ/s", 1e-6, ORANGE],
    ["אלל מזיק רצסיבי", "q ≈ √(μ/s)", 1e-3, BLUE],
  ];
  return (
    <Svg h={270} label="מאזן מוטציה-ברירה עם קצב מוטציה של 10⁻⁶ וברירה קטלנית (s = 1), בסקלה לוגריתמית. אלל דומיננטי נשאר בתדירות כמו קצב המוטציה; אלל רצסיבי ״מתחבא״ בנשאים ונשאר בתדירות גבוהה פי אלף.">
      <line x1={80} y1={220} x2={460} y2={220} stroke={INK} strokeWidth={1.4} />
      <line x1={80} y1={220} x2={80} y2={34} stroke={INK} strokeWidth={1.4} />
      {[-7, -6, -5, -4, -3, -2].map((e) => (
        <g key={e}>
          <line x1={76} y1={s.sy(e)} x2={460} y2={s.sy(e)} stroke="#e2e8f0" />
          <La x={70} y={s.sy(e) + 4} size={11} anchor="end" color={MUTED}>{`10${["⁻⁷", "⁻⁶", "⁻⁵", "⁻⁴", "⁻³", "⁻²"][e + 7]}`}</La>
        </g>
      ))}
      {bars.map(([t, f, v, c], i) => {
        const x = s.sx(i + 0.8), y = s.sy(Math.log10(v));
        return (
          <g key={t}>
            <rect x={x - 32} y={y} width={64} height={220 - y} fill={c} opacity={0.8} />
            <He x={x} y={240} size={10.5} bold>{t}</He>
            {f && <La x={x} y={y - 8} size={11} bold color={c}>{f}</La>}
          </g>
        );
      })}
      <He x={260} y={262} size={10.5} color={MUTED}>תדירות האלל בשיווי משקל (סקלה לוגריתמית), μ = 10⁻⁶, s = 1</He>
    </Svg>
  );
}

// ── ev-lenski-fitness ────────────────────────────────────────────────────────
function LenskiFitness() {
  const s = scale(70, 460, 220, 40, 0, 50000, 1, 1.8);
  const w = (t: number) => (1 + 0.0035 * t) ** 0.1;
  const r = rng(5);
  const pts = Array.from({ length: 21 }, (_, i) => i * 2500).map((t) => [t, w(t) + (r() - 0.5) * 0.06] as [number, number]);
  return (
    <Svg h={280} label="הכושר היחסי הממוצע של אוכלוסיות הניסוי של לנסקי, ביחס לאב הקדמון, לאורך 50,000 דורות (נקודות להמחשה). העלייה מהירה בהתחלה ואיטית בהמשך, אבל לא נעצרת — מתאימה לחוק חזקה.">
      <Axes x0={70} y0={220} x1={460} y1={40}
        xLabel={<He x={265} y={262} size={12}>דורות</He>}
        yLabel={<He x={74} y={30} size={12} anchor="start">כושר יחסי</He>} />
      {[1, 1.2, 1.4, 1.6, 1.8].map((v) => <La key={v} x={62} y={s.sy(v) + 4} size={11} anchor="end" color={MUTED}>{v.toFixed(1)}</La>)}
      {[0, 10000, 20000, 30000, 40000, 50000].map((v) => <La key={v} x={s.sx(v)} y={238} size={10.5} color={MUTED}>{v.toLocaleString("en-US")}</La>)}
      <line x1={s.sx(0)} y1={s.sy(1)} x2={s.sx(50000)} y2={s.sy(1)} stroke={MUTED} strokeWidth={1} {...dash} />
      <path d={curve(w, 0, 50000, s)} fill="none" stroke={BLUE} strokeWidth={2.4} />
      {pts.map(([t, v]) => <circle key={t} cx={s.sx(t)} cy={s.sy(v)} r={3.2} fill={ORANGE} />)}
      <He x={s.sx(32000)} y={s.sy(1.42)} size={11} color={BLUE} anchor="start">חוק חזקה — מאט אבל לא נעצר</He>
      <He x={s.sx(46000)} y={s.sy(1) - 8} size={10} color={MUTED}>האב הקדמון = 1</He>
    </Svg>
  );
}

// ── ev-dnds ──────────────────────────────────────────────────────────────────
function DnDs() {
  const s = scale(80, 460, 220, 40, 0, 4, 0, 1.6);
  const bars: [string, number, string][] = [["היסטון H4", 0.008, GREEN], ["אלבומין", 0.23, GREEN], ["פסאודוגן", 1, MUTED], ["חלבון זרע X", 1.36, RED]];
  return (
    <Svg h={270} label="היחס dN/dS בארבעה גנים (מהתרגיל ביחידה). מתחת ל-1 — ברירה מטהרת (היסטון חזקה מאוד, אלבומין); בערך 1 — ניטרלי (פסאודוגן); מעל 1 — ברירה חיובית (חלבון זרע).">
      <line x1={80} y1={220} x2={460} y2={220} stroke={INK} strokeWidth={1.4} />
      <line x1={80} y1={220} x2={80} y2={36} stroke={INK} strokeWidth={1.4} />
      {[0, 0.5, 1, 1.5].map((v) => <La key={v} x={72} y={s.sy(v) + 4} size={11} anchor="end" color={MUTED}>{v}</La>)}
      <line x1={80} y1={s.sy(1)} x2={460} y2={s.sy(1)} stroke={INK} strokeWidth={1.2} {...dash} />
      <He x={200} y={s.sy(1) - 6} size={10} color={MUTED}>ניטרלי (dN/dS = 1)</He>
      {bars.map(([t, v, c], i) => {
        const x = s.sx(i + 0.5), y = s.sy(v);
        return (
          <g key={t}>
            <rect x={x - 28} y={y} width={56} height={Math.max(1.5, 220 - y)} fill={c} opacity={0.8} />
            <La x={x} y={y - 8} size={11} bold color={c}>{v}</La>
            <He x={x} y={240} size={10.5} bold>{t}</He>
          </g>
        );
      })}
      <He x={s.sx(1)} y={62} size={10.5} color={GREEN}>ברירה מטהרת</He>
      <He x={s.sx(3.5)} y={42} size={10.5} color={RED}>ברירה חיובית</He>
      <He x={270} y={262} size={10.5} color={MUTED}>dN/dS בין אדם לשימפנזה (ערכים להמחשה)</He>
    </Svg>
  );
}

// ── ev-selective-sweep ───────────────────────────────────────────────────────
function SelectiveSweep() {
  const s = scale(60, 460, 210, 50, -200, 200, 0, 1.1);
  const dip = (w: number) => (x: number) => 1 - Math.exp(-Math.abs(x) / w);
  return (
    <Svg h={270} label="השונות הגנטית לאורך כרומוזום אחרי סחף ברירה. סביב האתר שנבחר השונות כמעט נעלמת, כי כל העותקים באזור הם צאצאים של העותק המקורי; ככל שמתרחקים, הרקומבינציה החזירה שונות. סחף מהיר (או רקומבינציה חלשה) יוצר שקע רחב יותר.">
      <Axes x0={60} y0={210} x1={460} y1={50}
        xLabel={<He x={260} y={252} size={12}>מיקום על הכרומוזום (אלפי בסיסים)</He>}
        yLabel={<He x={64} y={30} size={12} anchor="start">שונות גנטית (יחסית)</He>} />
      <line x1={60} y1={s.sy(1)} x2={460} y2={s.sy(1)} stroke={MUTED} strokeWidth={1.4} {...dash} />
      <path d={curve(dip(22), -200, 200, s, 400)} fill="none" stroke={BLUE} strokeWidth={2.4} />
      <path d={curve(dip(60), -200, 200, s, 400)} fill="none" stroke={ORANGE} strokeWidth={2.4} />
      <line x1={s.sx(0)} y1={210} x2={s.sx(0)} y2={196} stroke={RED} strokeWidth={2.4} />
      <He x={s.sx(0)} y={232} size={10.5} bold color={RED}>האתר שנבחר</He>
      <He x={s.sx(-150)} y={s.sy(1) - 8} size={10} color={MUTED}>לפני הסחף</He>
      <He x={s.sx(110)} y={s.sy(0.3)} size={10.5} bold color={BLUE}>שקע צר — רקומבינציה רבה</He>
      <He x={s.sx(-115)} y={s.sy(0.3)} size={10.5} bold color={ORANGE}>שקע רחב — סחף מהיר</He>
    </Svg>
  );
}

// ── ev-volvocine ─────────────────────────────────────────────────────────────
function Volvocine() {
  const cell = (x: number, y: number, r: number, c = GREEN, f = FILL.green) => <circle cx={x} cy={y} r={r} fill={f} stroke={c} strokeWidth={1} />;
  const X = [420, 300, 180, 60];
  const sphere = (cx: number, cy: number, R: number, n: number, r: number) => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI; return <g key={i}>{cell(cx + R * Math.cos(a), cy + R * Math.sin(a), r)}</g>;
  });
  return (
    <Svg h={220} label="מהחד-תאי לרב-תאי באצות הוולבוקסיות: Chlamydomonas — תא בודד עם שני שוטונים; Gonium — לוח של 4–16 תאים זהים; Eudorina — כדור של 32 תאים; Volvox — אלפי תאים סומטיים קטנים שלא מתרבים וכ-16 תאי נבט גדולים בפנים.">
      {cell(X[0], 88, 18)}
      <path d={`M${X[0] - 4} 70 q-6 -20 -16 -26 M${X[0] + 4} 70 q6 -20 16 -26`} fill="none" stroke={GREEN} strokeWidth={1.4} />
      {[0, 1, 2, 3].map((i) => [0, 1, 2, 3].map((j) => <g key={`${i}${j}`}>{cell(X[1] - 27 + i * 18, 61 + j * 18, 8)}</g>))}
      <circle cx={X[2]} cy={88} r={38} fill="none" stroke="#86efac" strokeWidth={1} />
      {sphere(X[2], 88, 30, 16, 6)}{sphere(X[2], 88, 15, 8, 6)}
      <circle cx={X[3]} cy={88} r={48} fill="#f0fdf4" stroke={GREEN} strokeWidth={1.2} />
      {sphere(X[3], 88, 46, 44, 2.2)}
      {[[-18, -14], [14, -20], [-6, 12], [20, 10], [-24, 18], [6, -2]].map(([dx, dy]) => <g key={`${dx}${dy}`}>{cell(X[3] + dx, 88 + dy, 6.5, TEAL, FILL.teal)}</g>)}
      {([[0, "Chlamydomonas", "תא אחד"], [1, "Gonium", "4–16 תאים זהים"], [2, "Eudorina", "32 תאים"], [3, "Volvox", "אלפי תאים + תאי נבט"]] as [number, string, string][]).map(([i, n, d]) => (
        <g key={n}>
          <La x={X[i]} y={162} size={11.5} bold>{n}</La>
          <He x={X[i]} y={180} size={10.5} color={MUTED}>{d}</He>
        </g>
      ))}
      <He x={240} y={208} size={10.5} color={TEAL}>טורקיז — תאי נבט (רבייה); ירוק — תאים סומטיים (שחייה)</He>
    </Svg>
  );
}

// ── ev-hox-collinearity ──────────────────────────────────────────────────────
function HoxCollinearity() {
  const genes = ["lab", "pb", "Dfd", "Scr", "Antp", "Ubx", "abd-A", "Abd-B"];
  const col = ["#dc2626", "#ea580c", "#d97706", "#65a30d", "#0d9488", "#2563eb", "#7c3aed", "#c026d3"];
  const segs = [[0, 0, 0], [1, 1, 2], [2, 3], [3, 4], [4, 4], [5, 5], [6, 6, 6], [7, 7]];
  return (
    <Svg h={250} label="קולינאריות של גני Hox בזבוב הפירות: שמונת הגנים מסודרים על הכרומוזום באותו סדר שבו הם מתבטאים לאורך הגוף, מהראש (lab) ועד קצה הבטן (Abd-B). אותו עיקרון קיים באשכולות Hox של חולייתנים.">
      <He x={240} y={22} size={11.5} bold>אשכול Hox על הכרומוזום</He>
      <line x1={36} y1={56} x2={446} y2={56} stroke={INK} strokeWidth={2} />
      {genes.map((g, i) => (
        <g key={g}>
          <rect x={44 + i * 50} y={44} width={42} height={24} rx={3} fill={col[i]} />
          <La x={65 + i * 50} y={86} size={10.5} bold color={col[i]}>{g}</La>
        </g>
      ))}
      <La x={30} y={60} size={10} color={MUTED} anchor="end">3′</La>
      <La x={452} y={60} size={10} color={MUTED} anchor="start">5′</La>
      <He x={240} y={124} size={11.5} bold>אזורי הביטוי לאורך גוף הזבוב</He>
      <ellipse cx={58} cy={170} rx={22} ry={18} fill="#f8fafc" stroke={MUTED} />
      {segs.map((cs, i) => (
        <g key={i}>
          <rect x={86 + i * 44} y={154} width={40} height={32} rx={8} fill="#f8fafc" stroke={MUTED} />
          {cs.map((c, k) => <rect key={k} x={90 + i * 44 + k * (32 / cs.length)} y={160} width={32 / cs.length - 1} height={20} rx={2} fill={col[c]} opacity={0.8} />)}
        </g>
      ))}
      <He x={58} y={208} size={10.5} color={MUTED}>ראש</He>
      <He x={180} y={208} size={10.5} color={MUTED}>חזה</He>
      <He x={380} y={208} size={10.5} color={MUTED}>בטן</He>
      <He x={240} y={236} size={10.5} color={MUTED}>סדר הגנים על הכרומוזום = סדר האזורים מהראש לזנב (סכמטי)</He>
    </Svg>
  );
}

// ── ev-twofold-cost ──────────────────────────────────────────────────────────
function TwofoldCost() {
  const F = (x: number, y: number, c: string) => <circle cx={x} cy={y} r={8} fill={c} stroke={INK} strokeWidth={1} />;
  const M = (x: number, y: number) => <rect x={x - 7} y={y - 7} width={14} height={14} fill={FILL.blue} stroke={INK} strokeWidth={1} />;
  const rowY = [40, 90, 140, 190];
  return (
    <Svg h={250} label="המחיר הכפול של מין. מימין — נקבה אל-מינית: כל נקבה מולידה שתי בנות, והמספר מוכפל בכל דור (1, 2, 4, 8). משמאל — זוג מיני: שני צאצאים, בת ובן; רק הנקבות מולידות, ומספר הנקבות נשאר קבוע.">
      <He x={360} y={20} size={12} bold color={RED}>אל-מינית</He>
      <He x={120} y={20} size={12} bold color={BLUE}>מינית</He>
      {rowY.map((y, g) => {
        const n = 2 ** g;
        return (
          <g key={g}>
            {Array.from({ length: n }, (_, i) => {
              const x = 360 + (i - (n - 1) / 2) * 24;
              const parent = 360 + (Math.floor(i / 2) - (n / 2 - 1) / 2) * 24;
              return <g key={i}>{g > 0 && <line x1={parent} y1={rowY[g - 1] + 9} x2={x} y2={y - 9} stroke={MUTED} strokeWidth={1} />}{F(x, y, FILL.red)}</g>;
            })}
            <La x={470} y={y + 4} size={11} bold color={RED} anchor="end">{n}</La>
          </g>
        );
      })}
      {rowY.map((y, g) => (
        <g key={`s${g}`}>
          {g > 0 && <><line x1={110} y1={rowY[g - 1] + 9} x2={110} y2={y - 9} stroke={MUTED} strokeWidth={1} /><line x1={110} y1={rowY[g - 1] + 9} x2={136} y2={y - 8} stroke={MUTED} strokeWidth={1} /></>}
          {F(110, y, FILL.red)}{M(138, y)}
          <La x={30} y={y + 4} size={11} bold color={BLUE} anchor="start">1</La>
        </g>
      ))}
      <He x={360} y={228} size={10.5} color={MUTED}>מספר הנקבות מוכפל בכל דור</He>
      <He x={120} y={228} size={10.5} color={MUTED}>עיגול — נקבה, ריבוע — זכר</He>
      <He x={240} y={246} size={10} color={MUTED}>מספרים בצד — נקבות בכל דור</He>
    </Svg>
  );
}

// ── ev-fisher-muller ─────────────────────────────────────────────────────────
function FisherMuller() {
  const lg = (t0: number, k = 0.18, top = 1) => (t: number) => top / (1 + Math.exp(-k * (t - t0)));
  const panel = (x0: number, title: string, A: (t: number) => number, B: (t: number) => number, AB: (t: number) => number, fixAt: number) => {
    const s = scale(x0, x0 + 180, 200, 50, 0, 120, 0, 1);
    return (
      <g key={title}>
        <He x={x0 + 90} y={28} size={12.5} bold>{title}</He>
        <line x1={x0} y1={200} x2={x0 + 180} y2={200} stroke={INK} strokeWidth={1.2} />
        <line x1={x0} y1={200} x2={x0} y2={44} stroke={INK} strokeWidth={1.2} />
        <path d={curve(A, 0, 120, s)} fill="none" stroke={ORANGE} strokeWidth={2.2} />
        <path d={curve(B, 0, 120, s)} fill="none" stroke={BLUE} strokeWidth={2.2} />
        <path d={curve(AB, 0, 120, s)} fill="none" stroke={GREEN} strokeWidth={2.8} />
        <line x1={s.sx(fixAt)} y1={200} x2={s.sx(fixAt)} y2={192} stroke={GREEN} strokeWidth={2} />
        <La x={s.sx(fixAt)} y={214} size={10} color={GREEN}>{`AB ≈ ${fixAt}`}</La>
        <He x={x0 + 90} y={232} size={10} color={MUTED}>זמן (דורות)</He>
      </g>
    );
  };
  // Genotype frequencies that never sum above 1 (the rest is ab).
  const abAsex = lg(82, 0.2);
  const bAsex = (t: number) => 0.3 * lg(30, 0.25)(t) * (1 - lg(48, 0.3)(t));
  const aAsex = (t: number) => (1 - abAsex(t) - bAsex(t)) * lg(25)(t);
  const abSex = lg(50, 0.22);
  const aSex = (t: number) => 0.5 * (1 - abSex(t)) * lg(25)(t);
  const bSex = (t: number) => 0.45 * (1 - abSex(t)) * lg(30)(t);
  return (
    <Svg h={250} label="מודל פישר-מילר. באוכלוסייה אל-מינית (מימין), מוטציות מועילות A ו-B בפרטים שונים מתחרות, B אובדת, וצריך לחכות ש-B תופיע שוב בתוך השושלת של A — הצירוף AB מתקבע מאוחר. ברבייה מינית (משמאל), רקומבינציה מחברת את A ו-B מהר, ו-AB מתקבע מוקדם יותר.">
      {panel(280, "אל-מינית", aAsex, bAsex, abAsex, 105)}
      {panel(40, "מינית", aSex, bSex, abSex, 70)}
      <La x={330} y={60} size={11} bold color={ORANGE}>A</La>
      <La x={337} y={140} size={11} bold color={BLUE}>B</La>
      <La x={444} y={60} size={11} bold color={GREEN}>AB</La>
      <La x={56} y={108} size={11} bold color={ORANGE}>A</La>
      <La x={56} y={128} size={11} bold color={BLUE}>B</La>
      <La x={170} y={60} size={11} bold color={GREEN}>AB</La>
      <He x={240} y={248} size={10} color={MUTED}>תדירות בזמן (סכמטי): כתום A, כחול B, ירוק AB</He>
    </Svg>
  );
}

export const EVOLUTION_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "ev-tree-reading": { el: TreeReading, captionHe: "קריאת עץ פילוגנטי. הקרבה נקבעת לפי הצומת המשותף הצעיר ביותר: הציפור קרובה יותר ללטאה מאשר לעכבר. סדר הקצוות שרירותי — אפשר לסובב כל צומת." },
  "ev-limb-homology": { el: LimbHomology, captionHe: "הומולוגיה של הגפה הקדמית ביונקים: אותן עצמות, באותו סדר, בגפיים שמשמשות לאחיזה, לתעופה, לשחייה ולהליכה. סכמטי, לא בקנה מידה." },
  "ev-hgt": { el: Hgt, captionHe: "שלוש דרכים להעברה אופקית של גנים בין פרוקריוטים. בגנום של חיידקים רבים, חלק ניכר מהגנים נרכש כך. סכמטי." },
  "ev-endosymbiosis": { el: Endosymbiosis, captionHe: "אנדוסימביוזה ראשונית ומשנית. המיטוכונדריון (מ-α-פרוטאובקטריה) נרכש פעם אחת, מוקדם; הכלורופלסט (מציאנובקטריה) — מאוחר יותר, והתפשט לקבוצות נוספות כשאאוקריוטים בלעו אצות. סכמטי." },
  "ev-animal-tree": { el: AnimalTree, captionHe: "עץ מפושט של בעלי החיים (רק קבוצות נבחרות). הקווים האדומים מסמנים חידושים על הענפים. סכמטי — היחסים בבסיס העץ (ספוגים, מסרקניות) עדיין בדיון." },
  "ev-hominin-timeline": { el: HomininTimeline, captionHe: "טווחי הזמן של מיני הומינינים נבחרים (בקירוב; התאריכים מתעדכנים עם ממצאים חדשים). לעתים קרובות חיו כמה מינים בו זמנית." },
  "ev-selection-trajectories": { el: SelectionTrajectories, captionHe: "חישוב של מודל הברירה הדיפלואידי (תדירות התחלתית 1%, יתרון של 5% להומוזיגוט). הדומיננטיות לא קובעת אם האלל יתפשט — רק כמה מהר בכל שלב." },
  "ev-selection-modes": { el: SelectionModes, captionHe: "ברירה מכוונת, מייצבת ומפצלת על תכונה כמותית. סכמטי." },
  "ev-drift-sims": { el: DriftSims, captionHe: "סימולציה של סחף (דגימה בינומית של 2N עותקים בכל דור). אותה תדירות התחלתית, בלי ברירה — אבל באוכלוסיות קטנות התוצאות מתפזרות מהר ואללים מתקבעים או נעלמים." },
  "ev-fst-islands": { el: FstIslands, captionHe: "מבנה אוכלוסייה. בלי הרבה הגירה, סחף מבדיל בין האיים (F_ST גבוה); הגירה מאחדת אותם. סכמטי." },
  "ev-fixation-probability": { el: FixationProbability, captionHe: "נוסחת קימורה להסתברות הקיבוע: u = (1 − e^(−2s)) / (1 − e^(−4Ns)). כש-Ns גדול, u ≈ 2s; כש-Ns קטן, המוטציה מתנהגת כמעט כניטרלית." },
  "ev-cline": { el: Cline, captionHe: "עקומות לוגיסטיות להמחשת קליין צר ורחב — לא פתרון מחושב של מודל. במודלים של מאזן בין ברירה לפיזור, הרוחב פרופורציוני ל-σ/√s, עם מקדם שתלוי במודל." },
  "ev-mutation-selection": { el: MutationSelection, captionHe: "מאזן מוטציה-ברירה. אלל רצסיבי מזיק נשאר בתדירות גבוהה בהרבה מאלל דומיננטי באותו קצב מוטציה, כי רוב עותקיו בנשאים שאינם נפגעים." },
  "ev-lenski-fitness": { el: LenskiFitness, captionHe: "ניסוי האבולוציה של לנסקי: הכושר היחסי ממשיך לעלות גם אחרי עשרות אלפי דורות, בקצב יורד. העקומה והנקודות להמחשה של הדפוס, לא נתונים מקוריים." },
  "ev-dnds": { el: DnDs, captionHe: "dN/dS כמדד לברירה על חלבון. רוב הגנים מתחת ל-1; ערך מעל 1 מעיד על ברירה חיובית (לרוב רק באתרים מסוימים בחלבון)." },
  "ev-selective-sweep": { el: SelectiveSweep, captionHe: "סימן של סחף ברירה: שקע בשונות סביב האתר שנבחר. סכמטי — צוואר בקבוק או ברירת רקע יכולים ליצור דפוסים דומים, ולכן משווים לשאר הגנום." },
  "ev-volvocine": { el: Volvocine, captionHe: "האצות הוולבוקסיות מראות דרגות של רב-תאיות וחלוקת עבודה בין מינים קרובים. סכמטי, לא בקנה מידה." },
  "ev-hox-collinearity": { el: HoxCollinearity, captionHe: "קולינאריות של גני Hox בזבוב הפירות (אשכולות Antennapedia ו-Bithorax מוצגים כאשכול אחד). סכמטי — האזורים חופפים בפועל." },
  "ev-twofold-cost": { el: TwofoldCost, captionHe: "המחיר הכפול של מין: אם הזכרים לא תורמים לגידול הצאצאים, היחס בין הנקבות האל-מיניות לנקבות המיניות מוכפל בכל דור." },
  "ev-fisher-muller": { el: FisherMuller, captionHe: "מודל פישר-מילר: רקומבינציה מאפשרת לצרף מוטציות מועילות שהופיעו בפרטים שונים, במקום שיתחרו זו בזו. תדירויות הגנוטיפים Ab (כתום), aB (כחול) ו-AB (ירוק); השאר — ab. עקומות סכמטיות (לא תוצאה של סימולציה)." },
};
