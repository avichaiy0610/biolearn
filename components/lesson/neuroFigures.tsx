/* Figures for the neurobiology units (Technion 134157). Original schematic drawings; curves and traces are idealized
   shapes (marked as such in the captions), not data. Layout conventions follow Bear, Connors & Paradiso and Kandel,
   Principles of Neural Science — never copied. Labels sit beside shapes and arrows, never on a line.
   Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, Axes, BLUE, GREEN, INK, MUTED, ORANGE, He, La, curve, scale } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

const PURPLE = "#7c3aed";
const RED = "#b91c1c";
const TEAL = "#0f766e";
const GOLD = "#a16207";
const PINK = "#be185d";
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
function LBox({ x, y, w, h, fill, stroke, children, size = 11 }: { x: number; y: number; w: number; h: number; fill: string; stroke: string; children: React.ReactNode; size?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={7} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <La x={x + w / 2} y={y + h / 2 + size * 0.36} size={size} bold>{children}</La>
    </g>
  );
}
const Membrane = ({ y, h = 16, x = 0, w = 480 }: { y: number; h?: number; x?: number; w?: number }) => <rect x={x} y={y} width={w} height={h} fill={FILL.membrane} />;

// ── nb-cells ─────────────────────────────────────────────────────────────────
function NeuronParts() {
  const dend = ["M96 120 L60 92 L40 70", "M60 92 L36 96", "M96 120 L52 128 L28 140", "M52 128 L40 112", "M100 132 L70 168 L56 190", "M70 168 L48 172", "M104 108 L88 66 L92 40", "M88 66 L66 52"];
  const myelin = [176, 222, 268, 314];
  return (
    <Svg h={250} label="מבנה נוירון: דנדריטים מסועפים (משמאל) עם קוצים, גוף התא עם הגרעין, גבעת האקסון ומקטע ההתחלה, אקסון עטוף במקטעי מיאלין עם צמתי רנווייה ביניהם, ובקצה — כפתורים סינפטיים עם שלפוחיות.">
      {dend.map((d, i) => <path key={i} d={d} fill="none" stroke={BLUE} strokeWidth={3.2} strokeLinecap="round" />)}
      {[[40, 70], [28, 140], [56, 190], [92, 40]].map(([x, y]) => <circle key={`${x}`} cx={x} cy={y} r={2.6} fill={BLUE} />)}
      <circle cx={112} cy={120} r={24} fill={FILL.blue} stroke={BLUE} strokeWidth={1.6} />
      <circle cx={110} cy={120} r={9} fill={BLUE} opacity={0.5} />
      <path d="M134 114 L156 117 L156 123 L134 126 Z" fill={FILL.orange} stroke={ORANGE} strokeWidth={1} />
      <rect x={156} y={117} width={210} height={6} fill="#94a3b8" />
      {myelin.map((x) => <rect key={x} x={x} y={110} width={38} height={20} rx={9} fill={FILL.yellow} stroke={GOLD} strokeWidth={1.2} />)}
      {[[366, 120, 404, 92], [366, 120, 410, 120], [366, 120, 404, 150]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#94a3b8" strokeWidth={4} strokeLinecap="round" />)}
      {[[410, 88], [416, 120], [410, 154]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={11} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
          {[[-3, -3], [3, 0], [-2, 4]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r={1.8} fill={GREEN} />)}
        </g>
      ))}
      <He x={50} y={222} size={10} color={BLUE}>דנדריטים</He>
      <Lead x1={56} y1={212} x2={64} y2={172} />
      <He x={112} y={26} size={10} color={BLUE}>גוף התא</He>
      <Lead x1={112} y1={32} x2={112} y2={94} />
      <He x={150} y={176} size={10} color={ORANGE}>מקטע ההתחלה</He>
      <Lead x1={148} y1={166} x2={166} y2={120} />
      <He x={214} y={88} size={10} color={GOLD}>מיאלין</He>
      <Lead x1={214} y1={94} x2={196} y2={108} />
      <He x={265} y={168} size={10} color={MUTED}>צומת רנווייה</He>
      <Lead x1={265} y1={158} x2={264} y2={124} />
      <He x={436} y={208} size={10} color={GREEN}>כפתורים סינפטיים</He>
      <Lead x1={428} y1={198} x2={414} y2={166} />
      <He x={240} y={240} size={9.5} color={MUTED}>המידע זורם: דנדריטים ← גוף התא ← אקסון ← סינפסה</He>
    </Svg>
  );
}

function GliaTypes() {
  return (
    <Svg h={290} label="ארבעה סוגי תאי גלייה: אסטרוציט — שלוחות שנוגעות בכלי דם ועוטפות סינפסות; אוליגודנדרוציט — עוטף מקטעי מיאלין על כמה אקסונים במערכת המרכזית; תא שוואן — עוטף מקטע אחד באקסון אחד במערכת ההיקפית; מיקרוגלייה — תא חיסון קטן עם שלוחות מסועפות שסורקות.">
      <He x={120} y={18} size={11} bold color={TEAL}>אסטרוציט</He>
      <circle cx={110} cy={78} r={12} fill={FILL.teal} stroke={TEAL} strokeWidth={1.4} />
      {[[70, 50], [150, 46], [64, 106], [156, 110], [110, 36]].map(([x, y], i) => <line key={i} x1={110} y1={78} x2={x} y2={y} stroke={TEAL} strokeWidth={2.6} strokeLinecap="round" />)}
      <rect x={20} y={112} width={40} height={14} rx={7} fill={FILL.red} stroke={RED} strokeWidth={1} />
      <circle cx={170} cy={118} r={9} fill={FILL.green} stroke={GREEN} strokeWidth={1} />
      <He x={40} y={142} size={9} color={RED}>כלי דם</He>
      <He x={186} y={142} size={9} color={GREEN}>סינפסה</He>

      <He x={360} y={18} size={11} bold color={GOLD}>אוליגודנדרוציט</He>
      <circle cx={360} cy={70} r={12} fill={FILL.yellow} stroke={GOLD} strokeWidth={1.4} />
      {[100, 116, 132].map((y, i) => (
        <g key={y}>
          <line x1={270} y1={y} x2={460} y2={y} stroke="#94a3b8" strokeWidth={2} />
          <line x1={360} y1={82} x2={300 + i * 60} y2={y - 6} stroke={GOLD} strokeWidth={1.6} />
          <rect x={286 + i * 60} y={y - 5} width={30} height={10} rx={5} fill={FILL.yellow} stroke={GOLD} strokeWidth={1} />
        </g>
      ))}
      <He x={364} y={154} size={9.5} color={MUTED}>תא אחד — כמה אקסונים (מרכזית)</He>

      <He x={120} y={176} size={11} bold color={ORANGE}>תא שוואן</He>
      <line x1={20} y1={226} x2={220} y2={226} stroke="#94a3b8" strokeWidth={2} />
      <rect x={80} y={216} width={80} height={20} rx={10} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.2} />
      <circle cx={120} cy={210} r={6} fill={ORANGE} />
      <He x={120} y={262} size={9.5} color={MUTED}>תא אחד — מקטע אחד (היקפית)</He>

      <He x={360} y={176} size={11} bold color={PURPLE}>מיקרוגלייה</He>
      <ellipse cx={360} cy={226} rx={10} ry={7} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      {[[320, 204, 306, 196], [400, 204, 414, 194], [318, 246, 304, 256], [402, 246, 416, 258]].map(([a, b, c, d], i) => (
        <g key={i}>
          <line x1={360} y1={226} x2={a} y2={b} stroke={PURPLE} strokeWidth={1.6} />
          <line x1={a} y1={b} x2={c} y2={d} stroke={PURPLE} strokeWidth={1.2} />
        </g>
      ))}
      <He x={360} y={280} size={9.5} color={MUTED}>שלוחות סורקות — תא חיסון</He>
    </Svg>
  );
}

function BrainRegions() {
  return (
    <Svg h={250} label="מבט צד סכמטי על המוח: אונה מצחית (מקדימה), קודקודית (למעלה), רקתית (בצד), עורפית (מאחור); ההיפוקמפוס בעומק האונה הרקתית; התלמוס והגרעינים הבסיסיים בעומק; המוחון מאחור למטה; וגזע המוח שממשיך לחוט השדרה.">
      <path d="M80 140 Q70 60 170 40 Q280 22 350 70 Q400 100 390 150 Q370 176 330 172 L150 180 Q90 178 80 140 Z" fill="#f8fafc" stroke={INK} strokeWidth={1.4} />
      <path d="M86 130 Q90 64 170 46 L200 120 L120 150 Z" fill="#dbeafe" />
      <path d="M200 120 L170 46 Q260 28 300 54 L270 118 Z" fill="#dcfce7" />
      <path d="M270 118 L300 54 Q370 82 386 140 L320 150 Z" fill="#fef3c7" />
      <path d="M120 150 L200 120 L270 118 L320 150 L300 172 L150 178 Q122 172 120 150 Z" fill="#fce7f3" />
      <ellipse cx={230} cy={148} rx={30} ry={10} fill="#f9a8d4" />
      <ellipse cx={220} cy={110} rx={22} ry={14} fill="#c4b5fd" />
      <path d="M318 172 Q350 168 362 190 Q350 214 316 204 Q300 190 318 172 Z" fill="#fed7aa" stroke={ORANGE} strokeWidth={1.2} />
      <path d="M262 176 L282 176 L284 236 L266 236 Z" fill="#e2e8f0" stroke={MUTED} strokeWidth={1} />
      <He x={160} y={24} size={10} color={BLUE}>אונה מצחית</He>
      <Lead x1={156} y1={30} x2={140} y2={84} />
      <He x={238} y={22} size={10} color={GREEN}>אונה קודקודית</He>
      <Lead x1={238} y1={28} x2={236} y2={60} />
      <He x={432} y={96} size={10} color={GOLD}>אונה עורפית</He>
      <Lead x1={418} y1={102} x2={358} y2={116} />
      <He x={130} y={210} size={10} color={PINK}>אונה רקתית</He>
      <Lead x1={140} y1={200} x2={168} y2={168} />
      <He x={210} y={236} size={10} color={PINK}>היפוקמפוס (בעומק)</He>
      <Lead x1={214} y1={226} x2={226} y2={158} />
      <He x={12} y={62} size={10} color={PURPLE} anchor="start">תלמוס, גרעינים בסיסיים</He>
      <Lead x1={96} y1={68} x2={200} y2={106} />
      <He x={420} y={210} size={10} color={ORANGE}>מוחון</He>
      <Lead x1={404} y1={206} x2={362} y2={194} />
      <He x={300} y={244} size={10} color={MUTED} anchor="start">גזע המוח</He>
      <Lead x1={298} y1={240} x2={286} y2={226} />
    </Svg>
  );
}

// ── nb-channels ──────────────────────────────────────────────────────────────
function KChannel() {
  const filterY = [70, 84, 98, 112];
  return (
    <Svg h={262} label="תעלת אשלגן בחתך: שתיים מארבע תת-היחידות מוצגות משני צדי הנקבובית. במסנן הסלקטיביות (למעלה) יוני K⁺ עוברים בלי מעטפת המים, וחמצני הקרבוניל של החלבון מחליפים את מולקולות המים. בחלל הפנימי, היונים עטופים במים. יון Na⁺ קטן מדי לחמצני המסנן ולכן לא נכנס.">
      <Membrane y={56} h={130} x={60} w={360} />
      <He x={448} y={48} size={9.5} color={MUTED} anchor="end">חוץ</He>
      <He x={448} y={210} size={9.5} color={MUTED} anchor="end">פנים</He>
      <path d="M160 40 L222 40 L222 128 L212 150 L206 200 L160 200 Z" fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <path d="M320 40 L258 40 L258 128 L268 150 L274 200 L320 200 Z" fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      {filterY.map((y) => (
        <g key={y}>
          <circle cx={226} cy={y} r={3} fill={RED} />
          <circle cx={254} cy={y} r={3} fill={RED} />
        </g>
      ))}
      <circle cx={240} cy={77} r={7} fill={PURPLE} />
      <circle cx={240} cy={105} r={7} fill={PURPLE} />
      <circle cx={240} cy={168} r={7} fill={PURPLE} />
      {[[226, 160], [254, 160], [226, 178], [254, 178], [240, 152], [240, 184]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill="#38bdf8" />)}
      <He x={110} y={78} size={10} color={RED} anchor="end">מסנן הסלקטיביות</He>
      <Lead x1={114} y1={74} x2={222} y2={84} />
      <He x={110} y={96} size={9} color={MUTED} anchor="end">(חמצני קרבוניל, TVGYG)</He>
      <He x={360} y={30} size={10} color={PURPLE}>K⁺ בלי מים</He>
      <Lead x1={340} y1={34} x2={247} y2={76} />
      <He x={370} y={232} size={10} color="#0284c7">K⁺ עם מעטפת מים</He>
      <Lead x1={320} y1={224} x2={260} y2={184} />
      <circle cx={100} cy={232} r={5} fill={ORANGE} />
      <He x={112} y={236} size={9.5} anchor="start" color={ORANGE}>Na⁺ — קטן מדי למסנן, לא נכנס</He>
    </Svg>
  );
}

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
function VesicleRelease() {
  return (
    <Svg h={276} label="שחרור נוירוטרנסמיטר: פוטנציאל פעולה מגיע לכפתור הסינפטי, תעלות Ca²⁺ תלויות-מתח באזור הפעיל נפתחות, Ca²⁺ נקשר לסינפטוטגמין, חלבוני SNARE (סינפטוברווין על השלפוחית, סינטקסין ו-SNAP-25 על הממברנה) מתלפפים ומושכים את השלפוחית לאיחוי, והנוירוטרנסמיטר משתחרר אל הקולטנים בצד הפוסט-סינפטי.">
      <path d="M60 20 L420 20 L420 150 Q240 176 60 150 Z" fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      {[[120, 60], [170, 80], [300, 70], [350, 90], [220, 100]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={15} fill="white" stroke={GREEN} strokeWidth={1.2} />
          {[[-4, -3], [4, 2], [-1, 5]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r={2} fill={ORANGE} />)}
        </g>
      ))}
      <circle cx={240} cy={142} r={14} fill="white" stroke={GREEN} strokeWidth={1.4} />
      {[[234, 140], [244, 146], [240, 136]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} fill={ORANGE} />)}
      <rect x={150} y={150} width={14} height={18} rx={3} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />
      <rect x={316} y={150} width={14} height={18} rx={3} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />
      {[[157, 140], [323, 140], [170, 132]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill={PURPLE} />)}
      {[[228, 162], [240, 166], [252, 162]].map(([x, y], i) => <line key={i} x1={x} y1={y - 8} x2={x} y2={y + 2} stroke={RED} strokeWidth={2.4} />)}
      {[[200, 190], [230, 196], [262, 192], [284, 198]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.4} fill={ORANGE} />)}
      <rect x={60} y={220} width={360} height={40} rx={6} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      {[190, 240, 290].map((x) => <rect key={x} x={x - 6} y={210} width={12} height={14} rx={3} fill={BLUE} />)}
      <He x={410} y={40} size={10} anchor="end" color={GREEN}>כפתור פרה-סינפטי</He>
      <He x={240} y={244} size={10} color={BLUE}>תא פוסט-סינפטי — קולטנים</He>
      <He x={20} y={206} size={10} anchor="start" color={PURPLE}>תעלות Ca²⁺ — Ca²⁺ נכנס</He>
      <Lead x1={60} y1={197} x2={152} y2={168} />
      <He x={372} y={190} size={10} color={RED}>SNARE + סינפטוטגמין</He>
      <Lead x1={318} y1={186} x2={256} y2={160} />
      <He x={130} y={118} size={10} color={MUTED}>שלפוחיות מוכנות</He>
    </Svg>
  );
}

function ReceptorTypes() {
  return (
    <Svg h={250} label="שני סוגי קולטנים. יונוטרופי: הנוירוטרנסמיטר נקשר לקולטן שהוא עצמו תעלה — היונים זורמים מיד (אלפיות שנייה). מטבוטרופי: הנוירוטרנסמיטר נקשר לקולטן בעל שבעה קטעים חוצי ממברנה, שמפעיל חלבון G; חלבון G פותח או סוגר תעלה אחרת או מפעיל שליח שני — לאט ולאורך זמן.">
      <He x={120} y={20} size={11.5} bold color={BLUE}>יונוטרופי</He>
      <He x={360} y={20} size={11.5} bold color={PURPLE}>מטבוטרופי</He>
      <Membrane y={90} h={50} x={10} w={460} />
      <rect x={90} y={76} width={24} height={78} rx={8} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <rect x={126} y={76} width={24} height={78} rx={8} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <circle cx={102} cy={66} r={6} fill={ORANGE} />
      <Arrow x1={120} y1={50} x2={120} y2={176} color={BLUE} width={2} />
      <La x={136} y={46} size={10} anchor="start" color={BLUE}>Na⁺</La>
      <He x={120} y={206} size={10} color={MUTED}>הקולטן הוא התעלה — מהיר</He>

      {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={280 + i * 11} y={82} width={8} height={66} rx={4} fill={FILL.purple} stroke={PURPLE} strokeWidth={1} />)}
      <circle cx={300} cy={70} r={6} fill={ORANGE} />
      <ellipse cx={340} cy={166} rx={22} ry={11} fill={FILL.yellow} stroke={GOLD} strokeWidth={1.2} />
      <La x={340} y={170} size={10} bold color={GOLD}>G</La>
      <rect x={410} y={82} width={14} height={66} rx={6} fill={FILL.teal} stroke={TEAL} strokeWidth={1.2} />
      <rect x={428} y={82} width={14} height={66} rx={6} fill={FILL.teal} stroke={TEAL} strokeWidth={1.2} />
      <Arrow x1={364} y1={164} x2={410} y2={154} color={GOLD} width={1.6} />
      <He x={360} y={206} size={10} color={MUTED}>דרך חלבון G ושליח שני — איטי וממושך</He>
      <He x={430} y={70} size={9.5} color={TEAL}>תעלה</He>
    </Svg>
  );
}

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

function LtpNmda() {
  const panel = (x0: number, active: boolean) => (
    <g>
      <He x={x0 + 105} y={20} size={11} bold color={active ? RED : MUTED}>{active ? "בדה-פולריזציה" : "במנוחה (−65 mV)"}</He>
      <Membrane y={90} h={44} x={x0} w={210} />
      <rect x={x0 + 30} y={78} width={34} height={68} rx={8} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <La x={x0 + 47} y={72} size={9.5} bold color={BLUE}>AMPA</La>
      <rect x={x0 + 120} y={78} width={40} height={68} rx={8} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <La x={x0 + 140} y={72} size={9.5} bold color={PURPLE}>NMDA</La>
      <circle cx={x0 + 140} cy={active ? 50 : 112} r={7} fill={MUTED} />
      <La x={x0 + 140} y={(active ? 50 : 112) + 3.5} size={7.5} bold color="white">Mg</La>
      <Arrow x1={x0 + 47} y1={80} x2={x0 + 47} y2={166} color={BLUE} width={1.4} />
      <La x={x0 + 22} y={176} size={9} color={BLUE}>Na⁺</La>
      {active && <Arrow x1={x0 + 140} y1={80} x2={x0 + 140} y2={162} color={RED} width={2.2} />}
      {active && <La x={x0 + 178} y={160} size={10} bold color={RED}>Ca²⁺</La>}
      {!active && <He x={x0 + 105} y={206} size={9.5} color={MUTED}>Mg²⁺ חוסם — אין Ca²⁺</He>}
      {active && <He x={x0 + 105} y={206} size={9.5} color={RED}>Ca²⁺ ← CaMKII ← עוד AMPA</He>}
    </g>
  );
  return (
    <Svg h={226} label="קולטן NMDA כגלאי צירוף מקרים. במנוחה: גלוטמט פותח את AMPA (Na⁺ נכנס), אבל יון Mg²⁺ חוסם את NMDA. בדה-פולריזציה חזקה (הרבה קלט יחד): Mg²⁺ נדחה החוצה, Ca²⁺ נכנס דרך NMDA ומפעיל CaMKII, שמגייס עוד קולטני AMPA — הסינפסה מתחזקת (LTP).">
      {panel(20, false)}
      {panel(250, true)}
    </Svg>
  );
}

// ── nb-development ───────────────────────────────────────────────────────────
function NeuralTube() {
  return (
    <Svg h={220} label="נוירולציה בחתך: (1) לוחית עצבית באקטודרם מעל מיתר הגב; (2) הקפלים העצביים מתרוממים; (3) הקפלים נסגרים לצינור עצבי מתחת לעור, ותאי הציצה העצבית (כתום) נודדים מהשוליים.">
      <rect x={20} y={80} width={130} height={14} fill={FILL.gray} />
      <rect x={55} y={80} width={60} height={14} fill={FILL.blue} />
      <circle cx={85} cy={118} r={9} fill={FILL.purple} stroke={PURPLE} strokeWidth={1} />
      <He x={85} y={60} size={9.5} color={BLUE}>לוחית עצבית</He>
      <He x={85} y={150} size={9} color={PURPLE}>מיתר הגב</He>

      <path d="M170 92 L200 92 Q205 64 222 60 Q240 84 258 60 Q275 64 280 92 L310 92 L310 104 L170 104 Z" fill={FILL.gray} />
      <path d="M205 92 Q210 70 222 66 Q240 92 258 66 Q270 70 275 92 L262 98 Q240 104 218 98 Z" fill={FILL.blue} />
      <circle cx={222} cy={64} r={4} fill={ORANGE} />
      <circle cx={258} cy={64} r={4} fill={ORANGE} />
      <circle cx={240} cy={124} r={9} fill={FILL.purple} stroke={PURPLE} strokeWidth={1} />
      <He x={240} y={40} size={9.5} color={MUTED}>קפלים עצביים</He>

      <rect x={330} y={60} width={140} height={12} fill={FILL.gray} />
      <circle cx={400} cy={104} r={22} fill={FILL.blue} />
      <circle cx={400} cy={104} r={6} fill="white" />
      {[[372, 78], [428, 78], [362, 96], [438, 96]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={4} fill={ORANGE} />)}
      <circle cx={400} cy={144} r={9} fill={FILL.purple} stroke={PURPLE} strokeWidth={1} />
      <He x={400} y={46} size={9.5} color={MUTED}>עור</He>
      <He x={400} y={180} size={9.5} color={BLUE}>צינור עצבי</He>
      <He x={400} y={198} size={9.5} color={ORANGE}>ציצה עצבית — נודדת</He>
      <He x={85} y={208} size={10} bold>1</He>
      <He x={240} y={208} size={10} bold>2</He>
      <He x={322} y={208} size={10} bold>3</He>
    </Svg>
  );
}

function CortexMigration() {
  const layers: [string, number][] = [["2/3", 70], ["4", 104], ["5", 134], ["6", 164]];
  return (
    <Svg h={262} label="נדידה בקליפה המתפתחת: סיבי גלייה רדיאלית נמתחים מהאזור החדרי (למטה) עד פני השטח. נוירונים חדשים מטפסים לאורכם. השכבות העמוקות (6, 5) נוצרות ראשונות, וכל גל מאוחר עובר אותן אל השכבות החיצוניות — 'מבפנים החוצה'. בשכבה החיצונית, תאי קחאל-רציוס מפרישים ריילין שעוצר את הנדידה.">
      <rect x={80} y={30} width={300} height={16} fill={FILL.pink} />
      <He x={230} y={42} size={9.5} color={PINK}>שכבה 1 — ריילין</He>
      {layers.map(([t, y], i) => (
        <g key={t}>
          <rect x={80} y={y - 14} width={300} height={28} fill={i % 2 ? "#f1f5f9" : "#f8fafc"} />
          <La x={394} y={y + 4} size={10} anchor="start" bold>{t}</La>
        </g>
      ))}
      <rect x={80} y={190} width={300} height={34} fill={FILL.blue} />
      <He x={230} y={212} size={10} color={BLUE}>אזור חדרי — תאי גזע (גלייה רדיאלית)</He>
      {[120, 200, 280, 340].map((x) => <line key={x} x1={x} y1={190} x2={x} y2={46} stroke={TEAL} strokeWidth={1.6} />)}
      {[[124, 160, "1"], [204, 132, "2"], [284, 104, "3"], [344, 70, "4"]].map(([x, y, n]) => (
        <g key={String(n)}>
          <ellipse cx={Number(x) + 8} cy={Number(y)} rx={6} ry={9} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.2} />
        </g>
      ))}
      <He x={60} y={74} size={9} anchor="end" color={ORANGE}>נולדו אחרונים</He>
      <He x={60} y={168} size={9} anchor="end" color={ORANGE}>נולדו ראשונים</He>
      <Arrow x1={64} y1={160} x2={64} y2={84} color={ORANGE} width={1.4} />
      <He x={230} y={248} size={9.5} color={TEAL}>הנוירונים מטפסים על סיבי הגלייה הרדיאלית</He>
    </Svg>
  );
}

function GrowthCone() {
  return (
    <Svg h={230} label="קונוס הגדילה בקצה אקסון צומח: פילופודיה חשות את הסביבה. מצד אחד מפל של אות מושך (נטרין, ירוק) — האקטין מתארך שם; מהצד השני אות דוחה (Slit, אדום) — האקטין מתפרק. הקונוס פונה לכיוון המשיכה.">
      <defs>
        <linearGradient id="nbAttr" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={RED} stopOpacity={0.35} />
          <stop offset="0.5" stopColor="white" stopOpacity={0} />
          <stop offset="1" stopColor={GREEN} stopOpacity={0.35} />
        </linearGradient>
      </defs>
      <rect x={20} y={20} width={440} height={190} fill="url(#nbAttr)" />
      <rect x={236} y={150} width={8} height={70} fill="#94a3b8" />
      <path d="M220 150 Q210 120 226 100 Q240 92 258 100 Q276 114 262 150 Z" fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      {[[226, 102, 212, 80], [236, 96, 232, 70], [248, 96, 258, 68], [258, 100, 282, 78], [264, 112, 296, 100]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke={BLUE} strokeWidth={2} strokeLinecap="round" />)}
      <path d="M262 92 Q300 70 330 60" fill="none" stroke={GREEN} strokeWidth={2} markerEnd="url(#bfArrow)" />
      <He x={420} y={120} size={11} bold color={GREEN}>נטרין — משיכה</He>
      <He x={60} y={120} size={11} bold color={RED}>Slit — דחייה</He>
      <He x={300} y={196} size={10} color={BLUE} anchor="start">קונוס הגדילה (אקטין)</He>
      <Lead x1={298} y1={192} x2={262} y2={140} />
      <He x={240} y={36} size={10} color={MUTED}>פילופודיה</He>
    </Svg>
  );
}

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

function AppProcessing() {
  return (
    <Svg h={262} label="עיבוד APP: חלבון APP חוצה את הממברנה, וקטע ה-Aβ נמצא חלקו בחוץ וחלקו בממברנה. במסלול הלא-עמילואידוגני, α-סקרטאז חותך באמצע קטע ה-Aβ — לא נוצר Aβ. במסלול העמילואידוגני, β-סקרטאז (BACE1) חותך קודם, ואחריו γ-סקרטאז (פרסנילין) — משתחרר Aβ40 או Aβ42 הדביק.">
      {[0, 1].map((r) => {
        const y = 40 + r * 110;
        return (
          <g key={r}>
            <Membrane y={y + 30} h={30} x={40} w={400} />
            <rect x={200} y={y} width={16} height={84} rx={6} fill={FILL.gray} stroke={MUTED} strokeWidth={1.2} />
            <rect x={200} y={y + 18} width={16} height={30} fill={r ? "#fca5a5" : "#fecaca"} stroke={RED} strokeWidth={1} />
            <He x={130} y={y + 10} size={10.5} bold color={r ? RED : GREEN}>{r ? "עמילואידוגני" : "לא-עמילואידוגני"}</He>
          </g>
        );
      })}
      <He x={250} y={38} size={10} anchor="start" color={GREEN}>α-סקרטאז — חותך באמצע Aβ</He>
      <Lead x1={248} y1={34} x2={208} y2={64} />
      <He x={260} y={118} size={9.5} anchor="start" color={GREEN}>לא נוצר Aβ</He>
      <He x={250} y={148} size={10} anchor="start" color={RED}>β-סקרטאז (BACE1)</He>
      <Lead x1={248} y1={144} x2={218} y2={168} />
      <He x={250} y={228} size={10} anchor="start" color={RED}>γ-סקרטאז (פרסנילין)</He>
      <Lead x1={248} y1={224} x2={218} y2={196} />
      <He x={110} y={186} size={10} anchor="end" bold color={RED}>Aβ40 / Aβ42</He>
      <Lead x1={114} y1={182} x2={198} y2={178} />
      <He x={240} y={254} size={9.5} color={MUTED}>אדום — קטע ה-Aβ</He>
    </Svg>
  );
}

// ── nb-neuroimmune ───────────────────────────────────────────────────────────
function Bbb() {
  return (
    <Svg h={262} label="מחסום דם-מוח בחתך של נים: תאי אנדותל מחוברים בצומתי הדוק סוגרים את הנים; פריציט עוטף אותו; ממברנת בסיס; ורגליים של אסטרוציטים מכסות מבחוץ. גזים ומולקולות שומניות עוברים בדיפוזיה; גלוקוז וחומצות אמינו עוברים במובילים; חלבונים ותאים כמעט לא עוברים.">
      <circle cx={180} cy={130} r={92} fill={FILL.teal} />
      <circle cx={180} cy={130} r={70} fill="#f8fafc" stroke={MUTED} strokeWidth={1} />
      <circle cx={180} cy={130} r={66} fill={FILL.pink} />
      <circle cx={180} cy={130} r={46} fill={FILL.red} />
      {[0, 90, 180, 270].map((a) => {
        const r = (a * Math.PI) / 180;
        return <rect key={a} x={180 + 56 * Math.cos(r) - 3} y={130 + 56 * Math.sin(r) - 3} width={6} height={6} fill={PURPLE} />;
      })}
      <path d="M118 74 Q150 60 168 66" fill="none" stroke={GOLD} strokeWidth={8} strokeLinecap="round" />
      <He x={180} y={136} size={10} color={RED}>דם</He>
      <He x={330} y={36} size={10} anchor="start" color={TEAL}>רגליים של אסטרוציטים</He>
      <Lead x1={328} y1={34} x2={250} y2={70} />
      <He x={330} y={70} size={10} anchor="start" color={GOLD}>פריציט</He>
      <Lead x1={328} y1={68} x2={172} y2={64} />
      <He x={330} y={104} size={10} anchor="start" color={PINK}>תאי אנדותל</He>
      <Lead x1={328} y1={102} x2={232} y2={116} />
      <He x={330} y={138} size={10} anchor="start" color={PURPLE}>צומתי הדוק</He>
      <Lead x1={328} y1={136} x2={240} y2={131} />
      <He x={330} y={186} size={9.5} anchor="start" color={GREEN}>עובר: גזים, שומניים</He>
      <He x={330} y={204} size={9.5} anchor="start" color={BLUE}>במוביל: גלוקוז, L-DOPA</He>
      <He x={330} y={222} size={9.5} anchor="start" color={RED}>כמעט לא: חלבונים, תאים</He>
    </Svg>
  );
}

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
