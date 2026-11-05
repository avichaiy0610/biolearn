/* Original figures for Technion 136014. Antibody reference: Alberts MBoC 7e,
   Fig. 24-23; protein/display concepts: the primary papers cited in each unit.
   Plots and illustrative numbers are generated here, not experimental data. */
import type { ReactElement, ReactNode } from "react";
import { ArrowDefs, BLUE, GREEN, INK, MUTED, ORANGE, He, La } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";
import { AntibodyFormats } from "./redraws/AntibodyFormats";

const PURPLE = "#7c3aed";
const Svg = ({ h, label, children }: { h: number; label: string; children: ReactNode }) => (
  <svg viewBox={`0 0 400 ${h}`} className="w-full h-auto" role="img" aria-label={label}>
    <ArrowDefs />{children}
  </svg>
);
function Panel({ x, y, w, lines, color = BLUE }: { x: number; y: number; w: number; lines: string[]; color?: string }) {
  return <g><rect x={x} y={y} width={w} height={lines.length * 22 + 16} rx={9} fill="white" stroke={color} strokeWidth={1.5} />
    {lines.map((s, i) => <He key={s} x={x + w / 2} y={y + 24 + i * 22} size={15} color={color}>{s}</He>)}
  </g>;
}

function Binding() {
  const curve = (kd: number) => Array.from({ length: 101 }, (_, i) => `${i ? "L" : "M"}${55 + 3 * i} ${220 - 155 * i / (kd + i)}`).join(" ");
  return <Svg h={315} label="עקומות תפוסה מחושבות לפי L חלקי Kd ועוד L: כאשר Kd קטן יותר מתקבלת תפוסה גבוהה יותר באותו ריכוז חופשי. אלו עקומות מודל קישור, לא עקומות עיכוב.">
    <He x={200} y={23} size={16} bold>תפוסה במודל חד-אתרי</He>
    <La x={43} y={69} size={13} color={MUTED}>1</La><La x={43} y={224} size={13} color={MUTED}>0</La>
    <Arrow x1={55} y1={220} x2={55} y2={47} color={INK} /><Arrow x1={55} y1={220} x2={370} y2={220} color={INK} />
    <path d={curve(10)} fill="none" stroke={BLUE} strokeWidth={2.5} />
    <path d={curve(40)} fill="none" stroke={ORANGE} strokeWidth={2.5} />
    <La x={200} y={246} size={14}>L (nM): 0–100</La>
    <La x={200} y={274} size={14} color={BLUE}>Kd = 10 nM</La>
    <La x={200} y={297} size={14} color={ORANGE}>Kd = 40 nM</La>
  </Svg>;
}

function LibrarySpace() {
  return <Svg h={285} label="איור מושגי של מרחב רצפים לעומת ספרייה שנדגמה ממנו. כפילויות ופגמים גורמים למספר הרצפים הייחודיים התקינים להיות קטן ממספר החברים שנמנו.">
    <He x={100} y={28} size={16} bold>מרחב אפשרי</He><He x={300} y={28} size={16} bold>דגימה בפועל</He>
    {Array.from({ length: 16 }, (_, i) => <g key={i}>
      <circle cx={49 + (i % 4) * 34} cy={64 + Math.floor(i / 4) * 34} r={11} fill="white" stroke={BLUE} strokeWidth={1.4} />
      <La x={49 + (i % 4) * 34} y={68 + Math.floor(i / 4) * 34} size={10}>{i + 1}</La>
    </g>)}
    {[2, 2, 5, 9, 5, 2, 12, 0].map((n, i) => <g key={i}>
      <circle cx={261 + (i % 3) * 38} cy={70 + Math.floor(i / 3) * 40} r={13} fill={n ? "#dbeafe" : "#fee2e2"} stroke={n ? BLUE : ORANGE} strokeWidth={1.4} />
      <La x={261 + (i % 3) * 38} y={74 + Math.floor(i / 3) * 40} size={12}>{n || "×"}</La>
    </g>)}
    <Arrow x1={190} y1={112} x2={225} y2={112} color={INK} />
    <He x={200} y={214} size={15}>8 חברים · 4 זהויות תקינות ייחודיות</He>
    <He x={200} y={239} size={14} color={MUTED}>מספרים חוזרים: כפילויות · ×: תוצר פגום</He>
    <He x={200} y={268} size={14} color={MUTED}>דוגמה מושגית; אינה ספרייה שנמדדה</He>
  </Svg>;
}

function PhageDisplay() {
  return <Svg h={385} label="פאג' חוטי נושא בתוכו מידע גנטי ומציג מקטע נוגדן בקצה המעטפת. הפרדת חלקיקים קושרים שומרת את הקשר לרצף, אך נדרש אימות בחלבון חופשי.">
    <He x={200} y={25} size={16} bold>תכונת החלבון נשארת קשורה לזהותו</He>
    <rect x={40} y={85} width={250} height={30} rx={15} fill="#e0f2fe" stroke={BLUE} strokeWidth={2} />
    {Array.from({ length: 17 }, (_, i) => <line key={i} x1={55 + i * 13} y1={88} x2={48 + i * 13} y2={112} stroke={BLUE} strokeWidth={0.6} />)}
    <path d="M 70 100 q 15 -10 30 0 t 30 0 t 30 0 t 30 0 t 30 0" fill="none" stroke={PURPLE} strokeWidth={2} />
    <line x1={290} y1={100} x2={314} y2={100} stroke={BLUE} strokeWidth={3} />
    <ellipse cx={324} cy={91} rx={11} ry={16} fill="#ffedd5" stroke={ORANGE} strokeWidth={1.5} />
    <ellipse cx={354} cy={91} rx={10} ry={16} fill="#dcfce7" stroke={GREEN} strokeWidth={1.5} />
    <path d="M 335 91 q 4 22 9 0" fill="none" stroke={MUTED} strokeWidth={1.7} />
    <He x={155} y={64} size={14} color={BLUE}>מעטפת פאג׳ חוטי</He>
    <La x={330} y={137} size={14} color={ORANGE}>scFv</La>
    <He x={155} y={153} size={14} color={PURPLE}>מידע גנטי נישא בחלקיק</He>
    <Arrow x1={200} y1={171} x2={200} y2={198} color={INK} />
    <Panel x={55} y={205} w={290} lines={["ברירה לפי קישור למטרה", "העשרה ושחזור זהויות"]} />
    <Arrow x1={200} y1={271} x2={200} y2={296} color={INK} />
    <He x={200} y={324} size={16} bold>רצף מועמד ← חלבון מסיס לבדיקה</He>
    <He x={200} y={364} size={14} color={MUTED}>סכמטי, לא בקנה מידה · לא פאג׳ ראש–זנב</He>
  </Svg>;
}

function EvolutionCycle() {
  return <Svg h={350} label="מחזור אבולוציה מכוונת: שונות, ביטוי ומדידה, בחירת מועמדים, דור נוסף. הבחירה משפרת את המדד שנבדק, ולא מבטיחה שיפור בכל תכונות החלבון.">
    <Panel x={70} y={20} w={260} lines={["שונות ברצפים"]} color={PURPLE} />
    <Arrow x1={200} y1={62} x2={200} y2={84} color={INK} />
    <Panel x={70} y={90} w={260} lines={["ביטוי ומדידת תכונה"]} />
    <Arrow x1={200} y1={132} x2={200} y2={154} color={INK} />
    <Panel x={70} y={160} w={260} lines={["בחירה ואימות מועמדים"]} color={GREEN} />
    <Arrow x1={200} y1={202} x2={200} y2={224} color={INK} />
    <Panel x={70} y={230} w={260} lines={["דור נוסף של חלופות"]} color={PURPLE} />
    <path d="M 335 250 C 385 250 385 39 335 39" fill="none" stroke={PURPLE} strokeWidth={1.5} markerEnd="url(#bfArrow)" />
    <He x={200} y={312} size={15} bold>הכשירות מוגדרת בתנאי המדידה</He>
    <He x={200} y={338} size={14} color={MUTED}>מחזור נוסף אינו מבטיח שיפור</He>
  </Svg>;
}

function Epistasis() {
  const values = [1, 2, 3, 0.4];
  return <Svg h={275} label="נתונים מדומים של אפיסטזיס: המקור בעל פעילות 1, שינוי A נותן 2 ו-B נותן 3, אך השילוב AB נותן 0.4. השפעת השינוי תלויה ברקע הרצף.">
    <He x={200} y={25} size={16} bold>שינויים מועילים אינם תמיד מצטברים</He>
    <Arrow x1={40} y1={205} x2={40} y2={50} color={INK} />
    <line x1={40} y1={205} x2={370} y2={205} stroke={INK} strokeWidth={1.4} />
    {values.map((v, i) => <g key={i}>
      <rect x={63 + i * 80} y={205 - v * 40} width={39} height={v * 40} fill={i === 3 ? "#ffedd5" : "#dbeafe"} stroke={i === 3 ? ORANGE : BLUE} strokeWidth={1.4} />
      <La x={82 + i * 80} y={195 - v * 40} size={14}>{v}</La>
      <La x={82 + i * 80} y={229} size={14}>{["WT", "A", "B", "AB"][i]}</La>
    </g>)}
    <He x={200} y={261} size={14} color={MUTED}>פעילות יחסית · נתונים מדומים</He>
  </Svg>;
}

// The Y is formed by two heavy chains and two light chains, with CDRs at the tips.
function Antibody({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} fill="none" strokeLinecap="round">
    <path d="M -5 55 L -5 2 L -42 -39 M 5 55 L 5 2 L 42 -39" stroke={BLUE} strokeWidth={9} />
    <path d="M -24 3 L -54 -28 M 24 3 L 54 -28" stroke={GREEN} strokeWidth={7} />
    <path d="M -42 -39 l -5 -5 M -54 -28 l -5 -5 M 42 -39 l 5 -5 M 54 -28 l 5 -5" stroke={ORANGE} strokeWidth={7} />
  </g>;
}
// AntibodyFormats: redrawn at textbook level (2026-11-05) — see ./redraws/AntibodyFormats.tsx; old code in archive/figures/2026-11-05/.

function SplitPool() {
  return <Svg h={345} label="חלוקה ואיחוד מושגיים עם שתי חלופות בכל אחד משני שלבים: A או B, אחר כך X או Y. נוצרים ארבעה צירופים אפשריים AX AY BX BY; כל חרוז מייצג תרכובת אחת באופן אידאלי.">
    <He x={200} y={25} size={16} bold>שתי חלופות בכל שלב: ארבעה צירופים</He>
    <Panel x={50} y={53} w={115} lines={["קבוצה A"]} /><Panel x={235} y={53} w={115} lines={["קבוצה B"]} color={ORANGE} />
    <Arrow x1={110} y1={97} x2={173} y2={132} color={BLUE} /><Arrow x1={290} y1={97} x2={227} y2={132} color={ORANGE} />
    <Panel x={125} y={142} w={150} lines={["איחוד וחלוקה"]} color={PURPLE} />
    <Arrow x1={174} y1={185} x2={112} y2={219} color={PURPLE} /><Arrow x1={226} y1={185} x2={288} y2={219} color={PURPLE} />
    <La x={110} y={246} size={16}>AX · BX</La><La x={290} y={246} size={16}>AY · BY</La>
    <He x={110} y={271} size={14}>הוספת X</He><He x={290} y={271} size={14}>הוספת Y</He>
    <He x={200} y={309} size={14}>האפשרויות אינן מבטיחות ייצוג מלא</He>
    <He x={200} y={334} size={13} color={MUTED}>סכמת ספרייה, לא הוראות סינתזה</He>
  </Svg>;
}

function HitValidation() {
  return <Svg h={330} label="מועמד ראשוני עובר אימות זהות, בדיקה בנפרד, מדידה בלתי תלויה ובדיקת פעילות. כל שלב בודק שאלה שונה; היעדר אימות אינו מתוקן באמצעות שיעור העשרה גבוה.">
    <He x={200} y={24} size={16} bold>מנתון על תערובת למולקולה מאומתת</He>
    {[{y:45,s:"זהות וטוהר"},{y:111,s:"בדיקה בנפרד"},{y:177,s:"מדידה בלתי תלויה"},{y:243,s:"פעילות תלויה במטרה"}].map((v,i) => <g key={v.s}>
      <Panel x={65} y={v.y} w={270} lines={[v.s]} color={i === 3 ? GREEN : BLUE} />
      {i < 3 && <Arrow x1={200} y1={v.y + 42} x2={200} y2={v.y + 62} color={INK} />}
    </g>)}
    <He x={200} y={319} size={14} color={MUTED}>גם הצלחה כאן אינה הוכחת תועלת באדם</He>
  </Svg>;
}

function Sandwich() {
  return <Svg h={345} label="מבחן sandwich: נוגדן לכידה מקובע תופס אנטיגן, ונוגדן מזהה הנקשר לאתר אחר נושא חיווי. שני האתרים צריכים להיות נגישים בו-זמנית. ציור מושגי של החיווי, לא יחס גדלים אמיתי.">
    <He x={200} y={25} size={16} bold>קישור בשני אתרים ← חיווי</He>
    <line x1={45} y1={271} x2={355} y2={271} stroke={MUTED} strokeWidth={5} />
    <Antibody x={145} y={210} scale={0.8} />
    <line x1={145} y1={254} x2={145} y2={271} stroke={MUTED} strokeWidth={2} />
    <path d="M 90 170 Q 76 146 95 130 Q 115 120 132 134 Q 155 120 173 141 Q 188 161 166 175 Q 140 184 107 175 Q 97 184 90 170 Z" fill="#ffedd5" stroke={ORANGE} strokeWidth={1.6} />
    <Antibody x={158} y={120} scale={-0.52} />
    <circle cx={158} cy={79} r={12} fill="#ede9fe" stroke={PURPLE} strokeWidth={1.5} />
    <La x={158} y={83} size={13} color={PURPLE}>E</La>
    <He x={289} y={67} size={15} color={PURPLE}>חיווי אנזימטי</He>
    <He x={290} y={102} size={15} color={BLUE}>נוגדן מזהה</He>
    <He x={290} y={145} size={15} color={ORANGE}>אנטיגן</He>
    <He x={290} y={225} size={15} color={BLUE}>נוגדן לכידה</He>
    <He x={200} y={306} size={14}>הנוגדנים אינם מתחרים על אותו אתר</He>
    <He x={200} y={334} size={13} color={MUTED}>E: אנזים מדווח · סכמטי, לא בקנה מידה</He>
  </Svg>;
}

// Visual conventions: Alberts MBoC 7e, Figs. 20-22 (PDF p. 1220),
// 20-46 (1250), 24-45 (1433), 24-47 (1435): separate DNA/protein levels,
// opposed cell membranes, extracellular recognition and cytoplasmic signalling.
// Dates and process order below follow the course units. Domain shapes are schematic.
function FoundationsTimeline() {
  const events = [
    ["1970s", "דנ״א רקומביננטי", "ייצור חלבון אנושי בתא זר"],
    ["1975", "נוגדנים חד־שבטיים", "היברידומה: ייצור נוגדן משיבוט אחד"],
    ["1982", "אישור אינסולין רקומביננטי", "תרופה ראשונה מהנדסה גנטית"],
    ["1984", "פרס נובל: שיטת ההיברידומה", "לקהלר ולמילשטיין"],
    ["1985", "תצוגת פפטידים על פאג׳", "סמית: קישור בין תכונה למידע גנטי"],
    ["1986", "אישור הנוגדן הטיפולי הראשון", "נוגדן עכברי נגד דחיית שתל"],
    ["1990", "תצוגת מקטעי נוגדן על פאג׳", "קבוצת וינטר: ברירה מתוך ספרייה"],
    ["2018", "פרס נובל: אבולוציה ותצוגה", "ארנולד: אבולוציה מכוונת של אנזימים"],
  ];
  return <Svg h={745} label="ציר זמן לפי היחידה: דנ״א רקומביננטי בשנות השבעים, היברידומה ב־1975, אינסולין רקומביננטי ב־1982, נובל להיברידומה ב־1984, תצוגת פפטידים ב־1985, OKT3 ב־1986, תצוגת נוגדנים ב־1990 ונובל לאבולוציה מכוונת ותצוגה ב־2018. המרווחים אינם משכי זמן.">
    <He x={200} y={26} size={17} bold>תגליות שבנו את ארגז הכלים</He>
    <Arrow x1={105} y1={49} x2={105} y2={694} color={INK} />
    {events.map(([date, title, detail], i) => <g key={date}>
      <circle cx={105} cy={75 + i * 83} r={5} fill={INK} />
      <La x={50} y={80 + i * 83} size={15} bold>{date}</La>
      <He x={255} y={69 + i * 83} size={15} bold>{title}</He>
      <He x={255} y={93 + i * 83} size={13} color={MUTED}>{detail}</He>
      {date === "1986" && <La x={255} y={114 + i * 83} size={13}>OKT3 · anti-CD3</La>}
      {date === "2018" && <He x={255} y={114 + i * 83} size={13} color={MUTED}>סמית ווינטר: תצוגת פאג׳</He>}
    </g>)}
    <He x={200} y={728} size={13} color={MUTED}>סדר כרונולוגי · המרווחים אינם בקנה מידה</He>
  </Svg>;
}

function BcrAbl() {
  return <Svg h={625} label="טרנסלוקציה הדדית t(9;22): מקטע ABL מכרומוזום 9 מתאחה עם BCR בכרומוזום הנגזר 22, כרומוזום פילדלפיה. גן האיחוי מתבטא בחלבון BCR-ABL. חלק BCR מקדם אוליגומריזציה וזרחון הדדי של הקינאז, ולכן האיתות לשגשוג ולהישרדות נמשך ללא אות חיצוני.">
    <He x={200} y={25} size={17} bold>מטרנסלוקציה לקינאז פעיל תמיד</He>
    <La x={98} y={57} size={15}>9</La><La x={285} y={57} size={15}>22</La>
    <rect x={87} y={72} width={22} height={128} rx={9} fill="#e2e8f0" stroke={MUTED} />
    <rect x={274} y={72} width={22} height={99} rx={9} fill="#e2e8f0" stroke={MUTED} />
    <path d="M 88 109 H 108 M 275 97 H 295" stroke={INK} strokeWidth={3} />
    <rect x={87} y={161} width={22} height={28} fill={GREEN} />
    <rect x={274} y={126} width={22} height={20} fill={BLUE} />
    <La x={142} y={180} size={14} color={GREEN}>ABL</La><La x={330} y={141} size={14} color={BLUE}>BCR</La>
    <path d="M 76 153 H 120 M 263 149 H 307" stroke={ORANGE} strokeWidth={1.5} strokeDasharray="3 3" />
    <La x={200} y={221} size={16}>t(9;22)</La>
    <Arrow x1={200} y1={232} x2={200} y2={257} color={INK} />
    <He x={106} y={284} size={14}>הנגזר המשלים</He><He x={288} y={284} size={14} bold>כרומוזום פילדלפיה</He>
    <La x={106} y={306} size={13}>der(9)</La><La x={288} y={306} size={13}>der(22)</La>
    <rect x={96} y={318} width={20} height={101} rx={8} fill="#e2e8f0" stroke={MUTED} />
    <rect x={278} y={318} width={20} height={72} rx={8} fill="#e2e8f0" stroke={MUTED} />
    <path d="M 97 341 H 115 M 279 341 H 297" stroke={INK} strokeWidth={3} />
    <rect x={278} y={354} width={20} height={12} fill={BLUE} /><rect x={278} y={366} width={20} height={16} fill={GREEN} />
    <La x={345} y={373} size={12}>BCR-ABL</La>
    <He x={200} y={447} size={14}>גן האיחוי מתבטא בחלבון איחוי</He>
    <Arrow x1={288} y1={398} x2={288} y2={424} color={INK} />
    {[0, 1].map(i => <g key={i} transform={`translate(0 ${i * 32})`}>
      <rect x={91} y={473} width={66} height={22} rx={6} fill="#dbeafe" stroke={BLUE} />
      <rect x={157} y={473} width={153} height={22} rx={6} fill="#dcfce7" stroke={GREEN} />
      <La x={124} y={488} size={13}>BCR</La><La x={233} y={488} size={13}>ABL · kinase</La>
    </g>)}
    <path d="M 124 496 V 503" stroke={BLUE} strokeWidth={3} />
    <La x={333} y={506} size={13} color={GREEN}>P ↔ P</La>
    <He x={200} y={553} size={14}>צימוד חלבונים וזרחון הדדי ללא אות חיצוני</He>
    <He x={200} y={577} size={14} bold>איתות מתמשך לשגשוג ולהישרדות</He>
    <He x={200} y={604} size={12} color={MUTED}>כחול: חלק מה־BCR · ירוק: חלק מה־ABL</He>
    <He x={200} y={620} size={11} color={MUTED}>כתום מקווקו: אזור שבר · מבנים ואורכים סכמטיים</He>
  </Svg>;
}

// In every panel Fab faces the target above; Fc faces the effector below.
function AntibodyMechanisms() {
  const titles = ["חסימת איתות", "הרג בתיווך תא", "בליעת התא המסומן", "הרג בתיווך משלים", "נטרול מולקולה מופרשת"];
  const names = ["Signal blocking", "ADCC", "ADCP", "CDC", "Neutralization"];
  return <Svg h={1040} label="חמישה מנגנוני נוגדן: חסימת קולטן, ADCC באמצעות קולטן Fc בתא NK, ADCP באמצעות מקרופאג, CDC באמצעות גיוס משלים ל-Fc ויצירת נקבים, ונטרול מולקולה מופרשת. בכל הפאנלים זרועות Fab פונות למעלה אל המטרה, ו-Fc למטה אל מערכת האפקטור.">
    {titles.map((title, i) => <g key={title} transform={`translate(0 ${i * 194})`}>
      <rect x={12} y={9} width={376} height={183} rx={10} fill="white" stroke="#cbd5e1" />
      <He x={275} y={35} size={15} bold>{title}</He>
      <La x={275} y={57} size={14}>{names[i]}</La>
      {i < 4 ? <>
        <path d="M 40 62 Q 112 28 184 62 L 184 76 H 40 Z" fill="#fff7ed" />
        <path d="M 40 70 H 184 M 40 76 H 184" stroke={MUTED} strokeWidth={1.5} />
        <path d="M 90 71 V 91 H 98 M 135 71 V 91 H 127" fill="none" stroke={ORANGE} strokeWidth={4} />
        <He x={112} y={55} size={12}>תא מטרה</He>
      </> : <path transform="translate(0 6)" d="M 82 76 Q 87 60 101 68 Q 113 54 125 68 Q 143 60 145 78 Q 134 97 116 87 Q 94 97 82 76 Z" fill="#ffedd5" stroke={ORANGE} strokeWidth={1.5} />}
      <Antibody x={113} y={111} scale={0.43} />
      {i === 0 && <>
        <circle cx={52} cy={103} r={9} fill="#ffedd5" stroke={ORANGE} />
        <path d="M 67 103 H 76 M 78 96 V 110" stroke={INK} strokeWidth={2} />
        <He x={275} y={99} size={14}>הליגנד אינו נקשר</He>
        <He x={275} y={124} size={14}>הקולטן אינו מאותת</He>
        <He x={113} y={169} size={13}>חסימת אתר הקישור</He>
      </>}
      {i === 1 && <>
        <path d="M 72 183 V 161 Q 73 139 104 139 H 122 Q 153 139 154 161 V 183" fill="#f5f3ff" stroke={PURPLE} strokeWidth={1.5} />
        <path d="M 107 144 V 135 H 119 V 144" fill="none" stroke={PURPLE} strokeWidth={3} />
        <La x={113} y={170} size={15}>NK</La>
        <Arrow x1={51} y1={151} x2={51} y2={85} color={PURPLE} />
        <La x={275} y={99} size={14}>FcγR · CD16</La>
        <He x={275} y={125} size={14}>קישור לזנב הנוגדן</He>
        <He x={275} y={150} size={14}>שחרור גרנולות והרג</He>
      </>}
      {i === 2 && <>
        <path d="M 72 180 Q 40 155 57 103 Q 63 92 68 107 L 75 140 Q 113 155 151 140 L 159 107 Q 166 91 170 108 Q 186 159 154 180 Z" fill="#f5f3ff" stroke={PURPLE} strokeWidth={1.5} />
        <path d="M 107 145 V 135 H 119 V 145" fill="none" stroke={PURPLE} strokeWidth={3} />
        <He x={113} y={172} size={12}>מקרופאג</He>
        <La x={275} y={99} size={14}>FcγR</La>
        <He x={275} y={125} size={14}>זיהוי ציפוי הנוגדנים</He>
        <He x={275} y={150} size={14}>שליחת זרועות ובליעה</He>
      </>}
      {i === 3 && <>
        <path d="M 94 147 L 113 135 L 132 147 M 113 135 V 153" fill="none" stroke={PURPLE} strokeWidth={3} />
        <La x={113} y={174} size={13}>C1q</La>
        <Arrow x1={51} y1={149} x2={51} y2={88} color={PURPLE} />
        <rect x={158} y={67} width={13} height={12} rx={3} fill="white" stroke={PURPLE} strokeWidth={3} />
        <He x={275} y={99} size={14}>גיוס משלים ל־Fc</He>
        <He x={275} y={125} size={14}>מפל הפעלת המשלים</He>
        <He x={275} y={150} size={14}>נקבים בקרום וליזיס</He>
      </>}
      {i === 4 && <>
        <He x={275} y={99} size={14}>לכידת המולקולה</He>
        <He x={275} y={125} size={14}>מונעת הגעה לקולטן</He>
        <He x={113} y={172} size={12}>מטרה מסיסה, ללא תא מסומן</He>
      </>}
    </g>)}
    <He x={200} y={995} size={12} color={MUTED}>כחול: כבדה · ירוק: קלה · כתום: קישור ומטרה</He>
    <He x={200} y={1014} size={12} color={MUTED}>סגול: מערכת אפקטור · אפור כפול: קרום</He>
    <He x={200} y={1033} size={12} color={MUTED}>סכמטי · נוגדן אחד מייצג ציפוי נוגדנים רבים</He>
  </Svg>;
}

function Membrane({ x, y, w }: { x: number; y: number; w: number }) {
  return <g fill="none" stroke={MUTED} strokeWidth={1.5}><path d={`M ${x} ${y} h ${w} M ${x} ${y + 7} h ${w}`} /></g>;
}

function CarVsTcr() {
  return <Svg h={655} label="משמאל TCR טבעי מזהה פפטיד קצר המוצג על MHC-I; שרשראות CD3 הנלוות נושאות ITAMs בציטוזול. מימין CAR מהדור השני מזהה ישירות חלבון שלם על פני תא המטרה ללא תלות ב-MHC: scFv, מרווח, תחום חוצה ממברנה, תחום קו-סטימולטורי ו-CD3 זטא.">
    <La x={100} y={28} size={18} bold>TCR</La><La x={300} y={28} size={18} bold>CAR</La>
    <He x={100} y={54} size={15} bold>פפטיד על גבי מציג</He><He x={300} y={54} size={15} bold>חלבון שלם בפני התא</He>
    <La x={100} y={77} size={14}>peptide–MHC-I</La><He x={300} y={77} size={14}>זיהוי ישיר</He>
    <He x={100} y={111} size={13}>תא מטרה</He><He x={300} y={111} size={13}>תא מטרה</He>
    <Membrane x={18} y={124} w={164} /><Membrane x={218} y={124} w={164} />
    <path d="M 94 131 V 157 Q 72 159 73 179 H 118 Q 119 159 101 157 V 131" fill="#dbeafe" stroke={BLUE} strokeWidth={2} />
    <path d="M 80 181 Q 96 187 111 181" fill="none" stroke={ORANGE} strokeWidth={5} />
    <La x={151} y={157} size={12}>MHC-I</La>
    <He x={42} y={205} size={12} color={ORANGE}>פפטיד</He>
    <path d="M 290 131 V 149 Q 266 153 272 174 Q 271 193 291 192 Q 313 194 317 177 Q 326 154 300 149 V 131" fill="#ffedd5" stroke={ORANGE} strokeWidth={2} />
    <path d="M 85 244 V 217 Q 69 212 79 193 Q 91 185 95 203 Q 99 184 111 193 Q 123 212 106 217 V 244" fill="#dbeafe" stroke={BLUE} strokeWidth={2} />
    {[55, 135].map(x => <g key={x}><rect x={x - 6} y={238} width={12} height={35} rx={5} fill="#ede9fe" stroke={PURPLE} /><path d={`M ${x} 273 V 350`} stroke={PURPLE} strokeWidth={2} />{[308, 332].map(y => <rect key={y} x={x - 5} y={y} width={10} height={6} fill={PURPLE} />)}</g>)}
    <path d="M 86 244 V 292 M 106 244 V 292" stroke={BLUE} strokeWidth={4} />
    <ellipse cx={284} cy={211} rx={11} ry={18} fill="#dbeafe" stroke={BLUE} strokeWidth={2} />
    <ellipse cx={307} cy={211} rx={10} ry={18} fill="#dbeafe" stroke={BLUE} strokeWidth={2} />
    <path d="M 285 230 Q 296 242 307 230 M 296 236 V 274" fill="none" stroke={BLUE} strokeWidth={3} />
    <Membrane x={18} y={279} w={164} /><Membrane x={218} y={279} w={164} />
    <rect x={289} y={273} width={14} height={22} rx={4} fill="#e2e8f0" stroke={INK} />
    <path d="M 296 295 V 299 M 296 325 V 331" stroke={INK} strokeWidth={2} />
    <rect x={286} y={299} width={20} height={26} rx={4} fill="#dcfce7" stroke={GREEN} />
    <rect x={286} y={331} width={20} height={40} rx={4} fill="#ede9fe" stroke={PURPLE} />
    <La x={351} y={214} size={13}>scFv</La><He x={350} y={254} size={12}>מרווח</He>
    <He x={100} y={382} size={14}>הצד הפנימי של תא T</He><He x={300} y={399} size={14}>הצד הפנימי של תא T</He>
    <La x={100} y={419} size={14} color={PURPLE}>CD3 · ITAMs</La>
    <He x={100} y={443} size={13}>שרשראות איתות נלוות</He>
    <He x={300} y={437} size={13}>תחום חוצה ממברנה</He>
    <La x={300} y={463} size={14} color={GREEN}>CD28 / 4-1BB</La>
    <He x={300} y={484} size={13}>קו־סטימולציה</He>
    <La x={300} y={510} size={14} color={PURPLE}>CD3ζ · ITAMs</La>
    <Panel x={20} y={529} w={160} lines={["מחייב הצגת פפטיד", "על מולקולת מציג"]} />
    <Panel x={220} y={529} w={160} lines={["ללא תלות במציג", "מטרה חוץ־תאית"]} color={ORANGE} />
    <He x={200} y={613} size={12} color={MUTED}>כחול: זיהוי ומציג · כתום: אנטיגן · ירוק: אות נוסף</He>
    <He x={200} y={633} size={12} color={MUTED}>סגול: איתות · אפור כפול: קרום · סכמטי</He>
    <He x={200} y={650} size={11} color={MUTED}>חלבוני ההכרה נוגעים באנטיגן במרווח שבין התאים</He>
  </Svg>;
}

function CarGenerations() {
  return <Svg h={595} label="ארבעה דורות CAR עם חלק חוץ-תאי זהה. דור ראשון: CD3 זטא בלבד; שני: CD28 או 4-1BB ו-CD3 זטא; שלישי: שני תחומי קו-סטימולציה ו-CD3 זטא; רביעי: קולטן מהדור השני וגן נפרד נוסף, למשל לייצור ציטוקין מופרש. הגן הנוסף אינו תחום בזנב הקולטן.">
    <He x={200} y={25} size={16} bold>אותו זיהוי בחוץ — תוספות שונות בפנים</He>
    {[1, 2, 3, 4].map((gen, i) => <g key={gen} transform={`translate(${53 + i * 98} 0)`}>
      <He x={0} y={62} size={15} bold>{`דור ${gen}`}</He>
      <ellipse cx={-11} cy={108} rx={10} ry={18} fill="#dbeafe" stroke={BLUE} strokeWidth={1.5} />
      <ellipse cx={12} cy={108} rx={10} ry={18} fill="#dbeafe" stroke={BLUE} strokeWidth={1.5} />
      <path d="M -11 127 Q 0 140 12 127 M 0 134 V 172" fill="none" stroke={BLUE} strokeWidth={3} />
      <rect x={-7} y={168} width={14} height={24} rx={4} fill="#e2e8f0" stroke={INK} />
      {gen > 1 && <><rect x={-33} y={202} width={66} height={28} rx={5} fill="#dcfce7" stroke={GREEN} /><La x={0} y={221} size={12}>CD28</La></>}
      {gen === 3 && <><rect x={-33} y={238} width={66} height={28} rx={5} fill="#dcfce7" stroke={GREEN} /><La x={0} y={257} size={12}>4-1BB</La></>}
      <path d="M 0 192 V 202" stroke={INK} strokeWidth={2} />
      {gen > 1 && <path d="M 0 230 V 238" stroke={INK} strokeWidth={2} />}
      {gen === 3 && <path d="M 0 266 V 274" stroke={INK} strokeWidth={2} />}
      <rect x={-33} y={gen === 1 ? 202 : gen === 3 ? 274 : 238} width={66} height={34} rx={5} fill="#ede9fe" stroke={PURPLE} />
      <La x={0} y={gen === 1 ? 224 : gen === 3 ? 296 : 260} size={13}>CD3ζ</La>
      {gen === 4 && <>
        <rect x={-37} y={328} width={74} height={43} rx={7} fill="#fff7ed" stroke={ORANGE} />
        <He x={0} y={346} size={12}>גן נוסף</He><La x={0} y={363} size={12}>IL-12</La>
        <Arrow x1={0} y1={378} x2={0} y2={401} color={ORANGE} />
        <He x={0} y={423} size={12}>ציטוקין מופרש</He>
      </>}
    </g>)}
    <Membrane x={15} y={176} w={370} />
    <He x={152} y={351} size={13}>הזנב בתוך תא T</He>
    <He x={160} y={379} size={13}>בדור שני: CD28 או</He><La x={160} y={401} size={13}>4-1BB</La>
    <He x={200} y={464} size={14}>בדור רביעי: גן נלווה, לא הארכת זנב הקולטן</He>
    <He x={200} y={492} size={13}>מספר הדור אינו דירוג מוכח של יעילות</He>
    <He x={200} y={528} size={12} color={MUTED}>כחול: זיהוי ומרווח · ירוק: קו־סטימולציה</He>
    <He x={200} y={549} size={12} color={MUTED}>סגול: אות הפעלה · כתום: גן ותוצר נלווים</He>
    <He x={200} y={570} size={12} color={MUTED}>אפור כפול: קרום · סכמטי, לא בקנה מידה</He>
    <He x={200} y={590} size={11} color={MUTED}>הפרשה מוצגת כסמל; מעבר הציטוקין דרך הקרום אינו מפורט</He>
  </Svg>;
}

function CarWorkflow() {
  const steps = ["1 · אפרזה: איסוף מהמטופל", "2 · הפעלת תאי T", "3 · העברת גן באמצעות וקטור נגיפי", "4 · הרביית התאים", "5 · בדיקות שחרור המנה"];
  return <Svg h={685} label="ייצור אוטולוגי של CAR-T: אפרזה מהמטופל, הפעלה, העברת גן בווקטור נגיפי, הרבייה ובדיקות שחרור. בנפרד מהמנה, המטופל מקבל כימותרפיה ללימפו-דיפלציה לפני העירוי. המנה מוחזרת לאותו מטופל. הזמן מהאפרזה לעירוי הוא שבועות.">
    <He x={200} y={27} size={17} bold>מהמטופל — וחזרה לאותו מטופל</He>
    {steps.map((s, i) => <g key={s}>
      <Panel x={43} y={55 + i * 72} w={314} lines={[s]} />
      {i < 4 && <Arrow x1={200} y1={96 + i * 72} x2={200} y2={121 + i * 72} color={INK} />}
    </g>)}
    <He x={200} y={416} size={13}>זהות · סטריליות · חיוניות · ביטוי הקולטן</He>
    <Arrow x1={200} y1={429} x2={200} y2={459} color={BLUE} />
    <Panel x={39} y={469} w={145} lines={["מנת תאים", "מוכנה לעירוי"]} />
    <Panel x={216} y={469} w={145} lines={["6 · המטופל מקבל", "כימותרפיה מכינה"]} color={ORANGE} />
    <He x={288} y={553} size={12} color={ORANGE}>לימפו־דיפלציה בגוף</He>
    <Arrow x1={112} y1={540} x2={157} y2={579} color={BLUE} />
    <Arrow x1={288} y1={562} x2={247} y2={579} color={ORANGE} />
    <Panel x={74} y={590} w={252} lines={["7 · עירוי למטופל וניטור"]} color={GREEN} />
    <path d="M 35 76 H 21 V 610 H 64" fill="none" stroke={MUTED} strokeDasharray="4 4" />
    <He x={200} y={654} size={15} bold>זמן מהאפרזה לעירוי: שבועות</He>
    <He x={200} y={678} size={12} color={MUTED}>כחול: מנת תאים · כתום: הכנת המטופל · ירוק: עירוי</He>
  </Svg>;
}

function Checkpoints() {
  return <Svg h={710} label="משמאל: הנעה בקשרית לימפה, CD28 ו-CTLA-4 בתא T מתחרים על B7 בתא מציג אנטיגן. מימין: שלב אפקטורי ברקמת הגידול, PD-1 בתא T נקשר ל-PD-L1 בתא הגידול ומגייס SHP-2 שמכבה איתות TCR ו-CD28. IFN גמא המופרש מתא T משרה PD-L1 בתא הגידול.">
    <He x={100} y={26} size={16} bold>קשרית לימפה</He><He x={300} y={26} size={16} bold>רקמת הגידול</He>
    <He x={100} y={51} size={14}>שלב ההנעה</He><He x={300} y={51} size={14}>שלב הביצוע</He>
    <La x={100} y={73} size={13}>Priming</La><La x={300} y={73} size={13}>Effector</La>
    <path d="M 15 99 Q 100 79 185 99 V 140 H 15 Z" fill="#f8fafc" />
    <path d="M 215 99 Q 300 79 385 99 V 140 H 215 Z" fill="#fff7ed" />
    <He x={100} y={119} size={13}>תא מציג אנטיגן</He><He x={300} y={119} size={13}>תא גידול</He>
    <Membrane x={15} y={143} w={170} /><Membrane x={215} y={143} w={170} />
    <path d="M 100 150 V 174" stroke={BLUE} strokeWidth={5} />
    <rect x={84} y={174} width={32} height={19} rx={7} fill="#dbeafe" stroke={BLUE} />
    <La x={100} y={218} size={14} color={BLUE}>B7</La>
    <path d="M 48 294 V 254 Q 39 244 48 234 Q 58 225 65 237 L 65 252" fill="#dcfce7" stroke={GREEN} strokeWidth={2} />
    <path d="M 143 294 V 254 Q 133 244 143 234 Q 153 225 160 237 L 160 252" fill="#ffedd5" stroke={ORANGE} strokeWidth={2} />
    <Arrow x1={58} y1={226} x2={83} y2={196} color={GREEN} dashed />
    <Arrow x1={148} y1={226} x2={118} y2={196} color={ORANGE} dashed />
    <La x={54} y={324} size={13} color={GREEN}>CD28</La><La x={149} y={324} size={13} color={ORANGE}>CTLA-4</La>
    <Membrane x={15} y={287} w={170} /><Membrane x={215} y={287} w={170} />
    <path d="M 280 150 V 182" stroke={BLUE} strokeWidth={4} />
    <rect x={272} y={181} width={16} height={29} rx={7} fill="#dbeafe" stroke={BLUE} />
    <rect x={272} y={212} width={16} height={44} rx={7} fill="#ffedd5" stroke={ORANGE} />
    <path d="M 280 256 V 332" stroke={ORANGE} strokeWidth={3} />
    <La x={328} y={184} size={13} color={BLUE}>PD-L1</La><La x={326} y={247} size={13} color={ORANGE}>PD-1</La>
    <rect x={244} y={338} width={72} height={29} rx={7} fill="#ffedd5" stroke={ORANGE} />
    <La x={280} y={358} size={14}>SHP-2</La>
    <path d="M 280 368 V 389 M 267 389 H 293" stroke={ORANGE} strokeWidth={2} />
    <La x={300} y={416} size={14}>TCR / CD28</La><He x={300} y={440} size={13}>כיבוי האיתות</He>
    <He x={100} y={367} size={14}>תא T</He><He x={350} y={320} size={14}>תא T</He>
    <path d="M 366 337 H 378 V 132 H 336" fill="none" stroke={PURPLE} strokeWidth={1.5} markerEnd="url(#bfArrow)" />
    <La x={350} y={275} size={13} color={PURPLE}>IFN-γ</La>
    <He x={300} y={485} size={12} color={PURPLE}>מהתא אל הגידול: השראת הליגנד</He>
    <Panel x={18} y={401} w={164} lines={["תחרות על אותו ליגנד", "לבלם זיקה גבוהה יותר", "פחות אות שני"]} color={ORANGE} />
    <He x={100} y={527} size={13}>חצים מקווקווים: חלופות</He>
    <He x={100} y={549} size={13}>לקישור, לא קישור בו־זמני</He>
    <He x={300} y={527} size={13}>משוב מהתגובה החיסונית</He><He x={300} y={549} size={13}>מגביר את בלימת תא T</He>
    <He x={200} y={591} size={13}>מוצגים זוגות הבקרה בלבד; שאר הסינפסה הושמטה</He>
    <He x={200} y={622} size={12} color={MUTED}>כחול: ליגנדים · ירוק: קו־סטימולציה · כתום: בלימה</He>
    <He x={200} y={645} size={12} color={MUTED}>סגול: מסלול הפרשת ציטוקין · אפור כפול: קרום</He>
    <He x={200} y={676} size={13} color={MUTED}>סכמטי, לא בקנה מידה · מיקומים ושלבים טיפוסיים</He>
  </Svg>;
}

function Pcsk9Path() {
  return <Svg h={980} label="מגנטיקה לתרופה נגד PCSK9: משפחות עם הגברת תפקוד ו-LDL גבוה, ונשאי אובדן תפקוד עם LDL נמוך והגנה ממחלת לב. PCSK9 מופרש מהכבד, נקשר לקולטן LDL ומכוון אותו לפירוק בליזוזום במקום מחזור לקרום. נוגדן קושר PCSK9 מחוץ לתא; siRNA מצומד GalNAc נכנס להפטוציט דרך ASGPR ומדכא את ה-mRNA שלו. שתי הגישות משמרות קולטני LDL ומגבירות סילוק LDL מהדם.">
    <He x={200} y={26} size={17} bold>גנטיקה אנושית ← מנגנון ← תרופות</He>
    <rect x={16} y={48} width={368} height={123} rx={10} fill="white" stroke={BLUE} strokeWidth={1.5} />
    <He x={200} y={72} size={15} bold>עדויות משני הכיוונים</He>
    <La x={107} y={99} size={14}>GoF · 2003</La><La x={294} y={99} size={14}>LoF · 2005–2006</La>
    <He x={107} y={125} size={13}>משפחות עם פעילות מוגברת</He><He x={294} y={125} size={13}>נשאי אובדן תפקוד</He>
    <He x={107} y={151} size={13}>כולסטרול גבוה</He><He x={294} y={151} size={13}>כולסטרול נמוך והגנה לבבית</He>
    <Arrow x1={200} y1={178} x2={200} y2={205} color={INK} />
    <rect x={16} y={213} width={368} height={339} rx={10} fill="white" stroke={BLUE} strokeWidth={1.5} />
    <He x={200} y={238} size={15} bold>הגורל של קולטן ה־LDL בכבד</He>
    <La x={200} y={265} size={14}>Secreted PCSK9 → LDLR</La>
    <He x={105} y={287} size={13}>ללא קישור החלבון</He><He x={295} y={287} size={13}>עם קישור החלבון</He>
    <Membrane x={35} y={320} w={135} /><Membrane x={230} y={320} w={135} />
    {[100, 295].map(x => <g key={x}>
      <path d={`M ${x} 341 V 312 Q ${x - 19} 313 ${x - 17} 302 L ${x - 9} 295`} fill="none" stroke={BLUE} strokeWidth={4} />
      <Arrow x1={x} y1={353} x2={x} y2={382} color={INK} />
      <ellipse cx={x} cy={407} rx={39} ry={21} fill="#f8fafc" stroke={MUTED} />
      <path d={`M ${x} 417 V 405 Q ${x - 15} 405 ${x - 13} 397 L ${x - 7} 391`} fill="none" stroke={BLUE} strokeWidth={3} />
    </g>)}
    <circle cx={289} cy={303} r={7} fill="#ffedd5" stroke={ORANGE} /><circle cx={291} cy={398} r={6} fill="#ffedd5" stroke={ORANGE} />
    <path d="M 64 407 H 45 V 346 H 79" fill="none" stroke={GREEN} strokeWidth={2} markerEnd="url(#bfArrow)" />
    <He x={105} y={456} size={13} color={GREEN}>הקולטן ממוחזר לקרום</He>
    <He x={105} y={480} size={12}>לאחר שחרור חלקיק ה־LDL</He>
    <Arrow x1={295} y1={435} x2={295} y2={462} color={ORANGE} />
    <ellipse cx={295} cy={492} rx={50} ry={22} fill="#fff7ed" stroke={ORANGE} />
    <He x={295} y={497} size={13}>ליזוזום</He>
    <He x={295} y={537} size={13} color={ORANGE}>הקולטן נשלח לפירוק</He>
    <He x={105} y={529} size={12} color={MUTED}>הקרום שייך להפטוציט</He>
    <Arrow x1={200} y1={559} x2={200} y2={584} color={INK} />
    <rect x={16} y={592} width={368} height={300} rx={10} fill="white" stroke={GREEN} strokeWidth={1.5} />
    <He x={200} y={618} size={15} bold>שני פורמטים נגד אותה מטרה</He>
    <La x={106} y={648} size={14}>mAb</La><La x={292} y={648} size={14}>GalNAc–siRNA</La>
    <path d="M 106 713 V 686 L 88 669 M 106 686 L 124 669" fill="none" stroke={GREEN} strokeWidth={5} strokeLinecap="round" />
    <circle cx={125} cy={665} r={8} fill="#ffedd5" stroke={ORANGE} />
    <He x={106} y={742} size={13}>קישור לחלבון המופרש</He>
    <He x={106} y={765} size={13}>מחוץ לתא</He>
    <path d="M 270 662 H 295 M 270 667 H 295" stroke={GREEN} strokeWidth={2} />
    <path d="M 295 665 H 305 l 7 -6 M 305 665 h 9 M 305 665 l 7 6" fill="none" stroke={GREEN} strokeWidth={1.5} />
    <rect x={220} y={697} width={144} height={111} rx={18} fill="#f8fafc" stroke={MUTED} />
    <path d="M 281 690 V 682 H 296 V 690 M 289 690 V 708" fill="none" stroke={BLUE} strokeWidth={3} />
    <La x={332} y={690} size={11}>ASGPR</La>
    <Arrow x1={289} y1={714} x2={289} y2={734} color={GREEN} />
    <La x={289} y={752} size={13}>RISC</La>
    <path d="M 245 771 q 9 -8 18 0 t 18 0 M 298 771 q 9 -8 18 0 t 18 0" fill="none" stroke={GREEN} strokeWidth={2} />
    <path d="M 285 779 l 9 -16" stroke={ORANGE} strokeWidth={2} />
    <La x={292} y={796} size={12}>PCSK9 mRNA</La>
    <He x={292} y={828} size={13}>פירוק התעתיק בהפטוציט</He>
    <He x={292} y={850} size={13}>פחות ייצור והפרשת חלבון</He>
    <He x={200} y={880} size={14} bold>יותר קולטנים זמינים לסילוק LDL מהדם</He>
    <He x={200} y={922} size={12} color={MUTED}>כחול: קולטן ועדויות · כתום: חלבון ומסלול פירוק</He>
    <He x={200} y={945} size={12} color={MUTED}>ירוק: מחזור ועיכוב המטרה · אפור: קרום ותא כבד</He>
    <He x={200} y={971} size={12} color={MUTED}>מסלול מושגי מלמעלה למטה · לא בקנה מידה</He>
  </Svg>;
}

function PersonalizationLevels() {
  return <Svg h={645} label="שלוש רמות התאמה עולות: בחירת מטופלים לתרופה קיימת באמצעות אבחון נלווה; תרופה לתת-קבוצה מולקולרית נדירה וניסויי סל; תרופה הנבנית לאדם יחיד, כגון חיסון נאו-אנטיגני מבוסס mRNA, אנטי-סנס או עריכת גנים אישית. ככל שהקבוצה מצטמצמת, העלות למטופל נוטה לעלות והראיות הזמינות מצטמצמות. זהו סיכום איכותני, לא נתונים מדודים.">
    <He x={200} y={27} size={17} bold>שלוש רמות של התאמה אישית</He>
    <Arrow x1={29} y1={490} x2={29} y2={61} color={INK} />
    <rect x={51} y={52} width={328} height={173} rx={10} fill="white" stroke={BLUE} strokeWidth={1.5} />
    <He x={215} y={79} size={16} bold>3 · תרופה עבור אדם אחד</He>
    <He x={215} y={107} size={14}>חיסון ניאו־אנטיגני אישי</He><La x={215} y={127} size={13}>mRNA</La>
    <He x={215} y={153} size={14}>אוליגונוקלאוטיד אנטי־סנס</He><La x={215} y={173} size={13}>n-of-1 ASO</La>
    <He x={215} y={202} size={14}>עריכת גנים מותאמת לאדם</He>
    <rect x={51} y={251} width={328} height={109} rx={10} fill="white" stroke={BLUE} strokeWidth={1.5} />
    <He x={215} y={279} size={16} bold>2 · תת־קבוצה מולקולרית נדירה</He>
    <He x={215} y={308} size={14}>מטופלים מגידולים שונים, סמן משותף</He>
    <La x={215} y={338} size={14}>Basket trials</La>
    <rect x={51} y={386} width={328} height={109} rx={10} fill="white" stroke={BLUE} strokeWidth={1.5} />
    <He x={215} y={414} size={16} bold>1 · בחירה לתרופה קיימת</He>
    <He x={215} y={443} size={14}>בדיקה אבחונית נלווית</He>
    <La x={215} y={473} size={14}>HER2 · BCR-ABL · MSI-H</La>
    <He x={200} y={530} size={14} bold>בעלייה ברמות: פחות מטופלים בכל קבוצה</He>
    <He x={200} y={558} size={14}>עלות למטופל עולה · היקף הראיות מצטמצם</He>
    <He x={200} y={587} size={13}>קשה יותר להפיק ראיות מבוקרות ולהכליל מהן</He>
    <He x={200} y={618} size={12} color={MUTED}>מגמה איכותנית, ללא סולם כמותי או השוואת מחירים</He>
    <He x={200} y={638} size={12} color={MUTED}>דוגמאות אישיות כוללות טיפולים ניסיוניים</He>
  </Svg>;
}

export const DRUGS_FIGURES: Record<string, { el: () => ReactElement; captionHe: string }> = {
  "dg-foundations-timeline": { el: FoundationsTimeline, captionHe: "תגליות ואישורים לפי תאריכי היחידה: דנ״א רקומביננטי, היברידומות, אינסולין, נוגדן טיפולי ותצוגת פאג׳, לצד פרסי הנובל. סדר כרונולוגי; המרווחים אינם בקנה מידה של זמן." },
  "dg-bcr-abl": { el: BcrAbl, captionHe: "טרנסלוקציה הדדית בין כרומוזומים 9 ו־22 יוצרת את גן האיחוי BCR-ABL בכרומוזום פילדלפיה. צימוד חלבוני האיחוי מקדם פעילות קינאז ללא אות חיצוני. אזורי גנים, כרומוזומים וחלבונים סכמטיים ואינם בקנה מידה." },
  "dg-antibody-mechanisms": { el: AntibodyMechanisms, captionHe: "חסימת איתות, ADCC דרך תא NK וקולטן Fc, בליעה בידי מקרופאג, הפעלת משלים ונטרול מולקולה מסיסה. זרועות הקישור פונות תמיד אל המטרה וה־Fc אל האפקטור. סכמטי; נוגדן יחיד מייצג ציפוי רב־מולקולרי." },
  "dg-car-vs-tcr": { el: CarVsTcr, captionHe: "TCR מזהה פפטיד על MHC-I ומאותת דרך שרשראות CD3 נלוות. CAR מדור שני מזהה חלבון בפני התא ישירות, ומחבר זיהוי, קו־סטימולציה ו־CD3ζ בשרשרת מהונדסת. מבנים ויחסי גדלים סכמטיים." },
  "dg-car-generations": { el: CarGenerations, captionHe: "ארבעה דורות CAR עם חלק חוץ־תאי זהה: אות הפעלה בלבד, תוספת תחום קו־סטימולטורי אחד, שני תחומים, או קולטן דור שני עם גן נוסף. בדור רביעי הציטוקין הוא תוצר נלווה ולא חלק מזנב הקולטן. סכמטי; הדורות אינם סולם יעילות." },
  "dg-car-workflow": { el: CarWorkflow, captionHe: "התהליך האוטולוגי מאפרזה ועד עירוי חזרה לאותו מטופל נמשך שבועות. התאים עוברים הפעלה, העברת גן, הרבייה ובדיקות; הכימותרפיה המכינה ניתנת למטופל לפני העירוי. תרשים סדר מושגי, לא לוח זמנים מדוד." },
  "dg-checkpoints": { el: Checkpoints, captionHe: "בשלב ההנעה בקשרית הלימפה CTLA-4 מתחרה ב־CD28 על B7. בשלב הביצוע בגידול PD-1 מגייס SHP-2 ומדכא איתות; IFN-γ מתא T משרה PD-L1. סכמה של זוגות הבקרה בלבד, לא סינפסה מלאה ולא בקנה מידה." },
  "dg-pcsk9-path": { el: Pcsk9Path, captionHe: "עדויות גנטיות דו־כיווניות הובילו לעיכוב PCSK9. החלבון המופרש מכוון את קולטן LDL לפירוק במקום למחזור; נוגדן קושר את החלבון בחוץ, ו־siRNA מצומד GalNAc מדכא את תעתיקו בתא הכבד. מסלול סכמטי, ללא נתוני יעילות מדודים." },
  "dg-personalization-levels": { el: PersonalizationLevels, captionHe: "מבחירת מטופלים לתרופה קיימת, דרך תת־קבוצה מולקולרית וניסויי סל, ועד תרופה לאדם יחיד. צמצום הקבוצה נוטה להעלות עלות למטופל ולהגביל את הראיות. מגמה איכותנית להמחשה; דוגמאות הרמה האישית כוללות טיפולים ניסיוניים." },
  "dg-binding": { el: Binding, captionHe: "Kd נמוך נותן תפוסה גבוהה יותר באותו ריכוז חופשי במודל חד-אתרי. עקומות מחושבות להמחשה, ללא קביעה על עיכוב או תועלת טיפולית." },
  "dg-library-space": { el: LibrarySpace, captionHe: "המרחב התאורטי, מספר הדגימות ומספר הרצפים הייחודיים התקינים הם גדלים שונים. איור ונתונים להמחשה." },
  "dg-phage": { el: PhageDisplay, captionHe: "תצוגת פאג׳ חוטי שומרת שיוך בין חלבון קושר לזהותו הגנטית. מיון של חלקיקים אינו מחליף אימות בחלבון מסיס. סכמטי, לא בקנה מידה." },
  "dg-evolution-cycle": { el: EvolutionCycle, captionHe: "שונות ובחירה חוזרות לפי מדד מוגדר. ההליך עלול לברור גם הטיות ביטוי ומדידה, ואינו מבטיח שיפור בכל התכונות." },
  "dg-epistasis": { el: Epistasis, captionHe: "דוגמה מדומה: A ו-B מועילות בנפרד אך פוגעות יחד. השפעת מוטציה תלויה ברקע הרצף." },
  "dg-antibody-formats": { el: AntibodyFormats, captionHe: "IgG, Fab ו-scFv: מספר אתרי הקישור, התחומים הקבועים ו-Fc משתנים בין הפורמטים. scFv הוא שרשרת אחת המחברת שני תחומים. סכמטי, לא בקנה מידה." },
  "dg-split-pool": { el: SplitPool, captionHe: "חלוקה ואיחוד יוצרים צירופים שונים של אבני בניין. גודל המרחב התאורטי אינו מוכיח שכל תוצר נוצר או נדגם." },
  "dg-hit-validation": { el: HitValidation, captionHe: "כל שלב אימות משלים ראיה אחרת: זהות כימית, פעילות של מועמד יחיד, מדידה בלתי תלויה ותלות במטרה." },
  "dg-sandwich": { el: Sandwich, captionHe: "בבדיקת sandwich האנטיגן מקשר בין נוגדן לכידה לנוגדן מזהה. איור זה אינו הפורמט התחרותי של ניסוי Engvall המתואר ביחידה. סכמטי, לא בקנה מידה." },
};
