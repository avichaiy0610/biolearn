/* Figures for the molecular-biology units (Technion 134082). Schematic, not to scale unless the caption
   says so. Colors: parental/template DNA blue, new DNA green, RNA purple, highlights orange.
   Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, Axes, BLUE, GREEN, INK, MUTED, ORANGE, He, La, curve, dash, scale } from "./biochemFigures";
import { Arrow, Cycle, type Edge } from "./metabolicFigures";
import { PcrPrimerDesign, SangerRead, PrimerExtensionGel, EmsaGel, FootprintLadder, ChipSteps, TweezersTrace } from "./molecularMethodsFigures";
import { TrnaStructure } from "./redraws/TrnaStructure";
import { OriginLicensing } from "./redraws/OriginLicensing";
import { PicAssembly } from "./redraws/PicAssembly";
import { ReplicationFork } from "./redraws/ReplicationFork";
import AnatomyEmbed from "./anatomy/AnatomyEmbed";

import { ElongationCycle } from "./redraws/ElongationCycle";
import { RibosomeSites } from "./redraws/RibosomeSites";
import { MolecularNucleosome } from "./redraws/MolecularNucleosome";
import { NucleotideStructure } from "./redraws/NucleotideStructure";
import { DoubleHelix } from "./redraws/DoubleHelix";
import { ChromatinLevels } from "./redraws/ChromatinLevels";
import { OricInitiation } from "./redraws/OricInitiation";
import { Telomerase } from "./redraws/Telomerase";
import { BacterialPromoter } from "./redraws/BacterialPromoter";
import { Terminators } from "./redraws/Terminators";
import { EnhancerLoop } from "./redraws/EnhancerLoop";
import { Aminoacylation } from "./redraws/Aminoacylation";
import { InitiationCompare } from "./redraws/InitiationCompare";
import { Termination } from "./redraws/Termination";
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
// Box with a Latin label (He would also work, but Latin is safer LTR).

// ── mol-nucleic-acids ────────────────────────────────────────────────────────




function DnaMelting() {
  const s = scale(60, 450, 240, 40, 70, 105, 0.95, 1.45);
  const f = (tm: number) => (T: number) => 1 + 0.37 / (1 + Math.exp(-(T - tm) / 1.3));
  const tms: [number, string, string][] = [[85.7, BLUE, "40% G+C"], [93.9, ORANGE, "60% G+C"]];
  return (
    <Svg h={290} label="עקומות התכה מחושבות לשני DNA: הבליעה ב-260 ננומטר עולה בכ-37% כשהגדילים נפרדים; DNA עם 60% G+C נמס בטמפרטורה גבוהה יותר (כ-94 מעלות) מ-DNA עם 40% (כ-86 מעלות)">
      <Axes x0={60} y0={240} x1={450} y1={40}
        xLabel={<He x={255} y={282} size={13}>טמפרטורה (°C)</He>}
        yLabel={<He x={22} y={140} size={12.5} rotate={-90}>בליעה ב-260 ננומטר</He>} />
      {[70, 80, 90, 100].map((t) => <g key={t}><line x1={s.sx(t)} x2={s.sx(t)} y1={240} y2={245} stroke={INK} /><La x={s.sx(t)} y={260} size={12}>{t}</La></g>)}
      {[1.0, 1.2, 1.4].map((a) => <g key={a}><line x1={55} x2={60} y1={s.sy(a)} y2={s.sy(a)} stroke={INK} /><La x={50} y={s.sy(a) + 4} size={11.5} anchor="end">{a.toFixed(1)}</La></g>)}
      {tms.map(([tm, c, lab], i) => (
        <g key={tm}>
          <path d={curve(f(tm), 70, 105, s)} fill="none" stroke={c} strokeWidth={3} />
          <line x1={s.sx(tm)} x2={s.sx(tm)} y1={240} y2={s.sy(1.185)} stroke={c} strokeWidth={1.4} {...dash} />
          <La x={i ? s.sx(98) : s.sx(82.5)} y={s.sy(1.27)} size={12.5} bold color={c} anchor={i ? "start" : "end"}>{lab}</La>
          <La x={i ? s.sx(98) : s.sx(82.5)} y={s.sy(1.27) + 16} size={11.5} color={c} anchor={i ? "start" : "end"}>{`Tm ≈ ${Math.round(tm)}°C`}</La>
        </g>
      ))}
    </Svg>
  );
}

// ── mol-chromatin ────────────────────────────────────────────────────────────



// ── mol-replication-fork ─────────────────────────────────────────────────────
// ReplicationFork: redrawn at textbook level (2026-11-05) — see ./redraws/ReplicationFork.tsx; old code in archive/figures/2026-11-05/.

// ── mol-replication-origins ──────────────────────────────────────────────────


// OriginLicensing: redrawn at textbook level (2026-11-02) — see ./redraws/OriginLicensing.tsx; old code in archive/figures/2026-11-02/.



// ── mol-repair ───────────────────────────────────────────────────────────────
function ExcisionRepair() {
  const row = (i: number, title: string, enz: string, gap: [number, number], gapLabel: string, mark: React.ReactNode) => {
    const y = 26 + i * 106;
    return (
      <g key={title}>
        <He x={468} y={y + 6} size={13} bold anchor="end">{title}</He>
        <Line x1={30} y1={y + 34} x2={gap[0]} y2={y + 34} />
        <Line x1={gap[1]} y1={y + 34} x2={330} y2={y + 34} />
        <path d={`M${gap[0]} ${y + 34} Q${(gap[0] + gap[1]) / 2} ${y + 6} ${gap[1]} ${y + 34}`} fill="none" stroke={ORANGE} strokeWidth={2.5} {...dash} />
        <Line x1={30} y1={y + 48} x2={330} y2={y + 48} />
        {mark}
        <He x={(gap[0] + gap[1]) / 2} y={y + 2} size={11} color={ORANGE} bold>{gapLabel}</He>
        <He x={240} y={y + 84} size={11.5} color={MUTED}>{enz}</He>
      </g>
    );
  };
  return (
    <Svg h={340} label="שלוש מערכות תיקון בחיתוך: BER מסיר בסיס פגום בודד, NER מסיר קטע סביב נזק שמעוות את הסליל, ו-MMR מסיר את הגדיל החדש מאתר GATC חצי-ממותל עד מעבר לאי-ההתאמה">
      {row(0, "BER", "גליקוזילאז ← AP אנדונוקלאז ← פולימראז ← ליגאז", [168, 178], "נוקלאוטיד 1", <rect x={169} y={50} width={8} height={10} fill={ORANGE} />)}
      {row(1, "NER", "UvrABC חותך משני הצדדים ← הליקאז ← Pol I ← ליגאז", [120, 220], "12–13 בחיידק · 25–30 באדם", <path d="M162 158 Q170 146 178 158" fill="none" stroke={RED} strokeWidth={3} />)}
      {row(2, "MMR", "MutS ← MutL ← MutH חותך את הגדיל הלא-ממותל ← הסרה ומילוי", [60, 250], "עד כ-1,000 נוקלאוטידים", <g><circle cx={238} cy={272} r={5} fill={RED} /><La x={34} y={302} size={10.5} color={BLUE} anchor="start">GATC + CH₃</La></g>)}
    </Svg>
  );
}

// ── mol-recombination ────────────────────────────────────────────────────────
function DsbRepairModel() {
  const P = (i: number) => 34 + i * 76;
  const lbl = (i: number, t: string) => <He x={470} y={P(i) - 14} size={11.5} bold anchor="end">{t}</He>;
  const o = (y: number, x1 = 40, x2 = 440) => <Line x1={x1} y1={y} x2={x2} y2={y} c={ORANGE} />;
  const b = (y: number, x1: number, x2: number) => <Line x1={x1} y1={y} x2={x2} y2={y} c={BLUE} />;
  return (
    <Svg h={480} label="מודל תיקון השבר הדו-גדילי: שבר, אכילת קצוות ליצירת זנבות 3', פלישת גדיל ללולאת D וסינתזה, לכידת הקצה השני, צומת הולידיי כפולה, והתרה לתוצרים עם שחלוף או בלעדיו">
      {lbl(0, "1. שבר דו-גדילי")}
      {b(P(0), 40, 228)}{b(P(0), 252, 440)}{b(P(0) + 8, 40, 228)}{b(P(0) + 8, 252, 440)}{o(P(0) + 28)}{o(P(0) + 36)}
      {lbl(1, "2. אכילת קצוות — זנבות 3′")}
      {b(P(1), 40, 228)}{b(P(1), 290, 440)}{b(P(1) + 8, 40, 190)}{b(P(1) + 8, 252, 440)}{o(P(1) + 28)}{o(P(1) + 36)}
      <La x={236} y={P(1) - 2} size={10} color={BLUE}>3′</La><La x={246} y={P(1) + 20} size={10} color={BLUE}>3′</La>
      {lbl(2, "3. פלישת גדיל ולולאת D")}
      <path d={`M40 ${P(2)} L180 ${P(2)} Q200 ${P(2)} 206 ${P(2) + 32} L246 ${P(2) + 32}`} fill="none" stroke={BLUE} strokeWidth={3} />
      <Arrow x1={246} y1={P(2) + 32} x2={286} y2={P(2) + 32} color={GREEN} width={3} />
      {b(P(2) + 8, 40, 190)}{b(P(2), 330, 440)}{b(P(2) + 8, 292, 440)}
      <path d={`M40 ${P(2) + 24} L190 ${P(2) + 24} Q240 ${P(2) + 2} 300 ${P(2) + 24} L440 ${P(2) + 24}`} fill="none" stroke={ORANGE} strokeWidth={3} />
      {o(P(2) + 40)}
      {lbl(3, "4. לכידת הקצה השני וסינתזה")}
      <path d={`M40 ${P(3)} L180 ${P(3)} Q200 ${P(3)} 206 ${P(3) + 32} L300 ${P(3) + 32}`} fill="none" stroke={BLUE} strokeWidth={3} />
      {b(P(3) + 8, 40, 190)}{b(P(3), 330, 440)}
      <path d={`M440 ${P(3) + 8} L320 ${P(3) + 8} Q300 ${P(3) + 8} 296 ${P(3) + 20} L262 ${P(3) + 20}`} fill="none" stroke={BLUE} strokeWidth={3} />
      <Arrow x1={262} y1={P(3) + 20} x2={214} y2={P(3) + 20} color={GREEN} width={3} />
      <path d={`M40 ${P(3) + 24} L190 ${P(3) + 24} Q240 ${P(3) + 6} 300 ${P(3) + 24} L440 ${P(3) + 24}`} fill="none" stroke={ORANGE} strokeWidth={3} />
      {o(P(3) + 40)}
      {lbl(4, "5. צומת הולידיי כפולה")}
      {b(P(4), 40, 440)}{b(P(4) + 8, 40, 190)}{b(P(4) + 8, 310, 440)}
      {o(P(4) + 36)}{o(P(4) + 28, 40, 190)}{o(P(4) + 28, 310, 440)}
      <path d={`M190 ${P(4) + 8} L210 ${P(4) + 28} L290 ${P(4) + 28} L310 ${P(4) + 8}`} fill="none" stroke={BLUE} strokeWidth={3} />
      <path d={`M190 ${P(4) + 28} L210 ${P(4) + 8} L290 ${P(4) + 8} L310 ${P(4) + 28}`} fill="none" stroke={ORANGE} strokeWidth={3} />
      {lbl(5, "6. התרה")}
      {b(P(5), 40, 210)}{b(P(5) + 8, 40, 100)}<Line x1={100} y1={P(5) + 8} x2={150} y2={P(5) + 8} c={ORANGE} />{b(P(5) + 8, 150, 210)}
      {o(P(5) + 28, 40, 210)}{o(P(5) + 36, 40, 100)}<Line x1={100} y1={P(5) + 36} x2={150} y2={P(5) + 36} c={BLUE} />{o(P(5) + 36, 150, 210)}
      <He x={125} y={P(5) + 58} size={11} color={MUTED}>בלי שחלוף</He>
      {b(P(5), 270, 350)}{o(P(5), 350, 440)}{b(P(5) + 8, 270, 350)}{o(P(5) + 8, 350, 440)}
      {o(P(5) + 28, 270, 350)}{b(P(5) + 28, 350, 440)}{o(P(5) + 36, 270, 350)}{b(P(5) + 36, 350, 440)}
      <He x={355} y={P(5) + 58} size={11} color={MUTED}>עם שחלוף</He>
    </Svg>
  );
}

function HollidayResolution() {
  return (
    <Svg h={300} label="התרה של צומת הולידיי: חיתוך של זוג גדילים אחד משאיר רק טלאי של הטרודופלקס בלי שחלוף; חיתוך של הזוג השני יוצר שחלוף של האזורים שמשני הצדדים">
      <Line x1={110} y1={46} x2={370} y2={46} />
      <path d="M110 62 L226 62 L254 96 L370 96" fill="none" stroke={BLUE} strokeWidth={3} />
      <path d="M110 96 L226 96 L254 62 L370 62" fill="none" stroke={ORANGE} strokeWidth={3} />
      <Line x1={110} y1={112} x2={370} y2={112} c={ORANGE} />
      <He x={240} y={28} size={12.5} bold>צומת הולידיי</He>
      <He x={240} y={140} size={11} color={MUTED}>הרזולבאז חותך זוג אחד מתוך שני זוגות הגדילים</He>
      <Arrow x1={190} y1={152} x2={130} y2={180} color={INK} />
      <Arrow x1={290} y1={152} x2={350} y2={180} color={INK} />
      {/* patch */}
      <Line x1={30} y1={200} x2={210} y2={200} />
      <Line x1={30} y1={212} x2={110} y2={212} /><Line x1={110} y1={212} x2={150} y2={212} c={ORANGE} /><Line x1={150} y1={212} x2={210} y2={212} />
      <Line x1={30} y1={236} x2={110} y2={236} c={ORANGE} /><Line x1={110} y1={236} x2={150} y2={236} c={BLUE} /><Line x1={150} y1={236} x2={210} y2={236} c={ORANGE} />
      <Line x1={30} y1={248} x2={210} y2={248} c={ORANGE} />
      <He x={120} y={278} size={12} bold>בלי שחלוף</He>
      <He x={120} y={294} size={10.5} color={MUTED}>רק טלאי של הטרודופלקס</He>
      {/* splice */}
      <Line x1={270} y1={200} x2={360} y2={200} /><Line x1={360} y1={200} x2={450} y2={200} c={ORANGE} />
      <Line x1={270} y1={212} x2={340} y2={212} /><Line x1={340} y1={212} x2={450} y2={212} c={ORANGE} />
      <Line x1={270} y1={236} x2={340} y2={236} c={ORANGE} /><Line x1={340} y1={236} x2={450} y2={236} c={BLUE} />
      <Line x1={270} y1={248} x2={360} y2={248} c={ORANGE} /><Line x1={360} y1={248} x2={450} y2={248} c={BLUE} />
      <He x={360} y={278} size={12} bold>שחלוף</He>
      <He x={360} y={294} size={10.5} color={MUTED}>הצדדים מתחלפים</He>
    </Svg>
  );
}

// ── mol-transcription-prok ───────────────────────────────────────────────────


function SigmaCycle() {
  const nodes = ["ליבה + σ", "הולואנזים", "קומפלקס סגור", "קומפלקס פתוח", "התחלות כושלות", "התארכות", "סיום"];
  const edges: Edge[] = [
    { inner: "קישור" }, { inner: "פרומוטור" }, { inner: "פתיחת הסליל" }, { inner: "RNA קצרים" },
    { inner: "σ משתחרר", key: true }, { inner: "טרמינטור" }, { inner: "הליבה חופשית" },
  ];
  return (
    <Svg h={440} label="מחזור השעתוק בחיידקים: הליבה ופקטור סיגמא יוצרים הולואנזים, שנקשר לפרומוטור (קומפלקס סגור), פותח את הסליל (קומפלקס פתוח), עובר התחלות כושלות, משחרר את סיגמא ונכנס להתארכות, ובסיום הליבה משתחררת">
      <Cycle cx={240} cy={220} r={165} nodes={nodes} edges={edges} w={110} size={12} innerR={0.52} outerR={1.2} />
    </Svg>
  );
}



// ── mol-transcription-euk ────────────────────────────────────────────────────
// PicAssembly: redrawn at textbook level (2026-11-02) — see ./redraws/PicAssembly.tsx; old code in archive/figures/2026-11-02/.



// ── mol-rna-processing ───────────────────────────────────────────────────────
function SplicingMechanism() {
  const ex = (x: number, w: number, y: number, t: string, fill: string, c: string) => (
    <g key={t + x + y}><rect x={x} y={y - 14} width={w} height={28} rx={5} fill={fill} stroke={c} strokeWidth={1.6} /><He x={x + w / 2} y={y + 5} size={12} bold>{t}</He></g>
  );
  return (
    <Svg h={340} label="שחבור בשתי טרנס-אסטריפיקציות: ה-2′-OH של A בנקודת ההסתעפות תוקף את אתר 5′ ונוצר לריאט; אחר כך ה-3′-OH של האקסון הראשון תוקף את אתר 3′, האקסונים מתחברים והאינטרון משתחרר כלריאט">
      <He x={470} y={18} size={11.5} bold anchor="end">תגובה 1</He>
      {ex(20, 100, 60, "אקסון 1", FILL.blue, BLUE)}
      <Line x1={120} y1={60} x2={350} y2={60} c={PURPLE} w={2.5} />
      {ex(350, 100, 60, "אקסון 2", FILL.green, GREEN)}
      <La x={134} y={84} size={11} bold color={PURPLE}>GU</La>
      <La x={286} y={84} size={12} bold color={ORANGE}>A</La>
      <La x={316} y={84} size={10} color={PURPLE}>(Py)n</La>
      <La x={340} y={84} size={11} bold color={PURPLE}>AG</La>
      <path d="M286 50 Q210 4 130 46" fill="none" stroke={ORANGE} strokeWidth={2} markerEnd="url(#bfArrow)" />
      <La x={210} y={22} size={11} color={ORANGE}>2′-OH</La>

      <He x={470} y={122} size={11.5} bold anchor="end">תגובה 2</He>
      {ex(20, 100, 182, "אקסון 1", FILL.blue, BLUE)}
      <La x={130} y={186} size={10.5} color={BLUE} anchor="start">3′-OH</La>
      <circle cx={250} cy={182} r={34} fill="none" stroke={PURPLE} strokeWidth={2.5} />
      <Line x1={284} y1={182} x2={350} y2={182} c={PURPLE} w={2.5} />
      <La x={300} y={210} size={12} bold color={ORANGE}>A</La>
      {ex(350, 100, 182, "אקסון 2", FILL.green, GREEN)}
      <path d="M150 166 Q250 116 346 166" fill="none" stroke={BLUE} strokeWidth={2} markerEnd="url(#bfArrow)" />
      <He x={250} y={234} size={10.5} color={MUTED}>לריאט — G מחובר ל-A בקשר 2′–5′</He>

      <He x={470} y={256} size={11.5} bold anchor="end">התוצר</He>
      {ex(20, 100, 290, "אקסון 1", FILL.blue, BLUE)}
      {ex(120, 100, 290, "אקסון 2", FILL.green, GREEN)}
      <circle cx={340} cy={290} r={28} fill="none" stroke={PURPLE} strokeWidth={2.5} />
      <Line x1={368} y1={290} x2={400} y2={290} c={PURPLE} w={2.5} />
      <He x={120} y={326} size={11}>mRNA: אקסונים מחוברים</He>
      <He x={350} y={334} size={11} color={MUTED}>הלריאט מפורק</He>
    </Svg>
  );
}

function AlternativeSplicing() {
  const E = [[40, FILL.blue, BLUE], [150, FILL.green, GREEN], [260, FILL.orange, ORANGE], [370, FILL.purple, PURPLE]] as const;
  const box = (x: number, y: number, i: number) => <g key={`${x}${y}`}><rect x={x} y={y - 12} width={60} height={24} rx={4} fill={E[i][1]} stroke={E[i][2]} strokeWidth={1.5} /><La x={x + 30} y={y + 5} size={13} bold>{i + 1}</La></g>;
  return (
    <Svg h={230} label="שחבור חלופי: מאותו RNA ראשוני עם ארבעה אקסונים נוצר mRNA עם כל האקסונים, או mRNA שבו אקסון 3 מדולג">
      <He x={240} y={18} size={12} bold>RNA ראשוני</He>
      <Line x1={40} y1={70} x2={430} y2={70} c={MUTED} w={2} />
      {E.map(([x], i) => box(x, 70, i))}
      <path d="M210 82 Q235 104 260 82 M320 82 Q345 104 370 82" fill="none" stroke={BLUE} strokeWidth={1.5} {...dash} />
      <path d="M210 58 Q290 18 370 58" fill="none" stroke={ORANGE} strokeWidth={1.8} {...dash} />
      <He x={290} y={30} size={10.5} color={ORANGE}>דילוג</He>
      {[0, 1, 2, 3].map((i) => box(60 + i * 60, 140, i))}
      <He x={410} y={145} size={11.5}>כל האקסונים</He>
      {[0, 1, 3].map((i, k) => box(60 + k * 60, 200, i))}
      <He x={360} y={205} size={11.5} color={ORANGE}>דילוג על אקסון 3</He>
    </Svg>
  );
}

// ── mol-genetic-code ─────────────────────────────────────────────────────────
// TrnaStructure: redrawn at textbook level (2026-11-02) — see ./redraws/TrnaStructure.tsx; old code in archive/figures/2026-11-02/.



// ── ribosome helpers ─────────────────────────────────────────────────────────

// ── mol-ribosome-initiation ──────────────────────────────────────────────────
// RibosomeSites: recomposed at textbook level, one picture on desktop (2026-11-07) — see ./redraws/RibosomeSites.tsx; old code in archive/figures/2026-11-07/.



// ── mol-translation-elongation ───────────────────────────────────────────────
// ElongationCycle: recomposed at textbook level, one picture on desktop (2026-11-07) — see ./redraws/ElongationCycle.tsx; old code in archive/figures/2026-11-07/.



function MeselsonStahlCentrifuge() {
  return <AnatomyEmbed src="/figures/anatomy/meselson-stahl-centrifuge.html" title="ניסוי מזלסון-סטאל — אולטרה-צנטריפוגה, אינטראקטיבי" />;
}

function PcrCycler() {
  return <AnatomyEmbed src="/figures/anatomy/pcr-thermocycler.html" title="מכשיר PCR — אינטראקטיבי" />;
}

export const MOLECULAR_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "meselson-stahl-centrifuge": { el: MeselsonStahlCentrifuge, captionHe: "איור אינטראקטיבי: הזזת העכבר (או החצים) קובעת כמה דורות גדלו החיידקים בחנקן קל, והפסים במבחנה משתנים בהתאם." },
  "pcr-cycler": { el: PcrCycler, captionHe: "איור אינטראקטיבי: הזזת העכבר (או החצים) קובעת את מספר המחזור." },
  "pcr-primer-design": { el: PcrPrimerDesign, captionHe: "תכנון זוג פריימרים: הקדמי זהה לקצה 5′ של הגדיל העליון ונקשר לתחתון; האחורי הוא המשלים ההפוך של הקצה השני ונקשר לעליון. שני קצות 3′ מוארכים פנימה, והתוצר המוגדר כולל את שני הפריימרים. הפריימר האחורי מוצג גם \u20665′→3′\u2069 כרצף להזמנה, וגם בכיוון הקישור בפועל. דוגמה לימודית מקוצרת של 18 זוגות בסיסים ופריימרים בני 6 בסיסים, לא אורכי עבודה מומלצים; סכמטי." },
  "sanger-read": { el: SangerRead, captionHe: "סנגר בדוגמה בת שבע עמדות אחרי הפריימר: התבנית היא \u20663′–CCTTGCATGC–5′\u2069 והפריימר \u20665′–GGA–3′\u2069; הקריאה היא \u20665′–ACGTACG–3′\u2069, משלימת מקטע התבנית שאחרי הפריימר. מוצג כל אורך אפשרי בחלון זה, כולל ddNTP מסיים בצבע הבסיס. סדר הגילוי בנימית, קצר לפני ארוך, נותן את הכרומטוגרמה. פיק כפול מצביע על שתי אוכלוסיות תבנית. הצבעים נבחרו להמחשה ואינם תקן צבע מחייב; סכמטי." },
  "primer-extension-gel": { el: PrimerExtensionGel, captionHe: "הארכת פריימר מסומן על תבנית ssDNA מעגלית: במסלול 1 נשאר הפריימר; ב־2 יש עצירה באזור הדו־גדילי; ב־3 הליקאז מאפשר תוצר ארוך מאוד; ב־4 וב־5 מתקבלות מריחות קצרות בגלל רציפות נמוכה; ב־6 Tus חוסם ב־Ter מהצד הלא מתיר. לצורך הסכמה Ter נמצא אחרי האזור הדו־גדילי. Pol III הוא הולואנזים עם β ומעמיס הטבעת, למעט מסלול 5; תגובה קצרה המודדת בעיקר אירוע קישור אחד. הג׳ל דנטורטיבי ומראה רק את הגדיל המסומן. מיקומים יחסיים, ללא סולם כמותי; סכמטי." },
  "emsa-gel": { el: EmsaGel, captionHe: "EMSA בג׳ל טבעי. מסלולים 1–5: 0, 1, 5, 10 ו־50 nM חלבון. הפס המוסט (סגול) גדל והחופשי (כחול) נחלש. במסלולים 6–7 יש אותו חלבון כמו ב־5: עודף מתחרה ספציפי לא מסומן מחליש את ההסטה, ומתחרה לא ספציפי משאיר אותה. העקומה חושבה לפי \u2066f = [P]/([P]+10)\u2069: החלקים הקשורים הם 0.09, 0.33, 0.50, 0.83, ולכן \u2066Kd = 10 nM\u2069. ההנחה: DNA מסומן זניח וקישור 1:1. עוצמות הג׳ל והתחרות סכמטיות; העקומה כמותית." },
  "footprint-ladder": { el: FootprintLadder, captionHe: "הגרסה הקלאסית של DNase I footprinting. רק קצה אחד של גדיל אחד מסומן (אדום). אחרי חיתוך חלקי, הסרת החלבון והרצה דנטורטיבית, מזהים רק את הקטעים הנושאים את הסימון. בלי חלבון יש סולם חיתוכים; עם חלבון חסרים פסים באזור המוגן, המסומן בסוגר. קטעים קצרים נעים רחוק יותר, כלפי מטה. האזור המוגן אינו בהכרח זהה לרצף ההכרה; סכמטי, ללא קנה מידה נוקלאוטידי." },
  "chip-steps": { el: ChipSteps, captionHe: "ChIP עם PCR של הפרומוטור: קיבוע, חיתוך הכרומטין, שיקוע חלבון המטרה עם נוגדן על חרוז, ביטול הקיבוע וטיהור ה־DNA, ואז הגברה באמצעות פריימרים שתוחמים את אזור הבקרה. Input נשמר מהכרומטין החתוך לפני השיקוע ובודק את כמות האזור ההתחלתית; IgG בודק משיכה לא ספציפית. מסיקים העשרה לאחר נרמול ובדיקת רקע, ולא מעוצמת פס לבדה. השיטה מראה קרבה בתא, ולא מוכיחה קישור ישיר; סכמטי, לא בקנה מידה." },
  "tweezers-trace": { el: TweezersTrace, captionHe: "סכמת פינצטה אופטית ועקבות אידאליים מנתוני התרגיל. כחול: פולימראז חיידקי על DNA חשוף, 600 זוגות בסיסים ב־12 שניות — \u206650 bp/s\u2069. סגול: Pol II על כרומטין, 600 ב־40 שניות — ממוצע \u206615 bp/s\u2069; תנועה ב־\u206624 bp/s\u2069 עד שנייה 12.5, עצירה בעמדה 300 עד שנייה 27.5, ואז המשך באותו קצב עד 40. העצירה נמשכת 15 שניות; נוקלאוזום הוא הסבר סביר בהתאם לתבנית הנתונה, לא מסקנה בלעדית מצורת הגרף. עקבות מחושבים, לא מדידות ניסוי; מערך המדידה סכמטי." },
  "nucleotide-structure": { el: NucleotideStructure, captionHe: "מבנה של נוקלאוטיד. הבסיס מחובר לפחמן 1′ של הסוכר בקשר N-גליקוזידי; הפוספט — לפחמן 5′; ב-OH של פחמן 3′ יתחבר הנוקלאוטיד הבא. ההבדל בין DNA ל-RNA: בפחמן 2′ יש H (דאוקסיריבוז) או OH (ריבוז). סכמטי." },
  "double-helix": { el: DoubleHelix, captionHe: "הסליל הכפול. משמאל — \"פרוש\": שני גדילים אנטי-מקבילים, A מול T בשני קשרי מימן ו-G מול C בשלושה, תמיד פורין מול פירימידין. מימין — הסליל הימני, שבו המרחקים הלא שווים בין שני השלדים יוצרים חריץ גדול וחריץ קטן. סכמטי." },
  "dna-melting": { el: DnaMelting, captionHe: "עקומות התכה מחושבות (מודל של מעבר חד). הבליעה ב-260 ננומטר עולה כשהגדילים נפרדים — האפקט ההיפרכרומי. Tm חושב לפי הקשר האמפירי של מרמור ודוטי, Tm ≈ 69.3 + 0.41 × (%G+C), שנמדד בתמיסת מלח מסוימת (SSC); בתנאים אחרים הערכים משתנים, אבל הכיוון נשמר: יותר G+C — Tm גבוה יותר." },
  nucleosome: { el: MolecularNucleosome, captionHe: "נוקלאוזום. כ-147 זוגות בסיסים של DNA מלופפים כ-1.65 סיבובים סביב אוקטמר של היסטונים — שניים מכל אחד מ-H2A, H2B, H3 ו-H4. DNA מקשר מחבר לנוקלאוזום הבא, והיסטון H1 נקשר במקום הכניסה והיציאה. זנבות ההיסטונים בולטים החוצה. סכמטי." },
  "chromatin-levels": { el: ChromatinLevels, captionHe: "רמות האריזה של ה-DNA, מהסליל הכפול ועד הכרומוזום המיטוטי. סיב 30 ננומטר נראה בבירור במבחנה; האם הוא נפוץ בגרעין החי שנוי במחלוקת. סכמטי, לא בקנה מידה." },
  "replication-fork": { el: ReplicationFork, captionHe: "מזלג השכפול ב-E. coli. ההליקאז פותח את הגדילים והגיראז משחרר את פיתול-העל החיובי לפניו. הגדיל המוביל נבנה ברצף לכיוון המזלג; הגדיל המפגר נבנה בקטעי אוקזאקי, כל אחד מתחיל בפריימר RNA (כתום) שמייצר הפרימאז. Pol I מחליף את הפריימר ב-DNA, וליגאז סוגר את החריץ. סכמטי — בתא שני הפולימראזים מחוברים ברפליזום אחד." },
  "oric-initiation": { el: OricInitiation, captionHe: "התחלת השכפול ב-oriC של E. coli. (1) המקור המינימלי: שלושה רצפים של 13 זוגות בסיסים עשירים ב-A-T, וארבעה רצפים של 9 שאליהם נקשר DnaA. (2) DnaA-ATP נקשר במולקולות רבות ופותח את אזור ה-13. (3) DnaC טוען שני הליקאזים DnaB, אחד לכל מזלג. סכמטי." },
  "origin-licensing": { el: OriginLicensing, captionHe: "רישוי וירי באאוקריוטים. ב-G1 (CDK נמוך) נטענות שתי טבעות MCM לא פעילות; בשלב S (CDK ו-DDK גבוהים) הן הופכות להליקאז הפעיל CMG ושני מזלגות יוצאים. עד שה-CDK יורד בסוף המיטוזה אי אפשר לטעון MCM חדש — ולכן כל מקור יורה לכל היותר פעם אחת במחזור. סכמטי." },
  telomerase: { el: Telomerase, captionHe: "טלומראז אנושי מאריך טלומר. קטע התבנית ב-RNA של האנזים (3′-CAAUCCCAAUC-5′) מזדווג לקצה ה-3′ הבולט של הגדיל העשיר ב-G, וה-TERT מוסיף לפיו חזרה חדשה של GGTTAG (כתום). אחר כך האנזים זז קדימה וחוזר על המחזור." },
  "excision-repair": { el: ExcisionRepair, captionHe: "שלוש מערכות התיקון בחיתוך. לכולן אותו עיקרון: מסירים קטע מהגדיל הפגוע (מקווקו) ובונים אותו מחדש לפי הגדיל השני. ההבדל הוא במה שהן מזהות ובאורך הקטע: נוקלאוטיד אחד ב-BER, כ-12–13 נוקלאוטידים בחיידקים (כ-25–30 באדם) ב-NER, ועד כאלף ב-MMR — מאתר ה-GATC שלפיו מזוהה הגדיל החדש. סכמטי." },
  "dsb-repair-model": { el: DsbRepairModel, captionHe: "מודל תיקון השבר הדו-גדילי (שוסטק ועמיתיו, 1983). כחול — המולקולה שנשברה, כתום — ההומולוג, ירוק — DNA חדש שנבנה לפי ההומולוג. ההתרה בסוף יכולה לתת תוצר בלי שחלוף (רק טלאים של הטרודופלקס) או עם שחלוף. סכמטי." },
  "holliday-resolution": { el: HollidayResolution, captionHe: "התרה של צומת הולידיי. הרזולבאז חותך שני גדילים. חיתוך של זוג אחד מחזיר את המולקולות לרצף ההורי משני צידי האזור, ונשאר רק טלאי של הטרודופלקס; חיתוך של הזוג השני מחליף את הצדדים — שחלוף. סכמטי." },
  "bacterial-promoter": { el: BacterialPromoter, captionHe: "פרומוטור של σ⁷⁰ ב-E. coli. הרצפים המודגשים הם רצפי הקונצנזוס; פרומוטורים טבעיים כמעט אף פעם לא זהים להם. פקטור סיגמא מזהה את שני האזורים, והמרווח האופטימלי ביניהם הוא 17 זוגות בסיסים. אלמנט UP קיים רק בחלק מהפרומוטורים." },
  "sigma-cycle": { el: SigmaCycle, captionHe: "מחזור השעתוק בחיידקים. סיגמא נדרש לזיהוי הפרומוטור ולפתיחה, ובדרך כלל משתחרר כשהאנזים יוצא מהפרומוטור (חץ כתום); ההתארכות נעשית בידי הליבה. בסוף, הליבה החופשית יכולה להתחבר שוב לסיגמא." },
  terminators: { el: Terminators, captionHe: "שתי דרכים לסיום השעתוק בחיידקים. למעלה — סיום עצמי: סיכת ראש עשירה ב-G-C ומיד אחריה רצף של U; ההכלאה החלשה rU:dA לא מחזיקה, וה-RNA משתחרר. למטה — Rho נקשר לאתר rut ב-RNA, נע 5′→3′ בעזרת ATP ומפריד את ה-RNA מהפולימראז המושהה. סכמטי." },
  "pic-assembly": { el: PicAssembly, captionHe: "קומפלקס הטרום-התחלה של RNA פולימראז II, עם סדר ההרכבה הקלאסי שנמדד במבחנה. TBP, בתוך TFIID, נקשר לחריץ הקטן ומכופף את ה-DNA; TFIIB ממקם את הפולימראז; TFIIH פותח את הגדילים ומזרחן את Ser5 ב-CTD, וכך הפולימראז יוצא מהפרומוטור. סכמטי." },
  "enhancer-loop": { el: EnhancerLoop, captionHe: "מגביר משפיע על פרומוטור רחוק בעזרת לולאה ב-DNA. המפעיל שנקשר למגביר מגייס את מכונת השעתוק דרך המדיאטור (וגם דרך שינויי כרומטין). המגביר פועל בלי תלות בכיוון ובמיקום. סכמטי." },
  "splicing-mechanism": { el: SplicingMechanism, captionHe: "הכימיה של השחבור. בתגובה הראשונה ה-2′-OH של ה-A בנקודת ההסתעפות תוקף את אתר 5′; האקסון הראשון משתחרר, והאינטרון יוצר לריאט. בתגובה השנייה ה-3′-OH של האקסון הראשון תוקף את אתר 3′; האקסונים מתחברים, והלריאט משתחרר. (Py)n — הרצף הפולי-פירימידיני." },
  "alternative-splicing": { el: AlternativeSplicing, captionHe: "שחבור חלופי — דילוג על אקסון. אותו RNA ראשוני יכול לתת mRNA עם כל האקסונים (קווים כחולים) או mRNA בלי אקסון 3 (קו כתום), ולכן שני חלבונים שונים. יש גם אקסונים שמוציאים זה את זה, אתרי שחבור חלופיים והשארת אינטרון." },
  "trna-structure": { el: TrnaStructure, captionHe: "מבנה התלתן של tRNA (כאן tRNA של פנילאלנין, אנטיקודון GAA). חומצת האמינו מתחברת ל-A של רצף ה-CCA בקצה ה-3′. במבנה התלת-ממדי הזרועות מתקפלות לצורת L: האנטיקודון בקצה אחד וחומצת האמינו בקצה השני, במרחק של כ-7 ננומטר. סכמטי." },
  aminoacylation: { el: Aminoacylation, captionHe: "התגובה של אמינואציל-tRNA סינתטאז, באתר פעיל אחד. בשלב 1 חומצת האמינו משופעלת כאמינואציל-AMP; בשלב 2 היא עוברת לקצה ה-3′ של ה-tRNA. סינתטאזות רבות מפרקות באתר עריכה נפרד חומצת אמינו שגויה — לפני ההעברה או אחריה." },
  "ribosome-sites": { el: RibosomeSites, captionHe: "הריבוזום במהלך ההארכה. ה-tRNA עם השרשרת באתר P, אמינואציל-tRNA חדש באתר A, ו-tRNA ריק באתר E לפני יציאתו. מרכז הפענוח (זיווג קודון–אנטיקודון) נמצא בתת-היחידה הקטנה; מרכז הפפטידיל טרנספראז — בתת-היחידה הגדולה. סכמטי." },
  "initiation-compare": { el: InitiationCompare, captionHe: "השוואת ההתחלה. בחיידקים — רצף שיין-דלגרנו מזדווג עם קצה ה-16S rRNA, ו-IF2 מביא את fMet-tRNA לאתר P מול AUG (IF1 ו-IF3 לא מצוירים). באאוקריוטים — eIF4F נקשר לכובע, PABP על הזנב יוצר עם eIF4G מעגל, וקומפלקס 43S (עם Met-tRNAi) סורק עד ה-AUG הראשון בהקשר טוב. סכמטי." },
  "elongation-cycle": { el: ElongationCycle, captionHe: "מחזור ההארכה, שחוזר לכל חומצת אמינו. (1) EF-Tu–GTP מביא אמינואציל-tRNA לאתר A, ומשתחרר אחרי פירוק GTP אם הזיווג נכון. (2) הקבוצה האמינית בחומצת האמינו שבאתר A תוקפת, והשרשרת עוברת אליה. (3) EF-G–GTP מזיז את הריבוזום בקודון אחד: השרשרת חוזרת ל-P והאתר A מתפנה." },
  termination: { el: Termination, captionHe: "סיום התרגום. גורם שחרור (RF1 או RF2 בחיידקים, eRF1 באאוקריוטים) נכנס לאתר A מול קודון העצירה; המוטיב GGQ שלו מאפשר למים לנתק את השרשרת מה-tRNA. RF3 מסלק את גורם השחרור, ו-RRF ו-EF-G מפרקים את הריבוזום. סכמטי." },
};
