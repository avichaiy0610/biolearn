/* Figures for the endocrinology units (Technion 134155). Original schematic drawings; hormone curves are idealized
   shapes (marked as such in the captions), not data. Layout conventions follow Berne & Levy Physiology and Holt &
   Hanley, Essential Endocrinology — never copied. Labels sit beside shapes and arrows, never on a line.
   Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, Axes, BLUE, GREEN, INK, MUTED, ORANGE, He, La, curve, scale } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

import { BetaCell } from "./redraws/BetaCell";
import { GpcrCascade } from "./redraws/GpcrCascade";
import { HypothalamicPituitary } from "./redraws/HypothalamicPituitary";
import { ThyroidSynthesis } from "./redraws/ThyroidSynthesis";
import { ElisaFormats } from "./redraws/ElisaFormats";
const PURPLE = "#7c3aed";
const RED = "#b91c1c";
const TEAL = "#0f766e";
const FILL = { blue: "#dbeafe", green: "#dcfce7", orange: "#ffedd5", purple: "#ede9fe", yellow: "#fef3c7", gray: "#f1f5f9", red: "#fee2e2", sky: "#e0f2fe", teal: "#ccfbf1", cyto: "#fff7ed" };

const Svg = ({ w = 480, h, label, children }: { w?: number; h: number; label: string; children: React.ReactNode }) => (
  <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label={label}>
    <ArrowDefs />
    <defs>
      <marker id="enArrowRed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill={RED} /></marker>
    </defs>
    {children}
  </svg>
);
const Lead = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={1} />;
// Dashed red feedback path with a red arrowhead.
const Fb = ({ d }: { d: string }) => <path d={d} fill="none" stroke={RED} strokeWidth={1.6} strokeDasharray="5 4" markerEnd="url(#enArrowRed)" />;
// Labelled box; the text sits inside the shape.
function Box({ x, y, w, h, fill, stroke, children, size = 12, bold }: { x: number; y: number; w: number; h: number; fill: string; stroke: string; children: React.ReactNode; size?: number; bold?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <He x={x + w / 2} y={y + h / 2 + size * 0.36} size={size} bold={bold}>{children}</He>
    </g>
  );
}
const dots = (pts: [number, number][], color: string, r = 3) => pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} fill={color} />);

// ── en-signaling-modes ───────────────────────────────────────────────────────
function SignalingModes() {
  const vessel = (x: number, y: number, w: number) => <rect x={x} y={y} width={w} height={22} rx={11} fill={FILL.red} />;
  const cell = (cx: number, cy: number, fill: string, stroke: string) => <circle cx={cx} cy={cy} r={16} fill={fill} stroke={stroke} strokeWidth={1.4} />;
  const title = (x: number, a: string, b: string) => (
    <g>
      <He x={x} y={222} size={12} bold>{a}</He>
      <He x={x} y={238} size={9.5} color={MUTED}>{b}</He>
    </g>
  );
  return (
    <Svg h={250} label="ארבע דרכי איתות כימי: אנדוקריני — דרך הדם לתא רחוק; פרקריני — לתא שכן; אוטוקריני — לתא עצמו; נוירואנדוקריני — תא עצב שמשחרר את המוליך שלו לדם.">
      {cell(420, 40, FILL.orange, ORANGE)}
      {vessel(366, 98, 108)}
      {dots([[386, 109], [402, 109], [420, 109], [440, 109], [458, 109]], ORANGE)}
      <Arrow x1={420} y1={58} x2={420} y2={94} color={ORANGE} />
      <Arrow x1={440} y1={124} x2={440} y2={162} color={ORANGE} />
      {cell(440, 182, FILL.blue, BLUE)}
      {title(420, "אנדוקריני", "דרך הדם, לתא רחוק")}

      {cell(275, 110, FILL.orange, ORANGE)}
      {cell(325, 110, FILL.blue, BLUE)}
      {dots([[298, 104], [302, 116], [306, 108]], ORANGE, 2.5)}
      {title(300, "פרקריני", "לתא שכן")}

      {cell(180, 110, FILL.orange, ORANGE)}
      <path d="M196 102 C 226 82, 226 138, 197 120" fill="none" stroke={ORANGE} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      {dots([[214, 98], [219, 112], [213, 124]], ORANGE, 2.5)}
      {title(180, "אוטוקריני", "לתא עצמו")}

      <circle cx={62} cy={36} r={12} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <line x1={62} y1={48} x2={62} y2={94} stroke={PURPLE} strokeWidth={2.2} />
      {vessel(14, 98, 96)}
      {dots([[36, 109], [54, 109], [72, 109], [90, 109]], PURPLE)}
      <Arrow x1={80} y1={124} x2={80} y2={162} color={PURPLE} />
      {cell(80, 182, FILL.blue, BLUE)}
      {title(62, "נוירואנדוקריני", "תא עצב שמשחרר לדם")}
      <He x={120} y={88} size={9} color={RED} anchor="start">דם</He>
      <He x={474} y={88} size={9} color={RED} anchor="end">דם</He>
    </Svg>
  );
}

// ── en-hormone-classes ───────────────────────────────────────────────────────
function HormoneClasses() {
  const membraneReceptor = (x: number, y: number) => <path key={x} d={`M${x} ${y} L${x} ${y - 9} M${x} ${y - 9} L${x - 5} ${y - 15} M${x} ${y - 9} L${x + 5} ${y - 15}`} stroke={BLUE} strokeWidth={2} fill="none" />;
  return (
    <Svg h={280} label="שתי דרכים של הורמונים: פפטיד נאגר בשלפוחיות, משתחרר באקסוציטוזה, נע חופשי בדם ונקשר לקולטן על פני תא המטרה; סטרואיד נוצר מכולסטרול ומשתחרר מיד, נע בדם קשור לחלבון נושא, חודר את הממברנה ונקשר לקולטן בתוך התא.">
      <He x={360} y={18} size={13} bold>פפטיד (וקטכולאמינים)</He>
      <He x={120} y={18} size={13} bold>סטרואיד</He>

      <ellipse cx={360} cy={68} rx={90} ry={34} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.4} />
      {[[320, 82], [338, 88], [356, 90], [374, 88], [392, 82]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={5} fill="white" stroke={ORANGE} />)}
      <He x={360} y={62} size={10}>נאגר בשלפוחיות</He>
      <Arrow x1={360} y1={104} x2={360} y2={130} color={ORANGE} />

      <ellipse cx={120} cy={68} rx={90} ry={34} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <He x={120} y={62} size={10}>נוצר מכולסטרול</He>
      <He x={120} y={78} size={10}>ומשתחרר מיד</He>
      <Arrow x1={120} y1={104} x2={120} y2={130} color={GREEN} />

      <rect x={10} y={134} width={460} height={34} rx={17} fill={FILL.red} />
      {dots([[300, 151], [330, 151], [400, 151], [430, 151]], ORANGE)}
      {[60, 110, 170].map((x) => <g key={x}><ellipse cx={x} cy={151} rx={12} ry={7} fill="white" stroke={RED} /><circle cx={x + 10} cy={146} r={3} fill={GREEN} /></g>)}
      <He x={240} y={155} size={10} color={RED}>דם</He>
      <He x={360} y={186} size={9.5} color={MUTED}>חופשי · דקות</He>
      <He x={120} y={186} size={9.5} color={MUTED}>קשור לחלבון נושא · שעות</He>

      <ellipse cx={360} cy={238} rx={90} ry={32} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      {[315, 345, 375, 405].map((x) => membraneReceptor(x, 210))}
      <He x={360} y={246} size={10}>קולטן על פני התא</He>

      <ellipse cx={120} cy={238} rx={90} ry={32} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <ellipse cx={140} cy={240} rx={34} ry={18} fill={FILL.purple} stroke={PURPLE} />
      <circle cx={128} cy={240} r={4} fill={GREEN} />
      <He x={60} y={244} size={10}>קולטן בגרעין</He>
      <Arrow x1={120} y1={192} x2={124} y2={226} color={GREEN} />
    </Svg>
  );
}

// ── en-gpcr-cascade ──────────────────────────────────────────────────────────
// GpcrCascade: recomposed at textbook level, one picture on desktop (2026-11-07) — see ./redraws/GpcrCascade.tsx; old code in archive/figures/2026-11-07/.

// ── en-nuclear-receptor ──────────────────────────────────────────────────────
function NuclearReceptor() {
  const num = (x: number, y: number, n: string) => (
    <g key={n}>
      <circle cx={x} cy={y} r={8} fill={RED} />
      <He x={x} y={y + 4} size={10} bold color="white">{n}</He>
    </g>
  );
  return (
    <Svg h={340} label="קולטן גרעיני לסטרואיד: ההורמון חודר את הממברנה, נקשר לקולטן בציטופלזמה ומשחרר אותו מחלבון ההלם HSP90, הקולטן עובר כדימר לגרעין, נקשר לאלמנט התגובה להורמון ב-DNA, מגייס קו-אקטיבטורים, ונוצרים mRNA וחלבון חדש.">
      <ellipse cx={250} cy={132} rx={222} ry={104} fill={FILL.cyto} stroke={ORANGE} strokeWidth={1.4} />
      <ellipse cx={334} cy={140} rx={110} ry={66} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <polygon points="54,30 64,30 68,38 59,44 50,38" fill={GREEN} />
      <He x={86} y={28} size={10} anchor="start">הורמון</He>
      <Arrow x1={64} y1={46} x2={96} y2={104} color={GREEN} />
      <rect x={98} y={110} width={30} height={16} rx={5} fill={FILL.orange} stroke={ORANGE} />
      <ellipse cx={113} cy={136} rx={20} ry={8} fill={FILL.gray} stroke={MUTED} />
      <La x={113} y={160} size={9} color={MUTED}>HSP90</La>
      <Arrow x1={132} y1={116} x2={232} y2={124} color={ORANGE} />
      <rect x={240} y={118} width={22} height={16} rx={5} fill={FILL.orange} stroke={ORANGE} />
      <rect x={264} y={118} width={22} height={16} rx={5} fill={FILL.orange} stroke={ORANGE} />
      <line x1={232} y1={160} x2={430} y2={160} stroke={INK} strokeWidth={2.4} />
      <rect x={240} y={156} width={48} height={8} fill={RED} />
      <La x={264} y={180} size={9} color={RED}>HRE</La>
      <Arrow x1={300} y1={150} x2={340} y2={150} color={PURPLE} />
      <path d="M346 150 q8 -8 16 0 t16 0 t16 0" fill="none" stroke={PURPLE} strokeWidth={1.6} />
      <La x={370} y={136} size={9} color={PURPLE}>mRNA</La>
      <Arrow x1={330} y1={186} x2={230} y2={214} color={PURPLE} />
      <circle cx={216} cy={218} r={9} fill={FILL.gray} stroke={MUTED} />
      <path d="M200 222 q-8 6 -16 0 t-16 0" fill="none" stroke={BLUE} strokeWidth={2.4} />
      {num(84, 74, "1")}{num(150, 102, "2")}{num(252, 102, "3")}{num(300, 176, "4")}{num(190, 200, "5")}
      <He x={465} y={262} size={10.5} anchor="end">1 — ההורמון חודר בדיפוזיה דרך הממברנה</He>
      <He x={465} y={278} size={10.5} anchor="end">2 — נקשר לקולטן, שמשתחרר מחלבון ההלם (HSP90)</He>
      <He x={465} y={294} size={10.5} anchor="end">3 — הקולטן עובר לגרעין, לרוב כדימר</He>
      <He x={465} y={310} size={10.5} anchor="end">4 — נקשר לאלמנט התגובה (HRE) ומגייס קו-אקטיבטורים</He>
      <He x={465} y={326} size={10.5} anchor="end">5 — שעתוק ותרגום: חלבון חדש, אחרי שעות</He>
    </Svg>
  );
}

// ── en-feedback-axis ─────────────────────────────────────────────────────────
function FeedbackAxis() {
  return (
    <Svg h={300} label="ציר היפותלמוס–היפופיזה–בלוטה: ההיפותלמוס מפריש הורמון משחרר, ההיפופיזה מפרישה הורמון מעורר, הבלוטה מפרישה את ההורמון הסופי. ההורמון הסופי מעכב גם את ההיפופיזה וגם את ההיפותלמוס (לולאה ארוכה), והורמון ההיפופיזה מעכב את ההיפותלמוס (לולאה קצרה).">
      <Box x={180} y={30} w={160} h={34} fill={FILL.yellow} stroke={ORANGE} bold>היפותלמוס</Box>
      <Box x={180} y={110} w={160} h={34} fill={FILL.orange} stroke={ORANGE} bold>היפופיזה קדמית</Box>
      <Box x={180} y={190} w={160} h={34} fill={FILL.green} stroke={GREEN} bold>בלוטת מטרה</Box>
      <ellipse cx={260} cy={270} rx={80} ry={18} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <He x={260} y={274} size={11}>רקמות</He>
      <Arrow x1={260} y1={66} x2={260} y2={106} color={GREEN} />
      <Arrow x1={260} y1={146} x2={260} y2={186} color={GREEN} />
      <Arrow x1={260} y1={226} x2={260} y2={250} color={GREEN} />
      <He x={272} y={84} size={10.5} anchor="start">הורמון משחרר</He>
      <La x={272} y={98} size={9.5} anchor="start" color={MUTED}>CRH · TRH · GnRH</La>
      <He x={272} y={164} size={10.5} anchor="start">הורמון מעורר</He>
      <La x={272} y={178} size={9.5} anchor="start" color={MUTED}>ACTH · TSH · LH</La>
      <He x={346} y={244} size={10.5} anchor="start">הורמון סופי</He>
      <Fb d="M178 204 C 70 204, 70 50, 176 47" />
      <Fb d="M178 214 C 120 214, 120 130, 176 128" />
      <Fb d="M342 120 C 430 120, 430 54, 344 50" />
      <He x={44} y={128} size={10} color={RED}>לולאה ארוכה (−)</He>
      <He x={448} y={88} size={10} color={RED}>לולאה קצרה (−)</He>
    </Svg>
  );
}

// ── en-pulsatile ─────────────────────────────────────────────────────────────
function Pulsatile() {
  const top = scale(60, 440, 100, 30, 0, 8, 0, 1);
  const lh = (t: number) => { const p = t % 1; return 0.15 + 0.8 * (p < 0.08 ? p / 0.08 : Math.exp(-(p - 0.08) * 3.2)); };
  const bot = scale(60, 440, 220, 150, 0, 24, 0, 1);
  const cort = (t: number) => 0.12 + 0.78 * Math.exp(-((t - 8) ** 2) / 12) + 0.15 * Math.exp(-((t - 13) ** 2) / 4);
  return (
    <Svg h={256} label="שני קצבים של הפרשה: LH מופרש בפעימות בערך פעם בשעה; קורטיזול עולה ויורד בקצב יומי, עם שיא בבוקר ושפל בחצות. עקומות סכמטיות.">
      <Axes x0={60} y0={100} x1={440} y1={26} xLabel={<He x={476} y={104} size={10} anchor="end" color={MUTED}>שעות</He>} yLabel={<La x={48} y={34} size={10} anchor="end" color={BLUE}>LH</La>} />
      <path d={curve(lh, 0, 8, top, 400)} fill="none" stroke={BLUE} strokeWidth={2} />
      {[0, 2, 4, 6, 8].map((t) => <La key={t} x={top.sx(t)} y={114} size={9} color={MUTED}>{t}</La>)}
      <He x={250} y={20} size={11} bold>הפרשה בפעימות (LH)</He>

      <Axes x0={60} y0={220} x1={440} y1={146} xLabel={<He x={440} y={248} size={10} anchor="end" color={MUTED}>שעה ביום</He>} yLabel={<He x={50} y={154} size={10} anchor="end" color={ORANGE}>קורטיזול</He>} />
      <path d={curve(cort, 0, 24, bot)} fill="none" stroke={ORANGE} strokeWidth={2} />
      {[0, 6, 12, 18, 24].map((t) => <La key={t} x={bot.sx(t)} y={234} size={9} color={MUTED}>{`${t}:00`}</La>)}
      <He x={250} y={140} size={11} bold>קצב יומי (קורטיזול)</He>
      <He x={bot.sx(8) + 8} y={bot.sy(0.95) - 2} size={9.5} anchor="start" color={ORANGE}>שיא בבוקר</He>
    </Svg>
  );
}

// ── en-primary-secondary ─────────────────────────────────────────────────────
function PrimarySecondary() {
  const panel = (cx: number, title: string, broken: "gland" | "pit", tshW: number, t4W: number, result: string) => (
    <g>
      <He x={cx} y={20} size={13} bold>{title}</He>
      <rect x={cx - 65} y={34} width={130} height={32} rx={8} fill={broken === "pit" ? FILL.red : FILL.orange} stroke={broken === "pit" ? RED : ORANGE} strokeWidth={broken === "pit" ? 3 : 1.4} />
      <He x={cx} y={55} size={11}>היפופיזה</He>
      <line x1={cx} y1={68} x2={cx} y2={124} stroke={GREEN} strokeWidth={tshW} markerEnd="url(#bfArrowS)" />
      <La x={cx + 12} y={100} size={11} anchor="start" color={GREEN}>TSH</La>
      <rect x={cx - 65} y={128} width={130} height={32} rx={8} fill={broken === "gland" ? FILL.red : FILL.green} stroke={broken === "gland" ? RED : GREEN} strokeWidth={broken === "gland" ? 3 : 1.4} />
      <He x={cx} y={149} size={11}>בלוטת התריס</He>
      <line x1={cx} y1={162} x2={cx} y2={204} stroke={BLUE} strokeWidth={t4W} markerEnd="url(#bfArrowS)" />
      <La x={cx + 12} y={188} size={11} anchor="start" color={BLUE}>T₄</La>
      <Fb d={`M${cx - 20} 196 C ${cx - 100} 196, ${cx - 100} 50, ${cx - 68} 50`} />
      <He x={cx - 100} y={126} size={9} color={RED}>משוב</He>
      <La x={cx} y={228} size={12} bold>{result}</La>
      <He x={cx} y={246} size={10} color={MUTED}>{broken === "gland" ? "התקלה בבלוטה (אדום)" : "התקלה בהיפופיזה (אדום)"}</He>
    </g>
  );
  return (
    <Svg h={256} label="חוסר ראשוני מול משני בציר התריס: כשהבלוטה פגועה, T₄ יורד והמשוב גורם ל-TSH לעלות; כשההיפופיזה פגועה, גם TSH וגם T₄ נמוכים. עובי החץ מראה את הכמות.">
      {panel(350, "חוסר ראשוני", "gland", 5, 1.2, "TSH ↑   T₄ ↓")}
      {panel(130, "חוסר משני", "pit", 1.2, 1.2, "TSH ↓   T₄ ↓")}
    </Svg>
  );
}

// ── en-hypothalamic-pituitary ────────────────────────────────────────────────
// HypothalamicPituitary: recomposed at textbook level, one picture on desktop (2026-11-07) — see ./redraws/HypothalamicPituitary.tsx; old code in archive/figures/2026-11-07/.

// ── en-gh-igf ────────────────────────────────────────────────────────────────
function GhIgf() {
  return (
    <Svg h={310} label="ציר הורמון הגדילה: GHRH מגרה וסומטוסטטין מעכב את ההיפופיזה; GH פועל על הכבד, שמייצר IGF-1, וגם ישירות על שומן ושריר; IGF-1 מגדל את העצם בלוחית הגדילה ומעכב במשוב את הפרשת GH. גרלין מהקיבה מגביר את ההפרשה.">
      <Box x={170} y={14} w={140} h={32} fill={FILL.yellow} stroke={ORANGE} bold>היפותלמוס</Box>
      <Box x={170} y={104} w={140} h={32} fill={FILL.orange} stroke={ORANGE} bold>היפופיזה</Box>
      <Arrow x1={215} y1={48} x2={215} y2={100} color={GREEN} />
      <Arrow x1={265} y1={48} x2={265} y2={100} color={RED} />
      <La x={205} y={78} size={10} anchor="end" color={GREEN}>GHRH (+)</La>
      <He x={276} y={78} size={10} anchor="start" color={RED}>סומטוסטטין (−)</He>
      <He x={60} y={112} size={10} color={GREEN}>גרלין מהקיבה (+)</He>
      <Arrow x1={104} y1={120} x2={166} y2={120} color={GREEN} />

      <Box x={40} y={196} w={130} h={34} fill={FILL.red} stroke={RED} bold>כבד</Box>
      <Box x={310} y={196} w={150} h={34} fill={FILL.green} stroke={GREEN} size={11}>שומן ושריר</Box>
      <Box x={170} y={262} w={150} h={34} fill={FILL.blue} stroke={BLUE} size={11}>עצם: לוחית הגדילה</Box>
      <Arrow x1={210} y1={138} x2={140} y2={192} color={ORANGE} />
      <Arrow x1={270} y1={138} x2={350} y2={192} color={ORANGE} />
      <La x={164} y={158} size={10} anchor="end" color={ORANGE}>GH</La>
      <La x={318} y={158} size={10} anchor="start" color={ORANGE}>GH</La>
      <He x={385} y={248} size={9.5} color={MUTED}>ישירות: פירוק שומן, גלוקוז ↑</He>
      <Arrow x1={140} y1={232} x2={196} y2={258} color={BLUE} />
      <La x={150} y={256} size={10} anchor="end" color={BLUE}>IGF-1</La>
      <Fb d="M70 194 C 40 140, 90 100, 166 112" />
      <He x={30} y={160} size={9.5} color={RED} anchor="start">משוב (−)</He>
    </Svg>
  );
}

// ── en-thyroid-synthesis ─────────────────────────────────────────────────────
// ThyroidSynthesis: recomposed at textbook level, one picture on desktop (2026-11-07) — see ./redraws/ThyroidSynthesis.tsx; old code in archive/figures/2026-11-07/.

// ── en-gnrh-pulses ───────────────────────────────────────────────────────────
function GnrhPulses() {
  const a = scale(60, 440, 90, 30, 0, 6, 0, 1);
  const b = scale(60, 440, 200, 140, 0, 6, 0, 1);
  const gn = (t: number) => { const p = t % 1; return 0.03 + 0.95 * Math.exp(-(((p - 0.1) / 0.025) ** 2)); };
  const lh = (t: number) => { const p = (t + 0.9) % 1; return 0.2 + 0.7 * (p < 0.2 ? Math.max(0, (p - 0.1) / 0.1) : Math.exp(-(p - 0.2) * 3)); };
  return (
    <Svg h={226} label="GnRH משתחרר לדם השער בפעימות קצרות, בערך פעם בשעה, וכל פעימה גורמת לפעימה של LH בדם, עם עלייה מהירה וירידה איטית יותר. עקומות סכמטיות.">
      <Axes x0={60} y0={90} x1={440} y1={26} xLabel={<He x={476} y={94} size={10} anchor="end" color={MUTED}>שעות</He>} yLabel={<La x={50} y={34} size={10} anchor="end" color={PURPLE}>GnRH</La>} />
      <path d={curve(gn, 0, 6, a, 600)} fill="none" stroke={PURPLE} strokeWidth={1.8} />
      <He x={250} y={20} size={10.5} color={PURPLE}>בדם השער (היפופיזה)</He>
      <Axes x0={60} y0={200} x1={440} y1={136} xLabel={<He x={476} y={204} size={10} anchor="end" color={MUTED}>שעות</He>} yLabel={<La x={50} y={144} size={10} anchor="end" color={BLUE}>LH</La>} />
      <path d={curve(lh, 0, 6, b, 600)} fill="none" stroke={BLUE} strokeWidth={2} />
      <He x={250} y={130} size={10.5} color={BLUE}>בדם הכללי</He>
      {[0, 2, 4, 6].map((t) => <La key={t} x={a.sx(t)} y={214} size={9} color={MUTED}>{t}</La>)}
    </Svg>
  );
}

// ── en-hpg-feedback ──────────────────────────────────────────────────────────
function HpgFeedback() {
  return (
    <Svg h={310} label="ציר הרבייה: תאי קיספפטין מגרים את תאי ה-GnRH; GnRH מגרה את הגונדוטרופים בהיפופיזה להפריש LH ו-FSH; LH פועל על תאי ליידיג או תאי התקה, ו-FSH על תאי סרטולי או הגרנולוזה. הורמוני המין מבצעים משוב דרך תאי הקיספפטין, ואינהיבין מעכב את FSH בהיפופיזה.">
      <Box x={40} y={24} w={140} h={34} fill={FILL.purple} stroke={PURPLE} size={11}>תאי קיספפטין</Box>
      <Box x={260} y={24} w={140} h={34} fill={FILL.yellow} stroke={ORANGE} size={11}>תאי GnRH</Box>
      <Arrow x1={182} y1={41} x2={256} y2={41} color={GREEN} />
      <Box x={260} y={112} w={140} h={34} fill={FILL.orange} stroke={ORANGE} size={11}>גונדוטרופים</Box>
      <Arrow x1={330} y1={60} x2={330} y2={108} color={GREEN} />
      <La x={340} y={88} size={10} anchor="start" color={GREEN}>GnRH</La>
      <Box x={180} y={214} w={130} h={40} fill={FILL.green} stroke={GREEN} size={10.5}>ליידיג / תקה</Box>
      <Box x={340} y={214} w={130} h={40} fill={FILL.blue} stroke={BLUE} size={10.5}>סרטולי / גרנולוזה</Box>
      <Arrow x1={300} y1={148} x2={260} y2={210} color={ORANGE} />
      <Arrow x1={360} y1={148} x2={400} y2={210} color={ORANGE} />
      <La x={270} y={182} size={11} anchor="end" color={ORANGE} bold>LH</La>
      <La x={392} y={182} size={11} anchor="start" color={ORANGE} bold>FSH</La>
      <Fb d="M178 236 C 90 236, 80 120, 104 62" />
      <He x={60} y={160} size={10} color={RED}>הורמוני מין (−)</He>
      <Fb d="M472 226 C 476 160, 440 128, 404 128" />
      <He x={438} y={104} size={10} color={RED}>אינהיבין (−)</He>
      <He x={240} y={290} size={10} color={MUTED}>באמצע המחזור, אסטרדיול גבוה ומתמשך הופך את המשוב לחיובי (גל ה-LH)</He>
    </Svg>
  );
}

// ── en-two-cell ──────────────────────────────────────────────────────────────
function TwoCell() {
  const panel = (cx: number, title: string, top: string, topSub: string, mid: string, bot: string, botSub: string) => (
    <g>
      <He x={cx} y={18} size={13} bold>{title}</He>
      <La x={cx - 12} y={46} size={11} anchor="end" color={ORANGE} bold>LH</La>
      <Arrow x1={cx} y1={30} x2={cx} y2={58} color={ORANGE} />
      <rect x={cx - 95} y={62} width={190} height={56} rx={10} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <He x={cx} y={84} size={11.5} bold>{top}</He>
      <He x={cx} y={104} size={10}>{topSub}</He>
      <Arrow x1={cx} y1={120} x2={cx} y2={158} color={GREEN} />
      <He x={cx + 10} y={143} size={10} anchor="start" color={GREEN}>{mid}</He>
      <rect x={cx - 95} y={162} width={190} height={56} rx={10} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <He x={cx} y={184} size={11.5} bold>{bot}</He>
      <He x={cx} y={204} size={10}>{botSub}</He>
      <Arrow x1={cx} y1={250} x2={cx} y2={222} color={ORANGE} />
      <La x={cx - 12} y={244} size={11} anchor="end" color={ORANGE} bold>FSH</La>
    </g>
  );
  return (
    <Svg h={262} label="שני תאים, שתי גונדוטרופינות: באשך LH מגרה את תאי ליידיג לייצר טסטוסטרון, שעובר לתאי סרטולי, ו-FSH מגרה את תאי סרטולי לתמוך ביצירת הזרע. בזקיק LH מגרה את תאי התקה לייצר אנדרוגנים, ו-FSH מגרה בתאי הגרנולוזה את הארומטאז שהופך אותם לאסטרדיול.">
      {panel(360, "אשך", "תאי ליידיג", "כולסטרול ← טסטוסטרון", "טסטוסטרון", "תאי סרטולי", "יצירת זרע · אינהיבין")}
      {panel(120, "זקיק בשחלה", "תאי התקה", "כולסטרול ← אנדרוגנים", "אנדרוגנים", "תאי הגרנולוזה", "ארומטאז ← אסטרדיול")}
    </Svg>
  );
}

// ── en-ovarian-cycle ─────────────────────────────────────────────────────────
function OvarianCycle() {
  const t = scale(60, 440, 130, 40, 0, 28, 0, 1);
  const s = scale(60, 440, 270, 180, 0, 28, 0, 1);
  const g = (x: number, m: number, w: number) => Math.exp(-(((x - m) / w) ** 2));
  const lh = (x: number) => 0.12 + 0.82 * g(x, 14, 0.9) + 0.04 * g(x, 4, 6);
  const fsh = (x: number) => 0.18 + 0.18 * g(x, 3, 3.5) + 0.3 * g(x, 14, 0.9) + 0.1 * g(x, 27, 2.5);
  const e2 = (x: number) => 0.1 + 0.8 * g(x, 13, 2.2) * (x < 13 ? 1 : 1) + 0.35 * g(x, 21, 3.2);
  const p4 = (x: number) => 0.04 + 0.85 * g(x, 21, 3.4);
  return (
    <Svg h={330} label="המחזור החודשי: בשלב הזקיקי FSH עולה מעט ואסטרדיול עולה בהדרגה עד שיא; האסטרדיול הגבוה גורם לגל של LH בערך ביום 14 ולביוץ; בשלב הלוטאלי הגופיף הצהוב מפריש פרוגסטרון ואסטרדיול, ו-LH ו-FSH נמוכים; בסוף המחזור הפרוגסטרון יורד ומגיעה הווסת. עקומות סכמטיות.">
      <rect x={t.sx(0)} y={290} width={t.sx(13.5) - t.sx(0)} height={14} fill={FILL.blue} />
      <rect x={t.sx(13.5)} y={290} width={t.sx(14.5) - t.sx(13.5)} height={14} fill={ORANGE} />
      <rect x={t.sx(14.5)} y={290} width={t.sx(28) - t.sx(14.5)} height={14} fill={FILL.purple} />
      <He x={t.sx(7)} y={321} size={10.5}>שלב זקיקי</He>
      <He x={t.sx(14)} y={321} size={10.5} color={ORANGE}>ביוץ</He>
      <He x={t.sx(21)} y={321} size={10.5}>שלב לוטאלי</He>

      <Axes x0={60} y0={130} x1={440} y1={36} xLabel={<He x={440} y={146} size={9.5} anchor="end" color={MUTED}>יום</He>} yLabel={<He x={50} y={44} size={10} anchor="end">היפופיזה</He>} />
      <path d={curve(lh, 0, 28, t, 300)} fill="none" stroke={ORANGE} strokeWidth={2.2} />
      <path d={curve(fsh, 0, 28, t, 300)} fill="none" stroke={GREEN} strokeWidth={2.2} />
      <La x={t.sx(14) + 16} y={t.sy(0.9)} size={10.5} anchor="start" color={ORANGE} bold>LH</La>
      <La x={t.sx(4)} y={t.sy(0.42)} size={10.5} color={GREEN} bold>FSH</La>

      <Axes x0={60} y0={270} x1={440} y1={176} xLabel={<He x={440} y={286} size={9.5} anchor="end" color={MUTED}>יום</He>} yLabel={<He x={50} y={184} size={10} anchor="end">שחלה</He>} />
      <path d={curve(e2, 0, 28, s, 300)} fill="none" stroke={BLUE} strokeWidth={2.2} />
      <path d={curve(p4, 0, 28, s, 300)} fill="none" stroke={PURPLE} strokeWidth={2.2} />
      <He x={s.sx(12) - 14} y={s.sy(0.92)} size={10.5} anchor="end" color={BLUE} bold>אסטרדיול</He>
      <He x={s.sx(24) + 10} y={s.sy(0.8)} size={10.5} anchor="start" color={PURPLE} bold>פרוגסטרון</He>
      {[0, 7, 14, 21, 28].map((d) => <La key={d} x={t.sx(d)} y={160} size={9} color={MUTED}>{d}</La>)}
    </Svg>
  );
}

// ── en-steroidogenesis ───────────────────────────────────────────────────────
function Steroidogenesis() {
  const col = [100, 260, 420];
  const row = [74, 134, 194, 254, 314];
  const C = [{ f: FILL.blue, s: BLUE }, { f: FILL.green, s: GREEN }, { f: FILL.orange, s: ORANGE }];
  const B = (c: number, r: number, t: React.ReactNode) => (
    <g key={`${c}-${r}`}>
      <rect x={col[c] - 66} y={row[r] - 14} width={132} height={28} rx={7} fill={C[c].f} stroke={C[c].s} strokeWidth={1.2} />
      <He x={col[c]} y={row[r] + 4} size={10}>{t}</He>
    </g>
  );
  const H = (c: number, r: number, label: string) => (
    <g key={`h${c}-${r}`}>
      <Arrow x1={col[c] + 68} y1={row[r]} x2={col[c + 1] - 70} y2={row[r]} />
      <La x={(col[c] + col[c + 1]) / 2} y={row[r] - 19} size={8.5} color={MUTED}>{label}</La>
    </g>
  );
  const V = (c: number, r: number, label: string, side: 1 | -1 = 1) => (
    <g key={`v${c}-${r}`}>
      <Arrow x1={col[c]} y1={row[r] + 15} x2={col[c]} y2={row[r + 1] - 17} />
      <La x={col[c] + side * 6} y={(row[r] + row[r + 1]) / 2 + 4} size={8.5} anchor={side === 1 ? "start" : "end"} color={MUTED}>{label}</La>
    </g>
  );
  return (
    <Svg w={500} h={390} label="מסלול הסטרואידוגנזה: כולסטרול הופך לפרגננולון; משם שלושה טורים — מינרלוקורטיקואידים (עד אלדוסטרון, באזור הגלומרולרי), גלוקוקורטיקואידים (עד קורטיזול, באזור הפסיקולרי) ואנדרוגנים (DHEA ואנדרוסטנדיון, ובגונדות טסטוסטרון ואסטרדיול). האנזים CYP17 מעביר בין הטורים.">
      <rect x={col[0] - 66} y={10} width={132} height={26} rx={7} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.2} />
      <He x={col[0]} y={27} size={10.5} bold>כולסטרול</He>
      <Arrow x1={col[0]} y1={38} x2={col[0]} y2={58} />
      <La x={col[0] - 6} y={52} size={8.5} anchor="end" color={MUTED}>StAR, CYP11A1</La>
      {B(0, 0, "פרגננולון")}{B(1, 0, "17-הידרוקסי-פרגננולון")}{B(2, 0, "DHEA")}
      {H(0, 0, "CYP17 (17α)")}{H(1, 0, "CYP17 (17,20)")}
      {V(0, 0, "3β-HSD")}{V(1, 0, "3β-HSD")}{V(2, 0, "3β-HSD")}
      {B(0, 1, "פרוגסטרון")}{B(1, 1, "17-הידרוקסי-פרוגסטרון")}{B(2, 1, "אנדרוסטנדיון")}
      {H(0, 1, "CYP17 (17α)")}{H(1, 1, "CYP17 (17,20)")}
      {V(0, 1, "CYP21")}{V(1, 1, "CYP21")}{V(2, 1, "17β-HSD")}
      {B(0, 2, "11-דאוקסיקורטיקוסטרון")}{B(1, 2, "11-דאוקסיקורטיזול")}{B(2, 2, "טסטוסטרון")}
      {V(0, 2, "CYP11B2")}{V(1, 2, "CYP11B1")}{V(2, 2, "CYP19 (ארומטאז)")}
      {B(0, 3, "קורטיקוסטרון")}{B(1, 3, "קורטיזול")}{B(2, 3, "אסטרדיול")}
      {V(0, 3, "CYP11B2")}
      {B(0, 4, "אלדוסטרון")}
      <He x={col[1]} y={350} size={10} color={BLUE} anchor="middle">כחול — אזור גלומרולרי (אין CYP17)</He>
      <He x={col[1]} y={366} size={10} color={GREEN}>ירוק — אזור פסיקולרי · כתום — אזור רטיקולרי וגונדות</He>
      <He x={col[2]} y={300} size={9} color={MUTED}>טסטוסטרון ואסטרדיול —</He>
      <He x={col[2]} y={314} size={9} color={MUTED}>בעיקר בגונדות</He>
    </Svg>
  );
}

// ── en-beta-cell ─────────────────────────────────────────────────────────────
// BetaCell: recomposed at textbook level, one picture on desktop (2026-11-07) — see ./redraws/BetaCell.tsx; old code in archive/figures/2026-11-07/.

// ── en-fed-fast ──────────────────────────────────────────────────────────────
function FedFast() {
  const rows: [string, string, string][] = [
    ["כבד", "גליקוגן ↑, ייצור גלוקוז ↓", "פירוק גליקוגן, גלוקונאוגנזה, גופי קטו"],
    ["שריר", "קליטת גלוקוז (GLUT4), גליקוגן, חלבון", "קליטת גלוקוז נמוכה, משתמש בשומן"],
    ["שומן", "קליטת גלוקוז, אגירת שומן", "פירוק שומן: חומצות שומן לדם"],
    ["מוח", "גלוקוז (לא תלוי באינסולין)", "גלוקוז, ובצום ארוך — גופי קטו"],
  ];
  return (
    <Svg h={290} label="מצב שובע מול צום: אחרי ארוחה אינסולין גבוה וגלוקגון נמוך — הכבד אוגר גליקוגן, השריר והשומן קולטים גלוקוז ואוגרים; בצום אינסולין נמוך וגלוקגון גבוה — הכבד משחרר גלוקוז, השומן משחרר חומצות שומן, והגלוקוז נשמר למוח.">
      <rect x={250} y={14} width={220} height={44} rx={10} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <He x={360} y={32} size={12} bold>אחרי ארוחה</He>
      <He x={360} y={50} size={10}>אינסולין ↑ · גלוקגון ↓</He>
      <rect x={14} y={14} width={220} height={44} rx={10} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.4} />
      <He x={124} y={32} size={12} bold>צום</He>
      <He x={124} y={50} size={10}>אינסולין ↓ · גלוקגון ↑</He>
      {rows.map(([organ, fed, fast], i) => {
        const y = 74 + i * 52;
        return (
          <g key={organ}>
            <rect x={250} y={y} width={220} height={44} rx={8} fill="white" stroke={GREEN} />
            <rect x={14} y={y} width={220} height={44} rx={8} fill="white" stroke={ORANGE} />
            <He x={360} y={y + 18} size={11} bold>{organ}</He>
            <He x={360} y={y + 35} size={9.5}>{fed}</He>
            <He x={124} y={y + 18} size={11} bold>{organ}</He>
            <He x={124} y={y + 35} size={9.5}>{fast}</He>
          </g>
        );
      })}
    </Svg>
  );
}

export const ENDOCRINE_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "elisa-formats": { el: ElisaFormats, captionHe: "השוואת ELISA תחרותית וסנדוויץ׳ לאחר שטיפה והוספת סובסטרט. בתחרותית יותר הורמון בדגימה משאיר פחות מתחרה מסומן קשור, ולכן האות יורד; בסנדוויץ׳ יותר הורמון קושר יותר נוגדני גילוי עם אנזים, ולכן האות עולה. בתחרותית מוצג עיגון הנוגדן הראשוני לבארית באמצעות נוגדן שניוני, כפי שמתואר ביחידה. סכמטי, ללא קנה מידה; העקומות להמחשה ואינן נתוני כיול." },
  "en-signaling-modes": { el: SignalingModes, captionHe: "ארבע דרכי איתות כימי. ההבדל — לאן המולקולה מגיעה ובאיזו דרך. סכמטי." },
  "en-hormone-classes": { el: HormoneClasses, captionHe: "הקבוצה הכימית קובעת את כל השאר: אחסון, הובלה בדם, זמן מחצית חיים ומיקום הקולטן. הורמוני התריס דומים לסטרואידים בהובלה ובקולטן, אבל נוצרים מטירוזין ויוד ונאגרים בתירוגלובולין. סכמטי." },
  "en-gpcr-cascade": { el: GpcrCascade, captionHe: "מסלול Gs–cAMP–PKA, הנפוץ ביותר בהורמוני הפפטידים. בכל שלב יש הגברה. Gi מעכב את האדניליל ציקלאז; Gq מפעיל מסלול אחר. סכמטי." },
  "en-nuclear-receptor": { el: NuclearReceptor, captionHe: "מנגנון הקולטן הגרעיני של סטרואידים. קולטן התריס שונה: הוא נמצא בגרעין, קשור ל-DNA, גם בלי הורמון. סכמטי." },
  "en-feedback-axis": { el: FeedbackAxis, captionHe: "ציר בן שלוש קומות עם משוב שלילי. החיצים הירוקים — גירוי; המקווקווים האדומים — עיכוב. סכמטי." },
  "en-pulsatile": { el: Pulsatile, captionHe: "הפרשה בפעימות וקצב יומי. עקומות להמחשה, לא נתונים; בדיקה אחת היא רק נקודה על העקומה." },
  "en-primary-secondary": { el: PrimarySecondary, captionHe: "כך מבחינים בין תקלה בבלוטה לתקלה בהיפופיזה: לפי הכיוון של ההורמון שמעל. עובי החץ — כמות ההורמון. סכמטי." },
  "en-hypothalamic-pituitary": { el: HypothalamicPituitary, captionHe: "ההיפופיזה הקדמית מקבלת את ההורמונים המשחררים בדם (מערכת השער); האחורית — באקסונים. סכמטי, לא בקנה מידה." },
  "en-gh-igf": { el: GhIgf, captionHe: "ציר GH–IGF-1. רוב ההשפעה על הגדילה דרך IGF-1 (מהכבד ומייצור מקומי); ההשפעות המטבוליות — ישירות. סכמטי." },
  "en-thyroid-synthesis": { el: ThyroidSynthesis, captionHe: "ייצור הורמוני התריס: ההורמון נבנה בתוך חלבון (תירוגלובולין) ונאגר מחוץ לתא, בקולואיד. TSH מגביר כל שלב. סכמטי." },
  "en-gnrh-pulses": { el: GnrhPulses, captionHe: "פעימות GnRH ו-LH. עקומות להמחשה. תדירות הפעימות משנה את היחס בין LH ל-FSH." },
  "en-hpg-feedback": { el: HpgFeedback, captionHe: "ציר הרבייה ושני מסלולי המשוב: הורמוני המין דרך תאי הקיספפטין, ואינהיבין על FSH. סכמטי." },
  "en-two-cell": { el: TwoCell, captionHe: "מודל שני התאים: באשך ובזקיק, תא אחד מייצר אנדרוגן ותא שני משתמש בו. סכמטי." },
  "en-ovarian-cycle": { el: OvarianCycle, captionHe: "השינויים ההורמונליים במחזור של 28 יום. עקומות סכמטיות, לא בקנה מידה ביניהן; אורך השלב הזקיקי משתנה בין נשים." },
  "en-steroidogenesis": { el: Steroidogenesis, captionHe: "מסלול הסטרואידוגנזה. אילו אנזימים יש ברקמה קובע איזה סטרואיד ייצא ממנה. סכמטי." },
  "en-beta-cell": { el: BetaCell, captionHe: "תא β כחיישן גלוקוז: השלבים ממולקולת גלוקוז ועד שחרור אינסולין. סכמטי." },
  "en-fed-fast": { el: FedFast, captionHe: "אינסולין וגלוקגון במצב שובע ובצום. היחס ביניהם — ולא כל הורמון לבד — קובע את המצב." },
};
