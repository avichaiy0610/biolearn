/* Figures for the neurobiology units (Technion 134157). Original schematic drawings; curves and traces are idealized
   shapes (marked as such in the captions), not data. Layout conventions follow Bear, Connors & Paradiso and Kandel,
   Principles of Neural Science — never copied. Labels sit beside shapes and arrows, never on a line.
   Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, Axes, BLUE, GREEN, INK, MUTED, ORANGE, He, La, curve, scale } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

import { Bbb } from "./redraws/Bbb";
import { BrainRegions } from "./redraws/BrainRegions";
import { VesicleRelease } from "./redraws/VesicleRelease";
import { LtpNmda } from "./redraws/LtpNmda";
import { KChannel } from "./redraws/KChannel";
import { NeuralTube } from "./redraws/NeuralTube";
import { GrowthCone } from "./redraws/GrowthCone";
import { NeuronParts } from "./redraws/NeuronParts";
import { GliaTypes } from "./redraws/GliaTypes";
import { ReceptorTypes } from "./redraws/ReceptorTypes";
import { CortexMigration } from "./redraws/CortexMigration";
import { AppProcessing } from "./redraws/AppProcessing";
const PURPLE = "#7c3aed";
const RED = "#b91c1c";
const TEAL = "#0f766e";
const GOLD = "#a16207";
const FILL = { blue: "#dbeafe", green: "#dcfce7", orange: "#ffedd5", purple: "#ede9fe", yellow: "#fef3c7", gray: "#f1f5f9", red: "#fee2e2", sky: "#e0f2fe", teal: "#ccfbf1", pink: "#fce7f3", membrane: "#fde68a" };

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
function Box2({ x, y, w, h, fill, stroke, lines, size = 10 }: { x: number; y: number; w: number; h: number; fill: string; stroke: string; lines: [string, string]; size?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <He x={x + w / 2} y={y + h / 2 - 2} size={size}>{lines[0]}</He>
      <He x={x + w / 2} y={y + h / 2 + size + 1} size={size}>{lines[1]}</He>
    </g>
  );
}
// Latin label box (gene / ion names).
const Membrane = ({ y, h = 16, x = 0, w = 480 }: { y: number; h?: number; x?: number; w?: number }) => <rect x={x} y={y} width={w} height={h} fill={FILL.membrane} />;

// ── nb-cells ─────────────────────────────────────────────────────────────────





// ── nb-channels ──────────────────────────────────────────────────────────────

function NavStructure() {
  const D = [40, 140, 240, 340];
  return (
    <Svg h={250} label="מבנה תעלת נתרן תלוית-מתח: חלבון אחד עם ארבעה מקטעים (I עד IV), בכל אחד שישה קטעים חוצי ממברנה. S4 (אדום) מכיל מטענים חיוביים — חיישן המתח. S5–S6 יוצרים את הנקבובית. הלולאה התוך-תאית בין מקטעים III ו-IV מכילה את הרצף IFM, הנקשר לכיס סמוך לנקבובית ומשרה סגירה אלוסטרית שלה.">
      <Membrane y={70} h={70} x={20} w={440} />
      <He x={470} y={60} size={9.5} color={MUTED} anchor="end">חוץ</He>
      <He x={470} y={160} size={9.5} color={MUTED} anchor="end">פנים</He>
      {D.map((x0, d) => (
        <g key={x0}>
          <La x={x0 + 40} y={34} size={11} bold>{["I", "II", "III", "IV"][d]}</La>
          {[0, 1, 2, 3, 4, 5].map((s) => (
            <rect key={s} x={x0 + s * 14} y={64} width={9} height={82} rx={4} fill={s === 3 ? FILL.red : s >= 4 ? FILL.blue : FILL.gray} stroke={s === 3 ? RED : s >= 4 ? BLUE : MUTED} strokeWidth={1.2} />
          ))}
          {[78, 96, 114, 132].map((y) => <La key={y} x={x0 + 46.5} y={y + 4} size={9} bold color={RED}>+</La>)}
        </g>
      ))}
      <path d="M326 150 Q314 200 300 206" fill="none" stroke={PURPLE} strokeWidth={2.4} />
      <circle cx={296} cy={208} r={9} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <La x={296} y={212} size={8} bold color={PURPLE}>IFM</La>
      <He x={250} y={234} size={10} color={PURPLE}>שער האינאקטיבציה (לולאה III–IV)</He>
      <He x={100} y={196} size={10} color={RED}>S4 — חיישן המתח (+)</He>
      <Lead x1={100} y1={186} x2={86} y2={150} />
      <He x={180} y={16} size={10} color={BLUE}>S5–S6 — הנקבובית</He>
      <Lead x1={180} y1={22} x2={208} y2={60} />
    </Svg>
  );
}

// ── nb-synapse ───────────────────────────────────────────────────────────────



function Summation() {
  const s = scale(50, 450, 200, 40, 0, 100, -70, -40);
  const ep = (t: number, t0: number, a: number) => (t < t0 ? 0 : a * ((t - t0) / 4) * Math.exp(1 - (t - t0) / 4));
  const single = (t: number) => -65 + ep(t, 5, 3);
  const temporal = (t: number) => -65 + ep(t, 35, 3) + ep(t, 38, 3) + ep(t, 41, 3);
  const spatial = (t: number) => -65 + ep(t, 70, 9) + ep(t, 70, 9) - ep(t, 70, 2);
  return (
    <Svg h={262} label="סכימה בנוירון (צורות אידיאליות): EPSP בודד קטן ולא מגיע לסף; שלושה EPSPs מאותה סינפסה בהפרש קצר מצטברים (סכימה זמנית); הרבה EPSPs מסינפסות שונות יחד מגיעים לסף (סכימה מרחבית), ו-IPSP בו-זמני מקטין את הסכום.">
      <Axes x0={50} y0={200} x1={450} y1={40}
        xLabel={<He x={250} y={226} size={10.5}>זמן</He>}
        yLabel={<He x={54} y={24} size={10.5} anchor="start">מתח הממברנה (mV)</He>} />
      <line x1={50} y1={s.sy(-50)} x2={450} y2={s.sy(-50)} stroke={RED} strokeWidth={1} strokeDasharray="5 4" />
      <He x={448} y={s.sy(-50) - 6} size={9.5} anchor="end" color={RED}>סף</He>
      {[-65, -50].map((v) => <La key={v} x={44} y={s.sy(v) + 4} size={9.5} anchor="end" color={MUTED}>{v}</La>)}
      <path d={curve(single, 0, 30, s)} fill="none" stroke={BLUE} strokeWidth={2.2} />
      <path d={curve(temporal, 30, 65, s)} fill="none" stroke={GREEN} strokeWidth={2.2} />
      <path d={curve(spatial, 65, 100, s)} fill="none" stroke={PURPLE} strokeWidth={2.2} />
      <He x={s.sx(12)} y={244} size={9.5} color={BLUE}>EPSP בודד</He>
      <He x={s.sx(47)} y={244} size={9.5} color={GREEN}>סכימה זמנית</He>
      <He x={s.sx(83)} y={244} size={9.5} color={PURPLE}>סכימה מרחבית (עם IPSP)</He>
    </Svg>
  );
}

// ── nb-learning-memory ───────────────────────────────────────────────────────
function MemorySystems() {
  return (
    <Svg h={250} label="סוגי הזיכרון לטווח ארוך ואזורי המוח: זיכרון הצהרתי — אפיזודי וסמנטי — תלוי בהיפוקמפוס ובאונה הרקתית התיכונה; זיכרון לא-הצהרתי — מיומנויות והרגלים (סטריאטום), הטרמה (קליפה), התניה קלאסית (אמיגדלה ומוחון) ולמידה לא-אסוציאטיבית (מסלולי רפלקס).">
      <Box x={180} y={12} w={120} h={30} fill={FILL.gray} stroke={MUTED} size={11} bold>זיכרון לטווח ארוך</Box>
      <Box x={290} y={70} w={150} h={30} fill={FILL.blue} stroke={BLUE} size={11}>הצהרתי ("לדעת מה")</Box>
      <Box x={40} y={70} w={170} h={30} fill={FILL.orange} stroke={ORANGE} size={11}>לא-הצהרתי ("לדעת איך")</Box>
      <Arrow x1={260} y1={42} x2={340} y2={68} color={MUTED} width={1.4} />
      <Arrow x1={220} y1={42} x2={150} y2={68} color={MUTED} width={1.4} />
      <Box2 x={290} y={124} w={70} h={40} fill={FILL.blue} stroke={BLUE} lines={["אפיזודי", "(אירועים)"]} size={9.5} />
      <Box2 x={370} y={124} w={70} h={40} fill={FILL.blue} stroke={BLUE} lines={["סמנטי", "(עובדות)"]} size={9.5} />
      <Arrow x1={350} y1={100} x2={326} y2={122} color={BLUE} width={1.2} />
      <Arrow x1={380} y1={100} x2={402} y2={122} color={BLUE} width={1.2} />
      <He x={365} y={192} size={10} bold color={BLUE}>היפוקמפוס ואונה רקתית תיכונה</He>
      {([["מיומנויות", "סטריאטום"], ["הטרמה", "קליפה"], ["התניה", "אמיגדלה, מוחון"], ["הרגלה ורגישות", "מסלולי רפלקס"]] as [string, string][]).map(([a, b], i) => (
        <g key={a}>
          <Box2 x={6 + i * 66} y={124} w={62} h={40} fill={FILL.orange} stroke={ORANGE} lines={[a, ""]} size={9} />
          <He x={37 + i * 66} y={182 + (i % 2) * 16} size={8.5} color={ORANGE}>{b}</He>
        </g>
      ))}
      {[0, 1, 2, 3].map((i) => <Arrow key={i} x1={125} y1={100} x2={37 + i * 66} y2={122} color={ORANGE} width={1} />)}
      <He x={240} y={238} size={9.5} color={MUTED}>H.M.: נפגע רק הענף הכחול (יצירת זיכרון הצהרתי חדש)</He>
    </Svg>
  );
}

function Aplysia() {
  return (
    <Svg h={262} label="רגישות באפליזיה: נוירון תחושה מהסיפון מעורר נוירון מוטורי שמכווץ את הזימים. מכה בזנב מפעילה interneuron מודולטורי שמשחרר סרוטונין על הכפתור של נוירון התחושה. לטווח קצר: סרוטונין ← cAMP ← PKA ← סגירת תעלות K⁺ ויותר שחרור. לטווח ארוך: PKA נכנס לגרעין ← CREB ← סינתזת חלבונים וסינפסות חדשות.">
      <Box x={20} y={30} w={110} h={32} fill={FILL.blue} stroke={BLUE} size={10}>נוירון תחושה (סיפון)</Box>
      <Box x={340} y={30} w={120} h={32} fill={FILL.green} stroke={GREEN} size={10}>נוירון מוטורי ← זימים</Box>
      <Arrow x1={132} y1={46} x2={338} y2={46} color={INK} width={1.8} />
      <Box x={150} y={100} w={130} h={32} fill={FILL.purple} stroke={PURPLE} size={10}>interneuron מודולטורי</Box>
      <Box x={20} y={100} w={110} h={32} fill={FILL.gray} stroke={MUTED} size={10}>מכה בזנב</Box>
      <Arrow x1={132} y1={116} x2={148} y2={116} color={MUTED} width={1.6} />
      <Arrow x1={215} y1={100} x2={215} y2={54} color={PURPLE} width={1.6} />
      <He x={223} y={82} size={9.5} anchor="start" color={PURPLE}>סרוטונין על הכפתור</He>
      <He x={120} y={164} size={10.5} bold color={BLUE}>טווח קצר</He>
      <He x={120} y={184} size={9.5}>cAMP ← PKA</He>
      <He x={120} y={202} size={9.5}>תעלות K⁺ נסגרות ← יותר שחרור</He>
      <He x={360} y={164} size={10.5} bold color={RED}>טווח ארוך</He>
      <He x={360} y={184} size={9.5}>PKA (+MAPK) נכנס לגרעין ← CREB</He>
      <He x={360} y={202} size={9.5}>סינתזת חלבונים ← סינפסות חדשות</He>
      <He x={240} y={244} size={9.5} color={MUTED}>מעכב סינתזת חלבונים — חוסם רק את הטווח הארוך</He>
    </Svg>
  );
}


// ── nb-development ───────────────────────────────────────────────────────────




function OcularDominance() {
  const row = (y: number, wl: number, wr: number) => {
    const out: React.ReactElement[] = [];
    let x = 40;
    let i = 0;
    while (x < 440) {
      const w = i % 2 ? wr : wl;
      out.push(<rect key={`${y}-${i}`} x={x} y={y} width={Math.min(w, 440 - x)} height={50} fill={i % 2 ? "#fca5a5" : "#93c5fd"} />);
      x += w;
      i++;
    }
    return out;
  };
  return (
    <Svg h={226} label="עמודות העדפת העין בקליפת הראייה (מבט מלמעלה, סכמטי): בחתול רגיל — פסים ברוחב שווה לעין ימין (כחול) ולשמאל (אדום). אחרי סגירת עין ימין בתקופה הקריטית — הפסים של העין הסגורה צרים מאוד, ושל העין הפתוחה רחבים.">
      <He x={240} y={22} size={11} bold>רגיל</He>
      {row(30, 30, 30)}
      <He x={240} y={116} size={11} bold>אחרי סגירת עין ימין בגור</He>
      {row(124, 10, 50)}
      <rect x={60} y={192} width={14} height={12} fill="#93c5fd" />
      <He x={80} y={202} size={10} anchor="start">עין ימין</He>
      <rect x={260} y={192} width={14} height={12} fill="#fca5a5" />
      <He x={280} y={202} size={10} anchor="start">עין שמאל</He>
    </Svg>
  );
}

// ── nb-neurodegeneration ─────────────────────────────────────────────────────
function ProteinAggregation() {
  const X = [384, 290, 196, 102, 8];
  const steps: [string, string][] = [["חלבון", "מקופל נכון"], ["קיפול", "שגוי (β)"], ["אוליגומרים", "(רעילים?)"], ["סיבים", "(fibrils)"], ["צברים", "רבדים, סבכים"]];
  return (
    <Svg h={240} label="צבירת חלבונים: חלבון מקופל נכון עובר קיפול שגוי עשיר במבנה בטא, נצמד לעותקים נוספים ויוצר אוליגומרים קטנים — שנחשבים לרעילים ביותר — ואחר כך סיבים וצברים גדולים. שפרונים מתקנים קיפול, והפרוטאזום והאוטופגיה מפרקים חלבונים פגומים; עם הגיל המערכות האלה נחלשות.">
      {steps.map((l, i) => <Box2 key={i} x={X[i]} y={40} w={86} h={44} fill={i === 0 ? FILL.green : i === 2 ? FILL.red : FILL.orange} stroke={i === 0 ? GREEN : i === 2 ? RED : ORANGE} lines={l} />)}
      {[0, 1, 2, 3].map((i) => <Arrow key={i} x1={X[i] - 2} y1={62} x2={X[i + 1] + 88} y2={62} color={INK} />)}
      <Box x={290} y={150} w={86} h={30} fill={FILL.blue} stroke={BLUE} size={10}>שפרונים</Box>
      <Box x={150} y={150} w={110} h={30} fill={FILL.purple} stroke={PURPLE} size={10}>פרוטאזום, אוטופגיה</Box>
      <Arrow x1={333} y1={148} x2={333} y2={88} color={BLUE} width={1.4} />
      <Arrow x1={238} y1={88} x2={214} y2={148} color={PURPLE} width={1.4} />
      <He x={344} y={124} size={9.5} anchor="start" color={BLUE}>מתקנים</He>
      <He x={190} y={124} size={9.5} anchor="end" color={PURPLE}>מפרקים</He>
      <He x={240} y={218} size={9.5} color={MUTED}>עם הגיל — הפירוק והתיקון נחלשים</He>
    </Svg>
  );
}



// ── nb-neuroimmune ───────────────────────────────────────────────────────────
// Bbb: recomposed at textbook level, one picture on desktop (2026-11-07) — see ./redraws/Bbb.tsx; old code in archive/figures/2026-11-07/.

function MicrogliaStates() {
  const ramified = (x: number, y: number) => (
    <g>
      <ellipse cx={x} cy={y} rx={10} ry={7} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      {[[-46, -30], [44, -32], [-48, 28], [46, 30], [0, -48], [0, 46]].map(([dx, dy], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={PURPLE} strokeWidth={1.6} />
          <line x1={x + dx} y1={y + dy} x2={x + dx * 1.2 + (i % 2 ? 8 : -8)} y2={y + dy * 1.2} stroke={PURPLE} strokeWidth={1.1} />
        </g>
      ))}
    </g>
  );
  return (
    <Svg h={236} label="מצבי המיקרוגלייה: במצב 'סורק' — תא קטן עם שלוחות ארוכות ומסועפות שזזות כל הזמן; אחרי פגיעה (ATP מתאים פגועים, חלבונים מצטברים, פתוגנים) — התא מתכנס לצורה אמבית, נודד, בולע ומפריש ציטוקינים. בפועל יש מצבים רבים בין שני הקצוות.">
      {ramified(110, 110)}
      <He x={110} y={200} size={10.5} bold color={PURPLE}>סורק</He>
      <He x={110} y={218} size={9.5} color={MUTED}>שלוחות זזות כל הזמן</He>
      <Arrow x1={190} y1={110} x2={280} y2={110} color={MUTED} width={1.8} />
      <He x={235} y={96} size={9.5} color={RED}>פגיעה (ATP)</He>
      <path d="M330 92 Q352 76 372 92 Q392 110 372 128 Q350 142 330 128 Q314 110 330 92 Z" fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <circle cx={360} cy={108} r={7} fill="#fca5a5" />
      {[[400, 80], [410, 104], [402, 128]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6} fill={ORANGE} />)}
      <He x={352} y={200} size={10.5} bold color={RED}>מופעל</He>
      <He x={352} y={218} size={9.5} color={MUTED}>בולע, מפריש ציטוקינים</He>
      <He x={430} y={70} size={9} color={ORANGE}>IL-1β, TNF</He>
    </Svg>
  );
}

// ── nb-methods ───────────────────────────────────────────────────────────────
function MethodsResolution() {
  const s = scale(80, 450, 220, 40, -5, 5, -6, -1);
  const m: [string, number, number, number, number, string, string][] = [
    ["Patch clamp", -4, -3, -6, -4.6, FILL.blue, BLUE],
    ["רישום חוץ-תאי", -3.6, -2.6, -4.4, -3.4, FILL.green, GREEN],
    ["הדמיית סידן", -1.7, -0.5, -3.3, -2.4, FILL.teal, TEAL],
    ["EEG", -3, -2, -1.9, -1.1, FILL.orange, ORANGE],
    ["fMRI", 0, 0.5, -2.2, -1.4, FILL.yellow, GOLD],
    ["PET", 2, 3.2, -2, -1.1, FILL.red, RED],
    ["פגיעה / השתקה", 3, 5, -3, -2.3, FILL.purple, PURPLE],
  ];
  return (
    <Svg h={274} label="השוואת שיטות לפי רזולוציה בזמן (ציר אופקי, מאלפית שנייה ועד ימים) וברזולוציה במרחב (ציר אנכי, ממיקרון — תעלה וסינפסה — ועד מוח שלם): patch clamp — מהיר ומקומי מאוד; רישום חוץ-תאי והדמיית סידן — נוירונים בודדים; EEG — מהיר אבל גס במרחב; fMRI ו-PET — כל המוח, איטיים; פגיעה והשתקה ממושכת — אזורים, לאורך זמן. המיקומים בקירוב.">
      <Axes x0={80} y0={220} x1={450} y1={40}
        xLabel={<He x={265} y={262} size={10.5}>רזולוציה בזמן</He>}
        yLabel={<He x={84} y={24} size={10.5} anchor="start">גודל מה שנמדד</He>} />
      {m.map(([t, x0, x1, y0, y1, f, c]) => (
        <g key={t}>
          <rect x={(s.sx(x0) + s.sx(x1)) / 2 - Math.max(s.sx(x1) - s.sx(x0), 76) / 2} y={s.sy(y1)} width={Math.max(s.sx(x1) - s.sx(x0), 76)} height={s.sy(y0) - s.sy(y1)} rx={8} fill={f} stroke={c} strokeWidth={1.2} opacity={0.9} />
          <He x={(s.sx(x0) + s.sx(x1)) / 2} y={(s.sy(y0) + s.sy(y1)) / 2 + 4} size={9.5} color={c} bold>{t}</He>
        </g>
      ))}
      {([[-3, "מילישנייה"], [0, "שנייה"], [3.5, "שעות"]] as [number, string][]).map(([v, t]) => <He key={t} x={s.sx(v)} y={238} size={9} color={MUTED}>{t}</He>)}
      {([[-5.5, "סינפסה"], [-4, "תא"], [-1.2, "מוח"]] as [number, string][]).map(([v, t]) => <He key={t} x={72} y={s.sy(v) + 4} size={9} color={MUTED} anchor="end">{t}</He>)}
    </Svg>
  );
}

function Gcamp() {
  const s = scale(250, 460, 180, 50, 0, 10, 0, 1.2);
  const spikes = [1, 3.5, 3.8, 4.1, 7];
  const f = (t: number) => spikes.reduce((a, t0) => a + (t >= t0 ? 0.35 * Math.exp(-(t - t0) / 0.9) : 0), 0);
  return (
    <Svg h={226} label="הדמיית סידן עם GCaMP: בלי Ca²⁺ החלבון זוהר מעט; כשפוטנציאל פעולה מכניס Ca²⁺, החלבון קושר אותו ומשנה מבנה — והזוהר עולה. מימין: עקומת זוהר (אידיאלית) — קפיצה אחרי כל פוטנציאל פעולה ודעיכה איטית; פוטנציאלי פעולה קרובים מצטרפים לקפיצה אחת גדולה.">
      <circle cx={70} cy={100} r={30} fill="#d1fae5" stroke={GREEN} strokeWidth={1.4} />
      <He x={70} y={156} size={10}>בלי Ca²⁺ — עמום</He>
      <circle cx={170} cy={100} r={30} fill="#4ade80" stroke={GREEN} strokeWidth={1.4} />
      {[[160, 90], [178, 96], [168, 110]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill={PURPLE} />)}
      <He x={170} y={156} size={10}>עם Ca²⁺ — זוהר</He>
      <La x={120} y={40} size={11} bold color={GREEN}>GCaMP</La>
      <Axes x0={250} y0={180} x1={460} y1={50}
        xLabel={<He x={355} y={206} size={10}>זמן (שניות)</He>}
        yLabel={<He x={254} y={34} size={10} anchor="start">זוהר</He>} />
      <path d={curve(f, 0, 10, s, 400)} fill="none" stroke={GREEN} strokeWidth={2.2} />
      {spikes.map((t) => <line key={t} x1={s.sx(t)} y1={186} x2={s.sx(t)} y2={196} stroke={INK} strokeWidth={1.6} />)}
      <He x={250} y={222} size={9} color={MUTED} anchor="start">קווים למטה — פוטנציאלי פעולה</He>
    </Svg>
  );
}

function Optogenetics() {
  return (
    <Svg h={236} label="אופטוגנטיקה: נוירון שמבטא Channelrhodopsin-2 — אור כחול פותח את התעלה, Na⁺ נכנס, והנוירון יורה בדיוק של אלפיות שנייה. נוירון שמבטא הלורודופסין — אור צהוב מפעיל משאבה שמכניסה Cl⁻, והנוירון מושתק. הביטוי רק בסוג תאים מסוים בעזרת Cre ונגיף DIO.">
      <He x={120} y={20} size={11} bold color={BLUE}>הפעלה — ChR2</He>
      <He x={360} y={20} size={11} bold color={GOLD}>השתקה — הלורודופסין</He>
      <Membrane y={86} h={36} x={20} w={200} />
      <Membrane y={86} h={36} x={260} w={200} />
      <rect x={100} y={74} width={40} height={60} rx={10} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <rect x={340} y={74} width={40} height={60} rx={10} fill={FILL.yellow} stroke={GOLD} strokeWidth={1.4} />
      <path d="M60 36 L96 70" stroke="#3b82f6" strokeWidth={3} markerEnd="url(#bfArrow)" />
      <path d="M300 36 L336 70" stroke="#eab308" strokeWidth={3} markerEnd="url(#bfArrow)" />
      <He x={50} y={48} size={9.5} color="#3b82f6" anchor="end">אור כחול</He>
      <He x={292} y={48} size={9.5} color={GOLD} anchor="end">אור צהוב</He>
      <Arrow x1={120} y1={50} x2={120} y2={156} color={BLUE} width={2} />
      <La x={134} y={52} size={10} anchor="start" color={BLUE}>Na⁺</La>
      <Arrow x1={360} y1={50} x2={360} y2={156} color={GOLD} width={2} />
      <La x={374} y={52} size={10} anchor="start" color={GOLD}>Cl⁻</La>
      <path d="M40 200 L90 200 L96 168 L104 214 L110 200 L200 200" fill="none" stroke={BLUE} strokeWidth={2} />
      <path d="M280 196 L340 196 L350 212 L440 212" fill="none" stroke={GOLD} strokeWidth={2} />
      <He x={120} y={230} size={9.5} color={BLUE}>ירי</He>
      <He x={360} y={230} size={9.5} color={GOLD}>היפר-פולריזציה — שקט</He>
    </Svg>
  );
}

export const NEURO_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "nb-neuron-parts": { el: NeuronParts, captionHe: "חלקי הנוירון. סכמטי — לא בקנה מידה (אקסון יכול להיות ארוך פי אלפים מגוף התא)." },
  "nb-glia-types": { el: GliaTypes, captionHe: "ארבעה סוגי תאי גלייה ותפקידם העיקרי. סכמטי." },
  "nb-brain-regions": { el: BrainRegions, captionHe: "האזורים העיקריים של המוח, במבט צד. מבנים עמוקים מסומנים בקירוב. סכמטי." },
  "nb-k-channel": { el: KChannel, captionHe: "תעלת אשלגן ומסנן הסלקטיביות (לפי המבנה של מקינון, 1998). סכמטי — מוצגות שתיים מארבע תת-היחידות." },
  "nb-nav-structure": { el: NavStructure, captionHe: "הטופולוגיה של תעלת נתרן תלוית-מתח. סכמטי." },
  "nb-vesicle-release": { el: VesicleRelease, captionHe: "שחרור הנוירוטרנסמיטר בסינפסה כימית. סכמטי — המרווח הסינפטי מוגדל." },
  "nb-receptor-types": { el: ReceptorTypes, captionHe: "קולטנים יונוטרופיים ומטבוטרופיים. סכמטי." },
  "nb-summation": { el: Summation, captionHe: "סכימה זמנית ומרחבית. צורות אידיאליות." },
  "nb-memory-systems": { el: MemorySystems, captionHe: "מערכות הזיכרון לטווח ארוך (לפי הסיווג של סקוויר). מפושט — האזורים פועלים יחד." },
  "nb-aplysia": { el: Aplysia, captionHe: "המעגל של רפלקס כיווץ הזימים באפליזיה, והמנגנון של רגישות לטווח קצר וארוך. מפושט." },
  "nb-ltp-nmda": { el: LtpNmda, captionHe: "קולטן NMDA כגלאי צירוף מקרים, והבסיס ל-LTP. סכמטי." },
  "nb-neural-tube": { el: NeuralTube, captionHe: "שלבי הנוירולציה בחתך. סכמטי." },
  "nb-cortex-migration": { el: CortexMigration, captionHe: "נדידה רדיאלית בקליפה המתפתחת — מבפנים החוצה. סכמטי." },
  "nb-growth-cone": { el: GrowthCone, captionHe: "קונוס הגדילה בין אות מושך לאות דוחה. סכמטי." },
  "nb-ocular-dominance": { el: OcularDominance, captionHe: "עמודות העדפת העין — רגיל ואחרי סגירת עין בתקופה הקריטית (לפי היובל וויזל). סכמטי." },
  "nb-protein-aggregation": { el: ProteinAggregation, captionHe: "צבירת חלבונים ומערכות בקרת האיכות. מנגנון חוזר במחלות נוירודגנרטיביות רבות — לא הסבר יחיד. סכמטי." },
  "nb-app-processing": { el: AppProcessing, captionHe: "שני מסלולי העיבוד של APP. סכמטי." },
  "nb-bbb": { el: Bbb, captionHe: "מחסום דם-מוח — היחידה הנוירו-וסקולרית. סכמטי." },
  "nb-microglia-states": { el: MicrogliaStates, captionHe: "מיקרוגלייה סורקים ומופעלים. בפועל יש רצף של מצבים. סכמטי." },
  "nb-methods-resolution": { el: MethodsResolution, captionHe: "השוואת שיטות מחקר לפי רזולוציה בזמן ובמרחב (סקאלות לוגריתמיות, מיקומים בקירוב)." },
  "nb-gcamp": { el: Gcamp, captionHe: "עיקרון הדמיית הסידן. העקומה אידיאלית." },
  "nb-optogenetics": { el: Optogenetics, captionHe: "אופטוגנטיקה — הפעלה והשתקה באור. סכמטי." },
};
