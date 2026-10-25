/* Figures for the ubiquitin units (Technion 134140). Original schematic drawings — never copied from a textbook.
   Labels sit beside shapes and arrows, never on a line. Referenced from lesson bodies as [[figure:<id>]]. */
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
// One ubiquitin: a small circle. Chains are drawn as touching circles so K48 (compact) and K63 (extended) differ by shape.
const Ub = ({ cx, cy, r = 9, fill = FILL.red, stroke = RED, label = "Ub" }: { cx: number; cy: number; r?: number; fill?: string; stroke?: string; label?: string }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={1.3} />
    <La x={cx} y={cy + r * 0.38} size={r * 0.85} bold color={stroke}>{label}</La>
  </g>
);
// Covalent bond between two ubiquitins (or substrate → ubiquitin), trimmed to the circle edges so the line never
// runs under the "Ub" label.
function Bond({ x1, y1, x2, y2, r1 = 8, r2 = 8 }: { x1: number; y1: number; x2: number; y2: number; r1?: number; r2?: number }) {
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 1;
  return <line x1={x1 + (dx / d) * r1} y1={y1 + (dy / d) * r1} x2={x2 - (dx / d) * r2} y2={y2 - (dy / d) * r2} stroke={INK} strokeWidth={1.6} />;
}

// A blob standing for a folded protein domain.
const Blob = ({ cx, cy, rx = 26, ry = 20, fill = FILL.gray, stroke = MUTED }: { cx: number; cy: number; rx?: number; ry?: number; fill?: string; stroke?: string }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth={1.4} />
);
// Unstructured tail — a wavy line, drawn away from any text.
const Tail = ({ x, y, len = 44, dir = 1 }: { x: number; y: number; len?: number; dir?: 1 | -1 }) => {
  const seg = len / 4;
  let d = `M ${x} ${y}`;
  for (let i = 0; i < 4; i++) d += ` q ${(seg / 2) * dir} ${i % 2 ? 7 : -7} ${seg * dir} 0`;
  return <path d={d} fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />;
};
const Lead = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={1} />;

// ── ub-conjugation ───────────────────────────────────────────────────────────
function Cascade() {
  return (
    <Svg h={250} label="מפל ההצמדה: E1 קושר ATP ויוביקוויטין ויוצר קשר תיואסטר עם הציסטאין שלו, תוך שחרור פירופוספט ו-AMP. היוביקוויטין עובר לציסטאין של E2, וה-E3 מקרב את E2 אל המצע ומעביר את היוביקוויטין לליזין במצע. התוצאה: שרשרת יוביקוויטין על המצע.">
      <Box2 x={24} y={56} w={92} h={46} fill={FILL.blue} stroke={BLUE} lines={["E1", "משפעל"]} size={11} />
      <Ub cx={70} cy={34} />
      <He x={70} y={122} size={9.5} color={MUTED}>קשר תיואסטר</He>
      <La x={70} y={136} size={9} color={MUTED}>E1~Ub</La>
      <La x={70} y={156} size={9.5} color={GOLD}>ATP → AMP + PPi</La>
      <Arrow x1={120} y1={79} x2={158} y2={79} color={INK} width={1.6} />
      <Box2 x={162} y={56} w={82} h={46} fill={FILL.green} stroke={GREEN} lines={["E2", "מצמיד"]} size={11} />
      <Ub cx={203} cy={34} />
      <La x={203} y={124} size={9} color={MUTED}>E2~Ub</La>
      <Arrow x1={248} y1={79} x2={286} y2={79} color={INK} width={1.6} />
      <Box2 x={290} y={46} w={92} h={66} fill={FILL.orange} stroke={ORANGE} lines={["E3", "מזהה מצע"]} size={11} />
      <Blob cx={420} cy={79} rx={32} ry={26} fill={FILL.yellow} stroke={GOLD} />
      <He x={420} y={83} size={11} bold>מצע</He>
      <Arrow x1={386} y1={79} x2={404} y2={79} color={ORANGE} width={1.6} />
      <Ub cx={420} cy={36} />
      <Ub cx={438} cy={22} />
      <Ub cx={456} cy={34} />
      <He x={420} y={126} size={9.5} color={MUTED}>ליזין במצע</He>
      <He x={420} y={140} size={9} color={MUTED}>קשר איזופפטידי</He>
      <rect x={24} y={176} width={432} height={56} rx={8} fill={FILL.sky} stroke={BLUE} strokeWidth={1.1} />
      <He x={444} y={196} size={10} anchor="end" bold color={BLUE}>ההיררכיה</He>
      <He x={444} y={214} size={10} anchor="end" color={INK}>שני E1 · עשרות E2 · מאות E3 — הספציפיות נקבעת בשלב ה-E3</He>
    </Svg>
  );
}

function E3Classes() {
  const row = (y: number, name: string, note: string, color: string, fill: string) => (
    <g>
      <Box x={388} y={y - 16} w={68} h={34} fill={fill} stroke={color} size={11} bold>{name}</Box>
      <He x={422} y={y + 32} size={9.5} color={MUTED}>{note}</He>
    </g>
  );
  return (
    <Svg h={300} label="שלוש משפחות E3. ב-RING היוביקוויטין עובר ישירות מה-E2 למצע וה-E3 משמש פיגום. ב-HECT היוביקוויטין עובר קודם לציסטאין של ה-E3 ורק ממנו למצע. ב-RBR תחום RING1 קושר את E2 אבל היוביקוויטין עובר דרך ציסטאין בתחום RING2 — שילוב של שתי הדרכים.">
      {/* RING */}
      <Box x={40} y={30} w={64} h={34} fill={FILL.green} stroke={GREEN} size={11}>E2</Box>
      <Ub cx={72} cy={16} r={8} />
      <Box x={136} y={30} w={74} h={34} fill={FILL.orange} stroke={ORANGE} size={11}>RING</Box>
      <Blob cx={290} cy={47} rx={30} ry={22} fill={FILL.yellow} stroke={GOLD} />
      <He x={290} y={51} size={10.5}>מצע</He>
      <Ub cx={290} cy={14} r={8} />
      <path d="M 100 34 Q 190 -2 278 22" fill="none" stroke={RED} strokeWidth={1.8} markerEnd="url(#bfArrow)" strokeDasharray="0" />
      <He x={190} y={84} size={9.5} color={RED}>היוביקוויטין עובר ישירות מ-E2 למצע</He>
      {row(47, "RING", "ללא ביניים קוולנטי", ORANGE, FILL.orange)}
      {/* HECT */}
      <Box x={40} y={136} w={64} h={34} fill={FILL.green} stroke={GREEN} size={11}>E2</Box>
      <Ub cx={72} cy={122} r={8} />
      <Box x={136} y={136} w={74} h={34} fill={FILL.purple} stroke={PURPLE} size={11}>HECT</Box>
      <Ub cx={173} cy={118} r={8} />
      <La x={173} y={104} size={9} color={PURPLE}>Cys</La>
      <Arrow x1={106} y1={146} x2={132} y2={132} color={RED} width={1.6} />
      <Blob cx={290} cy={153} rx={30} ry={22} fill={FILL.yellow} stroke={GOLD} />
      <He x={290} y={157} size={10.5}>מצע</He>
      <Ub cx={290} cy={120} r={8} />
      <Arrow x1={196} y1={124} x2={272} y2={124} color={RED} width={1.6} />
      <He x={196} y={186} size={9.5} anchor="start" color={RED}>שני שלבים — ה-E3 עצמו קטליטי</He>
      {row(153, "HECT", "ציסטאין קטליטי", PURPLE, FILL.purple)}
      {/* RBR */}
      <Box x={40} y={240} w={64} h={34} fill={FILL.green} stroke={GREEN} size={11}>E2</Box>
      <Ub cx={72} cy={226} r={8} />
      <Box x={122} y={240} w={56} h={34} fill={FILL.teal} stroke={TEAL} size={10}>RING1</Box>
      <Box x={186} y={240} w={56} h={34} fill={FILL.teal} stroke={TEAL} size={10}>RING2</Box>
      <Ub cx={214} cy={222} r={8} />
      <La x={214} y={208} size={9} color={TEAL}>Cys</La>
      <Arrow x1={106} y1={250} x2={118} y2={243} color={MUTED} width={1.4} />
      <Arrow x1={150} y1={232} x2={196} y2={228} color={RED} width={1.6} />
      <Blob cx={310} cy={257} rx={30} ry={22} fill={FILL.yellow} stroke={GOLD} />
      <He x={310} y={261} size={10.5}>מצע</He>
      <Ub cx={310} cy={224} r={8} />
      <Arrow x1={234} y1={224} x2={292} y2={224} color={RED} width={1.6} />
      {row(257, "RBR", "הכלאה", TEAL, FILL.teal)}
    </Svg>
  );
}

function Triage() {
  return (
    <Svg h={270} label="בקרת איכות: חלבון שהתקפל לא נכון חושף אזורים הידרופוביים. שפרון Hsp70 קושר אותם ומנסה לקפל מחדש במחזורים שצורכים ATP. ככל שהחלבון נשאר זמן רב יותר על השפרון, גדל הסיכוי ש-CHIP — שנקשר לקצה השפרון — יסמן אותו ביוביקוויטין וישלח אותו לפרוטאזום.">
      <Blob cx={66} cy={60} rx={34} ry={26} fill={FILL.red} stroke={RED} />
      <He x={66} y={56} size={10}>חלבון</He>
      <He x={66} y={70} size={10}>לא מקופל</He>
      <He x={66} y={106} size={9.5} color={RED}>אזורים הידרופוביים חשופים</He>
      <Arrow x1={104} y1={60} x2={140} y2={60} color={INK} width={1.6} />
      <Box2 x={144} y={34} w={96} h={52} fill={FILL.blue} stroke={BLUE} lines={["Hsp70", "קושר ומקפל"]} />
      <He x={192} y={104} size={9} color={MUTED}>מחזורים שצורכים ATP</He>
      {/* refold branch */}
      <Arrow x1={244} y1={46} x2={300} y2={28} color={GREEN} width={1.8} />
      <Box x={304} y={10} w={110} h={34} fill={FILL.green} stroke={GREEN} size={11} bold>התקפל — שוחרר</Box>
      <He x={272} y={16} size={9.5} color={GREEN}>מהר</He>
      {/* degrade branch */}
      <Arrow x1={244} y1={74} x2={300} y2={96} color={RED} width={1.8} />
      <He x={268} y={108} size={9.5} color={RED}>נשאר הרבה זמן</He>
      <Box2 x={304} y={78} w={110} h={48} fill={FILL.purple} stroke={PURPLE} lines={["CHIP (U-box)", "נקשר לקצה השפרון"]} />
      <Arrow x1={358} y1={130} x2={358} y2={162} color={PURPLE} width={1.6} />
      <Ub cx={340} cy={176} r={8} />
      <Ub cx={358} cy={190} r={8} />
      <Ub cx={376} cy={176} r={8} />
      <Arrow x1={358} y1={204} x2={358} y2={228} color={INK} width={1.6} />
      <Box x={296} y={230} w={124} h={32} fill={FILL.gray} stroke={INK} size={11} bold>פרוטאזום</Box>
      <rect x={24} y={150} width={240} height={100} rx={8} fill={FILL.sky} stroke={BLUE} strokeWidth={1.1} />
      <He x={252} y={172} size={10} anchor="end" bold color={BLUE}>ההיגיון</He>
      <He x={252} y={192} size={10} anchor="end">הזמן על השפרון הוא המדד:</He>
      <He x={252} y={210} size={10} anchor="end">חלבון שמתקפל מהר נמלט,</He>
      <He x={252} y={228} size={10} anchor="end">חלבון שנתקע — מסומן.</He>
    </Svg>
  );
}

// ── ub-code ──────────────────────────────────────────────────────────────────
function ChainTypes() {
  const Sub = ({ x, y, w = 86 }: { x: number; y: number; w?: number }) => (
    <g>
      <rect x={x} y={y} width={w} height={26} rx={6} fill={FILL.yellow} stroke={GOLD} strokeWidth={1.3} />
      <He x={x + w / 2} y={y + 17} size={10}>מצע</He>
    </g>
  );
  return (
    <Svg h={330} label="צורות הסימון. מונו-יוביקוויטין בודד; מולטי-מונו — יוביקוויטין בודד על כמה ליזינים; שרשרת K48 קומפקטית, שבה היוביקוויטינים צמודים זה לזה, היא האות הקלאסי לפרוטאזום; שרשרת K63 מוארכת כמו חרוזים על חוט ומשמשת לאיתות; שרשרת מסועפת נושאת שני ענפים מאותו יוביקוויטין.">
      {/* mono */}
      <Sub x={24} y={60} />
      <Ub cx={67} cy={40} r={9} />
      <He x={67} y={100} size={10} bold>מונו</He>
      <He x={67} y={116} size={9} color={MUTED}>היסטונים, PCNA</He>
      {/* multi-mono */}
      <Sub x={134} y={60} />
      <Ub cx={152} cy={40} r={9} />
      <Ub cx={177} cy={34} r={9} />
      <Ub cx={202} cy={40} r={9} />
      <He x={177} y={100} size={10} bold>מולטי-מונו</He>
      <He x={177} y={116} size={9} color={MUTED}>אנדוציטוזה</He>
      {/* K48 compact */}
      <Sub x={252} y={60} w={76} />
      <Bond x1={290} y1={62} x2={290} y2={42} r1={0} />
      <Bond x1={290} y1={42} x2={275} y2={27} />
      <Bond x1={275} y1={27} x2={296} y2={13} />
      <Ub cx={290} cy={42} r={8} />
      <Ub cx={275} cy={27} r={8} />
      <Ub cx={296} cy={13} r={8} />
      <He x={290} y={100} size={10} bold>K48</He>
      <He x={290} y={116} size={9} color={RED}>פרוטאזום</He>
      {/* K63 extended */}
      <Sub x={368} y={60} w={76} />
      <Bond x1={406} y1={62} x2={406} y2={48} r1={0} />
      <Bond x1={406} y1={48} x2={406} y2={30} />
      <Bond x1={406} y1={30} x2={406} y2={12} />
      <Ub cx={406} cy={48} r={8} />
      <Ub cx={406} cy={30} r={8} />
      <Ub cx={406} cy={12} r={8} />
      <He x={406} y={100} size={10} bold>K63</He>
      <He x={406} y={116} size={9} color={BLUE}>איתות, תיקון</He>
      {/* branched */}
      <Sub x={24} y={196} w={110} />
      <Bond x1={79} y1={198} x2={79} y2={178} r1={0} />
      <Bond x1={79} y1={178} x2={58} y2={158} />
      <Bond x1={79} y1={178} x2={100} y2={158} />
      <Ub cx={79} cy={178} r={8} />
      <Ub cx={58} cy={158} r={8} />
      <Ub cx={100} cy={158} r={8} />
      <He x={79} y={140} size={9} color={MUTED}>יוביקוויטין אחד נושא שניים</He>
      <He x={79} y={236} size={10} bold>מסועפת</He>
      <He x={79} y={252} size={9} color={MUTED}>K11/K48 — זיהוי יעיל</He>
      {/* M1 */}
      <Sub x={174} y={196} w={96} />
      <rect x={210} y={150} width={26} height={40} rx={5} fill={FILL.red} stroke={RED} strokeWidth={1.3} />
      <rect x={210} y={108} width={26} height={40} rx={5} fill={FILL.red} stroke={RED} strokeWidth={1.3} />
      <La x={223} y={174} size={9} bold color={RED}>Ub</La>
      <La x={223} y={132} size={9} bold color={RED}>Ub</La>
      <He x={223} y={236} size={10} bold>M1 — ליניארית</He>
      <He x={223} y={252} size={9} color={MUTED}>ראש לזנב, קשר פפטידי</He>
      <rect x={296} y={140} width={160} height={116} rx={8} fill={FILL.gray} stroke={MUTED} strokeWidth={1.1} />
      <He x={444} y={162} size={10} anchor="end" bold>לא טבלת מפתח</He>
      <He x={444} y={182} size={9.5} anchor="end">הסוג משנה את צורת השרשרת,</He>
      <He x={444} y={200} size={9.5} anchor="end">והצורה קובעת מי יזהה אותה.</He>
      <He x={444} y={220} size={9.5} anchor="end">גם שרשראות אחרות מובילות</He>
      <He x={444} y={238} size={9.5} anchor="end">לפירוק — תלוי בהקשר.</He>
      <He x={240} y={296} size={10} color={MUTED}>הקווים = קשרים קוולנטיים. K48 נארזת קומפקטית ו-K63 מוארכת — אריזה, לא קשר נוסף</He>
    </Svg>
  );
}

function WritersReadersErasers() {
  return (
    <Svg h={250} label="שלושת התפקידים סביב שרשרת היוביקוויטין: הכותבים — E2 ו-E3 שקובעים את סוג הקשר; הקוראים — חלבונים עם תחומים קושרי יוביקוויטין, שמשיגים קישור חזק בזכות אווידיות של כמה תחומים יחד; והמוחקים — דה-יוביקוויטינאזות שמעבדות, ממחזרות, עורכות ומצילות מצעים.">
      <Box x={176} y={100} w={128} h={38} fill={FILL.yellow} stroke={GOLD} size={11} bold>מצע מסומן</Box>
      <Ub cx={222} cy={82} r={8} />
      <Ub cx={240} cy={66} r={8} />
      <Ub cx={258} cy={82} r={8} />
      {/* writers */}
      <Box2 x={24} y={28} w={116} h={48} fill={FILL.green} stroke={GREEN} lines={["כותבים: E2 + E3", "קובעים סוג קשר"]} />
      <Arrow x1={144} y1={60} x2={196} y2={84} color={GREEN} width={1.6} />
      {/* readers */}
      <Box2 x={344} y={28} w={116} h={48} fill={FILL.blue} stroke={BLUE} lines={["קוראים: UBD", "UIM, UBA, NZF"]} />
      <Arrow x1={340} y1={60} x2={288} y2={84} color={BLUE} width={1.6} />
      <He x={402} y={94} size={9.5} color={BLUE}>קישור בודד — חלש</He>
      <He x={402} y={110} size={9.5} color={BLUE}>כמה תחומים יחד — חזק</He>
      <He x={402} y={126} size={9} color={MUTED}>(אווידיות)</He>
      {/* erasers */}
      <Box2 x={176} y={176} w={128} h={48} fill={FILL.purple} stroke={PURPLE} lines={["מוחקים: DUBs", "כ-100 באדם"]} />
      <Arrow x1={240} y1={172} x2={240} y2={144} color={PURPLE} width={1.6} />
      <He x={170} y={190} size={9.5} anchor="end" color={MUTED}>עיבוד · מחזור</He>
      <He x={170} y={206} size={9.5} anchor="end" color={MUTED}>עריכה · הצלה</He>
      <He x={320} y={196} size={9.5} anchor="start" color={MUTED}>המערכת הפיכה —</He>
      <He x={320} y={212} size={9.5} anchor="start" color={MUTED}>כמו זרחון</He>
    </Svg>
  );
}

// ── ub-proteasome ────────────────────────────────────────────────────────────
function ProteasomeArchitecture() {
  const ring = (y: number, fill: string, stroke: string, label: string, sub?: string) => (
    <g>
      <rect x={168} y={y} width={144} height={30} rx={4} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <La x={240} y={y + 20} size={12} bold color={stroke}>{label}</La>
      {sub && <He x={326} y={y + 20} size={9.5} anchor="start" color={MUTED}>{sub}</He>}
    </g>
  );
  return (
    <Svg h={360} label="חתך של הפרוטאזום 26S: הליבה 20S בנויה מארבע טבעות — אלפא, בטא, בטא, אלפא. טבעות הבטא הפנימיות נושאות שלושה סוגי אתרים פעילים, ובסך הכול שישה אתרים, שהנוקלאופיל בהם הוא תראונין. טבעות האלפא החיצוניות סוגרות את השער. מעל הליבה יושב המכסה 19S: טבעת של שש ATPases שפותחות את השער ופורשות את המצע, הקולטנים ליוביקוויטין, ו-Rpn11 שמסיר את השרשרת.">
      {/* cap */}
      <rect x={156} y={28} width={168} height={40} rx={10} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <He x={240} y={53} size={11} bold color={PURPLE}>מכסה (lid) — כולל Rpn11</He>
      <rect x={168} y={72} width={144} height={36} rx={6} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <He x={240} y={95} size={11} bold color={BLUE}>בסיס: 6 ATPases (Rpt1–6)</He>
      {ring(114, FILL.gray, INK, "α7", "זנבות ה-Rpt פותחים את השער")}
      {ring(146, FILL.orange, ORANGE, "β7", "β1 · β2 · β5 — אתרים פעילים")}
      {ring(178, FILL.orange, ORANGE, "β7", "הנוקלאופיל: תראונין בקצה N")}
      {ring(210, FILL.gray, INK, "α7", "במצב חופשי — השער סגור")}
      <g>
        <Lead x1={150} y1={48} x2={110} y2={48} />
        <He x={106} y={52} size={9.5} anchor="end" color={PURPLE}>DUB: מסיר שרשרת</He>
        <Lead x1={162} y1={90} x2={110} y2={100} />
        <He x={106} y={104} size={9.5} anchor="end" color={BLUE}>פרישה והשחלה (ATP)</He>
        <Lead x1={162} y1={128} x2={118} y2={150} />
        <He x={114} y={154} size={9.5} anchor="end">שער</He>
        <Lead x1={162} y1={180} x2={118} y2={196} />
        <He x={114} y={200} size={9.5} anchor="end" color={ORANGE}>חלל קטליטי סגור</He>
      </g>
      {/* substrate entering */}
      <Ub cx={382} cy={34} r={8} />
      <Ub cx={382} cy={16} r={8} />
      <Blob cx={404} cy={64} rx={22} ry={17} fill={FILL.yellow} stroke={GOLD} />
      <He x={404} y={68} size={9.5}>מצע</He>
      <path d="M 382 82 Q 352 94 320 94" fill="none" stroke={GOLD} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <path d="M 288 110 L 288 236" stroke={GOLD} strokeWidth={1.6} strokeDasharray="5 4" markerEnd="url(#bfArrow)" />
      <He x={430} y={14} size={9} color={GOLD}>השרשרת נשארת בחוץ</He>
      <He x={472} y={104} size={9.5} anchor="end" color={MUTED}>קולטנים:</He>
      <La x={472} y={118} size={9.5} anchor="end" color={MUTED}>Rpn10 · Rpn13 · Rpn1</La>
      {/* products */}
      <Arrow x1={240} y1={244} x2={240} y2={274} color={INK} width={1.6} />
      {[200, 224, 248, 272, 296].map((x, i) => <rect key={i} x={x} y={282 + (i % 2) * 12} width={18} height={7} rx={3} fill={FILL.teal} stroke={TEAL} strokeWidth={1} />)}
      <He x={178} y={298} size={10} anchor="end">אוליגופפטידים קצרים</He>
      <He x={240} y={330} size={9.5} color={MUTED}>סכמטי: חתך לאורך, לא בקנה מידה</He>
    </Svg>
  );
}

function ProteasomeCycle() {
  const step = (x: number, n: string, t1: string, t2: string) => (
    <g>
      <circle cx={x} cy={30} r={13} fill={FILL.blue} stroke={BLUE} strokeWidth={1.3} />
      <La x={x} y={35} size={12} bold color={BLUE}>{n}</La>
      <He x={x} y={62} size={10} bold>{t1}</He>
      <He x={x} y={78} size={9.5} color={MUTED}>{t2}</He>
    </g>
  );
  return (
    <Svg h={250} label="מחזור הפירוק בחמישה שלבים: קישור השרשרת לקולטן — שלב הפיך; היתפסות של אזור לא מקופל בטבעת ה-ATPases, שהיא נקודת ההחלטה; הסרת השרשרת בידי Rpn11 ומחזור היוביקוויטין; פרישה והשחלה בעזרת ATP; ופירוק לפפטידים. מתחת: מצע מסומן שאין לו אזור לא מקופל נקשר ומשתחרר בלי להתפרק.">
      {step(60, "1", "קישור", "הפיך")}
      {step(166, "2", "היתפסות", "נקודת ההחלטה")}
      {step(272, "3", "הסרת שרשרת", "Rpn11 — ממחזר")}
      {step(378, "4", "פרישה והשחלה", "ATP")}
      <Arrow x1={82} y1={30} x2={142} y2={30} color={INK} width={1.5} />
      <Arrow x1={190} y1={30} x2={248} y2={30} color={INK} width={1.5} />
      <Arrow x1={296} y1={30} x2={354} y2={30} color={INK} width={1.5} />
      <Arrow x1={420} y1={30} x2={452} y2={30} color={INK} width={1.5} />
      <He x={458} y={62} size={10} anchor="end" bold>פפטידים</He>
      {/* the two requirements */}
      <rect x={24} y={104} width={432} height={62} rx={8} fill={FILL.sky} stroke={BLUE} strokeWidth={1.1} />
      <He x={444} y={126} size={10.5} anchor="end" bold color={BLUE}>שני תנאים</He>
      <He x={444} y={146} size={10} anchor="end">שרשרת יוביקוויטין לקישור · אזור התחלה לא מקופל לתפיסה</He>
      {/* failed substrate */}
      <Blob cx={92} cy={206} rx={30} ry={22} fill={FILL.yellow} stroke={GOLD} />
      <He x={92} y={210} size={10}>מקופל לגמרי</He>
      <Ub cx={92} cy={176} r={8} />
      <Ub cx={110} cy={186} r={8} />
      <Arrow x1={128} y1={206} x2={172} y2={206} color={MUTED} width={1.5} />
      <He x={236} y={198} size={10} color={RED}>נקשר ומשתחרר — בלי פירוק</He>
      <He x={236} y={216} size={9.5} color={MUTED}>ה-DUBs מסירים את השרשרת</He>
      {/* with tail */}
      <Blob cx={404} cy={206} rx={26} ry={20} fill={FILL.yellow} stroke={GOLD} />
      <Tail x={378} y={206} len={40} dir={-1} />
      <He x={404} y={210} size={9.5}>עם זנב</He>
      <He x={404} y={240} size={9.5} color={GREEN}>מתפרק</He>
    </Svg>
  );
}

// ── ub-like ──────────────────────────────────────────────────────────────────
function NeddylationCycle() {
  return (
    <Svg h={290} label="מחזור הנדילציה של ליגאז קולין-RING: הצמדת NEDD8 לקולין משנה את תנוחת תחום ה-RING ואת גמישותו ומגבירה מאוד את פעילות הליגאז. ה-CSN מסיר את NEDD8, ובמצב הלא נדילי נקשר CAND1 ומאפשר להחליף את קולטן המצע. בלי מחזור, ליגאז שנשאר פעיל מסמן את קולטן המצע של עצמו.">
      {/* neddylated, active */}
      <path d="M 70 70 L 70 190" stroke={GREEN} strokeWidth={10} strokeLinecap="round" />
      <He x={60} y={134} size={10} anchor="end" color={GREEN}>קולין</He>
      <circle cx={70} cy={56} r={11} fill={FILL.green} stroke={GREEN} strokeWidth={1.3} />
      <La x={70} y={60} size={8} bold color={GREEN}>N8</La>
      <Box x={92} y={44} w={56} h={26} fill={FILL.orange} stroke={ORANGE} size={10}>RING</Box>
      <Box x={16} y={196} w={108} h={30} fill={FILL.blue} stroke={BLUE} size={10}>קולטן מצע</Box>
      <Ub cx={126} cy={86} r={8} />
      <He x={70} y={252} size={10.5} bold color={GREEN}>נדילי — פעיל</He>
      <He x={70} y={268} size={9} color={MUTED}>תחום RING נעשה גמיש ונגיש יותר</He>
      {/* arrows */}
      <Arrow x1={160} y1={100} x2={236} y2={100} color={PURPLE} width={1.7} />
      <Box2 x={168} y={44} w={92} h={44} fill={FILL.purple} stroke={PURPLE} lines={["CSN", "מסיר NEDD8"]} />
      <Arrow x1={236} y1={176} x2={160} y2={176} color={GREEN} width={1.7} />
      <Box2 x={168} y={192} w={92} h={44} fill={FILL.green} stroke={GREEN} lines={["NAE + UBC12", "מצמידים NEDD8"]} />
      {/* un-neddylated */}
      <path d="M 320 70 L 320 190" stroke={MUTED} strokeWidth={10} strokeLinecap="round" />
      <Box x={296} y={38} w={110} h={28} fill={FILL.gray} stroke={MUTED} size={10}>CAND1</Box>
      <He x={320} y={252} size={10.5} bold color={MUTED}>לא נדילי — כבוי</He>
      <He x={320} y={268} size={9} color={MUTED}>CAND1 מאפשר החלפת קולטן</He>
      <Box x={274} y={196} w={92} h={28} fill={FILL.gray} stroke={MUTED} size={10}>קולטן יוצא</Box>
      <Box x={376} y={196} w={92} h={28} fill={FILL.sky} stroke={BLUE} size={10}>קולטן נכנס</Box>
      <Arrow x1={370} y1={210} x2={372} y2={210} color={BLUE} width={1.4} />
      <He x={458} y={120} size={9.5} anchor="end" color={RED}>בלי מחזור — הליגאז</He>
      <He x={458} y={136} size={9.5} anchor="end" color={RED}>מסמן את הקולטן שלו</He>
    </Svg>
  );
}

// ── ub-cell-cycle ────────────────────────────────────────────────────────────
function CycleLigases() {
  const X0 = 64, X1 = 456;
  const at = (f: number) => X0 + (X1 - X0) * f;
  return (
    <Svg h={290} label="ציר מחזור התא עם חלונות הפעילות של שתי הליגאזות. משפחת SCF פועלת לאורך המחזור; זיהוי פוספודגרון הוא מנגנון תזמון אחד, לצד בקרה על הליגאז וקולטן המצע. APC/C פעיל מפרו-מטאפאזה ועד סוף G1, עם Cdc20 ואחר כך Cdh1, והתזמון נקבע ע״י הפעלת הליגאז עצמו.">
      <rect x={X0} y={54} width={X1 - X0} height={26} rx={6} fill={FILL.gray} stroke={MUTED} strokeWidth={1.2} />
      {[["G1", 0.12], ["S", 0.38], ["G2", 0.62], ["M", 0.85]].map(([t, f]) => <He key={t as string} x={at(f as number)} y={72} size={11} bold>{t as string}</He>)}
      {[0.26, 0.52, 0.74].map((f) => <line key={f} x1={at(f)} y1={54} x2={at(f)} y2={80} stroke={MUTED} strokeWidth={1} />)}
      {/* SCF band */}
      <rect x={X0} y={108} width={X1 - X0} height={22} rx={8} fill={FILL.blue} stroke={BLUE} strokeWidth={1.3} />
      <He x={X0 - 8} y={124} size={11} anchor="end" bold color={BLUE}>SCF</He>
      <He x={240} y={148} size={9.5} color={BLUE}>זיהוי פוספודגרון — בדוגמאות כאן</He>
      {/* substrates of SCF */}
      <He x={at(0.2)} y={98} size={9} color={MUTED}>p27</He>
      <He x={at(0.42)} y={98} size={9} color={MUTED}>ציקלין E</He>
      <He x={at(0.56)} y={98} size={9} color={MUTED}>Cdt1</He>
      {/* APC/C band */}
      <rect x={at(0.78)} y={178} width={X1 - at(0.78)} height={22} rx={8} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.3} />
      <rect x={X0} y={178} width={at(0.26) - X0} height={22} rx={8} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.3} />
      <He x={X0 - 8} y={194} size={11} anchor="end" bold color={ORANGE}>APC/C</He>
      <He x={at(0.9)} y={168} size={9} color={MUTED}>Cdc20</He>
      <He x={at(0.12)} y={168} size={9} color={MUTED}>Cdh1</He>
      <He x={240} y={222} size={9.5} color={ORANGE}>מופעל בזמן מסוים — הדגרון במצע קבוע</He>
      <rect x={40} y={238} width={400} height={38} rx={8} fill={FILL.sky} stroke={BLUE} strokeWidth={1.1} />
      <He x={428} y={262} size={10} anchor="end">פירוק הוא מעבר חד-כיווני: חלבון שפורק לא חוזר</He>
    </Svg>
  );
}

function SacApc() {
  return (
    <Svg h={300} label="נקודת הבקרה של ציר החלוקה. כשקינטוכור אינו מחובר, נבנה ה-MCC שלוכד את Cdc20 ומעכב את APC/C, ולכן סקיורין וציקלין B נשארים יציבים והתא ממתין. כשכל הקינטוכורים מחוברים, ה-MCC מתפרק, APC/C^Cdc20 פעיל, הסקיורין מתפרק, הספראז חותך את הקוהזין והכרומטידות נפרדות.">
      {/* left: unattached */}
      <He x={118} y={26} size={11.5} bold color={RED}>קינטוכור לא מחובר</He>
      <rect x={60} y={40} width={116} height={30} rx={6} fill={FILL.red} stroke={RED} strokeWidth={1.3} />
      <He x={118} y={60} size={10}>Mad2 משנה צורה</He>
      <Arrow x1={118} y1={74} x2={118} y2={100} color={RED} width={1.6} />
      <Box2 x={48} y={104} w={140} h={46} fill={FILL.red} stroke={RED} lines={["MCC", "Mad2 · BubR1 · Bub3 · Cdc20"]} />
      <Arrow x1={118} y1={154} x2={118} y2={180} color={RED} width={1.6} />
      <Box x={48} y={184} w={140} h={32} fill={FILL.gray} stroke={MUTED} size={10} bold>Cdc20 נלכד</Box>
      <Box x={48} y={230} w={140} h={46} fill={FILL.gray} stroke={MUTED} size={10}>APC/C כבוי — התא ממתין</Box>
      <line x1={240} y1={30} x2={240} y2={286} stroke={MUTED} strokeWidth={1} strokeDasharray="4 4" />
      {/* right: attached */}
      <He x={360} y={26} size={11.5} bold color={GREEN}>כל הקינטוכורים מחוברים</He>
      <rect x={302} y={40} width={116} height={30} rx={6} fill={FILL.green} stroke={GREEN} strokeWidth={1.3} />
      <He x={360} y={60} size={10}>ה-MCC מתפרק</He>
      <Arrow x1={360} y1={74} x2={360} y2={100} color={GREEN} width={1.6} />
      <Box2 x={290} y={104} w={140} h={46} fill={FILL.orange} stroke={ORANGE} lines={["APC/C + Cdc20", "מזהה D-box"]} />
      <Arrow x1={330} y1={154} x2={312} y2={180} color={ORANGE} width={1.6} />
      <Arrow x1={390} y1={154} x2={408} y2={180} color={ORANGE} width={1.6} />
      <Box x={252} y={184} w={116} h={30} fill={FILL.purple} stroke={PURPLE} size={10}>סקיורין מתפרק</Box>
      <Box x={374} y={184} w={96} h={30} fill={FILL.purple} stroke={PURPLE} size={10}>ציקלין B</Box>
      <Arrow x1={310} y1={218} x2={310} y2={240} color={PURPLE} width={1.5} />
      <Arrow x1={422} y1={218} x2={422} y2={240} color={PURPLE} width={1.5} />
      <Box2 x={248} y={244} w={124} h={44} fill={FILL.green} stroke={GREEN} lines={["ספראז חותך קוהזין", "← אנאפאזה"]} />
      <Box2 x={380} y={244} w={92} h={44} fill={FILL.green} stroke={GREEN} lines={["Cdk1 יורד", "← יציאה"]} />
    </Svg>
  );
}

// ── ub-transcription ─────────────────────────────────────────────────────────
function WntDestruction() {
  return (
    <Svg h={310} label="בטא-קטנין: בלי Wnt, קומפלקס ההרס על הפיגומים Axin ו-APC מזרחן אותו ברצף, נוצר פוספודגרון, SCF עם בטא-TrCP מסמן אותו והוא מתפרק. עם Wnt, הקולטנים מגייסים את הקומפלקס לממברנה ומעכבים אותו, בטא-קטנין מצטבר ועובר לגרעין שם הוא נקשר ל-TCF ומפעיל שעתוק.">
      {/* without Wnt */}
      <He x={118} y={26} size={11.5} bold>בלי Wnt</He>
      <rect x={34} y={40} width={168} height={74} rx={8} fill={FILL.gray} stroke={MUTED} strokeWidth={1.3} />
      <He x={118} y={60} size={10} bold>קומפלקס ההרס</He>
      <He x={118} y={78} size={9.5} color={MUTED}>Axin · APC (פיגומים)</He>
      <He x={118} y={96} size={9.5} color={MUTED}>CK1α ← GSK3β</He>
      <Arrow x1={118} y1={118} x2={118} y2={144} color={INK} width={1.6} />
      <Box2 x={48} y={148} w={140} h={46} fill={FILL.yellow} stroke={GOLD} lines={["β-קטנין מזורחן", "Ser33 · Ser37"]} />
      <Arrow x1={118} y1={198} x2={118} y2={222} color={INK} width={1.6} />
      <Box x={48} y={226} w={140} h={30} fill={FILL.orange} stroke={ORANGE} size={10} bold>SCF^β-TrCP</Box>
      <Arrow x1={118} y1={260} x2={118} y2={280} color={ORANGE} width={1.5} />
      <He x={118} y={296} size={10.5} bold color={RED}>פרוטאזום — הגנים כבויים</He>
      <line x1={240} y1={30} x2={240} y2={300} stroke={MUTED} strokeWidth={1} strokeDasharray="4 4" />
      {/* with Wnt */}
      <He x={360} y={26} size={11.5} bold>עם Wnt</He>
      <rect x={286} y={40} width={148} height={28} rx={6} fill={FILL.sky} stroke={BLUE} strokeWidth={1.3} />
      <He x={360} y={59} size={10}>Frizzled + LRP5/6</He>
      <Arrow x1={360} y1={72} x2={360} y2={94} color={BLUE} width={1.6} />
      <Box2 x={286} y={98} w={148} h={44} fill={FILL.gray} stroke={MUTED} lines={["הקומפלקס מגויס", "לממברנה ומעוכב"]} />
      <Arrow x1={360} y1={146} x2={360} y2={170} color={GREEN} width={1.6} />
      <Box x={296} y={174} w={128} h={30} fill={FILL.yellow} stroke={GOLD} size={10} bold>β-קטנין מצטבר</Box>
      <Arrow x1={360} y1={208} x2={360} y2={230} color={GREEN} width={1.6} />
      <rect x={280} y={234} width={160} height={58} rx={10} fill={FILL.green} stroke={GREEN} strokeWidth={1.3} />
      <He x={360} y={256} size={10} bold>בגרעין: β-קטנין + TCF</He>
      <He x={360} y={276} size={9.5} color={MUTED}>שעתוק: Myc, ציקלין D1</He>
      <He x={240} y={16} size={9.5} color={MUTED}>האות אינו מפעיל — הוא מפסיק להרוס</He>
    </Svg>
  );
}

function HistoneMarks() {
  const nucleosome = (cx: number, cy: number, stroke: string, fill: string) => (
    <g>
      <ellipse cx={cx} cy={cy} rx={34} ry={26} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <path d={`M ${cx - 46} ${cy - 16} Q ${cx} ${cy - 36} ${cx + 46} ${cy - 16}`} fill="none" stroke={INK} strokeWidth={2} />
      <path d={`M ${cx - 46} ${cy + 16} Q ${cx} ${cy + 36} ${cx + 46} ${cy + 16}`} fill="none" stroke={INK} strokeWidth={2} />
    </g>
  );
  return (
    <Svg h={300} label="אותו שינוי, שני מסרים הפוכים. משמאל: PRC1 מסמן את H2A על ליזין 119, הסימן מזוהה ע״י PRC2 שמוסיף מתילציה ל-H3K27 והגן מושתק. מימין: RNF20 ו-RNF40 עם RAD6A/B מסמנים את H2B על ליזין 120 בזמן הארכת השעתוק, והסימן מעודד מתילציה של H3K4 ו-H3K79, במיוחד דרגות מתילציה גבוהות.">
      {/* repressive */}
      <He x={118} y={28} size={11.5} bold color={PURPLE}>דיכוי</He>
      <Box x={48} y={40} w={140} h={28} fill={FILL.purple} stroke={PURPLE} size={10} bold>PRC1 (RING1B)</Box>
      <Arrow x1={118} y1={72} x2={118} y2={96} color={PURPLE} width={1.6} />
      {nucleosome(118, 134, PURPLE, FILL.purple)}
      <Ub cx={118} cy={100} r={8} />
      <La x={160} y={118} size={9.5} anchor="start" color={PURPLE}>H2A K119ub</La>
      <Arrow x1={118} y1={162} x2={118} y2={190} color={PURPLE} width={1.6} />
      <Box2 x={48} y={194} w={140} h={44} fill={FILL.purple} stroke={PURPLE} lines={["PRC2 קורא", "← H3K27me3"]} />
      <He x={118} y={262} size={10.5} bold color={PURPLE}>השתקה יציבה</He>
      <He x={118} y={280} size={9} color={MUTED}>מוסר ע"י BAP1</He>
      <line x1={240} y1={34} x2={240} y2={288} stroke={MUTED} strokeWidth={1} strokeDasharray="4 4" />
      {/* active */}
      <He x={360} y={28} size={11.5} bold color={GREEN}>שעתוק פעיל</He>
      <Box2 x={290} y={36} w={140} h={40} fill={FILL.green} stroke={GREEN} lines={["RNF20/40 + RAD6A/B", "עם Pol II בהארכה"]} />
      <Arrow x1={360} y1={80} x2={360} y2={96} color={GREEN} width={1.6} />
      {nucleosome(360, 134, GREEN, FILL.green)}
      <Ub cx={360} cy={100} r={8} />
      <La x={402} y={118} size={9.5} anchor="start" color={GREEN}>H2B K120ub</La>
      <Arrow x1={360} y1={162} x2={360} y2={190} color={GREEN} width={1.6} />
      <Box2 x={290} y={194} w={140} h={44} fill={FILL.green} stroke={GREEN} lines={["COMPASS · Dot1", "← H3K4me2/3 · H3K79me2/3"]} />
      <He x={360} y={262} size={10.5} bold color={GREEN}>דיבור בין היסטונים</He>
      <He x={360} y={280} size={9} color={MUTED}>מוסר ע"י USP22 (SAGA)</He>
    </Svg>
  );
}

// ── ub-genome ────────────────────────────────────────────────────────────────
function PcnaSwitch() {
  return (
    <Svg h={300} label="PCNA על ה-DNA ליד נזק: ליזין 164 אחד, שלוש החלטות. מונו-יוביקוויטין בידי Rad6 ו-Rad18 מגייס פולימראזות TLS שמעתיקות דרך הנזק, לעתים עם טעויות. הארכה לשרשרת K63 שולחת להחלפת תבנית, שהיא מדויקת. SUMO, בשמר, מגייס את ההליקאז Srs2 שמונע רקומבינציה לא רצויה.">
      <rect x={150} y={44} width={180} height={8} rx={4} fill="#cbd5e1" />
      <path d="M 236 36 l 8 8 l -8 8 l -8 -8 z" fill={RED} />
      <He x={244} y={30} size={9.5} anchor="start" color={RED}>נזק</He>
      <g>
        <circle cx={196} cy={48} r={22} fill="none" stroke={BLUE} strokeWidth={7} />
        <La x={196} y={84} size={10.5} bold color={BLUE}>PCNA</La>
      </g>
      <Ub cx={196} cy={14} r={9} />
      <La x={160} y={18} size={9.5} anchor="end" color={MUTED}>K164</La>
      <Lead x1={166} y1={22} x2={186} y2={20} />
      <He x={240} y={106} size={9.5} color={MUTED}>הפולימראז הרגיל נעצר · RPA על DNA חד-גדילי מגייס את Rad18</He>
      {/* three branches */}
      <Arrow x1={176} y1={122} x2={100} y2={152} color={ORANGE} width={1.6} />
      <Arrow x1={196} y1={122} x2={240} y2={152} color={GREEN} width={1.6} />
      <Arrow x1={216} y1={122} x2={384} y2={152} color={PURPLE} width={1.6} />
      <Box2 x={26} y={156} w={148} h={48} fill={FILL.orange} stroke={ORANGE} lines={["מונו-יוביקוויטין", "Rad6 + Rad18"]} />
      <Box2 x={178} y={156} w={124} h={48} fill={FILL.green} stroke={GREEN} lines={["שרשרת K63", "(בשמר: Rad5)"]} />
      <Box2 x={320} y={156} w={134} h={48} fill={FILL.purple} stroke={PURPLE} lines={["SUMO (בשמר)", "Ubc9 + Siz1"]} />
      <Arrow x1={100} y1={208} x2={100} y2={232} color={ORANGE} width={1.5} />
      <Arrow x1={240} y1={208} x2={240} y2={232} color={GREEN} width={1.5} />
      <Arrow x1={387} y1={208} x2={387} y2={232} color={PURPLE} width={1.5} />
      <Box2 x={26} y={236} w={148} h={48} fill={FILL.yellow} stroke={GOLD} lines={["סינתזה דרך הנזק", "מהיר, לעתים מוטגני"]} />
      <Box2 x={178} y={236} w={124} h={48} fill={FILL.yellow} stroke={GOLD} lines={["החלפת תבנית", "ללא שגיאות"]} />
      <Box2 x={320} y={236} w={134} h={48} fill={FILL.yellow} stroke={GOLD} lines={["Srs2 — מונע", "רקומבינציה"]} />
    </Svg>
  );
}

function DsbCascade() {
  const stepBox = (x: number, y: number, w: number, t1: string, t2: string, color: string, fill: string) => (
    <Box2 x={x} y={y} w={w} h={44} fill={fill} stroke={color} lines={[t1, t2]} />
  );
  return (
    <Svg h={300} label="מפל הסימון סביב שבר דו-גדילי: ATM מזרחן את H2AX ליצירת גמא-H2AX, MDC1 נקשר אליו, RNF8 בונה שרשראות K63 על חלבוני כרומטין, ו-RNF168 מזהה אותן ומסמן את H2A על ליזין 13 ו-15. 53BP1 קורא יחד את H2AK15ub ואת H4K20me2 ומכוון ל-NHEJ, בעוד BRCA1 עם BARD1 מקדם עיבוד קצוות ורקומבינציה הומולוגית.">
      <g>
        <rect x={40} y={40} width={80} height={8} rx={4} fill="#cbd5e1" />
        <rect x={150} y={40} width={80} height={8} rx={4} fill="#cbd5e1" />
        <He x={135} y={30} size={10} bold color={RED}>שבר</He>
      </g>
      {stepBox(36, 66, 196, "ATM → γH2AX", "מתפשט על אלפי בסיסים", BLUE, FILL.blue)}
      <Arrow x1={134} y1={114} x2={134} y2={134} color={INK} width={1.5} />
      {stepBox(36, 138, 196, "MDC1 נקשר ל-γH2AX", "ומזורחן בעצמו", BLUE, FILL.blue)}
      <Arrow x1={134} y1={186} x2={134} y2={206} color={INK} width={1.5} />
      {stepBox(36, 210, 196, "RNF8 → שרשראות K63", "בעיקר על היסטון H1", ORANGE, FILL.orange)}
      <Arrow x1={240} y1={232} x2={272} y2={232} color={ORANGE} width={1.6} />
      {stepBox(276, 210, 180, "RNF168 קורא ומסמן", "H2A K13/K15ub", ORANGE, FILL.orange)}
      <path d="M 320 206 Q 300 194 300 184" fill="none" stroke={ORANGE} strokeWidth={1.5} markerEnd="url(#bfArrow)" />
      <path d="M 412 206 Q 432 150 432 76" fill="none" stroke={GREEN} strokeWidth={1.5} markerEnd="url(#bfArrow)" />
      {/* readers compete */}
      <Box2 x={276} y={138} w={180} h={44} fill={FILL.purple} stroke={PURPLE} lines={["53BP1: קריאה כפולה", "H2AK15ub + H4K20me2"]} />
      <Arrow x1={320} y1={134} x2={320} y2={114} color={PURPLE} width={1.5} />
      <Box x={276} y={82} w={180} h={30} fill={FILL.purple} stroke={PURPLE} size={10} bold>NHEJ — חיבור קצוות</Box>
      <Box2 x={276} y={28} w={180} h={44} fill={FILL.green} stroke={GREEN} lines={["BRCA1–BARD1 (מתחרה)", "עיבוד קצוות ← רקומבינציה"]} />
            <He x={134} y={276} size={9.5} color={MUTED}>המאזן בין שני הקוראים קובע את מסלול התיקון</He>
    </Svg>
  );
}

// ── ub-cancer-death ──────────────────────────────────────────────────────────
function P53Mdm2() {
  return (
    <Svg h={280} label="לולאת p53 ו-MDM2: MDM2 נקשר לתחום ההפעלה של p53, חוסם אותו ומסמן אותו לפירוק, ולכן זמן מחצית החיים שלו כעשרים דקות. הגן של MDM2 הוא גן מטרה של p53 ולכן נוצר משוב שלילי. נזק ל-DNA גורם לזרחון p53 ליד אתר הקישור, ואות אונקוגני מפעיל את ARF שמעכב את MDM2 — בשני המקרים p53 מצטבר.">
      <Box x={166} y={44} w={148} h={38} fill={FILL.green} stroke={GREEN} size={12} bold>p53</Box>
      <Box x={166} y={186} w={148} h={38} fill={FILL.orange} stroke={ORANGE} size={12} bold>MDM2</Box>
      <Arrow x1={200} y1={86} x2={200} y2={182} color={GREEN} width={1.6} />
      <He x={190} y={112} size={9.5} anchor="end" color={GREEN}>מפעיל שעתוק</He>
      <Arrow x1={280} y1={182} x2={280} y2={86} color={ORANGE} width={1.6} />
      <He x={240} y={128} size={9.5} color={ORANGE}>קושר, חוסם</He>
      <He x={240} y={144} size={9.5} color={ORANGE}>ומסמן לפירוק</He>
      <Ub cx={332} cy={48} r={8} />
      <Ub cx={350} cy={62} r={8} />
      <Arrow x1={330} y1={82} x2={358} y2={110} color={RED} width={1.5} />
      <Box x={330} y={116} w={126} h={30} fill={FILL.gray} stroke={INK} size={10} bold>פרוטאזום</Box>
      <He x={393} y={162} size={9.5} color={MUTED}>זמן מחצית חיים: כ-20 דקות</He>
      {/* stress inputs */}
      <Box2 x={24} y={28} w={116} h={44} fill={FILL.sky} stroke={BLUE} lines={["נזק ל-DNA", "ATM/ATR מזרחנים"]} />
      <Arrow x1={144} y1={50} x2={160} y2={56} color={BLUE} width={1.5} />
      <Box2 x={24} y={186} w={116} h={44} fill={FILL.sky} stroke={BLUE} lines={["אות אונקוגני", "ARF מעכב"]} />
      <Arrow x1={144} y1={206} x2={160} y2={204} color={BLUE} width={1.5} />
      <He x={240} y={258} size={9.5} color={MUTED}>שני המסלולים — אותה תוצאה: פחות פירוק, יותר p53</He>
    </Svg>
  );
}

function TnfSwitch() {
  return (
    <Svg h={310} label="המתג על RIPK1. בקומפלקס I על הממברנה, cIAP מסמנים את RIPK1 בשרשראות K63 ו-LUBAC מוסיף שרשראות M1; הן מהוות פיגום ש-TAK1 ו-NEMO-IKK נקשרים אליו, ומוביל להפעלת NF-κB ולהישרדות. כשאין שרשראות — בלי cIAP, בלי LUBAC או אחרי הסרתן ע״י CYLD ו-A20 — RIPK1 עובר לציטוזול, נקשר ל-FADD ולקספאזה 8 וגורם לאפופטוזיס, ואם קספאזה 8 חסומה — לנקרופטוזיס.">
      <rect x={30} y={34} width={420} height={10} rx={5} fill="#cbd5e1" />
      <He x={240} y={26} size={9.5} color={MUTED}>ממברנת התא · TNFR1</He>
      {/* complex I */}
      <He x={120} y={58} size={11.5} bold color={GREEN}>קומפלקס I — הישרדות</He>
      <Box2 x={44} y={72} w={152} h={40} fill={FILL.green} stroke={GREEN} lines={["RIPK1 מסומן", "K63 (cIAP) · M1 (LUBAC)"]} />
      <Ub cx={204} cy={76} r={7} />
      <Ub cx={218} cy={86} r={7} />
      <Arrow x1={120} y1={116} x2={120} y2={136} color={GREEN} width={1.6} />
      <Box2 x={44} y={140} w={152} h={46} fill={FILL.green} stroke={GREEN} lines={["TAK1 (על K63)", "NEMO–IKK (על M1)"]} />
      <Arrow x1={120} y1={190} x2={120} y2={214} color={GREEN} width={1.6} />
      <Box x={44} y={218} w={152} h={30} fill={FILL.green} stroke={GREEN} size={10} bold>NF-κB</Box>
      <Arrow x1={120} y1={252} x2={120} y2={272} color={GREEN} width={1.5} />
      <He x={120} y={290} size={10.5} bold color={GREEN}>גני הישרדות</He>
      <line x1={240} y1={56} x2={240} y2={298} stroke={MUTED} strokeWidth={1} strokeDasharray="4 4" />
      {/* complex II */}
      <He x={360} y={58} size={11.5} bold color={RED}>קומפלקס II — מוות</He>
      <Box2 x={284} y={72} w={152} h={40} fill={FILL.red} stroke={RED} lines={["RIPK1 בלי פיגום", "חסרות K63 / M1"]} />
      <He x={446} y={126} size={9} anchor="end" color={MUTED}>אין cIAP, LUBAC פגום, או CYLD חתך</He>
      <Arrow x1={360} y1={130} x2={360} y2={152} color={RED} width={1.6} />
      <Box2 x={284} y={156} w={152} h={46} fill={FILL.red} stroke={RED} lines={["עובר לציטוזול:", "FADD + קספאזה 8"]} />
      <Arrow x1={330} y1={206} x2={316} y2={228} color={RED} width={1.5} />
      <Arrow x1={392} y1={206} x2={406} y2={228} color={RED} width={1.5} />
      <Box x={262} y={232} w={108} h={30} fill={FILL.red} stroke={RED} size={10}>אפופטוזיס</Box>
      <Box2 x={372} y={226} w={100} h={54} fill={FILL.red} stroke={RED} lines={["קספאזה 8 חסומה +", "RIPK3/MLKL בתא"]} size={9} />
      <He x={422} y={294} size={9} color={RED}>← נקרופטוזיס</He>
      <He x={120} y={306} size={9} color={MUTED}>הפיגום מגייס קינאזות מגִנות</He>
    </Svg>
  );
}

// ── ub-neurons ───────────────────────────────────────────────────────────────
function DlkAxon() {
  return (
    <Svg h={270} label="מתג DLK באקסון. במצב רגיל ליגאז ממשפחת PHR בקצה האקסון מסמן את DLK לפירוק מתמיד, ולכן רמתו נמוכה והצמיחה מרוסנת. אחרי פגיעה באקסון DLK מצטבר, מפעיל מסלול JNK ושולח אות רטרוגרדי לגוף התא, שמפעיל שעתוק של גנים להתחדשות — או, בהקשרים אחרים, מוביל למוות הנוירון.">
      {/* normal */}
      <He x={118} y={28} size={11.5} bold>מצב רגיל</He>
      <path d="M 24 76 L 150 76" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <circle cx={178} cy={76} r={20} fill={FILL.gray} stroke={INK} strokeWidth={1.4} />
      <He x={178} y={110} size={9.5} color={MUTED}>קצה האקסון</He>
      <Box x={44} y={128} w={148} h={30} fill={FILL.orange} stroke={ORANGE} size={10} bold>PHR (E3)</Box>
      <Arrow x1={118} y1={162} x2={118} y2={184} color={ORANGE} width={1.5} />
      <Box x={44} y={188} w={148} h={30} fill={FILL.gray} stroke={MUTED} size={10}>DLK מפורק — נמוך</Box>
      <He x={118} y={242} size={10.5} bold color={MUTED}>צמיחה מרוסנת</He>
      <line x1={240} y1={34} x2={240} y2={256} stroke={MUTED} strokeWidth={1} strokeDasharray="4 4" />
      {/* injury */}
      <He x={360} y={28} size={11.5} bold color={RED}>אחרי פגיעה</He>
      <path d="M 272 76 L 358 76" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <path d="M 364 62 l 10 28" stroke={RED} strokeWidth={2.4} />
      <path d="M 390 76 L 456 76" stroke={MUTED} strokeWidth={9} strokeLinecap="round" strokeDasharray="6 6" />
      <He x={378} y={48} size={9.5} color={RED}>חתך</He>
      <Box x={286} y={128} w={148} h={30} fill={FILL.red} stroke={RED} size={10} bold>DLK מצטבר ומופעל</Box>
      <Arrow x1={360} y1={162} x2={360} y2={184} color={RED} width={1.5} />
      <Box2 x={286} y={188} w={148} h={46} fill={FILL.red} stroke={RED} lines={["אות רטרוגרדי → גוף התא", "שעתוק של גני תגובה"]} />
      <He x={360} y={256} size={10} bold color={RED}>התחדשות — או מוות הנוירון</He>
    </Svg>
  );
}

function Pink1Parkin() {
  return (
    <Svg h={320} label="מסלול PINK1 ופרקין. במיטוכונדריה בריאה PINK1 מיובא פנימה בזכות פוטנציאל הממברנה, נחתך ע״י PARL ומתפרק, ולכן אין ממנו כמעט דבר. במיטוכונדריה פגועה הייבוא נכשל, PINK1 מצטבר על הממברנה החיצונית ומזרחן יוביקוויטין על סרין 65; פוספו-יוביקוויטין מגייס את פרקין, PINK1 מזרחן גם אותו והוא נפתח ומסמן עוד חלבונים — לולאת הגברה שמסתיימת בגיוס קולטני אוטופגיה ובמיטופגיה.">
      {/* healthy */}
      <He x={118} y={14} size={11.5} bold color={GREEN}>מיטוכונדריה בריאה</He>
      <rect x={34} y={40} width={168} height={76} rx={14} fill={FILL.green} stroke={GREEN} strokeWidth={1.5} />
      <rect x={48} y={56} width={140} height={44} rx={10} fill="#ffffff" stroke={GREEN} strokeWidth={1.2} />
      <He x={118} y={82} size={9.5} color={MUTED}>פוטנציאל ממברנה תקין</He>
      <Arrow x1={118} y1={26} x2={118} y2={54} color={BLUE} width={1.5} />
      <La x={128} y={34} size={9.5} anchor="start" color={BLUE}>PINK1</La>
      <Box2 x={44} y={128} w={148} h={46} fill={FILL.gray} stroke={MUTED} lines={["PARL חותך", "← מתפרק (N-דגרון)"]} />
      <He x={118} y={196} size={10.5} bold color={MUTED}>אין PINK1 על הממברנה</He>
      <line x1={240} y1={24} x2={240} y2={300} stroke={MUTED} strokeWidth={1} strokeDasharray="4 4" />
      {/* damaged */}
      <He x={360} y={14} size={11.5} bold color={RED}>מיטוכונדריה פגועה</He>
      <rect x={276} y={40} width={168} height={76} rx={14} fill={FILL.red} stroke={RED} strokeWidth={1.5} />
      <rect x={290} y={56} width={140} height={44} rx={10} fill="#ffffff" stroke={RED} strokeWidth={1.2} strokeDasharray="5 4" />
      <He x={360} y={82} size={9.5} color={MUTED}>הפוטנציאל נופל — אין ייבוא</He>
      <rect x={300} y={24} width={120} height={15} rx={6} fill={FILL.blue} stroke={BLUE} strokeWidth={1.2} />
      <La x={360} y={35} size={9} bold color={BLUE}>PINK1</La>
      <Arrow x1={360} y1={120} x2={360} y2={140} color={RED} width={1.6} />
      <Box2 x={286} y={144} w={148} h={46} fill={FILL.orange} stroke={ORANGE} lines={["מזרחן יוביקוויטין", "על Ser65"]} />
      <Arrow x1={360} y1={194} x2={360} y2={214} color={ORANGE} width={1.5} />
      <Box2 x={286} y={218} w={148} h={46} fill={FILL.purple} stroke={PURPLE} lines={["פרקין מגויס ונפתח", "ומסמן עוד חלבונים"]} />
      <path d="M 448 241 q 26 -48 0 -96" fill="none" stroke={PURPLE} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <He x={470} y={196} size={9} anchor="start" color={PURPLE} rotate={90}>לולאת הגברה</He>
      <Arrow x1={360} y1={268} x2={360} y2={288} color={PURPLE} width={1.5} />
      <He x={360} y={306} size={10.5} bold color={PURPLE}>קולטני אוטופגיה ← מיטופגיה</He>
    </Svg>
  );
}

// ── ub-immune ────────────────────────────────────────────────────────────────
function NfkbActivation() {
  return (
    <Svg h={330} label="הפעלת NF-κB בשלושה שלבים של יוביקוויטין. TRAF6 עם Ubc13 בונה שרשראות K63 שמגייסות את TAB2 ואת TAK1; LUBAC מוסיף שרשראות M1 ש-NEMO קורא ומגייס את IKK; ורק בשלב השלישי יש פירוק — IKK מזרחן את IκBα, SCF עם בטא-TrCP מסמן אותו בשרשרת K48 והוא מפורק בפרוטאזום, כך ש-NF-κB משתחרר לגרעין. CYLD ו-OTULIN מסירים שרשראות; A20 מרסן את האיתות גם דרך קישור ליוביקוויטין, ואינו רק אנזים שמסיר שרשראות.">
      <rect x={30} y={30} width={420} height={10} rx={5} fill="#cbd5e1" />
      <He x={240} y={22} size={9.5} color={MUTED}>קולטן (IL-1R / TLR)</He>
      {/* step 1 */}
      <Box2 x={40} y={58} w={150} h={46} fill={FILL.green} stroke={GREEN} lines={["TRAF6 + Ubc13", "שרשראות K63"]} />
      <Ub cx={66} cy={48} r={7} />
      <Arrow x1={194} y1={81} x2={230} y2={81} color={GREEN} width={1.6} />
      <Box2 x={234} y={58} w={150} h={46} fill={FILL.green} stroke={GREEN} lines={["TAB2 קורא K63", "← TAK1 מופעל"]} />
      <La x={400} y={76} size={10} anchor="start" bold color={GREEN}>1</La>
      <He x={400} y={94} size={9} anchor="start" color={MUTED}>פיגום</He>
      {/* step 2 */}
      <Arrow x1={240} y1={108} x2={240} y2={128} color={INK} width={1.5} />
      <Box2 x={40} y={132} w={150} h={46} fill={FILL.blue} stroke={BLUE} lines={["LUBAC (HOIP)", "שרשראות M1"]} />
      <Arrow x1={194} y1={155} x2={230} y2={155} color={BLUE} width={1.6} />
      <Box2 x={234} y={132} w={150} h={46} fill={FILL.blue} stroke={BLUE} lines={["NEMO (UBAN) קורא M1", "← IKK מגויס"]} />
      <La x={400} y={150} size={10} anchor="start" bold color={BLUE}>2</La>
      <He x={400} y={168} size={9} anchor="start" color={MUTED}>פיגום</He>
      {/* step 3 */}
      <Arrow x1={240} y1={182} x2={240} y2={202} color={INK} width={1.5} />
      <Box2 x={40} y={206} w={150} h={46} fill={FILL.orange} stroke={ORANGE} lines={["IKK מזרחן IκBα", "Ser32 · Ser36"]} />
      <Arrow x1={194} y1={229} x2={230} y2={229} color={ORANGE} width={1.6} />
      <Box2 x={234} y={206} w={150} h={46} fill={FILL.orange} stroke={ORANGE} lines={["SCF^β-TrCP → K48", "← פרוטאזום"]} />
      <La x={400} y={224} size={10} anchor="start" bold color={ORANGE}>3</La>
      <He x={400} y={242} size={9} anchor="start" color={RED}>פירוק</He>
      <Arrow x1={240} y1={256} x2={240} y2={276} color={ORANGE} width={1.6} />
      <Box x={152} y={280} w={176} h={32} fill={FILL.yellow} stroke={GOLD} size={11} bold>NF-κB משתחרר לגרעין</Box>
      {/* off switches */}
      <rect x={398} y={276} width={58} height={44} rx={8} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />
      <He x={427} y={294} size={9.5} bold color={PURPLE}>ריסון</He>
      <He x={427} y={310} size={8.5} color={PURPLE}>A20 · CYLD</He>
      <path d="M 456 276 Q 470 180 440 92" fill="none" stroke={PURPLE} strokeWidth={1.5} strokeDasharray="4 4" markerEnd="url(#bfArrow)" />
      <path d="M 452 282 Q 462 220 440 166" fill="none" stroke={PURPLE} strokeWidth={1.5} strokeDasharray="4 4" markerEnd="url(#bfArrow)" />
      <He x={392} y={300} size={8.5} anchor="end" color={PURPLE}>OTULIN (M1)</He>
    </Svg>
  );
}

// Reference: Flint et al., Principles of Virology, 5e, Vol. II, Fig. 12.6.
// Original layout: ligase assembly above two vertical producer-to-target pathways.
function VifApobec() {
  const virion = (cx: number, cy: number, apobec: boolean) => (
    <g>
      <circle cx={cx} cy={cy} r={25} fill={FILL.sky} stroke={BLUE} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={21} fill="white" stroke={BLUE} strokeWidth={1} />
      <path d={`M ${cx - 12} ${cy + 10} L ${cx - 7} ${cy - 15} L ${cx + 12} ${cy + 10} Z`} fill={FILL.blue} stroke={BLUE} strokeWidth={1.5} />
      <path d={`M ${cx - 6} ${cy + 5} q 5 -9 7 0 q 4 5 5 -3`} fill="none" stroke={GREEN} strokeWidth={2} />
      {apobec && <ellipse cx={cx + 12} cy={cy - 9} rx={7} ry={5} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.5} />}
    </g>
  );
  return (
    <Svg h={710} label="Vif מגייס APOBEC3G לליגאז CRL5 עם CBFβ, Elongin B/C, CUL5 ו-RBX2. E2 מסמן את APOBEC3G ביוביקוויטין לפירוק בפרוטאזום. עם Vif פחות APOBEC3G נארז בחלקיקי הנגיף. בלי Vif הוא נארז ופוגע בשעתוק לאחור בתא המטרה הבא, ולכן כושר ההדבקה יורד.">
      <He x={240} y={24} size={14} bold>חטיפת ליגאז בתא המייצר</He>
      {/* CUL5 bridges the substrate-adaptor end and the RING/E2 end. */}
      <path d="M 113 204 C 130 267 330 267 354 163 L 328 164 C 302 224 166 225 140 204 Z" fill={FILL.purple} stroke={PURPLE} strokeWidth={2} />
      <La x={235} y={241} size={14} bold color={PURPLE}>CUL5</La>
      <Box x={60} y={174} w={100} h={28} fill={FILL.gray} stroke={MUTED} size={12}>Elongin B/C</Box>
      <path d="M 70 171 L 64 144 Q 66 128 85 132 L 110 148 L 115 174 Z" fill={FILL.teal} stroke={TEAL} strokeWidth={1.5} />
      <La x={85} y={158} size={13} bold color={TEAL}>Vif</La>
      <ellipse cx={143} cy={155} rx={29} ry={17} fill={FILL.green} stroke={GREEN} strokeWidth={1.5} />
      <La x={143} y={159} size={12} bold color={GREEN}>CBFβ</La>
      <path d="M 63 130 Q 41 120 51 98 Q 64 83 86 94 Q 109 82 125 99 Q 140 122 115 133 Z" fill={FILL.orange} stroke={ORANGE} strokeWidth={1.5} />
      <La x={90} y={114} size={12} bold color={ORANGE}>APOBEC3G</La>
      <Box x={314} y={132} w={70} h={30} fill={FILL.blue} stroke={BLUE} size={13}>RBX2</Box>
      <Box x={315} y={87} w={68} h={30} fill={FILL.blue} stroke={BLUE} size={13}>E2</Box>
      <Lead x1={348} y1={117} x2={348} y2={132} />
      <Ub cx={348} cy={66} r={10} />
      <path d="M 329 66 Q 226 35 130 80" fill="none" stroke={RED} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <He x={230} y={86} size={12} color={RED}>העברה מ-E2 למצע</He>
      <Ub cx={122} cy={82} r={8} /><Ub cx={138} cy={78} r={8} /><Ub cx={154} cy={83} r={8} />
      <Ub cx={353} cy={219} r={11} fill={FILL.yellow} stroke={GOLD} label="N8" />
      <Lead x1={341} y1={216} x2={326} y2={211} />
      <La x={402} y={243} size={12} color={GOLD}>NEDD8</La>
      {/* Proteasome barrel and peptide products, separate from the assembly. */}
      <Arrow x1={37} y1={126} x2={37} y2={224} color={ORANGE} width={1.6} />
      <rect x={18} y={228} width={38} height={46} rx={7} fill={FILL.blue} stroke={BLUE} strokeWidth={1.5} />
      {[238, 249, 260].map(y => <path key={y} d={`M 19 ${y} Q 37 ${y + 7} 55 ${y}`} fill="none" stroke={BLUE} strokeWidth={1} />)}
      <path d="M 25 282 l 5 5 m 9 -7 l 5 6 m -13 8 l 5 4" stroke={ORANGE} strokeWidth={2} />
      <He x={98} y={286} size={12} color={BLUE}>פרוטאזום 26S</He>
      <He x={240} y={318} size={12} color={MUTED}>Vif: נגיפי · שאר רכיבי הליגאז: תאיים · Ub: יוביקוויטין</He>
      <line x1={20} y1={336} x2={460} y2={336} stroke={MUTED} strokeWidth={1} />
      {/* Each column reads downwards: producer, progeny virion, next target cell. */}
      <He x={126} y={365} size={17} bold color={GREEN}>עם Vif</He>
      <He x={354} y={365} size={17} bold color={ORANGE}>בלי Vif</He>
      <line x1={240} y1={352} x2={240} y2={666} stroke={MUTED} strokeWidth={1} strokeDasharray="4 4" />
      <He x={126} y={395} size={16}>APOBEC3G מפורק</He>
      <He x={354} y={395} size={16}>APOBEC3G נשאר</He>
      <He x={126} y={415} size={15} color={MUTED}>בתא המייצר</He>
      <He x={354} y={415} size={15} color={MUTED}>בתא המייצר</He>
      <Arrow x1={126} y1={426} x2={126} y2={451} color={GREEN} width={1.6} />
      <Arrow x1={354} y1={426} x2={354} y2={451} color={ORANGE} width={1.6} />
      {virion(126, 483, false)}{virion(354, 483, true)}
      <He x={126} y={531} size={15}>מעט APOBEC3G בחלקיק</He>
      <He x={354} y={531} size={15}>APOBEC3G נארז בחלקיק</He>
      <Arrow x1={126} y1={542} x2={126} y2={567} color={GREEN} width={1.6} />
      <Arrow x1={354} y1={542} x2={354} y2={567} color={ORANGE} width={1.6} />
      <He x={126} y={589} size={15} color={MUTED}>בתא המטרה הבא</He>
      <He x={354} y={589} size={15} color={MUTED}>בתא המטרה הבא</He>
      <He x={126} y={616} size={16}>השעתוק לאחור מוגן</He>
      <He x={354} y={616} size={16}>עיכוב שעתוק לאחור</He>
      <La x={354} y={637} size={12} color={ORANGE}>C→U (−DNA); G→A (+DNA)</La>
      <He x={126} y={662} size={16} bold color={GREEN}>כושר ההדבקה נשמר</He>
      <He x={354} y={662} size={16} bold color={RED}>כושר ההדבקה יורד</He>
      <He x={240} y={697} size={12} color={MUTED}>כתום: APOBEC3G · ירוק: CBFβ · סכמטי, לא בקנה מידה</He>
    </Svg>
  );
}

export const UBIQUITIN_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "ub-vif-apobec": { el: VifApobec, captionHe: "Vif משנה את זיהוי המצע בליגאז CRL5 ומוביל לפירוק APOBEC3G בתא המייצר. בהיעדר Vif, APOBEC3G נארז בצאצאים ופוגע בהדבקה הבאה. בהשוואה מוצג תא המבטא APOBEC3G. סכמטי, לא בקנה מידה." },
  "ub-cascade": { el: Cascade, captionHe: "מפל ההצמדה E1 ← E2 ← E3. ה-ATP נצרך בשפעול כל יוביקוויטין ב-E1; הספציפיות נקבעת ב-E3. סכמטי." },
  "ub-e3-classes": { el: E3Classes, captionHe: "שלוש משפחות E3: ב-RING היוביקוויטין עובר ישירות מ-E2 למצע, וב-HECT וב-RBR הוא עובר דרך ציסטאין של ה-E3. סכמטי." },
  "ub-triage": { el: Triage, captionHe: "בקרת איכות: תחרות בין קיפול מחדש לסימון. הזמן על השפרון הוא המדד. מפושט." },
  "ub-chain-types": { el: ChainTypes, captionHe: "צורות הסימון וסוגי השרשראות. הצורה המרחבית — לא היוביקוויטין עצמו — קובעת מי יקרא אותה. סכמטי, לא בקנה מידה." },
  "ub-writers-readers-erasers": { el: WritersReadersErasers, captionHe: "כותבים, קוראים ומוחקים סביב שרשרת היוביקוויטין — מערכת הפיכה, כמו זרחון. סכמטי." },
  "ub-proteasome-architecture": { el: ProteasomeArchitecture, captionHe: "חתך הפרוטאזום 26S: ליבה α7β7β7α7 ששעריה מווסתים, ומכסה 19S עם טבעת ATPases, קולטנים ו-Rpn11. סכמטי, לא בקנה מידה." },
  "ub-proteasome-cycle": { el: ProteasomeCycle, captionHe: "מחזור הפירוק, ושני התנאים לפירוק יעיל: אות קישור ואזור התחלה לא מקופל. סכמטי." },
  "ub-neddylation-cycle": { el: NeddylationCycle, captionHe: "מחזור הנדילציה: הפעלה ע״י NEDD8, כיבוי ע״י CSN והחלפת קולטן בעזרת CAND1. סכמטי." },
  "ub-cycle-ligases": { el: CycleLigases, captionHe: "משפחת SCF פועלת לאורך המחזור ומבוקרת ברמת המצע, הליגאז וקולטן המצע; פעילות APC/C משתנה לפי מפעיליו ומעכביו. סכמטי." },
  "ub-sac-apc": { el: SacApc, captionHe: "נקודת הבקרה של ציר החלוקה: ה-MCC לוכד את Cdc20 עד שכל הקינטוכורים מחוברים. מפושט." },
  "ub-wnt-destruction": { el: WntDestruction, captionHe: "β-קטנין: פירוק מתמיד כברירת מחדל; אות Wnt מפסיק את ההרס. סכמטי." },
  "ub-histone-marks": { el: HistoneMarks, captionHe: "אותו יוביקוויטין בודד, שני מסרים הפוכים — לפי ההיסטון, הליזין ומי שקורא אותו. סכמטי." },
  "ub-pcna-switch": { el: PcnaSwitch, captionHe: "ליזין 164 ב-PCNA: שלושה שינויים, שלושה מסלולים. מפושט; ה-SUMO ו-Rad5 מתוארים בשמר." },
  "ub-dsb-cascade": { el: DsbCascade, captionHe: "מפל הסימון בשבר דו-גדילי, והתחרות בין 53BP1 ל-BRCA1 על מסלול התיקון. מפושט." },
  "ub-p53-mdm2": { el: P53Mdm2, captionHe: "לולאת המשוב p53–MDM2, ושני מסלולי העקה שמייצבים את p53. סכמטי." },
  "ub-tnf-switch": { el: TnfSwitch, captionHe: "המתג על RIPK1: שרשראות K63 ו-M1 הן פיגום שמגייס את TAK1 ואת NEMO–IKK ומצמצם את המעבר לקומפלקס המוות. פגיעה בפיגום — היעדר cIAP, LUBAC פגום או חיתוך ע״י CYLD — מאפשרת אפופטוזיס; נקרופטוזיס רק בתאים שמבטאים RIPK3 ו-MLKL. A20 דווקא מגן, בעיקר דרך קישור ליוביקוויטין. סכמטי." },
  "ub-dlk-axon": { el: DlkAxon, captionHe: "ליגאז PHR מחזיק את DLK נמוך; פגיעה מאפשרת לו להצטבר ולשלוח אות רטרוגרדי. סכמטי." },
  "ub-pink1-parkin": { el: Pink1Parkin, captionHe: "PINK1 כחיישן ופרקין כמבצע: פוספו-יוביקוויטין מגייס ומפעיל, ונוצרת לולאת הגברה. מפושט." },
  "ub-nfkb-activation": { el: NfkbActivation, captionHe: "הפעלת NF-κB: שני שלבים של פיגום (K63, M1) ורק בשלישי פירוק (IκBα). A20, CYLD ו-OTULIN מכבים את האות בהסרת השרשראות של שלבים 1–2. סכמטי." },
};
