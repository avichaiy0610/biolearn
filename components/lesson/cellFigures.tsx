/* Figures for the cell-biology units (Technion 134128). All schematic, not to scale.
   Colors: membranes gray, proteins purple, signals/ligands orange, active/GTP green, actin red.
   Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, BLUE, GREEN, INK, LINE, MUTED, ORANGE, He, La } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";
import { CELL_SYLLABUS_FIGURES } from "./cellSyllabusFigures";
import { CotranslationalTranslocation } from "./redraws/CotranslationalTranslocation";
import { MotorProteins } from "./redraws/MotorProteins";

import { VesicleCycle } from "./redraws/VesicleCycle";
import { CalnexinCycle } from "./redraws/CalnexinCycle";
import { GolgiSorting } from "./redraws/GolgiSorting";
import { RanCycle } from "./redraws/RanCycle";
import { CytoskeletonTypes } from "./redraws/CytoskeletonTypes";
import { JunctionsEpithelium } from "./redraws/JunctionsEpithelium";
import { EcmOverview } from "./redraws/EcmOverview";
import { ReceptorClasses } from "./redraws/ReceptorClasses";
import { PlcPathway } from "./redraws/PlcPathway";
import { RtkActivation } from "./redraws/RtkActivation";
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

// CotranslationalTranslocation: redrawn at textbook level (2026-11-02) — see ./redraws/CotranslationalTranslocation.tsx; old code in archive/figures/2026-11-02/.

// ── cell-quality-control ─────────────────────────────────────────────────────


// ── cell-golgi-endosomes ─────────────────────────────────────────────────────


// ── cell-vesicle-transport ───────────────────────────────────────────────────
// VesicleCycle: recomposed at textbook level, one picture on desktop (2026-11-07) — see ./redraws/VesicleCycle.tsx; old code in archive/figures/2026-11-07/.

// ── cell-nuclear-mito-import ─────────────────────────────────────────────────


// ── cell-cytoskeleton ────────────────────────────────────────────────────────


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
// MotorProteins: redrawn at textbook level (2026-11-05) — see ./redraws/MotorProteins.tsx; old code in archive/figures/2026-11-05/.

// ── cell-junctions ───────────────────────────────────────────────────────────


// ── cell-ecm ─────────────────────────────────────────────────────────────────


// ── cell-signaling-principles ────────────────────────────────────────────────


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


// ── cell-rtk ─────────────────────────────────────────────────────────────────


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
  ...CELL_SYLLABUS_FIGURES,
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
