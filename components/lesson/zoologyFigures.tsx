/* Figures for the zoology units (Technion 134111). Original schematic drawings; layout conventions follow
   Hickman et al., Integrated Principles of Zoology (14th ed.) — never copied. Proportions are not to scale.
   Labels sit beside shapes with leader lines, never on top of a line. Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, BLUE, GREEN, INK, MUTED, ORANGE, He } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

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
function Fringe({ cx, cy, rx, ry, n, len, color, width = 1.2 }: { cx: number; cy: number; rx: number; ry: number; n: number; len: number; color: string; width?: number }) {
  return (
    <g stroke={color} strokeWidth={width} strokeLinecap="round">
      {Array.from({ length: n }, (_, i) => {
        const t = (i / n) * 2 * Math.PI;
        const x = cx + rx * Math.cos(t), y = cy + ry * Math.sin(t);
        const nx = Math.cos(t) / rx, ny = Math.sin(t) / ry, m = Math.hypot(nx, ny);
        return <line key={i} x1={x} y1={y} x2={x + (len * nx) / m} y2={y + (len * ny) / m} />;
      })}
    </g>
  );
}

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
function ProtistLocomotion() {
  return (
    <Svg h={210} label="שלוש דרכי תנועה של חד-תאיים: אמבה זורמת לתוך פסאודופודים, שוטני מונע בשוטון אחד ארוך, וריסני מונע בהרבה ריסים קצרים שמכים בתיאום.">
      <path d="M50 90 Q40 60 70 62 Q80 40 95 55 Q125 50 130 75 Q150 85 128 100 Q125 125 100 120 Q85 140 65 122 Q35 120 50 90Z" fill={FILL.orange} stroke={ORANGE} strokeWidth={1.6} />
      <circle cx={88} cy={90} r={8} fill="white" stroke={ORANGE} />
      <Arrow x1={60} y1={152} x2={115} y2={152} color={ORANGE} />
      <He x={88} y={182} size={13} bold>פסאודופודים</He>
      <He x={88} y={199} size={11} color={MUTED}>אמבה</He>

      <ellipse cx={262} cy={95} rx={34} ry={15} fill={FILL.green} stroke={GREEN} strokeWidth={1.6} />
      <circle cx={236} cy={92} r={3} fill={RED} />
      <circle cx={268} cy={96} r={6} fill="white" stroke={GREEN} />
      <path d="M228 95 q-6 -10 -12 0 t-12 0 t-12 0 t-12 0" fill="none" stroke={GREEN} strokeWidth={1.6} />
      <Arrow x1={275} y1={152} x2={215} y2={152} color={GREEN} />
      <He x={245} y={182} size={13} bold>שוטון</He>
      <He x={245} y={199} size={11} color={MUTED}>שוטני (אוגלנה)</He>

      <ellipse cx={400} cy={95} rx={44} ry={24} fill={FILL.sky} stroke={BLUE} strokeWidth={1.6} />
      <Fringe cx={400} cy={95} rx={44} ry={24} n={34} len={7} color={BLUE} />
      <circle cx={400} cy={95} r={8} fill="white" stroke={BLUE} />
      <Arrow x1={375} y1={152} x2={430} y2={152} color={BLUE} />
      <He x={400} y={182} size={13} bold>ריסים</He>
      <He x={400} y={199} size={11} color={MUTED}>ריסני (פרמציום)</He>
    </Svg>
  );
}

// ── z-paramecium ─────────────────────────────────────────────────────────────
function Paramecium() {
  const cv = (x: number, y: number) => (
    <g>
      {Array.from({ length: 6 }, (_, i) => {
        const t = (i / 6) * 2 * Math.PI;
        return <line key={i} x1={x + 9 * Math.cos(t)} y1={y + 9 * Math.sin(t)} x2={x + 20 * Math.cos(t)} y2={y + 20 * Math.sin(t)} stroke={BLUE} strokeWidth={1.4} />;
      })}
      <circle cx={x} cy={y} r={9} fill="white" stroke={BLUE} strokeWidth={1.4} />
    </g>
  );
  return (
    <Svg h={250} label="פרמציום: תא בצורת סוליה מכוסה ריסים, עם חריץ פה, בועיות מזון, מקרוגרעין גדול ומיקרוגרעין קטן, שתי בועיות מתכווצות עם תעלות, וטריכוציסטים מתחת לפליקולה.">
      <ellipse cx={240} cy={125} rx={150} ry={56} fill={FILL.sky} stroke={BLUE} strokeWidth={1.8} />
      <Fringe cx={240} cy={125} rx={150} ry={56} n={80} len={8} color={BLUE} width={1} />
      {[290, 310, 330, 350, 370].map((x) => {
        const y = 125 + 56 * Math.sqrt(1 - ((x - 240) / 150) ** 2);
        return <line key={x} x1={x} y1={y - 3} x2={x - 2} y2={y - 11} stroke={TEAL} strokeWidth={2} />;
      })}
      <path d="M118 108 Q185 152 250 140" fill="none" stroke={BLUE} strokeWidth={2.2} />
      <circle cx={253} cy={140} r={4} fill="white" stroke={BLUE} />
      {[[200, 112], [292, 122], [318, 100], [330, 143]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={7} fill={FILL.orange} stroke={ORANGE} />)}
      <ellipse cx={240} cy={108} rx={34} ry={17} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <circle cx={281} cy={100} r={5} fill={PURPLE} />
      {cv(150, 96)}{cv(352, 112)}
      <He x={100} y={30} size={11}>בועית מתכווצת</He>
      <Lead x1={110} y1={36} x2={145} y2={86} />
      <He x={222} y={30} size={11}>מקרוגרעין</He>
      <Lead x1={226} y1={36} x2={236} y2={92} />
      <He x={330} y={30} size={11}>מיקרוגרעין</He>
      <Lead x1={322} y1={36} x2={284} y2={95} />
      <He x={448} y={70} size={11}>ריסים</He>
      <Lead x1={440} y1={76} x2={392} y2={104} />
      <He x={135} y={222} size={11}>חריץ הפה</He>
      <Lead x1={140} y1={212} x2={170} y2={135} />
      <He x={250} y={222} size={11}>בועית מזון</He>
      <Lead x1={262} y1={212} x2={326} y2={149} />
      <He x={420} y={222} size={11}>טריכוציסטים</He>
      <Lead x1={410} y1={212} x2={366} y2={163} />
    </Svg>
  );
}

// ── z-sponge ─────────────────────────────────────────────────────────────────
function Sponge() {
  const pores = [110, 150, 190];
  const chY = [84, 97, 124, 137, 164, 177, 204, 217];
  const choano = (x: number, y: number, dir: 1 | -1, k: string) => (
    <g key={k}>
      <line x1={x} y1={y} x2={x + dir * 9} y2={y - 3} stroke={GREEN} strokeWidth={1} />
      <circle cx={x} cy={y} r={4.5} fill={FILL.green} stroke={GREEN} />
    </g>
  );
  return (
    <Svg h={290} label="ספוג פשוט בחתך: מים נכנסים דרך נקבוביות בדופן לחלל המרכזי, שמרופד בתאי צווארון עם שוטונים, ויוצאים דרך האוסקולום למעלה. משמאל — תא צווארון מוגדל.">
      <rect x={110} y={70} width={25} height={175} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.4} />
      <rect x={265} y={70} width={25} height={175} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.4} />
      <rect x={110} y={230} width={180} height={20} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.4} />
      <rect x={111} y={231} width={178} height={14} fill={FILL.yellow} />
      {pores.map((y) => <g key={y}><rect x={108} y={y - 4} width={29} height={8} fill="white" /><rect x={263} y={y - 4} width={29} height={8} fill="white" /></g>)}
      {chY.map((y) => choano(141, y, 1, `l${y}`))}
      {chY.map((y) => choano(259, y, -1, `r${y}`))}
      {[155, 175, 200, 225, 245].map((x) => choano(x, 224, 1, `b${x}`))}
      {pores.map((y) => <g key={y}><Arrow x1={62} y1={y} x2={132} y2={y} color={BLUE} /><Arrow x1={338} y1={y} x2={268} y2={y} color={BLUE} /></g>)}
      <Arrow x1={200} y1={150} x2={200} y2={32} color={BLUE} width={2.4} />
      <He x={212} y={40} size={11} anchor="start">אוסקולום — יציאת המים</He>
      <He x={58} y={96} size={11}>נקבובית (אוסטיה)</He>
      <He x={200} y={200} size={11} color={MUTED}>חלל מרכזי</He>
      <line x1={420} y1={224} x2={414} y2={182} stroke={GREEN} strokeWidth={1.2} />
      <line x1={436} y1={224} x2={442} y2={182} stroke={GREEN} strokeWidth={1.2} />
      {[190, 198, 206, 214].map((y) => <line key={y} x1={418 - (224 - y) * 0.1} y1={y} x2={438 + (224 - y) * 0.1} y2={y} stroke={GREEN} strokeWidth={0.6} strokeDasharray="1 2" />)}
      <path d="M428 222 q-6 -8 0 -16 t0 -16 t0 -16 t0 -16" fill="none" stroke={GREEN} strokeWidth={1.4} />
      <circle cx={428} cy={238} r={15} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <circle cx={428} cy={242} r={5} fill="white" stroke={GREEN} />
      <Lead x1={380} y1={210} x2={264} y2={178} />
      <He x={428} y={286} size={11}>תא צווארון (קואנוציט)</He>
      <He x={446} y={200} size={9} color={MUTED} anchor="start">צווארון</He>
      <He x={436} y={166} size={9} color={MUTED} anchor="start">שוטון</He>
    </Svg>
  );
}

// ── z-polyp-medusa ───────────────────────────────────────────────────────────
function PolypMedusa() {
  const tent = { fill: "none", stroke: BLUE, strokeWidth: 3.5, strokeLinecap: "round" as const };
  return (
    <Svg h={262} label="פוליפ ומדוזה: אותה תוכנית גוף הפוכה. הפוליפ צמוד למצע עם הפה והזרועות למעלה ומזוגליאה דקה; המדוזה פעמון שוחה עם הפה והזרועות למטה ומזוגליאה עבה. שלוש השכבות: אפידרמיס, מזוגליאה וגסטרודרמיס סביב חלל העיכול.">
      <path d="M103 92 Q86 64 80 40" {...tent} /><path d="M115 90 Q110 62 108 35" {...tent} />
      <path d="M145 90 Q150 62 152 35" {...tent} /><path d="M157 92 Q174 64 180 40" {...tent} />
      <rect x={100} y={90} width={60} height={130} rx={6} fill={FILL.sky} stroke={BLUE} strokeWidth={1.4} />
      <rect x={106} y={96} width={48} height={120} rx={4} fill={FILL.yellow} />
      <rect x={109} y={99} width={42} height={114} rx={4} fill={FILL.green} />
      <rect x={115} y={105} width={30} height={102} rx={3} fill="white" />
      <rect x={122} y={86} width={16} height={22} fill="white" />
      <line x1={70} y1={222} x2={190} y2={222} stroke={BROWN} strokeWidth={3} />
      <He x={130} y={62} size={11}>פה</He>
      <He x={86} y={128} size={10} anchor="end">אפידרמיס</He><Lead x1={88} y1={125} x2={102} y2={125} />
      <He x={86} y={150} size={10} anchor="end">מזוגליאה</He><Lead x1={88} y1={147} x2={107} y2={147} />
      <He x={86} y={172} size={10} anchor="end">גסטרודרמיס</He><Lead x1={88} y1={169} x2={111} y2={169} />
      <He x={86} y={196} size={10} anchor="end">חלל עיכול</He><Lead x1={88} y1={193} x2={126} y2={193} />
      <He x={60} y={240} size={10} color={MUTED}>מצע</He>
      <He x={130} y={255} size={13} bold>פוליפ</He>

      <path d="M270 140 Q272 55 350 55 Q428 55 430 140 L414 140 Q408 84 350 84 Q292 84 286 140 Z" fill={FILL.yellow} stroke={BLUE} strokeWidth={1.4} />
      <path d="M290 140 Q296 90 350 90 Q404 90 410 140" fill="none" stroke={GREEN} strokeWidth={2.5} />
      <rect x={342} y={88} width={16} height={56} rx={3} fill={FILL.green} stroke={GREEN} />
      <path d="M273 141 q-6 20 0 40 t0 40" {...tent} /><path d="M289 141 q-6 20 0 40 t0 36" {...tent} />
      <path d="M411 141 q6 20 0 40 t0 36" {...tent} /><path d="M427 141 q6 20 0 40 t0 40" {...tent} />
      <He x={350} y={42} size={10}>מזוגליאה עבה</He>
      <He x={350} y={162} size={11}>פה</He>
      <He x={350} y={255} size={13} bold>מדוזה</He>
    </Svg>
  );
}

// ── z-cnidocyte ──────────────────────────────────────────────────────────────
function Cnidocyte() {
  const coil = Array.from({ length: 7 }, (_, i) => `q${i % 2 ? -14 : 14} 5 0 10`).join(" ");
  return (
    <Svg h={250} label="תא צורב לפני הירי ואחריו. לפני: כמוסה (נמטוציסט) עם חוט מגולגל ומכסה, וקנידוציל רגיש על פני התא. אחרי גירוי: המכסה נפתח והחוט מתהפך החוצה, עם קוצים בבסיסו; הכמוסה נשארת ריקה.">
      <ellipse cx={130} cy={150} rx={55} ry={70} fill={FILL.sky} stroke={BLUE} strokeWidth={1.6} />
      <ellipse cx={130} cy={140} rx={28} ry={45} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.6} />
      <path d={`M130 104 ${coil}`} fill="none" stroke={ORANGE} strokeWidth={1.4} />
      <line x1={118} y1={96} x2={142} y2={96} stroke={ORANGE} strokeWidth={3} />
      <line x1={150} y1={84} x2={157} y2={56} stroke={INK} strokeWidth={2} />
      <circle cx={130} cy={203} r={9} fill={FILL.purple} stroke={PURPLE} />
      <He x={166} y={62} size={10} anchor="start">קנידוציל</He>
      <He x={36} y={92} size={10}>מכסה</He><Lead x1={50} y1={90} x2={117} y2={96} />
      <He x={36} y={122} size={10}>נמטוציסט</He><Lead x1={62} y1={120} x2={103} y2={128} />
      <He x={36} y={166} size={10}>חוט מגולגל</He><Lead x1={66} y1={163} x2={124} y2={160} />
      <He x={36} y={214} size={10}>גרעין</He><Lead x1={50} y1={211} x2={121} y2={205} />
      <He x={130} y={244} size={13} bold>לפני הירי</He>

      <He x={240} y={140} size={10} color={MUTED}>מגע / חומר כימי</He>
      <Arrow x1={195} y1={150} x2={282} y2={150} />

      <ellipse cx={350} cy={150} rx={55} ry={70} fill={FILL.sky} stroke={BLUE} strokeWidth={1.6} />
      <ellipse cx={350} cy={140} rx={28} ry={45} fill="white" stroke={ORANGE} strokeWidth={1.6} />
      <line x1={338} y1={95} x2={330} y2={76} stroke={ORANGE} strokeWidth={3} />
      <path d="M350 95 L350 60 Q352 30 400 22 L462 16" fill="none" stroke={ORANGE} strokeWidth={1.8} />
      {[66, 76, 86].map((y) => <g key={y}><line x1={350} y1={y} x2={343} y2={y + 6} stroke={ORANGE} strokeWidth={1.4} /><line x1={350} y1={y} x2={357} y2={y + 6} stroke={ORANGE} strokeWidth={1.4} /></g>)}
      <circle cx={350} cy={203} r={9} fill={FILL.purple} stroke={PURPLE} />
      <He x={420} y={50} size={10}>חוט שהתהפך החוצה</He>
      <He x={302} y={66} size={10}>קוצים</He><Lead x1={316} y1={70} x2={341} y2={74} />
      <He x={450} y={150} size={10}>כמוסה ריקה</He><Lead x1={422} y1={146} x2={377} y2={140} />
      <He x={350} y={244} size={13} bold>אחרי הירי</He>
    </Svg>
  );
}

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
function ArthropodPlan() {
  const muscle = { fill: "none", stroke: RED, strokeWidth: 5, strokeLinecap: "round" as const };
  return (
    <Svg h={200} label="השלד החיצוני של פרוקי רגליים. משמאל: שכבות הקוטיקולה — אפיקוטיקולה עם שעווה, פרוקוטיקולה מכיטין וחלבון (חלקה החיצוני מוקשח), ומתחתן האפידרמיס שמפריש אותן. מימין: מפרק — שני מקטעים קשיחים מחוברים בקרום גמיש, והשרירים מחוברים לשלד מבפנים.">
      <rect x={120} y={50} width={105} height={7} fill={ORANGE} />
      <rect x={120} y={57} width={105} height={30} fill="#fcd34d" />
      <rect x={120} y={87} width={105} height={40} fill={FILL.yellow} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={i}>
          <rect x={120 + i * 15} y={127} width={15} height={24} fill={FILL.green} stroke={GREEN} strokeWidth={0.8} />
          <circle cx={127.5 + i * 15} cy={140} r={3} fill={GREEN} />
        </g>
      ))}
      <He x={112} y={57} size={10} anchor="end">אפיקוטיקולה (שעווה)</He>
      <He x={112} y={76} size={10} anchor="end">אקסוקוטיקולה (מוקשחת)</He>
      <He x={112} y={111} size={10} anchor="end">אנדוקוטיקולה</He>
      <He x={112} y={143} size={10} anchor="end">אפידרמיס</He>
      <path d="M230 57 L236 57 L236 127 L230 127" fill="none" stroke={MUTED} strokeWidth={1.2} />
      <He x={242} y={88} size={10} anchor="start">פרוקוטיקולה:</He>
      <He x={242} y={102} size={10} anchor="start">כיטין + חלבון</He>
      <He x={172} y={185} size={12} bold>שכבות הקוטיקולה</He>

      <rect x={322} y={60} width={68} height={50} fill="white" stroke={BROWN} strokeWidth={4} />
      <rect x={402} y={60} width={68} height={50} fill="white" stroke={BROWN} strokeWidth={4} />
      <path d="M390 60 q6 -6 12 0" fill="none" stroke={BROWN} strokeWidth={1.4} />
      <path d="M390 110 q6 6 12 0" fill="none" stroke={BROWN} strokeWidth={1.4} />
      <path d="M334 72 Q380 66 428 72" {...muscle} />
      <path d="M334 98 Q380 104 428 98" {...muscle} />
      <He x={378} y={38} size={10}>שריר פושט</He><Lead x1={378} y1={42} x2={378} y2={66} />
      <He x={346} y={146} size={10}>שריר מכופף</He><Lead x1={350} y1={136} x2={354} y2={104} />
      <He x={440} y={146} size={10}>קרום מפרקי גמיש</He><Lead x1={428} y1={136} x2={398} y2={117} />
      <He x={396} y={185} size={12} bold>מפרק: השרירים מבפנים</He>
    </Svg>
  );
}

// ── z-tissues ────────────────────────────────────────────────────────────────
function Tissues() {
  return (
    <Svg h={292} label="ארבעה סוגי רקמות: אפיתל — תאים צפופים על קרום בסיס; רקמת חיבור — מעט תאים בחומר בין-תאי עם סיבים; רקמת שריר — סיב שריר שלד עם פסים וגרעינים רבים; רקמת עצב — נוירון עם גוף תא, דנדריטים ואקסון.">
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <rect x={30 + i * 26} y={46} width={26} height={30} fill={FILL.sky} stroke={BLUE} strokeWidth={1} />
          <circle cx={43 + i * 26} cy={62} r={4.5} fill={BLUE} />
        </g>
      ))}
      <line x1={26} y1={79} x2={216} y2={79} stroke={INK} strokeWidth={2.4} />
      <rect x={26} y={81} width={190} height={14} fill={FILL.yellow} />
      <He x={120} y={118} size={13} bold>אפיתל</He>
      <He x={120} y={134} size={10} color={MUTED}>תאים צפופים על קרום בסיס</He>

      <rect x={270} y={36} width={180} height={62} rx={6} fill={FILL.yellow} />
      {[48, 64, 80].map((y, i) => <path key={y} d={`M276 ${y} q15 -${6 + i} 30 0 t30 0 t30 0 t30 0 t30 0 t18 0`} fill="none" stroke={ORANGE} strokeWidth={1.2} />)}
      {[[300, 56], [352, 74], [410, 58], [430, 88], [326, 90]].map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx={9} ry={4} fill={FILL.purple} stroke={PURPLE} strokeWidth={0.8} />)}
      <He x={360} y={118} size={13} bold>רקמת חיבור</He>
      <He x={360} y={134} size={10} color={MUTED}>מעט תאים, הרבה חומר בין-תאי וסיבים</He>

      <rect x={30} y={182} width={180} height={36} rx={8} fill={FILL.red} stroke={RED} strokeWidth={1.2} />
      {Array.from({ length: 28 }, (_, i) => <line key={i} x1={38 + i * 6} y1={186} x2={38 + i * 6} y2={214} stroke={RED} strokeWidth={0.7} />)}
      {[60, 115, 170].map((x) => <ellipse key={x} cx={x} cy={185} rx={8} ry={3} fill={RED} />)}
      <He x={120} y={258} size={13} bold>רקמת שריר</He>
      <He x={120} y={274} size={10} color={MUTED}>סיב שריר שלד: פסים, הרבה גרעינים</He>

      {[[270, 180, 262, 170], [266, 200, 254, 196], [272, 220, 262, 230], [292, 176, 288, 164]].map(([x, y, x2, y2]) => (
        <path key={`${x}${y}`} d={`M300 200 L${x} ${y} L${x2} ${y2}`} fill="none" stroke={PURPLE} strokeWidth={1.6} />
      ))}
      <line x1={314} y1={200} x2={430} y2={200} stroke={PURPLE} strokeWidth={2} />
      {[-8, 0, 8].map((d) => <line key={d} x1={430} y1={200} x2={446} y2={200 + d} stroke={PURPLE} strokeWidth={1.4} />)}
      <circle cx={300} cy={200} r={14} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <circle cx={300} cy={200} r={4} fill={PURPLE} />
      <He x={360} y={258} size={13} bold>רקמת עצב</He>
      <He x={360} y={274} size={10} color={MUTED}>נוירון: גוף תא, דנדריטים, אקסון</He>
    </Svg>
  );
}

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
function Amphioxus() {
  return (
    <Svg w={520} h={232} label="האמפיוקסוס בחתך אורך: מיתר גב שנמשך עד קצה הראש, צינור עצבי גבי עם שלפוחית מוחית, מקטעי שריר, לוע עם חרכים רבים ואנדוסטיל ברצפתו, כיס כבדי, מעי, אטריופור, פי טבעת וזנב שממשיך אחרי פי הטבעת.">
      <path d="M30 125 Q36 86 80 80 L410 82 Q470 96 504 122 Q470 146 410 164 L80 170 Q36 166 30 125 Z" fill={FILL.gray} stroke={INK} strokeWidth={1.4} />
      {Array.from({ length: 11 }, (_, i) => 330 + i * 14).map((x) => <path key={x} d={`M${x + 9} 86 L${x} 122 L${x + 9} 158`} fill="none" stroke="#fca5a5" strokeWidth={1.2} />)}
      <rect x={70} y={112} width={180} height={36} rx={6} fill="white" stroke={GREEN} strokeWidth={1.2} />
      {Array.from({ length: 17 }, (_, i) => 84 + i * 9).map((x) => <line key={x} x1={x} y1={115} x2={x + 7} y2={145} stroke={GREEN} strokeWidth={1.2} />)}
      <line x1={80} y1={148} x2={240} y2={148} stroke={PURPLE} strokeWidth={3} />
      <path d="M256 134 L256 160 L194 160 Q190 156.5 194 153 L251 153 L251 134" fill="#fde68a" stroke={BROWN} strokeWidth={1} />
      <rect x={250} y={124} width={160} height={10} rx={4} fill="#fde68a" stroke={BROWN} strokeWidth={1} />
      <path d="M410 129 Q414 145 414 162" fill="none" stroke={BROWN} strokeWidth={2} />
      <rect x={36} y={100} width={458} height={8} rx={4} fill={FILL.teal} stroke={TEAL} strokeWidth={1.2} />
      <rect x={66} y={90} width={414} height={6} rx={3} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1} />
      <ellipse cx={64} cy={93} rx={6} ry={5} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1} />
      <circle cx={275} cy={167} r={3.5} fill="white" stroke={INK} />
      {[36, 44, 52, 60].map((x) => <line key={x} x1={x} y1={150} x2={x - 3} y2={162} stroke={INK} strokeWidth={1} />)}
      <He x={50} y={30} size={10}>שלפוחית מוחית</He><Lead x1={56} y1={34} x2={63} y2={88} />
      <He x={160} y={50} size={10}>צינור עצבי גבי</He><Lead x1={160} y1={54} x2={160} y2={89} />
      <He x={300} y={50} size={10}>מיתר הגב — עד קצה הראש</He><Lead x1={300} y1={54} x2={300} y2={100} />
      <He x={450} y={50} size={10}>מקטעי שריר</He><Lead x1={450} y1={54} x2={452} y2={90} />
      <He x={40} y={192} size={10}>פה וזיפים</He><Lead x1={40} y1={182} x2={44} y2={162} />
      <He x={130} y={192} size={10}>אנדוסטיל</He><Lead x1={130} y1={182} x2={130} y2={150} />
      <He x={290} y={192} size={10}>אטריופור</He><Lead x1={286} y1={182} x2={277} y2={171} />
      <He x={410} y={192} size={10}>פי טבעת</He><Lead x1={412} y1={182} x2={414} y2={164} />
      <He x={86} y={216} size={10}>חרכי הלוע</He><Lead x1={86} y1={206} x2={100} y2={140} />
      <He x={212} y={216} size={10}>כיס כבדי</He><Lead x1={212} y1={206} x2={215} y2={161} />
      <He x={340} y={216} size={10}>מעי</He><Lead x1={340} y1={206} x2={340} y2={135} />
      <He x={466} y={216} size={10}>זנב אחרי פי הטבעת</He><Lead x1={480} y1={206} x2={478} y2={130} />
    </Svg>
  );
}

// ── z-gut-comparison ─────────────────────────────────────────────────────────
function GutComparison() {
  const st = { fill: FILL.orange, stroke: ORANGE, strokeWidth: 1.2 };
  const ferm = { fill: FILL.green, stroke: GREEN, strokeWidth: 1.2 };
  const tube = { fill: "#fde68a", stroke: BROWN, strokeWidth: 1 };
  const name = (y: number, a: string, b: string) => (
    <g>
      <He x={475} y={y} size={12} bold anchor="end">{a}</He>
      <He x={475} y={y + 16} size={10} color={MUTED} anchor="end">{b}</He>
    </g>
  );
  return (
    <Svg h={345} label="השוואה סכמטית של מערכות עיכול: טורף — קיבה פשוטה ומעי קצר יחסית; מעלה גירה — קיבה בת ארבעה תאים עם כרס לתסיסה; תסיסה במעי האחורי — מעי עיוור ומעי גס גדולים; ציפור — זפק, קיבה בלוטית וקורקבן שרירי.">
      <rect x={30} y={42} width={50} height={6} {...tube} />
      <ellipse cx={105} cy={45} rx={26} ry={16} {...st} />
      <rect x={131} y={40} width={150} height={10} {...tube} />
      <ellipse cx={286} cy={57} rx={6} ry={5} {...tube} />
      <rect x={281} y={38} width={70} height={14} {...tube} />
      <He x={105} y={80} size={10}>קיבה</He><He x={206} y={70} size={10}>מעי דק</He><He x={316} y={76} size={10}>מעי גס</He>
      {name(42, "טורף", "כלב, חתול")}

      <rect x={30} y={127} width={36} height={6} {...tube} />
      <ellipse cx={100} cy={128} rx={34} ry={24} {...ferm} />
      <circle cx={142} cy={115} r={10} {...ferm} />
      <circle cx={162} cy={136} r={10} {...ferm} />
      <ellipse cx={192} cy={128} rx={17} ry={11} {...st} />
      <rect x={209} y={124} width={119} height={9} {...tube} />
      <rect x={328} y={122} width={32} height={13} {...tube} />
      <He x={100} y={170} size={10}>כרס</He><He x={142} y={98} size={10}>בית הכוסות</He><He x={162} y={162} size={10}>המסס</He>
      <He x={194} y={156} size={10}>קבה</He><He x={268} y={152} size={10}>מעי דק</He><He x={344} y={152} size={10}>מעי גס</He>
      {name(124, "מעלה גירה", "פרה, כבשה")}

      <rect x={30} y={211} width={50} height={6} {...tube} />
      <ellipse cx={104} cy={214} rx={24} ry={14} {...st} />
      <rect x={128} y={210} width={120} height={9} {...tube} />
      <ellipse cx={268} cy={240} rx={30} ry={18} {...ferm} />
      <rect x={248} y={206} width={112} height={16} {...ferm} />
      <He x={104} y={246} size={10}>קיבה</He><He x={188} y={240} size={10}>מעי דק</He>
      <He x={306} y={256} size={10} anchor="start">מעי עיוור</He><He x={318} y={198} size={10}>מעי גס</He>
      {name(210, "תסיסה במעי האחורי", "סוס, ארנבת")}

      <rect x={30} y={292} width={68} height={6} {...tube} />
      <ellipse cx={70} cy={304} rx={12} ry={9} {...tube} />
      <ellipse cx={110} cy={295} rx={12} ry={8} {...st} />
      <circle cx={140} cy={295} r={14} fill="#fecaca" stroke={RED} strokeWidth={3} />
      <rect x={154} y={291} width={170} height={9} {...tube} />
      <ellipse cx={330} cy={306} rx={10} ry={4} {...ferm} />
      <rect x={324} y={290} width={36} height={11} {...tube} />
      <He x={68} y={330} size={10}>זפק</He><He x={106} y={276} size={10}>קיבה בלוטית</He>
      <He x={142} y={330} size={10}>קורקבן</He><He x={238} y={320} size={10}>מעי דק</He>
      {name(290, "ציפור", "תרנגולת")}
    </Svg>
  );
}

// ── z-kidney-series ──────────────────────────────────────────────────────────
function KidneySeries() {
  return (
    <Svg h={228} label="שלוש הכליות של עובר חולייתן, מקדימה לאחור: פרונפרוס, מזונפרוס ומטנפרוס. הצינור המזונפרי (צינור וולף) מוביל לביב, והשופכן יוצא מהמטנפרוס. בבוגר: המזונפרוס בדגים ובדו-חיים, המטנפרוס באמניוטים.">
      <rect x={48} y={62} width={64} height={44} rx={6} fill={FILL.gray} stroke={MUTED} strokeDasharray="4 3" />
      {[62, 80, 98].map((x) => <path key={x} d={`M${x} 70 q6 10 0 20 q-4 10 0 25`} fill="none" stroke={MUTED} strokeWidth={1.2} />)}
      <rect x={130} y={62} width={170} height={44} rx={6} fill={FILL.sky} stroke={BLUE} strokeWidth={1.2} />
      {Array.from({ length: 13 }, (_, i) => 140 + i * 12.5).map((x) => <path key={x} d={`M${x} 70 q6 10 0 20 q-4 10 0 25`} fill="none" stroke={BLUE} strokeWidth={1.2} />)}
      <ellipse cx={350} cy={84} rx={26} ry={22} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <line x1={58} y1={115} x2={430} y2={115} stroke={BLUE} strokeWidth={2.4} />
      <path d="M350 106 Q356 128 430 124" fill="none" stroke={GREEN} strokeWidth={2.4} />
      <circle cx={440} cy={120} r={10} fill={FILL.gray} stroke={INK} strokeWidth={1.4} />
      <He x={80} y={38} size={11} bold>פרונפרוס</He><He x={80} y={52} size={9} color={MUTED}>קדמית</He>
      <He x={215} y={38} size={11} bold>מזונפרוס</He><He x={215} y={52} size={9} color={MUTED}>אמצעית</He>
      <He x={350} y={38} size={11} bold>מטנפרוס</He><He x={350} y={52} size={9} color={MUTED}>אחורית</He>
      <He x={215} y={134} size={10} color={BLUE}>צינור וולף</He>
      <He x={386} y={150} size={10} color={GREEN}>שופכן</He>
      <He x={454} y={148} size={10}>ביב</He>
      <He x={36} y={88} size={10} color={MUTED} anchor="end">קדמי</He>

      <rect x={130} y={168} width={170} height={10} rx={3} fill={BLUE} />
      <He x={122} y={177} size={10} anchor="end">בוגר: דגים ודו-חיים</He>
      <rect x={324} y={196} width={52} height={10} rx={3} fill={GREEN} />
      <He x={316} y={205} size={10} anchor="end">בוגר: זוחלים, ציפורים, יונקים</He>
    </Svg>
  );
}

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
function BirdLung() {
  const num = (x: number, y: number, n: string) => <He x={x} y={y} size={12} bold color={RED}>{n}</He>;
  return (
    <Svg h={262} label="זרימת האוויר בציפור: בשאיפה הראשונה האוויר עובר בברונכוס לשקי האוויר האחוריים; בנשיפה — מהם לריאה; בשאיפה השנייה — מהריאה לשקי האוויר הקדמיים; ובנשיפה השנייה — החוצה. בריאה האוויר זורם תמיד באותו כיוון.">
      <rect x={20} y={14} width={16} height={162} rx={6} fill={FILL.gray} stroke={INK} strokeWidth={1.2} />
      <rect x={20} y={164} width={340} height={12} rx={6} fill={FILL.gray} stroke={INK} strokeWidth={1.2} />
      <ellipse cx={105} cy={105} rx={45} ry={38} fill={FILL.sky} stroke={BLUE} strokeWidth={1.4} />
      <rect x={180} y={82} width={130} height={46} rx={8} fill={FILL.red} stroke={RED} strokeWidth={1.4} />
      {[92, 101, 110, 119].map((y) => <line key={y} x1={186} y1={y} x2={304} y2={y} stroke={RED} strokeWidth={0.8} />)}
      <ellipse cx={405} cy={110} rx={55} ry={46} fill={FILL.sky} stroke={BLUE} strokeWidth={1.4} />
      <Arrow x1={28} y1={22} x2={28} y2={160} color={BLUE} />
      <Arrow x1={44} y1={170} x2={350} y2={170} color={BLUE} />
      <Arrow x1={356} y1={168} x2={372} y2={150} color={BLUE} />
      <Arrow x1={362} y1={105} x2={316} y2={105} color={BLUE} />
      <Arrow x1={176} y1={105} x2={154} y2={105} color={BLUE} />
      <Arrow x1={70} y1={78} x2={40} y2={42} color={BLUE} />
      {num(46, 120, "1")}{num(338, 96, "2")}{num(166, 96, "3")}{num(62, 52, "4")}
      <He x={105} y={58} size={10}>שקי אוויר קדמיים</He>
      <He x={245} y={72} size={10}>ריאה (פרברונכים)</He>
      <He x={405} y={56} size={10}>שקי אוויר אחוריים</He>
      <He x={44} y={14} size={10} anchor="start">קנה הנשימה</He>
      <He x={200} y={192} size={10} color={MUTED}>ברונכוס ראשי</He>
      <He x={470} y={218} size={10} anchor="end">1 — שאיפה: לשקים האחוריים</He>
      <He x={470} y={238} size={10} anchor="end">2 — נשיפה: מהשקים האחוריים לריאה</He>
      <He x={230} y={218} size={10} anchor="end">3 — שאיפה: מהריאה לשקים הקדמיים</He>
      <He x={230} y={238} size={10} anchor="end">4 — נשיפה: מהשקים הקדמיים החוצה</He>
    </Svg>
  );
}

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
function BrainComparison() {
  const C = { olf: GREEN, cer: BLUE, tec: ORANGE, cb: PURPLE, med: MUTED };
  const sh = (c: string) => ({ fill: c, fillOpacity: 0.25, stroke: c, strokeWidth: 1.4 });
  const cord = (x: number, y: number) => <rect x={x} y={y - 6} width={270 - x} height={12} rx={5} {...sh(C.med)} />;
  const legend: [string, string][] = [["אונת ריח", C.olf], ["מוח קצה (המיספרות)", C.cer], ["טקטום — מוח תיכון (ראייה)", C.tec], ["מוחון", C.cb], ["מוח מוארך וחוט השדרה", C.med]];
  return (
    <Svg h={278} label="מוחות של דג, ציפור ויונק, מבט מהצד (הקדמי משמאל): בדג — אונות ריח וטקטום בולטים ומוח קצה קטן; בציפור — מוח קצה גדול, טקטום גדול ומוחון גדול; ביונק — מוח קצה ענק עם קפלים שמכסה את רוב המוח.">
      {cord(190, 52)}
      <ellipse cx={60} cy={52} rx={10} ry={7} {...sh(C.olf)} />
      <ellipse cx={94} cy={52} rx={18} ry={13} {...sh(C.cer)} />
      <ellipse cx={140} cy={48} rx={24} ry={17} {...sh(C.tec)} />
      <ellipse cx={180} cy={50} rx={14} ry={12} {...sh(C.cb)} />
      <He x={290} y={56} size={12} bold anchor="start">דג</He>

      {cord(200, 134)}
      <ellipse cx={56} cy={130} rx={6} ry={4} {...sh(C.olf)} />
      <ellipse cx={150} cy={152} rx={17} ry={12} {...sh(C.tec)} />
      <ellipse cx={108} cy={124} rx={46} ry={30} {...sh(C.cer)} />
      <ellipse cx={184} cy={122} rx={18} ry={22} {...sh(C.cb)} />
      {[112, 120, 128].map((y) => <line key={y} x1={172} y1={y} x2={196} y2={y} stroke={C.cb} strokeWidth={1} />)}
      <He x={290} y={138} size={12} bold anchor="start">ציפור</He>

      {cord(214, 246)}
      <ellipse cx={44} cy={236} rx={8} ry={5} {...sh(C.olf)} />
      <ellipse cx={204} cy={238} rx={22} ry={15} {...sh(C.cb)} />
      {[230, 238, 246].map((y) => <line key={y} x1={186} y1={y} x2={222} y2={y} stroke={C.cb} strokeWidth={1} />)}
      <ellipse cx={120} cy={216} rx={70} ry={40} {...sh(C.cer)} />
      {["M80 196 q8 10 0 20 q-8 10 0 20", "M112 184 q8 12 0 24 q-8 12 0 24", "M146 188 q8 10 0 20 q-8 10 0 20"].map((d) => <path key={d} d={d} fill="none" stroke={C.cer} strokeWidth={1} />)}
      <He x={290} y={242} size={12} bold anchor="start">יונק</He>

      {legend.map(([t, c], i) => (
        <g key={t}>
          <rect x={456} y={78 + i * 24} width={14} height={12} rx={2} {...sh(c)} />
          <He x={450} y={88 + i * 24} size={10} anchor="end">{t}</He>
        </g>
      ))}
    </Svg>
  );
}

// ── z-hair-cell ──────────────────────────────────────────────────────────────
function HairCell() {
  const cell = (cx: number, tilt: number, spikes: number, title: string, sub: string, arrow: number) => {
    const heights = [20, 26, 32, 38, 44];
    return (
      <g>
        <He x={cx} y={22} size={11} bold>{title}</He>
        {arrow !== 0 && <Arrow x1={cx - arrow * 16} y1={40} x2={cx + arrow * 16} y2={40} color={RED} />}
        <g transform={`rotate(${tilt} ${cx} 110)`}>
          {heights.map((h, i) => <line key={h} x1={cx - 16 + i * 7} y1={110} x2={cx - 16 + i * 7} y2={110 - h} stroke={TEAL} strokeWidth={2.4} strokeLinecap="round" />)}
          <line x1={cx + 19} y1={110} x2={cx + 19} y2={58} stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
        </g>
        <rect x={cx - 26} y={110} width={52} height={66} rx={10} fill={FILL.teal} stroke={TEAL} strokeWidth={1.4} />
        <circle cx={cx} cy={150} r={8} fill="white" stroke={TEAL} />
        <line x1={cx} y1={176} x2={cx} y2={198} stroke={PURPLE} strokeWidth={2} />
        <line x1={cx - 44} y1={222} x2={cx + 44} y2={222} stroke={MUTED} strokeWidth={1} />
        {Array.from({ length: spikes }, (_, i) => {
          const x = cx - 40 + ((i + 0.5) * 80) / spikes;
          return <line key={i} x1={x} y1={222} x2={x} y2={206} stroke={PURPLE} strokeWidth={1.6} />;
        })}
        <He x={cx} y={240} size={10} color={MUTED}>{sub}</He>
      </g>
    );
  };
  return (
    <Svg h={250} label="תא שערה: כשהצרור מתכופף לעבר השערה הארוכה (הקינוציליום), התא משחרר יותר מוליך ותדירות הפוטנציאלים בעצב עולה; כשהוא מתכופף לכיוון ההפוך — התדירות יורדת מתחת לקצב הבסיסי.">
      {cell(80, 0, 5, "מנוחה", "קצב בסיסי", 0)}
      {cell(240, 18, 12, "כפיפה לעבר הארוכה", "יותר פוטנציאלי פעולה", 1)}
      {cell(400, -18, 1, "כפיפה הפוכה", "פחות פוטנציאלי פעולה", -1)}
      <He x={142} y={56} size={10} anchor="start">קינוציליום</He><Lead x1={140} y1={58} x2={102} y2={60} />
      <He x={30} y={74} size={10}>סטריאוצילים</He><Lead x1={40} y1={80} x2={64} y2={90} />
      <He x={88} y={194} size={10} anchor="start" color={PURPLE}>עצב</He>
    </Svg>
  );
}

// ── z-skin-layers ────────────────────────────────────────────────────────────
function SkinLayers() {
  const X0 = 110, X1 = 330;
  return (
    <Svg h={262} label="חתך בעור של חולייתן יבשתי: אפידרמיס רב-שכבתי (מאקטודרם) — תאים מתחלקים בבסיס ושכבה עליונה מתקרנת; דרמיס (רקמת חיבור) עם כלי דם, עצבים ותאי פיגמנט; ומתחת — שכבה תת-עורית של רקמת שומן.">
      <rect x={X0} y={40} width={X1 - X0} height={12} fill="#fdba74" />
      {[44, 48].map((y) => <line key={y} x1={X0 + 4} y1={y} x2={X1 - 4} y2={y} stroke={BROWN} strokeWidth={0.6} />)}
      {[[56, 12, 20], [70, 15, 18], [86, 14, 16]].map(([y, h, w], r) =>
        Array.from({ length: Math.floor((X1 - X0) / w) }, (_, i) => (
          <g key={`${r}-${i}`}>
            <rect x={X0 + i * w + (r % 2) * 4} y={y - 4} width={w} height={h} fill={FILL.pink} stroke="#db2777" strokeWidth={0.6} />
            <circle cx={X0 + i * w + (r % 2) * 4 + w / 2} cy={y - 4 + h / 2} r={2} fill="#db2777" />
          </g>
        )),
      )}
      <rect x={X0} y={96} width={X1 - X0} height={4} fill="white" />
      <line x1={X0} y1={100} x2={X1} y2={100} stroke={INK} strokeWidth={1.4} />
      <rect x={X0} y={101} width={X1 - X0} height={89} fill={FILL.yellow} />
      {[120, 140, 160, 178].map((y, i) => <path key={y} d={`M${X0 + 6} ${y} q12 -${4 + i} 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t16 0`} fill="none" stroke={ORANGE} strokeWidth={0.8} />)}
      <path d="M200 190 L200 128 Q210 112 220 128 L220 190" fill="none" stroke={RED} strokeWidth={2.4} />
      <path d="M270 190 Q266 160 280 140 Q290 125 288 110" fill="none" stroke={PURPLE} strokeWidth={2} />
      <path d="M150 106 l4 4 l6 -2 l-3 6 l4 5 l-6 0 l-3 6 l-2 -6 l-6 -1 l5 -4z" fill={BROWN} />
      {Array.from({ length: 11 }, (_, i) => <circle key={i} cx={X0 + 10 + i * 20} cy={i % 2 ? 222 : 212} r={10} fill="#fef9c3" stroke="#ca8a04" strokeWidth={1} />)}
      {[[338, 40, 100, "אפידרמיס (אקטודרם)"], [338, 101, 190, "דרמיס (מזודרם)"], [338, 192, 236, "תת-עור (שומן)"]].map(([x, a, b, t]) => (
        <g key={t as string}>
          <path d={`M${x} ${a} L${(x as number) + 6} ${a} L${(x as number) + 6} ${b} L${x} ${b}`} fill="none" stroke={MUTED} strokeWidth={1.2} />
          <He x={(x as number) + 14} y={((a as number) + (b as number)) / 2 + 4} size={11} anchor="start">{t as string}</He>
        </g>
      ))}
      <He x={100} y={50} size={10} anchor="end">שכבה מתקרנת</He>
      <He x={100} y={92} size={10} anchor="end">תאים מתחלקים</He>
      <He x={100} y={124} size={10} anchor="end">תא פיגמנט</He><Lead x1={102} y1={121} x2={146} y2={113} />
      <He x={100} y={156} size={10} anchor="end">כלי דם</He><Lead x1={102} y1={153} x2={199} y2={150} />
      <He x={100} y={256} size={10} anchor="end">תאי שומן</He><Lead x1={102} y1={250} x2={118} y2={232} />
      <He x={300} y={256} size={10}>עצב</He><Lead x1={296} y1={246} x2={272} y2={186} />
    </Svg>
  );
}

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
