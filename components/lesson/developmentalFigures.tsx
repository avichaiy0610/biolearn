/* Figures for the developmental biology units (Technion 134069). Original schematic drawings; curves are idealized
   shapes (marked as such in the captions), not data. Layout conventions follow Gilbert & Barresi, Developmental
   Biology, and Wolpert, Principles of Development — never copied. Labels sit beside shapes and arrows, never on a line.
   Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, BLUE, GREEN, INK, MUTED, ORANGE, He, La } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

const PURPLE = "#7c3aed";
const RED = "#b91c1c";
const TEAL = "#0f766e";
const PINK = "#be185d";
const GOLD = "#a16207";
const FILL = { blue: "#dbeafe", green: "#dcfce7", orange: "#ffedd5", purple: "#ede9fe", yellow: "#fef3c7", gray: "#f1f5f9", red: "#fee2e2", sky: "#e0f2fe", teal: "#ccfbf1", cyto: "#fff7ed", pink: "#fce7f3" };

const Svg = ({ w = 480, h, label, children }: { w?: number; h: number; label: string; children: React.ReactNode }) => (
  <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label={label}>
    <ArrowDefs />
    {children}
  </svg>
);
const Lead = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={1} />;
function Box({ x, y, w, h, fill, stroke, children, size = 11, bold }: { x: number; y: number; w: number; h: number; fill: string; stroke: string; children: React.ReactNode; size?: number; bold?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <He x={x + w / 2} y={y + h / 2 + size * 0.36} size={size} bold={bold}>{children}</He>
    </g>
  );
}
// Two-line box.
function Box2({ x, y, w, h, fill, stroke, lines, size = 10 }: { x: number; y: number; w: number; h: number; fill: string; stroke: string; lines: [string, string]; size?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <He x={x + w / 2} y={y + h / 2 - 2} size={size}>{lines[0]}</He>
      <He x={x + w / 2} y={y + h / 2 + size + 1} size={size}>{lines[1]}</He>
    </g>
  );
}
// Horizontal inhibition: line ending in a bar.
const Inh = ({ x1, x2, y, color = RED }: { x1: number; x2: number; y: number; color?: string }) => (
  <g>
    <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={1.8} />
    <line x1={x2} y1={y - 7} x2={x2} y2={y + 7} stroke={color} strokeWidth={2.4} />
  </g>
);

// ── dv-principles ────────────────────────────────────────────────────────────
function SpecificationModes() {
  const nuclei = [346, 366, 386, 406, 426, 446];
  return (
    <Svg h={226} label="שלושה אופני קביעת גורל: אוטונומית — תא עם דטרמינאנט (צהוב) ממשיך לאותו גורל גם כשמבודדים אותו; מותנית — הגורל נקבע באות מהשכן, ותא מבודד מקבל גורל אחר; סינציטיאלית — גרעינים רבים בציטופלזמה אחת, וכל גרעין מגיב לריכוז של חומר שמתפזר מקצה אחד.">
      <defs>
        <linearGradient id="dvSyncGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={BLUE} stopOpacity={0.55} />
          <stop offset="1" stopColor={BLUE} stopOpacity={0.03} />
        </linearGradient>
      </defs>
      <He x={80} y={18} size={12} bold>אוטונומית</He>
      <He x={240} y={18} size={12} bold>מותנית</He>
      <He x={400} y={18} size={12} bold>סינציטיאלית</He>

      <circle cx={62} cy={72} r={18} fill={FILL.gray} stroke={MUTED} strokeWidth={1.4} />
      <circle cx={98} cy={72} r={18} fill={FILL.yellow} stroke={GOLD} strokeWidth={1.4} />
      {[[92, 66], [102, 74], [96, 80], [106, 66]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} fill={GOLD} />)}
      <Arrow x1={98} y1={96} x2={98} y2={126} color={MUTED} />
      <He x={60} y={116} size={9.5} color={MUTED}>מבודדים</He>
      <circle cx={98} cy={152} r={18} fill={FILL.yellow} stroke={GOLD} strokeWidth={1.4} />
      {[[92, 146], [102, 154], [96, 160], [106, 146]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} fill={GOLD} />)}
      <He x={98} y={188} size={10}>אותו גורל</He>
      <He x={80} y={212} size={10} color={MUTED}>הגורל עובר עם התא</He>

      <circle cx={222} cy={72} r={18} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <circle cx={258} cy={72} r={18} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <Arrow x1={276} y1={44} x2={232} y2={44} color={GREEN} />
      <He x={254} y={36} size={9.5} color={GREEN}>אות</He>
      <Arrow x1={222} y1={96} x2={222} y2={126} color={MUTED} />
      <He x={258} y={116} size={9.5} color={MUTED}>מבודדים</He>
      <circle cx={222} cy={152} r={18} fill={FILL.gray} stroke={MUTED} strokeWidth={1.4} />
      <He x={222} y={188} size={10}>גורל אחר</He>
      <He x={240} y={212} size={10} color={MUTED}>הגורל לפי השכנים</He>

      <ellipse cx={396} cy={78} rx={66} ry={28} fill="url(#dvSyncGrad)" stroke={BLUE} strokeWidth={1.4} />
      {nuclei.map((x) => <circle key={x} cx={x} cy={78} r={5} fill="white" stroke={INK} strokeWidth={1} />)}
      <He x={396} y={128} size={10}>גרעינים בציטופלזמה אחת</He>
      <He x={346} y={150} size={9.5} color={BLUE}>ריכוז גבוה</He>
      <He x={446} y={150} size={9.5} color={MUTED}>נמוך</He>
      <He x={400} y={212} size={10} color={MUTED}>הגורל לפי הריכוז</He>
    </Svg>
  );
}

function FrenchFlag() {
  const pts: string[] = [];
  for (let x = 60; x <= 420; x += 6) pts.push(`${x},${(170 - 120 * Math.exp(-(x - 60) / 200)).toFixed(1)}`);
  const cells = Array.from({ length: 18 }, (_, i) => 60 + i * 20);
  const color = (x: number) => (x + 10 < 180 ? "#3b82f6" : x + 10 < 300 ? "#ffffff" : "#ef4444");
  return (
    <Svg h={240} label="מודל דגל צרפת: ריכוז המורפוגן יורד עם המרחק מהמקור (עקומה). שני ספי ריכוז מחלקים את שורת התאים לשלושה אזורים: מעל סף 1 — כחול, בין הספים — לבן, מתחת לסף 2 — אדום.">
      <line x1={60} y1={40} x2={60} y2={170} stroke={INK} strokeWidth={1.2} />
      <line x1={60} y1={170} x2={420} y2={170} stroke={INK} strokeWidth={1.2} />
      <He x={36} y={110} size={10} rotate={-90}>ריכוז המורפוגן</He>
      <polyline points={pts.join(" ")} fill="none" stroke={PURPLE} strokeWidth={2.2} />
      <line x1={60} y1={104} x2={420} y2={104} stroke={MUTED} strokeWidth={1} strokeDasharray="5 4" />
      <line x1={60} y1={134} x2={420} y2={134} stroke={MUTED} strokeWidth={1} strokeDasharray="5 4" />
      <He x={428} y={108} size={10} anchor="start">סף 1</He>
      <He x={428} y={138} size={10} anchor="start">סף 2</He>
      <He x={240} y={184} size={9.5} color={MUTED}>מרחק מהמקור</He>
      {cells.map((x) => <rect key={x} x={x} y={192} width={20} height={20} fill={color(x)} stroke={INK} strokeWidth={0.8} />)}
      <He x={52} y={206} size={10} anchor="end">מקור</He>
      <He x={120} y={230} size={10} color={BLUE}>כחול</He>
      <He x={240} y={230} size={10}>לבן</He>
      <He x={360} y={230} size={10} color={RED}>אדום</He>
    </Svg>
  );
}

function MorphogenesisMechanics() {
  const cx = 186, cy = 36;
  const angs = [25, 51, 77, 103, 129, 155].map((a) => (a * Math.PI) / 180);
  const p = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  const wedges = angs.slice(0, -1).map((a, i) => `M${p(22, a)} L${p(54, a)} A54 54 0 0 1 ${p(54, angs[i + 1])} L${p(22, angs[i + 1])} A22 22 0 0 0 ${p(22, a)} Z`);
  const mixed: [number, number, boolean][] = [[268, 176, true], [286, 192, false], [304, 174, true], [270, 208, false], [292, 214, true], [312, 198, false], [322, 216, true], [326, 180, false]];
  const outer: [number, number][] = [[400, 168], [420, 172], [434, 186], [436, 206], [422, 220], [402, 222], [386, 210], [384, 188]];
  return (
    <Svg h={268} label="ארבעה מנגנונים של מורפוגנזה: כיווץ אפיקלי — תאים מקבלים צורת טריז והשכבה מתקפלת; שילוב תאים — רקמה רחבה וקצרה נעשית צרה וארוכה; מעבר אפיתל–מזנכימה — תא עוזב את השכבה ונודד; היצמדות סלקטיבית — תאים מעורבבים מתמיינים לפי סוג.">
      <He x={120} y={16} size={11.5} bold>כיווץ אפיקלי</He>
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={12 + i * 18} y={46} width={18} height={34} fill={FILL.teal} stroke={TEAL} strokeWidth={1} />)}
      {[0, 1, 2, 3, 4].map((i) => <rect key={`a${i}`} x={12 + i * 18} y={44} width={18} height={3} fill={RED} />)}
      <Arrow x1={110} y1={62} x2={128} y2={62} color={MUTED} />
      {wedges.map((d, i) => <path key={i} d={d} fill={FILL.teal} stroke={TEAL} strokeWidth={1} />)}
      <He x={120} y={118} size={9.5} color={MUTED}>הצד העליון מתכווץ ← השכבה מתקפלת</He>

      <He x={360} y={16} size={11.5} bold>שילוב תאים</He>
      {[0, 1, 2, 3].map((c) => [0, 1].map((r) => <rect key={`${c}-${r}`} x={254 + c * 16} y={54 + r * 16} width={16} height={16} fill={FILL.purple} stroke={PURPLE} strokeWidth={1} />))}
      <Arrow x1={330} y1={70} x2={384} y2={70} color={MUTED} />
      {[0, 1].map((c) => [0, 1, 2, 3].map((r) => <rect key={`b${c}-${r}`} x={400 + c * 16} y={38 + r * 16} width={16} height={16} fill={FILL.purple} stroke={PURPLE} strokeWidth={1} />))}
      <He x={360} y={118} size={9.5} color={MUTED}>הרקמה מצטרת ומתארכת</He>

      <He x={120} y={146} size={11.5} bold>מעבר אפיתל–מזנכימה</He>
      {[0, 1, 2, 4, 5, 6].map((i) => <rect key={i} x={16 + i * 18} y={160} width={18} height={22} fill={FILL.green} stroke={GREEN} strokeWidth={1} />)}
      <path d="M70 196 L80 190 L86 198 L96 194 L94 204 L102 212 L90 214 L84 224 L78 214 L68 212 L74 204 Z" fill={FILL.green} stroke={GREEN} strokeWidth={1} />
      <Arrow x1={86} y1={184} x2={86} y2={190} color={MUTED} width={1.2} />
      <He x={110} y={212} size={9.5} anchor="start">תא נודד</He>
      <He x={120} y={250} size={9.5} color={MUTED}>תא עוזב את השכבה (ציצה עצבית, פס קדמון)</He>

      <He x={360} y={146} size={11.5} bold>היצמדות סלקטיבית</He>
      {mixed.map(([x, y, a]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={8} fill={a ? FILL.orange : FILL.blue} stroke={a ? ORANGE : BLUE} strokeWidth={1} />)}
      <Arrow x1={340} y1={196} x2={372} y2={196} color={MUTED} />
      {outer.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={8} fill={FILL.blue} stroke={BLUE} strokeWidth={1} />)}
      {[[404, 190], [418, 194], [408, 204]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={7} fill={FILL.orange} stroke={ORANGE} strokeWidth={1} />)}
      <He x={360} y={250} size={9.5} color={MUTED}>תאים נצמדים לדומים להם (קדהרינים)</He>
    </Svg>
  );
}

// ── dv-signaling ─────────────────────────────────────────────────────────────
function FivePathways() {
  const cols: { t: string; c: string; f: string; lig: string; rec: string; tr: string; tf: string; ex: string }[] = [
    { t: "RTK", c: BLUE, f: FILL.blue, lig: "FGF, EGF", rec: "RTK", tr: "Ras ← MAPK", tf: "ETS ועוד", ex: "גדילת הגפה" },
    { t: "TGF-β/BMP", c: GREEN, f: FILL.green, lig: "BMP, Nodal", rec: "Ser/Thr קינאז", tr: "זרחון SMAD", tf: "SMAD", ex: "ציר גבי-בטני" },
    { t: "Wnt", c: ORANGE, f: FILL.orange, lig: "Wnt", rec: "Frizzled", tr: "β-קטנין יציב", tf: "β-קטנין + TCF", ex: "קוטביות מקטע" },
    { t: "Hedgehog", c: PURPLE, f: FILL.purple, lig: "Hh, Shh", rec: "Patched ⊣ Smo", tr: "Gli לא נחתך", tf: "Gli מפעיל", ex: "ZPA בגפה" },
    { t: "Notch", c: TEAL, f: FILL.teal, lig: "Delta (שכן)", rec: "Notch", tr: "חיתוך Notch", tf: "NICD + CSL", ex: "עיכוב לטרלי" },
  ];
  return (
    <Svg h={262} label="חמישה מסלולי האותות העיקריים בהתפתחות, בעמודות: RTK, TGF-β/BMP, Wnt, Hedgehog ו-Notch. בכל עמודה — הליגנד, הקולטן בממברנה, איך האות עובר בתא, פקטור השעתוק בגרעין, ודוגמה.">
      <rect x={0} y={66} width={480} height={8} fill="#e2e8f0" />
      <rect x={0} y={170} width={480} height={5} fill="#e9d5ff" />
      {cols.map((k, i) => {
        const x = 6 + i * 94, cx = x + 42;
        return (
          <g key={k.t}>
            <La x={cx} y={20} size={11} bold color={k.c}>{k.t}</La>
            <Box x={x} y={32} w={84} h={26} fill="white" stroke={k.c} size={9.5}>{k.lig}</Box>
            <Arrow x1={cx} y1={58} x2={cx} y2={80} color={k.c} width={1.4} />
            <Box x={x} y={82} w={84} h={26} fill={k.f} stroke={k.c} size={9.5}>{k.rec}</Box>
            <Arrow x1={cx} y1={108} x2={cx} y2={128} color={k.c} width={1.4} />
            <Box x={x} y={130} w={84} h={26} fill={k.f} stroke={k.c} size={9.5}>{k.tr}</Box>
            <Arrow x1={cx} y1={156} x2={cx} y2={186} color={k.c} width={1.4} />
            <Box x={x} y={188} w={84} h={26} fill="white" stroke={k.c} size={9.5}>{k.tf}</Box>
            <He x={cx} y={236} size={9.5} color={MUTED}>{k.ex}</He>
          </g>
        );
      })}
      <He x={240} y={256} size={9} color={MUTED}>פס אפור — ממברנת התא · פס סגול — מעטפת הגרעין</He>
    </Svg>
  );
}

function ApoptosisPathway() {
  const X = [8, 102, 196, 290, 384];
  const W = 86;
  return (
    <Svg h={210} label="מסלול האפופטוזיס בנמטודה וביונקים: בנמטודה EGL-1 מעכב את CED-9, ש-CED-9 מעכב את CED-4, ו-CED-4 מפעיל את הקספאזה CED-3. ביונקים חלבוני BH3 בלבד מעכבים את Bcl-2, ש-Bcl-2 מעכב את Bax ו-Bak; אלה משחררים ציטוכרום c, שעם Apaf-1 מפעיל את קספאזות 9 ו-3. קווים מקווקווים מחברים חלבונים הומולוגיים.">
      <He x={472} y={20} size={11.5} bold anchor="end">נמטודה (C. elegans)</He>
      <Box x={X[0]} y={36} w={W} h={28} fill={FILL.orange} stroke={ORANGE} size={10}>EGL-1</Box>
      <Inh x1={X[0] + W + 2} x2={X[1] - 3} y={50} />
      <Box x={X[1]} y={36} w={W} h={28} fill={FILL.green} stroke={GREEN} size={10}>CED-9</Box>
      <Inh x1={X[1] + W + 2} x2={X[3] - 3} y={50} />
      <Box x={X[3]} y={36} w={W} h={28} fill={FILL.purple} stroke={PURPLE} size={10}>CED-4</Box>
      <Arrow x1={X[3] + W + 2} y1={50} x2={X[4] - 3} y2={50} color={INK} />
      <Box x={X[4]} y={36} w={W} h={28} fill={FILL.red} stroke={RED} size={10}>CED-3 (קספאזה)</Box>

      {[0, 1, 3, 4].map((i) => <line key={i} x1={X[i] + W / 2} y1={68} x2={X[i] + W / 2} y2={128} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />)}
      <He x={X[2] + W / 2} y={102} size={9.5} color={MUTED}>הומולוגים</He>

      <He x={472} y={118} size={11.5} bold anchor="end">יונקים</He>
      <Box x={X[0]} y={132} w={W} h={28} fill={FILL.orange} stroke={ORANGE} size={10}>BH3 בלבד</Box>
      <Inh x1={X[0] + W + 2} x2={X[1] - 3} y={146} />
      <Box x={X[1]} y={132} w={W} h={28} fill={FILL.green} stroke={GREEN} size={10}>Bcl-2</Box>
      <Inh x1={X[1] + W + 2} x2={X[2] - 3} y={146} />
      <Box x={X[2]} y={132} w={W} h={28} fill={FILL.gray} stroke={MUTED} size={10}>Bax / Bak</Box>
      <Arrow x1={X[2] + W + 2} y1={146} x2={X[3] - 3} y2={146} color={INK} />
      <Box2 x={X[3]} y={128} w={W} h={36} fill={FILL.purple} stroke={PURPLE} lines={["Apaf-1", "+ ציטוכרום c"]} />
      <Arrow x1={X[3] + W + 2} y1={146} x2={X[4] - 3} y2={146} color={INK} />
      <Box x={X[4]} y={132} w={W} h={28} fill={FILL.red} stroke={RED} size={10}>קספאזות 9 ← 3</Box>
      <He x={X[4] + W / 2} y={186} size={10} color={RED}>מוות התא</He>
      <He x={X[2] + W / 2} y={186} size={9.5} color={MUTED}>מהמיטוכונדריה</He>
    </Svg>
  );
}

// ── dv-fly-axes ──────────────────────────────────────────────────────────────
function BicoidGradient() {
  const bcd: string[] = [], nos: string[] = [];
  for (let x = 50; x <= 430; x += 5) {
    bcd.push(`${x},${(210 - 80 * Math.exp(-(x - 50) / 90)).toFixed(1)}`);
    nos.push(`${x},${(210 - 50 * Math.exp(-(430 - x) / 40)).toFixed(1)}`);
  }
  return (
    <Svg h={236} label="המפלים האימהיים בעובר הזבוב: ה-mRNA של bicoid מעוגן בקצה הקדמי, ושל nanos בקצה האחורי. בגרף — ריכוז החלבון Bicoid יורד מהקדמי לאחורי, ו-Nanos גבוה רק מאחור. היכן ש-Bicoid מעל הסף — נדלק hunchback.">
      <defs>
        <linearGradient id="dvBcdGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={BLUE} stopOpacity={0.6} />
          <stop offset="0.55" stopColor={BLUE} stopOpacity={0.02} />
          <stop offset="0.85" stopColor={ORANGE} stopOpacity={0.02} />
          <stop offset="1" stopColor={ORANGE} stopOpacity={0.45} />
        </linearGradient>
      </defs>
      <La x={80} y={16} size={10} color={BLUE}>bicoid mRNA</La>
      <Lead x1={80} y1={20} x2={64} y2={52} />
      <La x={400} y={16} size={10} color={ORANGE}>nanos mRNA</La>
      <Lead x1={400} y1={20} x2={416} y2={52} />
      <ellipse cx={240} cy={66} rx={190} ry={34} fill="url(#dvBcdGrad)" stroke={INK} strokeWidth={1.4} />
      {[[60, 62], [58, 70], [64, 66], [66, 58], [66, 74]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} fill={BLUE} />)}
      {[[420, 62], [422, 70], [416, 66], [414, 58], [414, 74]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} fill={ORANGE} />)}

      <line x1={50} y1={120} x2={50} y2={210} stroke={INK} strokeWidth={1.2} />
      <line x1={50} y1={210} x2={430} y2={210} stroke={INK} strokeWidth={1.2} />
      <He x={34} y={166} size={9.5} rotate={-90}>ריכוז</He>
      <polyline points={bcd.join(" ")} fill="none" stroke={BLUE} strokeWidth={2.2} />
      <polyline points={nos.join(" ")} fill="none" stroke={ORANGE} strokeWidth={2.2} />
      <line x1={50} y1={180} x2={430} y2={180} stroke={MUTED} strokeWidth={1} strokeDasharray="5 4" />
      <La x={112} y={140} size={10} color={BLUE} anchor="start">Bicoid</La>
      <La x={400} y={160} size={10} color={ORANGE}>Nanos</La>
      <He x={290} y={175} size={9.5} color={MUTED}>סף להפעלת hunchback</He>
      <He x={56} y={226} size={10}>קדמי</He>
      <He x={424} y={226} size={10}>אחורי</He>
    </Svg>
  );
}

function SegmentationCascade() {
  const rows = [40, 108, 176, 244];
  return (
    <Svg h={282} label="מפל קביעת המקטעים בזבוב, מלמעלה למטה: גנים אימהיים יוצרים מפלים; גני פער מתבטאים באזורים רחבים; גני זוג-כלל ב-7 פסים; גני קוטביות המקטע ב-14 פסים.">
      <defs>
        <linearGradient id="dvBcdGrad2" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={BLUE} stopOpacity={0.7} />
          <stop offset="0.6" stopColor={BLUE} stopOpacity={0.02} />
          <stop offset="0.85" stopColor={ORANGE} stopOpacity={0.02} />
          <stop offset="1" stopColor={ORANGE} stopOpacity={0.5} />
        </linearGradient>
      </defs>
      <He x={440} y={rows[0] - 8} size={10.5} anchor="end" bold>גנים אימהיים — מפלים (bicoid, nanos)</He>
      <rect x={40} y={rows[0]} width={400} height={26} rx={13} fill="url(#dvBcdGrad2)" stroke={INK} strokeWidth={1.2} />

      <He x={440} y={rows[1] - 8} size={10.5} anchor="end" bold>גני פער — אזורים רחבים</He>
      <rect x={40} y={rows[1]} width={400} height={26} rx={13} fill="white" stroke={INK} strokeWidth={1.2} />
      {([[52, 186, FILL.blue, "hb"], [138, 178, FILL.purple, "gt"], [196, 274, FILL.green, "Kr"], [290, 352, FILL.orange, "kni"], [360, 404, FILL.purple, "gt"], [412, 436, FILL.blue, "hb"]] as [number, number, string, string][]).map(([a, b, f, t]) => (
        <g key={t}>
          <rect x={a} y={rows[1] + 4} width={b - a} height={18} rx={6} fill={f} />
          <La x={(a + b) / 2} y={rows[1] + 17} size={9.5}>{t}</La>
        </g>
      ))}

      <He x={440} y={rows[2] - 8} size={10.5} anchor="end" bold>גני זוג-כלל — 7 פסים (eve, ftz)</He>
      <rect x={40} y={rows[2]} width={400} height={26} rx={13} fill="white" stroke={INK} strokeWidth={1.2} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={86 + i * 48} y={rows[2] + 3} width={18} height={20} fill={FILL.red} />)}

      <He x={440} y={rows[3] - 8} size={10.5} anchor="end" bold>גני קוטביות המקטע — 14 פסים (engrailed)</He>
      <rect x={40} y={rows[3]} width={400} height={26} rx={13} fill="white" stroke={INK} strokeWidth={1.2} />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={82 + i * 24} y={rows[3] + 3} width={7} height={20} fill={TEAL} opacity={0.55} />)}

      {[0, 1, 2].map((i) => <Arrow key={i} x1={20} y1={rows[i] + 28} x2={20} y2={rows[i + 1] - 2} color={MUTED} />)}
      <He x={40} y={278} size={9.5} color={MUTED} anchor="start">קדמי</He>
      <He x={440} y={278} size={9.5} color={MUTED} anchor="end">אחורי</He>
    </Svg>
  );
}

// ── dv-hox ───────────────────────────────────────────────────────────────────
const HOXC = { lab: PURPLE, pb: PINK, Dfd: TEAL, Scr: GREEN, Antp: BLUE, Ubx: ORANGE, abdA: RED, AbdB: GOLD };
function HoxCluster() {
  const fly: [string, string, number][] = [["lab", HOXC.lab, 20], ["pb", HOXC.pb, 72], ["Dfd", HOXC.Dfd, 124], ["Scr", HOXC.Scr, 176], ["Antp", HOXC.Antp, 228], ["Ubx", HOXC.Ubx, 312], ["abd-A", HOXC.abdA, 364], ["Abd-B", HOXC.AbdB, 416]];
  const seg: [string, string][] = [["", HOXC.lab], ["", HOXC.Dfd], ["", HOXC.Scr], ["T1", HOXC.Scr], ["T2", HOXC.Antp], ["T3", HOXC.Ubx], ["A1", HOXC.Ubx], ["A2", HOXC.abdA], ["A3", HOXC.abdA], ["A4", HOXC.abdA], ["A5", HOXC.AbdB], ["A6", HOXC.AbdB], ["A7", HOXC.AbdB], ["A8", HOXC.AbdB]];
  const mouse: [string, number[]][] = [["Hoxa", [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 13]], ["Hoxb", [1, 2, 3, 4, 5, 6, 7, 8, 9, 13]], ["Hoxc", [4, 5, 6, 8, 9, 10, 11, 12, 13]], ["Hoxd", [1, 3, 4, 8, 9, 10, 11, 12, 13]]];
  const pc = (n: number) => (n === 1 ? HOXC.lab : n === 2 ? HOXC.pb : n === 3 ? MUTED : n === 4 ? HOXC.Dfd : n === 5 ? HOXC.Scr : n <= 8 ? HOXC.Antp : HOXC.AbdB);
  const sw = 440 / seg.length;
  return (
    <Svg h={300} label="גני Hox: למעלה, שמונת הגנים של הזבוב בשני אשכולות (Antennapedia ו-Bithorax) בסדר שעל הכרומוזום; מתחת, אזורי הגוף של הזבוב בצבע הגן שקובע את זהותם — אותו סדר. למטה, ארבעת אשכולות Hox של העכבר (a עד d) עם 13 קבוצות פרלוגיות, בצבע הגן המקביל בזבוב.">
      <La x={150} y={20} size={10} color={MUTED}>ANT-C</La>
      <La x={390} y={20} size={10} color={MUTED}>BX-C</La>
      <rect x={20} y={40} width={256} height={4} fill="#cbd5e1" />
      <rect x={312} y={40} width={148} height={4} fill="#cbd5e1" />
      {fly.map(([t, c, x]) => (
        <g key={t}>
          <rect x={x} y={30} width={44} height={24} rx={5} fill="white" stroke={c} strokeWidth={1.8} />
          <La x={x + 22} y={46} size={9.5} color={c} bold>{t}</La>
        </g>
      ))}
      {seg.map(([t, c], i) => (
        <g key={i}>
          <rect x={20 + i * sw} y={74} width={sw - 2} height={28} rx={4} fill={c} opacity={0.35} />
          {t && <La x={20 + i * sw + sw / 2 - 1} y={118} size={9} color={MUTED}>{t}</La>}
        </g>
      ))}
      <He x={20 + 1.5 * sw} y={118} size={9} color={MUTED}>ראש</He>
      <He x={240} y={138} size={9.5} color={MUTED}>אזורי הגוף בזבוב (מקדימה לאחור)</He>

      {Array.from({ length: 13 }, (_, i) => <La key={i} x={74 + i * 31} y={164} size={9} color={MUTED}>{i + 1}</La>)}
      {mouse.map(([name, has], r) => (
        <g key={name}>
          <La x={52} y={186 + r * 24} size={10} anchor="end">{name}</La>
          {has.map((n) => <rect key={n} x={60 + (n - 1) * 31} y={172 + r * 24} width={27} height={18} rx={4} fill={pc(n)} opacity={0.4} />)}
        </g>
      ))}
      <He x={60} y={288} size={9.5} color={MUTED} anchor="start">3′ · קדמי · מוקדם</He>
      <He x={462} y={288} size={9.5} color={MUTED} anchor="end">5′ · אחורי · מאוחר</He>
    </Svg>
  );
}

// ── dv-fly-organs ────────────────────────────────────────────────────────────
function ImaginalDiscs() {
  return (
    <Svg h={226} label="הדיסקות הדמיוניות בזחל הזבוב: זוגות של דיסקות עין-מחוש, כנף ומשקולת ושלושה זוגות של דיסקות רגל; דיסקת איברי המין בודדת. בגלגול, בהשפעת אקדיזון, כל דיסקה יוצרת את החלק המתאים בבוגר — בצבע זהה.">
      <ellipse cx={140} cy={110} rx={116} ry={52} fill={FILL.cyto} stroke={ORANGE} strokeWidth={1.4} />
      <ellipse cx={52} cy={110} rx={12} ry={8} fill={FILL.red} stroke={RED} strokeWidth={1} />
      <ellipse cx={128} cy={84} rx={13} ry={8} fill={FILL.blue} stroke={BLUE} strokeWidth={1} />
      <ellipse cx={170} cy={86} rx={7} ry={5} fill={FILL.purple} stroke={PURPLE} strokeWidth={1} />
      {[104, 128, 152].map((x) => <circle key={x} cx={x} cy={134} r={7} fill={FILL.green} stroke={GREEN} strokeWidth={1} />)}
      <ellipse cx={232} cy={110} rx={8} ry={6} fill={FILL.yellow} stroke={GOLD} strokeWidth={1} />
      <He x={46} y={30} size={10}>עין-מחוש</He>
      <Lead x1={48} y1={36} x2={52} y2={100} />
      <He x={124} y={30} size={10}>כנף</He>
      <Lead x1={124} y1={36} x2={127} y2={74} />
      <He x={180} y={30} size={10}>משקולת</He>
      <Lead x1={178} y1={36} x2={171} y2={80} />
      <He x={128} y={190} size={10}>רגליים</He>
      <Lead x1={128} y1={180} x2={128} y2={142} />
      <He x={236} y={190} size={10}>איברי מין</He>
      <Lead x1={236} y1={180} x2={232} y2={117} />

      <Arrow x1={262} y1={112} x2={290} y2={112} color={MUTED} />
      <He x={276} y={98} size={9.5} color={MUTED}>גלגול</He>

      <ellipse cx={352} cy={66} rx={38} ry={11} fill={FILL.blue} stroke={BLUE} strokeWidth={1} transform="rotate(-18 352 66)" />
      {[[332, 126], [346, 128], [360, 126]].map(([x, y], i) => <line key={i} x1={x} y1={120} x2={x - 8 + i * 8} y2={y + 26} stroke={GREEN} strokeWidth={2.4} />)}
      <circle cx={308} cy={108} r={14} fill={FILL.red} stroke={RED} strokeWidth={1.2} />
      <ellipse cx={344} cy={110} rx={22} ry={15} fill={FILL.gray} stroke={MUTED} strokeWidth={1.2} />
      <circle cx={368} cy={96} r={4} fill={FILL.purple} stroke={PURPLE} strokeWidth={1} />
      <ellipse cx={398} cy={114} rx={32} ry={14} fill={FILL.gray} stroke={MUTED} strokeWidth={1.2} />
      <circle cx={430} cy={116} r={6} fill={FILL.yellow} stroke={GOLD} strokeWidth={1} />
      <He x={140} y={214} size={9.5} color={MUTED}>זחל</He>
      <He x={370} y={214} size={9.5} color={MUTED}>בוגר</He>
    </Svg>
  );
}

function WingDisc() {
  const pts: string[] = [];
  for (let x = 290; x <= 470; x += 4) pts.push(`${x},${(200 - 110 * Math.exp(-Math.abs(x - 380) / 35)).toFixed(1)}`);
  return (
    <Svg h={240} label="דיסקת הכנף: החלק האחורי (כחול) מבטא engrailed ומפריש Hedgehog; בפס צר בחלק הקדמי, צמוד לגבול, נדלק dpp (כתום); בגבול הגבי-בטני — wingless (ירוק). בגרף מימין — מפל Dpp משני צדי הפס, ושני ספים שמדליקים spalt (קרוב) ו-omb (רחוק יותר). סכמטי.">
      <defs>
        <clipPath id="dvDiscClip"><ellipse cx={150} cy={125} rx={115} ry={88} /></clipPath>
      </defs>
      <ellipse cx={150} cy={125} rx={115} ry={88} fill="white" />
      <g clipPath="url(#dvDiscClip)">
        <rect x={165} y={30} width={110} height={200} fill={FILL.blue} />
        <rect x={150} y={30} width={15} height={200} fill="#fdba74" />
        <rect x={30} y={120} width={240} height={10} fill="#86efac" />
      </g>
      <ellipse cx={150} cy={125} rx={115} ry={88} fill="none" stroke={INK} strokeWidth={1.4} />
      <La x={90} y={92} size={13} bold color={MUTED}>A</La>
      <La x={214} y={92} size={13} bold color={BLUE}>P</La>
      <La x={214} y={172} size={9.5} color={BLUE}>engrailed, Hh</La>
      <La x={150} y={20} size={10} color={ORANGE}>dpp</La>
      <Lead x1={152} y1={24} x2={157} y2={50} />
      <La x={70} y={232} size={10} color={GREEN}>wingless</La>
      <Lead x1={74} y1={222} x2={82} y2={131} />

      <He x={380} y={40} size={11} bold>מפל Dpp</He>
      <line x1={290} y1={200} x2={470} y2={200} stroke={INK} strokeWidth={1.2} />
      <polyline points={pts.join(" ")} fill="none" stroke={ORANGE} strokeWidth={2.2} />
      <line x1={290} y1={145} x2={470} y2={145} stroke={MUTED} strokeWidth={1} strokeDasharray="5 4" />
      <line x1={290} y1={178} x2={470} y2={178} stroke={MUTED} strokeWidth={1} strokeDasharray="5 4" />
      <La x={292} y={140} size={9.5} anchor="start">spalt</La>
      <La x={292} y={173} size={9.5} anchor="start">omb</La>
      <He x={380} y={216} size={9.5} color={MUTED}>מיקום בדיסקה</He>
      <La x={380} y={232} size={9} color={MUTED}>A/P</La>
    </Svg>
  );
}

function EyeOmmatidium() {
  const dots: [number, number][] = [];
  for (let x = 134; x <= 210; x += 14) for (let y = 70; y <= 160; y += 14) if (((x - 120) / 100) ** 2 + ((y - 115) / 68) ** 2 < 0.85) dots.push([x, y]);
  const cells: [string, number, number, string, string][] = [
    ["R8", 360, 115, RED, FILL.red], ["R2", 338, 88, ORANGE, FILL.orange], ["R5", 338, 142, ORANGE, FILL.orange],
    ["R3", 310, 76, GOLD, FILL.yellow], ["R4", 310, 154, GOLD, FILL.yellow], ["R1", 386, 84, GREEN, FILL.green],
    ["R6", 386, 146, GREEN, FILL.green], ["R7", 394, 115, BLUE, FILL.blue],
  ];
  return (
    <Svg h={236} label="משמאל: דיסקת העין — התלם המורפוגנטי נע מהחלק האחורי קדימה, ומאחוריו נוצרות שורות של אומטידיות. מימין: אומטידיום אחד — R8 נקבע ראשון, ואחריו מגויסים בזוגות R2 ו-R5, R3 ו-R4, R1 ו-R6, ולבסוף R7, כל אחד בצבע לפי סדר הגיוס.">
      <defs>
        <clipPath id="dvEyeClip"><ellipse cx={120} cy={115} rx={100} ry={68} /></clipPath>
      </defs>
      <ellipse cx={120} cy={115} rx={100} ry={68} fill={FILL.cyto} />
      <g clipPath="url(#dvEyeClip)">
        <rect x={112} y={40} width={12} height={160} fill="#cbd5e1" />
      </g>
      {dots.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={4} fill={FILL.red} stroke={RED} strokeWidth={0.8} />)}
      <ellipse cx={120} cy={115} rx={100} ry={68} fill="none" stroke={ORANGE} strokeWidth={1.4} />
      <Arrow x1={150} y1={34} x2={92} y2={34} color={MUTED} />
      <He x={120} y={24} size={9.5} color={MUTED}>התלם נע קדימה</He>
      <He x={60} y={200} size={10}>קדמי</He>
      <He x={180} y={200} size={10}>אחורי</He>

      {cells.map(([t, x, y, c, f]) => (
        <g key={t}>
          <circle cx={x} cy={y} r={13} fill={f} stroke={c} strokeWidth={1.4} />
          <La x={x} y={y + 3.5} size={9.5} bold color={c}>{t}</La>
        </g>
      ))}
      <He x={352} y={192} size={9.5}>סדר הגיוס (משמאל לימין):</He>
      <La x={352} y={208} size={9.5}>R8 → R2,R5 → R3,R4 → R1,R6 → R7</La>
      <He x={352} y={226} size={9.5} color={MUTED}>R7 נקבע בעזרת Boss (על R8) ו-Sevenless</He>
    </Svg>
  );
}

// ── dv-worm ──────────────────────────────────────────────────────────────────
function WormPar() {
  return (
    <Svg h={188} label="קיטוב הזיגוטה של הנמטודה: (1) הצנטרוזום של הזרעון מסמן את הקוטב האחורי, והקורטקס זורם קדימה; (2) חלבוני PAR-3 ו-PAR-6 בקורטקס הקדמי, PAR-1 ו-PAR-2 באחורי; (3) החלוקה הראשונה לא שווה — AB גדול קדמי ו-P1 קטן אחורי.">
      <ellipse cx={80} cy={90} rx={64} ry={40} fill={FILL.cyto} stroke={INK} strokeWidth={1.4} />
      <circle cx={136} cy={90} r={5} fill={RED} />
      <Arrow x1={110} y1={64} x2={56} y2={64} color={ORANGE} width={1.4} />
      <Arrow x1={110} y1={116} x2={56} y2={116} color={ORANGE} width={1.4} />
      <He x={80} y={38} size={9.5} color={ORANGE}>זרימת הקורטקס</He>
      <He x={104} y={142} size={9.5}>צנטרוזום הזרעון</He>
      <Lead x1={128} y1={130} x2={135} y2={97} />

      <ellipse cx={240} cy={90} rx={64} ry={40} fill={FILL.cyto} />
      <path d="M240 50 A64 40 0 0 0 240 130" fill="none" stroke={BLUE} strokeWidth={7} />
      <path d="M240 50 A64 40 0 0 1 240 130" fill="none" stroke={ORANGE} strokeWidth={7} />
      <La x={200} y={38} size={9.5} color={BLUE}>PAR-3/6</La>
      <La x={282} y={38} size={9.5} color={ORANGE}>PAR-1/2</La>

      <ellipse cx={382} cy={90} rx={38} ry={34} fill={FILL.cyto} stroke={INK} strokeWidth={1.4} />
      <ellipse cx={442} cy={90} rx={22} ry={26} fill={FILL.orange} stroke={INK} strokeWidth={1.4} />
      <La x={382} y={94} size={12} bold>AB</La>
      <La x={442} y={94} size={11} bold>P1</La>

      <He x={80} y={168} size={10} color={MUTED}>1. הזרעון קובע אחורי</He>
      <He x={240} y={168} size={10} color={MUTED}>2. חלבוני PAR מתקטבים</He>
      <He x={410} y={168} size={10} color={MUTED}>3. חלוקה לא שווה</He>
      <He x={18} y={184} size={9} color={MUTED} anchor="start">קדמי — משמאל</He>
    </Svg>
  );
}

function WormGonad() {
  const oocytes = [104, 126, 148, 170, 192, 214];
  return (
    <Svg h={226} label="הגונדה של הרמפרודיט: שתי זרועות בצורת U שנפגשות ברחם במרכז, מעל הפות. בקצה כל זרוע — תא הקצה (DTC); לידו תאי גזע (ירוק), בהמשך תאים במיוזה (סגול), ובחלק הבטני ביציות שהולכות וגדלות לכיוון הרחם.">
      <ellipse cx={240} cy={120} rx={222} ry={80} fill="#fafaf9" stroke={MUTED} strokeWidth={1} />
      <path d="M230 142 L96 142 Q62 142 62 116 Q62 90 96 90 L150 90" fill="none" stroke="#c4b5fd" strokeWidth={12} />
      <path d="M150 90 L192 90" fill="none" stroke="#86efac" strokeWidth={12} />
      <path d="M250 142 L384 142 Q418 142 418 116 Q418 90 384 90 L330 90" fill="none" stroke="#c4b5fd" strokeWidth={12} />
      <path d="M330 90 L288 90" fill="none" stroke="#86efac" strokeWidth={12} />
      {oocytes.map((x, i) => <circle key={x} cx={x} cy={142} r={4 + i * 0.6} fill={FILL.orange} stroke={ORANGE} strokeWidth={0.8} />)}
      {oocytes.map((x, i) => <circle key={`r${x}`} cx={480 - x} cy={142} r={4 + i * 0.6} fill={FILL.orange} stroke={ORANGE} strokeWidth={0.8} />)}
      <circle cx={198} cy={90} r={7} fill={RED} />
      <circle cx={282} cy={90} r={7} fill={RED} />
      <ellipse cx={240} cy={142} rx={16} ry={11} fill={FILL.yellow} stroke={GOLD} strokeWidth={1.2} />
      <path d="M232 154 L240 168 L248 154" fill="none" stroke={INK} strokeWidth={1.4} />

      <He x={240} y={60} size={10} color={RED}>תא הקצה (DTC)</He>
      <Lead x1={226} y1={64} x2={203} y2={84} />
      <Lead x1={254} y1={64} x2={277} y2={84} />
      <He x={166} y={74} size={9.5} color={GREEN}>תאי גזע</He>
      <He x={104} y={74} size={9.5} color={PURPLE}>מיוזה</He>
      <He x={150} y={170} size={9.5} color={ORANGE}>ביציות</He>
      <He x={240} y={124} size={9.5} color={GOLD}>רחם</He>
      <He x={240} y={186} size={9.5}>פות</He>
      <He x={240} y={218} size={9} color={MUTED}>צד גבי — למעלה · צד בטני — למטה</He>
    </Svg>
  );
}

function VulvaInduction() {
  const P = [30, 100, 170, 240, 310, 380];
  const fate = ["3°", "3°", "2°", "1°", "2°", "3°"];
  const fc = [MUTED, MUTED, BLUE, RED, BLUE, MUTED];
  return (
    <Svg h={230} label="השראת הפות בנמטודה: תא העוגן מעל P6.p מפריש LIN-3 (EGF); התא הקרוב ביותר (P6.p) מקבל הכי הרבה אות והופך ל-1°. הוא מאותת לשכניו P5.p ו-P7.p דרך LIN-12 (Notch) — והם הופכים ל-2°. התאים הרחוקים (P3.p, P4.p, P8.p) — 3°.">
      <circle cx={240} cy={58} r={16} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.6} />
      <He x={218} y={62} size={10} anchor="end" color={PURPLE}>תא העוגן</He>
      <La x={262} y={62} size={10} anchor="start" color={PURPLE}>LIN-3 (EGF)</La>
      <Arrow x1={240} y1={76} x2={240} y2={126} color={PURPLE} width={2.6} />
      <Arrow x1={232} y1={76} x2={180} y2={128} color={PURPLE} width={1.6} />
      <Arrow x1={248} y1={76} x2={300} y2={128} color={PURPLE} width={1.6} />
      <Arrow x1={226} y1={72} x2={112} y2={132} color={PURPLE} width={1} dashed />
      <Arrow x1={254} y1={72} x2={368} y2={132} color={PURPLE} width={1} dashed />
      {P.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={150} r={20} fill={i === 3 ? FILL.red : i === 2 || i === 4 ? FILL.blue : FILL.gray} stroke={fc[i]} strokeWidth={1.4} />
          <La x={x} y={154} size={9.5}>{`P${i + 3}.p`}</La>
          <La x={x} y={208} size={12} bold color={fc[i]}>{fate[i]}</La>
        </g>
      ))}
      <Arrow x1={220} y1={150} x2={192} y2={150} color={BLUE} />
      <Arrow x1={260} y1={150} x2={288} y2={150} color={BLUE} />
      <La x={205} y={182} size={9} color={BLUE}>LIN-12</La>
      <La x={275} y={182} size={9} color={BLUE}>LIN-12</La>
    </Svg>
  );
}

// ── dv-vertebrate-axes ───────────────────────────────────────────────────────
function ChickStreak() {
  const disc = (cx: number) => (
    <g>
      <ellipse cx={cx} cy={105} rx={66} ry={80} fill={FILL.yellow} stroke={GOLD} strokeWidth={1.2} />
      <ellipse cx={cx} cy={105} rx={44} ry={58} fill="white" stroke={GOLD} strokeWidth={1} />
    </g>
  );
  return (
    <Svg h={250} label="עובר העוף במבט מלמעלה (למעלה — קדמי): לפני הפס — אזור שולי אחורי שמבטא Vg1 ו-Nodal; הפס מתארך קדימה, ותאים זורמים מהצדדים לקו האמצע; בפס המלא — קשר הנסן בקצה הקדמי.">
      {disc(80)}
      <path d="M46 150 Q80 176 114 150 Q80 166 46 150 Z" fill="#fdba74" />
      <He x={80} y={208} size={9.5} color={ORANGE}>אזור שולי אחורי</He>
      <Lead x1={80} y1={198} x2={80} y2={166} />

      {disc(240)}
      <rect x={237} y={122} width={6} height={42} fill={RED} />
      <path d="M210 160 Q216 138 232 128" fill="none" stroke={MUTED} strokeWidth={1.2} markerEnd="url(#bfArrow)" />
      <path d="M270 160 Q264 138 248 128" fill="none" stroke={MUTED} strokeWidth={1.2} markerEnd="url(#bfArrow)" />
      <He x={240} y={208} size={9.5} color={MUTED}>תאים זורמים לקו האמצע</He>

      {disc(400)}
      <rect x={397} y={70} width={6} height={94} fill={RED} />
      <circle cx={400} cy={66} r={7} fill={PURPLE} />
      <He x={400} y={14} size={9.5} color={PURPLE}>קשר הנסן</He>
      <Lead x1={400} y1={18} x2={400} y2={58} />
      <He x={400} y={208} size={9.5} color={RED}>הפס הקדמון</He>
      <Lead x1={400} y1={198} x2={400} y2={168} />

      <He x={80} y={234} size={10} bold>לפני הפס</He>
      <He x={240} y={234} size={10} bold>הפס מתארך</He>
      <He x={400} y={234} size={10} bold>פס מלא</He>
    </Svg>
  );
}

function MouseBlastocyst() {
  return (
    <Svg h={196} label="ההתפתחות המוקדמת של העכבר: 8 תאים; דחיסה — תאים חיצוניים (טרופואקטודרם, Cdx2) ופנימיים; בלסטוציסט — דופן של טרופואקטודרם, מסת התאים הפנימית (ICM) וחלל; כוס העובר — אפיבלסט (ירוק) עטוף אנדודרם, וה-AVE (אדום) בצד שיהיה קדמי, והפס נוצר בצד הנגדי.">
      {[[48, 83], [72, 83], [48, 107], [72, 107]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={13} fill={FILL.gray} stroke={MUTED} strokeWidth={1.2} />)}
      <Arrow x1={92} y1={95} x2={142} y2={95} color={MUTED} />
      <circle cx={180} cy={95} r={32} fill={FILL.sky} stroke="#0284c7" strokeWidth={1.4} />
      {[[172, 90], [190, 92], [180, 106]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={8} fill={FILL.green} stroke={GREEN} strokeWidth={1} />)}
      <Arrow x1={216} y1={95} x2={256} y2={95} color={MUTED} />
      <circle cx={300} cy={95} r={38} fill="white" stroke="#7dd3fc" strokeWidth={7} />
      <ellipse cx={300} cy={72} rx={20} ry={12} fill={FILL.green} stroke={GREEN} strokeWidth={1} />
      <La x={300} y={75} size={9} color={GREEN} bold>ICM</La>
      <He x={300} y={110} size={9}>חלל</He>
      <Arrow x1={344} y1={95} x2={382} y2={95} color={MUTED} />
      <path d="M392 46 L392 108 Q392 140 420 140 Q448 140 448 108 L448 46" fill={FILL.yellow} stroke={GOLD} strokeWidth={1.2} />
      <path d="M402 56 L402 106 Q402 128 420 128 Q438 128 438 106 L438 56" fill={FILL.green} stroke={GREEN} strokeWidth={1.2} />
      <ellipse cx={394} cy={118} rx={7} ry={12} fill="#fca5a5" />
      <rect x={442} y={92} width={5} height={24} fill={ORANGE} />
      <La x={372} y={128} size={9.5} color={RED} anchor="end">AVE</La>
      <He x={466} y={108} size={9.5} color={ORANGE} anchor="start">פס</He>

      <He x={60} y={166} size={10} bold>8 תאים</He>
      <He x={180} y={166} size={10} bold>דחיסה</He>
      <He x={300} y={166} size={10} bold>בלסטוציסט</He>
      <He x={420} y={166} size={10} bold>כוס העובר</He>
      <He x={180} y={184} size={9} color={MUTED}>חוץ — Cdx2</He>
      <He x={300} y={184} size={9} color={MUTED}>דופן — טרופואקטודרם</He>
      <He x={420} y={184} size={9} color={MUTED}>AVE — הצד הקדמי</He>
    </Svg>
  );
}

function NodalFlow() {
  const cilia = [52, 82, 112, 142, 172];
  return (
    <Svg h={226} label="קביעת צד שמאל בעכבר: משמאל — בבור הקשר ריסים נוטים אחורה ומסתובבים, ויוצרים זרימה של נוזל לצד שמאל. מימין — העובר: Nodal ו-Pitx2 נדלקים בלוחית הצדית השמאלית בלבד, ו-Lefty בקו האמצע משמש מחסום. בציור, השמאל של העובר משמאל.">
      <He x={118} y={20} size={11} bold>הקשר: זרימה שמאלה</He>
      <Arrow x1={200} y1={62} x2={40} y2={62} color={BLUE} width={2.6} />
      <path d="M24 84 L24 120 Q24 136 44 136 L196 136 Q214 136 214 120 L214 84" fill="none" stroke={INK} strokeWidth={1.4} />
      {cilia.map((x) => (
        <g key={x}>
          <line x1={x} y1={134} x2={x + 10} y2={100} stroke={PURPLE} strokeWidth={2} />
          <ellipse cx={x + 10} cy={98} rx={8} ry={3} fill="none" stroke={PURPLE} strokeWidth={1} />
        </g>
      ))}
      <He x={118} y={160} size={9.5} color={PURPLE}>ריסים נוטים ומסתובבים</He>
      <He x={32} y={186} size={10} bold>שמאל</He>
      <He x={206} y={186} size={10} bold>ימין</He>

      <ellipse cx={360} cy={112} rx={60} ry={86} fill={FILL.cyto} stroke={INK} strokeWidth={1.4} />
      <rect x={357} y={40} width={6} height={144} fill="#c4b5fd" />
      <ellipse cx={326} cy={120} rx={11} ry={48} fill="#fca5a5" />
      <path d="M330 52 Q318 60 326 72 Q338 70 336 58 Z" fill={RED} />
      <He x={288} y={34} size={9.5} color={RED}>Nodal ← Pitx2</He>
      <Lead x1={300} y1={40} x2={322} y2={84} />
      <He x={440} y={34} size={9.5} color={PURPLE}>Lefty (מחסום)</He>
      <Lead x1={430} y1={40} x2={364} y2={74} />
      <He x={326} y={216} size={10} bold>שמאל</He>
      <He x={400} y={216} size={10} bold>ימין</He>
    </Svg>
  );
}

// ── dv-limb ──────────────────────────────────────────────────────────────────
function LimbAxes() {
  return (
    <Svg h={250} label="ניצן הגפה ושלושת הצירים: הרכס האקטודרמלי בקצה (AER, כתום) מפריש FGF — ציר קרוב-רחוק; אזור הפעילות המקוטבת (ZPA, כחול) בצד האחורי מפריש Shh — ציר קדמי-אחורי; Wnt7a באקטודרם הגבי — ציר גבי-גחוני. מימין: שלושת המקטעים של שלד הגפה וגני Hox של כל אחד.">
      <rect x={40} y={30} width={16} height={184} fill="#e2e8f0" />
      <path d="M56 48 Q250 38 250 120 Q250 202 56 192 Z" fill={FILL.yellow} stroke={GOLD} strokeWidth={1.2} />
      <path d="M200 52 Q248 68 248 120 Q248 172 200 188" fill="none" stroke={ORANGE} strokeWidth={6} />
      <ellipse cx={168} cy={170} rx={36} ry={13} fill={FILL.blue} stroke={BLUE} strokeWidth={1} />
      <La x={168} y={173} size={9} color={BLUE} bold>ZPA · Shh</La>
      <La x={264} y={62} size={9.5} color={ORANGE} anchor="start">AER</La>
      <La x={264} y={76} size={9.5} color={ORANGE} anchor="start">FGF</La>
      <Lead x1={262} y1={66} x2={240} y2={78} />
      <Arrow x1={80} y1={112} x2={204} y2={112} color={INK} width={1.4} />
      <He x={90} y={102} size={9.5}>קרוב</He>
      <He x={194} y={102} size={9.5}>רחוק</He>
      <Arrow x1={120} y1={62} x2={120} y2={152} color={INK} width={1.4} />
      <He x={120} y={24} size={9.5}>קדמי</He>
      <He x={120} y={226} size={9.5}>אחורי</He>
      <He x={150} y={246} size={9} color={MUTED}>גבי-גחוני: Wnt7a באקטודרם הגבי (מעל הדף)</He>

      <rect x={322} y={112} width={50} height={12} rx={6} fill={FILL.purple} stroke={PURPLE} strokeWidth={1} />
      <rect x={378} y={102} width={40} height={8} rx={4} fill={FILL.green} stroke={GREEN} strokeWidth={1} />
      <rect x={378} y={126} width={40} height={8} rx={4} fill={FILL.green} stroke={GREEN} strokeWidth={1} />
      {[106, 118, 130].map((y) => <circle key={y} cx={428} cy={y} r={4} fill={FILL.orange} stroke={ORANGE} strokeWidth={1} />)}
      {[96, 116, 136].map((y) => <rect key={y} x={438} y={y} width={32} height={6} rx={3} fill={FILL.orange} stroke={ORANGE} strokeWidth={1} />)}
      <He x={347} y={96} size={9.5} color={PURPLE}>סטילופוד</He>
      <He x={398} y={84} size={9.5} color={GREEN}>זאוגופוד</He>
      <He x={452} y={74} size={9.5} color={ORANGE}>אוטופוד</He>
      <La x={347} y={150} size={9.5} color={PURPLE}>Hox10</La>
      <La x={398} y={156} size={9.5} color={GREEN}>Hox11</La>
      <La x={452} y={164} size={9.5} color={ORANGE}>Hox13</La>
    </Svg>
  );
}

function AerZpaExperiments() {
  const limb = (x: number, y: number, stage: number) => (
    <g>
      <rect x={x} y={y} width={44} height={10} rx={5} fill={FILL.purple} stroke={PURPLE} strokeWidth={1} />
      {stage >= 2 && <rect x={x + 48} y={y - 6} width={34} height={6} rx={3} fill={FILL.green} stroke={GREEN} strokeWidth={1} />}
      {stage >= 2 && <rect x={x + 48} y={y + 10} width={34} height={6} rx={3} fill={FILL.green} stroke={GREEN} strokeWidth={1} />}
      {stage >= 3 && [-8, 5, 18].map((d) => <rect key={d} x={x + 86} y={y + d - 2} width={18} height={5} rx={2.5} fill={FILL.orange} stroke={ORANGE} strokeWidth={1} />)}
    </g>
  );
  const digit = (x: number, n: number, base: number) => {
    const h = n === 2 ? 24 : n === 3 ? 40 : 32;
    return (
      <g key={`${x}`}>
        <rect x={x - 5} y={base - h} width={10} height={h} rx={5} fill={FILL.orange} stroke={ORANGE} strokeWidth={1} />
        <La x={x} y={base - h - 6} size={10} bold>{n}</La>
      </g>
    );
  };
  return (
    <Svg h={262} label="ניסויי הגפה: למעלה — הסרת ה-AER בשלבים שונים: הסרה מוקדמת משאירה רק את עצם הזרוע, מאוחרת יותר — גם את האמה, ומאוחרת — כמעט הכול. למטה — כנף רגילה עם אצבעות 2, 3, 4, ולעומתה השתלת ZPA בצד הקדמי שיוצרת אצבעות 4-3-2-2-3-4 — הכפלה במראה.">
      <He x={240} y={16} size={11} bold>הסרת ה-AER — הגפה נקטעת מהקצה</He>
      {limb(24, 54, 1)}
      {limb(184, 54, 2)}
      {limb(344, 54, 3)}
      <He x={80} y={98} size={9.5} color={MUTED}>הסרה מוקדמת</He>
      <He x={240} y={98} size={9.5} color={MUTED}>הסרה מאוחרת יותר</He>
      <He x={400} y={98} size={9.5} color={MUTED}>הסרה מאוחרת</He>

      <He x={240} y={134} size={11} bold>השתלת ZPA בצד הקדמי — הכפלה במראה</He>
      <rect x={40} y={216} width={120} height={14} rx={7} fill={FILL.yellow} stroke={GOLD} strokeWidth={1} />
      {[[70, 2], [100, 3], [130, 4]].map(([x, n]) => digit(x, n, 214))}
      <circle cx={156} cy={240} r={6} fill={BLUE} />
      <rect x={250} y={216} width={200} height={14} rx={7} fill={FILL.yellow} stroke={GOLD} strokeWidth={1} />
      {[[270, 4], [302, 3], [334, 2], [366, 2], [398, 3], [430, 4]].map(([x, n]) => digit(x, n, 214))}
      <circle cx={254} cy={240} r={6} fill={BLUE} />
      <circle cx={446} cy={240} r={6} fill={BLUE} />
      <He x={100} y={256} size={9.5} color={MUTED}>רגיל</He>
      <He x={350} y={256} size={9.5} color={MUTED}>עם ZPA נוסף (כחול)</He>
      <He x={40} y={162} size={9} color={MUTED} anchor="start">קדמי</He>
      <He x={160} y={162} size={9} color={MUTED} anchor="end">אחורי</He>
    </Svg>
  );
}

// ── dv-genes ─────────────────────────────────────────────────────────────────
function ForwardReverse() {
  const X = [366, 246, 126, 6];
  const fw: [string, string][] = [["מוטגנזה", "אקראית (EMS)"], ["סריקה:", "מחפשים פגם"], ["מיפוי /", "ריצוף"], ["הגן", "שנפגע"]];
  const rv: [string, string][] = [["גן ידוע", "(רצף)"], ["פוגעים בו:", "נוקאאוט / CRISPR"], ["מה השתנה?", "(פנוטיפ)"], ["התפקוד", "של הגן"]];
  return (
    <Svg h={196} label="שתי דרכים לחקור גנים התפתחותיים: גנטיקה קדמית — מוטגנזה אקראית, סריקה לפגם, מיפוי וריצוף, ומציאת הגן; גנטיקה הפוכה — מגן ידוע, פגיעה בו בנוקאאוט או CRISPR, בדיקת הפנוטיפ, והסקת התפקוד.">
      <He x={472} y={22} size={11.5} bold anchor="end" color={BLUE}>גנטיקה קדמית: מפגם לגן</He>
      {fw.map((l, i) => <Box2 key={i} x={X[i]} y={34} w={108} h={44} fill={FILL.blue} stroke={BLUE} lines={l} />)}
      {[0, 1, 2].map((i) => <Arrow key={i} x1={X[i] - 2} y1={56} x2={X[i + 1] + 112} y2={56} color={BLUE} />)}
      <He x={472} y={118} size={11.5} bold anchor="end" color={GREEN}>גנטיקה הפוכה: מגן לתפקוד</He>
      {rv.map((l, i) => <Box2 key={i} x={X[i]} y={130} w={108} h={44} fill={FILL.green} stroke={GREEN} lines={l} />)}
      {[0, 1, 2].map((i) => <Arrow key={i} x1={X[i] - 2} y1={152} x2={X[i + 1] + 112} y2={152} color={GREEN} />)}
    </Svg>
  );
}

function EnhancerLogic() {
  return (
    <Svg h={212} label="האנהנסר של פס 2 של even-skipped: למעלה, אזורי הביטוי של Bicoid (מפל), Hunchback, Giant ו-Krüppel לאורך העובר; פס 2 נוצר רק היכן שיש מפעילים (Bicoid, Hunchback) ואין מדכאים (Giant, Krüppel). למטה, האנהנסר ב-DNA עם אתרי קישור למפעילים (ירוק) ולמדכאים (אדום), ולידו הפרומוטר והגן eve.">
      <defs>
        <linearGradient id="dvBcdGrad3" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={BLUE} stopOpacity={0.7} />
          <stop offset="0.7" stopColor={BLUE} stopOpacity={0.03} />
        </linearGradient>
      </defs>
      <rect x={150} y={24} width={30} height={84} fill={FILL.yellow} />
      <He x={165} y={18} size={9.5} bold>פס 2 של eve</He>
      <La x={36} y={39} size={9.5} anchor="end" color={BLUE}>Bcd</La>
      <rect x={40} y={30} width={400} height={12} rx={4} fill="url(#dvBcdGrad3)" />
      <La x={36} y={59} size={9.5} anchor="end" color={GREEN}>Hb</La>
      <rect x={40} y={50} width={190} height={12} rx={4} fill="#86efac" />
      <La x={36} y={79} size={9.5} anchor="end" color={RED}>Gt</La>
      <rect x={40} y={70} width={106} height={12} rx={4} fill="#fca5a5" />
      <rect x={330} y={70} width={70} height={12} rx={4} fill="#fca5a5" />
      <La x={36} y={99} size={9.5} anchor="end" color={RED}>Kr</La>
      <rect x={184} y={90} width={106} height={12} rx={4} fill="#fca5a5" />
      <He x={420} y={124} size={9} color={MUTED}>אחורי</He>
      <He x={60} y={124} size={9} color={MUTED}>קדמי</He>

      <rect x={20} y={160} width={440} height={4} fill="#cbd5e1" />
      {([[40, "Bcd", true], [86, "Gt", false], [132, "Hb", true], [178, "Kr", false], [224, "Bcd", true]] as [number, string, boolean][]).map(([x, t, act]) => (
        <g key={x}>
          <rect x={x} y={150} width={38} height={24} rx={4} fill={act ? FILL.green : FILL.red} stroke={act ? GREEN : RED} strokeWidth={1.2} />
          <La x={x + 19} y={166} size={9.5} color={act ? GREEN : RED}>{t}</La>
        </g>
      ))}
      <path d="M300 158 L300 140 L322 140" fill="none" stroke={INK} strokeWidth={1.4} markerEnd="url(#bfArrow)" />
      <rect x={330} y={148} width={110} height={28} rx={5} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <La x={385} y={166} size={11} bold color={PURPLE}>eve</La>
      <He x={150} y={196} size={9.5} color={MUTED}>אנהנסר פס 2: ירוק — מפעיל, אדום — מדכא</He>
      <He x={300} y={196} size={9.5} color={MUTED} anchor="start">פרומוטר</He>
    </Svg>
  );
}

function CellSize() {
  const saw = "40,130 100,80 100,130 160,80 160,130 220,80 220,130";
  const small: [number, number][] = [[292, 102], [304, 100], [298, 112], [310, 112], [290, 118], [302, 122], [312, 104], [296, 94]];
  const big: [number, number][] = [[384, 96], [418, 84], [440, 108], [396, 130], [428, 138], [404, 108], [376, 120], [446, 124]];
  return (
    <Svg h={218} label="בקרת גודל התא. משמאל: התא גדל עד גודל סף ואז מתחלק לשניים — גודל ממוצע קבוע (סכמטי). מימין: מודל הדילול בשמרים — מעכב (Whi5) מיוצר בכמות קבועה; בתא קטן הוא מרוכז ומעכב, ובתא שגדל הוא מדולל — והתא נכנס לשלב S.">
      <He x={130} y={22} size={11} bold>גדילה וחלוקה</He>
      <line x1={40} y1={40} x2={40} y2={170} stroke={INK} strokeWidth={1.2} />
      <line x1={40} y1={170} x2={240} y2={170} stroke={INK} strokeWidth={1.2} />
      <He x={24} y={110} size={9.5} rotate={-90}>גודל התא</He>
      <polyline points={saw} fill="none" stroke={TEAL} strokeWidth={2.2} />
      <line x1={40} y1={80} x2={240} y2={80} stroke={MUTED} strokeWidth={1} strokeDasharray="5 4" />
      <He x={66} y={74} size={9.5} color={MUTED}>גודל סף</He>
      <He x={100} y={148} size={9.5} color={TEAL}>חלוקה</He>
      <He x={140} y={186} size={9.5} color={MUTED}>זמן</He>

      <He x={370} y={22} size={11} bold>מודל הדילול (שמרים)</He>
      <circle cx={300} cy={108} r={26} fill={FILL.cyto} stroke={ORANGE} strokeWidth={1.4} />
      {small.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.4} fill={RED} />)}
      <Arrow x1={330} y1={108} x2={362} y2={108} color={MUTED} />
      <He x={346} y={96} size={9} color={MUTED}>גדילה</He>
      <circle cx={410} cy={110} r={44} fill={FILL.cyto} stroke={ORANGE} strokeWidth={1.4} />
      {big.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.4} fill={RED} />)}
      <He x={300} y={172} size={9.5}>Whi5 מרוכז ← עיכוב</He>
      <He x={410} y={172} size={9.5}>Whi5 מדולל ← שלב S</He>
      <He x={240} y={208} size={9.5} color={MUTED}>mTOR וגורמי גדילה ← יותר ייצור חלבון ← התא גדל</He>
    </Svg>
  );
}

// ── dv-regeneration ──────────────────────────────────────────────────────────
function RegenerationTypes() {
  return (
    <Svg h={218} label="שלושה סוגי התחדשות: אפימורפוזיס — בגפת סלמנדרה נוצרת בלסטמה שבונה את החלק החסר; מורפלקסיס — חתיכה של הידרה מתארגנת מחדש להידרה שלמה וקטנה יותר; התחדשות מפצה — אחרי הסרת שתי אונות מהכבד, האונה שנשארה גדלה עד שהמסה חוזרת, בלי שהצורה חוזרת.">
      <He x={80} y={20} size={11.5} bold>אפימורפוזיס</He>
      <rect x={24} y={72} width={48} height={14} rx={4} fill={FILL.pink} stroke={PINK} strokeWidth={1} />
      <circle cx={82} cy={79} r={10} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.2} />
      <He x={82} y={60} size={9.5} color={ORANGE}>בלסטמה</He>
      <Arrow x1={80} y1={104} x2={80} y2={130} color={MUTED} />
      <rect x={20} y={152} width={40} height={12} rx={5} fill={FILL.pink} stroke={PINK} strokeWidth={1} />
      <rect x={64} y={148} width={30} height={6} rx={3} fill={FILL.orange} stroke={ORANGE} strokeWidth={1} />
      <rect x={64} y={162} width={30} height={6} rx={3} fill={FILL.orange} stroke={ORANGE} strokeWidth={1} />
      {[146, 156, 166].map((y) => <rect key={y} x={98} y={y} width={20} height={4} rx={2} fill={FILL.orange} stroke={ORANGE} strokeWidth={1} />)}
      <He x={80} y={202} size={9.5} color={MUTED}>בלסטמה בונה את החסר</He>

      <He x={240} y={20} size={11.5} bold>מורפלקסיס</He>
      <rect x={224} y={44} width={32} height={60} rx={12} fill={FILL.teal} stroke={TEAL} strokeWidth={1.2} />
      {[-14, -5, 5, 14].map((d) => <line key={d} x1={240 + d / 2} y1={46} x2={240 + d * 1.6} y2={30} stroke={TEAL} strokeWidth={1.6} />)}
      <line x1={212} y1={76} x2={268} y2={76} stroke={RED} strokeWidth={1.2} strokeDasharray="4 3" />
      <Arrow x1={240} y1={110} x2={240} y2={130} color={MUTED} />
      <rect x={232} y={150} width={16} height={30} rx={7} fill={FILL.teal} stroke={TEAL} strokeWidth={1.2} />
      {[-8, -3, 3, 8].map((d) => <line key={d} x1={240 + d / 2} y1={151} x2={240 + d * 1.4} y2={141} stroke={TEAL} strokeWidth={1.4} />)}
      <He x={240} y={202} size={9.5} color={MUTED}>ארגון מחדש — קטנה יותר</He>

      <He x={400} y={20} size={11.5} bold>מפצה</He>
      <ellipse cx={368} cy={74} rx={20} ry={16} fill="#fecaca" stroke={RED} strokeWidth={1.2} />
      <ellipse cx={404} cy={70} rx={18} ry={16} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
      <ellipse cx={438} cy={76} rx={18} ry={14} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
      <He x={421} y={46} size={9} color={MUTED}>הוסרו 2/3</He>
      <Arrow x1={400} y1={104} x2={400} y2={130} color={MUTED} />
      <ellipse cx={392} cy={162} rx={38} ry={22} fill="#fecaca" stroke={RED} strokeWidth={1.2} />
      <He x={400} y={202} size={9.5} color={MUTED}>המסה חוזרת, לא הצורה</He>
    </Svg>
  );
}

function Planarian() {
  const neo: [number, number][] = [[110, 62], [126, 80], [146, 66], [170, 84], [186, 60], [196, 76], [262, 60], [276, 82], [292, 66], [318, 58], [330, 80], [350, 66], [368, 78], [384, 64], [120, 72], [208, 64], [300, 84], [340, 72]];
  const piece = (x: number, w: number, head: boolean, tail: boolean, origHead: boolean) => (
    <g>
      <rect x={x} y={150} width={w} height={26} rx={12} fill={FILL.pink} stroke={PINK} strokeWidth={1} />
      {head && <ellipse cx={x - 2} cy={163} rx={12} ry={12} fill={FILL.orange} stroke={ORANGE} strokeWidth={1} />}
      {tail && <ellipse cx={x + w + 2} cy={163} rx={10} ry={9} fill={FILL.orange} stroke={ORANGE} strokeWidth={1} />}
      {(head || origHead) && [157, 169].map((y) => <circle key={y} cx={head ? x - 4 : x + 10} cy={y} r={2} fill={INK} />)}
    </g>
  );
  return (
    <Svg h={212} label="פלנריה: למעלה, תולעת שלמה — נאובלסטים (נקודות סגולות) פזורים בגוף מאחורי הראש, והלוע באמצע; קווים מקווקווים מסמנים חיתוך לשלוש חתיכות. למטה, כל חתיכה מתחדשת — רקמה חדשה (כתום): לראש נוסף זנב, לאמצע נוספים ראש וזנב, לזנב נוסף ראש.">
      <path d="M40 72 Q40 46 72 46 L396 52 Q446 64 400 92 L72 98 Q40 98 40 72 Z" fill={FILL.pink} stroke={PINK} strokeWidth={1.4} />
      {[64, 80].map((y) => <circle key={y} cx={60} cy={y} r={2.6} fill={INK} />)}
      <ellipse cx={230} cy={72} rx={26} ry={7} fill="none" stroke={PINK} strokeWidth={1.2} />
      {neo.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.4} fill={PURPLE} />)}
      <line x1={152} y1={34} x2={152} y2={110} stroke={RED} strokeWidth={1.2} strokeDasharray="4 3" />
      <line x1={308} y1={34} x2={308} y2={110} stroke={RED} strokeWidth={1.2} strokeDasharray="4 3" />
      <He x={152} y={26} size={9.5} color={RED}>חתך</He>
      <He x={308} y={26} size={9.5} color={RED}>חתך</He>
      <He x={392} y={26} size={9.5} color={PURPLE}>נאובלסטים</He>
      <Lead x1={390} y1={30} x2={385} y2={60} />
      <He x={230} y={124} size={9.5} color={PINK}>לוע</He>
      <Lead x1={230} y1={114} x2={230} y2={80} />
      {piece(40, 96, false, true, true)}
      {piece(188, 96, true, true, false)}
      {piece(336, 96, true, false, false)}
      <He x={90} y={202} size={9.5} color={MUTED}>ראש ← זנב חדש</He>
      <He x={236} y={202} size={9.5} color={MUTED}>אמצע ← ראש וזנב</He>
      <He x={384} y={202} size={9.5} color={MUTED}>זנב ← ראש חדש</He>
    </Svg>
  );
}

function Blastema() {
  const C = [60, 180, 300, 420];
  const stump = (c: number, top = 120) => (
    <g>
      <rect x={c - 14} y={top} width={28} height={190 - top} fill={FILL.pink} stroke={PINK} strokeWidth={1} />
      <rect x={c - 4} y={top + 6} width={8} height={184 - top} fill="#e2e8f0" />
    </g>
  );
  return (
    <Svg h={222} label="שלבי ההתחדשות של גפת סלמנדרה: (1) קטיעה; (2) אפידרמיס פצע מכסה את הגדם ומתעבה לכיפה (AEC); (3) תאים בגדם מאבדים מיון ויוצרים בלסטמה מתחת לכיפה — בעזרת אותות מהעצב; (4) הבלסטמה מתמיינת ובונה מחדש את החלק החסר (כתום).">
      {stump(C[0])}
      <line x1={C[0] - 22} y1={118} x2={C[0] + 22} y2={118} stroke={RED} strokeWidth={1.2} strokeDasharray="4 3" />

      {stump(C[1])}
      <path d={`M${C[1] - 14} 122 Q${C[1]} 106 ${C[1] + 14} 122`} fill="none" stroke={GREEN} strokeWidth={6} />

      {stump(C[2])}
      <ellipse cx={C[2]} cy={104} rx={16} ry={18} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.2} />
      <path d={`M${C[2] - 16} 100 Q${C[2]} 76 ${C[2] + 16} 100`} fill="none" stroke={GREEN} strokeWidth={6} />
      <La x={C[2]} y={66} size={9.5} color={GREEN}>AEC</La>
      <line x1={C[2] + 8} y1={186} x2={C[2] + 8} y2={118} stroke={GOLD} strokeWidth={1.8} />
      <He x={C[2] + 22} y={162} size={9.5} color={GOLD} anchor="start">עצב</He>
      <Lead x1={C[2] + 20} y1={158} x2={C[2] + 10} y2={152} />

      <rect x={C[3] - 14} y={60} width={28} height={60} fill={FILL.orange} stroke={ORANGE} strokeWidth={1} />
      {stump(C[3])}
      {[-9, 0, 9].map((d) => <rect key={d} x={C[3] + d - 2.5} y={36} width={5} height={24} rx={2.5} fill={FILL.orange} stroke={ORANGE} strokeWidth={1} />)}

      <He x={C[0]} y={210} size={9.5} bold>1. קטיעה</He>
      <He x={C[1]} y={210} size={9.5} bold>2. אפידרמיס פצע</He>
      <He x={C[2]} y={210} size={9.5} bold>3. בלסטמה</He>
      <He x={C[3]} y={210} size={9.5} bold>4. בנייה מחדש</He>
    </Svg>
  );
}

// ── dv-evo-devo ──────────────────────────────────────────────────────────────
function Toolkit() {
  const rows: [string, string, string][] = [
    ["Hox (8 גנים)", "Hox (39 גנים)", "ציר ראש-זנב"],
    ["eyeless", "Pax6", "עין"],
    ["tinman", "Nkx2.5", "לב"],
    ["Distal-less", "Dlx", "בליטות (רגליים, גפיים)"],
    ["sog ⊣ dpp", "Chordin ⊣ BMP4", "ציר גבי-גחוני (הפוך)"],
  ];
  return (
    <Svg h={222} label="ערכת הכלים המשותפת לזבוב ולעכבר: Hox — ציר ראש-זנב; eyeless ו-Pax6 — עין; tinman ו-Nkx2.5 — לב; Distal-less ו-Dlx — בליטות; sog ו-dpp בזבוב מול Chordin ו-BMP4 בעכבר — ציר גבי-גחוני, בכיוון הפוך.">
      <He x={90} y={22} size={11.5} bold color={ORANGE}>זבוב</He>
      <He x={240} y={22} size={11.5} bold>תפקיד</He>
      <He x={390} y={22} size={11.5} bold color={BLUE}>עכבר</He>
      {rows.map(([f, m, r], i) => (
        <g key={f}>
          <Box x={30} y={36 + i * 36} w={120} h={26} fill={FILL.orange} stroke={ORANGE} size={10}>{f}</Box>
          <He x={240} y={53 + i * 36} size={10}>{r}</He>
          <Box x={330} y={36 + i * 36} w={120} h={26} fill={FILL.blue} stroke={BLUE} size={10}>{m}</Box>
        </g>
      ))}
    </Svg>
  );
}

function EnhancerEvolution() {
  const row = (y: number, lake: boolean) => (
    <g>
      <He x={24} y={y - 10} size={10.5} bold anchor="start">{lake ? "דג קוצן מאגם" : "דג קוצן מהים"}</He>
      <rect x={20} y={y + 10} width={290} height={4} fill="#cbd5e1" />
      <Box x={22} y={y} w={66} h={24} fill={FILL.green} stroke={GREEN} size={9}>יותרת המוח</Box>
      <Box x={94} y={y} w={48} h={24} fill={FILL.green} stroke={GREEN} size={9}>לסת</Box>
      {lake ? (
        <g>
          <rect x={148} y={y} width={66} height={24} rx={6} fill="white" stroke={RED} strokeWidth={1.2} strokeDasharray="4 3" />
          <He x={181} y={y + 16} size={9} color={RED}>נמחק</He>
        </g>
      ) : (
        <Box x={148} y={y} w={66} h={24} fill={FILL.green} stroke={GREEN} size={9}>אגן (Pel)</Box>
      )}
      <rect x={232} y={y - 2} width={76} height={28} rx={5} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <La x={270} y={y + 16} size={11} bold color={PURPLE}>Pitx1</La>
      <ellipse cx={400} cy={y + 12} rx={50} ry={16} fill={FILL.sky} stroke="#0284c7" strokeWidth={1.2} />
      <path d={`M448 ${y + 12} L472 ${y - 2} L472 ${y + 26} Z`} fill={FILL.sky} stroke="#0284c7" strokeWidth={1.2} />
      <circle cx={364} cy={y + 8} r={3} fill={INK} />
      {!lake && <line x1={402} y1={y + 27} x2={388} y2={y + 44} stroke={INK} strokeWidth={2.6} />}
      {lake ? <He x={404} y={y + 50} size={9.5} color={MUTED}>בלי קוצי אגן</He> : <He x={414} y={y + 50} size={9.5} anchor="start">קוצי אגן</He>}
    </g>
  );
  return (
    <Svg h={208} label="אבולוציה באנהנסר: לגן Pitx1 של דג הקוצן יש כמה אנהנסרים — ליותרת המוח, ללסת ולאגן (Pel). בדג מהים כולם קיימים, ולדג קוצי אגן. בדגי אגמים רבים, אנהנסר האגן נמחק — Pitx1 עדיין מבוטא ביותרת המוח ובלסת, אבל לא באגן, ואין קוצים.">
      {row(42, false)}
      {row(140, true)}
    </Svg>
  );
}

export const DEVELOPMENTAL_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "dv-specification-modes": { el: SpecificationModes, captionHe: "שלושה אופני קביעת גורל. בעוברים רבים יש שילוב של התמחות אוטונומית ומותנית; התמחות סינציטיאלית אופיינית לשלבים מסוימים, למשל בעובר הזבוב. סכמטי." },
  "dv-french-flag": { el: FrenchFlag, captionHe: "מודל דגל צרפת (וולפרט): מורפוגן אחד ושני ספים יוצרים שלושה אזורים. העקומה סכמטית, לא נתונים." },
  "dv-morphogenesis-mechanics": { el: MorphogenesisMechanics, captionHe: "ארבעה ממנגנוני המורפוגנזה. בגסטרולציה הם פועלים יחד. סכמטי." },
  "dv-five-pathways": { el: FivePathways, captionHe: "חמשת מסלולי האותות העיקריים, מהליגנד ועד פקטור השעתוק. מפושט — בכל מסלול יש עוד שלבים ושחקנים." },
  "dv-apoptosis-pathway": { el: ApoptosisPathway, captionHe: "מסלול האפופטוזיס השמור: חץ — מפעיל, קו עם פס — מעכב. ביונקים יש גם מסלול חיצוני (קולטני מוות) שאינו מוצג. סכמטי." },
  "dv-bicoid-gradient": { el: BicoidGradient, captionHe: "המפלים האימהיים בעובר הזבוב. העקומות סכמטיות, לא נתונים." },
  "dv-segmentation-cascade": { el: SegmentationCascade, captionHe: "מפל הגנים שמחלק את עובר הזבוב למקטעים — כל שלב מחדד את הקודם. מיקומי הפסים סכמטיים." },
  "dv-hox-cluster": { el: HoxCluster, captionHe: "גני Hox בזבוב ובעכבר: הסדר על הכרומוזום תואם את הסדר בגוף (קולינאריות). הצבעים מסמנים גנים מקבילים; ההתאמה בקבוצות 6–8 ו-9–13 מפושטת." },
  "dv-imaginal-discs": { el: ImaginalDiscs, captionHe: "הדיסקות הדמיוניות בזחל והאיברים שהן יוצרות בבוגר (צבעים תואמים). בדיסקות הזוגיות מוצג צד אחד; דיסקת איברי המין בודדת. סכמטי." },
  "dv-wing-disc": { el: WingDisc, captionHe: "דיסקת הכנף: Hedgehog מהחלק האחורי מדליק dpp בפס צר, ו-Dpp יוצר מפל שקובע תבנית. העקומה סכמטית." },
  "dv-eye-ommatidium": { el: EyeOmmatidium, captionHe: "העין המורכבת נבנית מאחורי התלם המורפוגנטי, ובכל אומטידיום התאים מגויסים בסדר קבוע. סידור התאים סכמטי." },
  "dv-worm-par": { el: WormPar, captionHe: "קיטוב הזיגוטה של C. elegans בעזרת חלבוני PAR. סכמטי." },
  "dv-worm-gonad": { el: WormGonad, captionHe: "הגונדה של ההרמפרודיט הבוגר. תא הקצה (DTC) מוביל את נדידת הזרוע ושומר על תאי הגזע (LAG-2 ← GLP-1/Notch). סכמטי." },
  "dv-vulva-induction": { el: VulvaInduction, captionHe: "השראת הפות: אות מכוון מתא העוגן (LIN-3/EGF) ואות לטרלי בין התאים (LIN-12/Notch). עובי החץ — עוצמת האות (סכמטי)." },
  "dv-chick-streak": { el: ChickStreak, captionHe: "היווצרות הפס הקדמון וקשר הנסן בעובר העוף, במבט מלמעלה. סכמטי — גדלים לא בקנה מידה." },
  "dv-mouse-blastocyst": { el: MouseBlastocyst, captionHe: "מעובר של 8 תאים ועד כוס העובר בעכבר. סכמטי — גדלים לא בקנה מידה." },
  "dv-nodal-flow": { el: NodalFlow, captionHe: "האסימטריה ימין-שמאל: זרימה בקשר ← Nodal ו-Pitx2 בצד שמאל. בציור, השמאל של העובר משמאל. סכמטי." },
  "dv-limb-axes": { el: LimbAxes, captionHe: "ניצן הגפה: מרכז אות לכל ציר, ושלושת מקטעי השלד. סכמטי." },
  "dv-aer-zpa-experiments": { el: AerZpaExperiments, captionHe: "שני הניסויים הקלאסיים של סונדרס: הסרת ה-AER (למעלה) והשתלת ZPA (למטה). סכמטי." },
  "dv-forward-reverse": { el: ForwardReverse, captionHe: "גנטיקה קדמית מול גנטיקה הפוכה." },
  "dv-enhancer-logic": { el: EnhancerLogic, captionHe: "לוגיקה קומבינטורית באנהנסר: פס 2 של eve נוצר רק בין אזורי Giant ו-Krüppel, היכן ש-Bicoid ו-Hunchback מפעילים. מספר האתרים ומיקומם סכמטיים." },
  "dv-cell-size": { el: CellSize, captionHe: "בקרת גודל התא: גדילה עד סף לפני חלוקה, ומודל הדילול בשמרים. סכמטי." },
  "dv-regeneration-types": { el: RegenerationTypes, captionHe: "שלושת סוגי ההתחדשות. סכמטי." },
  "dv-planarian": { el: Planarian, captionHe: "פלנריה: נאובלסטים פזורים בגוף, וכל חתיכה מתחדשת לתולעת שלמה. סכמטי." },
  "dv-blastema": { el: Blastema, captionHe: "שלבי ההתחדשות של גפת סלמנדרה. כתום — רקמה שנבנתה מחדש. סכמטי." },
  "dv-toolkit": { el: Toolkit, captionHe: "חלק מערכת הכלים הגנטית המשותפת לזבוב ולעכבר. בכל שורה — גנים הומולוגיים." },
  "dv-enhancer-evolution": { el: EnhancerEvolution, captionHe: "מחיקת אנהנסר האגן של Pitx1 בדגי קוצן מאגמים (לפי Chan et al., 2010). מספר האנהנסרים ומיקומם סכמטיים." },
};
