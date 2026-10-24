/* Figures for the RNA units (Technion 134151). Original schematic drawings — never copied from a textbook. Labels sit
   beside shapes and arrows, never on a line. Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, BLUE, GREEN, INK, MUTED, ORANGE, He, La } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

const PURPLE = "#7c3aed";
const RED = "#b91c1c";
const TEAL = "#0f766e";
const GOLD = "#a16207";
const PINK = "#be185d";
const FILL = { blue: "#dbeafe", green: "#dcfce7", orange: "#ffedd5", purple: "#ede9fe", yellow: "#fef3c7", gray: "#f1f5f9", red: "#fee2e2", sky: "#e0f2fe", teal: "#ccfbf1", pink: "#fce7f3" };

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
// A horizontal RNA/DNA segment drawn as a filled bar (no stroke line under labels).
const Seg = ({ x, y, w, fill, h = 12 }: { x: number; y: number; w: number; fill: string; h?: number }) => <rect x={x} y={y} width={w} height={h} rx={3} fill={fill} />;

// ── rn-rna-world ─────────────────────────────────────────────────────────────
function RnaStructure() {
  const stem = [0, 1, 2, 3, 4];
  const loop: [number, number][] = [[82, 60], [96, 46], [114, 42], [132, 46], [146, 60]];
  return (
    <Svg h={230} label="משמאל: RNA חד-גדילי מתקפל על עצמו — גדיל אחד עולה וחוזר, זוגות בסיסים יוצרים גבעול, ובקצה לולאה. מימין: הריבוז ב-RNA נושא קבוצת 2′-OH (אדום) — נוקלאופיל זמין לקטליזה, אבל גם הסיבה ש-RNA מתפרק בקלות; ב-DNA במקומה יש מימן בלבד.">
      {stem.map((i) => {
        const y = 80 + i * 26;
        return (
          <g key={i}>
            <rect x={92} y={y - 1.5} width={44} height={3} fill="#cbd5e1" />
            <circle cx={82} cy={y} r={10} fill={FILL.blue} stroke={BLUE} strokeWidth={1.2} />
            <circle cx={146} cy={y} r={10} fill={FILL.blue} stroke={BLUE} strokeWidth={1.2} />
            <La x={82} y={y + 3.5} size={9} bold>{["G", "C", "A", "U", "G"][i]}</La>
            <La x={146} y={y + 3.5} size={9} bold>{["C", "G", "U", "A", "U"][i]}</La>
          </g>
        );
      })}
      {loop.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={9} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.2} />
          <La x={x} y={y + 3.5} size={8.5} bold>{["A", "U", "U", "C", "G"][i]}</La>
        </g>
      ))}
      <La x={82} y={208} size={10} color={MUTED}>5′</La>
      <La x={146} y={208} size={10} color={MUTED}>3′</La>
      <He x={36} y={136} size={10} color={BLUE}>גבעול</He>
      <He x={190} y={40} size={10} color={ORANGE}>לולאה</He>
      <He x={114} y={226} size={9} color={MUTED}>זוג G-U ("wobble") — לא קנוני, נפוץ ב-RNA</He>

      <path d="M300 70 L340 50 L380 70 L366 116 L314 116 Z" fill={FILL.yellow} stroke={GOLD} strokeWidth={1.4} />
      <La x={340} y={92} size={10} color={GOLD}>ריבוז</La>
      <circle cx={366} cy={116} r={4} fill={GOLD} />
      <circle cx={314} cy={116} r={4} fill={GOLD} />
      <rect x={364} y={118} width={4} height={24} fill={RED} />
      <La x={366} y={158} size={11} bold color={RED}>2′-OH</La>
      <rect x={312} y={118} width={4} height={24} fill={GOLD} />
      <La x={314} y={158} size={11} bold color={GOLD}>3′-OH</La>
      <He x={340} y={188} size={9.5} color={RED}>נוקלאופיל לקטליזה — וגם תוקף את השרשרת</He>
      <He x={340} y={206} size={9.5} color={MUTED}>ב-DNA: 2′-H — יציב יותר</He>
    </Svg>
  );
}

function RibosomePtc() {
  return (
    <Svg h={250} label="הריבוזום: תת-היחידה הגדולה (למעלה) ותת-היחידה הקטנה (למטה) על ה-mRNA. שני tRNA באתרים P ו-A; הקשר הפפטידי נוצר במרכז הפפטידיל-טרנספראז, שהליבה הקטליטית שלו בנויה מ-rRNA. השרשרת החדשה יוצאת דרך מנהרה בתת-היחידה הגדולה.">
      <path d="M70 40 Q200 10 330 40 Q360 75 340 130 L60 130 Q40 75 70 40 Z" fill={FILL.sky} stroke="#0284c7" strokeWidth={1.4} />
      <path d="M80 144 Q200 132 320 144 Q338 180 300 200 L100 200 Q66 180 80 144 Z" fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <rect x={40} y={204} width={320} height={8} rx={4} fill={ORANGE} />
      <He x={34} y={212} size={9.5} anchor="end" color={ORANGE}>mRNA</He>
      <path d="M176 196 L176 118 L158 100" fill="none" stroke={PURPLE} strokeWidth={6} strokeLinecap="round" />
      <path d="M226 196 L226 118 L208 100" fill="none" stroke={TEAL} strokeWidth={6} strokeLinecap="round" />
      <La x={176} y={228} size={10} bold color={PURPLE}>P</La>
      <La x={226} y={228} size={10} bold color={TEAL}>A</La>
      <circle cx={190} cy={96} r={26} fill="none" stroke={RED} strokeWidth={1.2} strokeDasharray="4 3" />
      <circle cx={190} cy={96} r={5} fill={RED} />
      <path d="M190 70 Q194 50 188 34 Q184 22 194 12" fill="none" stroke={INK} strokeWidth={2} strokeDasharray="2 3" />
      <He x={376} y={84} size={9.5} anchor="start" color={RED}>המרכז הקטליטי (PTC)</He>
      <He x={376} y={100} size={9.5} anchor="start" color={RED}>ליבה קטליטית של rRNA</He>
      <Lead x1={372} y1={90} x2={216} y2={94} />
      <He x={376} y={30} size={9.5} anchor="start" color={MUTED}>מנהרת היציאה</He>
      <Lead x1={372} y1={28} x2={196} y2={26} />
      <He x={376} y={128} size={9.5} anchor="start" color="#0284c7">תת-יחידה גדולה</He>
      <He x={376} y={144} size={9} anchor="start" color="#0284c7">(23S rRNA)</He>
      <Lead x1={372} y1={130} x2={344} y2={118} />
      <He x={376} y={180} size={9.5} anchor="start" color={GREEN}>תת-יחידה קטנה</He>
      <Lead x1={372} y1={176} x2={330} y2={170} />
    </Svg>
  );
}

function Selex() {
  return (
    <Svg h={250} label="מחזור SELEX: ספרייה של 10¹⁴ ויותר RNA אקראיים; בחירה — רק מה שקושר את המטרה (או מבצע תגובה) נשמר; הגברה ב-RT-PCR עם מעט מוטציות; שעתוק חזרה ל-RNA — וסבב חדש. אחרי 8–15 סבבים מרצפים את המולקולות שנבחרו.">
      <Box2 x={170} y={14} w={140} h={44} fill={FILL.gray} stroke={MUTED} lines={["ספרייה אקראית", "10¹⁴–10¹⁵ RNA"]} />
      <Box2 x={330} y={100} w={130} h={44} fill={FILL.green} stroke={GREEN} lines={["בחירה:", "קושרים את המטרה"]} />
      <Box2 x={170} y={186} w={140} h={44} fill={FILL.orange} stroke={ORANGE} lines={["הגברה: RT-PCR", "(+ מוטציות)"]} />
      <Box2 x={20} y={100} w={130} h={44} fill={FILL.blue} stroke={BLUE} lines={["שעתוק", "חזרה ל-RNA"]} />
      <Arrow x1={312} y1={42} x2={370} y2={98} color={INK} />
      <Arrow x1={370} y1={146} x2={312} y2={196} color={INK} />
      <Arrow x1={168} y1={196} x2={110} y2={146} color={INK} />
      <Arrow x1={110} y1={98} x2={168} y2={46} color={INK} />
      <He x={240} y={116} size={10.5} bold>8–15 סבבים</He>
      <He x={240} y={134} size={9.5} color={MUTED}>← ריצוף ואפיון</He>
    </Svg>
  );
}

// ── rn-ribozymes ─────────────────────────────────────────────────────────────
function GroupISplicing() {
  const row = (y: number, ex1: number, intronStart: number, intronEnd: number, ex2Start: number, joined: boolean) => (
    <g>
      <Seg x={ex1} y={y} w={intronStart - ex1} fill={BLUE} />
      {!joined && <Seg x={intronStart + 4} y={y} w={intronEnd - intronStart - 8} fill="#fdba74" />}
      <Seg x={ex2Start} y={y} w={90} fill={GREEN} />
    </g>
  );
  return (
    <Svg h={262} label="שחבור עצמי של אינטרון מקבוצה I בשתי טרנס-אסטריפיקציות: (1) ה-3′-OH של גואנוזין חופשי תוקף את אתר השחבור ה-5′ — הגואנוזין מתחבר לקצה האינטרון והאקסון הראשון משתחרר עם 3′-OH; (2) ה-3′-OH של האקסון הראשון תוקף את אתר השחבור ה-3′ — האקסונים מתחברים והאינטרון משתחרר.">
      <He x={240} y={18} size={10.5} bold>1. גואנוזין חופשי תוקף את אתר ה-5′</He>
      {row(34, 40, 150, 330, 330, false)}
      <circle cx={160} cy={64} r={8} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />
      <La x={160} y={67.5} size={9} bold color={PURPLE}>G</La>
      <Arrow x1={160} y1={56} x2={152} y2={48} color={PURPLE} width={1.4} />
      <He x={178} y={78} size={9} anchor="start" color={PURPLE}>3′-OH של G</He>
      <He x={95} y={64} size={9.5} color={BLUE}>אקסון 1</He>
      <He x={240} y={64} size={9.5} color={ORANGE}>אינטרון</He>
      <He x={375} y={64} size={9.5} color={GREEN}>אקסון 2</He>

      <He x={240} y={110} size={10.5} bold>2. האקסון הראשון תוקף את אתר ה-3′</He>
      <Seg x={40} y={124} w={106} fill={BLUE} />
      <circle cx={162} cy={130} r={7} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />
      <Seg x={172} y={124} w={150} fill="#fdba74" />
      <Seg x={330} y={124} w={90} fill={GREEN} />
      <path d="M146 140 Q240 176 330 140" fill="none" stroke={BLUE} strokeWidth={1.4} markerEnd="url(#bfArrow)" />
      <He x={240} y={180} size={9} color={BLUE}>3′-OH של אקסון 1</He>

      <He x={240} y={212} size={10.5} bold>התוצרים</He>
      <Seg x={40} y={226} w={106} fill={BLUE} />
      <Seg x={146} y={226} w={90} fill={GREEN} />
      <circle cx={282} cy={232} r={7} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />
      <Seg x={292} y={226} w={140} fill="#fdba74" />
      <He x={140} y={256} size={9} color={MUTED}>אקסונים מחוברים</He>
      <He x={362} y={256} size={9} color={MUTED}>אינטרון ליניארי (עם G)</He>
    </Svg>
  );
}

function GroupIISpliceosome() {
  return (
    <Svg h={250} label="השוואה: אינטרון מקבוצה II משחבר את עצמו — 2′-OH של אדנוזין בנקודת ההסתעפות (בתחום D6) תוקף, ותחום D5 קושר שני יוני Mg²⁺ באתר הפעיל. בספלייסוזום — אותה כימיה: snRNA U2 ו-U6 יוצרים את האתר הפעיל עם שני יוני Mg²⁺, ו-U6 דומה במבנה ל-D5. בשניהם האינטרון יוצא כלסו.">
      <He x={120} y={18} size={11} bold color={ORANGE}>אינטרון מקבוצה II</He>
      <He x={360} y={18} size={11} bold color={PURPLE}>הספלייסוזום</He>
      <Box x={40} y={40} w={160} h={34} fill={FILL.orange} stroke={ORANGE} size={10}>D5 — שני יוני Mg²⁺</Box>
      <Box x={40} y={90} w={160} h={34} fill={FILL.orange} stroke={ORANGE} size={10}>D6 — אדנוזין להסתעפות</Box>
      <Box x={280} y={40} w={160} h={34} fill={FILL.purple} stroke={PURPLE} size={10}>U6 — שני יוני Mg²⁺</Box>
      <Box x={280} y={90} w={160} h={34} fill={FILL.purple} stroke={PURPLE} size={10}>U2 מזווג עם נקודת ההסתעפות</Box>
      <He x={240} y={62} size={14} bold color={MUTED}>≈</He>
      <He x={240} y={112} size={14} bold color={MUTED}>≈</He>
      <Box x={60} y={150} w={360} h={30} fill={FILL.gray} stroke={MUTED} size={10}>אותה כימיה: 2′-OH של A תוקף ← לסו ← אקסונים מחוברים</Box>
      <path d="M200 216 Q230 200 250 216 Q230 234 200 216 Z" fill="none" stroke={ORANGE} strokeWidth={2} />
      <line x1={250} y1={216} x2={300} y2={216} stroke={ORANGE} strokeWidth={2} />
      <He x={170} y={220} size={10} anchor="end" color={ORANGE}>לסו</He>
      <He x={240} y={246} size={9} color={MUTED}>בספלייסוזום — עוד יותר מ-100 חלבונים (פיגום, למשל Prp8)</He>
    </Svg>
  );
}

// ── rn-bacterial-rna ─────────────────────────────────────────────────────────
function Riboswitch() {
  const hair = (x: number, y: number, h: number, c: string) => <path d={`M${x} ${y} L${x} ${y - h} Q${x + 10} ${y - h - 14} ${x + 20} ${y - h} L${x + 20} ${y}`} fill="none" stroke={c} strokeWidth={4} strokeLinecap="round" />;
  return (
    <Svg h={250} label="ריבוסוויץ' שעוצר שעתוק: בלי המטבוליט, האפטמר פתוח ונוצר אנטי-טרמינטור — ה-RNA פולימראז ממשיך לשעתק את הגן. כשהמטבוליט נקשר לאפטמר, נוצר טרמינטור (גבעול ואחריו רצף U) — השעתוק נעצר לפני הגן.">
      <He x={120} y={20} size={11} bold color={GREEN}>בלי מטבוליט — הגן מבוטא</He>
      <He x={360} y={20} size={11} bold color={RED}>עם מטבוליט — השעתוק נעצר</He>
      <Seg x={20} y={130} w={200} fill="#fdba74" h={8} />
      {hair(40, 128, 40, BLUE)}
      {hair(110, 128, 30, GREEN)}
      <Seg x={260} y={130} w={110} fill="#fdba74" h={8} />
      {hair(280, 128, 40, BLUE)}
      {hair(330, 128, 34, RED)}
      <La x={362} y={124} size={9} bold color={RED}>UUUU</La>
      <circle cx={290} cy={74} r={6} fill={PURPLE} />
      <ellipse cx={226} cy={134} rx={14} ry={10} fill={FILL.gray} stroke={MUTED} strokeWidth={1.2} />
      <Arrow x1={242} y1={134} x2={256} y2={134} color={MUTED} width={1.2} />
      <ellipse cx={392} cy={134} rx={14} ry={10} fill={FILL.gray} stroke={MUTED} strokeWidth={1.2} />
      <He x={50} y={60} size={9.5} color={BLUE}>אפטמר</He>
      <He x={120} y={78} size={9.5} color={GREEN}>אנטי-טרמינטור</He>
      <He x={290} y={52} size={9.5} color={PURPLE}>מטבוליט</He>
      <He x={342} y={68} size={9.5} color={RED}>טרמינטור</He>
      <He x={120} y={170} size={10} color={GREEN}>הפולימראז ממשיך ← הגן משועתק</He>
      <He x={360} y={170} size={10} color={RED}>הפולימראז משתחרר ← אין גן</He>
      <He x={240} y={222} size={9.5} color={MUTED}>מנגנון אחר: הגבעול מסתיר את רצף שיין-דלגרנו ← אין תרגום</He>
    </Svg>
  );
}

function SrnaHfq() {
  const ring = (cx: number, cy: number) => [0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={cx + 16 * Math.cos((i * Math.PI) / 3)} cy={cy + 16 * Math.sin((i * Math.PI) / 3)} r={7} fill={FILL.purple} stroke={PURPLE} strokeWidth={1} />);
  return (
    <Svg h={240} label="sRNA בפעולת trans: החלבון Hfq (טבעת של שש תת-יחידות) מקרב sRNA ל-mRNA המטרה. כשה-sRNA מזווג עם האזור של רצף שיין-דלגרנו, הריבוזום לא נקשר וה-mRNA מפורק בידי RNase E (עיכוב). במקרים אחרים ה-sRNA פותח גבעול שמסתיר את רצף שיין-דלגרנו — ומאפשר תרגום (הפעלה).">
      <He x={120} y={20} size={11} bold color={RED}>עיכוב</He>
      <He x={360} y={20} size={11} bold color={GREEN}>הפעלה</He>
      <Seg x={20} y={100} w={200} fill="#fdba74" h={8} />
      <rect x={70} y={98} width={30} height={12} fill={RED} opacity={0.6} />
      <Seg x={60} y={78} w={50} fill={TEAL} h={8} />
      {ring(140, 60)}
      <He x={60} y={130} size={9} color={RED}>SD מכוסה</He>
      <He x={140} y={28} size={9.5} color={PURPLE}>Hfq</He>
      <He x={56} y={72} size={9.5} anchor="end" color={TEAL}>sRNA</He>
      <Box x={40} y={150} w={160} h={30} fill={FILL.red} stroke={RED} size={10}>RNase E מפרק</Box>
      <Arrow x1={120} y1={136} x2={120} y2={148} color={RED} width={1.2} />
      <Seg x={260} y={100} w={200} fill="#fdba74" h={8} />
      <path d="M300 98 L300 62 Q312 48 324 62 L324 98" fill="none" stroke={ORANGE} strokeWidth={4} />
      <Seg x={330} y={70} w={40} fill={TEAL} h={8} />
      {ring(410, 60)}
      <Box x={280} y={150} w={160} h={30} fill={FILL.green} stroke={GREEN} size={10}>ה-SD נחשף ← תרגום</Box>
      <Arrow x1={360} y1={124} x2={360} y2={148} color={GREEN} width={1.2} />
      <He x={240} y={214} size={9.5} color={MUTED}>דוגמאות: RyhB, MicF (עיכוב); DsrA על rpoS (הפעלה)</He>
    </Svg>
  );
}

// ── rn-pirna ─────────────────────────────────────────────────────────────────
function PirnaCluster() {
  const frags: [number, number, string][] = [[70, 30, "#c4b5fd"], [104, 22, "#fca5a5"], [130, 34, "#86efac"], [168, 26, "#fde68a"], [198, 30, "#fca5a5"], [232, 20, "#93c5fd"]];
  return (
    <Svg h={240} label="אשכול piRNA: אזור בגנום שמכיל שברים של טרנספוזונים רבים. הוא משועתק כ-RNA ארוך, שנחתך לקטעים קצרים — piRNA — שמשלימים לתעתיקי הטרנספוזונים. piRNA נגד טרנספוזון שנמצא באשכול מזהים את התעתיקים שלו מכל מקום בגנום ומשתיקים אותם.">
      <rect x={20} y={60} width={440} height={6} fill="#cbd5e1" />
      <rect x={60} y={52} width={200} height={22} rx={4} fill="none" stroke={INK} strokeWidth={1.2} strokeDasharray="5 3" />
      {frags.map(([x, w, c], i) => <rect key={i} x={x} y={56} width={w} height={14} fill={c} />)}
      <He x={160} y={40} size={10.5} bold>אשכול piRNA ("ארכיון")</He>
      <rect x={340} y={54} width={60} height={18} rx={3} fill="#fca5a5" />
      <He x={370} y={40} size={10} color={RED}>טרנספוזון פעיל</He>
      <Arrow x1={160} y1={80} x2={160} y2={108} color={INK} width={1.4} />
      <He x={170} y={98} size={9} anchor="start" color={MUTED}>שעתוק</He>
      <Seg x={60} y={112} w={200} fill="#ddd6fe" h={8} />
      <He x={60} y={136} size={9.5} anchor="start" color={MUTED}>קדם-piRNA ארוך</He>
      <Arrow x1={160} y1={140} x2={160} y2={164} color={INK} width={1.4} />
      {[70, 100, 130, 160, 190, 220].map((x, i) => <rect key={x} x={x} y={172} width={22} height={6} rx={2} fill={["#c4b5fd", "#fca5a5", "#86efac", "#fde68a", "#fca5a5", "#93c5fd"][i]} />)}
      <He x={160} y={198} size={9.5} color={PURPLE}>piRNA על Piwi</He>
      <Arrow x1={240} y1={176} x2={350} y2={90} color={RED} width={1.6} />
      <He x={380} y={130} size={10} color={RED}>זיהוי והשתקה</He>
      <He x={240} y={230} size={9.5} color={MUTED}>טרנספוזון חדש שנוחת באשכול ← piRNA נגדו בדור הבא</He>
    </Svg>
  );
}

function PingPong() {
  return (
    <Svg h={250} label="מחזור הפינג-פונג: Aub, טעון ב-piRNA אנטיסנס (עם U בעמדה 1), חותך תעתיק סנס של טרנספוזון; השבר הופך ל-piRNA סנס ונטען על Ago3 (עם A בעמדה 10). Ago3 חותך תעתיק אנטיסנס מהאשכול, ויוצר piRNA אנטיסנס חדש ל-Aub. כך התעתיקים של טרנספוזון פעיל מגבירים את ה-piRNA נגדו.">
      <Box2 x={30} y={30} w={150} h={46} fill={FILL.purple} stroke={PURPLE} lines={["Aub", "piRNA אנטיסנס (1U)"]} />
      <Box2 x={300} y={30} w={150} h={46} fill={FILL.teal} stroke={TEAL} lines={["תעתיק סנס", "של טרנספוזון"]} />
      <Box2 x={300} y={170} w={150} h={46} fill={FILL.orange} stroke={ORANGE} lines={["Ago3", "piRNA סנס (A10)"]} />
      <Box2 x={30} y={170} w={150} h={46} fill={FILL.gray} stroke={MUTED} lines={["תעתיק אנטיסנס", "מהאשכול"]} />
      <Arrow x1={182} y1={53} x2={298} y2={53} color={PURPLE} width={1.8} />
      <He x={240} y={44} size={9.5} color={PURPLE}>חיתוך</He>
      <Arrow x1={375} y1={78} x2={375} y2={168} color={TEAL} width={1.8} />
      <He x={384} y={128} size={9.5} anchor="start" color={TEAL}>השבר נטען</He>
      <Arrow x1={298} y1={193} x2={182} y2={193} color={ORANGE} width={1.8} />
      <He x={240} y={184} size={9.5} color={ORANGE}>חיתוך</He>
      <Arrow x1={105} y1={168} x2={105} y2={78} color={MUTED} width={1.8} />
      <He x={96} y={128} size={9.5} anchor="end" color={MUTED}>השבר נטען</He>
      <He x={240} y={124} size={10} bold>חפיפה של 10</He>
      <He x={240} y={242} size={9.5} color={MUTED}>טרנספוזון פעיל יותר ← יותר piRNA נגדו</He>
    </Svg>
  );
}

// ── rn-snorna ────────────────────────────────────────────────────────────────
function SnornaGuides() {
  return (
    <Svg h={260} label="שתי משפחות של snoRNA מדריכים. C/D: האזור המדריך, ממש לפני box D, מזווג עם ה-rRNA, והנוקלאוטיד ב-rRNA שמול העמדה החמישית לפני box D ממותל על ה-2′-OH בידי פיברילרין. H/ACA: גבעול עם כיס פנימי ששני צדיו מזווגים עם ה-rRNA, ובפתח הכיס נשאר U לא מזווג — דיסקרין הופך אותו לפסאודואורידין.">
      <He x={120} y={18} size={11} bold color={BLUE}>box C/D — מתילציה</He>
      <He x={360} y={18} size={11} bold color={ORANGE}>box H/ACA — פסאודואורידין</He>
      <Seg x={30} y={64} w={180} fill={FILL.gray} h={10} />
      <He x={36} y={56} size={9} anchor="start" color={MUTED}>rRNA</He>
      <Seg x={60} y={86} w={110} fill={FILL.blue} h={10} />
      <Seg x={170} y={86} w={30} fill={BLUE} h={10} />
      <La x={185} y={110} size={9} bold color={BLUE}>D</La>
      <Seg x={20} y={86} w={30} fill={BLUE} h={10} />
      <La x={35} y={110} size={9} bold color={BLUE}>C</La>
      <circle cx={140} cy={69} r={6} fill={RED} />
      <La x={140} y={50} size={9} bold color={RED}>Me</La>
      <He x={120} y={140} size={9.5}>הבסיס מול D+5 ממותל (2′-O)</He>
      <Box x={60} y={156} w={120} h={28} fill={FILL.blue} stroke={BLUE} size={10}>פיברילרין (+SAM)</Box>

      <path d="M300 200 L300 165 L320 155 L320 135 L300 125 L300 105" fill="none" stroke={ORANGE} strokeWidth={4} />
      <path d="M380 200 L380 165 L360 155 L360 135 L380 125 L380 105" fill="none" stroke={ORANGE} strokeWidth={4} />
      <path d="M300 105 Q340 55 380 105" fill="none" stroke={ORANGE} strokeWidth={4} />
      <Seg x={300} y={140} w={80} fill={FILL.gray} h={8} />
      <circle cx={340} cy={144} r={6} fill={GREEN} />
      <La x={340} y={170} size={10} bold color={GREEN}>U → Ψ</La>
      <He x={430} y={136} size={9} color={MUTED}>rRNA בכיס</He>
      <Box x={290} y={214} w={110} h={28} fill={FILL.orange} stroke={ORANGE} size={10}>דיסקרין</Box>
    </Svg>
  );
}

// ── rn-lncrna ────────────────────────────────────────────────────────────────
function LncrnaModes() {
  const P = [[20, 30], [250, 30], [20, 150], [250, 150]];
  const t = ["מנחה — מביא קומפלקס לאתר", "פיגום — מרכז כמה חלבונים", "פיתיון — שואב חלבון או miRNA", "פעולת השעתוק — לא הרצף"];
  return (
    <Svg h={276} label="דרכים שבהן lncRNA יכולים לפעול: מנחה — RNA מביא קומפלקס לאתר בכרומטין; פיגום — RNA מחזיק כמה חלבונים יחד; פיתיון — RNA קושר חלבון או miRNA ומונע ממנו לפעול; ופעולת השעתוק עצמה — הפולימראז שעובר בלוקוס משנה את הכרומטין, בלי קשר לרצף ה-RNA. אלה תוויות עזר, לא סיווג מוחלט.">
      {P.map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width={210} height={108} rx={10} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={1} />
          <He x={x + 105} y={y + 98} size={9.5} bold>{t[i]}</He>
        </g>
      ))}
      <rect x={40} y={86} width={170} height={6} fill="#cbd5e1" />
      <path d="M90 84 Q100 50 130 60 Q150 70 160 50" fill="none" stroke={PINK} strokeWidth={3} />
      <ellipse cx={160} cy={46} rx={18} ry={11} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />
      <path d="M280 80 Q330 40 380 80 Q400 96 420 80" fill="none" stroke={PINK} strokeWidth={3} />
      {[[290, 64], [340, 48], [400, 70]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={13} ry={9} fill={[FILL.blue, FILL.green, FILL.orange][i]} stroke={[BLUE, GREEN, ORANGE][i]} strokeWidth={1.2} />)}
      <path d="M50 200 Q100 170 150 200" fill="none" stroke={PINK} strokeWidth={3} />
      {[[80, 180], [120, 180]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={12} ry={8} fill={FILL.teal} stroke={TEAL} strokeWidth={1.2} />)}
      <rect x={160} y={196} width={50} height={6} fill="#cbd5e1" />
      <He x={185} y={186} size={8.5} color={MUTED}>המטרה פנויה</He>
      <rect x={270} y={206} width={170} height={6} fill="#cbd5e1" />
      <ellipse cx={330} cy={200} rx={16} ry={10} fill={FILL.gray} stroke={MUTED} strokeWidth={1.2} />
      <Arrow x1={348} y1={200} x2={400} y2={200} color={MUTED} width={1.4} />
      <He x={330} y={180} size={8.5} color={MUTED}>RNA פולימראז</He>
    </Svg>
  );
}

function Xist() {
  const dots: [number, number][] = [];
  for (let y = 48; y <= 212; y += 12) for (const dx of [-12, 0, 12]) dots.push([120 + dx + ((y / 12) % 2 ? 4 : -4), y]);
  return (
    <Svg h={250} label="השתקת X: Xist מבוטא מה-X שיושתק ומצפה אותו ב-cis (נקודות ורודות). דרך אזור A-repeat הוא מגייס את SPEN, שמביא דה-אצטילאז (HDAC3) — השתקה ראשונית; דרך אזורים אחרים — חלבוני Polycomb (PRC1, PRC2), ובהמשך מתילציית DNA. ה-X השני נשאר פעיל, ושם מבוטא Tsix שמדכא את Xist.">
      <rect x={100} y={40} width={40} height={180} rx={18} fill={FILL.gray} stroke={MUTED} strokeWidth={1.4} />
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill={PINK} opacity={0.75} />)}
      <He x={120} y={238} size={10} bold color={PINK}>X מושתק (Xi)</He>
      <rect x={330} y={40} width={40} height={180} rx={18} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <He x={350} y={238} size={10} bold color={GREEN}>X פעיל (Xa)</He>
      <Box x={180} y={50} w={110} h={30} fill={FILL.pink} stroke={PINK} size={10}>Xist (A-repeat)</Box>
      <Box x={180} y={100} w={110} h={30} fill={FILL.purple} stroke={PURPLE} size={10}>SPEN ← HDAC3</Box>
      <Box x={180} y={150} w={110} h={30} fill={FILL.blue} stroke={BLUE} size={10}>PRC1, PRC2</Box>
      <Arrow x1={235} y1={82} x2={235} y2={98} color={INK} width={1.2} />
      <Arrow x1={178} y1={115} x2={146} y2={115} color={INK} width={1.2} />
      <Arrow x1={178} y1={165} x2={146} y2={165} color={INK} width={1.2} />
      <He x={235} y={204} size={9} color={MUTED}>ובהמשך: מתילציית DNA</He>
      <He x={420} y={130} size={9.5} color={GREEN} anchor="start">Tsix</He>
      <Lead x1={418} y1={126} x2={372} y2={120} />
    </Svg>
  );
}

function LncrnaTests() {
  return (
    <Svg h={250} label="איך בודקים lncRNA: לוקוס עם פרומוטור, גוף ה-lncRNA (שבתוכו אולי אלמנט DNA), וגן שכן G. כל התערבות פוגעת במשהו אחר: מחיקת הלוקוס — ב-RNA, בשעתוק ובאלמנט; מחיקת הפרומוטור — ב-RNA, בשעתוק וברצף DNA שעשוי להיות מבקר; פולי-A מוקדם — מקצר את השעתוק ואת ה-RNA באמצעות החדרת רצף ל-DNA; ASO — מכוון לפירוק RNA, אך עלול גם לגרום לסיום שעתוק מוקדם.">
      <Seg x={30} y={70} w={30} fill={FILL.gray} h={16} />
      <La x={45} y={60} size={9} color={MUTED}>P</La>
      <Seg x={62} y={70} w={220} fill="#f9a8d4" h={16} />
      <rect x={160} y={72} width={30} height={12} fill={GOLD} opacity={0.6} />
      <Seg x={330} y={70} w={110} fill="#86efac" h={16} />
      <He x={385} y={60} size={9.5} color={GREEN}>גן G</He>
      <He x={170} y={60} size={9.5} color={PINK}>lncRNA</He>
      <He x={175} y={112} size={8.5} color={GOLD}>אלמנט DNA?</He>
      <Arrow x1={70} y1={64} x2={130} y2={64} color={MUTED} width={1.2} />
      {([["מחיקת לוקוס", 30, 282, RED, 140], ["מחיקת פרומוטור", 30, 60, ORANGE, 166], ["פולי-A מוקדם", 90, 96, PURPLE, 192], ["ASO / פירוק", 62, 282, TEAL, 218]] as [string, number, number, string, number][]).map(([t, a, b, c, y]) => (
        <g key={t}>
          <rect x={a} y={y - 6} width={b - a} height={6} rx={3} fill={c} />
          <He x={300} y={y} size={9.5} anchor="start" color={c}>{t}</He>
        </g>
      ))}
      <He x={240} y={244} size={9} color={MUTED}>הפסים מראים איפה פועלת כל התערבות</He>
    </Svg>
  );
}

// ── rn-inheritance ───────────────────────────────────────────────────────────
function Generations() {
  return (
    <Svg h={240} label="למה צריך כמה דורות: בחשיפה של נקבה בהריון, נחשפים בבת אחת האם (F0), העובר (F1) ותאי המין שבתוך העובר (F2) — ולכן תורשה טרנס-דורית של ממש מתחילה ב-F3. בחשיפה של זכר, נחשפים האב (F0) והזרע שממנו נוצר F1 — ולכן מתחילים ב-F2.">
      <He x={130} y={20} size={11} bold color={PINK}>חשיפה של נקבה בהריון</He>
      <ellipse cx={130} cy={120} rx={100} ry={80} fill={FILL.pink} stroke={PINK} strokeWidth={1.4} />
      <ellipse cx={130} cy={130} rx={56} ry={44} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.4} />
      <circle cx={130} cy={140} r={16} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <La x={130} y={144} size={10} bold color={PURPLE}>F2</La>
      <La x={130} y={104} size={10} bold color={ORANGE}>F1</La>
      <La x={130} y={58} size={10} bold color={PINK}>F0</La>
      <He x={130} y={222} size={10} color={MUTED}>תורשה טרנס-דורית: F3 ומעלה</He>

      <He x={360} y={20} size={11} bold color={BLUE}>חשיפה של זכר</He>
      <ellipse cx={340} cy={110} rx={70} ry={60} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <La x={340} y={74} size={10} bold color={BLUE}>F0</La>
      <ellipse cx={340} cy={124} rx={12} ry={8} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.2} />
      <path d="M352 124 Q370 118 384 126" fill="none" stroke={ORANGE} strokeWidth={1.6} />
      <He x={340} y={150} size={9.5} color={ORANGE}>זרע ← F1</He>
      <He x={360} y={222} size={10} color={MUTED}>תורשה טרנס-דורית: F2 ומעלה</He>
    </Svg>
  );
}

function CelegansRnaiInheritance() {
  return (
    <Svg h={262} label="תורשת RNAi בתולעת C. elegans: dsRNA נחתך בידי Dicer ל-siRNA ראשוניים מעטים; RNA פולימראז תלוי RNA (RdRP) משתמש ב-mRNA המטרה כתבנית ומייצר הרבה 22G-RNA משניים; Argonaute גרעיני HRDE-1 עם 22G-RNA משתיק את הגן בשעתוק; לעתים נצבר גם H3K9me3, שאינו הכרחי בכל מערכת. 22G-RNA עוברים לצאצא דרך תאי המין, ושם מוגברים מחדש — המחזור נמשך כמה דורות.">
      <Box x={20} y={20} w={110} h={30} fill={FILL.gray} stroke={MUTED} size={10}>dsRNA</Box>
      <Box x={20} y={80} w={110} h={30} fill={FILL.blue} stroke={BLUE} size={10}>siRNA ראשוניים</Box>
      <Arrow x1={75} y1={52} x2={75} y2={78} color={INK} width={1.4} />
      <He x={84} y={70} size={9} anchor="start" color={MUTED}>Dicer</He>
      <Box2 x={180} y={70} w={130} h={50} fill={FILL.orange} stroke={ORANGE} lines={["RdRP על ה-mRNA", "← הרבה 22G-RNA"]} />
      <Arrow x1={132} y1={95} x2={178} y2={95} color={INK} width={1.4} />
      <Box2 x={350} y={70} w={110} h={50} fill={FILL.purple} stroke={PURPLE} lines={["HRDE-1 בגרעין", "השתקה בשעתוק"]} />
      <Arrow x1={312} y1={95} x2={348} y2={95} color={INK} width={1.4} />
      <rect x={20} y={150} width={440} height={4} fill="#cbd5e1" />
      <He x={110} y={146} size={9.5} color={MUTED}>תאי המין ← הדור הבא</He>
      <Box2 x={180} y={186} w={130} h={50} fill={FILL.orange} stroke={ORANGE} lines={["22G-RNA בצאצא", "מוגברים מחדש"]} />
      <Arrow x1={245} y1={122} x2={245} y2={184} color={ORANGE} width={1.8} />
      <Box x={350} y={196} w={110} h={30} fill={FILL.purple} stroke={PURPLE} size={10}>השתקה ב-F1, F2...</Box>
      <Arrow x1={312} y1={211} x2={348} y2={211} color={INK} width={1.4} />
      <He x={100} y={214} size={9} color={MUTED}>דועך אחרי 3–5 דורות</He>
    </Svg>
  );
}

export const RNA_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "rn-rna-structure": { el: RnaStructure, captionHe: "RNA מתקפל לגבעולים ולולאות, וקבוצת ה-2′-OH מאפשרת קטליזה — ובאותה מידה פירוק. סכמטי." },
  "rn-ribosome-ptc": { el: RibosomePtc, captionHe: "הריבוזום — ריבוזים: סביב מרכז הפפטידיל-טרנספראז יש רק rRNA (לפי מבני 2000). סכמטי, לא בקנה מידה." },
  "rn-selex": { el: Selex, captionHe: "אבולוציה במבחנה (SELEX). סכמטי." },
  "rn-group-i-splicing": { el: GroupISplicing, captionHe: "שחבור עצמי של אינטרון מקבוצה I (צ'ק, 1982). סכמטי." },
  "rn-group-ii-spliceosome": { el: GroupIISpliceosome, captionHe: "אינטרון מקבוצה II והספלייסוזום — אותה כימיה ואתר פעיל דומה. סכמטי." },
  "rn-riboswitch": { el: Riboswitch, captionHe: "ריבוסוויץ' שעוצר שעתוק. סכמטי." },
  "rn-srna-hfq": { el: SrnaHfq, captionHe: "sRNA בפעולת trans עם Hfq — עיכוב והפעלה. סכמטי." },
  "rn-pirna-cluster": { el: PirnaCluster, captionHe: "אשכול piRNA כארכיון של טרנספוזונים. סכמטי." },
  "rn-ping-pong": { el: PingPong, captionHe: "מחזור הפינג-פונג (ברנקה ועמיתים, 2007). סכמטי." },
  "rn-snorna-guides": { el: SnornaGuides, captionHe: "snoRNA מדריכים: C/D (מתילציה) ו-H/ACA (פסאודואורידילציה). סכמטי." },
  "rn-lncrna-modes": { el: LncrnaModes, captionHe: "דרכי פעולה מוצעות של lncRNA — תוויות עזר, לא סיווג מוחלט. סכמטי." },
  "rn-xist": { el: Xist, captionHe: "השתקת כרומוזום X בעזרת Xist. מפושט." },
  "rn-lncrna-tests": { el: LncrnaTests, captionHe: "התערבויות שונות בלוקוס של lncRNA פוגעות ברכיבים שונים — לכן צריך כמה שיטות. סכמטי." },
  "rn-generations": { el: Generations, captionHe: "דורות שנחשפים ישירות מול הדור הראשון שלא נחשף. סכמטי." },
  "rn-celegans-rnai-inheritance": { el: CelegansRnaiInheritance, captionHe: "תורשת RNAi בתולעת — הגברה בכל דור. מפושט." },
};
