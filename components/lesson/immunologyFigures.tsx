/* Figures for the immunology units (Technion 276413). Original schematic drawings; curves are idealized shapes
   (marked as such in the captions), not data. Layout conventions follow Janeway's Immunobiology and Abbas, Cellular
   and Molecular Immunology — never copied. Labels sit beside shapes and arrows, never on a line.
   Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, Axes, BLUE, GREEN, INK, MUTED, ORANGE, He, La, curve, scale } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

const PURPLE = "#7c3aed";
const RED = "#b91c1c";
const TEAL = "#0f766e";
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
// Small antibody icon: stem at (x, y), arms up (or rotated).
const Yab = ({ x, y, color = BLUE, s = 1, rot = 0 }: { x: number; y: number; color?: string; s?: number; rot?: number }) => (
  <path d={`M${x} ${y} L${x} ${y - 10 * s} M${x} ${y - 10 * s} L${x - 7 * s} ${y - 18 * s} M${x} ${y - 10 * s} L${x + 7 * s} ${y - 18 * s}`} stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" transform={rot ? `rotate(${rot} ${x} ${y})` : undefined} />
);
const num = (x: number, y: number, n: string) => (
  <g key={`n${n}${x}`}>
    <circle cx={x} cy={y} r={8} fill={RED} />
    <He x={x} y={y + 4} size={10} bold color="white">{n}</He>
  </g>
);

// ── im-hematopoiesis ─────────────────────────────────────────────────────────
function Hematopoiesis() {
  const my: [string, number][] = [["נויטרופיל", 24], ["מונוציט ← מקרופאג", 52], ["תא דנדריטי", 80], ["תא פיטום", 108], ["אאוזינופיל", 136], ["בזופיל", 164]];
  const ly: [string, number][] = [["לימפוציט B ← תא פלזמה", 204], ["לימפוציט T (מבשיל בתימוס)", 236], ["תא NK", 268]];
  return (
    <Svg h={290} label="יצירת תאי הדם: מתא גזע המטופויאטי במח העצם נוצרים אב מיאלואידי — שממנו נויטרופילים, מונוציטים ומקרופאגים, תאים דנדריטיים, תאי פיטום, אאוזינופילים ובזופילים — ואב לימפואידי, שממנו לימפוציטים B, לימפוציטים T ותאי NK.">
      <circle cx={46} cy={150} r={18} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.6} />
      <He x={46} y={186} size={10}>תא גזע</He>
      <He x={46} y={200} size={10}>המטופויאטי</He>
      <line x1={62} y1={142} x2={148} y2={96} stroke={MUTED} strokeWidth={1.4} />
      <line x1={62} y1={158} x2={148} y2={226} stroke={MUTED} strokeWidth={1.4} />
      <circle cx={160} cy={90} r={13} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.4} />
      <He x={160} y={122} size={10} color={ORANGE}>אב מיאלואידי</He>
      <circle cx={160} cy={232} r={13} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <He x={160} y={264} size={10} color={BLUE}>אב לימפואידי</He>
      {my.map(([t, y]) => (
        <g key={t}>
          <line x1={173} y1={90} x2={290} y2={y} stroke={ORANGE} strokeWidth={1} />
          <circle cx={298} cy={y} r={8} fill={FILL.orange} stroke={ORANGE} />
          <He x={312} y={y + 4} size={10.5} anchor="start">{t}</He>
        </g>
      ))}
      {ly.map(([t, y]) => (
        <g key={t}>
          <line x1={173} y1={232} x2={290} y2={y} stroke={BLUE} strokeWidth={1} />
          <circle cx={298} cy={y} r={8} fill={FILL.blue} stroke={BLUE} />
          <He x={312} y={y + 4} size={10.5} anchor="start">{t}</He>
        </g>
      ))}
    </Svg>
  );
}

// ── im-lymph-node ────────────────────────────────────────────────────────────
function LymphNode() {
  return (
    <Svg h={300} label="בלוטת לימפה בחתך: כלי לימפה מביאים מגיעים לקופסית; בקליפה זקיקים של תאי B, חלקם עם מרכז נבט; בפרה-קליפה תאי T ותאים דנדריטיים, וורידונים עם אנדותל גבוה (HEV) שדרכם נכנסים לימפוציטים מהדם; בליבה תאי פלזמה, ומשם כלי הלימפה היוצא.">
      <path d="M60 150 Q60 50 230 46 Q400 44 410 110 Q380 150 410 190 Q400 256 230 254 Q60 250 60 150 Z" fill={FILL.cyto} stroke={ORANGE} strokeWidth={1.6} />
      <ellipse cx={220} cy={156} rx={120} ry={54} fill={FILL.green} />
      {[[120, 92], [210, 74], [300, 84], [110, 208], [210, 228]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={24} fill={FILL.blue} stroke={BLUE} />
          {i < 2 && <circle cx={x + 4} cy={y + 4} r={11} fill="white" stroke={BLUE} strokeDasharray="2 2" />}
        </g>
      ))}
      {["M372 120 q-20 20 0 40", "M356 112 q-18 30 2 60", "M386 132 q-12 12 0 24"].map((d) => <path key={d} d={d} fill="none" stroke={PURPLE} strokeWidth={2} />)}
      <path d="M190 150 q10 -12 20 0 q10 12 20 0" fill="none" stroke={RED} strokeWidth={2.4} />
      <Arrow x1={30} y1={70} x2={82} y2={96} color={TEAL} />
      <Arrow x1={40} y1={240} x2={84} y2={214} color={TEAL} />
      <Arrow x1={412} y1={150} x2={466} y2={150} color={TEAL} />
      <He x={60} y={40} size={10} color={TEAL}>כלי לימפה מביאים</He>
      <He x={210} y={30} size={10} color={BLUE}>זקיקים — תאי B</He>
      <He x={330} y={36} size={10}>מרכז נבט</He><Lead x1={312} y1={40} x2={218} y2={80} />
      <He x={220} y={184} size={10.5} bold color={GREEN}>פרה-קליפה — תאי T</He>
      <He x={300} y={140} size={9.5} color={RED} anchor="start">HEV</He>
      <He x={430} y={100} size={10} color={PURPLE}>ליבה</He><Lead x1={420} y1={104} x2={382} y2={124} />
      <He x={440} y={172} size={10} color={TEAL}>כלי לימפה יוצא</He>
      <He x={240} y={284} size={10} color={MUTED}>לימפוציטים מהדם נכנסים דרך HEV; האנטיגן מגיע עם הלימפה</He>
    </Svg>
  );
}

// ── im-prr ───────────────────────────────────────────────────────────────────
function Prr() {
  const rec = (x: number, y: number, c: string) => <rect x={x - 4} y={y - 10} width={8} height={20} rx={3} fill={c} />;
  return (
    <Svg h={290} label="קולטנים לזיהוי דפוסים: TLR4 ו-TLR5 על פני התא מזהים LPS ופלגלין; באנדוזום TLR3, TLR7 ו-TLR9 מזהים RNA ו-DNA; בציטוזול RIG-I מזהה RNA נגיפי ו-cGAS מזהה DNA, ו-NLRP3 יוצר אינפלמזום שמפעיל IL-1β. האותות מפעילים את NF-κB ו-IRFs, וגורמים לייצור ציטוקינים דלקתיים ואינטרפרונים.">
      <rect x={20} y={50} width={440} height={220} rx={26} fill={FILL.cyto} stroke={ORANGE} strokeWidth={1.6} />
      {rec(90, 50, BLUE)}{rec(150, 50, TEAL)}
      <La x={90} y={30} size={10} color={BLUE}>TLR4 · LPS</La>
      <La x={160} y={30} size={10} color={TEAL}>TLR5 · flagellin</La>
      <ellipse cx={110} cy={150} rx={62} ry={40} fill={FILL.purple} stroke={PURPLE} />
      {rec(80, 150, PURPLE)}{rec(110, 150, PURPLE)}{rec(140, 150, PURPLE)}
      <He x={110} y={206} size={10} color={PURPLE}>אנדוזום</He>
      <La x={110} y={222} size={9} color={PURPLE}>TLR3 · TLR7/8 · TLR9 (RNA, DNA)</La>
      <circle cx={250} cy={110} r={14} fill={FILL.green} stroke={GREEN} />
      <La x={250} y={88} size={9.5} color={GREEN}>RIG-I · RNA</La>
      <circle cx={250} cy={176} r={14} fill={FILL.green} stroke={GREEN} />
      <La x={250} y={206} size={9.5} color={GREEN}>cGAS · DNA</La>
      <circle cx={330} cy={110} r={16} fill={FILL.red} stroke={RED} />
      <La x={330} y={88} size={9.5} color={RED}>NLRP3</La>
      <He x={352} y={106} size={9.5} color={RED} anchor="start">אינפלמזום</He>
      <La x={352} y={122} size={9.5} color={RED} anchor="start">IL-1β</La>
      <ellipse cx={400} cy={210} rx={48} ry={34} fill={FILL.blue} stroke={BLUE} />
      <La x={400} y={206} size={10} bold>NF-κB · IRF</La>
      <He x={400} y={222} size={9.5}>גרעין</He>
      <Arrow x1={176} y1={160} x2={352} y2={206} />
      <Arrow x1={266} y1={180} x2={352} y2={212} />
      <Arrow x1={264} y1={116} x2={360} y2={190} />
      <He x={240} y={260} size={10} color={MUTED}>תוצאה: ציטוקינים דלקתיים, כמוקינים, אינטרפרונים מסוג I</He>
    </Svg>
  );
}

// ── im-complement ────────────────────────────────────────────────────────────
function Complement() {
  return (
    <Svg h={300} label="שלושת מסלולי המשלים — קלאסי (C1q נקשר לנוגדנים), לקטין (MBL נקשר לסוכרים) וחלופי (C3 ספונטני על פני חיידק) — נפגשים ב-C3 קונברטאזה. C3 נחתך ל-C3b, שמסמן לבליעה ומגביר את המסלול החלופי, ול-C3a. בהמשך נוצרים C5a (דלקת) וקומפלקס C5b–C9 שמחורר את הממברנה.">
      <Box x={10} y={14} w={140} h={44} fill={FILL.blue} stroke={BLUE} size={10.5}>קלאסי: C1q + נוגדן</Box>
      <Box x={170} y={14} w={140} h={44} fill={FILL.green} stroke={GREEN} size={10.5}>לקטין: MBL + סוכרים</Box>
      <Box x={330} y={14} w={140} h={44} fill={FILL.orange} stroke={ORANGE} size={10.5}>חלופי: C3 ספונטני</Box>
      <Arrow x1={80} y1={60} x2={200} y2={106} color={BLUE} />
      <Arrow x1={240} y1={60} x2={240} y2={104} color={GREEN} />
      <Arrow x1={400} y1={60} x2={280} y2={106} color={ORANGE} />
      <Box x={160} y={108} w={160} h={36} fill={FILL.yellow} stroke={ORANGE} bold size={12}>C3 קונברטאזה</Box>
      <Arrow x1={240} y1={146} x2={240} y2={176} />
      <La x={252} y={166} size={10} anchor="start">C3 → C3a + C3b</La>
      <Box x={10} y={196} w={140} h={50} fill={FILL.green} stroke={GREEN} size={10.5}>C3b — אופסוניזציה</Box>
      <Box x={170} y={196} w={140} h={50} fill={FILL.red} stroke={RED} size={10.5}>C3a, C5a — דלקת</Box>
      <Box x={330} y={196} w={140} h={50} fill={FILL.purple} stroke={PURPLE} size={10.5}>C5b–C9 — חירור</Box>
      <Arrow x1={226} y1={178} x2={100} y2={194} color={GREEN} />
      <Arrow x1={240} y1={178} x2={240} y2={194} color={RED} />
      <Arrow x1={254} y1={178} x2={380} y2={194} color={PURPLE} />
      <path d="M60 196 C 30 150, 380 150, 412 62" fill="none" stroke={ORANGE} strokeWidth={1.4} strokeDasharray="5 4" markerEnd="url(#bfArrow)" />
      <He x={80} y={158} size={9.5} color={ORANGE}>לולאת הגברה</He>
      <He x={240} y={272} size={10} color={MUTED}>על התאים שלנו מעכבים (DAF, CD59, פקטור H) עוצרים את המפל</He>
    </Svg>
  );
}

// ── im-antibody-structure ────────────────────────────────────────────────────
function AntibodyStructure() {
  const thick = (d: string, c: string) => <path d={d} fill="none" stroke={c} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />;
  return (
    <Svg h={310} label="מבנה נוגדן IgG: שתי שרשראות כבדות וקלות. בכל זרוע (Fab) אזור משתנה של הכבדה ושל הקלה יוצרים יחד אתר קשירה; בזנב (Fc) המקטעים הקבועים CH2 ו-CH3 של שתי הכבדות. אזור הציר מחבר ביניהם.">
      {thick("M226 280 L226 168 L190 118", BLUE)}{thick("M190 118 L168 88", "#1e3a8a")}
      {thick("M254 280 L254 168 L290 118", BLUE)}{thick("M290 118 L312 88", "#1e3a8a")}
      {thick("M204 166 L174 124", ORANGE)}{thick("M174 124 L152 94", "#9a3412")}
      {thick("M276 166 L306 124", ORANGE)}{thick("M306 124 L328 94", "#9a3412")}
      <line x1={226} y1={176} x2={254} y2={176} stroke={INK} strokeWidth={2} />
      <line x1={226} y1={184} x2={254} y2={184} stroke={INK} strokeWidth={2} />
      <circle cx={158} cy={82} r={7} fill="none" stroke={RED} strokeWidth={2} />
      <circle cx={322} cy={82} r={7} fill="none" stroke={RED} strokeWidth={2} />
      <La x={140} y={70} size={10} anchor="end" color="#9a3412">VL</La>
      <La x={188} y={80} size={10} anchor="start" color="#1e3a8a">VH</La>
      <La x={156} y={140} size={10} anchor="end" color={ORANGE}>CL</La>
      <La x={206} y={130} size={10} anchor="start" color={BLUE}>CH1</La>
      <La x={214} y={222} size={10} anchor="end" color={BLUE}>CH2</La>
      <La x={214} y={266} size={10} anchor="end" color={BLUE}>CH3</La>
      <He x={380} y={64} size={10} color={RED}>אתר קשירה (CDRs)</He><Lead x1={352} y1={68} x2={330} y2={80} />
      <He x={330} y={180} size={10} anchor="start">אזור הציר</He><Lead x1={326} y1={177} x2={258} y2={180} />
      <path d="M266 196 L272 196 L272 282 L266 282" fill="none" stroke={MUTED} strokeWidth={1.2} />
      <He x={280} y={236} size={11} bold anchor="start">Fc</He>
      <He x={280} y={252} size={9.5} anchor="start" color={MUTED}>קולטני Fc, משלים, FcRn</He>
      <He x={90} y={110} size={11} bold>Fab</He>
      <He x={90} y={126} size={9.5} color={MUTED}>קושר אנטיגן</He>
      <rect x={330} y={274} width={14} height={10} fill={FILL.blue} stroke={BLUE} />
      <He x={350} y={283} size={10} anchor="start">כבדה</He>
      <rect x={400} y={274} width={14} height={10} fill={FILL.orange} stroke={ORANGE} />
      <He x={420} y={283} size={10} anchor="start">קלה</He>
      <He x={120} y={300} size={9.5} color={MUTED}>כהה — אזור משתנה (V); בהיר — קבוע (C)</He>
    </Svg>
  );
}

// ── im-hybridoma ─────────────────────────────────────────────────────────────
function Hybridoma() {
  return (
    <Svg w={500} h={240} label="שיטת ההיברידומה: מחסנים עכבר, מאחים תאי B מהטחול עם תאי מיאלומה, מגדלים במצע HAT שבו שורדים רק תאי ההיברידומה, מבודדים שבט מתא בודד, ומקבלים נוגדן חד-שבטי אחד בכמות בלתי מוגבלת.">
      <Box x={10} y={60} w={90} h={50} fill={FILL.gray} stroke={MUTED} size={10}>עכבר מחוסן</Box>
      <Arrow x1={102} y1={85} x2={124} y2={85} />
      {[[140, 66], [156, 82], [140, 98]].map(([x, y]) => <circle key={`b${x}${y}`} cx={x} cy={y} r={8} fill={FILL.blue} stroke={BLUE} />)}
      {[[140, 136], [158, 148]].map(([x, y]) => <circle key={`m${x}${y}`} cx={x} cy={y} r={8} fill={FILL.orange} stroke={ORANGE} />)}
      <He x={148} y={40} size={10} color={BLUE}>תאי B מהטחול</He>
      <He x={148} y={178} size={10} color={ORANGE}>תאי מיאלומה</He>
      <Arrow x1={176} y1={110} x2={206} y2={110} />
      <He x={190} y={100} size={9} color={MUTED}>איחוי</He>
      <rect x={210} y={70} width={100} height={80} rx={10} fill={FILL.yellow} stroke={ORANGE} />
      <He x={260} y={62} size={10.5} bold>מצע HAT</He>
      <circle cx={240} cy={110} r={11} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.6} />
      <circle cx={280} cy={96} r={7} fill={FILL.gray} stroke={MUTED} strokeDasharray="2 2" />
      <circle cx={282} cy={128} r={7} fill={FILL.gray} stroke={MUTED} strokeDasharray="2 2" />
      <He x={260} y={170} size={9.5}>שורדים רק ההיברידים</He>
      <He x={260} y={184} size={9} color={MUTED}>(מקווקו — תאים שמתים)</He>
      <Arrow x1={312} y1={110} x2={342} y2={110} />
      {[0, 1, 2].map((i) => <rect key={i} x={346 + i * 22} y={96} width={18} height={28} rx={4} fill="white" stroke={MUTED} />)}
      <circle cx={377} cy={110} r={5} fill={PURPLE} />
      <He x={378} y={88} size={10}>שבט מתא בודד</He>
      <Arrow x1={414} y1={110} x2={440} y2={110} />
      <Yab x={468} y={124} color={PURPLE} s={1.3} />
      <He x={466} y={150} size={10} bold color={PURPLE}>נוגדן</He>
      <He x={466} y={164} size={10} bold color={PURPLE}>חד-שבטי</He>
      <He x={250} y={222} size={10} color={MUTED}>מיאלומה בלי HGPRT מתה ב-HAT; תאי B לא מתחלקים בתרבית; ההיברידים — שני היתרונות</He>
    </Svg>
  );
}

// ── im-elisa ─────────────────────────────────────────────────────────────────
function Elisa() {
  const well = (x: number) => <path d={`M${x} 60 L${x} 150 Q${x} 160 ${x + 10} 160 L${x + 80} 160 Q${x + 90} 160 ${x + 90} 150 L${x + 90} 60`} fill="none" stroke={MUTED} strokeWidth={1.6} />;
  const ag = (x: number, y: number) => <polygon points={`${x},${y - 7} ${x + 7},${y} ${x},${y + 7} ${x - 7},${y}`} fill={GREEN} />;
  return (
    <Svg w={500} h={230} label="ELISA בשיטת סנדוויץ': נוגדן לוכד מוצמד לבור; החומר הנבדק נקשר אליו; נוגדן שני, מצומד לאנזים, נקשר גם הוא; האנזים הופך מצע לתוצר צבעוני, ועוצמת הצבע מעידה על הכמות.">
      {[20, 140, 260, 380].map((x) => <g key={x}>{well(x)}</g>)}
      {[20, 140, 260, 380].map((x) => <g key={`c${x}`}><Yab x={x + 30} y={158} /><Yab x={x + 60} y={158} /></g>)}
      {[140, 260, 380].map((x) => <g key={`a${x}`}>{ag(x + 30, 132)}{ag(x + 60, 132)}</g>)}
      {[260, 380].map((x) => <g key={`d${x}`}><Yab x={x + 30} y={106} rot={180} color={ORANGE} /><Yab x={x + 60} y={106} rot={180} color={ORANGE} /><circle cx={x + 30} cy={102} r={5} fill={PURPLE} /><circle cx={x + 60} cy={102} r={5} fill={PURPLE} /></g>)}
      {[[400, 78], [420, 70], [440, 80], [430, 92]].map(([x, y]) => <circle key={`p${x}${y}`} cx={x} cy={y} r={4} fill={ORANGE} />)}
      {["1. נוגדן לוכד", "2. הדגימה", "3. נוגדן עם אנזים", "4. מצע ← צבע"].map((t, i) => <He key={t} x={65 + i * 120} y={186} size={10.5}>{t}</He>)}
      <He x={250} y={36} size={10} color={MUTED}>בין כל שלב — שטיפה של מה שלא נקשר</He>
      <circle cx={70} cy={214} r={5} fill={PURPLE} /><He x={80} y={218} size={9.5} anchor="start">אנזים</He>
      <polygon points="160,207 167,214 160,221 153,214" fill={GREEN} /><He x={172} y={218} size={9.5} anchor="start">החומר הנמדד</He>
    </Svg>
  );
}

// ── im-vdj ───────────────────────────────────────────────────────────────────
function Vdj() {
  const seg = (x: number, y: number, w: number, c: string, f: string, t?: string) => (
    <g key={`${x}${y}${t}`}>
      <rect x={x} y={y} width={w} height={14} rx={3} fill={f} stroke={c} strokeWidth={1} />
      {t && <La x={x + w / 2} y={y + 11} size={8} color={c}>{t}</La>}
    </g>
  );
  const line = (y: number, x1: number, x2: number) => <rect x={x1} y={y + 6} width={x2 - x1} height={2} fill={MUTED} />;
  const Vs = (y: number, n: number, x0: number) => Array.from({ length: n }, (_, i) => seg(x0 + i * 22, y, 18, BLUE, FILL.blue, `V${i + 1}`));
  return (
    <Svg w={500} h={270} label="צירוף V(D)J בשרשרת הכבדה: בקו הנבט יש מקטעי V רבים, מקטעי D, מקטעי J וגני C. קודם D מתחבר ל-J (וה-DNA ביניהם נמחק), אחר כך V מתחבר ל-DJ. הגן משועתק, והשחבור מחבר את VDJ ל-Cμ.">
      <He x={108} y={41} size={10} anchor="end">קו נבט</He>
      {line(30, 120, 490)}{Vs(30, 5, 120)}
      <He x={238} y={41} size={9} color={MUTED}>…</He>
      {[0, 1, 2].map((i) => seg(262 + i * 18, 30, 14, GREEN, FILL.green, `D${i + 1}`))}
      {[0, 1, 2].map((i) => seg(324 + i * 18, 30, 14, ORANGE, FILL.orange, `J${i + 1}`))}
      {seg(392, 30, 30, MUTED, FILL.gray, "Cμ")}{seg(428, 30, 30, MUTED, FILL.gray, "Cδ")}{seg(464, 30, 26, MUTED, FILL.gray, "Cγ")}

      <He x={108} y={101} size={10} anchor="end">1. צירוף D–J</He>
      {line(90, 120, 490)}{Vs(90, 5, 120)}
      {seg(262, 90, 14, GREEN, FILL.green, "D1")}{seg(276, 90, 14, ORANGE, FILL.orange, "J2")}{seg(290, 90, 14, ORANGE, FILL.orange, "J3")}
      {seg(392, 90, 30, MUTED, FILL.gray, "Cμ")}{seg(428, 90, 30, MUTED, FILL.gray, "Cδ")}{seg(464, 90, 26, MUTED, FILL.gray, "Cγ")}

      <He x={108} y={161} size={10} anchor="end">2. צירוף V–DJ</He>
      {line(150, 120, 490)}{Vs(150, 2, 120)}
      {seg(164, 150, 18, BLUE, FILL.blue, "V3")}{seg(182, 150, 14, GREEN, FILL.green, "D1")}{seg(196, 150, 14, ORANGE, FILL.orange, "J2")}{seg(210, 150, 14, ORANGE, FILL.orange, "J3")}
      {seg(392, 150, 30, MUTED, FILL.gray, "Cμ")}{seg(428, 150, 30, MUTED, FILL.gray, "Cδ")}{seg(464, 150, 26, MUTED, FILL.gray, "Cγ")}

      <He x={108} y={221} size={10} anchor="end">3. mRNA (שחבור)</He>
      {seg(170, 210, 18, BLUE, FILL.blue, "V3")}{seg(188, 210, 14, GREEN, FILL.green, "D1")}{seg(202, 210, 14, ORANGE, FILL.orange, "J2")}{seg(216, 210, 30, MUTED, FILL.gray, "Cμ")}
      <He x={300} y={221} size={10} anchor="start" color={MUTED}>← שרשרת μ</He>
      <He x={250} y={258} size={9.5} color={MUTED}>RAG חותך ליד רצפי האות; במפרקים נוספים ונמחקים בסיסים (TdT) — עיקר הגיוון</He>
    </Svg>
  );
}

// ── im-b-development ─────────────────────────────────────────────────────────
function BDevelopment() {
  const stages: [string, string, number][] = [["pro-B", "צירוף השרשרת הכבדה", 50], ["pre-B", "pre-BCR · חלוקה", 150], ["B לא בוגר", "צירוף הקלה · IgM", 250], ["B בוגר נאיבי", "IgM + IgD", 370]];
  return (
    <Svg h={244} label="התפתחות תא B במח העצם: בשלב pro-B מצורפת השרשרת הכבדה; בשלב pre-B היא מופיעה עם שרשרת קלה מחליפה (pre-BCR) — נקודת בדיקה ראשונה; בשלב B לא בוגר מצורפת השרשרת הקלה ומופיע IgM, ונבדקת התגובה לעצמי; התא הבוגר מבטא IgM ו-IgD ויוצא לפריפריה.">
      {stages.map(([n, t, x], i) => (
        <g key={n}>
          <circle cx={x} cy={100} r={22} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
          {i > 0 && <Yab x={x} y={78} color={i === 1 ? MUTED : BLUE} />}
          {i === 3 && <Yab x={x + 14} y={82} color={GREEN} rot={30} />}
          <La x={x} y={144} size={11} bold>{n.split(" ")[0]}</La>
          {n.includes(" ") && <He x={x} y={158} size={10}>{n.split(" ").slice(1).join(" ")}</He>}
          <He x={x} y={40} size={9.5} color={MUTED}>{t}</He>
          {i < 3 && <Arrow x1={x + 26} y1={100} x2={stages[i + 1][2] - 26} y2={100} />}
        </g>
      ))}
      <He x={100} y={190} size={10} color={RED}>בדיקה 1: כבדה תקינה?</He>
      <He x={250} y={190} size={10} color={RED}>בדיקה 2: מזהה עצמי?</He>
      <He x={250} y={206} size={9} color={MUTED}>עריכת קולטן · מחיקה · אנרגיה</He>
      <path d="M24 216 L24 222 L300 222 L300 216" fill="none" stroke={MUTED} />
      <He x={162} y={236} size={9} color={MUTED}>מח עצם</He>
      <He x={370} y={218} size={9} color={MUTED}>פריפריה (טחול, בלוטות)</He>
    </Svg>
  );
}

// ── im-germinal-center ───────────────────────────────────────────────────────
function GerminalCenter() {
  return (
    <Svg h={290} label="מרכז הנבט: באזור הכהה תאי B מתחלקים מהר ועוברים היפר-מוטציה; באזור הבהיר הם קושרים אנטיגן על תאים דנדריטיים זקיקיים ומציגים אותו לתאי Tfh. תאים בזיקה גבוהה מקבלים אות הישרדות וחוזרים לסבב נוסף או יוצאים כתאי פלזמה ותאי זיכרון; השאר מתים באפופטוזיס.">
      <ellipse cx={210} cy={140} rx={170} ry={100} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <path d="M210 40 A170 100 0 0 0 210 240 Z" fill="#bfdbfe" />
      <He x={120} y={66} size={11} bold>אזור כהה</He>
      <He x={290} y={76} size={11} bold>אזור בהיר</He>
      {[[90, 110], [120, 150], [80, 180], [150, 180], [150, 104]].map(([x, y], i) => <circle key={`d${i}`} cx={x} cy={y} r={9} fill={FILL.blue} stroke={BLUE} />)}
      <He x={112} y={210} size={9.5}>חלוקה + היפר-מוטציה</He>
      <path d="M300 130 l8 -14 l4 14 l14 -4 l-10 10 l12 8 l-14 0 l-2 14 l-6 -12 l-12 6 l6 -12 l-12 -6 z" fill={FILL.orange} stroke={ORANGE} />
      <He x={312} y={182} size={9} color={ORANGE}>תא דנדריטי זקיקי</He>
      <circle cx={262} cy={150} r={9} fill={FILL.blue} stroke={BLUE} />
      <circle cx={340} cy={108} r={10} fill={FILL.green} stroke={GREEN} />
      <La x={340} y={92} size={9} color={GREEN}>Tfh</La>
      <path d="M170 120 C 210 90, 230 100, 254 140" fill="none" stroke={INK} strokeWidth={1.4} markerEnd="url(#bfArrow)" />
      <path d="M254 164 C 220 200, 190 196, 160 180" fill="none" stroke={INK} strokeWidth={1.4} markerEnd="url(#bfArrow)" />
      <He x={210} y={92} size={9} color={MUTED}>נבחנים</He>
      <He x={204} y={214} size={9} color={MUTED}>זיקה גבוהה — עוד סבב</He>
      <Arrow x1={380} y1={140} x2={422} y2={124} color={PURPLE} />
      <Arrow x1={380} y1={150} x2={430} y2={180} color={TEAL} />
      <He x={452} y={100} size={10} color={PURPLE}>תא פלזמה</He>
      <He x={452} y={114} size={9} color={MUTED}>(למח העצם)</He>
      <He x={448} y={196} size={10} color={TEAL}>תא B זיכרון</He>
      <Arrow x1={300} y1={226} x2={326} y2={262} color={RED} />
      <He x={360} y={276} size={10} color={RED}>זיקה נמוכה — אפופטוזיס</He>
    </Svg>
  );
}

// ── im-mhc-structure ─────────────────────────────────────────────────────────
function MhcStructure() {
  const d = (x: number, y: number, w: number, h: number, c: string, f: string, t: string) => (
    <g key={t + x}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={f} stroke={c} strokeWidth={1.2} />
      <La x={x + w / 2} y={y + h / 2 + 4} size={10} color={c}>{t}</La>
    </g>
  );
  return (
    <Svg h={260} label="מבנה MHC: במחלקה I — שרשרת α עם שלושה מקטעים ו-β2-מיקרוגלובולין; החריץ בין α1 ל-α2 סגור בקצוות וקושר פפטיד של 8–10 חומצות אמינו. במחלקה II — שרשראות α ו-β; החריץ בין α1 ל-β1 פתוח וקושר פפטיד ארוך יותר.">
      <rect x={10} y={196} width={460} height={18} fill={FILL.yellow} />
      <He x={240} y={242} size={9.5} color={MUTED}>ממברנה</He>
      <He x={120} y={22} size={12} bold>MHC מחלקה I</He>
      {d(64, 50, 52, 34, BLUE, FILL.blue, "α1")}{d(124, 50, 52, 34, BLUE, FILL.blue, "α2")}
      <rect x={96} y={42} width={56} height={6} rx={3} fill={RED} />
      {d(94, 100, 52, 36, BLUE, FILL.blue, "α3")}{d(154, 110, 46, 30, ORANGE, FILL.orange, "β2m")}
      <line x1={120} y1={138} x2={120} y2={214} stroke={BLUE} strokeWidth={3} />
      <He x={60} y={36} size={9.5} color={RED}>פפטיד 8–10</He>
      <He x={40} y={162} size={9} color={MUTED}>CD8 נקשר ל-α3</He>

      <He x={360} y={22} size={12} bold>MHC מחלקה II</He>
      {d(304, 50, 52, 34, BLUE, FILL.blue, "α1")}{d(364, 50, 52, 34, GREEN, FILL.green, "β1")}
      <rect x={290} y={42} width={140} height={6} rx={3} fill={RED} />
      {d(304, 100, 52, 36, BLUE, FILL.blue, "α2")}{d(364, 100, 52, 36, GREEN, FILL.green, "β2")}
      <line x1={330} y1={138} x2={330} y2={214} stroke={BLUE} strokeWidth={3} />
      <line x1={390} y1={138} x2={390} y2={214} stroke={GREEN} strokeWidth={3} />
      <He x={448} y={36} size={9.5} color={RED}>פפטיד 13–25</He>
      <He x={450} y={162} size={9} color={MUTED}>CD4 נקשר ל-β2</He>
    </Svg>
  );
}

// ── im-antigen-processing ────────────────────────────────────────────────────
function AntigenProcessing() {
  return (
    <Svg w={500} h={320} label="שני מסלולי ההצגה: במסלול MHC I חלבון בציטוזול מפורק בפרוטאזום, הפפטידים עוברים ב-TAP ל-ER, נטענים על MHC I ומוצגים לתאי T CD8. במסלול MHC II חלבון נבלע מבחוץ ומפורק באנדוזום; MHC II מגיע מה-ER עם השרשרת הנלווית (CLIP), ו-HLA-DM מחליף את CLIP בפפטיד; המולקולה מוצגת לתאי T CD4.">
      <rect x={30} y={40} width={440} height={230} rx={30} fill={FILL.cyto} stroke={ORANGE} strokeWidth={1.6} />
      <He x={140} y={30} size={12} bold color={BLUE}>MHC I</He>
      <He x={360} y={30} size={12} bold color={GREEN}>MHC II</He>
      <path d="M60 240 q10 -10 20 0 t20 0" fill="none" stroke={PURPLE} strokeWidth={2} />
      <He x={86} y={262} size={9.5} color={PURPLE}>חלבון בציטוזול</He>
      <rect x={70} y={180} width={34} height={24} rx={6} fill={FILL.gray} stroke={MUTED} />
      <He x={87} y={174} size={9.5}>פרוטאזום</He>
      <Arrow x1={86} y1={228} x2={86} y2={206} color={PURPLE} />
      <ellipse cx={165} cy={190} rx={46} ry={26} fill={FILL.blue} stroke={BLUE} />
      <He x={168} y={194} size={10}>ER</He>
      <rect x={118} y={178} width={8} height={18} fill={TEAL} />
      <La x={122} y={222} size={9} color={TEAL}>TAP</La>
      <Arrow x1={106} y1={188} x2={116} y2={188} color={PURPLE} />
      <Arrow x1={170} y1={162} x2={150} y2={70} color={BLUE} />
      <He x={196} y={120} size={9} color={MUTED} anchor="start">גולג'י</He>
      <rect x={136} y={40} width={22} height={10} fill={BLUE} />
      <Arrow x1={130} y1={40} x2={100} y2={14} color={BLUE} />
      <La x={84} y={12} size={10} color={BLUE} anchor="end">CD8</La>

      <path d="M430 40 q-20 30 -40 34" fill="none" stroke={ORANGE} strokeWidth={1.6} />
      <circle cx={430} cy={30} r={6} fill={ORANGE} />
      <He x={444} y={34} size={9.5} anchor="start" color={ORANGE}>נבלע</He>
      <ellipse cx={380} cy={110} rx={40} ry={24} fill={FILL.purple} stroke={PURPLE} />
      <He x={380} y={114} size={9.5}>אנדוזום</He>
      <ellipse cx={330} cy={200} rx={46} ry={26} fill={FILL.blue} stroke={BLUE} />
      <He x={330} y={204} size={10}>ER</He>
      <He x={416} y={240} size={9} color={MUTED}>MHC II + שרשרת נלווית</He>
      <ellipse cx={300} cy={120} rx={36} ry={22} fill={FILL.green} stroke={GREEN} />
      <La x={300} y={118} size={9} color={GREEN}>MIIC</La>
      <He x={300} y={132} size={8.5} color={GREEN}>CLIP ← פפטיד</He>
      <Arrow x1={320} y1={174} x2={306} y2={144} color={BLUE} />
      <Arrow x1={342} y1={112} x2={338} y2={116} color={PURPLE} />
      <Arrow x1={290} y1={98} x2={270} y2={52} color={GREEN} />
      <rect x={256} y={40} width={22} height={10} fill={GREEN} />
      <Arrow x1={260} y1={40} x2={240} y2={14} color={GREEN} />
      <La x={226} y={12} size={10} color={GREEN} anchor="end">CD4</La>
      <La x={262} y={152} size={9} color={GREEN} anchor="end">HLA-DM</La>
      <He x={250} y={300} size={10} color={MUTED}>MHC I — פפטידים מבפנים, לתאי CD8; MHC II — פפטידים ממה שנבלע, לתאי CD4</He>
    </Svg>
  );
}

// ── im-thymus-selection ──────────────────────────────────────────────────────
function ThymusSelection() {
  return (
    <Svg w={500} h={270} label="ההתפתחות בתימוס: תאים כפולים-שליליים מצרפים את שרשרת β, הופכים לכפולים-חיוביים ומצרפים את α. בקליפה — בחירה חיובית: רוב התאים מתים מהזנחה, והשורדים הופכים ל-CD4 או CD8. בליבה — בחירה שלילית: תאים שמזהים עצמי בחוזקה מתים או הופכים ל-Treg. רק אחוזים בודדים יוצאים.">
      <rect x={10} y={30} width={300} height={190} rx={14} fill={FILL.sky} />
      <He x={160} y={22} size={11} bold>קליפה</He>
      <rect x={320} y={30} width={170} height={190} rx={14} fill={FILL.purple} />
      <He x={405} y={22} size={11} bold>ליבה</He>
      <Box x={20} y={100} w={70} h={40} fill="white" stroke={BLUE} size={10}>DN</Box>
      <Arrow x1={92} y1={120} x2={116} y2={120} />
      <Box x={120} y={100} w={70} h={40} fill="white" stroke={BLUE} size={10}>DP</Box>
      <He x={56} y={160} size={9} color={MUTED}>צירוף β</He>
      <He x={150} y={160} size={9} color={MUTED}>צירוף α</He>
      <Arrow x1={192} y1={112} x2={226} y2={80} color={GREEN} />
      <Arrow x1={192} y1={128} x2={226} y2={164} color={GREEN} />
      <Box x={230} y={60} w={70} h={36} fill="white" stroke={GREEN} size={10}>CD4</Box>
      <Box x={230} y={146} w={70} h={36} fill="white" stroke={GREEN} size={10}>CD8</Box>
      <He x={210} y={56} size={8.5} color={GREEN} anchor="end">MHC II</He>
      <He x={210} y={196} size={8.5} color={GREEN} anchor="end">MHC I</He>
      <Arrow x1={184} y1={142} x2={184} y2={232} color={RED} />
      <He x={184} y={248} size={9.5} color={RED}>אין קשירה — מוות מהזנחה (רוב התאים)</He>
      <Arrow x1={302} y1={78} x2={340} y2={100} />
      <Arrow x1={302} y1={164} x2={340} y2={140} />
      <Box x={340} y={98} w={140} h={44} fill="white" stroke={PURPLE} size={10}>בחירה שלילית (AIRE)</Box>
      <Arrow x1={410} y1={144} x2={410} y2={176} color={RED} />
      <He x={410} y={192} size={9.5} color={RED}>קשירה חזקה — מוות או Treg</He>
      <Arrow x1={482} y1={120} x2={496} y2={120} color={TEAL} />
      <He x={410} y={76} size={9.5} color={TEAL}>שורדים יוצאים (כ-2–5%)</He>
    </Svg>
  );
}

// ── im-two-signals ───────────────────────────────────────────────────────────
function TwoSignals() {
  return (
    <Svg h={260} label="הפעלת תא T נאיבי: אות 1 — הקולטן מזהה פפטיד על MHC; אות 2 — CD28 נקשר ל-B7 על תא דנדריטי מופעל; אות 3 — ציטוקינים שמכוונים את ההתמיינות. שני האותות יחד מובילים להפרשת IL-2 ולהתרבות; אות 1 בלבד מוביל לאנרגיה. CTLA-4 מתחרה על B7 ומעכב.">
      <path d="M40 40 L150 30 L170 80 L160 170 L120 210 L50 200 L30 120 Z" fill={FILL.orange} stroke={ORANGE} strokeWidth={1.4} />
      <He x={92} y={120} size={11} bold>תא דנדריטי</He>
      <He x={92} y={136} size={9} color={MUTED}>מופעל (PAMPs)</He>
      <circle cx={330} cy={120} r={70} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <He x={346} y={124} size={11} bold>תא T נאיבי</He>
      <rect x={168} y={66} width={14} height={18} fill={GREEN} /><rect x={248} y={66} width={14} height={18} fill={BLUE} />
      <line x1={182} y1={75} x2={248} y2={75} stroke={INK} strokeWidth={2} />
      <He x={215} y={60} size={10} bold>אות 1</He>
      <La x={160} y={98} size={8.5} color={GREEN} anchor="end">MHC+פפטיד</La>
      <La x={255} y={98} size={8.5} color={BLUE}>TCR</La>
      <rect x={160} y={140} width={14} height={18} fill={ORANGE} /><rect x={254} y={140} width={14} height={18} fill={PURPLE} />
      <line x1={174} y1={149} x2={254} y2={149} stroke={INK} strokeWidth={2} />
      <He x={215} y={134} size={10} bold>אות 2</He>
      <La x={167} y={172} size={8.5} color={ORANGE}>B7</La>
      <La x={261} y={172} size={8.5} color={PURPLE}>CD28</La>
      <Arrow x1={150} y1={196} x2={262} y2={180} color={TEAL} />
      <He x={196} y={208} size={10} color={TEAL}>אות 3: ציטוקינים</He>
      <He x={430} y={40} size={10} color={GREEN} anchor="end">1 + 2: IL-2 והתרבות</He>
      <He x={470} y={212} size={10} color={RED} anchor="end">1 בלבד: אנרגיה</He>
      <He x={240} y={246} size={9.5} color={MUTED}>CTLA-4 (על תאים מופעלים ו-Treg) נקשר ל-B7 חזק יותר מ-CD28 — ומעכב</He>
    </Svg>
  );
}

// ── im-leukocyte-migration ───────────────────────────────────────────────────
function LeukocyteMigration() {
  const cell = (x: number, y: number, flat = false) => <ellipse cx={x} cy={y} rx={flat ? 18 : 13} ry={flat ? 9 : 13} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />;
  return (
    <Svg w={500} h={250} label="יציאה של נויטרופיל מכלי הדם: גלגול בעזרת סלקטינים על אנדותל מופעל; הפעלה בעזרת כמוקין שמוצג על האנדותל; היצמדות יציבה של אינטגרין (LFA-1) ל-ICAM-1; ומעבר בין תאי האנדותל לרקמה, בעקבות מפל הכמוקינים אל החיידקים.">
      <rect x={10} y={20} width={480} height={100} fill={FILL.red} />
      <Arrow x1={30} y1={40} x2={110} y2={40} color={RED} />
      <He x={70} y={32} size={9} color={RED}>זרימת הדם</He>
      <line x1={10} y1={120} x2={490} y2={120} stroke={ORANGE} strokeWidth={5} />
      {cell(70, 100)}{cell(180, 104)}{cell(300, 108, true)}{cell(400, 122, true)}
      <path d="M58 110 q6 -18 20 -6" fill="none" stroke={PURPLE} strokeWidth={1.2} markerEnd="url(#bfArrow)" />
      {[170, 186, 196].map((x) => <circle key={x} cx={x} cy={119} r={2.5} fill={GREEN} />)}
      <He x={70} y={70} size={10} bold>1. גלגול</He>
      <He x={70} y={84} size={9} color={MUTED}>סלקטינים</He>
      <He x={180} y={70} size={10} bold>2. הפעלה</He>
      <He x={180} y={84} size={9} color={MUTED}>כמוקין</He>
      <He x={300} y={70} size={10} bold>3. היצמדות</He>
      <La x={300} y={84} size={9} color={MUTED}>LFA-1 – ICAM-1</La>
      <He x={410} y={70} size={10} bold>4. מעבר</He>
      <He x={420} y={84} size={9} color={MUTED}>בין תאי האנדותל</He>
      <rect x={10} y={126} width={480} height={100} fill={FILL.cyto} />
      <Arrow x1={400} y1={140} x2={430} y2={190} color={PURPLE} />
      {[[452, 200], [466, 208], [458, 216]].map(([x, y]) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={6} ry={3} fill={GREEN} />)}
      <He x={440} y={240} size={9.5} color={GREEN}>חיידקים</He>
      <He x={190} y={180} size={10} color={MUTED}>רקמה: TNF ו-IL-1 מפעילים את האנדותל</He>
      <He x={190} y={196} size={10} color={MUTED}>מפל כמוקינים מוביל לאתר הזיהום</He>
    </Svg>
  );
}

// ── im-th-subsets ────────────────────────────────────────────────────────────
function ThSubsets() {
  const rows: [string, string, string, string, string][] = [
    ["Th1", "IL-12", "IFN-γ", "מקרופאגים — חיידקים תוך-תאיים", ORANGE],
    ["Th2", "IL-4", "IL-4, IL-5, IL-13", "אאוזינופילים, IgE — תולעים", GREEN],
    ["Th17", "IL-6 + TGF-β", "IL-17, IL-22", "נויטרופילים — פטריות, ריריות", RED],
    ["Tfh", "IL-6, IL-21", "IL-21, CD40L", "תאי B — מרכז נבט", BLUE],
    ["Treg", "TGF-β + IL-2", "IL-10, TGF-β", "דיכוי — סבילות", PURPLE],
  ];
  return (
    <Svg w={500} h={300} label="התמיינות תא T מסייע נאיבי לפי הציטוקינים שמקבל: IL-12 ל-Th1, שמפריש IFN-γ ומפעיל מקרופאגים; IL-4 ל-Th2 — אאוזינופילים ו-IgE; IL-6 עם TGF-β ל-Th17 — נויטרופילים; IL-6 ו-IL-21 ל-Tfh — עזרה לתאי B; TGF-β עם IL-2 ל-Treg — דיכוי.">
      <circle cx={40} cy={160} r={24} fill={FILL.gray} stroke={MUTED} strokeWidth={1.4} />
      <La x={40} y={157} size={10} bold>CD4</La>
      <He x={40} y={172} size={9}>נאיבי</He>
      <La x={200} y={30} size={10} color={MUTED} bold>inducer</La>
      <He x={200} y={18} size={9.5} color={MUTED}>מכוון</He>
      <He x={300} y={18} size={9.5} color={MUTED}>מפריש</He>
      <He x={430} y={18} size={9.5} color={MUTED}>מגייס — נגד</He>
      {rows.map(([n, ind, sec, tgt, c], i) => {
        const y = 60 + i * 52;
        return (
          <g key={n}>
            <line x1={64} y1={160} x2={118} y2={y} stroke={c} strokeWidth={1.4} />
            <circle cx={136} cy={y} r={18} fill="white" stroke={c} strokeWidth={2} />
            <La x={136} y={y + 4} size={10} bold color={c}>{n}</La>
            <La x={200} y={y + 4} size={10}>{ind}</La>
            <La x={300} y={y + 4} size={10}>{sec}</La>
            <He x={490} y={y + 4} size={10} anchor="end">{tgt}</He>
          </g>
        );
      })}
    </Svg>
  );
}

// ── im-tolerance-mechanisms ──────────────────────────────────────────────────
function ToleranceMechanisms() {
  const item = (x: number, y: number, t: string, sub: string, c: string) => (
    <g key={t}>
      <rect x={x} y={y} width={200} height={40} rx={8} fill="white" stroke={c} strokeWidth={1.2} />
      <He x={x + 100} y={y + 17} size={10.5} bold>{t}</He>
      <He x={x + 100} y={y + 32} size={9} color={MUTED}>{sub}</He>
    </g>
  );
  return (
    <Svg h={290} label="מנגנוני הסבילות: מרכזית — בתימוס ובמח העצם: בחירה שלילית ומחיקה, עריכת קולטן, ויצירת Treg; היקפית — לתאים שחמקו: אנרגיה, דיכוי בידי Treg, מחיקה, ואנטיגנים מוסתרים באתרים מוגנים.">
      <rect x={10} y={10} width={220} height={270} rx={14} fill={FILL.sky} />
      <He x={120} y={32} size={12} bold>מרכזית</He>
      <He x={120} y={48} size={9.5} color={MUTED}>תימוס (T) · מח עצם (B)</He>
      {item(20, 64, "בחירה שלילית — מחיקה", "קשירה חזקה לעצמי (AIRE)", BLUE)}
      {item(20, 116, "עריכת קולטן", "תאי B: שרשרת קלה חדשה", BLUE)}
      {item(20, 168, "Treg טבעיים", "FOXP3", BLUE)}
      <rect x={250} y={10} width={220} height={270} rx={14} fill={FILL.green} />
      <He x={360} y={32} size={12} bold>היקפית</He>
      <He x={360} y={48} size={9.5} color={MUTED}>לתאים שחמקו</He>
      {item(260, 64, "אנרגיה", "אות 1 בלי אות 2; CTLA-4, PD-1", GREEN)}
      {item(260, 116, "דיכוי בידי Treg", "CTLA-4, IL-10, TGF-β, צריכת IL-2", GREEN)}
      {item(260, 168, "מחיקה", "הפעלה חוזרת — Fas", GREEN)}
      {item(260, 220, "אנטיגנים מוסתרים", "עין, מוח, אשכים", GREEN)}
      <Arrow x1={222} y1={250} x2={252} y2={250} />
      <He x={120} y={246} size={9.5} color={MUTED}>הסבילות המרכזית</He>
      <He x={120} y={260} size={9.5} color={MUTED}>לא מושלמת</He>
    </Svg>
  );
}

// ── im-mucosa ────────────────────────────────────────────────────────────────
function Mucosa() {
  return (
    <Svg w={500} h={300} label="חסינות ברירית המעי: תא M מעביר חיידקים מחלל המעי לכתם פייר שמתחתיו, שבו תאי B עוברים החלפה ל-IgA. תאי פלזמה ברירית מפרישים IgA דימרי, שנקשר לקולטן pIgR בצד הבסיסי של תא האפיתל, עובר דרך התא ומשתחרר לחלל המעי כ-IgA מופרש, שמנטרל חיידקים ומונע היצמדות.">
      <rect x={10} y={10} width={480} height={60} fill={FILL.yellow} />
      <He x={60} y={30} size={10} bold>חלל המעי</He>
      {[[120, 40], [150, 28], [330, 46], [360, 30], [420, 44]].map(([x, y]) => <ellipse key={x + y} cx={x} cy={y} rx={9} ry={4} fill={GREEN} />)}
      {Array.from({ length: 12 }, (_, i) => i).filter((i) => i !== 3).map((i) => <rect key={i} x={20 + i * 39} y={70} width={37} height={56} rx={4} fill={FILL.pink} stroke="#db2777" strokeWidth={0.8} />)}
      <path d="M137 70 Q156 100 137 126" fill={FILL.pink} stroke="#db2777" strokeWidth={0.8} />
      <rect x={137} y={70} width={20} height={56} fill="white" stroke="#db2777" strokeWidth={0.8} />
      <He x={162} y={150} size={9.5} color="#db2777" anchor="start">תא M</He>
      <Arrow x1={150} y1={46} x2={150} y2={168} color={GREEN} />
      <path d="M60 230 Q150 150 240 230 Z" fill={FILL.blue} stroke={BLUE} />
      <He x={150} y={222} size={10} bold>כתם פייר</He>
      <He x={150} y={244} size={9} color={MUTED}>החלפה ל-IgA (TGF-β)</He>
      <circle cx={330} cy={230} r={16} fill={FILL.purple} stroke={PURPLE} />
      <He x={330} y={264} size={9.5} color={PURPLE}>תא פלזמה</He>
      <path d="M346 222 Q370 190 380 140" fill="none" stroke={PURPLE} strokeWidth={1.4} markerEnd="url(#bfArrow)" />
      <La x={384} y={190} size={9} color={PURPLE} anchor="start">IgA דימרי</La>
      <rect x={376} y={124} width={8} height={6} fill={TEAL} />
      <Arrow x1={392} y1={124} x2={392} y2={72} color={TEAL} />
      <La x={400} y={144} size={9} color={TEAL} anchor="start">pIgR</La>
      <Yab x={392} y={58} color={PURPLE} rot={180} />
      <He x={476} y={24} size={9.5} color={PURPLE} anchor="end">IgA מופרש</He>
      
      <He x={250} y={290} size={9.5} color={MUTED}>IgA מנטרל ומונע היצמדות — בלי משלים ובלי דלקת</He>
    </Svg>
  );
}

// ── im-hypersensitivity-types ────────────────────────────────────────────────
function HypersensitivityTypes() {
  const panel = (x: number, y: number, title: string, sub: string, c: string, children: React.ReactNode) => (
    <g>
      <rect x={x} y={y} width={228} height={140} rx={12} fill="white" stroke={c} strokeWidth={1.4} />
      <He x={x + 114} y={y + 18} size={11.5} bold color={c}>{title}</He>
      <He x={x + 114} y={y + 132} size={9.5} color={MUTED}>{sub}</He>
      {children}
    </g>
  );
  return (
    <Svg h={300} label="ארבעת סוגי רגישות היתר: סוג I — אלרגן מקשר IgE על תא פיטום ומשחרר היסטמין; סוג II — נוגדנים נגד אנטיגן על תא מפעילים משלים ובליעה; סוג III — קומפלקסים של נוגדן ואנטיגן מסיס משתקעים בכלי דם ומגייסים נויטרופילים; סוג IV — תאי T מפעילים מקרופאגים, אחרי יום-יומיים.">
      {panel(246, 6, "סוג I — IgE", "דקות · אלרגיה, אנפילקסיס", ORANGE, (
        <g>
          <circle cx={368} cy={80} r={30} fill={FILL.orange} stroke={ORANGE} />
          {[[358, 74], [376, 86], [366, 92], [380, 70]].map(([x, y]) => <circle key={x + y} cx={x} cy={y} r={4} fill={ORANGE} />)}
          <Yab x={350} y={50} color={PURPLE} s={0.9} /><Yab x={386} y={50} color={PURPLE} s={0.9} />
          <polygon points="368,26 374,32 368,38 362,32" fill={GREEN} />
          {[[410, 70], [416, 92], [404, 104]].map(([x, y]) => <circle key={`r${x}${y}`} cx={x} cy={y} r={3} fill={ORANGE} />)}
          <He x={330} y={118} size={9} color={ORANGE}>היסטמין</He>
        </g>
      ))}
      {panel(10, 6, "סוג II — נגד תאים", "שעות-ימים · עירוי לא מתאים, גרייבס", RED, (
        <g>
          <circle cx={128} cy={78} r={30} fill={FILL.red} stroke={RED} />
          <Yab x={110} y={46} color={BLUE} rot={0} s={0.9} /><Yab x={150} y={56} color={BLUE} rot={40} s={0.9} />
          <circle cx={84} cy={100} r={6} fill={PURPLE} /><circle cx={92} cy={110} r={5} fill={PURPLE} />
          <He x={70} y={118} size={9} color={PURPLE}>משלים</He>
        </g>
      ))}
      {panel(246, 154, "סוג III — קומפלקסים", "שעות-ימים · מחלת הסרום, זאבת", PURPLE, (
        <g>
          <rect x={262} y={186} width={196} height={30} fill={FILL.red} />
          <line x1={262} y1={216} x2={458} y2={216} stroke={ORANGE} strokeWidth={4} />
          {[300, 340, 380].map((x) => <g key={x}><circle cx={x} cy={222} r={5} fill={GREEN} /><Yab x={x - 6} y={230} color={BLUE} s={0.6} rot={-30} /></g>)}
          <ellipse cx={430} cy={238} rx={14} ry={8} fill={FILL.purple} stroke={PURPLE} />
          <He x={430} y={262} size={9} color={PURPLE}>נויטרופיל</He>
        </g>
      ))}
      {panel(10, 154, "סוג IV — תאי T", "24–72 שעות · טוברקולין, ניקל", BLUE, (
        <g>
          <circle cx={80} cy={226} r={18} fill={FILL.blue} stroke={BLUE} />
          <La x={80} y={230} size={9} bold>T</La>
          <path d="M150 210 L190 200 L200 236 L160 250 Z" fill={FILL.orange} stroke={ORANGE} />
          <He x={176} y={268} size={9} color={ORANGE}>מקרופאג</He>
          <Arrow x1={100} y1={222} x2={146} y2={222} color={BLUE} />
          <La x={122} y={212} size={8.5} color={BLUE}>IFN-γ</La>
        </g>
      ))}
    </Svg>
  );
}

// ── im-allorecognition ───────────────────────────────────────────────────────
function Allorecognition() {
  return (
    <Svg h={250} label="שתי דרכים לזהות שתל: בזיהוי ישיר, תאי T של המקבל מזהים את מולקולות ה-MHC של התורם על תאים דנדריטיים של התורם. בזיהוי עקיף, תאים דנדריטיים של המקבל בולעים חלבונים של התורם ומציגים פפטידים מהם על MHC של המקבל.">
      <He x={120} y={20} size={12} bold>ישיר</He>
      <path d="M40 80 L110 70 L130 110 L110 160 L50 156 L30 116 Z" fill={FILL.red} stroke={RED} strokeWidth={1.4} />
      <He x={80} y={120} size={9.5}>תא דנדריטי</He>
      <He x={80} y={134} size={9.5} bold color={RED}>של התורם</He>
      <rect x={126} y={98} width={14} height={16} fill={RED} />
      <La x={100} y={58} size={9} color={RED}>MHC של התורם</La><Lead x1={112} y1={62} x2={131} y2={96} />
      <line x1={140} y1={106} x2={172} y2={106} stroke={INK} strokeWidth={2} />
      <circle cx={200} cy={106} r={26} fill={FILL.blue} stroke={BLUE} />
      <La x={200} y={104} size={9} bold>T</La>
      <He x={200} y={118} size={8.5}>מקבל</He>
      <He x={120} y={200} size={9.5} color={MUTED}>תדירות גבוהה מאוד</He>
      <He x={120} y={214} size={9.5} color={MUTED}>חשוב בדחייה החריפה</He>

      <He x={360} y={20} size={12} bold>עקיף</He>
      <circle cx={270} cy={70} r={14} fill={FILL.red} stroke={RED} />
      <He x={270} y={48} size={9} color={RED}>תא של השתל</He>
      <Arrow x1={286} y1={80} x2={300} y2={98} color={RED} />
      <path d="M290 110 L360 100 L380 140 L360 190 L300 186 L280 146 Z" fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <He x={330} y={150} size={9.5}>תא דנדריטי</He>
      <He x={330} y={164} size={9.5} bold color={GREEN}>של המקבל</He>
      <rect x={376} y={128} width={14} height={16} fill={GREEN} />
      <rect x={378} y={124} width={10} height={4} fill={RED} />
      <La x={410} y={84} size={8.5} color={GREEN}>MHC מקבל +</La><La x={410} y={96} size={8.5} color={RED}>פפטיד תורם</La><Lead x1={396} y1={100} x2={384} y2={124} />
      <line x1={390} y1={136} x2={418} y2={136} stroke={INK} strokeWidth={2} />
      <circle cx={444} cy={136} r={26} fill={FILL.blue} stroke={BLUE} />
      <La x={444} y={134} size={9} bold>T</La>
      <He x={444} y={148} size={8.5}>מקבל</He>
      <He x={360} y={214} size={9.5} color={MUTED}>נמשך כל עוד השתל קיים</He>
      <He x={360} y={228} size={9.5} color={MUTED}>חשוב בדחייה הכרונית ובנוגדנים</He>
    </Svg>
  );
}

// ── im-scid-defects ──────────────────────────────────────────────────────────
function ScidDefects() {
  const block = (x: number, y: number, t: string, c = RED, below = false) => (
    <g key={t + x + y}>
      <line x1={x} y1={y - 10} x2={x} y2={y + 10} stroke={c} strokeWidth={3} />
      <La x={x} y={below ? y + 24 : y - 14} size={9} bold color={c}>{t}</La>
    </g>
  );
  return (
    <Svg w={500} h={250} label="היכן חוסמים פגמים גנטיים את התפתחות הלימפוציטים: חוסר ב-γc או JAK3 חוסם את תאי T ו-NK; חוסר ב-RAG או Artemis חוסם את תאי T ו-B בשלב הצירוף; חוסר ב-ADA פוגע בכל הלימפוציטים; חוסר ב-BTK עוצר את תאי B בשלב pre-B; ותסמונת די-ג'ורג' פוגעת ביצירת התימוס.">
      <circle cx={40} cy={130} r={18} fill={FILL.purple} stroke={PURPLE} />
      <He x={40} y={166} size={9}>אב לימפואידי</He>
      {[["T", 50, BLUE], ["B", 130, GREEN], ["NK", 210, ORANGE]].map(([t, y, c]) => (
        <g key={t as string}>
          <line x1={58} y1={130} x2={430} y2={y as number} stroke={c as string} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
          <circle cx={452} cy={y as number} r={16} fill="white" stroke={c as string} strokeWidth={2} />
          <La x={452} y={(y as number) + 4} size={10} bold color={c as string}>{t as string}</La>
        </g>
      ))}
      {block(150, 110, "γc, JAK3")}{block(150, 150, "γc, JAK3", RED, true)}
      {block(260, 87, "RAG, Artemis")}{block(260, 130, "RAG, Artemis")}
      {block(360, 130, "BTK", GREEN)}
      {block(360, 65, "די-ג'ורג'", BLUE)}
      <He x={250} y={238} size={10} color={MUTED}>ADA — מטבוליטים רעילים פוגעים בכל השלושה</He>
    </Svg>
  );
}

// ── im-hiv-course ────────────────────────────────────────────────────────────
function HivCourse() {
  const s = scale(60, 440, 210, 40, 0, 12, 0, 1);
  const cd4 = (t: number) => (t < 0.4 ? 0.85 - 0.6 * (t / 0.4) : t < 1 ? 0.25 + 0.45 * ((t - 0.4) / 0.6) : 0.7 - 0.6 * ((t - 1) / 11) ** 0.9);
  const vl = (t: number) => (t < 0.3 ? 0.9 * (t / 0.3) : t < 1 ? 0.9 - 0.65 * ((t - 0.3) / 0.7) : 0.25 + 0.6 * ((t - 1) / 11) ** 2.2);
  return (
    <Svg h={260} label="מהלך זיהום HIV בלי טיפול: בשלב החריף העומס הנגיפי עולה מאוד וספירת CD4 יורדת; בשלב הסמוי, שנמשך שנים, העומס הנגיפי נמוך יחסית ו-CD4 יורד בהדרגה; כש-CD4 יורד מתחת ל-200 מתפתח איידס, והעומס הנגיפי עולה שוב. עקומות סכמטיות.">
      <Axes x0={60} y0={210} x1={440} y1={36} xLabel={<He x={440} y={240} size={10} anchor="end" color={MUTED}>זמן (שבועות, ואז שנים)</He>} yLabel={<He x={52} y={44} size={10} anchor="end">רמה</He>} />
      <rect x={s.sx(0)} y={36} width={s.sx(1) - s.sx(0)} height={174} fill={FILL.red} opacity={0.35} />
      <rect x={s.sx(10)} y={36} width={s.sx(12) - s.sx(10)} height={174} fill={FILL.purple} opacity={0.5} />
      <path d={curve(cd4, 0, 12, s, 300)} fill="none" stroke={BLUE} strokeWidth={2.4} />
      <path d={curve(vl, 0, 12, s, 300)} fill="none" stroke={RED} strokeWidth={2.4} />
      <line x1={60} y1={s.sy(0.2)} x2={440} y2={s.sy(0.2)} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
      <He x={436} y={s.sy(0.2) - 4} size={9} anchor="end" color={MUTED}>CD4 = 200</He>
      <He x={s.sx(0.5)} y={226} size={9.5}>חריף</He>
      <He x={s.sx(5.5)} y={226} size={9.5}>סמוי — שנים</He>
      <He x={s.sx(11)} y={226} size={9.5}>איידס</He>
      <He x={s.sx(5)} y={s.sy(0.62) - 8} size={10} bold color={BLUE}>תאי CD4</He>
      <He x={s.sx(6)} y={s.sy(0.36) + 16} size={10} bold color={RED}>עומס נגיפי</He>
    </Svg>
  );
}

export const IMMUNOLOGY_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "im-hematopoiesis": { el: Hematopoiesis, captionHe: "כל תאי החיסון נוצרים במח העצם מתא גזע אחד, בשתי שושלות. סכמטי — לא כל שלבי הביניים מוצגים (וגם תאי דם אדומים וטסיות יוצאים מהשושלת המיאלואידית)." },
  "im-lymph-node": { el: LymphNode, captionHe: "בלוטת לימפה: המבנה מפגיש את האנטיגן (בלימפה) עם הלימפוציטים (מהדם), כל סוג תא באזור שלו. סכמטי." },
  "im-prr": { el: Prr, captionHe: "קולטנים לזיהוי דפוסים במקומות שונים בתא — כל אחד במקום שבו הוא צפוי לפגוש את הפתוגן. סכמטי." },
  "im-complement": { el: Complement, captionHe: "שלושת מסלולי המשלים נפגשים ב-C3. הפעולות העיקריות: אופסוניזציה, דלקת וחירור. סכמטי." },
  "im-antibody-structure": { el: AntibodyStructure, captionHe: "מבנה IgG: שתי שרשראות כבדות (כחול) ושתיים קלות (כתום). האזורים המשתנים יוצרים את אתר הקשירה; ה-Fc קובע את התפקיד. סכמטי." },
  "im-hybridoma": { el: Hybridoma, captionHe: "ייצור נוגדנים חד-שבטיים בשיטת ההיברידומה (קוהלר ומילשטיין, 1975). סכמטי." },
  "im-elisa": { el: Elisa, captionHe: "ELISA בשיטת סנדוויץ'. עוצמת הצבע — לפי עקומת כיול — נותנת את הכמות. סכמטי." },
  "im-vdj": { el: Vdj, captionHe: "צירוף V(D)J בשרשרת הכבדה: שני שלבי חיתוך וחיבור ב-DNA, ואחר כך שחבור RNA. מספר המקטעים מוקטן. סכמטי." },
  "im-b-development": { el: BDevelopment, captionHe: "שלבי ההתפתחות של תא B ושתי נקודות הבדיקה. סכמטי." },
  "im-germinal-center": { el: GerminalCenter, captionHe: "מרכז הנבט: מוטציות באזור הכהה, בחירה באזור הבהיר — הבשלת זיקה. סכמטי." },
  "im-mhc-structure": { el: MhcStructure, captionHe: "מבנה MHC מחלקה I ומחלקה II. ההבדל בחריץ (סגור או פתוח) קובע את אורך הפפטיד. סכמטי." },
  "im-antigen-processing": { el: AntigenProcessing, captionHe: "שני מסלולי העיבוד וההצגה. הפרדת המסלולים קובעת איזה תא T יזהה כל אנטיגן. סכמטי." },
  "im-thymus-selection": { el: ThymusSelection, captionHe: "הבחירה בתימוס: חיובית בקליפה (הגבלה ל-MHC), שלילית בליבה (סבילות). סכמטי." },
  "im-two-signals": { el: TwoSignals, captionHe: "מודל שני האותות (ושלישי): בלי קו-גירוי, זיהוי האנטיגן מוביל לאנרגיה. סכמטי." },
  "im-leukocyte-migration": { el: LeukocyteMigration, captionHe: "ארבעת שלבי היציאה של לויקוציט מכלי הדם לרקמה דלוקה. סכמטי." },
  "im-th-subsets": { el: ThSubsets, captionHe: "תת-הסוגים של תאי T מסייעים. החלוקה מפושטת — בפועל יש גמישות ותאים ביניים." },
  "im-tolerance-mechanisms": { el: ToleranceMechanisms, captionHe: "מנגנוני הסבילות המרכזית וההיקפית. סכמטי." },
  "im-mucosa": { el: Mucosa, captionHe: "חסינות ברירית המעי: הכניסה דרך תאי M, וההפרשה של IgA דרך האפיתל. סכמטי." },
  "im-hypersensitivity-types": { el: HypersensitivityTypes, captionHe: "ארבעת סוגי רגישות היתר לפי ג'ל וקומבס. במחלות רבות פועלים כמה סוגים יחד. סכמטי." },
  "im-allorecognition": { el: Allorecognition, captionHe: "זיהוי ישיר ועקיף של שתל. אדום — של התורם; ירוק וכחול — של המקבל. סכמטי." },
  "im-scid-defects": { el: ScidDefects, captionHe: "היכן פגמים גנטיים שונים חוסמים את התפתחות הלימפוציטים — מסביר אילו תאים חסרים בכל צורה. סכמטי." },
  "im-hiv-course": { el: HivCourse, captionHe: "מהלך טבעי של זיהום HIV (בלי טיפול). עקומות סכמטיות, לא בקנה מידה; בטיפול משולב העומס הנגיפי יורד מתחת לסף הגילוי ו-CD4 עולה." },
};
