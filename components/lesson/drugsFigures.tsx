/* Original figures for Technion 136014. Antibody reference: Alberts MBoC 7e,
   Fig. 24-23; protein/display concepts: the primary papers cited in each unit.
   Plots and illustrative numbers are generated here, not experimental data. */
import type { ReactElement, ReactNode } from "react";
import { ArrowDefs, BLUE, GREEN, INK, MUTED, ORANGE, He, La } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

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
function AntibodyFormats() {
  return <Svg h={360} label="השוואת IgG מלא עם שתי זרועות ו-Fc, Fab עם אתר קישור אחד ותחומים קבועים, ו-scFv המורכב מ-VH ו-VL המחוברים במקשר וללא Fc. צבע כחול מסמן שרשרת כבדה וירוק קלה ב-IgG וב-Fab; כתום מסמן אזורי קישור.">
    <La x={100} y={30} size={17} bold>IgG</La><Antibody x={100} y={110} />
    <La x={100} y={193} size={15} color={BLUE}>Fc</La>
    <La x={295} y={30} size={17} bold>Fab</La>
    <g transform="translate(285 110)" strokeLinecap="round" fill="none">
      <path d="M -8 49 V -37" stroke={BLUE} strokeWidth={10} /><path d="M 10 49 V -37" stroke={GREEN} strokeWidth={9} />
      <path d="M -8 -37 v -8 M 10 -37 v -8" stroke={ORANGE} strokeWidth={8} />
    </g>
    <He x={290} y={193} size={14}>ללא Fc · אתר אחד</He>
    <La x={70} y={250} size={17} bold>scFv</La>
    <ellipse cx={176} cy={245} rx={25} ry={19} fill="#dbeafe" stroke={BLUE} strokeWidth={1.4} />
    <ellipse cx={266} cy={245} rx={25} ry={19} fill="#dcfce7" stroke={GREEN} strokeWidth={1.4} />
    <path d="M 201 245 q 12 26 20 0 t 20 0" fill="none" stroke={MUTED} strokeWidth={2} />
    <La x={176} y={249} size={14}>VH</La><La x={266} y={249} size={14}>VL</La>
    <He x={220} y={290} size={14}>מקשר פפטידי · אתר קישור אחד</He>
    <He x={200} y={326} size={13} color={MUTED}>כחול: כבדה · ירוק: קלה · כתום: קצות הקישור</He>
    <He x={200} y={349} size={13} color={MUTED}>scFv: שני תחומים, שרשרת רציפה · סכמטי</He>
  </Svg>;
}

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

export const DRUGS_FIGURES: Record<string, { el: () => ReactElement; captionHe: string }> = {
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
