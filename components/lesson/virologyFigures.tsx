/* Figures for the molecular virology units (Technion 134039). Original schematic drawings — never copied from a
   textbook; curves are hypothetical illustrations, not experimental data or universal kinetics.
   Labels sit beside shapes, lines and arrows, never on them. Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, BLUE, GREEN, INK, MUTED, ORANGE, He, La, scale, dash } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

const PURPLE = "#7c3aed";
const RED = "#b91c1c";
const TEAL = "#0f766e";
const GOLD = "#a16207";
const FILL = { blue: "#dbeafe", green: "#dcfce7", orange: "#ffedd5", purple: "#ede9fe", yellow: "#fef3c7", gray: "#f1f5f9", red: "#fee2e2", sky: "#e0f2fe", teal: "#ccfbf1" };

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

// A regular polygon (pentagon / hexagon) used for capsid subunits.
const poly = (cx: number, cy: number, r: number, n: number, rot = -Math.PI / 2) =>
  Array.from({ length: n }, (_, i) => {
    const a = rot + (2 * Math.PI * i) / n;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

// ── vr-properties ────────────────────────────────────────────────────────────
function Architecture() {
  const sub = (x: number, y: number, c: string) => <rect x={x} y={y} width={9} height={9} rx={1.5} fill={c} fillOpacity={0.85} />;
  return (
    <Svg h={300} label="חזרתיות בקפסיד. משמאל: גן אחד מקודד תת-יחידה אחת, שממנה נבנים עשרות עד מאות עותקים. במרכז: סידור סלילי שבו האורך נקבע לפי אורך הגנום. מימין: קפסיד איקוסהדרלי, שבו 12 מחומשים יושבים בקודקודים ומספר המשושים גדל עם מספר הטריאנגולציה.">
      {/* one gene → many copies */}
      <He x={420} y={26} size={12} bold color={INK}>גן אחד, הרבה עותקים</He>
      <rect x={338} y={40} width={110} height={16} rx={3} fill={FILL.yellow} stroke={GOLD} strokeWidth={1.2} />
      <He x={393} y={52} size={9.5} color={GOLD}>גן תת-היחידה</He>
      <Arrow x1={393} y1={62} x2={393} y2={82} color={MUTED} width={1.4} />
      {Array.from({ length: 24 }, (_, i) => <g key={i}>{sub(344 + (i % 8) * 13, 90 + Math.floor(i / 8) * 13, BLUE)}</g>)}
      <He x={393} y={142} size={9.5} color={MUTED}>תרגום חוזר — מאגר תת-יחידות</He>

      {/* helical */}
      <He x={240} y={26} size={12} bold color={TEAL}>סלילי</He>
      <path d="M 170 60 Q 185 48 200 60 T 230 60 T 260 60 T 290 60 T 310 60" fill="none" stroke={GOLD} strokeWidth={2} />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={168 + i * 10.5} y={46} width={8} height={28} rx={2} fill={FILL.teal} stroke={TEAL} strokeWidth={1} />
      ))}
      <He x={240} y={92} size={9.5} color={MUTED}>האורך נקבע לפי אורך הגנום</He>
      <He x={240} y={108} size={9.5} color={GOLD}>הקו הצהוב: חומצת הגרעין</He>

      {/* icosahedral: T = 1 vs T = 3 */}
      <He x={240} y={150} size={12} bold color={PURPLE}>איקוסהדרלי</He>
      <g>
        <polygon points={poly(150, 215, 48, 6)} fill="none" stroke={MUTED} strokeWidth={1} {...dash} />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = -Math.PI / 2 + (2 * Math.PI * i) / 5;
          return <polygon key={i} points={poly(150 + 26 * Math.cos(a), 215 + 26 * Math.sin(a), 13, 5)} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />;
        })}
        <He x={150} y={272} size={10.5} bold color={PURPLE}>T = 1 · 60 תת-יחידות</He>
        <He x={150} y={288} size={9.5} color={MUTED}>רק מחומשים</He>
      </g>
      <g>
        <polygon points={poly(330, 215, 52, 6)} fill="none" stroke={MUTED} strokeWidth={1} {...dash} />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = -Math.PI / 2 + (2 * Math.PI * i) / 5;
          return <polygon key={i} points={poly(330 + 34 * Math.cos(a), 215 + 34 * Math.sin(a), 12, 5)} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />;
        })}
        {[0, 1, 2, 3, 4].map((i) => {
          const a = -Math.PI / 2 + Math.PI / 5 + (2 * Math.PI * i) / 5;
          return <polygon key={i} points={poly(330 + 34 * Math.cos(a), 215 + 34 * Math.sin(a), 12, 6)} fill={FILL.sky} stroke={BLUE} strokeWidth={1.2} />;
        })}
        <polygon points={poly(330, 215, 12, 6)} fill={FILL.sky} stroke={BLUE} strokeWidth={1.2} />
        <He x={330} y={276} size={10.5} bold color={PURPLE}>T = 3 · 180 תת-יחידות</He>
        <He x={330} y={288} size={9.5} color={BLUE}>12 מחומשים + משושים (כחול)</He>
      </g>
      <He x={60} y={200} size={10} color={MUTED}>סכמטי:</He>
      <He x={60} y={218} size={10} color={MUTED}>מספר המחומשים</He>
      <He x={60} y={234} size={10} color={MUTED}>קבוע — 12</He>
    </Svg>
  );
}

// ── vr-methods ───────────────────────────────────────────────────────────────
function OneStepGrowth() {
  // Illustrative one-step curve: eclipse 10 min, latent period 20 min, burst 100 per cell, rise over 15 min.
  const s = scale(60, 440, 230, 40, 0, 50, -1, 2.3);
  const log10 = (v: number) => Math.log10(Math.max(v, 1e-3));
  const intra = (t: number) => (t < 10 ? 0.1 : Math.min(100, 0.1 + 99.9 * ((t - 10) / 22)));
  const extra = (t: number) => (t < 20 ? 0.1 : Math.min(100, 0.1 + 99.9 * ((t - 20) / 15)));
  const path = (f: (t: number) => number) => {
    let d = "";
    for (let i = 0; i <= 120; i++) {
      const t = (50 * i) / 120;
      d += `${i ? "L" : "M"}${s.sx(t).toFixed(1)} ${s.sy(log10(f(t))).toFixed(1)}`;
    }
    return d;
  };
  return (
    <Svg h={300} label="עקומות דוגמה של יחידות מידבקות לתא בסולם לוגריתמי. רצפת המדידה מייצגת ערכים מתחת לסף ולא ספירה חיובית ממשית בתקופת האפלה. בדוגמה זו האות התאי עולה לפני החוץ תאי. המספרים והסדר אינם כלל לכל הנגיפים.">
      <rect x={s.sx(0)} y={40} width={s.sx(10) - s.sx(0)} height={190} fill={FILL.gray} />
      <rect x={s.sx(10)} y={40} width={s.sx(20) - s.sx(10)} height={190} fill={FILL.yellow} fillOpacity={0.5} />
      <path d={path(intra)} fill="none" stroke={BLUE} strokeWidth={2.2} />
      <path d={path(extra)} fill="none" stroke={ORANGE} strokeWidth={2.2} {...dash} />
      <line x1={60} y1={230} x2={448} y2={230} stroke={INK} strokeWidth={1.4} />
      <line x1={60} y1={230} x2={60} y2={36} stroke={INK} strokeWidth={1.4} />
      {[0, 10, 20, 30, 40, 50].map((t) => (
        <g key={t}>
          <line x1={s.sx(t)} y1={230} x2={s.sx(t)} y2={234} stroke={INK} strokeWidth={1} />
          <La x={s.sx(t)} y={247} size={10} color={MUTED}>{t}</La>
        </g>
      ))}
      {[-1, 0, 1, 2].map((e) => (
        <g key={e}>
          <line x1={56} y1={s.sy(e)} x2={60} y2={s.sy(e)} stroke={INK} strokeWidth={1} />
          <La x={50} y={s.sy(e) + 4} size={10} anchor="end" color={MUTED}>{`10${e < 0 ? "⁻¹" : e === 0 ? "⁰" : e === 1 ? "¹" : "²"}`}</La>
        </g>
      ))}
      <He x={250} y={268} size={10.5} color={MUTED}>זמן מההדבקה (דקות)</He>
      <He x={22} y={135} size={10.5} color={MUTED} rotate={-90}>חלקיקים מדבקים לתא</He>
      <He x={s.sx(5)} y={60} size={9.5} color={MUTED}>תקופת אפלה</He>
      <He x={s.sx(15)} y={60} size={9.5} color={GOLD}>בתוך התא בלבד</He>
      <He x={s.sx(34)} y={s.sy(log10(intra(34))) - 10} size={10.5} anchor="end" color={BLUE} bold>תוך-תאי</He>
      <He x={s.sx(40)} y={s.sy(log10(extra(40))) + 18} size={10.5} anchor="end" color={ORANGE} bold>מחוץ לתא</He>
      <Arrow x1={s.sx(0)} y1={214} x2={s.sx(20)} y2={214} color={INK} width={1.2} />
      <He x={s.sx(24)} y={218} size={9.5} anchor="start" color={INK}>תקופת המתנה</He>
      <line x1={s.sx(46)} y1={s.sy(0)} x2={s.sx(46)} y2={s.sy(2)} stroke={GREEN} strokeWidth={1.6} />
      <He x={s.sx(46) - 7} y={s.sy(1)} size={10} anchor="end" color={GREEN}>גודל מנה</He>
      <He x={250} y={288} size={9.5} color={MUTED}>נתונים מדומים; קו התחתית מייצג ערכים מתחת לסף</He>
    </Svg>
  );
}

// ── vr-attachment-entry ──────────────────────────────────────────────────────
function EntrySteps() {
  const phage = (cx: number, cy: number, tail = 26) => (
    <g>
      <polygon points={poly(cx, cy, 13, 6)} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.4} />
      <line x1={cx} y1={cy + 13} x2={cx} y2={cy + 13 + tail} stroke={ORANGE} strokeWidth={3} />
      <rect x={cx - 9} y={cy + 13 + tail} width={18} height={5} rx={1.5} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.2} />
    </g>
  );
  const envelope = (x: number) => (
    <g>
      <line x1={x} y1={168} x2={x + 128} y2={168} stroke={MUTED} strokeWidth={2.6} />
      <rect x={x} y={176} width={128} height={7} fill={FILL.gray} stroke={MUTED} strokeWidth={1} />
      <line x1={x} y1={191} x2={x + 128} y2={191} stroke={MUTED} strokeWidth={2.6} />
    </g>
  );
  return (
    <Svg h={300} label="שלושה שלבים בכניסה של פאג' עם זנב. בשלב הראשון הסיבים נוגעים ברכיבים על פני החיידק, והקשירה עדיין הפיכה. בשלב השני מגע נוסף משנה את הבסיס והקשירה נעשית בלתי הפיכה. בשלב השלישי נפתח נתיב מקומי דרך שתי הממברנות והדופן, רק הגנום עובר פנימה, והקפסיד הריק נשאר בחוץ.">
      <He x={416} y={30} size={11.5} bold color={INK}>1 · ספיחה הפיכה</He>
      {phage(416, 78)}
      {envelope(352)}
      <path d="M 404 120 q -8 20 -14 42 M 428 120 q 8 20 14 42" fill="none" stroke={ORANGE} strokeWidth={1.4} />
      <He x={416} y={216} size={9.5} color={MUTED}>מגע חולף — אפשר להשתחרר</He>

      <He x={240} y={30} size={11.5} bold color={INK}>2 · בלתי הפיכה</He>
      {phage(240, 78)}
      {envelope(176)}
      <path d="M 228 120 q -6 22 -10 44 M 252 120 q 6 22 10 44" fill="none" stroke={RED} strokeWidth={1.6} />
      <ellipse cx={240} cy={166} rx={16} ry={5} fill={FILL.red} stroke={RED} strokeWidth={1.2} />
      <He x={240} y={216} size={9.5} color={RED}>נקודת ההתחייבות</He>

      <He x={64} y={30} size={11.5} bold color={INK}>3 · הגנום נכנס</He>
      <g opacity={0.95}>
        <polygon points={poly(64, 78, 13, 6)} fill="#fff" stroke={ORANGE} strokeWidth={1.4} strokeDasharray="3 2" />
        <line x1={64} y1={91} x2={64} y2={117} stroke={ORANGE} strokeWidth={3} />
        <rect x={55} y={117} width={18} height={5} rx={1.5} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.2} />
      </g>
      {envelope(0)}
      <rect x={58} y={166} width={12} height={27} fill="#fff" stroke={TEAL} strokeWidth={1.2} />
      <line x1={64} y1={122} x2={64} y2={200} stroke={GOLD} strokeWidth={2.4} />
      <Arrow x1={64} y1={194} x2={64} y2={222} color={GOLD} width={1.6} />
      <He x={100} y={150} size={9} anchor="start" color={TEAL}>נתיב מקומי</He>
      <He x={64} y={242} size={9.5} color={GOLD}>רק ה-DNA נכנס</He>
      <He x={64} y={260} size={9.5} color={MUTED}>הקפסיד נשאר בחוץ</He>

      <He x={240} y={286} size={10} color={MUTED}>סכמטי · הקווים האופקיים: שתי הממברנות והדופן ביניהן</He>
    </Svg>
  );
}

// ── vr-dna-expression ────────────────────────────────────────────────────────
function TemporalCascade() {
  const band = (y: number, x: number, w: number, fill: string, stroke: string, label: string) => (
    <g>
      <rect x={x} y={y} width={w} height={26} rx={6} fill={fill} stroke={stroke} strokeWidth={1.3} />
      <He x={x + w / 2} y={y + 17} size={10.5} bold>{label}</He>
    </g>
  );
  return (
    <Svg h={310} label="מפל השעתוק של נגיף DNA. מכונת התא קוראת את הגל המוקדם; בין תוצריו הכלי שקורא את הגל המאוחר, ולכן הגל המאוחר אינו תלוי עוד במכונת התא. שכפול הגנום מפריד בין השניים. מתחת: שתי הדרכים להחליף קורא — פולימראז נגיפי חדש, או שינוי הסגוליות של הפולימראז הקיים.">
      <Box x={318} y={34} w={132} h={30} fill={FILL.sky} stroke={BLUE} size={10.5}>מכונת השעתוק של התא</Box>
      <Arrow x1={384} y1={68} x2={384} y2={88} color={BLUE} width={1.5} />
      {band(92, 318, 132, FILL.yellow, GOLD, "גנים מוקדמים")}
      <He x={384} y={136} size={9.5} color={MUTED}>אנזימים והכנת התא</He>

      <Arrow x1={314} y1={105} x2={272} y2={105} color={INK} width={1.5} />
      <Box x={166} y={92} w={104} h={26} fill={FILL.red} stroke={RED} size={10}>הכלי לגל הבא</Box>
      <Arrow x1={218} y1={122} x2={218} y2={146} color={RED} width={1.5} />
      {band(150, 166, 104, FILL.orange, ORANGE, "גנים מאוחרים")}
      <He x={218} y={192} size={9.5} color={MUTED}>חלבוני מבנה, בכמות גדולה</He>

      <line x1={296} y1={146} x2={296} y2={182} stroke={PURPLE} strokeWidth={1.6} {...dash} />
      <He x={296} y={200} size={9.5} color={PURPLE}>שכפול הגנום</He>

      <rect x={30} y={226} width={420} height={70} rx={12} fill={FILL.gray} stroke={MUTED} strokeWidth={1.2} />
      <He x={436} y={246} size={10.5} anchor="end" bold color={INK}>שתי דרכים להחליף קורא</He>
      <He x={436} y={266} size={10} anchor="end">א. פולימראז נגיפי חדש, שמזהה רק מקדמים של הנגיף</He>
      <He x={436} y={286} size={10} anchor="end">ב. שינוי הסגוליות של הפולימראז של התא — אותו אנזים, מקדמים אחרים</He>
    </Svg>
  );
}

// ── vr-rna-expression ────────────────────────────────────────────────────────
function RnaTranslationSwitch() {
  const strand = (y: number, color: string) => <line x1={90} y1={y} x2={400} y2={y} stroke={color} strokeWidth={5} strokeLinecap="round" />;
  return (
    <Svg h={290} label="התנגשות בין תרגום לשכפול על אותו גדיל. הריבוזום נע מהקצה החמישי לשלישי, והפולימראז קורא את אותה תבנית בכיוון ההפוך. לכן צריך מעבר מסודר: קודם תרגום, ואחר כך פינוי התבנית לשכפול.">
      {/* translation */}
      <He x={420} y={34} size={11.5} bold color={BLUE}>שלב א: תרגום</He>
      {strand(60, GOLD)}
      <La x={84} y={64} size={10} anchor="end" color={MUTED}>5′</La>
      <La x={406} y={64} size={10} anchor="start" color={MUTED}>3′</La>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <ellipse cx={150 + i * 90} cy={50} rx={20} ry={14} fill={FILL.blue} stroke={BLUE} strokeWidth={1.3} />
          <He x={150 + i * 90} y={54} size={9}>ריבוזום</He>
        </g>
      ))}
      <Arrow x1={130} y1={28} x2={330} y2={28} color={BLUE} width={1.6} />
      <La x={230} y={22} size={9.5} color={BLUE}>5′ → 3′</La>

      {/* replication */}
      <He x={420} y={128} size={11.5} bold color={RED}>שלב ב: שכפול</He>
      {strand(154, GOLD)}
      <La x={84} y={158} size={10} anchor="end" color={MUTED}>5′</La>
      <La x={406} y={158} size={10} anchor="start" color={MUTED}>3′</La>
      <g>
        <polygon points={poly(300, 144, 16, 5)} fill={FILL.red} stroke={RED} strokeWidth={1.3} />
        <La x={300} y={148} size={9} color={RED} bold>RdRp</La>
      </g>
      <Arrow x1={330} y1={122} x2={150} y2={122} color={RED} width={1.6} />
      <He x={240} y={116} size={9.5} color={RED}>קורא את התבנית בכיוון ההפוך</He>
      <line x1={150} y1={168} x2={300} y2={168} stroke={PURPLE} strokeWidth={3} />
      <He x={225} y={186} size={9.5} color={PURPLE}>הגדיל החדש, המשלים</He>

      {/* the clash + resolution */}
      <rect x={60} y={204} width={360} height={70} rx={10} fill={FILL.yellow} stroke={GOLD} strokeWidth={1.2} />
      <He x={240} y={226} size={11} bold color={GOLD}>אותה מולקולה, שני שימושים מנוגדים</He>
      <He x={240} y={246} size={10}>ריבוזום שנע קדימה חוסם פולימראז שנע לאחור</He>
      <He x={240} y={264} size={10}>← צריך לפנות את התבנית לפני המעבר לשכפול</He>
    </Svg>
  );
}

// ── vr-genome-replication ────────────────────────────────────────────────────
function ReplicationOrigin() {
  return (
    <Svg h={300} label="שכפול מגנום מעגלי קטן בגרעין. חלבון זיהוי מוצא נקשר לאזור המוצא, פותח את הגדילים ויוצר שני מזלגות שנעים בכיוונים מנוגדים. המכונה שמאריכה את הגדילים היא של התא. בכל מזלג גדיל מוביל רציף וגדיל מתעכב במקטעים.">
      <circle cx={150} cy={120} r={66} fill="none" stroke={GOLD} strokeWidth={3} />
      <circle cx={150} cy={54} r={9} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.5} />
      <He x={150} y={30} size={10.5} bold color={ORANGE}>אזור מוצא</He>
      <He x={150} y={200} size={10.5} color={MUTED}>גנום מעגלי</He>
      <He x={150} y={215} size={9.5} color={MUTED}>כרומטין של התא סביב הגנום</He>

      <Arrow x1={300} y1={60} x2={250} y2={60} color={MUTED} width={1.4} />
      <He x={376} y={64} size={10.5} color={INK}>זיהוי המוצא ופתיחה</He>

      <g>
        <circle cx={360} cy={130} r={54} fill="none" stroke={GOLD} strokeWidth={3} />
        <circle cx={360} cy={76} r={10} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.5} />
        <path d="M 360 76 A 54 54 0 0 1 404 108" fill="none" stroke={PURPLE} strokeWidth={3} />
        <path d="M 360 76 A 54 54 0 0 0 316 108" fill="none" stroke={PURPLE} strokeWidth={3} />
        <Arrow x1={400} y1={96} x2={414} y2={122} color={PURPLE} width={1.5} />
        <Arrow x1={320} y1={96} x2={306} y2={122} color={PURPLE} width={1.5} />
        <He x={360} y={198} size={10} color={PURPLE}>שני מזלגות, כיוונים מנוגדים</He>
      </g>

      <rect x={40} y={236} width={400} height={56} rx={10} fill={FILL.sky} stroke={BLUE} strokeWidth={1.2} />
      <He x={430} y={256} size={10.5} anchor="end" bold color={BLUE}>בכל מזלג</He>
      <He x={430} y={276} size={10} anchor="end">גדיל מוביל — סינתזה רציפה · גדיל מתעכב — מקטעים שמחוברים אחר כך</He>
      <He x={240} y={232} size={9.5} color={MUTED}>זיהוי ופתיחה: T antigen · הארכה: גורמי תא</He>
    </Svg>
  );
}

// ── vr-assembly-packaging ────────────────────────────────────────────────────
function PackagingMotor() {
  return (
    <Svg h={290} label="אריזת גנום לתוך מעטפת מוכנה. פרוקפסיד ריק נבנה סביב פיגום, שער יושב בקודקוד אחד, ומנוע שצורך ATP מכניס את ה-DNA פנימה. ככל שנכנס יותר DNA הלחץ בתוך הראש עולה.">
      <He x={430} y={28} size={11.5} bold color={INK}>1 · פרוקפסיד ריק</He>
      <polygon points={poly(390, 92, 40, 6)} fill={FILL.gray} stroke={MUTED} strokeWidth={1.6} />
      <circle cx={390} cy={92} r={18} fill="none" stroke={TEAL} strokeWidth={1.4} {...dash} />
      <He x={390} y={96} size={9} color={TEAL}>פיגום</He>
      <rect x={378} y={128} width={24} height={10} rx={3} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.3} />
      <He x={352} y={144} size={9.5} anchor="start" color={PURPLE}>שער</He>

      <Arrow x1={330} y1={92} x2={296} y2={92} color={MUTED} width={1.5} />

      <He x={252} y={28} size={11.5} bold color={INK}>2 · אריזה תלוית ATP</He>
      <polygon points={poly(220, 92, 40, 6)} fill={FILL.yellow} stroke={GOLD} strokeWidth={1.6} />
      <path d="M 200 80 q 10 8 20 0 q 10 -8 20 0 M 200 96 q 10 8 20 0 q 10 -8 20 0" fill="none" stroke={GOLD} strokeWidth={1.6} />
      <rect x={208} y={128} width={24} height={10} rx={3} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.3} />
      <ellipse cx={220} cy={152} rx={26} ry={12} fill={FILL.red} stroke={RED} strokeWidth={1.4} />
      <He x={267} y={156} size={9} color={RED}>מנוע</He>
      <line x1={220} y1={164} x2={220} y2={196} stroke={GOLD} strokeWidth={3} />
      <He x={258} y={186} size={9.5} anchor="start" color={GOLD}>DNA שטרם נארז</He>
      <La x={182} y={158} size={9.5} anchor="end" color={RED}>ATP → ADP + Pi</La>
      <Arrow x1={220} y1={190} x2={220} y2={146} color={RED} width={1.5} />

      <Arrow x1={160} y1={92} x2={126} y2={92} color={MUTED} width={1.5} />

      <He x={82} y={28} size={11.5} bold color={INK}>3 · ראש מלא</He>
      <polygon points={poly(70, 92, 40, 6)} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.8} />
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} cx={70} cy={92} r={8 + i * 6} fill="none" stroke={GOLD} strokeWidth={1.4} />
      ))}
      <rect x={58} y={128} width={24} height={10} rx={3} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.3} />
      <He x={70} y={154} size={9.5} color={ORANGE}>לחץ גבוה בפנים</He>

      <rect x={40} y={226} width={400} height={52} rx={10} fill={FILL.teal} stroke={TEAL} strokeWidth={1.2} />
      <He x={430} y={246} size={10.5} anchor="end" bold color={TEAL}>שתי שאלות נפרדות</He>
      <He x={430} y={266} size={10} anchor="end">מה נארז (זיהוי אות האריזה) · מתי נפסקת האריזה (רצף מסוים או קיבולת הראש)</He>
    </Svg>
  );
}

// ── vr-exit ──────────────────────────────────────────────────────────────────
function ExitRoutes() {
  const cell = (x: number, y: number, w: number, h: number) => <rect x={x} y={y} width={w} height={h} rx={14} fill={FILL.gray} stroke={MUTED} strokeWidth={1.6} />;
  const virion = (cx: number, cy: number, r = 7, c = ORANGE, f = FILL.orange) => <polygon points={poly(cx, cy, r, 6)} fill={f} stroke={c} strokeWidth={1.2} />;
  return (
    <Svg h={330} label="ארבע דרכי יציאה. ליזיס מפרק מחסומים תאיים. הנצה מקנה מעטפת ואינה מחייבת מוות מיידי של התא. יציאה דרך מדור פנימי יכולה להיעזר בנשא ממברנלי ואיחוי. פאג חוטי יכול לצאת דרך מערכת הפרשה בלי ליזיס.">
      {/* lysis */}
      <He x={420} y={26} size={11.5} bold color={RED}>ליזיס</He>
      {cell(330, 40, 120, 80)}
      <line x1={330} y1={70} x2={450} y2={70} stroke={RED} strokeWidth={2} {...dash} />
      {[0, 1, 2, 3].map((i) => <g key={i}>{virion(352 + i * 22, 96)}</g>)}
      {[0, 1, 2].map((i) => <g key={i}>{virion(465, 51 + i * 26, 6, RED, FILL.red)}</g>)}
      <He x={390} y={134} size={9.5} color={RED}>פירוק הדופן — התא מת</He>

      {/* budding at the plasma membrane */}
      <He x={240} y={26} size={11.5} bold color={BLUE}>הנצה בממברנת התא</He>
      {cell(180, 40, 100, 80)}
      <path d="M 280 70 q 18 -14 18 2 q 0 16 -18 2" fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      {virion(286, 72, 6, BLUE, FILL.blue)}
      {virion(314, 72, 7, BLUE, FILL.blue)}
      <circle cx={314} cy={72} r={11} fill="none" stroke={BLUE} strokeWidth={1.4} />
      <Arrow x1={295} y1={94} x2={309} y2={94} color={BLUE} width={1.3} />
      <He x={240} y={134} size={9.5} color={BLUE}>התא יכול לשרוד; המעטפת מהממברנה</He>

      {/* budding into a compartment + exocytosis */}
      <He x={420} y={176} size={11.5} bold color={PURPLE}>הנצה אל חלל פנימי</He>
      {cell(300, 190, 150, 80)}
      <ellipse cx={346} cy={230} rx={30} ry={20} fill="#fff" stroke={PURPLE} strokeWidth={1.4} />
      {virion(346, 230, 6, PURPLE, FILL.purple)}
      <He x={346} y={258} size={9} color={PURPLE}>מדור פנימי</He>
      <Arrow x1={382} y1={230} x2={414} y2={230} color={PURPLE} width={1.4} />
      <path d="M 450 214 q 10 16 0 32" fill="none" stroke={PURPLE} strokeWidth={1.6} />
      {virion(466, 230, 6, PURPLE, FILL.purple)}
      <He x={372} y={282} size={9.5} color={PURPLE}>איחוי הנשא עם ממברנת התא</He>

      {/* extrusion */}
      <He x={210} y={176} size={11.5} bold color={TEAL}>הפרשה מתמשכת</He>
      {cell(120, 190, 150, 80)}
      <line x1={150} y1={230} x2={270} y2={230} stroke={TEAL} strokeWidth={3} />
      <line x1={270} y1={230} x2={296} y2={230} stroke={TEAL} strokeWidth={3} />
      <He x={196} y={212} size={9} color={TEAL}>חלקיק חוטי</He>
      <Arrow x1={276} y1={248} x2={300} y2={248} color={TEAL} width={1.3} />
      <He x={196} y={282} size={9.5} color={TEAL}>התא ממשיך לגדול ולהפריש</He>

      <He x={240} y={314} size={10} color={MUTED}>סכמטי, לא בקנה מידה · משושה = חלקיק; עיגול סביבו = מעטפת</He>
    </Svg>
  );
}

// ── vr-latency ───────────────────────────────────────────────────────────────
function LatencySwitch() {
  const q = (x: number, y: number, title: string, a: string, b: string) => (
    <g>
      <Box x={x} y={y} w={128} h={32} fill={FILL.gray} stroke={MUTED} size={11} bold>{title}</Box>
      <Box x={x} y={y + 40} w={128} h={28} fill={FILL.sky} stroke={BLUE} size={10}>{a}</Box>
      <Box x={x} y={y + 74} w={128} h={28} fill={FILL.purple} stroke={PURPLE} size={10}>{b}</Box>
    </g>
  );
  return (
    <Svg h={300} label="שלוש שאלות נפרדות על גנום לטנטי: איפה הוא נמצא, איך הוא נשמר לאורך זמן, ומה מותר לו לבטא. אינטגרציה עונה רק על הראשונה. בכל השאלות יש שתי אפשרויות, והצירוף ביניהן משתנה בין מערכות.">
      {q(318, 36, "איפה הגנום", "משולב בכרומוזום", "אפיזום נפרד")}
      {q(176, 36, "איך נשמר", "עם שכפול המאכסן", "תחזוקה והיצמדות")}
      {q(34, 36, "מה מבוטא", "כמעט כלום", "מעט תעתיקים בלבד")}
      <He x={240} y={160} size={10} color={MUTED}>הצירוף נקבע לכל מערכת בנפרד — אין מסלול אחד</He>

      <rect x={40} y={180} width={400} height={104} rx={12} fill={FILL.yellow} stroke={GOLD} strokeWidth={1.2} />
      <He x={430} y={202} size={11} anchor="end" bold color={GOLD}>היציאה מהלטנטיות</He>
      <Box x={330} y={216} w={94} h={34} fill="#fff" stroke={MUTED} size={10}>אות עקה או נזק</Box>
      <Arrow x1={326} y1={233} x2={296} y2={233} color={INK} width={1.5} />
      <Box x={190} y={216} w={100} h={34} fill="#fff" stroke={MUTED} size={10}>המעכב מפסיק לפעול</Box>
      <Arrow x1={186} y1={233} x2={156} y2={233} color={INK} width={1.5} />
      <Box x={56} y={216} w={96} h={34} fill={FILL.red} stroke={RED} size={10} bold>תוכנית יצרנית</Box>
      <He x={240} y={272} size={9.5} color={MUTED}>גילוי DNA לבדו אינו מוכיח שהגנום שלם או מסוגל להתעורר</He>
    </Svg>
  );
}

// ── vr-bacterial-defenses ────────────────────────────────────────────────────
function RestrictionModification() {
  const site = (x: number, y: number, marked: boolean) => (
    <g>
      <rect x={x} y={y} width={30} height={12} rx={2} fill={marked ? FILL.green : FILL.red} stroke={marked ? GREEN : RED} strokeWidth={1.2} />
      {marked && <circle cx={x + 15} cy={y - 7} r={4.5} fill={GREEN} />}
    </g>
  );
  return (
    <Svg h={290} label="הגבלה ומודיפיקציה: אותו רצף זיהוי, שני גורלות. ה-DNA של התא נושא סימון על אתרי הזיהוי ולכן אינו נחתך. DNA נכנס בלי סימון נחתך על ידי אנזים ההגבלה. פאג' ששרד ועבר סימון בתא הזה יהיה מוגן בסבב הבא בזן הזה.">
      <He x={270} y={28} size={11.5} bold color={GREEN}>הגנום של התא — מסומן</He>
      <line x1={120} y1={64} x2={440} y2={64} stroke={INK} strokeWidth={2.5} />
      {[160, 250, 340].map((x) => <g key={x}>{site(x, 58, true)}</g>)}
      <He x={250} y={93} size={9.5} color={GREEN}>סימון מתאים במערכת זו</He>
      <Box x={40} y={48} w={60} h={32} fill={FILL.green} stroke={GREEN} size={10}>לא נחתך</Box>

      <He x={270} y={126} size={11.5} bold color={RED}>גנום נכנס — בלי סימון</He>
      <line x1={120} y1={162} x2={440} y2={162} stroke={INK} strokeWidth={2.5} />
      {[160, 250, 340].map((x) => <g key={x}>{site(x, 156, false)}</g>)}
      {[175, 265, 355].map((x) => (
        <g key={x}>
          <line x1={x} y1={142} x2={x} y2={182} stroke={RED} strokeWidth={2} />
        </g>
      ))}
      <He x={250} y={200} size={9.5} color={RED}>אנזים ההגבלה חותך באתרים הלא מסומנים</He>
      <Box x={40} y={146} w={60} h={32} fill={FILL.red} stroke={RED} size={10}>נחתך</Box>

      <rect x={40} y={220} width={400} height={56} rx={10} fill={FILL.sky} stroke={BLUE} strokeWidth={1.2} />
      <He x={240} y={240} size={10.5} bold color={BLUE}>ההבחנה היא בין מסומן ללא מסומן</He>
      <He x={240} y={260} size={10}>ולכן פאג׳ ששרד ונארז בתא הזה יצא ממנו מוגן — בלי שהרצף שלו השתנה</He>
    </Svg>
  );
}

// ── vr-animal-defenses ───────────────────────────────────────────────────────
function AntiviralSignaling() {
  return (
    <Svg h={310} label="מחיישן לאינטרפרון ולמצב מוגן. חיישני חומצות גרעין בתאים מזהים מבנים שאינם אופייניים לתא, מגייסים מתאמים ומפעילים גורמי שעתוק. התא מפריש אינטרפרון, שנקשר לקולטן על התא עצמו ועל שכניו ומשרה גנים שמקשים על מחזור ההדבקה.">
      <rect x={30} y={34} width={420} height={128} rx={16} fill={FILL.gray} stroke={MUTED} strokeWidth={1.6} />
      <He x={440} y={54} size={10} anchor="end" color={MUTED}>התא המודבק</He>

      <Box x={330} y={60} w={104} h={34} fill={FILL.sky} stroke={BLUE} size={10}>RNA חריג בציטופלזמה</Box>
      <Box x={330} y={104} w={104} h={34} fill={FILL.purple} stroke={PURPLE} size={10}>DNA בציטופלזמה</Box>
      <Arrow x1={326} y1={77} x2={296} y2={88} color={MUTED} width={1.3} />
      <Arrow x1={326} y1={121} x2={296} y2={110} color={MUTED} width={1.3} />
      <Box x={196} y={82} w={96} h={34} fill={FILL.teal} stroke={TEAL} size={10} bold>מתאם + קינאזות</Box>
      <Arrow x1={192} y1={99} x2={162} y2={99} color={MUTED} width={1.3} />
      <Box x={56} y={82} w={102} h={34} fill={FILL.orange} stroke={ORANGE} size={10}>גורמי שעתוק פעילים</Box>
      <He x={240} y={134} size={9.5} color={MUTED}>החיישן מזהה מבנה ומיקום — לא &quot;רצף זר&quot;</He>

      <Arrow x1={107} y1={166} x2={107} y2={196} color={ORANGE} width={1.6} />
      <Box x={48} y={200} w={118} h={32} fill={FILL.yellow} stroke={GOLD} size={10.5} bold>אינטרפרון מופרש</Box>
      <Arrow x1={172} y1={216} x2={246} y2={216} color={GOLD} width={1.6} />
      <He x={150} y={185} size={9.5} color={GOLD}>אות לתא ולשכנים</He>

      <rect x={252} y={190} width={198} height={100} rx={14} fill={FILL.sky} stroke={BLUE} strokeWidth={1.4} />
      <He x={440} y={210} size={10} anchor="end" color={BLUE}>תא שכן, עדיין לא מודבק</He>
      <Box x={286} y={222} w={130} h={28} fill="#fff" stroke={BLUE} size={10}>קולטן לאינטרפרון</Box>
      <Arrow x1={351} y1={254} x2={351} y2={266} color={BLUE} width={1.4} />
      <He x={351} y={282} size={10} bold color={BLUE}>השראת גנים שמקשים על המחזור</He>
    </Svg>
  );
}

// ── vr-evolution ─────────────────────────────────────────────────────────────
function Coevolution() {
  // Resistance rises under phage pressure, then declines when its cost is paid without the phage.
  const s = scale(64, 440, 220, 44, 0, 60, 0, 1);
  const logistic = (t: number, mid: number, k: number) => 1 / (1 + Math.exp(-k * (t - mid)));
  const resist = (t: number) => (t <= 30 ? 0.03 + 0.9 * logistic(t, 16, 0.3) : 0.93 - 0.55 * logistic(t, 44, 0.22));
  const counter = (t: number) => (t < 18 ? 0.02 : 0.02 + 0.75 * logistic(t, 34, 0.22));
  const path = (f: (t: number) => number, a = 0, b = 60) => {
    let d = "";
    for (let i = 0; i <= 120; i++) {
      const t = a + ((b - a) * i) / 120;
      d += `${i ? "L" : "M"}${s.sx(t).toFixed(1)} ${s.sy(f(t)).toFixed(1)}`;
    }
    return d;
  };
  return (
    <Svg h={340} label="מודל מדומה של שכיחויות, לא תוצאות ניסוי: לחץ ברירה משתנה ועלות עמידות יכולים לשנות את שכיחות הווריאנטים. אין מהמודל טענה שמאכסן ונגיף משתנים תמיד באותו רצף או כיוון.">
      <path d={path(resist)} fill="none" stroke={BLUE} strokeWidth={2.4} />
      <path d={path(counter, 10, 60)} fill="none" stroke={RED} strokeWidth={2.4} {...dash} />
      <line x1={64} y1={220} x2={448} y2={220} stroke={INK} strokeWidth={1.4} />
      <line x1={64} y1={220} x2={64} y2={40} stroke={INK} strokeWidth={1.4} />
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <line x1={60} y1={s.sy(v)} x2={64} y2={s.sy(v)} stroke={INK} strokeWidth={1} />
          <La x={54} y={s.sy(v) + 4} size={10} anchor="end" color={MUTED}>{v === 0 ? "0" : v === 1 ? "1" : "0.5"}</La>
        </g>
      ))}
      <He x={28} y={130} size={10.5} color={MUTED} rotate={-90}>שכיחות באוכלוסייה</He>
      <He x={256} y={252} size={10.5} color={MUTED}>דורות</He>
      <He x={150} y={279} size={10.5} color={BLUE} bold>מאכסן עמיד</He>
      <He x={350} y={279} size={10.5} color={RED} bold>פאג שמזהה מחדש</He>
      <line x1={s.sx(30)} y1={44} x2={s.sx(30)} y2={220} stroke={MUTED} strokeWidth={1} {...dash} />
      <He x={s.sx(30)} y={38} size={9.5} color={MUTED}>כאן הלחץ נחלש</He>
      <He x={256} y={310} size={9.5} color={MUTED}>מודל מדומה להמחשה; אין כאן תוצאות ניסוי</He>
    </Svg>
  );
}

export const VIROLOGY_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "vr-entry-steps": { el: EntrySteps, captionHe: "שלושה שלבים בכניסת פאג' עם זנב: מגע הפיך, נקודת התחייבות, ונתיב מקומי שדרכו עובר רק הגנום. סכמטי, לא בקנה מידה." },
  "vr-temporal-cascade": { el: TemporalCascade, captionHe: "מפל השעתוק: כל גל מייצר את מה שמאפשר את הבא אחריו, ושכפול הגנום מפריד בין המוקדם למאוחר. סכמטי." },
  "vr-architecture": { el: Architecture, captionHe: "גן אחד, עותקים רבים: שתי דרכי הסידור של תת-יחידות זהות, והמעבר מ-T = 1 ל-T = 3. מספר המחומשים נשאר 12. סכמטי." },
  "vr-one-step": { el: OneStepGrowth, captionHe: "עקומת גדילה חד-מחזורית, בסולם לוגריתמי: תקופת אפלה, תקופת המתנה וגודל מנה. המספרים להמחשה בלבד." },
  "vr-rna-translation": { el: RnaTranslationSwitch, captionHe: "אותו גדיל, שני שימושים בכיוונים מנוגדים — ולכן נדרש מעבר מסודר מתרגום לשכפול. סכמטי." },
  "vr-replication": { el: ReplicationOrigin, captionHe: "התחלה באזור מוצא מוגדר ושני מזלגות: הסגוליות מהחלבון הנגיפי, ההארכה במכונה של התא. סכמטי." },
  "vr-packaging": { el: PackagingMotor, captionHe: "אריזה לתוך מעטפת מוכנה: שער, מנוע תלוי ATP, ולחץ שעולה ככל שנכנס יותר DNA. סכמטי, לא בקנה מידה." },
  "vr-exit-routes": { el: ExitRoutes, captionHe: "ארבע דרכי יציאה, ומה הן עושות לתא: ליזיס, הנצה בממברנת התא, הנצה אל חלל פנימי ואחריה איחוי, והפרשה מתמשכת. סכמטי." },
  "vr-latency-switch": { el: LatencySwitch, captionHe: "לטנטיות היא צירוף של שלוש תשובות — מיקום, תחזוקה וביטוי — ולא תכונה אחת. סכמטי." },
  "vr-bacterial-defense": { el: RestrictionModification, captionHe: "אותו אתר זיהוי, שני גורלות: ההבחנה היא בין מסומן ללא מסומן. סכמטי." },
  "vr-antiviral-signaling": { el: AntiviralSignaling, captionHe: "מחיישן לאינטרפרון ולמצב מוגן בתאים שכנים. מפושט — מוצגים שני ענפי זיהוי בלבד." },
  "vr-coevolution": { el: Coevolution, captionHe: "מודל להמחשה: עמידות עולה בלחץ הפאג ונסוגה כשיש לה מחיר, ובמקביל עולה שכיחות הפאג שמזהה מחדש." },
};
