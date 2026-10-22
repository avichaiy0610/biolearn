/* Figures for the cell-biology units (Technion 134128). All schematic, not to scale.
   Colors: membranes gray, proteins purple, signals/ligands orange, active/GTP green, actin red.
   Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, BLUE, GREEN, INK, LINE, MUTED, ORANGE, He, La, dash } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

const PURPLE = "#7c3aed";
const RED = "#b91c1c";
const FILL = { blue: "#dbeafe", green: "#dcfce7", orange: "#ffedd5", purple: "#ede9fe", yellow: "#fef3c7", gray: "#f1f5f9", red: "#fee2e2", sky: "#e0f2fe" };

const Svg = ({ w = 480, h, label, children }: { w?: number; h: number; label: string; children: React.ReactNode }) => (
  <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label={label}>
    <ArrowDefs />
    {children}
  </svg>
);
const Line = ({ x1, y1, x2, y2, c = BLUE, w = 3 }: { x1: number; y1: number; x2: number; y2: number; c?: string; w?: number }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeLinecap="round" />
);
const HBox = ({ x, y, w, h = 30, label, c = BLUE, fill = FILL.blue, size = 12.5, bold = false }: { x: number; y: number; w: number; h?: number; label: React.ReactNode; c?: string; fill?: string; size?: number; bold?: boolean }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={8} fill={fill} stroke={c} strokeWidth={1.6} />
    <He x={x} y={y + h / 2 + size * 0.36} size={size} bold={bold}>{label}</He>
  </g>
);
const LBox = ({ x, y, w, h = 30, label, c = BLUE, fill = FILL.blue, size = 13, bold = false }: { x: number; y: number; w: number; h?: number; label: React.ReactNode; c?: string; fill?: string; size?: number; bold?: boolean }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={8} fill={fill} stroke={c} strokeWidth={1.6} />
    <La x={x} y={y + h / 2 + size * 0.36} size={size} bold={bold}>{label}</La>
  </g>
);
const Num = ({ x, y, n }: { x: number; y: number; n: number }) => (
  <g><circle cx={x} cy={y} r={9} fill={INK} /><La x={x} y={y + 4} size={11} bold color="#ffffff">{n}</La></g>
);
// A membrane seen edge-on: a band between y and y + h.
const Membrane = ({ x0 = 0, x1 = 480, y, h = 24 }: { x0?: number; x1?: number; y: number; h?: number }) => (
  <g>
    <rect x={x0} y={y} width={x1 - x0} height={h} fill={FILL.gray} />
    <line x1={x0} x2={x1} y1={y} y2={y} stroke={MUTED} strokeWidth={1.6} />
    <line x1={x0} x2={x1} y1={y + h} y2={y + h} stroke={MUTED} strokeWidth={1.6} />
  </g>
);
// Small circle with a short Latin tag (P, GTP, Ca²⁺ ...).
const Tag = ({ x, y, t, c = ORANGE, fill = FILL.yellow, r = 10, size = 10.5 }: { x: number; y: number; t: string; c?: string; fill?: string; r?: number; size?: number }) => (
  <g><circle cx={x} cy={y} r={r} fill={fill} stroke={c} strokeWidth={1.4} /><La x={x} y={y + size * 0.36} size={size} bold color={c}>{t}</La></g>
);
const polar = (cx: number, cy: number, r: number, deg: number) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

// ── cell-membranes ───────────────────────────────────────────────────────────
function MembraneBilayer() {
  const xs: number[] = [];
  for (let x = 30; x <= 398; x += 14) if (x < 196 || x > 266) xs.push(x);
  const glyco = [100, 338];
  const lipid = (x: number, y: number, up: boolean, fill: string, stroke: string) => {
    const t = up ? 1 : -1;
    return (
      <g key={`${x}-${y}`}>
        <path d={`M${x - 3} ${y + 6 * t} q-2 ${10 * t} 0 ${22 * t}`} fill="none" stroke={MUTED} strokeWidth={1.3} />
        <path d={`M${x + 3} ${y + 6 * t} q2 ${10 * t} 0 ${22 * t}`} fill="none" stroke={MUTED} strokeWidth={1.3} />
        <circle cx={x} cy={y} r={6} fill={fill} stroke={stroke} strokeWidth={1.2} />
      </g>
    );
  };
  return (
    <Svg h={300} label="דו-שכבה של שומנים בחתך: בשכבה החיצונית פוספטידילכולין וגליקוליפידים עם סוכרים שפונים החוצה; בשכבה הפנימית פוספטידילסרין טעון שלילית; חלבון טרנס-ממברנלי עם סוכרים בצד החיצוני, וחלבון היקפי בצד הציטוזולי">
      <He x={214} y={22} size={12.5} color={MUTED}>מחוץ לתא</He>
      <He x={214} y={292} size={12.5} color={MUTED}>ציטוזול</He>
      {xs.map((x) => lipid(x, 122, true, glyco.includes(x) ? FILL.green : FILL.blue, glyco.includes(x) ? GREEN : BLUE))}
      {xs.map((x, i) => lipid(x, 186, false, i % 3 === 1 ? FILL.orange : FILL.blue, i % 3 === 1 ? ORANGE : BLUE))}
      {xs.filter((_, i) => i % 3 === 1).map((x) => <La key={x} x={x} y={190} size={10} bold color={ORANGE}>−</La>)}
      {/* glycolipid sugars */}
      {glyco.map((x) => (
        <g key={x}>
          <Line x1={x} y1={116} x2={x} y2={82} c={GREEN} w={1.4} />
          {[104, 92, 80].map((y) => <rect key={y} x={x - 5} y={y - 5} width={10} height={10} rx={2} fill={FILL.green} stroke={GREEN} strokeWidth={1.1} />)}
        </g>
      ))}
      <He x={100} y={66} size={11.5} color={GREEN}>גליקוליפיד</He>
      {/* transmembrane protein with glycan */}
      <rect x={204} y={100} width={54} height={110} rx={16} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.6} />
      <Line x1={231} y1={100} x2={231} y2={62} c={GREEN} w={1.4} />
      <Line x1={231} y1={74} x2={247} y2={58} c={GREEN} w={1.4} />
      {[[231, 88], [231, 74], [231, 60], [247, 58]].map(([x, y]) => <rect key={`${x}${y}`} x={x - 5} y={y - 5} width={10} height={10} rx={2} fill={FILL.green} stroke={GREEN} strokeWidth={1.1} />)}
      <He x={231} y={40} size={11.5} color={GREEN}>סוכרים — גליקוקליקס</He>
      <He x={231} y={232} size={11.5} color={PURPLE}>חלבון טרנס-ממברנלי</He>
      {/* peripheral protein */}
      <ellipse cx={352} cy={220} rx={26} ry={13} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.4} />
      <He x={352} y={252} size={11.5}>חלבון היקפי</He>
      <He x={110} y={240} size={11.5} color={ORANGE}>פוספטידילסרין (−)</He>
      <He x={110} y={256} size={11} color={MUTED}>רק בשכבה הפנימית</He>
      <He x={476} y={126} size={11.5} anchor="end" bold>שכבה</He>
      <He x={476} y={142} size={11.5} anchor="end" bold>חיצונית</He>
      <He x={476} y={178} size={11.5} anchor="end" bold>שכבה</He>
      <He x={476} y={194} size={11.5} anchor="end" bold>פנימית</He>
    </Svg>
  );
}

// ── cell-er ──────────────────────────────────────────────────────────────────
function ProteinSortingMap() {
  const row = 108, w = 100;
  const targets: [number, string, string][] = [[62, "גרעין", GREEN], [175, "מיטוכונדריה", BLUE], [288, "פרוקסיזום", BLUE], [404, "ER", BLUE]];
  return (
    <Svg h={330} label="מפת המיון של חלבונים: מהציטוזול לגרעין דרך נקבוביות; למיטוכונדריה, לפרוקסיזום ול-ER דרך טרנסלוקטורים; ומה-ER לגולג'י ומשם לאנדוזומים, לליזוזומים ולממברנת התא בשלפוחיות">
      <HBox x={240} y={18} w={230} label="ציטוזול — ריבוזומים חופשיים" c={INK} fill={FILL.gray} bold />
      {targets.map(([x, t, c]) => (
        <g key={t}>
          <Arrow x1={240 + (x - 240) * 0.35} y1={50} x2={x} y2={row - 3} color={c} width={2.4} />
          <HBox x={x} y={row} w={w} label={t} c={c} fill={c === GREEN ? FILL.green : FILL.blue} />
        </g>
      ))}
      <Arrow x1={404} y1={row + 32} x2={404} y2={186} color={ORANGE} width={2.4} />
      <HBox x={404} y={189} w={w} label="גולג'י" c={ORANGE} fill={FILL.orange} />
      <Arrow x1={404} y1={221} x2={404} y2={258} color={ORANGE} width={2.4} />
      <HBox x={404} y={261} w={w} label="ממברנת התא" c={ORANGE} fill={FILL.orange} size={12} />
      <Arrow x1={360} y1={215} x2={300} y2={258} color={ORANGE} width={2.4} />
      <HBox x={262} y={261} w={w} label="אנדוזומים" c={ORANGE} fill={FILL.orange} />
      <Arrow x1={354} y1={281} x2={316} y2={281} color={ORANGE} width={1.6} dashed />
      <Arrow x1={210} y1={276} x2={176} y2={276} color={ORANGE} width={2.4} />
      <HBox x={122} y={261} w={w} label="ליזוזומים" c={ORANGE} fill={FILL.orange} />
      <He x={335} y={304} size={10.5} color={MUTED}>אנדוציטוזה</He>
      {([[GREEN, "דרך נקבוביות", 470], [BLUE, "דרך טרנסלוקטורים", 318], [ORANGE, "בשלפוחיות", 160]] as [string, string, number][]).map(([c, t, x]) => (
        <g key={t}>
          <Line x1={x - 22} y1={316} x2={x} y2={316} c={c} w={3} />
          <He x={x - 28} y={320} size={11.5} anchor="end">{t}</He>
        </g>
      ))}
    </Svg>
  );
}

function CotranslationalTranslocation() {
  const ribo = (cx: number, cy: number) => (
    <g>
      <ellipse cx={cx} cy={cy - 22} rx={26} ry={12} fill={FILL.sky} stroke={BLUE} strokeWidth={1.4} />
      <ellipse cx={cx} cy={cy} rx={34} ry={18} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <Line x1={cx - 50} y1={cy - 11} x2={cx + 50} y2={cy - 11} c={PURPLE} w={1.6} />
    </g>
  );
  const Sec61 = ({ x, open }: { x: number; open: boolean }) => (
    <g>
      <rect x={x - 22} y={176} width={16} height={34} rx={4} fill={FILL.green} stroke={GREEN} strokeWidth={1.3} />
      <rect x={x + 6} y={176} width={16} height={34} rx={4} fill={FILL.green} stroke={GREEN} strokeWidth={1.3} />
      {!open && <rect x={x - 6} y={186} width={12} height={10} rx={2} fill={GREEN} />}
    </g>
  );
  return (
    <Svg h={300} label="תרגום וטרנסלוקציה ל-ER בשלושה שלבים: 1 — רצף האות יוצא מהריבוזום ו-SRP נקשר אליו; 2 — SRP מביא את הריבוזום לקולטן שלו ליד תעלת Sec61; 3 — SRP משתחרר, השרשרת מושחלת דרך התעלה לחלל ה-ER ופפטידאז האות חותך את האות">
      <He x={240} y={20} size={12} color={MUTED}>ציטוזול</He>
      <Membrane y={178} h={30} />
      <He x={240} y={290} size={12} color={MUTED}>חלל ה-ER</He>
      {/* 1 */}
      <Num x={22} y={46} n={1} />
      {ribo(80, 88)}
      <path d="M80 106 q6 16 -4 30" fill="none" stroke={INK} strokeWidth={2} />
      <Line x1={76} y1={136} x2={70} y2={152} c={RED} w={4} />
      <rect x={52} y={140} width={46} height={16} rx={8} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <La x={75} y={152} size={11} bold color={PURPLE}>SRP</La>
      <He x={80} y={232} size={11.5} color={RED}>רצף אות</He>
      <He x={80} y={248} size={11} color={MUTED}>ו-SRP נקשר</He>
      <Arrow x1={136} y1={70} x2={180} y2={70} />
      {/* 2 */}
      <Num x={186} y={46} n={2} />
      {ribo(236, 132)}
      <rect x={256} y={148} width={44} height={16} rx={8} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <La x={278} y={160} size={11} bold color={PURPLE}>SRP</La>
      <rect x={268} y={168} width={22} height={22} rx={4} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.3} />
      <Sec61 x={226} open={false} />
      <La x={222} y={232} size={11.5} bold color={GREEN}>Sec61</La>
      <He x={282} y={248} size={11} color={PURPLE}>קולטן SRP</He>
      <Arrow x1={306} y1={70} x2={346} y2={70} />
      {/* 3 */}
      <Num x={350} y={46} n={3} />
      {ribo(410, 150)}
      <Sec61 x={410} open />
      <path d="M410 168 L410 214 q-14 12 0 22 q14 10 0 22" fill="none" stroke={INK} strokeWidth={2} />
      <Line x1={428} y1={184} x2={428} y2={202} c={RED} w={4} />
      <He x={362} y={232} size={11} color={RED}>האות נחתך</He>
      <He x={362} y={248} size={11} color={MUTED}>(פפטידאז)</He>
      <rect x={420} y={84} width={44} height={16} rx={8} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <La x={442} y={96} size={11} bold color={PURPLE}>SRP</La>
      <Arrow x1={430} y1={128} x2={438} y2={104} color={PURPLE} />
      <La x={368} y={106} size={10.5} color={PURPLE}>GTP</La>
    </Svg>
  );
}

// ── cell-quality-control ─────────────────────────────────────────────────────
function CalnexinCycle() {
  return (
    <Svg h={330} label="מחזור הקלנקסין: גלוקוזידאזות מסירות שני גלוקוזים; חלבון עם גלוקוז אחד נקשר לקלנקסין; הגלוקוז האחרון מוסר; חלבון מקופל ממשיך לגולג'י, וחלבון לא מקופל מקבל גלוקוז מחדש ב-UGGT וחוזר לקלנקסין; אחרי סבבים רבים מנוזים מוסרים והחלבון מפורק ב-ERAD">
      <HBox x={240} y={14} w={250} label="חלבון חדש — 3 גלוקוזים על הגליקן" c={INK} fill={FILL.gray} />
      <Arrow x1={240} y1={46} x2={240} y2={84} />
      <He x={252} y={70} size={11.5} anchor="start" color={MUTED}>גלוקוזידאזות I, II מסירות 2</He>
      <HBox x={240} y={88} w={250} label="גלוקוז אחד — קשור לקלנקסין" c={PURPLE} fill={FILL.purple} bold />
      <Arrow x1={240} y1={120} x2={240} y2={158} />
      <He x={252} y={144} size={11.5} anchor="start" color={MUTED}>גלוקוזידאז II מסיר את האחרון</He>
      <HBox x={240} y={162} w={200} label="בלי גלוקוז — מקופל?" c={INK} fill={FILL.gray} />
      <Arrow x1={320} y1={194} x2={384} y2={232} color={GREEN} width={2.4} />
      <He x={372} y={206} size={11.5} anchor="start" color={GREEN}>כן</He>
      <HBox x={394} y={236} w={140} label="ממשיך לגולג'י" c={GREEN} fill={FILL.green} bold />
      <Arrow x1={160} y1={194} x2={104} y2={232} color={ORANGE} width={2.4} />
      <He x={118} y={206} size={11.5} anchor="end" color={ORANGE}>לא</He>
      <HBox x={96} y={236} w={180} label="UGGT מחזיר גלוקוז" c={ORANGE} fill={FILL.orange} />
      <path d="M40 236 C 20 160, 40 110, 112 104" fill="none" stroke={ORANGE} strokeWidth={2.4} markerEnd="url(#bfArrowS)" />
      <He x={44} y={168} size={11} color={ORANGE} anchor="start">סבב נוסף</He>
      <Arrow x1={96} y1={268} x2={96} y2={290} color={RED} dashed />
      <HBox x={96} y={292} w={190} label="אחרי סבבים רבים → ERAD" c={RED} fill={FILL.red} size={12} />
      <He x={300} y={312} size={11} color={MUTED}>(בכל סבב מוסרים לאט גם מנוזים)</He>
    </Svg>
  );
}

// ── cell-golgi-endosomes ─────────────────────────────────────────────────────
function GolgiSorting() {
  const cis = [148, 182, 216, 250];
  const cols = [BLUE, "#4f46e5", PURPLE, "#9333ea"];
  return (
    <Svg h={300} label="הגולג'י: ערימת בורות מצד cis שפונה ל-ER ועד רשת ה-trans; חלבונים מגיעים מה-ER בשלפוחיות COPII וחוזרים ב-COPI; מה-TGN הם ממוינים לליזוזומים דרך קולטן מנוז-6-פוספט, לגרגרי הפרשה מווסתת, ולהפרשה רציפה">
      {/* ER */}
      <rect x={14} y={92} width={74} height={116} rx={14} fill={FILL.sky} stroke={BLUE} strokeWidth={1.6} />
      {[108, 128, 148, 168, 188].map((y) => <circle key={y} cx={20} cy={y} r={3} fill={BLUE} />)}
      <La x={52} y={156} size={15} bold color={BLUE}>ER</La>
      <Arrow x1={92} y1={128} x2={136} y2={128} color={GREEN} width={2.4} />
      <La x={114} y={118} size={11} bold color={GREEN}>COPII</La>
      <Arrow x1={136} y1={178} x2={92} y2={178} color={MUTED} width={1.8} dashed />
      <La x={114} y={198} size={11} color={MUTED}>COPI</La>
      {/* stack */}
      {cis.map((x, i) => <rect key={x} x={x - 9} y={74} width={18} height={152} rx={9} fill={FILL.purple} stroke={cols[i]} strokeWidth={1.8} />)}
      <La x={148} y={246} size={12} bold>cis</La>
      <He x={199} y={246} size={11.5}>מדיאלי</He>
      <La x={250} y={246} size={12} bold>trans</La>
      {[90, 118, 146, 174, 202].map((y, i) => <circle key={y} cx={292 + (i % 2) * 8} cy={y} r={7} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.3} />)}
      <La x={296} y={246} size={12} bold color={ORANGE}>TGN</La>
      <He x={224} y={44} size={12} bold>הגולג'י</He>
      <Arrow x1={170} y1={56} x2={270} y2={56} color={MUTED} />
      {/* destinations */}
      <Arrow x1={312} y1={92} x2={360} y2={64} color={ORANGE} width={2.4} />
      <circle cx={376} cy={58} r={15} fill={FILL.red} stroke={RED} strokeWidth={1.6} />
      <He x={440} y={56} size={12} bold>ליזוזום</He>
      <He x={440} y={72} size={10.5} color={MUTED}>(קולטן M6P)</He>
      <Arrow x1={314} y1={146} x2={360} y2={146} color={ORANGE} width={2.4} />
      <circle cx={376} cy={146} r={13} fill={PURPLE} stroke={PURPLE} />
      <He x={440} y={144} size={12} bold>גרגר הפרשה</He>
      <He x={440} y={160} size={10.5} color={MUTED}>(הפרשה מווסתת)</He>
      <Arrow x1={312} y1={200} x2={360} y2={226} color={ORANGE} width={2.4} />
      <circle cx={376} cy={232} r={10} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.4} />
      <He x={440} y={230} size={12} bold>ממברנת התא</He>
      <He x={440} y={246} size={10.5} color={MUTED}>(הפרשה רציפה)</He>
      <He x={240} y={286} size={11} color={MUTED}>חלבונים עוברים מ-cis ל-trans, ובכל בור משתנים הסוכרים שלהם</He>
    </Svg>
  );
}

// ── cell-vesicle-transport ───────────────────────────────────────────────────
function VesicleCycle() {
  const y = 128;
  const coat = (cx: number) => (
    <g>
      <circle cx={cx} cy={y} r={22} fill="none" stroke={ORANGE} strokeWidth={3} strokeDasharray="3 3" />
    </g>
  );
  const ves = (cx: number) => <circle cx={cx} cy={y} r={15} fill={FILL.blue} stroke={BLUE} strokeWidth={1.8} />;
  const steps: [number, string, string][] = [[70, "מעטפת", "נבנית"], [138, "ניתוק", ""], [206, "הסרת", "המעטפת"], [276, "הובלה", ""], [348, "עגינה", "Rab"], [408, "התמזגות", "SNAREs"]];
  return (
    <Svg h={250} label="מחזור של שלפוחית: נבנית מעטפת על הממברנה התורמת, השלפוחית מתנתקת, המעטפת מוסרת, השלפוחית מובלת לאורך מיקרוטובול, חלבוני Rab וגורמי קשירה מעגנים אותה ליעד, וחלבוני SNARE ממזגים את הממברנות">
      <rect x={-10} y={58} width={56} height={140} rx={14} fill={FILL.blue} stroke={BLUE} strokeWidth={1.8} />
      <He x={22} y={222} size={11.5} bold color={BLUE}>תורם</He>
      <rect x={434} y={58} width={60} height={140} rx={14} fill={FILL.green} stroke={GREEN} strokeWidth={1.8} />
      <He x={458} y={222} size={11.5} bold color={GREEN}>יעד</He>
      {/* 1: budding */}
      <path d={`M46 ${y - 15} a15 15 0 1 1 0 30`} fill={FILL.blue} stroke={BLUE} strokeWidth={1.8} />
      <path d={`M46 ${y - 22} a22 22 0 1 1 0 44`} fill="none" stroke={ORANGE} strokeWidth={3} strokeDasharray="3 3" />
      {/* 2: pinched, coated */}
      {ves(138)}{coat(138)}
      {/* 3: uncoated */}
      {ves(206)}
      {[[-26, -14], [24, -18], [-20, 22], [26, 18]].map(([dx, dy], i) => <path key={i} d={`M${206 + dx} ${y + dy} q4 -4 8 0`} fill="none" stroke={ORANGE} strokeWidth={2.4} />)}
      {/* 4: transport on a microtubule */}
      <Line x1={236} y1={172} x2={322} y2={172} c={MUTED} w={6} />
      {ves(276)}
      <Line x1={276} y1={143} x2={276} y2={166} c={PURPLE} w={2} />
      <circle cx={272} cy={167} r={4} fill={PURPLE} /><circle cx={281} cy={167} r={4} fill={PURPLE} />
      <Arrow x1={290} y1={190} x2={320} y2={190} color={MUTED} />
      {/* 5: tethering */}
      {ves(348)}
      <circle cx={361} cy={y - 9} r={5} fill={PURPLE} />
      <path d={`M365 ${y - 12} C 390 ${y - 40}, 410 ${y - 40}, 434 ${y - 30}`} fill="none" stroke={PURPLE} strokeWidth={1.8} />
      {/* 6: SNARE fusion */}
      <circle cx={416} cy={y + 22} r={15} fill={FILL.blue} stroke={BLUE} strokeWidth={1.8} />
      <path d={`M424 ${y + 12} q6 4 12 0 q-6 6 0 10`} fill="none" stroke={RED} strokeWidth={2} />
      <path d={`M426 ${y + 30} q6 -4 10 0`} fill="none" stroke={GREEN} strokeWidth={2} />
      {steps.map(([x, a, b], i) => (
        <g key={x}>
          <Num x={x} y={44} n={i + 1} />
          <He x={x} y={226} size={11.5} bold>{a}</He>
          {b && (/[A-Za-z]/.test(b) ? <La x={x} y={242} size={11} color={MUTED}>{b}</La> : <He x={x} y={242} size={11.5} bold>{b}</He>)}
        </g>
      ))}
    </Svg>
  );
}

// ── cell-nuclear-mito-import ─────────────────────────────────────────────────
function RanCycle() {
  const pores = [[72, 104], [156, 188], [236, 268]];
  const env = [30, ...pores.flat(), 292];
  const segs: [number, number][] = [];
  for (let i = 0; i < env.length; i += 2) segs.push([env[i], env[i + 1]]);
  return (
    <Svg h={300} label="מחזור Ran: בציטוזול RanGAP הופך Ran-GTP ל-Ran-GDP, ובגרעין RanGEF על הכרומטין הופך Ran-GDP ל-Ran-GTP. אימפורטין נכנס עם מטען, Ran-GTP בגרעין משחרר את המטען, האימפורטין יוצא עם Ran-GTP, וה-GTP מתפרק בציטוזול; Ran-GDP חוזר לגרעין עם NTF2">
      {segs.map(([a, b]) => <rect key={a} x={232} y={a} width={16} height={b - a} fill={FILL.gray} stroke={MUTED} strokeWidth={1.4} />)}
      <He x={116} y={20} size={13} bold>ציטוזול</He>
      <He x={116} y={38} size={11} color={MUTED}>בעיקר Ran-GDP</He>
      <He x={364} y={20} size={13} bold>גרעין</He>
      <He x={364} y={38} size={11} color={MUTED}>בעיקר Ran-GTP</He>
      {/* import */}
      <HBox x={116} y={72} w={170} label="אימפורטין + מטען" fill={FILL.orange} c={ORANGE} />
      <Arrow x1={204} y1={88} x2={276} y2={88} color={ORANGE} width={2.4} />
      <HBox x={364} y={72} w={200} label="Ran-GTP משחרר את המטען" fill={FILL.green} c={GREEN} />
      {/* export of importin */}
      <HBox x={364} y={156} w={180} label="אימפורטין + Ran-GTP" fill={FILL.green} c={GREEN} />
      <Arrow x1={272} y1={172} x2={206} y2={172} color={GREEN} width={2.4} />
      <HBox x={116} y={156} w={200} label="RanGAP: פירוק GTP" fill={FILL.gray} c={INK} />
      <He x={116} y={204} size={11} color={MUTED}>האימפורטין פנוי למטען הבא</He>
      <Arrow x1={116} y1={210} x2={116} y2={234} />
      {/* Ran-GDP returns */}
      <LBox x={116} y={238} w={110} label="Ran-GDP" fill={FILL.gray} c={INK} size={12.5} />
      <Arrow x1={174} y1={252} x2={278} y2={252} width={2.4} />
      <La x={200} y={278} size={11} color={MUTED}>NTF2</La>
      <HBox x={364} y={238} w={190} label="RanGEF: GDP → GTP" fill={FILL.green} c={GREEN} />
      <path d="M462 238 C 474 200, 474 140, 462 104" fill="none" stroke={GREEN} strokeWidth={1.8} markerEnd="url(#bfArrow)" {...dash} />
    </Svg>
  );
}

// ── cell-cytoskeleton ────────────────────────────────────────────────────────
function CytoskeletonTypes() {
  const top = 48, bot = 196;
  const actin = [];
  for (let i = 0; i <= 12; i++) {
    const y = top + 4 + i * 12;
    actin.push(<circle key={`a${i}`} cx={85 + 6 * Math.sin(i * 0.9)} cy={y} r={6.5} fill={FILL.red} stroke={RED} strokeWidth={1} />);
    actin.push(<circle key={`b${i}`} cx={85 - 6 * Math.sin(i * 0.9) + 0} cy={y + 6} r={6.5} fill="#fecaca" stroke={RED} strokeWidth={1} />);
  }
  const mt = [];
  for (let c = 0; c < 5; c++) for (let r = 0; r < 14; r++) {
    const fill = (r + c) % 2 ? FILL.green : "#bbf7d0";
    mt.push(<rect key={`${c}-${r}`} x={216 + c * 10} y={top + r * 10.6 + (c % 2) * 3} width={9} height={10} rx={2} fill={fill} stroke={GREEN} strokeWidth={0.8} />);
  }
  const rope = (ph: number, c: string) => {
    let d = "";
    for (let y = top; y <= bot; y += 4) d += `${y === top ? "M" : "L"}${(395 + 7 * Math.sin((y - top) / 10 + ph)).toFixed(1)} ${y}`;
    return <path key={ph} d={d} fill="none" stroke={c} strokeWidth={3} />;
  };
  const cols: [number, string, string, string][] = [[85, "סיב אקטין", "כ-7 ננומטר · אקטין", RED], [240, "מיקרוטובול", "25 ננומטר · α/β-טובולין", GREEN], [395, "סיב ביניים", "כ-10 ננומטר · אין קוטביות", BLUE]];
  return (
    <Svg h={262} label="שלושת סוגי הסיבים: סיב אקטין — שני גדילים של אקטין, 7 ננומטר, עם קצה פלוס ומינוס; מיקרוטובול — צינור חלול של α/β-טובולין, 25 ננומטר, עם קטבים; סיב ביניים — חבל של כמה חלבונים, 10 ננומטר, בלי קוטביות">
      {actin}
      {mt}
      {[0, 1.6, 3.2].map((p, i) => rope(p, [BLUE, "#3b82f6", "#1e40af"][i]))}
      {[85, 240].map((x) => (
        <g key={x}>
          <La x={x + 42} y={top + 6} size={13} bold>(−)</La>
          <La x={x + 42} y={bot + 4} size={13} bold>(+)</La>
        </g>
      ))}
      {cols.map(([x, a, b, c]) => (
        <g key={x}>
          <He x={x} y={226} size={13} bold color={c}>{a}</He>
          <He x={x} y={246} size={11.5} color={MUTED}>{b}</He>
        </g>
      ))}
    </Svg>
  );
}

function DynamicInstability() {
  const pts: [number, number][] = [[60, 222], [132, 132], [148, 204], [216, 112], [232, 222], [296, 168]];
  return (
    <Svg h={290} label="אי-יציבות דינמית: גרף של אורך מיקרוטובול לאורך זמן — גדילה איטית, קטסטרופה והתכווצות מהירה, הצלה וחוזר חלילה; מימין — קצה גדל עם כובע של GTP-טובולין, וקצה מתכווץ שבו פרוטופילמנטים של GDP-טובולין מתקלפים החוצה">
      <line x1={50} y1={232} x2={306} y2={232} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <line x1={50} y1={236} x2={50} y2={44} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <He x={178} y={256} size={12.5}>זמן</He>
      <He x={30} y={140} size={12.5} rotate={-90}>אורך המיקרוטובול</He>
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={GREEN} strokeWidth={3} strokeLinejoin="round" />
      <He x={132} y={120} size={11.5} color={RED} bold>קטסטרופה</He>
      <He x={148} y={226} size={11.5} color={BLUE} bold>הצלה</He>
      <He x={82} y={150} size={11} color={MUTED}>גדילה איטית</He>
      <He x={240} y={140} size={11} color={MUTED} anchor="start">התכווצות</He>
      <He x={240} y={154} size={11} color={MUTED} anchor="start">מהירה</He>
      {/* growing end */}
      <rect x={340} y={70} width={84} height={26} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <rect x={424} y={70} width={30} height={26} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.4} />
      <He x={402} y={56} size={12} bold>קצה גדל</He>
      <He x={440} y={116} size={11} color={ORANGE}>כובע GTP</He>
      {/* shrinking end */}
      <rect x={340} y={176} width={84} height={26} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <path d="M424 178 q18 -6 22 -26" fill="none" stroke={GREEN} strokeWidth={5} strokeLinecap="round" />
      <path d="M424 200 q18 6 22 26" fill="none" stroke={GREEN} strokeWidth={5} strokeLinecap="round" />
      <path d="M424 189 q20 0 30 -8" fill="none" stroke="#86efac" strokeWidth={5} strokeLinecap="round" />
      <He x={402} y={162} size={12} bold>קצה מתכווץ</He>
      <He x={402} y={252} size={11} color={MUTED}>GDP-טובולין מתקלף</He>
    </Svg>
  );
}

// ── cell-motors-polarity ─────────────────────────────────────────────────────
function MotorProteins() {
  const mtY = 112, acY = 224;
  return (
    <Svg h={290} label="שלוש משפחות של מנועים: על מיקרוטובול — קינזין נע לקצה הפלוס (החוצה) ודיינאין לקצה המינוס (אל הצנטרוזום); על סיב אקטין — מיוזין V נע לקצה הפלוס. כל מנוע נושא מטען בזנב">
      {/* microtubule */}
      <rect x={40} y={mtY - 7} width={400} height={14} rx={7} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <La x={28} y={mtY + 5} size={13} bold>−</La>
      <La x={454} y={mtY + 5} size={13} bold>+</La>
      <He x={240} y={mtY + 30} size={11} color={MUTED}>מיקרוטובול</He>
      {/* dynein */}
      <circle cx={140} cy={mtY - 18} r={12} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.5} />
      <circle cx={162} cy={mtY - 18} r={12} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.5} />
      <Line x1={151} y1={mtY - 30} x2={151} y2={66} c={PURPLE} w={2} />
      <circle cx={151} cy={50} r={17} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.5} />
      <Arrow x1={118} y1={50} x2={72} y2={50} color={PURPLE} width={2.4} />
      <He x={96} y={34} size={12} bold color={PURPLE}>דיינאין</He>
      {/* kinesin */}
      <ellipse cx={318} cy={mtY - 12} rx={9} ry={6} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <ellipse cx={338} cy={mtY - 12} rx={9} ry={6} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <path d={`M318 ${mtY - 18} L328 ${mtY - 34} L338 ${mtY - 18}`} fill="none" stroke={BLUE} strokeWidth={1.6} />
      <Line x1={328} y1={mtY - 34} x2={328} y2={66} c={BLUE} w={2} />
      <circle cx={328} cy={50} r={17} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.5} />
      <Arrow x1={362} y1={50} x2={408} y2={50} color={BLUE} width={2.4} />
      <He x={386} y={34} size={12} bold color={BLUE}>קינזין</He>
      {/* actin + myosin V */}
      {Array.from({ length: 34 }, (_, i) => <circle key={i} cx={46 + i * 12} cy={acY + (i % 2 ? 3 : -3)} r={6} fill={FILL.red} stroke={RED} strokeWidth={0.8} />)}
      <La x={28} y={acY + 5} size={13} bold>−</La>
      <La x={454} y={acY + 5} size={13} bold>+</La>
      <He x={240} y={acY + 30} size={11} color={MUTED}>סיב אקטין</He>
      <ellipse cx={226} cy={acY - 14} rx={10} ry={6} fill={FILL.blue} stroke={INK} strokeWidth={1.2} />
      <ellipse cx={286} cy={acY - 14} rx={10} ry={6} fill={FILL.blue} stroke={INK} strokeWidth={1.2} />
      <path d={`M226 ${acY - 20} L256 ${acY - 52} L286 ${acY - 20}`} fill="none" stroke={INK} strokeWidth={2} />
      <circle cx={256} cy={acY - 66} r={14} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.5} />
      <Arrow x1={300} y1={acY - 66} x2={344} y2={acY - 66} color={INK} width={2.4} />
      <He x={372} y={acY - 62} size={12} bold anchor="start">מיוזין V</He>
    </Svg>
  );
}

// ── cell-junctions ───────────────────────────────────────────────────────────
function JunctionsEpithelium() {
  const top = 54, bot = 276, xa = 74, xb = 350, mid = 212;
  const lbl = (y: number, t: string, c = INK) => (
    <g>
      <line x1={mid + 6} y1={y} x2={374} y2={y} stroke={LINE} strokeWidth={1.2} />
      <He x={474} y={y + 4} size={11.5} anchor="end" bold color={c}>{t}</He>
    </g>
  );
  return (
    <Svg h={330} label="שני תאי אפיתל שכנים מלמעלה למטה: קשר הדוק סמוך לצד האפיקלי, צמת נצמד עם חגורת אקטין, דסמוזום שמחובר לסיבי ביניים, צמת פער עם תעלות בין התאים; ובבסיס המי-דסמוזום שמעגן את התא ללמינה הבזלית">
      {/* cells */}
      <rect x={xa} y={top} width={mid - 2 - xa} height={bot - top} rx={6} fill={FILL.sky} stroke={BLUE} strokeWidth={1.6} />
      <rect x={mid + 2} y={top} width={xb - mid - 2} height={bot - top} rx={6} fill={FILL.sky} stroke={BLUE} strokeWidth={1.6} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => <rect key={i} x={xa + 6 + i * 25} y={top - 16} width={8} height={18} rx={4} fill={FILL.sky} stroke={BLUE} strokeWidth={1.2} />)}
      <He x={38} y={60} size={11} color={MUTED}>אפיקלי</He>
      <He x={38} y={276} size={11} color={MUTED}>בזלי</He>
      {/* basal lamina */}
      <rect x={xa - 6} y={bot + 6} width={xb - xa + 12} height={10} rx={3} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.2} />
      {/* tight junction */}
      {[64, 72, 80].map((y) => <circle key={y} cx={mid} cy={y} r={3.2} fill={INK} />)}
      {lbl(72, "קשר הדוק")}
      {/* adherens with actin belt */}
      {[100, 106, 112].map((y) => <line key={y} x1={mid - 6} x2={mid + 6} y1={y} y2={y} stroke={PURPLE} strokeWidth={1.6} />)}
      <circle cx={mid - 14} cy={106} r={5} fill={RED} /><circle cx={mid + 14} cy={106} r={5} fill={RED} />
      {lbl(106, "צמת נצמד — אקטין", RED)}
      {/* desmosome */}
      <rect x={mid - 14} y={150} width={6} height={30} fill={INK} /><rect x={mid + 8} y={150} width={6} height={30} fill={INK} />
      {[156, 165, 174].map((y) => <line key={y} x1={mid - 8} x2={mid + 8} y1={y} y2={y} stroke={PURPLE} strokeWidth={1.4} />)}
      {[[-1, 140], [-1, 165], [-1, 190], [1, 140], [1, 165], [1, 190]].map(([s, y], i) => (
        <path key={i} d={`M${mid + s * 14} 165 Q${mid + s * 50} ${y} ${mid + s * 90} ${y + (y - 165) * 0.4}`} fill="none" stroke={GREEN} strokeWidth={1.8} />
      ))}
      {lbl(165, "דסמוזום — סיבי ביניים", GREEN)}
      {/* gap junction */}
      {[212, 222, 232].map((y) => <rect key={y} x={mid - 7} y={y - 3} width={14} height={6} rx={2} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.2} />)}
      {lbl(222, "צמת פער", ORANGE)}
      {/* hemidesmosome */}
      <rect x={290} y={bot - 8} width={26} height={6} fill={INK} />
      {[-1, 0, 1].map((s) => <path key={s} d={`M${303 + s * 8} ${bot - 8} q${s * 10} -24 ${s * 24} -40`} fill="none" stroke={GREEN} strokeWidth={1.8} />)}
      {[294, 303, 312].map((x) => <line key={x} x1={x} x2={x} y1={bot - 2} y2={bot + 6} stroke={PURPLE} strokeWidth={1.6} />)}
      <line x1={322} y1={bot - 5} x2={374} y2={262} stroke={LINE} strokeWidth={1.2} />
      <He x={474} y={266} size={11.5} anchor="end" bold color={GREEN}>המי-דסמוזום</He>
      <He x={474} y={300} size={11.5} anchor="end" bold color={ORANGE}>למינה בזלית</He>
    </Svg>
  );
}

// ── cell-ecm ─────────────────────────────────────────────────────────────────
function EcmOverview() {
  let elastin = "";
  for (let x = 30; x <= 250; x += 4) elastin += `${x === 30 ? "M" : "L"}${x} ${(150 + 10 * Math.sin(x / 9)).toFixed(1)}`;
  let elastin2 = "";
  for (let x = 30; x <= 250; x += 4) elastin2 += `${x === 30 ? "M" : "L"}${x} ${(166 + 10 * Math.sin(x / 9 + 2)).toFixed(1)}`;
  const cores = [318, 344, 370, 396, 422, 448];
  return (
    <Svg h={300} label="המטריקס החוץ-תאי: פיברובלסט מפריש סיבי קולגן (חוזק במתיחה), סיבי אלסטין (גמישות), ופרוטאוגליקנים שקשורים לחומצה היאלורונית (מושכים מים ועומדים בלחץ); פיברונקטין מחבר את הקולגן לאינטגרינים בממברנת התא">
      {/* collagen */}
      {[62, 76, 90].map((y) => <line key={y} x1={26} x2={300} y1={y} y2={y - 14} stroke={ORANGE} strokeWidth={7} strokeDasharray="14 3" strokeLinecap="round" />)}
      <He x={160} y={38} size={12} bold color={ORANGE}>סיבי קולגן — עמידות במתיחה</He>
      {/* elastin */}
      <path d={elastin} fill="none" stroke={GREEN} strokeWidth={3} />
      <path d={elastin2} fill="none" stroke={GREEN} strokeWidth={3} />
      {[66, 122, 178, 234].map((x) => <line key={x} x1={x} x2={x} y1={150 + 10 * Math.sin(x / 9)} y2={166 + 10 * Math.sin(x / 9 + 2)} stroke={GREEN} strokeWidth={2} />)}
      <He x={140} y={128} size={12} bold color={GREEN}>אלסטין — גמישות</He>
      {/* proteoglycan aggregate */}
      <Line x1={306} y1={150} x2={462} y2={150} c={PURPLE} w={3} />
      {cores.map((x) => (
        <g key={x}>
          <Line x1={x} y1={112} x2={x} y2={188} c={BLUE} w={2} />
          {[118, 128, 138, 162, 172, 182].map((y) => <line key={y} x1={x - 7} x2={x + 7} y1={y} y2={y - 4} stroke={PURPLE} strokeWidth={1.2} />)}
        </g>
      ))}
      <He x={384} y={92} size={12} bold color={PURPLE}>פרוטאוגליקנים</He>
      <He x={384} y={210} size={11} color={MUTED}>על חומצה היאלורונית</He>
      <He x={384} y={226} size={11} color={MUTED}>מושכים מים — עמידות בלחץ</He>
      {/* cell, integrin, fibronectin */}
      <ellipse cx={110} cy={262} rx={92} ry={30} fill={FILL.sky} stroke={BLUE} strokeWidth={1.6} />
      <He x={92} y={270} size={12} bold color={BLUE}>פיברובלסט</He>
      <path d="M176 238 L176 222 M170 214 L176 222 L182 214" fill="none" stroke={PURPLE} strokeWidth={2.4} />
      <path d="M176 212 L196 150 L214 96" fill="none" stroke={BLUE} strokeWidth={2.6} strokeDasharray="8 3" />
      <He x={234} y={210} size={11.5} color={BLUE} anchor="start">פיברונקטין</He>
      <He x={194} y={250} size={11.5} color={PURPLE} anchor="start">אינטגרין</He>
    </Svg>
  );
}

// ── cell-signaling-principles ────────────────────────────────────────────────
function ReceptorClasses() {
  const my = 112, mh = 30;
  const lig = (x: number, y: number) => <path d={`M${x} ${y} l8 14 l-16 0 z`} fill={ORANGE} />;
  return (
    <Svg h={280} label="שלוש משפחות של קולטני פני התא: קולטן-תעלה שהליגנד פותח ויונים עוברים בו; קולטן מצומד חלבון G שעובר את הממברנה שבע פעמים ומפעיל חלבון G; וקולטן מצומד אנזים, לרוב קינאז, שהליגנד מקרב שני עותקים שלו והם מזרחנים זה את זה">
      <He x={240} y={20} size={12} color={MUTED}>מחוץ לתא</He>
      <Membrane y={my} h={mh} />
      {/* ion channel */}
      <rect x={60} y={my - 18} width={18} height={mh + 36} rx={6} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.5} />
      <rect x={92} y={my - 18} width={18} height={mh + 36} rx={6} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.5} />
      {lig(69, 70)}
      {[60, 86, 112].map((y, i) => <circle key={y} cx={85} cy={y + 10 + i * 18} r={4} fill={BLUE} />)}
      <Arrow x1={85} y1={162} x2={85} y2={186} color={BLUE} />
      {/* GPCR */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={206 + i * 10} y={my - 4} width={8} height={mh + 8} rx={3} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.1} />)}
      {lig(240, 84)}
      <ellipse cx={226} cy={my + mh + 18} rx={16} ry={11} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <ellipse cx={254} cy={my + mh + 16} rx={11} ry={9} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <ellipse cx={270} cy={my + mh + 10} rx={6} ry={6} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <La x={226} y={my + mh + 22} size={10.5} bold color={GREEN}>α</La>
      <La x={254} y={my + mh + 20} size={10.5} bold color={BLUE}>β</La>
      {/* enzyme-coupled */}
      {[378, 410].map((x) => (
        <g key={x}>
          <rect x={x - 9} y={58} width={18} height={my - 58} rx={6} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
          <Line x1={x} y1={my} x2={x} y2={my + mh} c={PURPLE} w={3} />
          <rect x={x - 12} y={my + mh} width={24} height={36} rx={6} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
          <Tag x={x + (x < 394 ? -20 : 20)} y={my + mh + 24} t="P" r={8} />
        </g>
      ))}
      <path d="M394 56 l8 14 l-16 0 z" fill={ORANGE} />
      {([[85, "קולטן-תעלה", "הליגנד פותח תעלה"], [240, "GPCR", "מפעיל חלבון G"], [394, "מצומד אנזים", "לרוב קינאז (RTK)"]] as [number, string, string][]).map(([x, a, b]) => (
        <g key={x}>
          {/[A-Z]/.test(a) ? <La x={x} y={232} size={13} bold>{a}</La> : <He x={x} y={232} size={13} bold>{a}</He>}
          <He x={x} y={252} size={11.5} color={MUTED}>{b}</He>
        </g>
      ))}
    </Svg>
  );
}

function MolecularSwitches() {
  const cyc = (cx: number, title: string, off: string, on: string, down: string, downSub: string, up: string, upSub: string, tag: string) => (
    <g>
      <He x={cx} y={20} size={13} bold>{title}</He>
      <HBox x={cx} y={36} w={150} label={off} c={MUTED} fill={FILL.gray} />
      <HBox x={cx} y={190} w={150} label={on} c={GREEN} fill={FILL.green} bold />
      <Tag x={cx + 64} y={190} t={tag} c={GREEN} fill="#ffffff" r={tag.length > 1 ? 15 : 10} size={tag.length > 1 ? 9.5 : 10.5} />
      <Arrow x1={cx + 34} y1={70} x2={cx + 34} y2={186} color={GREEN} width={2.4} />
      <Arrow x1={cx - 34} y1={186} x2={cx - 34} y2={70} color={MUTED} width={2.4} />
      <He x={cx + 42} y={124} size={12} bold anchor="start" color={GREEN}>{down}</He>
      {/[א-ת]/.test(downSub) ? <He x={cx + 42} y={142} size={10.5} anchor="start" color={MUTED}>{downSub}</He> : <La x={cx + 42} y={142} size={10.5} anchor="start" color={MUTED}>{downSub}</La>}
      <He x={cx - 42} y={124} size={12} bold anchor="end">{up}</He>
      {/[א-ת]/.test(upSub) ? <He x={cx - 42} y={142} size={10.5} anchor="end" color={MUTED}>{upSub}</He> : <La x={cx - 42} y={142} size={10.5} anchor="end" color={MUTED}>{upSub}</La>}
    </g>
  );
  return (
    <Svg h={240} label="שני סוגי מתגים מולקולריים: משמאל — זרחון: קינאז מוסיף פוספט ופוספטאזה מסירה אותו; מימין — חלבון קושר GTP: GEF מחליף GDP ב-GTP ומדליק, ו-GAP מאיץ את פירוק ה-GTP ומכבה">
      {cyc(120, "זרחון", "כבוי", "דלוק", "קינאז", "ATP → ADP", "פוספטאזה", "− Pi", "P")}
      {cyc(360, "קשירת GTP", "כבוי — GDP", "דלוק — GTP", "GEF", "GDP → GTP", "GAP", "מאיץ פירוק GTP", "GTP")}
    </Svg>
  );
}

// ── cell-gpcr ────────────────────────────────────────────────────────────────
function PlcPathway() {
  const my = 70, mh = 28;
  return (
    <Svg h={300} label="מסלול Gq ו-PLC: הליגנד מפעיל GPCR, חלבון Gq מפעיל פוספוליפאזה C-β, שחותכת PIP₂ ל-DAG שנשאר בממברנה ול-IP₃ שמתפזר ופותח תעלות Ca²⁺ ב-ER; Ca²⁺ ו-DAG מפעילים יחד את PKC, ו-Ca²⁺ פועל גם דרך קלמודולין">
      <Membrane y={my} h={mh} />
      <path d="M48 36 l8 14 l-16 0 z" fill={ORANGE} />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={30 + i * 9} y={my - 4} width={7} height={mh + 8} rx={3} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.1} />)}
      <La x={52} y={my + mh + 22} size={11.5} bold color={PURPLE}>GPCR</La>
      <LBox x={118} y={my + mh + 4} w={50} h={26} label="Gαq" c={GREEN} fill={FILL.green} size={12} />
      <Arrow x1={144} y1={my + mh + 17} x2={170} y2={my + mh + 17} color={GREEN} />
      <LBox x={204} y={my + mh + 4} w={64} h={26} label="PLCβ" c={BLUE} fill={FILL.blue} size={12} bold />
      <La x={268} y={my + 19} size={12} bold>PIP₂</La>
      <Arrow x1={232} y1={my + mh + 6} x2={256} y2={my + mh - 2} color={BLUE} />
      {/* DAG */}
      <Arrow x1={290} y1={my + 14} x2={340} y2={my + 14} color={INK} />
      <La x={362} y={my + 19} size={12} bold color={ORANGE}>DAG</La>
      <LBox x={400} y={my + mh + 34} w={64} h={28} label="PKC" c={ORANGE} fill={FILL.orange} size={13} bold />
      <Arrow x1={370} y1={my + mh + 2} x2={390} y2={my + mh + 32} color={ORANGE} />
      {/* IP3 */}
      <Arrow x1={270} y1={my + mh + 4} x2={270} y2={my + mh + 50} color={INK} />
      <Tag x={270} y={my + mh + 64} t="IP₃" c={PURPLE} fill={FILL.purple} r={14} size={10.5} />
      <Arrow x1={270} y1={my + mh + 80} x2={270} y2={212} color={PURPLE} />
      {/* ER */}
      <rect x={150} y={218} width={240} height={52} rx={20} fill={FILL.sky} stroke={BLUE} strokeWidth={1.6} />
      <rect x={258} y={212} width={9} height={18} rx={2} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />
      <rect x={273} y={212} width={9} height={18} rx={2} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />
      <La x={196} y={250} size={14} bold color={BLUE}>ER</La>
      {[[300, 248], [330, 240], [355, 252]].map(([x, y]) => <Tag key={x} x={x} y={y} t="Ca" c={RED} fill={FILL.red} r={9} size={9} />)}
      {/* Ca release */}
      {[[292, 198], [312, 184], [334, 196]].map(([x, y]) => <Tag key={x} x={x} y={y} t="Ca" c={RED} fill={FILL.red} r={9} size={9} />)}
      <Arrow x1={346} y1={186} x2={388} y2={164} color={RED} />
      <Arrow x1={350} y1={200} x2={418} y2={210} color={RED} />
      <He x={436} y={226} size={11.5} bold color={RED}>קלמודולין</He>
      <He x={110} y={190} size={11} color={MUTED}>IP₃ מתפזר בציטוזול</He>
      <He x={110} y={206} size={11} color={MUTED}>ופותח תעלות Ca²⁺ ב-ER</He>
      <He x={420} y={52} size={11} color={MUTED}>DAG נשאר בממברנה</He>
    </Svg>
  );
}

// ── cell-rtk ─────────────────────────────────────────────────────────────────
function RtkActivation() {
  const my = 112, mh = 26;
  const rec = (x: number, active: boolean, side: number) => (
    <g key={x}>
      <rect x={x - 10} y={50} width={20} height={my - 50} rx={7} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <Line x1={x} y1={my} x2={x} y2={my + mh} c={PURPLE} w={3} />
      <rect x={x - 13} y={my + mh} width={26} height={54} rx={7} fill={active ? FILL.green : FILL.blue} stroke={active ? GREEN : BLUE} strokeWidth={1.4} />
      {active && [my + mh + 14, my + mh + 40].map((y) => <Tag key={y} x={x + side * 22} y={y} t="P" r={8} />)}
    </g>
  );
  return (
    <Svg h={270} label="הפעלה של קולטן טירוזין-קינאז: משמאל — שני קולטנים נפרדים בלי ליגנד, הקינאזות לא פעילות; מימין — הליגנד מקרב אותם, הקינאזות מזרחנות זו את זו על טירוזינים, והטירוזינים המזורחנים משמשים אתרי עגינה לחלבון עם אזור SH2">
      <Membrane y={my} h={mh} />
      {rec(84, false, 0)}{rec(150, false, 0)}
      <He x={117} y={236} size={12} bold>בלי ליגנד</He>
      <He x={117} y={254} size={11} color={MUTED}>מונומרים, קינאז לא פעיל</He>
      <Arrow x1={196} y1={186} x2={250} y2={186} width={2.4} />
      {rec(330, true, -1)}{rec(370, true, 1)}
      <ellipse cx={350} cy={40} rx={22} ry={12} fill={ORANGE} />
      <He x={350} y={24} size={11.5} color={ORANGE} bold>ליגנד</He>
      <path d={`M336 ${my + mh + 22} q14 -10 28 0`} fill="none" stroke={INK} strokeWidth={1.4} markerEnd="url(#bfArrowS)" />
      <path d={`M364 ${my + mh + 34} q-14 10 -28 0`} fill="none" stroke={INK} strokeWidth={1.4} markerEnd="url(#bfArrowS)" />
      <ellipse cx={424} cy={my + mh + 40} rx={22} ry={14} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.4} />
      <La x={424} y={my + mh + 44} size={11} bold color={ORANGE}>SH2</La>
      <He x={350} y={236} size={12} bold>דימר, זרחון הדדי</He>
      <He x={350} y={254} size={11} color={MUTED}>טירוזינים מזורחנים = אתרי עגינה</He>
    </Svg>
  );
}

function RasMapk() {
  const my = 30, mh = 22, x = 330;
  const kin: [number, string, string][] = [[122, "Raf", "MAPKKK"], [180, "Mek", "MAPKK"], [238, "Erk", "MAPK"]];
  return (
    <Svg h={340} label="מסלול Ras–MAPK: קולטן מזורחן מגייס את Grb2, שמביא את Sos; Sos מחליף GDP ב-GTP על Ras; Ras-GTP מפעיל את Raf, Raf מזרחן את Mek, Mek מזרחן את Erk, ו-Erk נכנס לגרעין ומזרחן גורמי שעתוק שמפעילים גנים של חלוקה">
      <Membrane y={my} h={mh} />
      <rect x={52} y={my + mh} width={22} height={52} rx={6} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <Line x1={63} y1={my - 18} x2={63} y2={my + mh} c={PURPLE} w={3} />
      <Tag x={86} y={my + mh + 18} t="P" r={8} />
      <He x={63} y={my + mh + 72} size={11} color={MUTED}>RTK</He>
      <LBox x={134} y={my + mh + 6} w={56} h={26} label="Grb2" c={PURPLE} fill={FILL.purple} size={12} />
      <LBox x={210} y={my + mh + 6} w={56} h={26} label="Sos" c={PURPLE} fill={FILL.purple} size={12} />
      <Arrow x1={240} y1={my + mh + 19} x2={286} y2={my + mh + 19} color={GREEN} width={2.4} />
      <La x={262} y={my + mh + 48} size={10.5} color={GREEN}>GEF</La>
      <LBox x={x} y={my + mh + 6} w={76} h={26} label="Ras-GTP" c={GREEN} fill={FILL.green} size={12} bold />
      <He x={x + 64} y={my + mh + 24} size={11} color={MUTED} anchor="start">בממברנה</He>
      {kin.map(([y, n, fam], i) => (
        <g key={n}>
          <Arrow x1={x} y1={y - 28} x2={x} y2={y - 2} color={BLUE} width={2.4} />
          <LBox x={x} y={y} w={76} h={28} label={n} c={BLUE} fill={FILL.blue} size={13} bold />
          <La x={x + 50} y={y + 19} size={11} color={MUTED} anchor="start">{fam}</La>
          {i > 0 && <He x={x - 50} y={y - 10} size={11} anchor="end" color={BLUE}>מזרחן</He>}
        </g>
      ))}
      <Arrow x1={x} y1={268} x2={x} y2={292} color={BLUE} width={2.4} />
      <rect x={200} y={294} width={260} height={38} rx={19} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.4} />
      <He x={x} y={318} size={12} bold>גרעין: גורמי שעתוק → גנים של חלוקה</He>
      <He x={120} y={190} size={11.5} color={MUTED}>מפל של שלושה קינאזות:</He>
      <He x={120} y={208} size={11.5} color={MUTED}>הגברה ונקודות ויסות</He>
    </Svg>
  );
}

// ── cell-cycle-control ───────────────────────────────────────────────────────
function CellCycleControl() {
  const cx = 160, cy = 172, r = 104;
  const phases: [string, number, number, string][] = [["G1", -90, 70, BLUE], ["S", 70, 190, GREEN], ["G2", 190, 250, PURPLE], ["M", 250, 270, ORANGE]];
  const check = (deg: number) => {
    const [x0, y0] = polar(cx, cy, r - 16, deg), [x1, y1] = polar(cx, cy, r + 16, deg);
    return <line key={deg} x1={x0} y1={y0} x2={x1} y2={y1} stroke={RED} strokeWidth={4} strokeLinecap="round" />;
  };
  const labelAt = (deg: number, rr: number) => polar(cx, cy, rr, deg);
  const cdks: [string, string, string][] = [["ציקלין D–Cdk4/6", "G1, בתגובה לגורמי גדילה", BLUE], ["ציקלין E–Cdk2", "מעבר Start", BLUE], ["ציקלין A–Cdk2", "S", GREEN], ["ציקלין B–Cdk1", "M", ORANGE]];
  return (
    <Svg h={330} label="מחזור התא: G1, S, G2 ו-M, עם שלוש נקודות ביקורת — Start בסוף G1, G2/M, ומעבר מטאפאזה–אנאפאזה. לכל שלב קומפלקס ציקלין–Cdk משלו; SCF פועלת במעבר G1/S ו-APC/C מאמצע M ועד סוף G1">
      {phases.map(([n, a0, a1, c]) => {
        const [lx, ly] = labelAt((a0 + a1) / 2, r - 40);
        return (
          <g key={n}>
            <path d={arc(cx, cy, r, a0 + 1, a1 - 1)} fill="none" stroke={c} strokeWidth={16} />
            <La x={lx} y={ly + 6} size={n === "M" ? 13 : 16} bold color={c}>{n}</La>
          </g>
        );
      })}
      {[70, 250, 263].map(check)}
      {(() => { const [x, y] = labelAt(70, r + 34); return <g><La x={x} y={y} size={12} bold color={RED}>Start</La><He x={x} y={y + 16} size={10.5} color={MUTED}>(נקודת ההגבלה)</He></g>; })()}
      {(() => { const [x, y] = labelAt(240, r + 30); return <La x={x} y={y} size={12} bold color={RED} anchor="end">G2/M</La>; })()}
      <He x={196} y={30} size={11} bold color={RED}>מטאפאזה–אנאפאזה</He>
      <Line x1={174} y1={36} x2={152} y2={56} c={LINE} w={1.2} />
      {/* SCF / APC/C */}
      <He x={cx} y={cy - 6} size={11} color={MUTED}>APC/C:</He>
      <He x={cx} y={cy + 10} size={11} color={MUTED}>מאמצע M עד סוף G1</He>
      {/* legend */}
      <He x={474} y={40} size={12} bold anchor="end">קומפלקסים של ציקלין–Cdk</He>
      {cdks.map(([a, b, c], i) => (
        <g key={a}>
          <circle cx={466} cy={66 + i * 44} r={5} fill={c} />
          <He x={456} y={70 + i * 44} size={11.5} bold anchor="end">{a}</He>
          <He x={456} y={86 + i * 44} size={10.5} anchor="end" color={MUTED}>{b}</He>
        </g>
      ))}
      <Line x1={466} y1={252} x2={480} y2={252} c={RED} w={4} />
      <He x={456} y={256} size={11.5} anchor="end">נקודת ביקורת</He>
      <He x={474} y={290} size={11} anchor="end" color={MUTED}>SCF מפרקת מעכבי Cdk במעבר G1/S</He>
    </Svg>
  );
}

export const CELL_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "membrane-bilayer": { el: MembraneBilayer, captionHe: "דו-שכבה של שומנים בחתך. הראשים ההידרופיליים פונים למים משני הצדדים, והזנבות יוצרים ליבה הידרופובית של כ-5 ננומטר. השכבות לא זהות: פוספטידילסרין (כתום, טעון שלילית) נמצא רק בשכבה הפנימית, והסוכרים — על גליקוליפידים ועל חלבונים — פונים רק החוצה. סכמטי." },
  "protein-sorting-map": { el: ProteinSortingMap, captionHe: "מפת המיון של חלבונים בתא. כל החלבונים מתחילים להיתרגם בציטוזול. ירוק — מעבר דרך נקבוביות (החלבון מקופל); כחול — מעבר דרך טרנסלוקטורים (השרשרת פרושה); כתום — מעבר בשלפוחיות, במסלול ההפרשה והאנדוציטוזה. סכמטי." },
  "cotranslational-translocation": { el: CotranslationalTranslocation, captionHe: "כניסה ל-ER תוך כדי תרגום. (1) רצף האות (אדום) יוצא מהריבוזום ו-SRP נקשר אליו ומאט את התרגום. (2) SRP נקשר לקולטן שלו בממברנת ה-ER, ליד תעלת Sec61 הסגורה. (3) SRP משתחרר (תלוי GTP), התעלה נפתחת, השרשרת מושחלת לחלל ה-ER, ופפטידאז האות חותך את האות. סכמטי." },
  "calnexin-cycle": { el: CalnexinCycle, captionHe: "מחזור הקלנקסין: בקרת האיכות של גליקופרוטאינים ב-ER. הגלוקוז האחד שנשאר על הגליקן קובע אם החלבון קשור לקלנקסין. UGGT מוסיף גלוקוז רק לחלבון שעדיין לא מקופל — כך הוא חוזר לסבב נוסף. חלבון שנכשל שוב ושוב מאבד מנוזים ומפונה לפירוק (ERAD). סכמטי." },
  "golgi-sorting": { el: GolgiSorting, captionHe: "הגולג'י וקוטביותו. חלבונים מגיעים מה-ER בשלפוחיות COPII לצד ה-cis, ובורחים שחוזרים ל-ER בשלפוחיות COPI. ברשת ה-trans (TGN) הם ממוינים לשלושה יעדים: לליזוזומים (דרך קולטן מנוז-6-פוספט ואנדוזומים), לגרגרי הפרשה מווסתת, ולהפרשה רציפה לממברנת התא. סכמטי." },
  "vesicle-cycle": { el: VesicleCycle, captionHe: "מחזור של שלפוחית הובלה. (1) מעטפת (כתום מקווקו) נבנית על הממברנה התורמת ומעצבת אותה; (2) השלפוחית מתנתקת; (3) המעטפת מוסרת; (4) מנוע מוביל אותה לאורך מיקרוטובול; (5) Rab וגורם קשירה מעגנים אותה ליעד; (6) SNAREs משתי הממברנות מתלפפים ומאחים אותן. סכמטי." },
  "ran-cycle": { el: RanCycle, captionHe: "מחזור Ran והכיוון של המעבר דרך הנקבוביות. RanGAP בציטוזול ו-RanGEF על הכרומטין יוצרים מפל: Ran-GTP בגרעין, Ran-GDP בציטוזול. ביבוא, Ran-GTP משחרר את המטען בגרעין; האימפורטין חוזר עם Ran-GTP, וה-GTP מתפרק בציטוזול. Ran-GDP חוזר לגרעין בעזרת NTF2. סכמטי." },
  "cytoskeleton-types": { el: CytoskeletonTypes, captionHe: "שלושת סוגי הסיבים של שלד התא. לסיבי אקטין ולמיקרוטובולים יש קוטביות — קצה (+) שגדל מהר וקצה (−) שגדל לאט — והם נבנים מיחידות שקושרות ATP (אקטין) או GTP (טובולין). סיבי ביניים הם חבלים בלי קוטביות שנותנים חוזק מכני. סכמטי, לא בקנה מידה." },
  "dynamic-instability": { el: DynamicInstability, captionHe: "אי-יציבות דינמית של מיקרוטובולים. משמאל: מעקב אחרי האורך של מיקרוטובול אחד — גדילה איטית, קטסטרופה והתכווצות מהירה, והצלה (סכמטי). מימין: כל עוד בקצה יש כובע של GTP-טובולין (כתום) הוא ממשיך לגדול; כשהכובע אובד, GDP-טובולין מתכופף והפרוטופילמנטים מתקלפים." },
  "motor-proteins": { el: MotorProteins, captionHe: "שלוש משפחות של חלבונים מוטוריים. על מיקרוטובולים: רוב הקינזינים נעים לקצה (+), כלומר מהמרכז החוצה, ודיינאין לקצה (−), אל הצנטרוזום. על אקטין: מיוזין V נע לקצה (+). הראשים קושרים את הסיב ו-ATP; הזנב נושא את המטען (כתום). סכמטי." },
  "junctions-epithelium": { el: JunctionsEpithelium, captionHe: "הצמתים בין שני תאי אפיתל, מלמעלה למטה: קשר הדוק (אוטם), צמת נצמד עם חגורת אקטין (אדום), דסמוזום שמחובר לסיבי ביניים (ירוק), וצמת פער (תעלות כתומות). בבסיס — המי-דסמוזום מעגן את התא ללמינה הבזלית דרך אינטגרינים. סכמטי." },
  "ecm-overview": { el: EcmOverview, captionHe: "רכיבי המטריקס החוץ-תאי ברקמת חיבור. סיבי קולגן עומדים במתיחה; רשת אלסטין חוזרת לצורתה אחרי מתיחה; פרוטאוגליקנים שקשורים לשרשרת של חומצה היאלורונית מושכים מים ועומדים בלחץ. פיברונקטין מחבר בין הקולגן לאינטגרינים בממברנת הפיברובלסט. סכמטי." },
  "receptor-classes": { el: ReceptorClasses, captionHe: "שלוש המשפחות העיקריות של קולטנים על פני התא. קולטן-תעלה: הליגנד (כתום) פותח תעלת יונים. GPCR: חלבון שעובר את הממברנה שבע פעמים ומפעיל חלבון G טרימרי. קולטן מצומד אנזים: לרוב קינאז; הליגנד מקרב שני קולטנים והם מזרחנים זה את זה. סכמטי." },
  "molecular-switches": { el: MolecularSwitches, captionHe: "שני סוגי המתגים המולקולריים באיתות. משמאל: זרחון — קינאז מדליק (או מכבה) חלבון בהוספת פוספט, ופוספטאזה מחזירה. מימין: חלבון קושר GTP — GEF מדליק אותו (מחליף GDP ב-GTP), ו-GAP מכבה (מאיץ את פירוק ה-GTP). סכמטי." },
  "plc-pathway": { el: PlcPathway, captionHe: "מסלול Gq–PLC. פוספוליפאזה C-β חותכת את PIP₂ לשני שליחים: DAG, שנשאר בממברנה, ו-IP₃, שמתפזר ופותח תעלות Ca²⁺ ב-ER. Ca²⁺ ו-DAG מפעילים יחד את PKC; Ca²⁺ פועל גם דרך קלמודולין. סכמטי." },
  "rtk-activation": { el: RtkActivation, captionHe: "הפעלה של קולטן טירוזין-קינאז. בלי ליגנד הקולטנים נפרדים והקינאזות כמעט לא פעילות. הליגנד מקרב שני קולטנים; הקינאזות מזרחנות זו את זו (חצים), והטירוזינים המזורחנים בזנב משמשים אתרי עגינה לחלבונים עם אזור SH2. סכמטי." },
  "ras-mapk": { el: RasMapk, captionHe: "מסלול Ras–MAPK. המתאם Grb2 נקשר (דרך SH2) לקולטן המזורחן ומביא את Sos, ה-GEF של Ras. Ras-GTP מפעיל את Raf, ומכאן מפל של שלוש קינאזות — Raf, Mek, Erk. Erk נכנס לגרעין ומזרחן גורמי שעתוק, שמפעילים גנים שמכינים את התא לחלוקה. סכמטי." },
  "cell-cycle-control": { el: CellCycleControl, captionHe: "מחזור התא ומערכת הבקרה שלו. הקווים האדומים הם שלוש נקודות הביקורת: Start (נקודת ההגבלה) בסוף G1, המעבר G2/M, והמעבר מטאפאזה–אנאפאזה. לכל שלב קומפלקס ציקלין–Cdk משלו. SCF מפרקת מעכבי Cdk במעבר G1/S, ו-APC/C פעילה מאמצע M ועד סוף G1. אורך השלבים סכמטי." },
};
