/* Figures for the ecology units (Technion 134153). Original schematic drawings; curves are idealized shapes computed
   from the textbook models (marked as such in the captions), not data. Layout conventions follow Begon, Townsend &
   Harper and Relyea & Ricklefs — never copied. Labels sit beside shapes and arrows, never on a line.
   Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, Axes, BLUE, GREEN, INK, MUTED, ORANGE, He, La, curve, scale } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

const PURPLE = "#7c3aed";
const RED = "#b91c1c";
const TEAL = "#0f766e";
const BROWN = "#92400e";
const FILL = { blue: "#dbeafe", green: "#dcfce7", orange: "#ffedd5", purple: "#ede9fe", yellow: "#fef3c7", gray: "#f1f5f9", red: "#fee2e2", sky: "#e0f2fe", teal: "#ccfbf1", brown: "#fde68a" };

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
// Box with a Latin (LTR) label — chemical formulas keep their charge on the right.
function LBox({ x, y, w, h, fill, stroke, children }: { x: number; y: number; w: number; h: number; fill: string; stroke: string; children: React.ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <La x={x + w / 2} y={y + h / 2 + 4.5} size={12} bold>{children}</La>
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

// ── ec-environment ───────────────────────────────────────────────────────────
function ToleranceCurve() {
  const s = scale(60, 440, 200, 40, 0, 100, 0, 1);
  const f = (x: number) => Math.exp(-(((x - 50) / 18) ** 2));
  return (
    <Svg h={290} label="עקומת סבולת: הביצוע של האורגניזם (גדילה, רבייה) לאורך ציר של תנאי, למשל טמפרטורה. באמצע — אופטימום; משני הצדדים — אזורי עקה; בקצוות — מוות. מתחת לציר: טווח השרידה רחב, וטווח הרבייה צר ממנו.">
      <Axes x0={60} y0={200} x1={440} y1={40}
        xLabel={<He x={250} y={282} size={11}>תנאי (למשל טמפרטורה)</He>}
        yLabel={<He x={64} y={22} size={11} anchor="start">ביצוע (גדילה, רבייה)</He>} />
      <path d={curve(f, 0, 100, s)} fill="none" stroke={GREEN} strokeWidth={2.6} />
      <He x={250} y={30} size={11} bold color={GREEN}>אופטימום</He>
      <He x={150} y={150} size={10.5} color={ORANGE}>עקה</He>
      <He x={350} y={150} size={10.5} color={ORANGE}>עקה</He>
      <He x={88} y={190} size={10.5} color={RED}>מוות</He>
      <He x={412} y={190} size={10.5} color={RED}>מוות</He>
      <rect x={s.sx(19)} y={214} width={s.sx(81) - s.sx(19)} height={9} rx={4} fill="#bbf7d0" />
      <rect x={s.sx(35)} y={234} width={s.sx(65) - s.sx(35)} height={9} rx={4} fill={GREEN} />
      <He x={s.sx(19) - 6} y={222} size={10} anchor="end">טווח שרידה</He>
      <He x={s.sx(35) - 6} y={242} size={10} anchor="end">טווח רבייה</He>
    </Svg>
  );
}

function ClimateBiomes() {
  const s = scale(70, 450, 240, 30, 0, 400, -15, 30);
  const R = (p0: number, p1: number, t0: number, t1: number, fill: string, t: string, rot = false) => (
    <g key={t}>
      <rect x={s.sx(p0) + 1} y={s.sy(t1) + 1} width={s.sx(p1) - s.sx(p0) - 2} height={s.sy(t0) - s.sy(t1) - 2} fill={fill} />
      <He x={(s.sx(p0) + s.sx(p1)) / 2} y={(s.sy(t0) + s.sy(t1)) / 2 + 4} size={9.5} rotate={rot ? -90 : undefined}>{t}</He>
    </g>
  );
  return (
    <Svg h={290} label="ביומות לפי טמפרטורה ממוצעת ומשקעים שנתיים: טונדרה בקור; טייגה בקור מתון; מדבר במשקעים מעטים; ערבה וחורש במשקעים בינוניים; יער ממוזג; סוואנה ויער טרופי עונתי בחום; יער גשם טרופי בחום ובמשקעים רבים. ירושלים נמצאת באזור החורש, אילת — במדבר.">
      <Axes x0={70} y0={240} x1={450} y1={30}
        xLabel={<He x={260} y={282} size={11}>משקעים שנתיים (ס"מ)</He>}
        yLabel={<He x={74} y={22} size={11} anchor="start">טמפרטורה ממוצעת (°C)</He>} />
      {R(0, 100, -15, -5, "#e0f2fe", "טונדרה")}
      {R(30, 220, -5, 5, "#ccfbf1", "טייגה")}
      {R(0, 30, -5, 30, "#fef3c7", "מדבר", true)}
      {R(30, 100, 5, 20, "#fde68a", "ערבה וחורש")}
      {R(100, 250, 5, 20, "#bbf7d0", "יער ממוזג")}
      {R(30, 150, 20, 30, "#fed7aa", "סוואנה")}
      {R(150, 250, 20, 30, "#86efac", "יער טרופי עונתי")}
      {R(250, 400, 20, 30, "#4ade80", "יער גשם טרופי")}
      {[-10, 0, 10, 20, 30].map((v) => <La key={v} x={62} y={s.sy(v) + 4} size={10} anchor="end" color={MUTED}>{v}</La>)}
      {[0, 100, 200, 300, 400].map((v) => <La key={v} x={s.sx(v)} y={256} size={10} color={MUTED}>{v}</La>)}
      <circle cx={s.sx(55)} cy={s.sy(17)} r={4} fill={RED} />
      <He x={s.sx(55) + 7} y={s.sy(17) + 4} size={9.5} anchor="start" color={RED}>ירושלים</He>
      <circle cx={s.sx(3)} cy={s.sy(25)} r={4} fill={RED} />
      <He x={s.sx(3) + 7} y={s.sy(25) + 4} size={9.5} anchor="start" color={RED}>אילת</He>
    </Svg>
  );
}

function Niche() {
  return (
    <Svg h={260} label="נישה בשני ממדים — טמפרטורה ולחות: הנישה היסודית (מקווקו) היא כל התנאים שבהם המין יכול לחיות; הנישה של מין מתחרה חופפת לחלק ממנה, ולכן הנישה הממומשת (ירוק) קטנה מהיסודית.">
      <Axes x0={60} y0={230} x1={450} y1={30}
        xLabel={<He x={260} y={254} size={11}>טמפרטורה</He>}
        yLabel={<He x={64} y={22} size={11} anchor="start">לחות</He>} />
      <ellipse cx={360} cy={110} rx={80} ry={60} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.4} />
      <ellipse cx={190} cy={135} rx={85} ry={55} fill={FILL.green} stroke={GREEN} strokeWidth={1.6} />
      <ellipse cx={220} cy={130} rx={120} ry={70} fill="none" stroke={INK} strokeWidth={1.4} strokeDasharray="6 4" />
      <He x={180} y={140} size={11} bold color={GREEN}>נישה ממומשת</He>
      <He x={398} y={110} size={11} color={ORANGE}>מתחרה</He>
      <He x={120} y={46} size={11}>נישה יסודית</He>
      <Lead x1={128} y1={52} x2={142} y2={76} />
    </Svg>
  );
}

// ── ec-adaptations ───────────────────────────────────────────────────────────
function Thermoregulation() {
  const a = scale(50, 220, 200, 40, 0, 40, 0, 45);
  const b = scale(270, 450, 200, 40, 0, 40, 0, 10);
  const met = (x: number) => (x < 20 ? 2 + (20 - x) * 0.35 : x <= 32 ? 2 : 2 + (x - 32) * 0.6);
  return (
    <Svg h={250} label="משמאל: טמפרטורת הגוף מול טמפרטורת הסביבה — באנדותרם קבועה (כ-37°C), באקטותרם עוקבת אחרי הסביבה. מימין: קצב חילוף החומרים של אנדותרם — גבוה בקור (ייצור חום), נמוך וקבוע באזור הנייטרליות התרמית, ועולה שוב בחום (הזעה, התנשפות). סכמטי.">
      <Axes x0={50} y0={200} x1={220} y1={40}
        xLabel={<He x={135} y={226} size={10}>טמפרטורת הסביבה</He>}
        yLabel={<He x={54} y={24} size={10} anchor="start">טמפרטורת הגוף</He>} />
      <path d={curve(() => 37, 0, 40, a)} fill="none" stroke={RED} strokeWidth={2.4} />
      <path d={curve((x) => x + 1, 0, 40, a)} fill="none" stroke={BLUE} strokeWidth={2.4} />
      <He x={100} y={a.sy(37) - 8} size={10.5} bold color={RED}>אנדותרם</He>
      <He x={196} y={140} size={10.5} bold color={BLUE}>אקטותרם</He>

      <rect x={b.sx(20)} y={44} width={b.sx(32) - b.sx(20)} height={154} fill={FILL.green} />
      <Axes x0={270} y0={200} x1={450} y1={40}
        xLabel={<He x={360} y={226} size={10}>טמפרטורת הסביבה</He>}
        yLabel={<He x={274} y={24} size={10} anchor="start">קצב חילוף חומרים</He>} />
      <path d={curve(met, 0, 40, b)} fill="none" stroke={PURPLE} strokeWidth={2.4} />
      <He x={(b.sx(20) + b.sx(32)) / 2} y={112} size={9.5} color={GREEN}>אזור</He>
      <He x={(b.sx(20) + b.sx(32)) / 2} y={124} size={9.5} color={GREEN}>נייטרלי</He>
      <He x={304} y={70} size={10} color={PURPLE}>ייצור חום</He>
      <He x={430} y={64} size={10} color={PURPLE}>הזעה</He>
    </Svg>
  );
}

// ── ec-population-growth ─────────────────────────────────────────────────────
function GrowthCurves() {
  const s = scale(60, 440, 220, 40, 0, 50, 0, 1200);
  const tEnd = Math.log(120) / 0.15;
  const logi = (t: number) => 1000 / (1 + 99 * Math.exp(-0.15 * t));
  const tHalf = Math.log(99) / 0.15;
  return (
    <Svg h={270} label="גידול מעריכי (עקומת J) — האוכלוסייה גדלה בלי גבול; גידול לוגיסטי (עקומת S) — מתקרב לכושר הנשיאה K. הגידול הלוגיסטי מהיר ביותר בחצי מ-K. העקומות מחושבות מהמודלים (r = 0.15, K = 1,000).">
      <Axes x0={60} y0={220} x1={440} y1={40}
        xLabel={<He x={250} y={262} size={11}>זמן</He>}
        yLabel={<He x={64} y={22} size={11} anchor="start">גודל האוכלוסייה (N)</He>} />
      <line x1={60} y1={s.sy(1000)} x2={440} y2={s.sy(1000)} stroke={MUTED} strokeWidth={1} strokeDasharray="5 4" />
      <La x={448} y={s.sy(1000) + 4} size={11} anchor="start" bold>K</La>
      <path d={curve((t) => 10 * Math.exp(0.15 * t), 0, tEnd, s)} fill="none" stroke={ORANGE} strokeWidth={2.6} />
      <path d={curve(logi, 0, 50, s)} fill="none" stroke={BLUE} strokeWidth={2.6} />
      <He x={345} y={64} size={11} bold color={ORANGE}>מעריכי (J)</He>
      <He x={392} y={132} size={11} bold color={BLUE}>לוגיסטי (S)</He>
      <circle cx={s.sx(tHalf)} cy={s.sy(500)} r={4} fill={BLUE} />
      <He x={s.sx(tHalf) + 8} y={s.sy(500) + 10} size={10} anchor="start" color={MUTED}>K/2 — הגידול המהיר ביותר</He>
    </Svg>
  );
}

function Survivorship() {
  const s = scale(70, 440, 230, 40, 0, 100, -3, 0);
  const I = (x: number) => -3 * (x / 100) ** 6;
  const II = (x: number) => -3 * (x / 100);
  const III = (x: number) => -2.6 * (1 - Math.exp(-x / 8)) - 0.4 * (x / 100);
  return (
    <Svg h={280} label="שלושה סוגי עקומות הישרדות (שורדים בסקאלה לוגריתמית מול גיל): סוג I — תמותה נמוכה בצעירים וגבוהה בזקנים (אדם, יונקים גדולים); סוג II — סיכון קבוע בכל גיל; סוג III — תמותה גבוהה מאוד בצעירים (דגים, צדפות, עצים). צורות אידיאליות.">
      <Axes x0={70} y0={230} x1={440} y1={40}
        xLabel={<He x={255} y={270} size={11}>גיל (% מאורך החיים המרבי)</He>}
        yLabel={<He x={74} y={22} size={11} anchor="start">שורדים (סקאלה לוגריתמית)</He>} />
      {[0, -1, -2, -3].map((v) => <La key={v} x={62} y={s.sy(v) + 4} size={10} anchor="end" color={MUTED}>{String(10 ** v)}</La>)}
      {[0, 50, 100].map((v) => <La key={v} x={s.sx(v)} y={248} size={10} color={MUTED}>{v}</La>)}
      <path d={curve(I, 0, 100, s)} fill="none" stroke={BLUE} strokeWidth={2.6} />
      <path d={curve(II, 0, 100, s)} fill="none" stroke={GREEN} strokeWidth={2.6} />
      <path d={curve(III, 0, 100, s)} fill="none" stroke={ORANGE} strokeWidth={2.6} />
      <He x={200} y={60} size={11} bold color={BLUE}>סוג I</He>
      <He x={280} y={128} size={11} bold color={GREEN}>סוג II</He>
      <He x={330} y={195} size={11} bold color={ORANGE}>סוג III</He>
    </Svg>
  );
}

// ── ec-population-regulation ─────────────────────────────────────────────────
function DensityDependence() {
  const s = scale(60, 440, 220, 40, 0, 1000, 0, 1);
  return (
    <Svg h={270} label="ויסות תלוי צפיפות: שיעור הלידות לפרט יורד ושיעור המוות לפרט עולה ככל שהאוכלוסייה צפופה יותר. הם נחתכים בכושר הנשיאה K: מתחתיו האוכלוסייה גדלה, ומעליו קטנה. קווים סכמטיים.">
      <Axes x0={60} y0={220} x1={440} y1={40}
        xLabel={<He x={250} y={262} size={11}>גודל האוכלוסייה (N)</He>}
        yLabel={<He x={64} y={22} size={11} anchor="start">שיעור לפרט</He>} />
      <path d={curve((n) => 0.8 - 0.0006 * n, 0, 1000, s)} fill="none" stroke={GREEN} strokeWidth={2.6} />
      <path d={curve((n) => 0.2 + 0.0006 * n, 0, 1000, s)} fill="none" stroke={RED} strokeWidth={2.6} />
      <He x={150} y={76} size={10.5} bold color={GREEN}>לידות לפרט</He>
      <He x={160} y={180} size={10.5} bold color={RED}>מוות לפרט</He>
      <line x1={s.sx(500)} y1={s.sy(0.5)} x2={s.sx(500)} y2={220} stroke={MUTED} strokeWidth={1} strokeDasharray="5 4" />
      <La x={s.sx(500)} y={238} size={11} bold>K</La>
      <Arrow x1={190} y1={208} x2={225} y2={208} color={GREEN} width={1.6} />
      <Arrow x1={330} y1={208} x2={295} y2={208} color={RED} width={1.6} />
      <He x={180} y={198} size={9.5} color={GREEN}>גדלה</He>
      <He x={330} y={198} size={9.5} color={RED}>קטנה</He>
    </Svg>
  );
}

function PopulationCycles() {
  const s = scale(60, 440, 210, 40, 0, 40, 0, 1);
  const hare = (t: number) => 0.5 + 0.4 * Math.sin((2 * Math.PI * t) / 10);
  const lynx = (t: number) => 0.35 + 0.25 * Math.sin((2 * Math.PI * t) / 10 - 1.2);
  return (
    <Svg h={250} label="מחזור אוכלוסיות של כ-10 שנים, כמו בארנבת השלג (כחול) ובלינקס (כתום): שיא הטורף בא בהשהיה אחרי שיא הטרף. עקומות אידיאליות, לא נתונים.">
      <Axes x0={60} y0={210} x1={440} y1={40}
        xLabel={<He x={250} y={242} size={11}>שנים</He>}
        yLabel={<He x={64} y={22} size={11} anchor="start">גודל יחסי</He>} />
      {[0, 10, 20, 30, 40].map((v) => <La key={v} x={s.sx(v)} y={226} size={10} color={MUTED}>{v}</La>)}
      <path d={curve(hare, 0, 40, s, 240)} fill="none" stroke={BLUE} strokeWidth={2.4} />
      <path d={curve(lynx, 0, 40, s, 240)} fill="none" stroke={ORANGE} strokeWidth={2.4} />
      <He x={108} y={46} size={10.5} bold color={BLUE}>ארנבת</He>
      <He x={244} y={204} size={10.5} bold color={ORANGE}>לינקס</He>
    </Svg>
  );
}

// ── ec-competition ───────────────────────────────────────────────────────────
function LvCompetition() {
  const s = scale(70, 440, 230, 40, 0, 220, 0, 220);
  return (
    <Svg h={270} label="מודל לוטקה-וולטרה לתחרות, מקרה של דו-קיום: האיזוקלינה של מין 1 עוברת בין K₁ על ציר N₁ ל-K₁/α על ציר N₂; האיזוקלינה של מין 2 — בין K₂ ל-K₂/β. הקווים נחתכים, וכל מין מגביל את עצמו יותר משהוא מגביל את השני — נקודת החיתוך היא שיווי משקל יציב (N₁ = 80, N₂ = 40, לפי K₁ = 100, K₂ = 80, α = β = 0.5).">
      <Axes x0={70} y0={230} x1={440} y1={40}
        xLabel={<La x={255} y={264} size={12}>N₁</La>}
        yLabel={<La x={74} y={26} size={12} anchor="start">N₂</La>} />
      <line x1={s.sx(100)} y1={s.sy(0)} x2={s.sx(0)} y2={s.sy(200)} stroke={BLUE} strokeWidth={2.4} />
      <line x1={s.sx(160)} y1={s.sy(0)} x2={s.sx(0)} y2={s.sy(80)} stroke={ORANGE} strokeWidth={2.4} />
      <He x={150} y={68} size={10.5} bold color={BLUE}>האיזוקלינה של מין 1</He>
      <He x={360} y={190} size={10.5} bold color={ORANGE}>האיזוקלינה של מין 2</He>
      <circle cx={s.sx(80)} cy={s.sy(40)} r={5} fill={INK} />
      <He x={112} y={218} size={10} anchor="start">דו-קיום</He>
      <Lead x1={130} y1={209} x2={s.sx(80) - 4} y2={s.sy(40) + 4} />
      <La x={s.sx(100)} y={246} size={10} color={BLUE}>K₁</La>
      <La x={s.sx(160)} y={246} size={10} color={ORANGE}>K₂/β</La>
      <La x={62} y={s.sy(200) + 4} size={10} anchor="end" color={BLUE}>K₁/α</La>
      <La x={62} y={s.sy(80) + 4} size={10} anchor="end" color={ORANGE}>K₂</La>
    </Svg>
  );
}

// ── ec-predation ─────────────────────────────────────────────────────────────
function InteractionSigns() {
  const cells: [string, string, string][][] = [
    [["הדדיות", FILL.green, GREEN], ["קומנסליזם", FILL.teal, TEAL], ["טריפה, טפילות", FILL.orange, ORANGE]],
    [["קומנסליזם", FILL.teal, TEAL], ["נייטרליזם", FILL.gray, MUTED], ["אמנסליזם", FILL.purple, PURPLE]],
    [["טריפה, טפילות", FILL.orange, ORANGE], ["אמנסליזם", FILL.purple, PURPLE], ["תחרות", FILL.red, RED]],
  ];
  const signs = ["+", "0", "−"];
  return (
    <Svg h={232} label="סוגי האינטראקציות לפי ההשפעה על כל אחד משני המינים: פלוס-פלוס — הדדיות; פלוס-אפס — קומנסליזם; פלוס-מינוס — טריפה, רעייה וטפילות; אפס-מינוס — אמנסליזם; מינוס-מינוס — תחרות.">
      <He x={290} y={20} size={11} bold>ההשפעה על מין ב</He>
      <He x={28} y={130} size={11} bold rotate={-90}>ההשפעה על מין א</He>
      {signs.map((g, i) => <La key={`c${g}`} x={110 + i * 120 + 55} y={44} size={16} bold>{g}</La>)}
      {signs.map((g, i) => <La key={`r${g}`} x={84} y={84 + i * 58} size={16} bold>{g}</La>)}
      {cells.map((row, r) => row.map(([t, f, c], k) => <Box key={`${r}-${k}`} x={110 + k * 120} y={54 + r * 58} w={110} h={48} fill={f} stroke={c} size={10.5}>{t}</Box>))}
    </Svg>
  );
}

function PredatorPrey() {
  const s = scale(40, 240, 190, 50, 0, 20, 0, 1);
  const prey = (t: number) => 0.5 + 0.35 * Math.sin((2 * Math.PI * t) / 10);
  const pred = (t: number) => 0.45 + 0.25 * Math.sin((2 * Math.PI * t) / 10 - Math.PI / 2);
  return (
    <Svg h={236} label="מודל לוטקה-וולטרה לטורף-טרף. משמאל: לאורך זמן, הטרף והטורף מתנודדים, ושיא הטורף בא אחרי שיא הטרף; השהיה של כרבע מחזור היא קירוב לתנודות קטנות סביב שיווי המשקל. מימין: אותו דבר במישור טרף-טורף — מעגל סביב נקודת שיווי המשקל (N*, P*), בכיוון נגד השעון. צורות אידיאליות.">
      <Axes x0={40} y0={190} x1={240} y1={50}
        xLabel={<He x={140} y={216} size={10.5}>זמן</He>}
        yLabel={<He x={44} y={34} size={10.5} anchor="start">גודל האוכלוסייה</He>} />
      <path d={curve(prey, 0, 20, s)} fill="none" stroke={GREEN} strokeWidth={2.4} />
      <path d={curve(pred, 0, 20, s)} fill="none" stroke={RED} strokeWidth={2.4} />
      <He x={65} y={62} size={10.5} bold color={GREEN}>טרף</He>
      <He x={215} y={84} size={10.5} bold color={RED}>טורף</He>

      <Axes x0={290} y0={190} x1={460} y1={50}
        xLabel={<He x={375} y={216} size={10.5}>טרף (N)</He>}
        yLabel={<He x={294} y={34} size={10.5} anchor="start">טורף (P)</He>} />
      <line x1={375} y1={56} x2={375} y2={190} stroke={MUTED} strokeWidth={1} strokeDasharray="4 4" />
      <line x1={290} y1={120} x2={455} y2={120} stroke={MUTED} strokeWidth={1} strokeDasharray="4 4" />
      <ellipse cx={375} cy={120} rx={55} ry={40} fill="none" stroke={PURPLE} strokeWidth={2.2} />
      <path d="M397 83 A55 40 0 0 0 353 83" fill="none" stroke={PURPLE} strokeWidth={2.2} markerEnd="url(#bfArrow)" />
      <La x={375} y={204} size={10} color={MUTED}>N*</La>
      <La x={282} y={124} size={10} anchor="end" color={MUTED}>P*</La>
    </Svg>
  );
}

function FunctionalResponses() {
  const s = scale(70, 380, 220, 40, 0, 100, 0, 1.1);
  return (
    <Svg h={262} label="שלושת סוגי התגובה הפונקציונלית — כמה טרף טורף אחד אוכל כפונקציה של צפיפות הטרף: סוג I — לינארי עד רוויה; סוג II — עולה ומתעקם לרוויה בגלל זמן הטיפול; סוג III — סיגמואידי, כמעט אפס בצפיפות נמוכה. צורות אידיאליות.">
      <Axes x0={70} y0={220} x1={380} y1={40}
        xLabel={<He x={225} y={254} size={11}>צפיפות הטרף</He>}
        yLabel={<He x={74} y={22} size={11} anchor="start">טרף שנאכל לטורף</He>} />
      <path d={curve((x) => Math.min(x / 60, 1), 0, 100, s)} fill="none" stroke={BLUE} strokeWidth={2.6} />
      <path d={curve((x) => x / (25 + x), 0, 100, s)} fill="none" stroke={ORANGE} strokeWidth={2.6} />
      <path d={curve((x) => (0.6 * x * x) / (35 * 35 + x * x), 0, 100, s)} fill="none" stroke={PURPLE} strokeWidth={2.6} />
      <He x={390} y={s.sy(1) + 4} size={11} bold color={BLUE} anchor="start">סוג I</He>
      <He x={390} y={s.sy(0.8) + 4} size={11} bold color={ORANGE} anchor="start">סוג II</He>
      <He x={390} y={s.sy(0.535) + 4} size={11} bold color={PURPLE} anchor="start">סוג III</He>
    </Svg>
  );
}

// ── ec-energy-flow ───────────────────────────────────────────────────────────
function EnergyPyramid() {
  const lv: [string, string, number, string, string][] = [
    ["יצרנים", "10,000", 360, FILL.green, GREEN],
    ["אוכלי צמחים", "1,000", 270, FILL.yellow, "#a16207"],
    ["טורפים", "100", 180, FILL.orange, ORANGE],
    ["טורפים עליונים", "10", 100, FILL.red, RED],
  ];
  return (
    <Svg h={250} label="פירמידת אנרגיה (ייצור): יצרנים כ-10,000 יחידות, אוכלי צמחים כ-1,000, טורפים כ-100, טורפים עליונים כ-10 — בכל מעבר עובר בממוצע כ-10%, והשאר אובד, בעיקר כחום. הרוחב סכמטי, לא בקנה מידה.">
      {lv.map(([t, v, w, f, c], i) => {
        const y = 182 - i * 46;
        return (
          <g key={t}>
            <rect x={220 - w / 2} y={y} width={w} height={38} rx={4} fill={f} stroke={c} strokeWidth={1.4} />
            <He x={220} y={y + 17} size={10.5} bold>{t}</He>
            <La x={220} y={y + 31} size={9.5} color={MUTED}>{v}</La>
          </g>
        );
      })}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Arrow x1={430} y1={200 - i * 46} x2={430} y2={162 - i * 46} color={INK} width={1.4} />
          <He x={438} y={186 - i * 46} size={9.5} anchor="start">כ-10%</He>
        </g>
      ))}
      <He x={240} y={242} size={10} color={MUTED}>כ-10% לייצור ברמה הבאה; היתר לנשימה, לדטריטוס או למלאי</He>
    </Svg>
  );
}

function FoodWeb() {
  const N: Record<string, [number, number, string, string]> = {
    grass: [60, 200, FILL.green, GREEN], shrub: [300, 200, FILL.green, GREEN],
    hopper: [40, 140, FILL.yellow, "#a16207"], mouse: [170, 140, FILL.yellow, "#a16207"], gazelle: [300, 140, FILL.yellow, "#a16207"],
    lizard: [60, 80, FILL.orange, ORANGE], fox: [220, 80, FILL.orange, ORANGE],
    eagle: [140, 24, FILL.red, RED], wolf: [320, 24, FILL.red, RED],
  };
  const name: Record<string, string> = { grass: "עשבים", shrub: "שיחים", hopper: "חגב", mouse: "עכבר", gazelle: "צבי", lizard: "לטאה", fox: "שועל", eagle: "עיט", wolf: "זאב" };
  const links: [number, number, number, number][] = [
    [105, 200, 80, 168], [125, 200, 200, 168], [335, 200, 340, 168], [320, 200, 225, 168],
    [80, 140, 95, 108], [220, 140, 255, 108], [200, 140, 180, 52], [100, 140, 240, 108],
    [120, 80, 165, 52], [350, 140, 360, 52], [280, 80, 345, 52],
  ];
  return (
    <Svg h={250} label="רשת מזון פשוטה: עשבים ושיחים (יצרנים) נאכלים בידי חגב, עכבר וצבי; חגב נאכל בידי לטאה ושועל; עכבר בידי שועל ועיט; לטאה בידי עיט; צבי ושועל בידי זאב. כל הרמות מגיעות בסוף למפרקים. החיצים מהנאכל לאוכל.">
      {links.map(([a, b, c, d], i) => <Arrow key={i} x1={a} y1={b} x2={c} y2={d} color={MUTED} width={1.3} />)}
      {Object.entries(N).map(([k, [x, y, f, c]]) => <Box key={k} x={x} y={y} w={80} h={28} fill={f} stroke={c} size={10.5}>{name[k]}</Box>)}
      <Box x={404} y={200} w={68} h={28} fill={FILL.brown} stroke={BROWN} size={10}>מפרקים</Box>
      <Arrow x1={384} y1={214} x2={402} y2={214} color={BROWN} width={1.2} dashed />
      <Arrow x1={380} y1={160} x2={420} y2={198} color={BROWN} width={1.2} dashed />
      <Arrow x1={400} y1={46} x2={444} y2={198} color={BROWN} width={1.2} dashed />
    </Svg>
  );
}

// ── ec-biogeochemical ────────────────────────────────────────────────────────
function CarbonCycle() {
  return (
    <Svg h={262} label="מחזור הפחמן: מהאטמוספרה (כ-900 גיגה-טון פחמן בשנות ה-2020) פחמן נקלט בצומח בפוטוסינתזה וחוזר בנשימה; צמחים מתים מגיעים לקרקע, והפירוק מחזיר CO₂ לאוויר; בין האטמוספרה לאוקיינוס (כ-38,000) יש חילוף גזים; שריפת דלקים מאובנים בידי האדם מוסיפה פחמן לאטמוספרה. ערכים מעוגלים.">
      <Box2 x={170} y={14} w={140} h={42} fill={FILL.sky} stroke="#0284c7" lines={["אטמוספרה", "כ-900"]} />
      <Box2 x={20} y={110} w={120} h={42} fill={FILL.green} stroke={GREEN} lines={["צומח", "כ-550"]} />
      <Box2 x={20} y={200} w={120} h={42} fill={FILL.brown} stroke={BROWN} lines={["קרקע", "כ-1,700"]} />
      <Box2 x={340} y={110} w={120} h={42} fill={FILL.blue} stroke={BLUE} lines={["אוקיינוס", "כ-38,000"]} />
      <Box2 x={180} y={200} w={120} h={42} fill={FILL.gray} stroke={MUTED} lines={["דלקים מאובנים", "כמה אלפים"]} />
      <Arrow x1={175} y1={56} x2={72} y2={108} color={GREEN} />
      <He x={112} y={74} size={10} anchor="end" color={GREEN}>פוטוסינתזה</He>
      <Arrow x1={120} y1={108} x2={205} y2={58} color={ORANGE} />
      <He x={146} y={108} size={10} anchor="start" color={ORANGE}>נשימה</He>
      <Arrow x1={80} y1={152} x2={80} y2={198} color={BROWN} />
      <He x={88} y={180} size={10} anchor="start" color={BROWN}>נשירה</He>
      <Arrow x1={140} y1={215} x2={240} y2={58} color={BROWN} />
      <He x={196} y={152} size={10} anchor="start" color={BROWN}>פירוק</He>
      <line x1={312} y1={54} x2={384} y2={108} stroke={BLUE} strokeWidth={1.8} markerStart="url(#bfArrow)" markerEnd="url(#bfArrow)" />
      <He x={362} y={74} size={10} anchor="start" color={BLUE}>חילוף גזים</He>
      <Arrow x1={260} y1={198} x2={260} y2={58} color={RED} width={2.4} />
      <He x={268} y={140} size={10} anchor="start" color={RED}>שריפת דלקים</He>
      <He x={240} y={258} size={9.5} color={MUTED}>מאגרים בגיגה-טון פחמן (מעוגל)</He>
    </Svg>
  );
}

function NitrogenCycle() {
  return (
    <Svg h={290} label="מחזור החנקן: חנקן אטמוספרי (N₂) מקובע בידי חיידקים לאמוניום; אמוניום וניטראט נקלטים בצמחים (הטמעה) ונהיים חנקן אורגני; מפרקים מחזירים אותו לאמוניום (אמוניפיקציה); חיידקים מחמצנים אמוניום לניטריט ולניטראט (ניטריפיקציה); ובתנאים אנאירוביים ניטראט חוזר ל-N₂ (דה-ניטריפיקציה).">
      <LBox x={180} y={16} w={120} h={32} fill={FILL.sky} stroke="#0284c7">N₂</LBox>
      <LBox x={30} y={120} w={90} h={32} fill={FILL.yellow} stroke="#a16207">NH₄⁺</LBox>
      <Box x={190} y={120} w={100} h={32} fill={FILL.green} stroke={GREEN} size={10.5}>חנקן אורגני</Box>
      <LBox x={360} y={120} w={90} h={32} fill={FILL.orange} stroke={ORANGE}>NO₃⁻</LBox>
      <LBox x={190} y={220} w={100} h={32} fill={FILL.orange} stroke={ORANGE}>NO₂⁻</LBox>
      <Arrow x1={190} y1={40} x2={92} y2={118} color={BLUE} width={2} />
      <He x={124} y={72} size={10} anchor="end" color={BLUE}>קיבוע</He>
      <Arrow x1={390} y1={118} x2={292} y2={42} color={PURPLE} width={2} />
      <He x={356} y={72} size={10} anchor="start" color={PURPLE}>דה-ניטריפיקציה</He>
      <Arrow x1={122} y1={131} x2={188} y2={131} color={GREEN} width={1.6} />
      <Arrow x1={188} y1={145} x2={122} y2={145} color={BROWN} width={1.6} />
      <He x={155} y={122} size={9.5} color={GREEN}>הטמעה</He>
      <He x={155} y={166} size={9.5} color={BROWN}>אמוניפיקציה</He>
      <Arrow x1={358} y1={136} x2={292} y2={136} color={GREEN} width={1.6} />
      <He x={325} y={128} size={9.5} color={GREEN}>הטמעה</He>
      <Arrow x1={100} y1={154} x2={196} y2={222} color={ORANGE} width={1.8} />
      <Arrow x1={290} y1={228} x2={382} y2={154} color={ORANGE} width={1.8} />
      <He x={240} y={272} size={10} color={ORANGE}>ניטריפיקציה — חמצון אמוניום, ואחריו חמצון ניטריט</He>
    </Svg>
  );
}

// ── ec-diversity ─────────────────────────────────────────────────────────────
function IslandBiogeography() {
  const s = scale(60, 330, 220, 40, 0, 100, 0, 1);
  const near = (x: number) => (1 - x / 100) ** 2;
  const far = (x: number) => 0.5 * (1 - x / 100) ** 2;
  const small = (x: number) => 0.9 * (x / 100) ** 2;
  const large = (x: number) => 0.4 * (x / 100) ** 2;
  const eq: [number, (x: number) => number][] = [[51.3, small], [61.25, large], [42.7, small], [52.8, large]];
  const legend: [string, string, boolean][] = [["התיישבות — אי קרוב", BLUE, false], ["התיישבות — אי רחוק", BLUE, true], ["הכחדה — אי קטן", RED, false], ["הכחדה — אי גדול", RED, true]];
  return (
    <Svg h={282} label="תיאוריית האיים: קצב ההתיישבות של מינים חדשים יורד ככל שיש יותר מינים באי (נמוך יותר לאי רחוק), וקצב ההכחדה עולה (גבוה יותר לאי קטן). מספר המינים בשיווי משקל — בנקודת החיתוך: הכי גבוה לאי גדול וקרוב, הכי נמוך לאי קטן ורחוק. עקומות סכמטיות.">
      <Axes x0={60} y0={220} x1={330} y1={40}
        xLabel={<He x={195} y={274} size={11}>מספר המינים באי</He>}
        yLabel={<He x={64} y={22} size={11} anchor="start">קצב</He>} />
      <path d={curve(near, 0, 100, s)} fill="none" stroke={BLUE} strokeWidth={2.4} />
      <path d={curve(far, 0, 100, s)} fill="none" stroke={BLUE} strokeWidth={2.4} strokeDasharray="6 4" />
      <path d={curve(small, 0, 100, s)} fill="none" stroke={RED} strokeWidth={2.4} />
      <path d={curve(large, 0, 100, s)} fill="none" stroke={RED} strokeWidth={2.4} strokeDasharray="6 4" />
      {eq.map(([x, f], i) => <circle key={i} cx={s.sx(x)} cy={s.sy(f(x))} r={3.6} fill={INK} />)}
      <line x1={s.sx(61.25)} y1={s.sy(large(61.25))} x2={s.sx(61.25)} y2={220} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
      <line x1={s.sx(42.7)} y1={s.sy(small(42.7))} x2={s.sx(42.7)} y2={220} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
      <He x={s.sx(42.7)} y={236} size={9.5}>קטן ורחוק</He>
      <He x={s.sx(61.25)} y={254} size={9.5}>גדול וקרוב</He>
      {legend.map(([t, c, d], i) => (
        <g key={t}>
          <line x1={344} y1={52 + i * 22} x2={364} y2={52 + i * 22} stroke={c} strokeWidth={2.4} strokeDasharray={d ? "6 4" : undefined} />
          <He x={370} y={56 + i * 22} size={9.5} anchor="start" color={c}>{t}</He>
        </g>
      ))}
    </Svg>
  );
}

// ── ec-succession ────────────────────────────────────────────────────────────
function SuccessionStages() {
  const C = [50, 125, 200, 280, 360, 438];
  return (
    <Svg h={262} label="שלבי סוקססיה לאורך זמן: חזזיות וטחבים על סלע חשוף; עשבים חד-שנתיים; עשבים רב-שנתיים; שיחים; עצים חלוציים אוהבי אור (אורן); ועצים סבולי צל (אלון). סוקססיה ראשונית מתחילה מהסלע החשוף; שניונית — אחרי הפרעה, כשהקרקע קיימת.">
      <rect x={10} y={200} width={460} height={10} fill="#d6b88a" />
      <path d="M26 200 L36 186 L58 182 L74 200 Z" fill="#cbd5e1" />
      {[[40, 186], [52, 184], [62, 190]].map(([x, y]) => <circle key={`${x}`} cx={x} cy={y} r={3} fill="#a3e635" />)}
      {[112, 122, 132, 140].map((x, i) => (
        <g key={x}>
          <line x1={x} y1={200} x2={x + (i % 2 ? 2 : -2)} y2={184} stroke={GREEN} strokeWidth={1.4} />
          <circle cx={x + (i % 2 ? 2 : -2)} cy={182} r={2.6} fill="#facc15" />
        </g>
      ))}
      {[186, 200, 214].map((x) => <path key={x} d={`M${x} 200 L${x - 6} 172 M${x} 200 L${x} 168 M${x} 200 L${x + 6} 172`} stroke={GREEN} strokeWidth={1.6} fill="none" />)}
      {[266, 294].map((x) => (
        <g key={x}>
          <rect x={x - 1.5} y={184} width={3} height={16} fill={BROWN} />
          <circle cx={x} cy={172} r={16} fill="#86efac" stroke={GREEN} strokeWidth={1} />
        </g>
      ))}
      <rect x={357} y={150} width={6} height={50} fill={BROWN} />
      <path d="M360 76 L384 156 L336 156 Z" fill="#4ade80" stroke={GREEN} strokeWidth={1} />
      <rect x={434} y={140} width={8} height={60} fill={BROWN} />
      <circle cx={438} cy={110} r={34} fill="#16a34a" stroke={GREEN} strokeWidth={1} />
      {["חזזיות וטחבים", "חד-שנתיים", "רב-שנתיים", "שיחים", "אורן", "אלון"].map((t, i) => <He key={t} x={C[i]} y={228} size={10}>{t}</He>)}
      <Arrow x1={30} y1={246} x2={460} y2={246} color={MUTED} />
      <He x={26} y={250} size={9.5} color={MUTED} anchor="end">זמן</He>
      <He x={C[0]} y={40} size={9.5} color={PURPLE}>ראשונית</He>
      <Arrow x1={C[0]} y1={46} x2={C[0]} y2={170} color={PURPLE} width={1.2} />
      <He x={C[1]} y={40} size={9.5} color={ORANGE}>שניונית</He>
      <Arrow x1={C[1]} y1={46} x2={C[1]} y2={168} color={ORANGE} width={1.2} />
    </Svg>
  );
}

function SuccessionMechanisms() {
  const rows: [string, string, string, "plus" | "zero" | "minus"][] = [
    ["עידוד", "+ משפרים את התנאים", GREEN, "plus"],
    ["סבילות", "0 בלי השפעה", MUTED, "zero"],
    ["עיכוב", "− מפריעים", RED, "minus"],
  ];
  return (
    <Svg h={226} label="שלושת המנגנונים של סוקססיה (קונל וסלטייר): עידוד — המינים המוקדמים משפרים את התנאים למאוחרים; סבילות — המוקדמים לא משפיעים, והמאוחרים מנצחים בזכות סבולת למשאבים נמוכים; עיכוב — המוקדמים מפריעים, והמאוחרים נכנסים רק כשהמוקדמים מתים.">
      <He x={340} y={20} size={10.5} bold color={MUTED}>מינים מוקדמים</He>
      <He x={140} y={20} size={10.5} bold color={MUTED}>מינים מאוחרים</He>
      {rows.map(([t, how, c, k], i) => {
        const y = 36 + i * 64;
        return (
          <g key={t}>
            <He x={472} y={y + 26} size={11} bold anchor="end" color={c}>{t}</He>
            <Box x={300} y={y + 8} w={80} h={30} fill={FILL.yellow} stroke="#a16207" size={10}>מוקדם</Box>
            <Box x={100} y={y + 8} w={80} h={30} fill={FILL.green} stroke={GREEN} size={10}>מאוחר</Box>
            {k === "plus" && <Arrow x1={298} y1={y + 23} x2={182} y2={y + 23} color={c} width={2} />}
            {k === "zero" && <line x1={298} y1={y + 23} x2={182} y2={y + 23} stroke={c} strokeWidth={1.4} strokeDasharray="5 4" />}
            {k === "minus" && (
              <g>
                <line x1={298} y1={y + 23} x2={184} y2={y + 23} stroke={c} strokeWidth={2} />
                <line x1={184} y1={y + 15} x2={184} y2={y + 31} stroke={c} strokeWidth={2.6} />
              </g>
            )}
            <He x={240} y={y + 10} size={9.5} color={c}>{how}</He>
          </g>
        );
      })}
    </Svg>
  );
}

// ── ec-human-impact ──────────────────────────────────────────────────────────
function Fragmentation() {
  const block = (x: number, y: number, w: number, edge: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={w} height={w} fill="#bbf7d0" />
      {w > 2 * edge && <rect x={x + edge} y={y + edge} width={w - 2 * edge} height={w - 2 * edge} fill="#15803d" />}
    </g>
  );
  return (
    <Svg h={250} label="קיטוע ואפקט השוליים: משמאל, יער רציף — רצועת שוליים (ירוק בהיר) סביב ליבה גדולה (ירוק כהה). מימין, אותו יער אחרי שכבישים חילקו אותו לארבעה כתמים — השטח הכולל כמעט זהה, אבל הליבה הצטמצמה מאוד.">
      {block(30, 30, 170, 30)}
      <He x={115} y={120} size={11} bold color="white">ליבה</He>
      <He x={115} y={46} size={9.5}>שוליים</He>
      {[[270, 30], [370, 30], [270, 130], [370, 130]].map(([x, y]) => block(x, y, 80, 30))}
      <He x={115} y={226} size={10.5}>יער רציף</He>
      <He x={360} y={232} size={10.5}>אחרי קיטוע — הרבה פחות ליבה</He>
    </Svg>
  );
}

function Eutrophication() {
  const X = [386, 292, 198, 104, 10];
  const steps: [string, string][] = [["עודף N, P", "(דשן, שפכים)"], ["פריחת", "אצות"], ["אצות מתות", "שוקעות"], ["פירוק — צריכת", "חמצן"], ["היפוקסיה —", "דגים מתים"]];
  return (
    <Svg h={226} label="אאוטרופיקציה: עודף חנקן וזרחן מדשנים ושפכים גורם לפריחת אצות; האצות מתות ושוקעות; הפירוק שלהן צורך את החמצן; ובעומק נוצרת היפוקסיה — דגים מתים. למטה: חתך אגם — שכבת אצות למעלה ושכבה חסרת חמצן בקרקעית.">
      {steps.map((l, i) => <Box2 key={i} x={X[i]} y={30} w={84} h={46} fill={i === 4 ? FILL.red : i === 1 ? FILL.green : FILL.yellow} stroke={i === 4 ? RED : i === 1 ? GREEN : "#a16207"} lines={l} />)}
      {[0, 1, 2, 3].map((i) => <Arrow key={i} x1={X[i] - 2} y1={53} x2={X[i + 1] + 86} y2={53} color={INK} />)}
      <rect x={60} y={110} width={360} height={22} fill="#86efac" />
      <rect x={60} y={132} width={360} height={46} fill={FILL.sky} />
      <rect x={60} y={178} width={360} height={24} fill="#57534e" />
      <He x={240} y={125} size={10.5} bold color={GREEN}>אצות בשכבה העליונה</He>
      <He x={240} y={160} size={10} color={BLUE}>מים</He>
      <He x={240} y={194} size={10.5} bold color="white">קרקעית — חסר חמצן</He>
    </Svg>
  );
}

function KeelingCurve() {
  const s = scale(70, 440, 220, 40, 1958, 2025, 300, 430);
  const f = (y: number) => 315 + 0.8 * (y - 1958) + 0.0125 * (y - 1958) ** 2 + 3 * Math.sin(2 * Math.PI * y);
  return (
    <Svg h={262} label="עקומת קילינג (מאונה לואה, צורה אידיאלית): ריכוז ה-CO₂ באוויר עלה מכ-315 חלקים למיליון ב-1958 למעל 420 היום, וקצב העלייה גדל. התנודה השנתית הקטנה — הצמחייה בחצי הכדור הצפוני קולטת CO₂ באביב ובקיץ.">
      <Axes x0={70} y0={220} x1={440} y1={40}
        xLabel={<He x={255} y={256} size={11}>שנה</He>}
        yLabel={<He x={74} y={22} size={11} anchor="start">CO₂ (חלקים למיליון)</He>} />
      {[320, 360, 400].map((v) => <La key={v} x={62} y={s.sy(v) + 4} size={10} anchor="end" color={MUTED}>{v}</La>)}
      {[1960, 1980, 2000, 2020].map((v) => <La key={v} x={s.sx(v)} y={236} size={10} color={MUTED}>{v}</La>)}
      <path d={curve(f, 1958, 2025, s, 800)} fill="none" stroke={RED} strokeWidth={1.6} />
      <He x={170} y={146} size={10} color={MUTED}>תנודה עונתית</He>
      <Lead x1={150} y1={152} x2={112} y2={186} />
    </Svg>
  );
}

export const ECOLOGY_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "ec-tolerance-curve": { el: ToleranceCurve, captionHe: "עקומת סבולת: טווח הרבייה צר מטווח השרידה. צורה אידיאלית." },
  "ec-climate-biomes": { el: ClimateBiomes, captionHe: "הביומות העיקריות לפי טמפרטורה ומשקעים (בסגנון דיאגרמת ויטאקר). הגבולות סכמטיים — בפועל הם הדרגתיים וחופפים." },
  "ec-niche": { el: Niche, captionHe: "נישה יסודית וממומשת בשני ממדים. סכמטי." },
  "ec-thermoregulation": { el: Thermoregulation, captionHe: "אנדותרמים ואקטותרמים, ואזור הנייטרליות התרמית. סכמטי." },
  "ec-growth-curves": { el: GrowthCurves, captionHe: "גידול מעריכי ולוגיסטי — מחושבים מהמודלים." },
  "ec-survivorship": { el: Survivorship, captionHe: "שלושת סוגי עקומות ההישרדות (Pearl). צורות אידיאליות; בטבע רוב העקומות מעורבות." },
  "ec-density-dependence": { el: DensityDependence, captionHe: "לידות ומוות תלויי צפיפות, ו-K בנקודת החיתוך. קווים סכמטיים." },
  "ec-population-cycles": { el: PopulationCycles, captionHe: "מחזור אוכלוסיות של טרף וטורף. עקומות אידיאליות, לא הנתונים של חברת מפרץ הדסון." },
  "ec-lv-competition": { el: LvCompetition, captionHe: "איזוקלינות לוטקה-וולטרה במקרה של דו-קיום. מחושב לפי הדוגמה בתרגיל הפתור." },
  "ec-interaction-signs": { el: InteractionSigns, captionHe: "סוגי האינטראקציות לפי הסימן (+, 0, −) לכל מין." },
  "ec-predator-prey": { el: PredatorPrey, captionHe: "מודל לוטקה-וולטרה לטורף-טרף: בזמן ובמישור הפאזות. צורות אידיאליות." },
  "ec-functional-responses": { el: FunctionalResponses, captionHe: "שלושת סוגי התגובה הפונקציונלית (הולינג). צורות אידיאליות." },
  "ec-energy-pyramid": { el: EnergyPyramid, captionHe: "פירמידת האנרגיה ו\"כלל ה-10%\". המספרים להמחשה; היעילות בפועל נעה בין 2% ליותר מ-20%." },
  "ec-food-web": { el: FoodWeb, captionHe: "רשת מזון פשוטה. חיצים מהנאכל לאוכל; מקווקו — אל המפרקים." },
  "ec-carbon-cycle": { el: CarbonCycle, captionHe: "מחזור הפחמן העולמי: מאגרים עיקריים ושטפים. ערכים מעוגלים בגיגה-טון פחמן; הסלעים (המאגר הגדול ביותר) לא מוצגים." },
  "ec-nitrogen-cycle": { el: NitrogenCycle, captionHe: "מחזור החנקן — כמעט כל המעברים בידי חיידקים. תהליך הבר-בוש (קיבוע תעשייתי) לא מוצג." },
  "ec-island-biogeography": { el: IslandBiogeography, captionHe: "תיאוריית האיים של מקארתור ווילסון. עקומות סכמטיות." },
  "ec-succession-stages": { el: SuccessionStages, captionHe: "שלבי סוקססיה טיפוסיים ביער ממוזג. בכל מקום הרצף והמינים שונים. סכמטי." },
  "ec-succession-mechanisms": { el: SuccessionMechanisms, captionHe: "שלושת המנגנונים של קונל וסלטייר (1977). בטבע הם פועלים יחד." },
  "ec-fragmentation": { el: Fragmentation, captionHe: "קיטוע ואפקט השוליים: אותו שטח, הרבה פחות ליבה. סכמטי." },
  "ec-eutrophication": { el: Eutrophication, captionHe: "שרשרת האאוטרופיקציה. סכמטי." },
  "ec-keeling-curve": { el: KeelingCurve, captionHe: "עקומת קילינג בצורה אידיאלית (עלייה מאיצה ותנודה שנתית) — לא הנתונים עצמם." },
};
