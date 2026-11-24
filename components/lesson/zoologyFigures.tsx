/* Figures for the zoology units (Technion 134111). Original schematic drawings; layout conventions follow
   Hickman et al., Integrated Principles of Zoology (14th ed.) — never copied. Proportions are not to scale.
   Labels sit beside shapes with leader lines, never on top of a line. Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, BLUE, GREEN, INK, MUTED, ORANGE, He } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";
import { Sponge } from "./redraws/Sponge";
import { Cnidocyte } from "./redraws/Cnidocyte";
import { BirdLung } from "./redraws/BirdLung";
import { HairCell } from "./redraws/HairCell";
import { ProtistLocomotion } from "./redraws/ProtistLocomotion";
import { Paramecium } from "./redraws/Paramecium";
import { PolypMedusa } from "./redraws/PolypMedusa";
import { ArthropodPlan } from "./redraws/ArthropodPlan";
import { Tissues } from "./redraws/Tissues";
import { Amphioxus } from "./redraws/Amphioxus";
import { GutComparison } from "./redraws/GutComparison";
import { KidneySeries } from "./redraws/KidneySeries";
import { BrainComparison } from "./redraws/BrainComparison";
import { SkinLayers } from "./redraws/SkinLayers";

const PURPLE = "#7c3aed";
const RED = "#b91c1c";
const TEAL = "#0f766e";
const BROWN = "#92400e";
const FILL = { blue: "#dbeafe", green: "#dcfce7", orange: "#ffedd5", purple: "#ede9fe", yellow: "#fef3c7", gray: "#f1f5f9", red: "#fee2e2", sky: "#e0f2fe", teal: "#ccfbf1", pink: "#fce7f3" };

const Svg = ({ w = 480, h, label, children }: { w?: number; h: number; label: string; children: React.ReactNode }) => (
  <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label={label}>
    <ArrowDefs />
    {children}
  </svg>
);
const Lead = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={1} />;
// Short radial strokes around an ellipse (cilia, bristles).

// ── z-body-plans ─────────────────────────────────────────────────────────────
function BodyPlans() {
  const plane = { stroke: RED, strokeWidth: 1.4, strokeDasharray: "5 4" };
  return (
    <Svg h={220} label="שלוש תוכניות גוף: ספוג אסימטרי, צורב עם סימטריה רדיאלית — כמה מישורים מחלקים אותו לחצאים דומים — ותולעת שטוחה עם סימטריה דו-צדדית — מישור אחד בלבד, עם קצה קדמי וקצה אחורי.">
      <path d="M50 70 Q60 40 85 50 Q115 45 110 80 Q125 110 105 135 Q90 160 65 145 Q40 130 48 105 Q35 85 50 70Z" fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.6} />
      {[[70, 75], [92, 70], [80, 100], [98, 118], [62, 120]].map(([x, y]) => <circle key={`${x}`} cx={x} cy={y} r={3} fill="white" stroke={ORANGE} />)}
      <He x={80} y={185} size={13} bold>אסימטרי</He>
      <He x={80} y={203} size={11} color={MUTED}>ספוג</He>

      <circle cx={240} cy={100} r={50} fill={FILL.sky} stroke={BLUE} strokeWidth={1.6} />
      <circle cx={240} cy={100} r={9} fill="white" stroke={BLUE} />
      {[0, 45, 90, 135].map((a) => {
        const t = (a * Math.PI) / 180, dx = 64 * Math.cos(t), dy = 64 * Math.sin(t);
        return <line key={a} x1={240 - dx} y1={100 - dy} x2={240 + dx} y2={100 + dy} {...plane} />;
      })}
      <He x={240} y={185} size={13} bold>סימטריה רדיאלית</He>
      <He x={240} y={203} size={11} color={MUTED}>צורב (מבט מלמעלה)</He>

      <path d="M400 38 Q428 42 425 70 Q430 110 418 140 Q408 160 400 162 Q392 160 382 140 Q370 110 375 70 Q372 42 400 38Z" fill={FILL.green} stroke={GREEN} strokeWidth={1.6} />
      <circle cx={392} cy={56} r={3} fill={INK} />
      <circle cx={408} cy={56} r={3} fill={INK} />
      <line x1={400} y1={26} x2={400} y2={174} {...plane} />
      <He x={436} y={48} size={10} color={MUTED} anchor="start">קדמי</He>
      <He x={436} y={160} size={10} color={MUTED} anchor="start">אחורי</He>
      <He x={400} y={195} size={13} bold>סימטריה דו-צדדית</He>
      <He x={400} y={213} size={11} color={MUTED}>תולעת שטוחה</He>
    </Svg>
  );
}

// ── z-animal-tree ────────────────────────────────────────────────────────────
function AnimalTree() {
  const tips = ["ספוגים", "צורבים", "תולעים שטוחות", "תולעים טבעתיות", "רכיכות", "נמטודות", "פרוקי רגליים", "קווצי עור", "מיתרניים"];
  const ty = (i: number) => 30 + i * 26;
  const TX = 300;
  const V = (x: number, a: number, b: number) => <line x1={x} y1={a} x2={x} y2={b} stroke={INK} strokeWidth={2} />;
  const H = (a: number, b: number, y: number) => <line x1={a} y1={y} x2={b} y2={y} stroke={INK} strokeWidth={2} />;
  const L = 108, E = 173, D = 225, P = (L + E) / 2, B = (P + D) / 2, M = (ty(1) + B) / 2, R = (ty(0) + M) / 2;
  const tick = (x: number, y: number, n: string) => (
    <g key={n}>
      <line x1={x} y1={y - 5} x2={x} y2={y + 5} stroke={RED} strokeWidth={2.5} />
      <He x={x} y={y - 9} size={11} bold color={RED}>{n}</He>
    </g>
  );
  const bracket = (y1: number, y2: number, x: number, name: string, color: string) => (
    <g key={name}>
      <path d={`M${x} ${y1} L${x + 6} ${y1} L${x + 6} ${y2} L${x} ${y2}`} fill="none" stroke={color} strokeWidth={1.4} />
      <He x={x + 12} y={(y1 + y2) / 2 + 4} size={10} color={color} anchor="start">{name}</He>
    </g>
  );
  return (
    <Svg w={520} h={340} label="עץ מפושט של בעלי החיים: ספוגים, צורבים, ובעלי סימטריה דו-צדדית שמתחלקים לפרוטוסטומים — לופוטרוכוזואה ואקדיזוזואה — ולדאוטרוסטומים. סימנים על הענפים: רקמות, סימטריה דו-צדדית ושלוש שכבות נבט, נשל, ובלסטופור שהופך לפי טבעת.">
      {H(30, 50, R)}{V(50, ty(0), M)}{H(50, TX, ty(0))}{H(50, 90, M)}
      {V(90, ty(1), B)}{H(90, TX, ty(1))}{H(90, 130, B)}
      {V(130, P, D)}{H(130, 190, P)}{H(130, 240, D)}
      {V(190, L, E)}{H(190, 240, L)}{H(190, 240, E)}
      {V(240, ty(2), ty(4))}{V(240, ty(5), ty(6))}{V(240, ty(7), ty(8))}
      {[2, 3, 4, 5, 6, 7, 8].map((i) => <g key={i}>{H(240, TX, ty(i))}</g>)}
      {tips.map((t, i) => <He key={t} x={TX + 6} y={ty(i) + 4} size={12} anchor="start">{t}</He>)}
      {tick(70, M, "1")}{tick(110, B, "2")}{tick(215, E, "3")}{tick(185, D, "4")}
      {bracket(ty(2) - 6, ty(4) + 6, 394, "לופוטרוכוזואה", PURPLE)}
      {bracket(ty(5) - 6, ty(6) + 6, 394, "אקדיזוזואה", TEAL)}
      {bracket(ty(7) - 6, ty(8) + 6, 394, "דאוטרוסטומים", BLUE)}
      <path d={`M482 ${ty(2) - 6} L488 ${ty(2) - 6} L488 ${ty(6) + 6} L482 ${ty(6) + 6}`} fill="none" stroke={ORANGE} strokeWidth={1.4} />
      <He x={503} y={(ty(2) + ty(6)) / 2} size={10} color={ORANGE} rotate={-90}>פרוטוסטומים</He>
      <He x={505} y={276} size={11} anchor="end">1 — רקמות אמיתיות ותאי עצב</He>
      <He x={505} y={294} size={11} anchor="end">2 — סימטריה דו-צדדית ושלוש שכבות נבט</He>
      <He x={505} y={312} size={11} anchor="end">3 — נשל של הקוטיקולה</He>
      <He x={505} y={330} size={11} anchor="end">4 — הבלסטופור הופך לפי הטבעת</He>
    </Svg>
  );
}

// ── z-protist-locomotion ─────────────────────────────────────────────────────


// ── z-paramecium ─────────────────────────────────────────────────────────────


// ── z-sponge ─────────────────────────────────────────────────────────────────


// ── z-polyp-medusa ───────────────────────────────────────────────────────────


// ── z-cnidocyte ──────────────────────────────────────────────────────────────


// ── z-worm-sections ──────────────────────────────────────────────────────────
function WormSections() {
  const C = { ecto: FILL.sky, meso: "#fecaca", endo: "#fde68a" };
  const cy = 100;
  return (
    <Svg h={262} label="חתכי רוחב של שלוש תוכניות גוף: תולעת שטוחה — המזודרם ממלא את כל הרווח בין העור למעי, אין חלל; נמטודה — חלל (צלום מדומה) בין שכבת השריר למעי, בלי מזודרם סביב המעי; תולעת טבעתית — צלום אמיתי, מרופד מזודרם משני צדדיו, והמעי תלוי במזנטריום.">
      <circle cx={85} cy={cy} r={58} fill={C.ecto} stroke={BLUE} strokeWidth={1.4} />
      <circle cx={85} cy={cy} r={51} fill={C.meso} />
      <circle cx={85} cy={cy} r={16} fill={C.endo} />
      <circle cx={85} cy={cy} r={8} fill="white" />

      <circle cx={240} cy={cy} r={58} fill={C.ecto} stroke={BLUE} strokeWidth={1.4} />
      <circle cx={240} cy={cy} r={51} fill={C.meso} />
      <circle cx={240} cy={cy} r={43} fill="white" />
      <circle cx={240} cy={cy} r={16} fill={C.endo} />
      <circle cx={240} cy={cy} r={8} fill="white" />

      <circle cx={395} cy={cy} r={58} fill={C.ecto} stroke={BLUE} strokeWidth={1.4} />
      <circle cx={395} cy={cy} r={51} fill={C.meso} />
      <circle cx={395} cy={cy} r={43} fill="white" />
      <rect x={391} y={cy - 45} width={8} height={90} fill={C.meso} />
      <circle cx={395} cy={cy} r={22} fill={C.meso} />
      <circle cx={395} cy={cy} r={15} fill={C.endo} />
      <circle cx={395} cy={cy} r={8} fill="white" />

      <He x={85} y={182} size={13} bold>אין חלל גוף</He>
      <He x={85} y={199} size={11} color={MUTED}>תולעת שטוחה</He>
      <He x={240} y={182} size={13} bold>צלום מדומה</He>
      <He x={240} y={199} size={11} color={MUTED}>נמטודה</He>
      <He x={395} y={182} size={13} bold>צלום אמיתי</He>
      <He x={395} y={199} size={11} color={MUTED}>תולעת טבעתית</He>

      {[["אקטודרם", C.ecto, 400], ["מזודרם", C.meso, 270], ["אנדודרם (מעי)", C.endo, 140]].map(([t, c, x]) => (
        <g key={t as string}>
          <rect x={(x as number) + 6} y={226} width={16} height={12} fill={c as string} stroke={MUTED} strokeWidth={0.5} />
          <He x={x as number} y={236} size={11} anchor="end">{t}</He>
        </g>
      ))}
      <rect x={46} y={226} width={16} height={12} fill="white" stroke={MUTED} strokeWidth={0.5} />
      <He x={40} y={236} size={11} anchor="end">חלל</He>
    </Svg>
  );
}

// ── z-arthropod-plan ─────────────────────────────────────────────────────────


// ── z-tissues ────────────────────────────────────────────────────────────────


// ── z-cleavage ───────────────────────────────────────────────────────────────
function Cleavage() {
  const ln = (x1: number, y1: number, x2: number, y2: number) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={1.4} />;
  return (
    <Svg h={215} label="שלושה דפוסי חלוקה לפי כמות החלמון: מעט חלמון — חלוקה שלמה וכמעט שווה; כמות בינונית בקוטב הצמחי (צפרדע) — חלוקה שלמה לא שווה, תאים קטנים בקוטב החי וגדולים בקוטב הצמחי; הרבה חלמון (ציפור) — רק דסקית על פני החלמון מתחלקת.">
      <circle cx={80} cy={95} r={40} fill={FILL.sky} stroke={BLUE} strokeWidth={1.4} />
      {ln(80, 55, 80, 135)}{ln(40, 95, 120, 95)}
      <He x={80} y={172} size={12} bold>שלמה, כמעט שווה</He>
      <He x={80} y={189} size={10} color={MUTED}>מעט חלמון — קיפוד ים, אמפיוקסוס</He>

      <circle cx={240} cy={95} r={40} fill="#fde68a" />
      <path d="M201.27 85 A40 40 0 0 1 278.73 85 Z" fill={FILL.sky} />
      <circle cx={240} cy={95} r={40} fill="none" stroke={ORANGE} strokeWidth={1.4} />
      {ln(203.8, 78, 276.2, 78)}{ln(240, 55, 240, 135)}{ln(222, 59.3, 222, 78)}{ln(258, 59.3, 258, 78)}
      <He x={288} y={62} size={10} anchor="start">קוטב חי</He>
      <He x={288} y={134} size={10} anchor="start">קוטב צמחי</He>
      <He x={240} y={172} size={12} bold>שלמה, לא שווה</He>
      <He x={240} y={189} size={10} color={MUTED}>חלמון בינוני — צפרדע</He>

      <circle cx={400} cy={110} r={46} fill="#fde68a" stroke={ORANGE} strokeWidth={1.4} />
      <ellipse cx={400} cy={63} rx={22} ry={6} fill={FILL.sky} stroke={BLUE} strokeWidth={1.2} />
      {[389, 400, 411].map((x) => <line key={x} x1={x} y1={58} x2={x} y2={68} stroke={BLUE} strokeWidth={1} />)}
      <He x={428} y={50} size={10} anchor="start">דסקית</He>
      <He x={400} y={118} size={11} color={BROWN}>חלמון</He>
      <He x={400} y={176} size={12} bold>חלוקה חלקית</He>
      <He x={400} y={193} size={10} color={MUTED}>הרבה חלמון — ציפורים, זוחלים</He>
    </Svg>
  );
}

// ── z-organizer ──────────────────────────────────────────────────────────────
function Organizer() {
  return (
    <Svg h={230} label="ניסוי שפמן ומנגולד: השפה הגבית של הבלסטופור נלקחת מגסטרולה תורמת ומושתלת בצד הבטני של גסטרולה מאכסנת. מתפתח עובר עם ציר שני — מיתר גב, צינור עצבי וסומיטים — שרובו בנוי מתאי המאכסן.">
      <circle cx={70} cy={100} r={36} fill={FILL.sky} stroke={BLUE} strokeWidth={1.4} />
      <path d="M42 118 Q50 128 62 133" fill="none" stroke={INK} strokeWidth={3} />
      <circle cx={44} cy={104} r={9} fill={ORANGE} />
      <He x={70} y={164} size={11} bold>תורם</He>
      <He x={70} y={180} size={10} color={MUTED}>השפה הגבית (כתום)</He>

      <He x={146} y={88} size={10} color={MUTED}>השתלה</He>
      <Arrow x1={112} y1={100} x2={182} y2={100} />

      <circle cx={230} cy={100} r={36} fill={FILL.sky} stroke={BLUE} strokeWidth={1.4} />
      <path d="M202 118 Q210 128 222 133" fill="none" stroke={INK} strokeWidth={3} />
      <circle cx={258} cy={104} r={9} fill={ORANGE} />
      <He x={230} y={164} size={11} bold>מאכסן</He>
      <He x={230} y={180} size={10} color={MUTED}>השתל בצד הבטני</He>

      <Arrow x1={274} y1={100} x2={318} y2={100} />

      <ellipse cx={398} cy={84} rx={70} ry={20} fill={FILL.sky} stroke={BLUE} strokeWidth={1.4} />
      <line x1={340} y1={74} x2={456} y2={74} stroke={BLUE} strokeWidth={2.4} />
      <ellipse cx={398} cy={122} rx={56} ry={15} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.4} />
      <line x1={352} y1={130} x2={444} y2={130} stroke={ORANGE} strokeWidth={2.4} />
      <He x={398} y={50} size={10}>ציר ראשי (של המאכסן)</He>
      <He x={398} y={160} size={10}>ציר משני — רובו מתאי המאכסן</He>
      <He x={398} y={190} size={11} bold>עובר עם שני צירים</He>
      <He x={240} y={218} size={10} color={MUTED}>הקו הכהה — הבלסטופור; הקו בכל ציר — הצינור העצבי</He>
    </Svg>
  );
}

// ── z-amphioxus ──────────────────────────────────────────────────────────────


// ── z-gut-comparison ─────────────────────────────────────────────────────────


// ── z-kidney-series ──────────────────────────────────────────────────────────


// ── z-countercurrent ─────────────────────────────────────────────────────────
function Countercurrent() {
  const panel = (Y: number, counter: boolean, water: number[], blood: number[], title: string) => (
    <g>
      <He x={260} y={Y - 26} size={12} bold>{title}</He>
      <rect x={120} y={Y} width={280} height={22} fill={FILL.sky} />
      <rect x={120} y={Y + 30} width={280} height={22} fill={FILL.red} />
      <Arrow x1={150} y1={Y + 11} x2={370} y2={Y + 11} color={BLUE} />
      {counter ? <Arrow x1={370} y1={Y + 41} x2={150} y2={Y + 41} color={RED} /> : <Arrow x1={150} y1={Y + 41} x2={370} y2={Y + 41} color={RED} />}
      <He x={110} y={Y + 15} size={11} anchor="end" color={BLUE}>מים</He>
      <He x={110} y={Y + 45} size={11} anchor="end" color={RED}>דם</He>
      {[120, 260, 400].map((x, i) => (
        <g key={x}>
          <He x={x} y={Y - 6} size={11} color={BLUE}>{`${water[i]}`}</He>
          <He x={x} y={Y + 67} size={11} color={RED}>{`${blood[i]}`}</He>
        </g>
      ))}
    </g>
  );
  return (
    <Svg h={262} label="זרימה מקבילה מול זרימה נגדית בזימים. כשהמים והדם זורמים באותו כיוון, הריכוזים משתווים באמצע הדרך ובמודל פשוט הדם מגיע לכחצי מהערך במים. בזרימה נגדית נשמר הפרש קטן לכל האורך, והדם יוצא עם ערך קרוב לזה של המים הנכנסים.">
      {panel(42, false, [100, 60, 50], [0, 40, 50], "זרימה מקבילה — במודל הזה הדם מגיע לכל היותר לכ-50")}
      {panel(166, true, [100, 50, 15], [85, 40, 5], "זרימה נגדית — הדם יוצא עם כ-85")}
      <He x={260} y={254} size={10} color={MUTED}>המספרים — לחץ חלקי יחסי של חמצן במודל פשוט (100 = המים הנכנסים)</He>
    </Svg>
  );
}

// ── z-bird-lung ──────────────────────────────────────────────────────────────


// ── z-circuits ───────────────────────────────────────────────────────────────
function Circuits() {
  const box = (cx: number, y: number, t: string, fill: string) => (
    <g>
      <rect x={cx - 45} y={y} width={90} height={26} rx={6} fill={fill} stroke={MUTED} strokeWidth={1} />
      <He x={cx} y={y + 17} size={11}>{t}</He>
    </g>
  );
  const MIX = PURPLE;
  return (
    <Svg h={250} label="מחזור הדם: בדג — מחזור יחיד, הלב שואב לזימים ומשם הדם ממשיך ישר לגוף. בדו-חי — מחזור כפול עם חדר אחד, שבו הדם מתערבב חלקית. ביונק ובציפור — מחזור כפול עם הפרדה מלאה: צד ימין שואב לריאות, צד שמאל לגוף.">
      {box(80, 30, "זימים", FILL.sky)}{box(80, 188, "גוף", FILL.gray)}
      <rect x={55} y={105} width={50} height={30} rx={8} fill={FILL.blue} stroke={BLUE} />
      <He x={80} y={124} size={11}>לב</He>
      <Arrow x1={95} y1={104} x2={95} y2={58} color={BLUE} />
      <Arrow x1={42} y1={57} x2={42} y2={186} color={RED} />
      <Arrow x1={80} y1={187} x2={80} y2={137} color={BLUE} />

      {box(240, 30, "ריאות + עור", FILL.sky)}{box(240, 188, "גוף", FILL.gray)}
      <rect x={200} y={105} width={80} height={30} rx={8} fill={FILL.purple} stroke={PURPLE} />
      <He x={240} y={124} size={10}>2 עליות · חדר</He>
      <Arrow x1={268} y1={104} x2={268} y2={58} color={MIX} />
      <Arrow x1={212} y1={57} x2={212} y2={103} color={RED} />
      <Arrow x1={268} y1={136} x2={268} y2={186} color={MIX} />
      <Arrow x1={212} y1={187} x2={212} y2={137} color={BLUE} />

      {box(400, 30, "ריאות", FILL.sky)}{box(400, 188, "גוף", FILL.gray)}
      <rect x={360} y={105} width={38} height={30} rx={6} fill={FILL.blue} stroke={BLUE} />
      <rect x={402} y={105} width={38} height={30} rx={6} fill={FILL.red} stroke={RED} />
      <He x={379} y={124} size={10}>ימין</He>
      <He x={421} y={124} size={10}>שמאל</He>
      <Arrow x1={370} y1={104} x2={370} y2={58} color={BLUE} />
      <Arrow x1={430} y1={57} x2={430} y2={103} color={RED} />
      <Arrow x1={430} y1={136} x2={430} y2={186} color={RED} />
      <Arrow x1={370} y1={187} x2={370} y2={137} color={BLUE} />

      <He x={80} y={236} size={11} bold>דג — מחזור יחיד</He>
      <He x={240} y={236} size={11} bold>דו-חי — כפול, חדר אחד</He>
      <He x={400} y={236} size={11} bold>יונק, ציפור — כפול, מופרד</He>
    </Svg>
  );
}

// ── z-brain-comparison ───────────────────────────────────────────────────────


// ── z-hair-cell ──────────────────────────────────────────────────────────────


// ── z-skin-layers ────────────────────────────────────────────────────────────


// ── z-feather ────────────────────────────────────────────────────────────────
function Feather() {
  const barbsL = Array.from({ length: 16 }, (_, i) => 60 + i * 11);
  return (
    <Svg w={500} h={292} label="נוצת מתאר: קנה חלול בבסיס, שדרה מרכזית ודגל משני צדדיה, שבנוי מזקנים. בהגדלה: מכל זקן יוצאים זקנונים; לזקנונים מצד אחד יש ווים שננעלים בזקנונים של הזקן השכן ויוצרים משטח רציף. משמאל — פלומה, בלי דגל סגור.">
      <path d="M130 40 Q100 70 104 140 Q106 200 130 240 Z" fill={FILL.sky} />
      <path d="M130 40 Q190 80 186 150 Q182 210 130 240 Z" fill={FILL.sky} />
      {barbsL.map((y) => <line key={`l${y}`} x1={130} y1={y} x2={108} y2={y - 14} stroke={BLUE} strokeWidth={0.8} />)}
      {barbsL.map((y) => <line key={`r${y}`} x1={130} y1={y} x2={180} y2={y - 22} stroke={BLUE} strokeWidth={0.8} />)}
      <line x1={130} y1={36} x2={130} y2={244} stroke={INK} strokeWidth={2.4} />
      <rect x={126} y={244} width={8} height={28} rx={3} fill="white" stroke={INK} strokeWidth={1.4} />
      <rect x={152} y={112} width={22} height={22} fill="none" stroke={RED} strokeWidth={1.2} strokeDasharray="3 2" />
      <line x1={174} y1={112} x2={262} y2={40} stroke={RED} strokeWidth={0.8} strokeDasharray="3 2" />
      <line x1={174} y1={134} x2={262} y2={226} stroke={RED} strokeWidth={0.8} strokeDasharray="3 2" />
      <He x={66} y={92} size={10}>שדרה</He><Lead x1={80} y1={90} x2={128} y2={96} />
      <He x={210} y={58} size={10}>דגל</He><Lead x1={204} y1={62} x2={168} y2={78} />
      <He x={86} y={266} size={10}>קנה</He><Lead x1={98} y1={262} x2={125} y2={258} />
      <He x={130} y={288} size={11} bold>נוצת מתאר</He>

      <rect x={262} y={40} width={186} height={186} rx={8} fill="white" stroke={RED} strokeWidth={1.2} />
      <line x1={270} y1={84} x2={440} y2={84} stroke={BLUE} strokeWidth={4} strokeLinecap="round" />
      <line x1={270} y1={170} x2={440} y2={170} stroke={BLUE} strokeWidth={4} strokeLinecap="round" />
      {Array.from({ length: 10 }, (_, i) => 280 + i * 15).map((x) => (
        <g key={x}>
          <line x1={x} y1={86} x2={x + 12} y2={132} stroke={BLUE} strokeWidth={1.2} />
          <path d={`M${x + 12} 132 q4 2 2 6`} fill="none" stroke={RED} strokeWidth={1.2} />
          <line x1={x + 4} y1={168} x2={x + 16} y2={124} stroke={BLUE} strokeWidth={1.2} />
        </g>
      ))}
      <He x={456} y={88} size={10} anchor="start">זקן</He>
      <He x={456} y={174} size={10} anchor="start">זקן</He>
      <He x={355} y={64} size={10}>זקנונים עם ווים (אדום)</He>
      <He x={355} y={200} size={10}>זקנונים חלקים</He>
      <He x={355} y={244} size={10} color={MUTED}>הגדלה: הווים נועלים זקן לזקן</He>

      <line x1={40} y1={262} x2={40} y2={236} stroke={INK} strokeWidth={1.6} />
      {[-60, -35, -12, 12, 35, 60].map((a) => {
        const t = ((a - 90) * Math.PI) / 180;
        return <path key={a} d={`M40 236 q${18 * Math.cos(t) - 4} ${18 * Math.sin(t)} ${34 * Math.cos(t)} ${34 * Math.sin(t)}`} fill="none" stroke={MUTED} strokeWidth={1} />;
      })}
      <He x={40} y={288} size={11} bold>פלומה</He>
    </Svg>
  );
}

// ── z-placode ────────────────────────────────────────────────────────────────
function Placode() {
  const PINK = "#db2777";
  const epi = { fill: "none", stroke: PINK, strokeWidth: 7, strokeLinecap: "round" as const };
  return (
    <Svg h={268} label="מקור משותף לתוצרי העור: בשלב הראשון אפידרמיס שטוח מעל דרמיס; אחר כך פלקודה — עיבוי של האפידרמיס ומתחתיו צבר של תאי דרמיס. מאותה התחלה מתפתחים קשקש של זוחל, נוצה של ציפור או שערה של יונק.">
      <rect x={30} y={68} width={120} height={32} fill={FILL.yellow} />
      <line x1={30} y1={64} x2={150} y2={64} {...epi} />
      <He x={90} y={124} size={10}>1. אפידרמיס על דרמיס</He>
      <Arrow x1={158} y1={80} x2={186} y2={80} />

      <rect x={192} y={68} width={120} height={32} fill={FILL.yellow} />
      <line x1={192} y1={64} x2={230} y2={64} {...epi} />
      <line x1={274} y1={64} x2={312} y2={64} {...epi} />
      <rect x={230} y={58} width={44} height={14} rx={4} fill={FILL.pink} stroke={PINK} strokeWidth={1.4} />
      {[[242, 80], [252, 84], [262, 80], [247, 90], [257, 90]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={3} fill={BROWN} />)}
      <He x={252} y={124} size={10}>2. פלקודה</He>
      <He x={380} y={52} size={10}>עיבוי של האפידרמיס</He><Lead x1={340} y1={54} x2={276} y2={62} />
      <He x={386} y={98} size={10}>תאי דרמיס — אותות הדדיים</He><Lead x1={316} y1={94} x2={264} y2={86} />

      <Arrow x1={240} y1={134} x2={100} y2={160} />
      <Arrow x1={252} y1={134} x2={252} y2={160} />
      <Arrow x1={264} y1={134} x2={396} y2={160} />

      <rect x={30} y={204} width={130} height={30} fill={FILL.yellow} />
      <path d="M30 204 Q50 180 76 198 Q96 178 122 196 Q140 182 160 200" {...epi} />
      <He x={95} y={256} size={11} bold>קשקש (זוחל)</He>

      <rect x={192} y={204} width={120} height={30} fill={FILL.yellow} />
      <line x1={192} y1={200} x2={230} y2={200} {...epi} />
      <line x1={274} y1={200} x2={312} y2={200} {...epi} />
      <path d="M232 200 Q236 168 252 164 Q268 168 272 200 Z" fill={FILL.pink} stroke={PINK} strokeWidth={1.6} />
      <path d="M244 200 Q246 184 252 180 Q258 184 260 200 Z" fill="#fde68a" />
      <He x={252} y={256} size={11} bold>נוצה (ציפור)</He>

      <rect x={344} y={196} width={120} height={44} fill={FILL.yellow} />
      <line x1={344} y1={192} x2={388} y2={192} {...epi} />
      <line x1={420} y1={192} x2={464} y2={192} {...epi} />
      <path d="M388 192 Q386 232 404 236 Q422 232 420 192 Z" fill={FILL.pink} stroke={PINK} strokeWidth={1.6} />
      <circle cx={404} cy={230} r={5} fill={BROWN} />
      <line x1={404} y1={226} x2={406} y2={160} stroke={BROWN} strokeWidth={3} strokeLinecap="round" />
      <He x={404} y={256} size={11} bold>שערה (יונק)</He>
    </Svg>
  );
}

export const ZOOLOGY_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "z-body-plans": { el: BodyPlans, captionHe: "סוגי סימטריה. הקווים המקווקווים הם מישורים שמחלקים את הגוף לחצאים דומים: בסימטריה רדיאלית — רבים, בסימטריה דו-צדדית — אחד בלבד. סכמטי." },
  "z-animal-tree": { el: AnimalTree, captionHe: "עץ מפושט של קבוצות בעלי החיים שנלמדות בקורס. הסימנים האדומים מסמנים חידושים על הענפים. סכמטי — היחסים בבסיס העץ עדיין בדיון." },
  "z-protist-locomotion": { el: ProtistLocomotion, captionHe: "שלוש דרכי תנועה של חד-תאיים: פסאודופודים, שוטון וריסים. החיצים מראים את כיוון התנועה. סכמטי, לא בקנה מידה." },
  "z-paramecium": { el: Paramecium, captionHe: "פרמציום — מבנה התא. שני סוגי הגרעינים והבועיות המתכווצות הם הנקודות החשובות. סכמטי." },
  "z-sponge": { el: Sponge, captionHe: "ספוג פשוט (מבנה אסקונואידי) בחתך. החיצים הכחולים — זרם המים, שמונע בשוטונים של תאי הצווארון. סכמטי." },
  "z-polyp-medusa": { el: PolypMedusa, captionHe: "פוליפ ומדוזה — אותה תוכנית גוף, הפוכה. במדוזה המזוגליאה עבה בהרבה. סכמטי." },
  "z-cnidocyte": { el: Cnidocyte, captionHe: "תא צורב לפני הירי ואחריו. החוט מתהפך החוצה בבת אחת, ונמטוציסט משמש פעם אחת בלבד. סכמטי." },
  "z-worm-sections": { el: WormSections, captionHe: "חתכי רוחב: בלי חלל גוף, צלום מדומה וצלום אמיתי. ההבדל — איפה המזודרם (אדום) נמצא ביחס לחלל. סכמטי." },
  "z-arthropod-plan": { el: ArthropodPlan, captionHe: "השלד החיצוני: שכבות הקוטיקולה (משמאל) ומפרק בין שני מקטעים (מימין). השרירים מחוברים לשלד מבפנים ופועלים כמנופים. סכמטי." },
  "z-tissues": { el: Tissues, captionHe: "ארבעת סוגי הרקמות בבעלי חיים. סכמטי, לא בקנה מידה." },
  "z-cleavage": { el: Cleavage, captionHe: "כמות החלמון ומיקומו קובעים את דפוס החלוקה (צהוב = חלמון). ביונקי שליה החלוקה שלמה אבל בדפוס אחר (סיבובי). סכמטי." },
  "z-organizer": { el: Organizer, captionHe: "ניסוי המארגן של שפמן ומנגולד (1924). השתל השרה את תאי המאכסן ליצור ציר גוף שני. סכמטי." },
  "z-amphioxus": { el: Amphioxus, captionHe: "האמפיוקסוס — מבט מהצד. ארבעת הסימנים של המיתרניים (מיתר גב, צינור עצבי גבי, חרכי לוע וזנב אחרי פי הטבעת) והאנדוסטיל ניכרים גם בבוגר. סכמטי." },
  "z-gut-comparison": { el: GutComparison, captionHe: "השוואה סכמטית של מערכות עיכול. ירוק — תאי תסיסה; כתום — קיבה. האורכים לא בקנה מידה." },
  "z-kidney-series": { el: KidneySeries, captionHe: "שלוש הכליות של העובר מופיעות מקדימה לאחור. הפסים התחתונים מראים איזו כליה פועלת בבוגר בכל קבוצה. סכמטי." },
  "z-countercurrent": { el: Countercurrent, captionHe: "למה זרימה נגדית יעילה: לאורך כל הדרך הדם פוגש מים עם לחץ חלקי של חמצן גבוה משלו. מודל פשוט — לשני הזרמים קיבולת הובלה שווה; המספרים להמחשה, לא אחוזי רוויה של המוגלובין." },
  "z-bird-lung": { el: BirdLung, captionHe: "מסלול מנה אחת של אוויר בציפור — שני מחזורי נשימה. בריאה הזרימה חד-כיוונית. סכמטי; השקים הם בפועל כמה זוגות." },
  "z-circuits": { el: Circuits, captionHe: "מחזור יחיד ומחזור כפול. כחול — דם דל בחמצן, אדום — עשיר, סגול — מעורב. סכמטי." },
  "z-brain-comparison": { el: BrainComparison, captionHe: "אותם חמישה אזורים בכל החולייתנים, בגדלים שונים. סכמטי, לא בקנה מידה; הקדמי משמאל." },
  "z-hair-cell": { el: HairCell, captionHe: "תא שערה ממיר כפיפה של הצרור לשינוי בקצב הפוטנציאלים בעצב — לשני הכיוונים. סכמטי." },
  "z-skin-layers": { el: SkinLayers, captionHe: "שכבות העור של חולייתן יבשתי. כלי הדם נמצאים רק בדרמיס. סכמטי." },
  "z-feather": { el: Feather, captionHe: "מבנה נוצת מתאר והגדלה של הזקנים. הווים בזקנונים יוצרים את הדגל הרציף. סכמטי." },
  "z-placode": { el: Placode, captionHe: "קשקש, נוצה ושערה מתחילים באותו מבנה עוברי — פלקודה, שמתקשרת באותות עם הדרמיס (בנוצות ובשערות נוצר מתחתיה צבר תאי דרמיס ברור). סכמטי." },
};
