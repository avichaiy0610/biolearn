/* Figures for the Biology 1 units (Technion 134058). Original drawings, laid out after looking at how the course book
   (Hillis et al., Life: The Science of Biology, 12e) presents the same structures — never copied. Schematic, not to
   scale. Labels sit beside or above lines, never on them. Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, BLUE, GREEN, INK, MUTED, ORANGE, He, La, dash } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

const PURPLE = "#7c3aed";
const RED = "#b91c1c";
const TEAL = "#0f766e";
const WALL = "#e7d3b0";
const WALL_EDGE = "#a8865a";
const FILL = { blue: "#dbeafe", green: "#dcfce7", orange: "#ffedd5", purple: "#ede9fe", yellow: "#fef3c7", gray: "#f1f5f9", red: "#fee2e2", sky: "#e0f2fe", teal: "#ccfbf1", cyto: "#fff7ed", nuc: "#f5f3ff" };

const Svg = ({ w = 480, h, label, children }: { w?: number; h: number; label: string; children: React.ReactNode }) => (
  <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label={label}>
    <ArrowDefs />
    <defs>
      <marker id="b1Inhib" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M5 0L5 10" stroke={RED} strokeWidth={2.4} /></marker>
    </defs>
    {children}
  </svg>
);
// Rounded box with a Hebrew label (one or two lines), centered at x, top at y.
const Bx = ({ x, y, w, h = 30, t, t2, c = BLUE, fill = FILL.blue, size = 12, bold = false }: { x: number; y: number; w: number; h?: number; t: string; t2?: string; c?: string; fill?: string; size?: number; bold?: boolean }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={8} fill={fill} stroke={c} strokeWidth={1.6} />
    {t2 ? (
      <>
        <He x={x} y={y + h / 2 - 2} size={size} bold={bold}>{t}</He>
        <He x={x} y={y + h / 2 + size * 0.95} size={size - 2} color={MUTED}>{t2}</He>
      </>
    ) : <He x={x} y={y + h / 2 + size * 0.36} size={size} bold={bold}>{t}</He>}
  </g>
);
// Leader line from a label to a structure.
const Lead = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={1} />;
const Badge = ({ x, y, n }: { x: number; y: number; n: number }) => (
  <g>
    <circle cx={x} cy={y} r={8} fill="#fff" stroke={INK} strokeWidth={1.2} />
    <La x={x} y={y + 3.5} size={9.5} bold>{n}</La>
  </g>
);

// ── b1-life-timeline ─────────────────────────────────────────────────────────
function LifeTimeline() {
  const X = (gya: number) => 450 - (gya / 4.6) * 420;
  const segs: [number, number, string][] = [[4.6, 3.5, "#e2e8f0"], [3.5, 1.8, "#fed7aa"], [1.8, 0.54, "#bfdbfe"], [0.54, 0, "#bbf7d0"]];
  const up: [number, number, string][] = [[3.5, 96, "≈3.5 — תאים ראשונים (פרוקריוטים)"], [1.8, 96, "≈1.8 — תאים אאוקריוטים"], [0.54, 66, "0.54 — הפיצוץ הקמברי"]];
  const down: [number, number, string, "middle" | "start" | "end"][] = [
    [4.6, 150, "4.6 — היווצרות כדור הארץ", "start"], [2.4, 150, "≈2.4 — חמצן באטמוספרה", "middle"], [1.0, 150, "≈1 — רב-תאיים", "middle"],
    [0.47, 178, "≈0.47 — צמחים ביבשה", "end"], [0.0003, 206, "0.0003 — האדם", "end"],
  ];
  return (
    <Svg h={220} label="ציר הזמן של החיים על כדור הארץ, במיליארדי שנים לפני היום: היווצרות כדור הארץ, התאים הראשונים, הצטברות החמצן, התאים האאוקריוטים, היצורים הרב-תאיים, הפיצוץ הקמברי, העלייה ליבשה והאדם.">
      <He x={240} y={24} size={11.5} color={MUTED}>מיליארדי שנים לפני היום (בקירוב; ציר ליניארי)</He>
      {segs.map(([a, b, c]) => <rect key={a} x={X(a)} y={116} width={X(b) - X(a)} height={8} fill={c} stroke="none" />)}
      <rect x={30} y={116} width={420} height={8} fill="none" stroke={INK} strokeWidth={1} />
      {up.map(([g, y, t]) => (
        <g key={t}>
          <line x1={X(g)} y1={116} x2={X(g)} y2={y + 5} stroke={INK} strokeWidth={1} />
          <He x={X(g)} y={y} size={10.5}>{t}</He>
        </g>
      ))}
      {down.map(([g, y, t, a]) => (
        <g key={t}>
          <line x1={X(g)} y1={124} x2={X(g)} y2={y - 13} stroke={INK} strokeWidth={1} />
          <He x={a === "start" ? X(g) - 6 : a === "end" ? (g < 0.01 ? X(g) + 24 : X(g) + 37) : X(g)} y={y} size={10.5} anchor={a}>{t}</He>
        </g>
      ))}
    </Svg>
  );
}

// ── b1-hierarchy ─────────────────────────────────────────────────────────────
function Hierarchy() {
  const xs = [418, 298, 178, 58];
  const rows: [string, string][][] = [
    [["אטום", "C, O, N"], ["מולקולה", "DNA, חלבון"], ["אברון", "מיטוכונדריון"], ["תא", "תא עצב"]],
    [["רקמה", "רקמת עצב"], ["איבר", "מוח"], ["מערכת איברים", "מערכת העצבים"], ["אורגניזם", "אדם"]],
    [["אוכלוסייה", "צבאים ביער"], ["חברה", "כל המינים ביער"], ["מערכת אקולוגית", "+ קרקע, מים, אקלים"], ["ביוספרה", "כל כדור הארץ"]],
  ];
  const ys = [20, 92, 164];
  const col = [FILL.blue, FILL.green, FILL.orange];
  const edge = [BLUE, GREEN, ORANGE];
  return (
    <Svg h={220} label="רמות הארגון הביולוגי, מאטום ועד הביוספרה: אטום, מולקולה, אברון, תא, רקמה, איבר, מערכת איברים, אורגניזם, אוכלוסייה, חברה, מערכת אקולוגית וביוספרה.">
      {rows.map((row, r) => {
        const order = r === 1 ? [...xs].reverse() : xs;
        return row.map(([t, ex], i) => <Bx key={t} x={order[i]} y={ys[r]} w={104} h={42} t={t} t2={ex} c={edge[r]} fill={col[r]} size={12} bold />);
      })}
      {[0, 1, 2].map((r) => [0, 1, 2].map((i) => {
        const dir = r === 1 ? 1 : -1;
        const a = r === 1 ? [...xs].reverse() : xs;
        const x1 = a[i] + dir * 52, x2 = a[i + 1] - dir * 52;
        return <Arrow key={`${r}-${i}`} x1={x1} y1={ys[r] + 21} x2={x2} y2={ys[r] + 21} />;
      }))}
      <Arrow x1={58} y1={62} x2={58} y2={92} />
      <Arrow x1={418} y1={134} x2={418} y2={164} />
    </Svg>
  );
}

// ── b1-scientific-method ─────────────────────────────────────────────────────
function ScientificMethod() {
  const X = 330, W = 140;
  const steps = ["תצפית", "שאלה", "השערה", "ניבוי (אם… אז…)", "ניסוי מבוקר או תצפית", "תוצאות"];
  const top = (i: number) => 10 + i * 46;
  return (
    <Svg h={330} label="שלבי השיטה המדעית: תצפית, שאלה, השערה, ניבוי, ניסוי ותוצאות. תוצאות שתומכות בהשערה מובילות לניסויים נוספים; תוצאות שמפריכות אותה מובילות להשערה חדשה.">
      {steps.map((t, i) => <Bx key={t} x={X} y={top(i)} w={W} t={t} c={i === 2 ? PURPLE : BLUE} fill={i === 2 ? FILL.purple : FILL.blue} bold={i === 2} />)}
      {steps.slice(1).map((_, i) => <Arrow key={i} x1={X} y1={top(i) + 30} x2={X} y2={top(i + 1)} />)}
      <Bx x={X} y={290} w={170} t="תומכות — עוד ניסויים" c={GREEN} fill={FILL.green} />
      <Arrow x1={X} y1={top(5) + 30} x2={X} y2={290} />
      <Bx x={110} y={top(5)} w={150} t="מפריכות את ההשערה" c={RED} fill={FILL.red} />
      <Arrow x1={X - W / 2} y1={top(5) + 15} x2={186} y2={top(5) + 15} />
      <path d={`M110 ${top(5)} L110 ${top(2) + 15} L${X - W / 2 - 2} ${top(2) + 15}`} fill="none" stroke={RED} strokeWidth={1.8} markerEnd="url(#bfArrow)" />
      <He x={120} y={top(3) + 30} size={11} color={RED} anchor="start">מנסחים השערה חדשה</He>
    </Svg>
  );
}

// ── b1-amino-acid ────────────────────────────────────────────────────────────
function AminoAcid() {
  return (
    <Svg h={290} label="מבנה כללי של חומצת אמינו — פחמן α עם קבוצת אמינו, קבוצה קרבוקסילית, מימן ושרשרת צד — ויצירת קשר פפטידי בין שתי חומצות אמינו בתגובת עיבוי, שמשחררת מולקולת מים.">
      <He x={240} y={20} size={13} bold>חומצת אמינו</He>
      <La x={50} y={95} size={15} bold color={BLUE}>H₃N⁺</La>
      <La x={120} y={95} size={15} bold>Cα</La>
      <La x={198} y={95} size={15} bold color={RED}>COO⁻</La>
      <La x={120} y={50} size={15}>H</La>
      <line x1={74} y1={90} x2={106} y2={90} stroke={INK} strokeWidth={1.8} />
      <line x1={134} y1={90} x2={172} y2={90} stroke={INK} strokeWidth={1.8} />
      <line x1={120} y1={56} x2={120} y2={78} stroke={INK} strokeWidth={1.8} />
      <line x1={120} y1={98} x2={120} y2={122} stroke={INK} strokeWidth={1.8} />
      <circle cx={120} cy={138} r={16} fill={FILL.green} stroke={GREEN} strokeWidth={1.6} />
      <La x={120} y={143} size={14} bold color={GREEN}>R</La>
      <He x={50} y={120} size={10.5} color={BLUE}>קבוצת אמינו</He>
      <He x={202} y={120} size={10.5} color={RED}>קבוצה קרבוקסילית</He>
      <He x={144} y={143} size={10.5} color={GREEN} anchor="start">שרשרת צד — שונה</He>
      <He x={144} y={158} size={10.5} color={GREEN} anchor="start">בכל אחת מ-20</He>
      <He x={340} y={60} size={11} color={MUTED}>בתא (pH ≈ 7) שתי הקבוצות</He>
      <He x={340} y={76} size={11} color={MUTED}>טעונות: ‎–NH₃⁺ ו-‎–COO⁻</He>

      <He x={240} y={190} size={13} bold>קשר פפטידי (תגובת עיבוי)</He>
      {([[34, "H₃N⁺", BLUE], [96, "Cα", INK], [150, "C", INK], [206, "N", INK], [262, "Cα", INK], [326, "COO⁻", RED]] as [number, string, string][]).map(([x, t, c]) => <La key={x} x={x} y={238} size={14} bold color={c}>{t}</La>)}
      {[[56, 84], [108, 142], [158, 198], [214, 250], [274, 304]].map(([a, b]) => <line key={a} x1={a} y1={233} x2={b} y2={233} stroke={INK} strokeWidth={1.8} />)}
      <La x={150} y={208} size={14} bold>O</La>
      <line x1={147} y1={212} x2={147} y2={225} stroke={INK} strokeWidth={1.4} />
      <line x1={153} y1={212} x2={153} y2={225} stroke={INK} strokeWidth={1.4} />
      <line x1={206} y1={242} x2={206} y2={256} stroke={INK} strokeWidth={1.4} />
      <La x={206} y={270} size={13}>H</La>
      {[96, 262].map((x, i) => (
        <g key={x}>
          <line x1={x} y1={242} x2={x} y2={256} stroke={INK} strokeWidth={1.4} />
          <La x={x} y={270} size={13} bold color={GREEN}>{`R${i + 1}`}</La>
        </g>
      ))}
      <rect x={138} y={220} width={82} height={26} rx={6} fill="none" stroke={ORANGE} strokeWidth={1.8} {...dash} />
      <He x={226} y={212} size={11} bold color={ORANGE} anchor="start">הקשר הפפטידי</He>
      <He x={34} y={262} size={10} color={MUTED}>קצה N</He>
      <He x={326} y={262} size={10} color={MUTED}>קצה C</He>
      <La x={420} y={238} size={14} bold color={BLUE}>+ H₂O</La>
      <He x={420} y={258} size={10} color={MUTED}>משתחררת</He>
    </Svg>
  );
}

// ── b1-protein-levels ────────────────────────────────────────────────────────
function ProteinLevels() {
  const beads = [[388, 48], [410, 62], [432, 52], [452, 70], [440, 92], [418, 104], [396, 118], [410, 140], [434, 150]];
  const helix: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * 7 * Math.PI;
    helix.push(`${i ? "L" : "M"}${(300 + 18 * Math.cos(t)).toFixed(1)} ${(36 + t * 3.2 + 5 * Math.sin(t)).toFixed(1)}`);
  }
  const strand = (y: number, dir: 1 | -1) => {
    const x0 = dir === 1 ? 266 : 334, x1 = dir === 1 ? 326 : 274;
    return <path d={`M${x0} ${y - 4} L${x1 - dir * 8} ${y - 4} L${x1 - dir * 8} ${y - 9} L${x1} ${y} L${x1 - dir * 8} ${y + 9} L${x1 - dir * 8} ${y + 4} L${x0} ${y + 4} Z`} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.3} />;
  };
  const panels: [number, string, string, string][] = [
    [420, "ראשוני", "רצף חומצות האמינו", "קשרים פפטידיים"],
    [300, "שניוני", "סליל α ומשטח β", "קשרי מימן בשלד"],
    [180, "שלישוני", "קיפול השרשרת כולה", "קשרים בין שרשראות צד"],
    [60, "רבעוני", "כמה תת-יחידות", "(המוגלובין: 2α + 2β)"],
  ];
  return (
    <Svg h={235} label="ארבע רמות המבנה של חלבון: ראשוני — רצף חומצות האמינו; שניוני — סליל α ומשטח β שמוחזקים בקשרי מימן של השלד; שלישוני — הקיפול התלת-ממדי של שרשרת אחת; רבעוני — כמה תת-יחידות.">
      <polyline points={beads.map((p) => p.join(",")).join(" ")} fill="none" stroke={MUTED} strokeWidth={1.5} />
      {beads.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={8} fill={[FILL.green, FILL.blue, FILL.orange, FILL.purple][i % 4]} stroke={INK} strokeWidth={1} />)}
      <path d={helix.join("")} fill="none" stroke={RED} strokeWidth={2.2} />
      {strand(122, 1)}{strand(140, -1)}{strand(158, 1)}
      <path d="M150 70 C 120 40, 210 30, 214 70 C 218 100, 160 92, 156 118 C 152 146, 214 150, 206 120 C 200 96, 236 100, 222 136 C 210 166, 140 166, 140 136 C 140 110, 176 80, 150 70" fill="none" stroke={PURPLE} strokeWidth={2.4} />
      <circle cx={184} cy={102} r={5} fill="#fde68a" stroke="#b45309" />
      <La x={184} y={88} size={9} color="#b45309">S–S</La>
      {[[40, 70, GREEN, FILL.green, "α"], [82, 70, BLUE, FILL.blue, "β"], [40, 118, BLUE, FILL.blue, "β"], [82, 118, GREEN, FILL.green, "α"]].map(([x, y, c, f, t], i) => (
        <g key={i}>
          <ellipse cx={x as number} cy={y as number} rx={22} ry={22} fill={f as string} stroke={c as string} strokeWidth={1.6} />
          <La x={x as number} y={(y as number) + 5} size={14} bold color={c as string}>{t as string}</La>
        </g>
      ))}
      {panels.map(([x, t, d1, d2]) => (
        <g key={t}>
          <He x={x} y={190} size={13} bold>{t}</He>
          <He x={x} y={207} size={10.5} color={MUTED}>{d1}</He>
          <He x={x} y={222} size={10.5} color={MUTED}>{d2}</He>
        </g>
      ))}
    </Svg>
  );
}

// ── b1-enzyme-regulation ─────────────────────────────────────────────────────
const Enz = ({ cx, cy, w = 80, skew = 0, site = true, fill = FILL.blue, c = BLUE }: { cx: number; cy: number; w?: number; skew?: number; site?: boolean; fill?: string; c?: string }) => {
  const h = 46, l = cx - w / 2, r = cx + w / 2, t = cy - h / 2, b = cy + h / 2;
  const notch = `L${cx - 12} ${t} L${cx + skew} ${t + 16 - Math.abs(skew) / 2} L${cx + 12} ${t}`;
  const side = site ? `L${r} ${cy - 7} L${r - 9} ${cy - 7} L${r - 9} ${cy + 7} L${r} ${cy + 7}` : "";
  return <path d={`M${l + 8} ${t} ${notch} L${r - 8} ${t} Q${r} ${t} ${r} ${t + 8} ${side} L${r} ${b - 8} Q${r} ${b} ${r - 8} ${b} L${l + 8} ${b} Q${l} ${b} ${l} ${b - 8} L${l} ${t + 8} Q${l} ${t} ${l + 8} ${t} Z`} fill={fill} stroke={c} strokeWidth={1.6} />;
};
const Sub = ({ x, y, c = GREEN, fill = FILL.green }: { x: number; y: number; c?: string; fill?: string }) => <path d={`M${x - 11} ${y - 8} L${x + 11} ${y - 8} L${x} ${y + 8} Z`} fill={fill} stroke={c} strokeWidth={1.4} />;
function EnzymeRegulation() {
  return (
    <Svg h={300} label="ארבע דרכים לבקרת אנזים: עיכוב תחרותי — המעכב תופס את האתר הפעיל; עיכוב לא-תחרותי — המעכב נקשר באתר אחר ומעוות את האתר הפעיל; בקרה אלוסטרית — מפעיל מייצב את הצורה הפעילה ומעכב את הלא פעילה; עיכוב במשוב — התוצר הסופי של מסלול מעכב את האנזים הראשון.">
      <line x1={240} y1={10} x2={240} y2={290} stroke="#e2e8f0" strokeWidth={1} />
      <line x1={10} y1={150} x2={470} y2={150} stroke="#e2e8f0" strokeWidth={1} />

      <He x={360} y={22} size={12.5} bold>עיכוב תחרותי</He>
      <Enz cx={360} cy={92} site={false} />
      <Sub x={360} y={77} c={RED} fill={FILL.red} />
      <Sub x={432} y={52} />
      <He x={442} y={78} size={10} color={GREEN}>מצע</He>
      <He x={300} y={56} size={10} color={RED}>מעכב</He>
      <He x={360} y={138} size={10.5} color={MUTED}>המעכב תופס את האתר הפעיל</He>

      <He x={120} y={22} size={12.5} bold>עיכוב לא-תחרותי</He>
      <Enz cx={112} cy={92} skew={7} />
      <circle cx={157} cy={92} r={8} fill={FILL.red} stroke={RED} strokeWidth={1.4} />
      <Sub x={112} y={50} />
      <He x={190} y={96} size={10} color={RED} anchor="start">מעכב</He>
      <He x={120} y={138} size={10.5} color={MUTED}>נקשר באתר אחר ומשנה את הצורה</He>

      <He x={360} y={172} size={12.5} bold>בקרה אלוסטרית</He>
      <Enz cx={410} cy={228} w={70} />
      <circle cx={450} cy={228} r={7} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <Enz cx={300} cy={228} w={70} skew={8} fill={FILL.gray} c={MUTED} />
      <circle cx={340} cy={228} r={7} fill={FILL.red} stroke={RED} strokeWidth={1.4} />
      <He x={410} y={270} size={10.5} color={GREEN}>מפעיל ← צורה פעילה</He>
      <He x={300} y={270} size={10.5} color={RED}>מעכב ← צורה לא פעילה</He>
      <He x={355} y={290} size={10} color={MUTED}>הקשירה היא באתר הבקרה, לא באתר הפעיל</He>

      <He x={120} y={172} size={12.5} bold>עיכוב במשוב</He>
      {["A", "B", "C", "D"].map((t, i) => <La key={t} x={30 + i * 60} y={236} size={15} bold color={i === 3 ? RED : INK}>{t}</La>)}
      {[0, 1, 2].map((i) => <Arrow key={i} x1={42 + i * 60} y1={231} x2={78 + i * 60} y2={231} />)}
      {[0, 1, 2].map((i) => <La key={i} x={60 + i * 60} y={252} size={9.5} color={MUTED}>{`E${i + 1}`}</La>)}
      <path d="M210 220 C 205 186, 70 186, 62 222" fill="none" stroke={RED} strokeWidth={1.8} {...dash} markerEnd="url(#b1Inhib)" />
      <He x={120} y={276} size={10.5} color={MUTED}>התוצר הסופי D מעכב את האנזים הראשון</He>
    </Svg>
  );
}

// ── b1-prok-euk ──────────────────────────────────────────────────────────────
function ProkEuk() {
  const ribos: [number, number][] = [[342, 100], [348, 126], [395, 92], [404, 130], [424, 100]];
  return (
    <Svg h={270} label="תא פרוקריוטי (חיידק) מול תא אאוקריוטי (של בעל חיים). בחיידק: קופסית, דופן, ממברנה, נוקלאואיד בלי ממברנה, פלסמיד, ריבוזומים ושוטון. בתא האאוקריוטי: גרעין עם מעטפת כפולה וגרעינון, ER, גולג'י ומיטוכונדריון. לא בקנה מידה.">
      <rect x={315} y={70} width={130} height={80} rx={40} fill={FILL.yellow} stroke="#ca8a04" strokeWidth={1.2} {...dash} />
      <rect x={322} y={77} width={116} height={66} rx={33} fill={WALL} stroke={WALL_EDGE} strokeWidth={2} />
      <rect x={328} y={83} width={104} height={54} rx={27} fill={FILL.cyto} stroke={MUTED} strokeWidth={1.5} />
      <path d="M356 100 C 366 90, 372 118, 382 104 C 392 92, 396 122, 384 124 C 372 126, 366 112, 358 120 C 352 126, 348 108, 356 100" fill="none" stroke={BLUE} strokeWidth={1.8} />
      <circle cx={415} cy={122} r={6} fill="none" stroke={PURPLE} strokeWidth={1.6} />
      {ribos.map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={2.6} fill={INK} />)}
      <path d="M445 110 q6 -9 11 0 t11 0 t9 -2" fill="none" stroke={INK} strokeWidth={1.6} />
      <He x={310} y={46} size={10}>קופסית</He><Lead x1={312} y1={51} x2={326} y2={74} />
      <He x={355} y={46} size={10}>דופן</He><Lead x1={355} y1={51} x2={352} y2={78} />
      <He x={405} y={46} size={10}>ממברנה</He><Lead x1={405} y1={51} x2={410} y2={84} />
      <He x={455} y={46} size={10}>ריבוזומים</He><Lead x1={452} y1={51} x2={425} y2={97} />
      <He x={350} y={180} size={10}>נוקלאואיד (DNA)</He><Lead x1={358} y1={168} x2={372} y2={122} />
      <He x={425} y={180} size={10}>פלסמיד</He><Lead x1={423} y1={168} x2={416} y2={129} />
      <He x={465} y={134} size={10}>שוטון</He>
      <He x={380} y={240} size={12.5} bold>תא פרוקריוטי (1–5 µm)</He>

      <ellipse cx={145} cy={118} rx={120} ry={86} fill={FILL.cyto} stroke={MUTED} strokeWidth={1.8} />
      <circle cx={115} cy={112} r={38} fill={FILL.nuc} stroke={PURPLE} strokeWidth={1.4} />
      <circle cx={115} cy={112} r={34} fill="none" stroke={PURPLE} strokeWidth={1.4} />
      <circle cx={106} cy={106} r={10} fill="#c4b5fd" stroke="none" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${160 + i * 9} ${80 + i * 3} C ${176 + i * 9} ${100}, ${176 + i * 9} ${124}, ${160 + i * 9} ${144 - i * 3}`} fill="none" stroke={BLUE} strokeWidth={1.6} />)}
      {[[170, 92], [178, 112], [186, 128], [172, 136]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={2.2} fill={INK} />)}
      {[0, 1, 2].map((i) => <path key={i} d={`M${200 - i * 2} ${50 + i * 8} q22 -6 44 0`} fill="none" stroke={ORANGE} strokeWidth={2} />)}
      <ellipse cx={210} cy={160} rx={24} ry={12} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.5} />
      <path d="M192 160 l5 -6 l5 12 l5 -12 l5 12 l5 -12 l5 12 l5 -6" fill="none" stroke={ORANGE} strokeWidth={1} />
      <He x={60} y={22} size={10}>גרעין</He><Lead x1={64} y1={27} x2={92} y2={82} />
      <He x={130} y={22} size={10}>גרעינון</He><Lead x1={127} y1={27} x2={108} y2={95} />
      <He x={190} y={22} size={10}>ER</He><Lead x1={190} y1={27} x2={170} y2={84} />
      <He x={250} y={36} size={10}>גולג'י</He><Lead x1={246} y1={41} x2={232} y2={52} />
      <He x={215} y={222} size={10}>מיטוכונדריון</He><Lead x1={214} y1={210} x2={211} y2={173} />
      <He x={70} y={222} size={10}>ממברנת התא</He><Lead x1={72} y1={210} x2={78} y2={183} />
      <He x={145} y={240} size={12.5} bold>תא אאוקריוטי (10–100 µm)</He>
      <He x={240} y={262} size={10} color={MUTED}>לא בקנה מידה — קוטר תא אאוקריוטי גדול בדרך כלל פי 10 ויותר</He>
    </Svg>
  );
}

// ── b1-virus ─────────────────────────────────────────────────────────────────
function Virus() {
  const hex = (cx: number, cy: number, r: number) => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + (i * Math.PI) / 3; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(" ");
  const spikes = Array.from({ length: 16 }, (_, i) => (i * 2 * Math.PI) / 16);
  return (
    <Svg h={240} label="שני סוגי וירוסים. בקטריופאג': ראש (קפסיד) עם DNA, זנב וסיבי זנב שנצמדים לחיידק. וירוס עטוף (כמו שפעת או HIV): מעטפת שומנית עם חלבוני מעטפת בולטים, ובתוכה קפסיד וגנום של RNA.">
      <polygon points={hex(370, 60, 34)} fill={FILL.blue} stroke={BLUE} strokeWidth={1.8} />
      <path d="M356 50 c8 -10 18 10 26 0 s-6 20 -14 12 s-12 4 -12 -12" fill="none" stroke={RED} strokeWidth={1.6} />
      <rect x={362} y={94} width={16} height={60} fill={FILL.gray} stroke={MUTED} strokeWidth={1.4} />
      {[0, 1, 2, 3].map((i) => <line key={i} x1={362} x2={378} y1={104 + i * 13} y2={104 + i * 13} stroke={MUTED} strokeWidth={1} />)}
      <rect x={352} y={154} width={36} height={6} fill={MUTED} />
      <path d="M354 160 L332 186 L324 200 M386 160 L408 186 L416 200 M362 160 L352 196 M378 160 L388 196" fill="none" stroke={INK} strokeWidth={1.4} />
      <He x={430} y={48} size={10.5} anchor="start">קפסיד</He><Lead x1={428} y1={44} x2={402} y2={52} />
      <La x={300} y={48} size={10.5} color={RED} anchor="end">DNA</La><Lead x1={302} y1={44} x2={356} y2={52} />
      <He x={430} y={124} size={10.5} anchor="start">זנב</He><Lead x1={428} y1={120} x2={380} y2={120} />
      <He x={440} y={196} size={10.5} anchor="start">סיבי זנב</He><Lead x1={438} y1={192} x2={414} y2={190} />
      <He x={370} y={226} size={12.5} bold>בקטריופאג'</He>

      <circle cx={120} cy={110} r={60} fill={FILL.yellow} stroke="#ca8a04" strokeWidth={2.4} />
      {spikes.map((a, i) => (
        <g key={i}>
          <line x1={120 + 60 * Math.cos(a)} y1={110 + 60 * Math.sin(a)} x2={120 + 72 * Math.cos(a)} y2={110 + 72 * Math.sin(a)} stroke={GREEN} strokeWidth={2} />
          <circle cx={120 + 74 * Math.cos(a)} cy={110 + 74 * Math.sin(a)} r={3} fill={GREEN} />
        </g>
      ))}
      <polygon points={hex(120, 110, 34)} fill={FILL.blue} stroke={BLUE} strokeWidth={1.6} />
      <path d="M102 104 c8 -12 16 12 24 0 s8 14 14 4 M104 120 c8 -8 16 8 26 -2" fill="none" stroke={RED} strokeWidth={1.6} />
      <He x={10} y={24} size={10.5} anchor="start">חלבוני מעטפת</He><Lead x1={40} y1={30} x2={62} y2={60} />
      <He x={236} y={60} size={10.5} anchor="end">מעטפת שומנית</He><Lead x1={200} y1={66} x2={168} y2={78} />
      <He x={236} y={150} size={10.5} anchor="end">קפסיד</He><Lead x1={204} y1={146} x2={150} y2={126} />
      <La x={10} y={170} size={10.5} color={RED} anchor="start">RNA</La><Lead x1={36} y1={166} x2={104} y2={120} />
      <He x={120} y={226} size={12.5} bold>וירוס עטוף</He>
    </Svg>
  );
}

// ── b1-animal-plant-cell ─────────────────────────────────────────────────────
function AnimalPlantCell() {
  const legend = ["גרעין", "גרעינון", "ER מחוספס", "ER חלק", "גולג'י", "מיטוכונדריון", "ליזוזום", "צנטריולים", "ממברנת התא", "דופן תאית", "כלורופלסט", "וואקואולה מרכזית", "פלזמודסמה"];
  const Mito = ({ x, y, r = 0 }: { x: number; y: number; r?: number }) => (
    <g transform={`rotate(${r} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx={17} ry={8} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.3} />
      <path d={`M${x - 12} ${y} l4 -5 l4 10 l4 -10 l4 10 l4 -10 l4 5`} fill="none" stroke={ORANGE} strokeWidth={0.9} />
    </g>
  );
  const Chloro = ({ x, y, r = 0 }: { x: number; y: number; r?: number }) => (
    <g transform={`rotate(${r} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx={20} ry={10} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      {[-10, -2, 6].map((d) => <rect key={d} x={x + d} y={y - 6} width={5} height={12} fill={GREEN} opacity={0.6} />)}
    </g>
  );
  const Golgi = ({ x, y }: { x: number; y: number }) => <g>{[0, 1, 2, 3].map((i) => <path key={i} d={`M${x - 18 + i} ${y + i * 5} q18 -7 36 0`} fill="none" stroke={ORANGE} strokeWidth={2} />)}</g>;
  return (
    <Svg h={360} label="תא של בעל חיים מול תא צמחי, עם אברונים ממוספרים: גרעין, גרעינון, ER מחוספס וחלק, גולג'י, מיטוכונדריה, ליזוזומים וצנטריולים בתא של בעל החיים; בתא הצמחי גם דופן תאית, כלורופלסטים, וואקואולה מרכזית ופלזמודסמטה.">
      <He x={120} y={18} size={12.5} bold>תא של בעל חיים</He>
      <ellipse cx={120} cy={120} rx={105} ry={88} fill={FILL.cyto} stroke={MUTED} strokeWidth={2} />
      <circle cx={110} cy={118} r={30} fill={FILL.nuc} stroke={PURPLE} strokeWidth={2.4} />
      <circle cx={104} cy={112} r={9} fill="#c4b5fd" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${146 + i * 8} ${94 + i * 2} C ${160 + i * 8} 108, ${160 + i * 8} 130, ${146 + i * 8} ${142 - i * 2}`} fill="none" stroke={BLUE} strokeWidth={1.6} />)}
      {[[156, 102], [164, 118], [170, 132]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={2} fill={INK} />)}
      {[0, 1].map((i) => <path key={i} d={`M${60 + i * 8} ${172 - i * 4} q10 -14 26 -10 q10 4 22 -6`} fill="none" stroke={TEAL} strokeWidth={1.6} />)}
      <Golgi x={110} y={52} />
      <Mito x={190} y={150} r={-20} />
      <Mito x={50} y={100} r={70} />
      <circle cx={190} cy={96} r={7} fill={FILL.red} stroke={RED} strokeWidth={1.3} />
      <rect x={72} y={56} width={5} height={14} fill={INK} transform="rotate(20 74 63)" />
      <rect x={80} y={60} width={14} height={5} fill={INK} />
      <Badge x={110} y={160} n={1} /><Badge x={84} y={112} n={2} /><Badge x={190} y={120} n={3} /><Badge x={110} y={190} n={4} />
      <Badge x={148} y={52} n={5} /><Badge x={190} y={176} n={6} /><Badge x={205} y={86} n={7} /><Badge x={60} y={50} n={8} /><Badge x={24} y={150} n={9} />

      <He x={360} y={18} size={12.5} bold>תא צמחי</He>
      <rect x={250} y={30} width={220} height={182} rx={6} fill={WALL} stroke={WALL_EDGE} strokeWidth={2} />
      <rect x={258} y={38} width={204} height={166} rx={4} fill={FILL.cyto} stroke={MUTED} strokeWidth={1.5} />
      <rect x={300} y={70} width={140} height={110} rx={22} fill={FILL.sky} stroke={TEAL} strokeWidth={1.6} />
      <circle cx={276} cy={110} r={14} fill={FILL.nuc} stroke={PURPLE} strokeWidth={2.2} />
      <circle cx={274} cy={108} r={4.5} fill="#c4b5fd" />
      <Chloro x={300} y={52} /><Chloro x={362} y={52} /><Chloro x={426} y={190} /><Chloro x={448} y={110} r={90} />
      <Mito x={340} y={192} /><Mito x={276} y={160} r={80} />
      <Golgi x={420} y={52} />
      {[95, 145].map((y) => <rect key={y} x={462} y={y} width={8} height={5} fill={FILL.cyto} stroke={WALL_EDGE} strokeWidth={0.8} />)}
      <Badge x={276} y={86} n={1} /><Badge x={296} y={186} n={6} /><Badge x={420} y={72} n={5} /><Badge x={331} y={52} n={11} /><Badge x={370} y={125} n={12} />
      <Badge x={240} y={60} n={10} /><Badge x={451} y={170} n={9} /><Badge x={478 - 8} y={84} n={13} />

      {legend.map((t, i) => {
        const col = i < 7 ? 0 : 1;
        const row = i < 7 ? i : i - 7;
        const x = col === 0 ? 450 : 220;
        const y = 240 + row * 17;
        return (
          <g key={t}>
            <Badge x={x} y={y - 4} n={i + 1} />
            <He x={x - 14} y={y} size={11} anchor="end">{t}</He>
          </g>
        );
      })}
      <He x={110} y={346} size={10} color={MUTED}>לשניהם: גרעין, ER, גולג'י, מיטוכונדריה</He>
    </Svg>
  );
}

// ── b1-tonicity ──────────────────────────────────────────────────────────────
function Tonicity() {
  const cols: [number, string, string, string][] = [[340, "היפוטונית", "מתנפח ומתפוצץ", "טורגידי — המצב הרצוי"], [225, "איזוטונית", "תקין — המצב הרצוי", "רפוי"], [110, "היפרטונית", "מתכווץ", "פלסמוליזה"]];
  const crenate = Array.from({ length: 49 }, (_, i) => { const a = (i / 48) * 2 * Math.PI; const r = 22 + 3 * Math.cos(10 * a); return `${i ? "L" : "M"}${(110 + r * Math.cos(a)).toFixed(1)} ${(88 + r * Math.sin(a)).toFixed(1)}`; }).join("") + "Z";
  const water = (x: number, y: number, inward: boolean, dx: number) => inward
    ? <Arrow x1={x + dx} y1={y} x2={x + dx * 0.55} y2={y} color={BLUE} />
    : <Arrow x1={x + dx * 0.55} y1={y} x2={x + dx} y2={y} color={BLUE} />;
  return (
    <Svg h={300} label="תא דם אדום ותא צמחי בשלוש תמיסות. בהיפוטונית מים נכנסים: תא הדם מתנפח ומתפוצץ, התא הצמחי טורגידי. באיזוטונית אין תנועה נטו: תא הדם תקין, התא הצמחי רפוי. בהיפרטונית מים יוצאים: תא הדם מתכווץ, בתא הצמחי פלסמוליזה.">
      {cols.map(([x, t]) => <He key={t} x={x} y={22} size={12.5} bold>{t}</He>)}
      <He x={440} y={92} size={11.5} bold anchor="middle">תא דם</He>
      <He x={440} y={108} size={11.5} bold anchor="middle">אדום</He>
      <He x={440} y={212} size={11.5} bold anchor="middle">תא צמחי</He>

      <circle cx={340} cy={88} r={30} fill={FILL.red} stroke={RED} strokeWidth={1.6} />
      {[0, 1, 2, 3].map((i) => { const a = Math.PI / 4 + i * Math.PI / 2; return <line key={i} x1={340 + 33 * Math.cos(a)} y1={88 + 33 * Math.sin(a)} x2={340 + 40 * Math.cos(a)} y2={88 + 40 * Math.sin(a)} stroke={RED} strokeWidth={1.4} />; })}
      {water(340, 88, true, -58)}
      <ellipse cx={225} cy={88} rx={28} ry={15} fill={FILL.red} stroke={RED} strokeWidth={1.6} />
      <ellipse cx={225} cy={88} rx={12} ry={6} fill="#fecaca" stroke="none" />
      <path d={crenate} fill={FILL.red} stroke={RED} strokeWidth={1.4} />
      {water(110, 88, false, -54)}
      {cols.map(([x, , a]) => <He key={a} x={x} y={140} size={10.5} color={MUTED}>{a}</He>)}

      {cols.map(([x], i) => (
        <g key={x}>
          <rect x={x - 32} y={176} width={64} height={64} rx={3} fill={WALL} stroke={WALL_EDGE} strokeWidth={2} />
          {i === 0 && <rect x={x - 28} y={180} width={56} height={56} rx={4} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />}
          {i === 1 && <rect x={x - 27} y={181} width={54} height={54} rx={10} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />}
          {i === 2 && <ellipse cx={x} cy={208} rx={16} ry={20} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />}
          {i === 0 && <rect x={x - 18} y={190} width={36} height={36} rx={8} fill={FILL.sky} stroke={TEAL} strokeWidth={1} />}
          {i === 1 && <rect x={x - 14} y={194} width={28} height={28} rx={8} fill={FILL.sky} stroke={TEAL} strokeWidth={1} />}
          {i === 2 && <ellipse cx={x} cy={208} rx={7} ry={9} fill={FILL.sky} stroke={TEAL} strokeWidth={1} />}
        </g>
      ))}
      {water(340, 208, true, -60)}
      {water(110, 208, false, -60)}
      <Arrow x1={168} y1={202} x2={188} y2={202} color={BLUE} />
      <Arrow x1={188} y1={214} x2={168} y2={214} color={BLUE} />
      <Arrow x1={150} y1={82} x2={172} y2={82} color={BLUE} />
      <Arrow x1={172} y1={94} x2={150} y2={94} color={BLUE} />
      {cols.map(([x, , , b]) => <He key={b} x={x} y={262} size={10.5} color={MUTED}>{b}</He>)}
      <He x={240} y={290} size={10.5} color={BLUE}>חצים כחולים — כיוון תנועת המים</He>
    </Svg>
  );
}

// ── b1-transport-modes ───────────────────────────────────────────────────────
function TransportModes() {
  const M = { y1: 98, y2: 122 };
  return (
    <Svg h={240} label="דרכי מעבר דרך הממברנה (למעלה — מחוץ לתא, למטה — הציטופלזמה): דיפוזיה פשוטה, תעלה ונשא — הובלה סבילה במורד המפל; משאבת נתרן-אשלגן שצורכת ATP — הובלה פעילה ראשונית; וסימפורט Na⁺-גלוקוז — הובלה פעילה משנית.">
      <rect x={10} y={M.y1} width={460} height={M.y2 - M.y1} fill="#fef9c3" />
      <line x1={10} x2={470} y1={M.y1} y2={M.y1} stroke={MUTED} strokeWidth={1.6} />
      <line x1={10} x2={470} y1={M.y2} y2={M.y2} stroke={MUTED} strokeWidth={1.6} />

      <La x={440} y={48} size={11} bold>O₂, CO₂</La>
      <Arrow x1={440} y1={58} x2={440} y2={152} color={INK} />

      <rect x={336} y={86} width={13} height={48} rx={4} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <rect x={361} y={86} width={13} height={48} rx={4} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <He x={355} y={48} size={11} bold>יון</He>
      <Arrow x1={355} y1={58} x2={355} y2={152} color={BLUE} />

      <rect x={250} y={84} width={40} height={52} rx={12} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <He x={270} y={48} size={11} bold>גלוקוז</He>
      <Arrow x1={270} y1={58} x2={270} y2={152} color={GREEN} />

      <rect x={150} y={84} width={40} height={52} rx={6} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <Arrow x1={160} y1={140} x2={160} y2={60} color={RED} width={2} />
      <Arrow x1={180} y1={60} x2={180} y2={140} color={ORANGE} width={2} />
      <La x={152} y={54} size={11} bold color={RED} anchor="end">3Na⁺</La>
      <La x={188} y={54} size={11} bold color={ORANGE} anchor="start">2K⁺</La>
      <La x={170} y={160} size={10} color={PURPLE}>ATP → ADP + Pᵢ</La>

      <rect x={42} y={84} width={40} height={52} rx={12} fill={FILL.teal} stroke={TEAL} strokeWidth={1.4} />
      <Arrow x1={52} y1={60} x2={52} y2={140} color={RED} width={2} />
      <Arrow x1={72} y1={60} x2={72} y2={140} color={GREEN} width={2} />
      <La x={44} y={54} size={11} bold color={RED} anchor="end">Na⁺</La>
      <He x={80} y={54} size={11} bold color={GREEN} anchor="start">גלוקוז</He>

      {([[440, "דיפוזיה פשוטה"], [355, "תעלה"], [270, "נשא"], [170, "משאבה (ראשונית)"], [62, "סימפורט (משנית)"]] as [number, string][]).map(([x, t]) => <He key={t} x={x} y={182} size={11} bold>{t}</He>)}
      <path d="M232 192 L232 198 L472 198 L472 192" fill="none" stroke={GREEN} strokeWidth={1.4} />
      <He x={352} y={218} size={11} color={GREEN}>הובלה סבילה — במורד המפל</He>
      <path d="M12 192 L12 198 L214 198 L214 192" fill="none" stroke={RED} strokeWidth={1.4} />
      <He x={113} y={218} size={11} color={RED}>הובלה פעילה — נגד המפל</He>
    </Svg>
  );
}

// ── b1-exergonic ─────────────────────────────────────────────────────────────
function Exergonic() {
  const hump = (x0: number, yA: number, yB: number) => `M${x0} ${yA} L${x0 + 40} ${yA} C ${x0 + 70} ${yA}, ${x0 + 75} 60, ${x0 + 95} 60 C ${x0 + 115} 60, ${x0 + 120} ${yB}, ${x0 + 140} ${yB} L${x0 + 205} ${yB}`;
  const panel = (x0: number, yA: number, yB: number, title: string, sign: string, c: string) => (
    <g>
      <line x1={x0} y1={210} x2={x0 + 210} y2={210} stroke={INK} strokeWidth={1.4} markerEnd="url(#bfArrow)" />
      <line x1={x0} y1={210} x2={x0} y2={30} stroke={INK} strokeWidth={1.4} markerEnd="url(#bfArrow)" />
      <path d={hump(x0, yA, yB)} fill="none" stroke={c} strokeWidth={2.6} />
      <He x={x0 + 105} y={24} size={12.5} bold color={c}>{title}</He>
      <He x={x0 + 20} y={yA - 8} size={10.5}>מגיבים</He>
      <He x={x0 + 170} y={yB - 8} size={10.5}>תוצרים</He>
      <line x1={x0 + 202} y1={yA} x2={x0 + 202} y2={yB + (yB > yA ? -4 : 4)} stroke={c} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <line x1={x0 + 40} x2={x0 + 205} y1={yA} y2={yA} stroke={MUTED} strokeWidth={1} {...dash} />
      <La x={x0 + 196} y={(yA + yB) / 2 + 4} size={11} bold color={c} anchor="end">{`ΔG ${sign}`}</La>
      <He x={x0 + 105} y={230} size={10.5} color={MUTED}>מהלך התגובה</He>
    </g>
  );
  return (
    <Svg h={245} label="דיאגרמות אנרגיה חופשית. בתגובה אקסרגונית התוצרים נמוכים מהמגיבים — ΔG שלילי, האנרגיה משתחררת. בתגובה אנדרגונית התוצרים גבוהים מהמגיבים — ΔG חיובי, צריך להשקיע אנרגיה. בשתיהן יש מחסום — אנרגיית שפעול.">
      {panel(258, 110, 180, "אקסרגונית — משחררת אנרגיה", "< 0", GREEN)}
      {panel(18, 180, 110, "אנדרגונית — צורכת אנרגיה", "> 0", RED)}
      <He x={250} y={110} size={10.5} color={MUTED} rotate={-90}>אנרגיה חופשית (G)</He>
    </Svg>
  );
}

// ── b1-atp-cycle ─────────────────────────────────────────────────────────────
function AtpCycle() {
  return (
    <Svg h={285} label="מבנה ATP — אדנין, ריבוז ושלוש קבוצות פוספט — ומחזור ה-ATP: הידרוליזה של ATP ל-ADP ופוספט משחררת אנרגיה לעבודה בתא; אנרגיה מפירוק מזון (נשימה תאית) בונה ATP מחדש.">
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={110 + i * 46} cy={64} r={17} fill={FILL.yellow} stroke="#b45309" strokeWidth={1.5} />
          <La x={110 + i * 46} y={69} size={13} bold color="#b45309">P</La>
        </g>
      ))}
      {[0, 1, 2].map((i) => <line key={i} x1={127 + i * 46} y1={64} x2={139 + i * 46} y2={64} stroke={INK} strokeWidth={1.8} />)}
      <polygon points="258,46 280,58 272,84 244,84 236,58" fill={FILL.orange} stroke={ORANGE} strokeWidth={1.5} />
      <line x1={218} y1={64} x2={236} y2={64} stroke={INK} strokeWidth={1.8} />
      <line x1={272} y1={60} x2={300} y2={52} stroke={INK} strokeWidth={1.8} />
      <polygon points="318,34 338,34 348,52 338,70 318,70 308,52" fill={FILL.blue} stroke={BLUE} strokeWidth={1.5} />
      <polygon points="348,52 338,70 352,84 368,74 364,56" fill={FILL.blue} stroke={BLUE} strokeWidth={1.5} />
      <He x={156} y={104} size={11} color="#b45309">שלוש קבוצות פוספט</He>
      <He x={258} y={104} size={11} color={ORANGE}>ריבוז</He>
      <He x={340} y={104} size={11} color={BLUE}>אדנין</He>
      <He x={110} y={36} size={10} color={MUTED}>הפוספט שמוסר</He>

      <Bx x={380} y={180} w={92} h={36} t="ATP" c="#b45309" fill={FILL.yellow} bold size={14} />
      <Bx x={100} y={180} w={120} h={36} t="ADP + Pᵢ" c="#b45309" fill={FILL.yellow} bold size={14} />
      <path d="M380 178 C 360 132, 120 132, 100 176" fill="none" stroke={RED} strokeWidth={2.2} markerEnd="url(#bfArrow)" />
      <path d="M100 218 C 120 262, 360 262, 380 220" fill="none" stroke={GREEN} strokeWidth={2.2} markerEnd="url(#bfArrow)" />
      <He x={240} y={130} size={11.5} bold color={RED}>הידרוליזה: ΔG°′ ≈ −30.5 kJ/mol</He>
      <He x={240} y={160} size={10.5} color={RED}>← אנרגיה לעבודה: בנייה, הובלה, תנועה</He>
      <He x={240} y={228} size={10.5} color={GREEN}>אנרגיה מפירוק מזון (נשימה תאית) ←</He>
      <He x={240} y={276} size={11.5} bold color={GREEN}>בניית ATP: ΔG°′ ≈ +30.5 kJ/mol</He>
    </Svg>
  );
}

// ── b1-respiration-overview ──────────────────────────────────────────────────
function RespirationOverview() {
  return (
    <Svg h={275} label="מבט כללי על פירוק גלוקוז: גליקוליזה בציטוזול נותנת 2 פירובט ו-2 ATP. בלי חמצן — תסיסה (לקטט או אתנול ו-CO₂). עם חמצן — הפירובט נכנס למיטוכונדריון, הופך לאצטיל-CoA ונכנס למעגל קרבס; NADH ו-FADH₂ מזינים את שרשרת הנשימה וה-ATP סינתאז, שמייצרים את רוב ה-ATP, והחמצן הופך למים.">
      <rect x={4} y={4} width={472} height={266} rx={14} fill={FILL.gray} stroke={MUTED} strokeWidth={1.2} />
      <He x={440} y={262} size={10.5} color={MUTED}>ציטוזול</He>
      <Bx x={390} y={18} w={110} t="גלוקוז" c={GREEN} fill={FILL.green} bold />
      <Arrow x1={390} y1={48} x2={390} y2={92} />
      <He x={402} y={74} size={11} anchor="start" color={MUTED}>גליקוליזה</He>
      <La x={402} y={88} size={10} anchor="start" color="#b45309">2 ATP</La>
      <Bx x={390} y={94} w={110} t="2 פירובט" c={BLUE} fill={FILL.blue} bold />
      <Arrow x1={390} y1={124} x2={390} y2={182} />
      <He x={402} y={158} size={11} anchor="start" color={RED}>בלי O₂</He>
      <Bx x={390} y={184} w={150} h={46} t="תסיסה" t2="לקטט, או אתנול + CO₂" c={RED} fill={FILL.red} bold />

      <rect x={20} y={58} width={240} height={204} rx={34} fill={FILL.orange} stroke={ORANGE} strokeWidth={2} />
      <He x={92} y={80} size={11.5} bold color={ORANGE}>מיטוכונדריון</He>
      <Arrow x1={335} y1={109} x2={252} y2={109} />
      <He x={294} y={100} size={11} color={GREEN}>עם O₂</He>
      <Bx x={200} y={94} w={96} t="אצטיל-CoA" c={BLUE} fill="#fff" />
      <circle cx={100} cy={152} r={32} fill="#fff" stroke={PURPLE} strokeWidth={2} />
      <He x={100} y={150} size={11} bold color={PURPLE}>מעגל</He>
      <He x={100} y={164} size={11} bold color={PURPLE}>קרבס</He>
      <Arrow x1={170} y1={126} x2={132} y2={142} />
      <La x={142} y={186} size={10} anchor="start" color="#b45309">2 ATP</La>
      <Arrow x1={100} y1={184} x2={100} y2={206} />
      <La x={110} y={200} size={10} anchor="start" color={BLUE}>NADH, FADH₂</La>
      <Bx x={130} y={208} w={196} h={30} t="שרשרת הנשימה ו-ATP סינתאז" c={TEAL} fill={FILL.teal} size={11} />
      <La x={92} y={254} size={11} bold color="#b45309">≈26–28 ATP</La>
      <La x={196} y={254} size={10.5} color={BLUE}>O₂ → H₂O</La>
    </Svg>
  );
}

// ── b1-griffith ──────────────────────────────────────────────────────────────
const Bact = ({ x, y, s }: { x: number; y: number; s: "S" | "R" | "Sdead" }) => (
  <g>
    {s !== "R" && <ellipse cx={x} cy={y} rx={17} ry={11} fill="none" stroke={s === "Sdead" ? MUTED : GREEN} strokeWidth={2.4} {...(s === "Sdead" ? dash : {})} />}
    <ellipse cx={x} cy={y} rx={12} ry={7} fill={s === "Sdead" ? FILL.gray : s === "S" ? FILL.green : FILL.blue} stroke={s === "R" ? BLUE : s === "S" ? GREEN : MUTED} strokeWidth={1.4} />
  </g>
);
const Mouse = ({ x, y, dead }: { x: number; y: number; dead: boolean }) => (
  <g>
    <ellipse cx={x} cy={y} rx={24} ry={13} fill={dead ? FILL.gray : "#f5f5f4"} stroke={INK} strokeWidth={1.4} />
    <circle cx={x - 26} cy={y - 6} r={9} fill={dead ? FILL.gray : "#f5f5f4"} stroke={INK} strokeWidth={1.4} />
    <circle cx={x - 22} cy={y - 16} r={4} fill="#fce7f3" stroke={INK} strokeWidth={1} />
    <path d={`M${x + 24} ${y} q14 -2 18 10`} fill="none" stroke={INK} strokeWidth={1.4} />
  </g>
);
function Griffith() {
  const P: [number, string, ("S" | "R" | "Sdead")[], boolean][] = [[420, "S חי", ["S"], true], [300, "R חי", ["R"], false], [180, "S מומת בחום", ["Sdead"], false], [60, "R חי + S מומת", ["R", "Sdead"], true]];
  return (
    <Svg h={220} label="ניסוי גריפית': חיידקי S חיים הורגים עכבר; חיידקי R חיים לא; חיידקי S שהומתו בחום לא; אבל R חי יחד עם S מומת הורג את העכבר, ובדמו נמצאים חיידקי S חיים — משהו מה-S המת התמיר את ה-R.">
      {P.map(([x, t, bs, dead]) => (
        <g key={t}>
          <He x={x} y={22} size={11.5} bold>{t}</He>
          {bs.length === 1 ? <Bact x={x} y={52} s={bs[0]} /> : <><Bact x={x - 22} y={52} s={bs[0]} /><Bact x={x + 22} y={52} s={bs[1]} /></>}
          <Arrow x1={x} y1={70} x2={x} y2={106} />
          <Mouse x={x + 8} y={134} dead={dead} />
          <He x={x} y={176} size={12} bold color={dead ? RED : GREEN}>{dead ? "העכבר מת" : "העכבר חי"}</He>
        </g>
      ))}
      <He x={60} y={196} size={10.5} color={RED}>בדם: חיידקי S חיים</He>
      <He x={300} y={208} size={10} color={MUTED}>S — עם קופסית (אלים); R — בלי קופסית</He>
    </Svg>
  );
}

// ── b1-meselson-stahl ────────────────────────────────────────────────────────
function MeselsonStahl() {
  const tubes: [number, string, number[], ("H" | "L")[][]][] = [
    [380, "דור 0", [134], [["H", "H"]]],
    [250, "דור 1", [114], [["H", "L"], ["H", "L"]]],
    [120, "דור 2", [114, 94], [["H", "L"], ["L", "L"], ["H", "L"], ["L", "L"]]],
  ];
  return (
    <Svg h={250} label="ניסוי מזלסון וסטאל. דור 0: פס כבד בלבד. אחרי חלוקה אחת: פס ביניים בלבד — כל מולקולה גדיל כבד וגדיל קל. אחרי שתי חלוקות: פס ביניים ופס קל בכמות שווה. זה מתאים לשכפול חצי-שמרני.">
      {tubes.map(([x, t, bands, mols]) => (
        <g key={t}>
          <He x={x} y={24} size={12.5} bold>{t}</He>
          <path d={`M${x - 16} 36 L${x - 16} 150 Q${x - 16} 166 ${x} 166 Q${x + 16} 166 ${x + 16} 150 L${x + 16} 36`} fill={FILL.gray} stroke={MUTED} strokeWidth={1.6} />
          {bands.map((b) => <rect key={b} x={x - 13} y={b - 3} width={26} height={6} rx={2} fill={b === 134 ? BLUE : b === 114 ? PURPLE : "#93c5fd"} />)}
          {mols.map((m, i) => {
            const mx = x - (mols.length - 1) * 14 + i * 28;
            return (
              <g key={i}>
                {m.map((s, j) => <line key={j} x1={mx - 5 + j * 10} y1={186} x2={mx - 5 + j * 10} y2={226} stroke={s === "H" ? BLUE : "#93c5fd"} strokeWidth={5} strokeLinecap="round" />)}
              </g>
            );
          })}
        </g>
      ))}
      <He x={410} y={98} size={10.5} anchor="start" color="#3b82f6">קל</He>
      <He x={410} y={118} size={10.5} anchor="start" color={PURPLE}>ביניים</He>
      <He x={410} y={138} size={10.5} anchor="start" color={BLUE}>כבד</He>
      <He x={440} y={204} size={10} color={MUTED} anchor="middle">גדילים:</He>
      <He x={440} y={220} size={10} color={BLUE} anchor="middle">כהה = ¹⁵N</He>
      <He x={440} y={236} size={10} color="#3b82f6" anchor="middle">בהיר = ¹⁴N</He>
    </Svg>
  );
}

// ── b1-central-dogma ─────────────────────────────────────────────────────────
function CentralDogma() {
  return (
    <Svg h={205} label="הדוגמה המרכזית: DNA משוכפל ל-DNA, משועתק ל-RNA, ו-RNA מתורגם לחלבון. ברטרו-וירוסים RNA משועתק לאחור ל-DNA.">
      <Bx x={400} y={86} w={100} h={40} t="DNA" c={BLUE} fill={FILL.blue} bold size={15} />
      <Bx x={240} y={86} w={100} h={40} t="RNA" c={PURPLE} fill={FILL.purple} bold size={15} />
      <Bx x={80} y={86} w={110} h={40} t="חלבון" c={GREEN} fill={FILL.green} bold size={15} />
      <path d="M378 84 C 372 46, 428 46, 422 84" fill="none" stroke={BLUE} strokeWidth={2} markerEnd="url(#bfArrow)" />
      <He x={400} y={34} size={11.5} bold color={BLUE}>שכפול</He>
      <Arrow x1={348} y1={100} x2={292} y2={100} width={2} />
      <He x={320} y={88} size={11.5} bold>שעתוק</He>
      <Arrow x1={188} y1={100} x2={137} y2={100} width={2} />
      <He x={162} y={88} size={11.5} bold>תרגום</He>
      <Arrow x1={292} y1={116} x2={348} y2={116} color={RED} dashed />
      <He x={320} y={148} size={10.5} color={RED}>שעתוק לאחור (רטרו-וירוסים)</He>
      <He x={400} y={184} size={10} color={MUTED}>בגרעין</He>
      <He x={240} y={184} size={10} color={MUTED}>גרעין ← ציטופלזמה</He>
      <He x={80} y={184} size={10} color={MUTED}>על הריבוזום</He>
    </Svg>
  );
}

// ── b1-mrna-processing ───────────────────────────────────────────────────────
function MrnaProcessing() {
  const ex = (x0: number, x1: number, y: number, c = BLUE, f = FILL.blue) => <rect x={x0} y={y - 9} width={x1 - x0} height={18} rx={2} fill={f} stroke={c} strokeWidth={1.4} />;
  const gene = (y: number) => (
    <g>
      <line x1={40} x2={370} y1={y} y2={y} stroke={INK} strokeWidth={1.6} />
      {ex(60, 120, y)}{ex(180, 230, y)}{ex(290, 350, y)}
    </g>
  );
  return (
    <Svg h={250} label="עיבוד mRNA באאוקריוטים: הגן משועתק ל-pre-mRNA שמכיל אקסונים ואינטרונים. מוסיפים כובע 5′ וזנב פולי-A, והספלייסוזום חותך את האינטרונים ומחבר את האקסונים — נוצר mRNA בוגר שיוצא לציטופלזמה.">
      <He x={90} y={26} size={10.5} color={BLUE}>אקסון 1</He>
      <He x={150} y={26} size={10.5} color={MUTED}>אינטרון</He>
      <He x={205} y={26} size={10.5} color={BLUE}>אקסון 2</He>
      <He x={260} y={26} size={10.5} color={MUTED}>אינטרון</He>
      <He x={320} y={26} size={10.5} color={BLUE}>אקסון 3</He>
      <path d="M40 34 L40 22 L52 22" fill="none" stroke={GREEN} strokeWidth={1.6} markerEnd="url(#bfArrowS)" />
      {gene(46)}
      <He x={470} y={50} size={11.5} bold anchor="end">גן (DNA)</He>
      <Arrow x1={205} y1={62} x2={205} y2={88} />
      <He x={216} y={80} size={10.5} anchor="start" color={MUTED}>שעתוק</He>
      {gene(108)}
      <La x={32} y={112} size={10} color={MUTED} anchor="end">5′</La>
      <La x={378} y={112} size={10} color={MUTED} anchor="start">3′</La>
      <He x={470} y={112} size={11.5} bold anchor="end">pre-mRNA</He>
      <Arrow x1={205} y1={124} x2={205} y2={168} />
      <He x={216} y={142} size={10.5} anchor="start" color={MUTED}>כובע, זנב ושחבור</He>
      <He x={216} y={158} size={10.5} anchor="start" color={MUTED}>(האינטרונים מוסרים)</He>
      <circle cx={66} cy={190} r={12} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.4} />
      <La x={66} y={194} size={9} bold>m⁷G</La>
      <line x1={78} x2={92} y1={190} y2={190} stroke={INK} strokeWidth={1.6} />
      {ex(92, 152, 190)}{ex(152, 202, 190)}{ex(202, 262, 190)}
      <line x1={262} x2={276} y1={190} y2={190} stroke={INK} strokeWidth={1.6} />
      <La x={280} y={195} size={12} bold color={PURPLE} anchor="start">AAAA…</La>
      <He x={470} y={194} size={11.5} bold anchor="end">mRNA בוגר</He>
      <He x={66} y={226} size={10} color={ORANGE}>כובע 5′</He>
      <He x={177} y={226} size={10} color={BLUE}>האקסונים מחוברים</He>
      <He x={305} y={226} size={10} color={PURPLE}>זנב פולי-A</He>
    </Svg>
  );
}

// ── b1-genetic-code ──────────────────────────────────────────────────────────
function GeneticCode() {
  const B = ["U", "C", "A", "G"];
  const aa: Record<string, string> = {
    UUU: "Phe", UUC: "Phe", UUA: "Leu", UUG: "Leu", UCU: "Ser", UCC: "Ser", UCA: "Ser", UCG: "Ser", UAU: "Tyr", UAC: "Tyr", UAA: "Stop", UAG: "Stop", UGU: "Cys", UGC: "Cys", UGA: "Stop", UGG: "Trp",
    CUU: "Leu", CUC: "Leu", CUA: "Leu", CUG: "Leu", CCU: "Pro", CCC: "Pro", CCA: "Pro", CCG: "Pro", CAU: "His", CAC: "His", CAA: "Gln", CAG: "Gln", CGU: "Arg", CGC: "Arg", CGA: "Arg", CGG: "Arg",
    AUU: "Ile", AUC: "Ile", AUA: "Ile", AUG: "Met", ACU: "Thr", ACC: "Thr", ACA: "Thr", ACG: "Thr", AAU: "Asn", AAC: "Asn", AAA: "Lys", AAG: "Lys", AGU: "Ser", AGC: "Ser", AGA: "Arg", AGG: "Arg",
    GUU: "Val", GUC: "Val", GUA: "Val", GUG: "Val", GCU: "Ala", GCC: "Ala", GCA: "Ala", GCG: "Ala", GAU: "Asp", GAC: "Asp", GAA: "Glu", GAG: "Glu", GGU: "Gly", GGC: "Gly", GGA: "Gly", GGG: "Gly",
  };
  const x0 = 46, y0 = 44, cw = 100, ch = 72;
  return (
    <Svg h={354} label="טבלת הצופן הגנטי: 64 קודונים של mRNA — הבסיס הראשון בשורה, השני בעמודה, השלישי בתוך המשבצת. AUG (מתיונין) הוא קודון ההתחלה; UAA, UAG ו-UGA הם קודוני סיום.">
      <He x={x0 + 2 * cw} y={16} size={11.5} bold>הבסיס השני</He>
      <He x={14} y={y0 + 2 * ch} size={11.5} bold rotate={-90}>הבסיס הראשון</He>
      {B.map((b, i) => <La key={b} x={x0 + i * cw + cw / 2} y={36} size={13} bold>{b}</La>)}
      {B.map((b1, r) => (
        <g key={b1}>
          <La x={34} y={y0 + r * ch + ch / 2 + 5} size={13} bold>{b1}</La>
          {B.map((b2, c) => (
            <g key={b2}>
              <rect x={x0 + c * cw} y={y0 + r * ch} width={cw} height={ch} fill={(r + c) % 2 ? "#f8fafc" : "#fff"} stroke={MUTED} strokeWidth={1} />
              {B.map((b3, k) => {
                const cod = b1 + b2 + b3, a = aa[cod];
                const color = cod === "AUG" ? GREEN : a === "Stop" ? RED : INK;
                return <La key={b3} x={x0 + c * cw + 12} y={y0 + r * ch + 17 + k * 16} size={11} anchor="start" color={color} bold={color !== INK}>{`${cod}  ${a}`}</La>;
              })}
            </g>
          ))}
        </g>
      ))}
    </Svg>
  );
}

// ── b1-chromosome-terms ──────────────────────────────────────────────────────
const Chromatid = ({ x, y, h = 90, c = BLUE }: { x: number; y: number; h?: number; c?: string }) => (
  <path d={`M${x - 6} ${y} Q${x - 6} ${y - 6} ${x} ${y - 6} Q${x + 6} ${y - 6} ${x + 6} ${y} L${x + 6} ${y + h / 2 - 8} Q${x + 3} ${y + h / 2} ${x + 6} ${y + h / 2 + 8} L${x + 6} ${y + h} Q${x + 6} ${y + h + 6} ${x} ${y + h + 6} Q${x - 6} ${y + h + 6} ${x - 6} ${y + h} L${x - 6} ${y + h / 2 + 8} Q${x - 3} ${y + h / 2} ${x - 6} ${y + h / 2 - 8} Z`} fill={c === BLUE ? FILL.blue : FILL.red} stroke={c} strokeWidth={1.6} />
);
function ChromosomeTerms() {
  return (
    <Svg h={230} label="כרומוזום לפני השכפול (מולקולת DNA אחת) ואחרי השכפול (שתי כרומטידות אחיות שמחוברות בצנטרומר, עם קינטוכור). מימין לשמאל: זוג כרומוזומים הומולוגיים — אחד מהאם ואחד מהאב — כל אחד משוכפל.">
      <Chromatid x={430} y={50} />
      <He x={430} y={180} size={11} bold>לפני השכפול</He>
      <He x={430} y={196} size={10} color={MUTED}>(G1)</He>
      <Arrow x1={406} y1={100} x2={354} y2={100} width={2} />
      <He x={380} y={88} size={10.5} color={MUTED}>שלב S</He>
      <Chromatid x={318} y={50} /><Chromatid x={331} y={50} />
      <rect x={312} y={89} width={25} height={12} rx={3} fill={INK} opacity={0.8} />
      <He x={325} y={180} size={11} bold>אחרי השכפול</He>
      <He x={325} y={196} size={10} color={MUTED}>כרומוזום אחד, שתי כרומטידות</He>
      <He x={262} y={40} size={10.5} anchor="end">כרומטידות אחיות</He><Lead x1={258} y1={46} x2={312} y2={64} />
      <He x={262} y={104} size={10.5} anchor="end">צנטרומר + קינטוכור</He><Lead x1={262} y1={100} x2={310} y2={95} />

      <Chromatid x={80} y={50} c={RED} /><Chromatid x={93} y={50} c={RED} />
      <Chromatid x={140} y={50} /><Chromatid x={153} y={50} />
      <He x={86} y={180} size={10.5} color={RED}>מהאם</He>
      <He x={146} y={180} size={10.5} color={BLUE}>מהאב</He>
      <He x={116} y={204} size={11} bold>זוג הומולוגי</He>
      <He x={116} y={220} size={10} color={MUTED}>אותם גנים, אולי אללים שונים</He>
    </Svg>
  );
}

// ── b1-mitosis-phases ────────────────────────────────────────────────────────
type Ch = { x: number; y: number; c: string; l: number; rot?: number };
const XChrom = ({ x, y, c, l, rot = 0 }: Ch) => (
  <g transform={`rotate(${rot} ${x} ${y})`}>
    <rect x={x - 4.5} y={y - l / 2} width={4} height={l} rx={2} fill={c} />
    <rect x={x + 0.5} y={y - l / 2} width={4} height={l} rx={2} fill={c} />
  </g>
);
const Single = ({ x, y, c, l, rot = 0 }: Ch) => <rect x={x - 2} y={y - l / 2} width={4} height={l} rx={2} fill={c} transform={`rotate(${rot} ${x} ${y})`} />;
const Centro = ({ x, y }: { x: number; y: number }) => <g><rect x={x - 4} y={y - 2} width={8} height={4} fill={ORANGE} /><rect x={x - 2} y={y - 4} width={4} height={8} fill={ORANGE} transform={`rotate(90 ${x} ${y})`} /></g>;
function MitosisPhases() {
  const C = [RED, BLUE, "#f87171", "#60a5fa"];
  const L = [22, 22, 14, 14];
  const panel = (cx: number, cy: number, title: string, body: React.ReactNode, cell?: React.ReactNode) => (
    <g key={title}>
      {cell ?? <circle cx={cx} cy={cy} r={54} fill={FILL.cyto} stroke={MUTED} strokeWidth={1.6} />}
      {body}
      <He x={cx} y={cy + 72} size={12} bold>{title}</He>
    </g>
  );
  const spindle = (cx: number, cy: number, pts: [number, number][], half = 46) => (
    <g>
      {pts.map(([x, y], i) => <line key={i} x1={x < cx ? cx - half : cx + half} y1={cy} x2={x} y2={y} stroke="#94a3b8" strokeWidth={1} />)}
      <Centro x={cx - half} y={cy} /><Centro x={cx + half} y={cy} />
    </g>
  );
  const P = [[400, 70], [240, 70], [80, 70], [400, 222], [240, 222], [80, 222]];
  const [ix, iy] = P[0], [px, py] = P[1], [mx, my] = P[2], [tx, ty] = P[3], [ax, ay] = P[4], [lx, ly] = P[5];
  return (
    <Svg h={305} label="שלבי המיטוזה בתא עם 2n = 4: שלב ביניים (G2) — כרומטין מפוזר בגרעין; פרופאזה — הכרומוזומים מתעבים והכישור מתחיל להיבנות; פרומטאפאזה — מעטפת הגרעין מתפרקת והמיקרוטובולים נקשרים לקינטוכורים; מטאפאזה — הכרומוזומים בשורה באמצע; אנפזה — הכרומטידות האחיות נמשכות לקטבים; טלופאזה וציטוקינזה — שני גרעינים ושני תאים.">
      {panel(ix, iy, "שלב ביניים (G2)", <g>
        <circle cx={ix} cy={iy} r={28} fill={FILL.nuc} stroke={PURPLE} strokeWidth={1.6} />
        <path d={`M${ix - 18} ${iy - 6} c6 -10 12 10 18 0 s10 10 16 2 M${ix - 16} ${iy + 10} c8 -6 14 8 22 0 s8 -8 12 2`} fill="none" stroke={RED} strokeWidth={1.4} />
        <path d={`M${ix - 10} ${iy - 16} c6 4 10 -4 16 2 M${ix - 6} ${iy + 18} c6 -4 10 4 14 -2`} fill="none" stroke={BLUE} strokeWidth={1.4} />
        <Centro x={ix + 36} y={iy - 34} /><Centro x={ix + 42} y={iy - 28} />
      </g>)}
      {panel(px, py, "פרופאזה", <g>
        <circle cx={px} cy={py} r={28} fill={FILL.nuc} stroke={PURPLE} strokeWidth={1.6} />
        <XChrom x={px - 12} y={py - 6} c={C[0]} l={L[0]} rot={30} /><XChrom x={px + 10} y={py + 6} c={C[1]} l={L[1]} rot={-20} />
        <XChrom x={px - 6} y={py + 14} c={C[2]} l={L[2]} rot={70} /><XChrom x={px + 12} y={py - 14} c={C[3]} l={L[3]} rot={10} />
        <Centro x={px - 38} y={py - 32} /><Centro x={px + 38} y={py - 32} />
        <path d={`M${px - 34} ${py - 34} Q${px} ${py - 50} ${px + 34} ${py - 34}`} fill="none" stroke="#94a3b8" strokeWidth={1} />
      </g>)}
      {panel(mx, my, "פרומטאפאזה", <g>
        {[[-20, -24], [16, -26], [26, 18], [-24, 20]].map(([dx, dy], i) => <path key={i} d={`M${mx + dx} ${my + dy} q6 -3 10 2`} fill="none" stroke={PURPLE} strokeWidth={1.4} />)}
        {spindle(mx, my, [[mx - 10, my - 10], [mx + 8, my + 8], [mx - 4, my + 14], [mx + 12, my - 12]])}
        <XChrom x={mx - 10} y={my - 10} c={C[0]} l={L[0]} rot={40} /><XChrom x={mx + 8} y={my + 8} c={C[1]} l={L[1]} rot={-30} />
        <XChrom x={mx - 4} y={my + 14} c={C[2]} l={L[2]} rot={60} /><XChrom x={mx + 12} y={my - 12} c={C[3]} l={L[3]} rot={-10} />
      </g>)}
      {panel(tx, ty, "מטאפאזה", <g>
        {spindle(tx, ty, [[tx - 3, ty - 30], [tx + 3, ty - 30], [tx - 3, ty - 10], [tx + 3, ty - 10], [tx - 3, ty + 10], [tx + 3, ty + 10], [tx - 3, ty + 28], [tx + 3, ty + 28]])}
        {[-30, -10, 10, 28].map((dy, i) => <XChrom key={i} x={tx} y={ty + dy} c={C[i]} l={L[i]} rot={90} />)}
      </g>)}
      {panel(ax, ay, "אנפזה", <g>
        {spindle(ax, ay, [[ax - 22, ay - 24], [ax - 22, ay - 8], [ax - 22, ay + 8], [ax - 22, ay + 24], [ax + 22, ay - 24], [ax + 22, ay - 8], [ax + 22, ay + 8], [ax + 22, ay + 24]], 54)}
        {[-24, -8, 8, 24].map((dy, i) => <g key={i}><Single x={ax - 24} y={ay + dy} c={C[i]} l={L[i]} rot={90} /><Single x={ax + 24} y={ay + dy} c={C[i]} l={L[i]} rot={90} /></g>)}
      </g>, <ellipse cx={ax} cy={ay} rx={64} ry={48} fill={FILL.cyto} stroke={MUTED} strokeWidth={1.6} />)}
      {panel(lx, ly, "טלופאזה וציטוקינזה", <g>
        {[-1, 1].map((s) => (
          <g key={s}>
            <circle cx={lx + s * 32} cy={ly} r={18} fill={FILL.nuc} stroke={PURPLE} strokeWidth={1.4} />
            {[-8, -2, 4, 10].map((dy, i) => <Single key={i} x={lx + s * 32} y={ly + dy} c={C[i]} l={L[i] * 0.8} rot={90} />)}
          </g>
        ))}
      </g>, <path d={`M${lx} ${ly - 30} C ${lx - 10} ${ly - 46}, ${lx - 72} ${ly - 46}, ${lx - 72} ${ly} C ${lx - 72} ${ly + 46}, ${lx - 10} ${ly + 46}, ${lx} ${ly + 30} C ${lx + 10} ${ly + 46}, ${lx + 72} ${ly + 46}, ${lx + 72} ${ly} C ${lx + 72} ${ly - 46}, ${lx + 10} ${ly - 46}, ${lx} ${ly - 30} Z`} fill={FILL.cyto} stroke={MUTED} strokeWidth={1.6} />)}
    </Svg>
  );
}

// ── b1-meiosis-vs-mitosis ────────────────────────────────────────────────────
function MeiosisVsMitosis() {
  const R = RED, B = BLUE;
  const cell = (x: number, y: number, r: number) => <circle cx={x} cy={y} r={r} fill={FILL.cyto} stroke={MUTED} strokeWidth={1.4} />;
  const X = (x: number, y: number, c: string, l: number, c2?: string) => (
    <g>
      <rect x={x - 4.5} y={y - l / 2} width={4} height={l} rx={2} fill={c} />
      <rect x={x + 0.5} y={y - l / 2} width={4} height={l} rx={2} fill={c} />
      {c2 && <rect x={x + 0.5} y={y - l / 2} width={4} height={l * 0.35} rx={2} fill={c2} />}
    </g>
  );
  const S1 = (x: number, y: number, c: string, l: number) => <rect x={x - 2} y={y - l / 2} width={4} height={l} rx={2} fill={c} />;
  return (
    <Svg h={385} label="מיטוזה מול מיוזה, מתא עם 2n = 4 אחרי שכפול. במיטוזה כל כרומוזום מסתדר לבד במרכז, הכרומטידות האחיות נפרדות, ונוצרים שני תאים דיפלואידיים זהים. במיוזה I הזוגות ההומולוגיים מסתדרים יחד (עם שחלוף) ונפרדים — שני תאים הפלואידיים; במיוזה II נפרדות הכרומטידות האחיות — ארבעה תאים הפלואידיים שונים.">
      <He x={360} y={20} size={13.5} bold color={BLUE}>מיטוזה</He>
      <He x={120} y={20} size={13.5} bold color={PURPLE}>מיוזה</He>
      <line x1={240} y1={10} x2={240} y2={375} stroke="#e2e8f0" strokeWidth={1} />

      {cell(360, 80, 36)}
      {X(346, 70, R, 22)}{X(370, 92, B, 14)}{X(356, 96, R, 14)}{X(374, 66, B, 22)}
      <He x={360} y={134} size={10} color={MUTED}>2n = 4, אחרי שכפול</He>
      <Arrow x1={360} y1={140} x2={360} y2={158} />
      {cell(360, 200, 36)}
      {[[-24, R, 22], [-8, B, 22], [8, R, 14], [22, B, 14]].map(([dy, c, l]) => <g key={dy as number} transform={`rotate(90 360 ${200 + (dy as number)})`}>{X(360, 200 + (dy as number), c as string, l as number)}</g>)}
      <He x={318} y={196} size={9.5} color={MUTED} anchor="end">מטאפאזה:</He>
      <He x={318} y={210} size={9.5} color={MUTED} anchor="end">כל אחד לבד</He>
      <Arrow x1={348} y1={240} x2={322} y2={268} />
      <Arrow x1={372} y1={240} x2={398} y2={268} />
      {[310, 410].map((x) => (
        <g key={x}>
          {cell(x, 300, 30)}
          {S1(x - 12, 296, R, 20)}{S1(x - 4, 296, B, 20)}{S1(x + 4, 302, R, 13)}{S1(x + 12, 302, B, 13)}
        </g>
      ))}
      <He x={360} y={350} size={11} bold>2 תאים, 2n, זהים</He>

      {cell(120, 80, 36)}
      {X(106, 70, R, 22)}{X(130, 92, B, 14)}{X(116, 96, R, 14)}{X(134, 66, B, 22)}
      <He x={120} y={134} size={10} color={MUTED}>2n = 4, אחרי שכפול</He>
      <Arrow x1={120} y1={140} x2={120} y2={158} />
      {cell(120, 200, 36)}
      <g transform="rotate(90 120 192)">{X(116, 192, R, 22, B)}{X(126, 192, B, 22, R)}</g>
      <g transform="rotate(90 120 214)">{X(116, 214, R, 14)}{X(126, 214, B, 14)}</g>
      <He x={6} y={196} size={10} color={MUTED} anchor="start">מיוזה I:</He>
      <He x={6} y={210} size={10} color={MUTED} anchor="start">זוגות + שחלוף</He>
      <Arrow x1={108} y1={240} x2={84} y2={258} />
      <Arrow x1={132} y1={240} x2={156} y2={258} />
      {cell(70, 280, 22)}{X(64, 280, R, 20, B)}{X(77, 282, B, 13)}
      {cell(170, 280, 22)}{X(164, 280, B, 20, R)}{X(177, 282, R, 13)}
      <He x={120} y={318} size={10} color={MUTED}>מיוזה II</He>
      {[[38, R, R, B], [96, R, B, B], [146, B, B, R], [202, B, R, R]].map(([x, c1, c1b, c2]) => (
        <g key={x as number}>
          {cell(x as number, 346, 18)}
          {S1((x as number) - 5, 346, c1 as string, 18)}
          <rect x={(x as number) - 7} y={337} width={4} height={6} rx={2} fill={c1b as string} />
          {S1((x as number) + 5, 348, c2 as string, 12)}
        </g>
      ))}
      <He x={120} y={378} size={11} bold>4 תאים, n, שונים</He>
    </Svg>
  );
}

// ── b1-cell-fate ─────────────────────────────────────────────────────────────
function CellFate() {
  const dots = (cx: number, cy: number, n: number, spread: number, seed: number) => Array.from({ length: n }, (_, i) => {
    const a = (i * 2.4 + seed) % (2 * Math.PI), r = spread * Math.sqrt(((i * 37 + seed * 11) % 100) / 100);
    return <circle key={i} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={2.4} fill={PURPLE} />;
  });
  return (
    <Svg h={250} label="שתי דרכים לקבוע את גורל התא. הפרדה ציטופלזמית: מרכיבים מרוכזים בצד אחד של הביצית, ובחלוקה רק תא בת אחד מקבל אותם — ולכן שני התאים שונים. השראה: תא אחד מפריש אות; תאים קרובים מקבלים הרבה אות ותאים רחוקים פחות, וכל ריכוז מוביל לגורל אחר.">
      <He x={360} y={20} size={12.5} bold>הפרדה ציטופלזמית</He>
      <circle cx={300} cy={90} r={40} fill={FILL.cyto} stroke={MUTED} strokeWidth={1.6} />
      {dots(318, 90, 14, 16, 1)}
      <Arrow x1={348} y1={90} x2={380} y2={90} />
      <He x={364} y={78} size={10} color={MUTED}>חלוקה</He>
      <circle cx={410} cy={70} r={24} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.6} />
      <circle cx={410} cy={118} r={24} fill={FILL.cyto} stroke={MUTED} strokeWidth={1.6} />
      {dots(410, 70, 12, 13, 3)}
      <He x={300} y={150} size={10.5} color={PURPLE}>מרכיבים בצד אחד</He>
      <He x={410} y={160} size={10.5} color={MUTED}>רק תא אחד מקבל</He>
      <He x={360} y={200} size={10.5} color={MUTED}>(למשל הסהר האפור בביצית צפרדע)</He>

      <He x={120} y={20} size={12.5} bold>השראה</He>
      <circle cx={210} cy={100} r={18} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.8} />
      <He x={196} y={58} size={10.5} color={ORANGE}>תא מפריש אות</He>
      {[[160, 100, "#86efac", GREEN], [110, 100, "#bbf7d0", GREEN], [60, 100, "#f1f5f9", MUTED]].map(([x, y, f, c]) => <circle key={x as number} cx={x as number} cy={y as number} r={18} fill={f as string} stroke={c as string} strokeWidth={1.6} />)}
      {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={186 - i * 18} cy={74 + (i % 2) * 52} r={2.2 - i * 0.25} fill={ORANGE} />)}
      <He x={160} y={140} size={10} color={GREEN}>הרבה אות</He>
      <He x={110} y={158} size={10} color={GREEN}>מעט</He>
      <He x={60} y={140} size={10} color={MUTED}>בלי</He>
      <He x={120} y={200} size={10.5} color={MUTED}>כל ריכוז ← גורל אחר</He>
      <He x={120} y={216} size={10.5} color={MUTED}>(למשל עדשת העין, הפות ב-C. elegans)</He>
      <line x1={240} y1={30} x2={240} y2={240} stroke="#e2e8f0" strokeWidth={1} />
    </Svg>
  );
}

// ── b1-potency ───────────────────────────────────────────────────────────────
function Potency() {
  return (
    <Svg h={330} label="היררכיה של תאי גזע: הזיגוטה טוטיפוטנטית (כל התאים כולל השליה); תאי המסה הפנימית של הבלסטוציסט — תאי גזע עובריים — פלוריפוטנטיים; תאי גזע בוגרים, כמו תאי גזע המטופויטיים, מולטיפוטנטיים; ובסוף תאים ממוינים. ארבעה גורמי שעתוק מחזירים תא ממוין למצב פלוריפוטנטי (iPS).">
      {([[24, "טוטיפוטנטי", "כל התאים + השליה"], [104, "פלוריפוטנטי", "כל תאי הגוף"], [184, "מולטיפוטנטי", "רקמה אחת"], [264, "ממוין", ""]] as [number, string, string][]).map(([y, t, d]) => (
        <g key={t}>
          <He x={470} y={y + 18} size={12} bold anchor="end">{t}</He>
          {d && <He x={470} y={y + 34} size={9.5} color={MUTED} anchor="end">{d}</He>}
        </g>
      ))}
      <Bx x={200} y={24} w={150} h={36} t="זיגוטה" c={PURPLE} fill={FILL.purple} bold />
      <Arrow x1={200} y1={60} x2={200} y2={100} />
      <Bx x={200} y={102} w={200} h={40} t="תאים פלוריפוטנטיים" t2="ES מהמסה הפנימית; iPS" c={BLUE} fill={FILL.blue} bold />
      <Arrow x1={160} y1={142} x2={110} y2={182} />
      <Arrow x1={240} y1={142} x2={290} y2={182} />
      <Bx x={100} y={184} w={150} h={40} t="תא גזע המטופויטי" t2="(מח העצם)" c={GREEN} fill={FILL.green} />
      <Bx x={300} y={184} w={130} h={40} t="תא גזע עצבי" c={GREEN} fill={FILL.green} />
      <Arrow x1={70} y1={224} x2={50} y2={262} />
      <Arrow x1={130} y1={224} x2={150} y2={262} />
      <Arrow x1={300} y1={224} x2={300} y2={262} />
      <Bx x={50} y={264} w={84} t="תא דם אדום" c={RED} fill={FILL.red} size={10.5} />
      <Bx x={150} y={264} w={84} t="תא דם לבן" c={MUTED} fill={FILL.gray} size={10.5} />
      <Bx x={300} y={264} w={84} t="תא עצב" c={ORANGE} fill={FILL.orange} size={10.5} />
      <Bx x={394} y={264} w={84} t="פיברובלסט" c={MUTED} fill={FILL.gray} size={10.5} />
      <path d="M394 262 L394 150 Q394 122 366 122 L302 122" fill="none" stroke={TEAL} strokeWidth={2} {...dash} markerEnd="url(#bfArrow)" />
      <He x={386} y={160} size={10.5} bold color={TEAL} anchor="end">iPS: 4 גורמי</He>
      <He x={386} y={175} size={10.5} bold color={TEAL} anchor="end">שעתוק (ימנקה)</He>
    </Svg>
  );
}

export const BIO1_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "b1-life-timeline": { el: LifeTimeline, captionHe: "ציר הזמן של החיים על כדור הארץ (בקירוב). במשך רוב ההיסטוריה היצורים היו חד-תאיים; רוב קבוצות בעלי החיים מופיעות רק ב-540 מיליון השנים האחרונות. סכמטי." },
  "b1-hierarchy": { el: Hierarchy, captionHe: "רמות הארגון הביולוגי. כל רמה בנויה מיחידות של הרמה שמתחתיה, ובכל רמה מופיעות תכונות מתהוות שאין ברמות הנמוכות. בכל משבצת — דוגמה. סכמטי." },
  "b1-scientific-method": { el: ScientificMethod, captionHe: "השיטה המדעית. השערה חייבת להוביל לניבוי שאפשר לבדוק ולהפריך. תוצאות לא \"מוכיחות\" השערה — הן תומכות בה או מפריכות אותה; בפועל עוברים בין השלבים הלוך ושוב. סכמטי." },
  "b1-amino-acid": { el: AminoAcid, captionHe: "למעלה: המבנה הכללי של חומצת אמינו — רק שרשרת הצד (R) שונה בין ה-20. למטה: קשר פפטידי בין שתי חומצות אמינו נוצר בתגובת עיבוי שמשחררת מים; לשרשרת יש קצה N וקצה C. סכמטי." },
  "b1-protein-levels": { el: ProteinLevels, captionHe: "ארבע רמות המבנה של חלבון. הרצף (ראשוני) קובע את הקיפול; המבנה השניוני מוחזק בקשרי מימן של השלד, השלישוני בעיקר באינטראקציות בין שרשראות צד (כולל קשרים דיסולפידיים), והרבעוני מחבר תת-יחידות. סכמטי." },
  "b1-enzyme-regulation": { el: EnzymeRegulation, captionHe: "בקרת אנזימים. מעכב תחרותי מתחרה במצע על האתר הפעיל (ריכוז מצע גבוה מתגבר עליו); מעכב לא-תחרותי נקשר באתר אחר ומוריד את Vmax; באנזים אלוסטרי, מפעילים ומעכבים נקשרים לאתר בקרה ומייצבים צורה פעילה או לא פעילה; בעיכוב במשוב התוצר הסופי מעכב את האנזים הראשון. סכמטי." },
  "b1-prok-euk": { el: ProkEuk, captionHe: "תא פרוקריוטי מול תא אאוקריוטי. לשניהם ממברנה, ציטופלזמה, DNA וריבוזומים; לפרוקריוט אין גרעין ואין אברונים עם ממברנה. סכמטי, לא בקנה מידה." },
  "b1-virus": { el: Virus, captionHe: "מבנה של וירוסים: חומר גנטי (DNA או RNA) בתוך קפסיד של חלבון; לחלק מהווירוסים גם מעטפת שומנית שנלקחת מממברנת התא המאכסן, עם חלבונים ויראליים. סכמטי, לא בקנה מידה." },
  "b1-animal-plant-cell": { el: AnimalPlantCell, captionHe: "תא של בעל חיים מול תא צמחי (המספרים לפי המקרא). ייחודי לצמח: דופן תאית, כלורופלסטים, וואקואולה מרכזית ופלזמודסמטה; לבעל החיים: צנטריולים וליזוזומים. לשניהם — גרעין, ER, גולג'י ומיטוכונדריה. סכמטי." },
  "b1-tonicity": { el: Tonicity, captionHe: "השפעת הטוניות על תאים. תא של בעל חיים תקין בתמיסה איזוטונית; תא צמחי — בהיפוטונית, כשהטורגור לוחץ על הדופן. סכמטי." },
  "b1-transport-modes": { el: TransportModes, captionHe: "דרכי מעבר דרך הממברנה (למעלה — מחוץ לתא). הובלה סבילה, במורד המפל: דיפוזיה פשוטה, תעלה, נשא. הובלה פעילה, נגד המפל: משאבת הנתרן-אשלגן (ראשונית, ATP) וסימפורט Na⁺-גלוקוז (משנית — מנצל את מפל ה-Na⁺ שהמשאבה בנתה). סכמטי." },
  "b1-exergonic": { el: Exergonic, captionHe: "תגובה אקסרגונית (ΔG < 0) יכולה להתרחש מעצמה; אנדרגונית (ΔG > 0) צריכה אנרגיה ממקור אחר. בשתיהן יש מחסום של אנרגיית שפעול, שקובע את המהירות — לא את הכיוון. סכמטי." },
  "b1-atp-cycle": { el: AtpCycle, captionHe: "ATP ומחזור ה-ATP. ההידרוליזה של הפוספט האחרון משחררת כ-30.5 kJ/mol (בתנאים סטנדרטיים), שמניעים עבודה בתא; נשימה תאית בונה ATP מחדש מ-ADP ו-Pᵢ. סכמטי." },
  "b1-respiration-overview": { el: RespirationOverview, captionHe: "פירוק גלוקוז באאוקריוטים. גליקוליזה בציטוזול; בלי חמצן — תסיסה (2 ATP לגלוקוז); עם חמצן — חמצון הפירובט, מעגל קרבס ושרשרת הנשימה במיטוכונדריון, בסך הכול כ-30–32 ATP לגלוקוז. סכמטי." },
  "b1-griffith": { el: Griffith, captionHe: "ניסוי גריפית' (1928). חומר מחיידקי S מתים הפך חיידקי R לאלימים, והשינוי עבר בתורשה — \"עיקרון ההתמרה\", שאייברי ועמיתיו זיהו ב-1944 כ-DNA. סכמטי." },
  "b1-meselson-stahl": { el: MeselsonStahl, captionHe: "ניסוי מזלסון וסטאל (1958). DNA כבד (¹⁵N) עבר למצע קל (¹⁴N). אחרי דור אחד — פס ביניים בלבד (פוסל שכפול שמרני); אחרי שני דורות — ביניים וקל בכמות שווה (פוסל שכפול מפוזר). למטה: הגדילים בכל מולקולה. סכמטי." },
  "b1-central-dogma": { el: CentralDogma, captionHe: "הדוגמה המרכזית: המידע זורם מ-DNA ל-RNA ולחלבון. רטרו-וירוסים מעתיקים RNA ל-DNA; אין מעבר מחלבון חזרה לחומצת גרעין. סכמטי." },
  "b1-mrna-processing": { el: MrnaProcessing, captionHe: "עיבוד mRNA באאוקריוטים: כובע 5′, זנב פולי-A ושחבור — האינטרונים מוסרים והאקסונים מתחברים. בחיידקים אין שלב כזה; ה-mRNA מתורגם תוך כדי השעתוק. סכמטי." },
  "b1-genetic-code": { el: GeneticCode, captionHe: "הצופן הגנטי (קודונים של mRNA, מ-5′ ל-3′). ירוק — AUG, קודון ההתחלה (מתיונין); אדום — שלושת קודוני הסיום. לרוב חומצות האמינו יש כמה קודונים, שנבדלים בעיקר בבסיס השלישי." },
  "b1-chromosome-terms": { el: ChromosomeTerms, captionHe: "מושגי יסוד: כרומוזום לפני השכפול ואחריו (שתי כרומטידות אחיות מחוברות בצנטרומר), וזוג כרומוזומים הומולוגיים — אחד מכל הורה. סכמטי." },
  "b1-mitosis-phases": { el: MitosisPhases, captionHe: "שלבי המיטוזה בתא עם 2n = 4 (אדום — מהאם, כחול — מהאב; כתום — צנטרוזומים). באנפזה נפרדות הכרומטידות האחיות, ולכן כל תא בת מקבל עותק של כל כרומוזום. סכמטי." },
  "b1-meiosis-vs-mitosis": { el: MeiosisVsMitosis, captionHe: "מיטוזה מול מיוזה. ההבדל המרכזי במטאפאזה: במיטוזה כל כרומוזום מסתדר לבד; במיוזה I ההומולוגיים מסתדרים בזוגות (ושחלוף מערבב קטעים) ונפרדים זה מזה. התוצאה: 2 תאים דיפלואידיים זהים מול 4 תאים הפלואידיים שונים. סכמטי." },
  "b1-cell-fate": { el: CellFate, captionHe: "שתי דרכים לקבוע את גורל התא: הפרדה לא שווה של מרכיבים בציטופלזמה בזמן החלוקה, והשראה — אות מתא שכן, שהשפעתו תלויה בריכוז. סכמטי." },
  "b1-potency": { el: Potency, captionHe: "היררכיית תאי הגזע: ככל שהתא מתמיין, הפוטנציה שלו מצטמצמת. תאי iPS נוצרים כשמחזירים תא ממוין למצב פלוריפוטנטי בעזרת ארבעה גורמי שעתוק. סכמטי." },
};
