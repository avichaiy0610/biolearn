/* Figures for the molecular-biology units (Technion 134082). Schematic, not to scale unless the caption
   says so. Colors: parental/template DNA blue, new DNA green, RNA purple, highlights orange.
   Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, Axes, BLUE, GREEN, INK, LINE, MUTED, ORANGE, He, La, curve, dash, scale } from "./biochemFigures";
import { Arrow, Cycle, type Edge } from "./metabolicFigures";

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
const LBox = ({ x, y, w, h = 30, label, c = BLUE, fill = FILL.blue, size = 13, bold = false }: { x: number; y: number; w: number; h?: number; label: React.ReactNode; c?: string; fill?: string; size?: number; bold?: boolean }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={8} fill={fill} stroke={c} strokeWidth={1.6} />
    <La x={x} y={y + h / 2 + size * 0.36} size={size} bold={bold}>{label}</La>
  </g>
);
const HBox = ({ x, y, w, h = 30, label, c = BLUE, fill = FILL.blue, size = 12.5, bold = false }: { x: number; y: number; w: number; h?: number; label: React.ReactNode; c?: string; fill?: string; size?: number; bold?: boolean }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={8} fill={fill} stroke={c} strokeWidth={1.6} />
    <He x={x} y={y + h / 2 + size * 0.36} size={size} bold={bold}>{label}</He>
  </g>
);
const Num = ({ x, y, n }: { x: number; y: number; n: number }) => (
  <g><circle cx={x} cy={y} r={9} fill={INK} /><La x={x} y={y + 4} size={11} bold color="#ffffff">{n}</La></g>
);

// ── mol-nucleic-acids ────────────────────────────────────────────────────────
function NucleotideStructure() {
  const O = [240, 96], C1 = [300, 132], C2 = [278, 198], C3 = [202, 198], C4 = [180, 132];
  const pts = [O, C1, C2, C3, C4].map((p) => p.join(",")).join(" ");
  return (
    <Svg h={330} label="מבנה של נוקלאוטיד: פוספט על פחמן 5 של הסוכר, בסיס על פחמן 1, OH על פחמן 3; בפחמן 2 יש H ב-DNA ו-OH ב-RNA">
      <He x={385} y={26} size={12} bold>פורינים — שתי טבעות</He>
      <La x={385} y={44} size={13} color={BLUE} bold>A · G</La>
      <He x={385} y={68} size={12} bold>פירימידינים — טבעת אחת</He>
      <La x={385} y={86} size={13} color={BLUE} bold>C · T · U</La>
      <polygon points={pts} fill={FILL.gray} stroke={INK} strokeWidth={2} />
      <circle cx={O[0]} cy={O[1]} r={10} fill="#ffffff" stroke={INK} strokeWidth={1.5} /><La x={O[0]} y={O[1] + 5} size={13} bold>O</La>
      <La x={C1[0] + 16} y={C1[1] + 18} size={12} color={MUTED}>1′</La>
      <La x={C2[0] + 16} y={C2[1] + 4} size={12} color={MUTED}>2′</La>
      <La x={C3[0] - 16} y={C3[1] + 4} size={12} color={MUTED}>3′</La>
      <La x={C4[0] - 14} y={C4[1] + 18} size={12} color={MUTED}>4′</La>
      {/* 5' carbon and phosphate */}
      <Line x1={C4[0]} y1={C4[1]} x2={150} y2={86} c={INK} w={2} />
      <La x={150} y={108} size={12} color={MUTED}>5′</La>
      <Line x1={150} y1={86} x2={104} y2={62} c={INK} w={2} />
      <circle cx={86} cy={54} r={22} fill={FILL.yellow} stroke={ORANGE} strokeWidth={2} />
      <La x={86} y={60} size={16} bold color={ORANGE}>P</La>
      <He x={86} y={96} size={11.5} color={ORANGE}>פוספט</He>
      {/* base */}
      <Line x1={C1[0]} y1={C1[1]} x2={350} y2={132} c={INK} w={2} />
      <rect x={350} y={110} width={92} height={44} rx={10} fill={FILL.blue} stroke={BLUE} strokeWidth={2} />
      <He x={396} y={137} size={14} bold color={BLUE}>בסיס</He>
      <He x={326} y={176} size={10.5} color={MUTED}>קשר N-גליקוזידי</He>
      {/* 3' and 2' */}
      <Line x1={C3[0]} y1={C3[1]} x2={192} y2={232} c={INK} w={2} />
      <La x={186} y={250} size={13} bold>3′-OH</La>
      <Line x1={C2[0]} y1={C2[1]} x2={290} y2={232} c={INK} w={2} />
      <La x={300} y={250} size={12.5}>DNA: H</La>
      <La x={300} y={268} size={12.5} color={PURPLE}>RNA: OH</La>
      <He x={240} y={300} size={12.5}>נוקלאוזיד = בסיס + סוכר</He>
      <He x={240} y={322} size={12.5} bold>נוקלאוטיד = בסיס + סוכר + פוספט</He>
    </Svg>
  );
}

function DoubleHelix() {
  const pairs: [string, string][] = [["A", "T"], ["G", "C"], ["C", "G"], ["T", "A"], ["G", "C"], ["A", "T"]];
  const col: Record<string, string> = { A: FILL.orange, T: FILL.blue, G: FILL.green, C: FILL.purple };
  const helix = (ph: number) => { let d = ""; for (let y = 40; y <= 280; y += 4) { const x = 360 + 50 * Math.sin((2 * Math.PI * (y - 40)) / 160 + ph); d += `${y === 40 ? "M" : "L"}${x.toFixed(1)} ${y}`; } return d; };
  const rungs = [];
  for (let y = 44; y <= 276; y += 9) {
    const a = (2 * Math.PI * (y - 40)) / 160;
    rungs.push(<line key={y} x1={360 + 50 * Math.sin(a)} x2={360 + 50 * Math.sin(a + 2.2)} y1={y} y2={y} stroke={LINE} strokeWidth={2} />);
  }
  return (
    <Svg h={330} label="הסליל הכפול: משמאל — שני גדילים אנטי-מקבילים עם זוגות A-T (שני קשרי מימן) ו-G-C (שלושה); מימין — סליל ימני עם חריץ גדול וחריץ קטן">
      {/* ladder */}
      <Line x1={60} y1={40} x2={60} y2={280} c={BLUE} w={4} />
      <Line x1={200} y1={40} x2={200} y2={280} c={GREEN} w={4} />
      <La x={60} y={30} size={13} bold>5′</La><La x={60} y={300} size={13} bold>3′</La>
      <La x={200} y={30} size={13} bold>3′</La><La x={200} y={300} size={13} bold>5′</La>
      <Arrow x1={38} y1={120} x2={38} y2={200} color={BLUE} />
      <Arrow x1={222} y1={200} x2={222} y2={120} color={GREEN} />
      {pairs.map(([l, r], i) => {
        const y = 60 + i * 40;
        const hb = l === "A" || l === "T" ? [-5, 5] : [-8, 0, 8];
        return (
          <g key={i}>
            <rect x={62} y={y - 13} width={54} height={26} rx={4} fill={col[l]} stroke={INK} strokeWidth={1} />
            <rect x={144} y={y - 13} width={54} height={26} rx={4} fill={col[r]} stroke={INK} strokeWidth={1} />
            <La x={89} y={y + 5} size={14} bold>{l}</La>
            <La x={171} y={y + 5} size={14} bold>{r}</La>
            {hb.map((d) => <line key={d} x1={116} x2={144} y1={y + d} y2={y + d} stroke={INK} strokeWidth={1.4} {...dash} />)}
          </g>
        );
      })}
      <He x={130} y={322} size={11.5} color={MUTED}>מקווקו = קשר מימן</He>
      {/* helix */}
      {rungs}
      <path d={helix(0)} fill="none" stroke={BLUE} strokeWidth={4} />
      <path d={helix(2.2)} fill="none" stroke={GREEN} strokeWidth={4} />
      <line x1={420} x2={420} y1={80} y2={184} stroke={INK} strokeWidth={1.2} />
      <line x1={420} x2={420} y1={186} y2={240} stroke={ORANGE} strokeWidth={1.2} />
      <He x={448} y={136} size={11.5}>חריץ</He><He x={448} y={150} size={11.5}>גדול</He>
      <He x={448} y={210} size={11.5} color={ORANGE}>חריץ</He><He x={448} y={224} size={11.5} color={ORANGE}>קטן</He>
      <He x={360} y={304} size={11.5}>סליל ימני · כ-10.5 זוגות לסיבוב</He>
      <He x={360} y={322} size={11.5} color={MUTED}>קוטר כ-2 ננומטר</He>
    </Svg>
  );
}

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
function Nucleosome() {
  const cx = 240, cy = 140;
  const arc = (r: number, a0: number, a1: number) => {
    const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  const tail = (a: number) => {
    const r0 = 60, r1 = 98, rad = (a * Math.PI) / 180;
    const x0 = cx + r0 * Math.cos(rad), y0 = cy + r0 * Math.sin(rad), x1 = cx + r1 * Math.cos(rad), y1 = cy + r1 * Math.sin(rad);
    return <path key={a} d={`M${x0} ${y0} Q${(x0 + x1) / 2 + 8} ${(y0 + y1) / 2 - 8} ${x1} ${y1}`} fill="none" stroke="#b45309" strokeWidth={2} />;
  };
  return (
    <Svg h={300} label="נוקלאוזום: אוקטמר של היסטונים (שניים מכל אחד מ-H2A, H2B, H3, H4) ו-DNA מלופף סביבו כ-1.65 סיבובים; DNA מקשר מחבר לנוקלאוזום הבא, והיסטון H1 יושב במקום שבו ה-DNA נכנס ויוצא">
      {[-140, -100, -60, -20].map(tail)}
      <He x={240} y={26} size={11.5} color="#b45309">זנבות היסטונים</He>
      <circle cx={cx} cy={cy} r={60} fill={FILL.yellow} stroke="#b45309" strokeWidth={2} />
      <La x={218} y={126} size={13} bold>H3</La><La x={262} y={126} size={13} bold>H4</La>
      <La x={216} y={166} size={13} bold>H2A</La><La x={264} y={166} size={13} bold>H2B</La>
      <circle cx={cx} cy={cy} r={72} fill="none" stroke={BLUE} strokeWidth={7} />
      <path d={arc(82, 100, 330)} fill="none" stroke={BLUE} strokeWidth={7} strokeLinecap="round" />
      {/* linkers to neighbours */}
      <path d={`M226 214 L80 262`} stroke={BLUE} strokeWidth={6} strokeLinecap="round" />
      <path d={`M254 214 L400 262`} stroke={BLUE} strokeWidth={6} strokeLinecap="round" />
      <circle cx={56} cy={268} r={26} fill={FILL.yellow} stroke="#b45309" strokeWidth={1.5} />
      <circle cx={424} cy={268} r={26} fill={FILL.yellow} stroke="#b45309" strokeWidth={1.5} />
      <circle cx={240} cy={226} r={12} fill={FILL.orange} stroke={ORANGE} strokeWidth={2} />
      <La x={240} y={231} size={11} bold>H1</La>
      <He x={150} y={286} size={12} color={BLUE}>DNA מקשר</He>
      <He x={398} y={112} size={12} bold>DNA הליבה</He>
      <He x={398} y={130} size={12}>כ-147 זוגות בסיסים</He>
      <He x={398} y={148} size={12}>כ-1.65 סיבובים</He>
      <He x={82} y={112} size={12} bold>אוקטמר</He>
      <La x={82} y={130} size={11.5}>2×(H2A, H2B,</La>
      <La x={82} y={146} size={11.5}>H3, H4)</La>
    </Svg>
  );
}

function ChromatinLevels() {
  const rows = [42, 108, 178, 252, 330];
  const lbl = (i: number, t: string, s: string) => (
    <g key={t}><He x={468} y={rows[i] - 2} size={12.5} bold anchor="end">{t}</He><He x={468} y={rows[i] + 16} size={11} color={MUTED} anchor="end">{s}</He></g>
  );
  const sine = (y: number, ph: number) => { let d = ""; for (let x = 30; x <= 262; x += 3) d += `${x === 30 ? "M" : "L"}${x} ${(y + 8 * Math.sin(x / 9 + ph)).toFixed(1)}`; return d; };
  return (
    <Svg h={370} label="רמות האריזה של ה-DNA: סליל כפול, סיב 10 ננומטר של נוקלאוזומים, סיב 30 ננומטר, לולאות ותחומים, וכרומוזום מיטוטי עם שתי כרומטידות אחיות">
      <path d={sine(rows[0], 0)} fill="none" stroke={BLUE} strokeWidth={2.5} />
      <path d={sine(rows[0], Math.PI * 0.7)} fill="none" stroke={GREEN} strokeWidth={2.5} />
      {lbl(0, "סליל כפול", "קוטר 2 ננומטר")}
      <Line x1={30} y1={rows[1]} x2={262} y2={rows[1]} c={BLUE} w={2} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <circle key={i} cx={44 + i * 34} cy={rows[1]} r={11} fill={FILL.yellow} stroke="#b45309" strokeWidth={1.5} />)}
      {lbl(1, "סיב 10 ננומטר", "חרוזים על חוט — נוקלאוזומים")}
      <rect x={28} y={rows[2] - 26} width={238} height={52} rx={26} fill="none" stroke={MUTED} strokeWidth={1.2} {...dash} />
      {Array.from({ length: 11 }, (_, i) => <circle key={i} cx={46 + i * 20} cy={rows[2] + (i % 2 ? 9 : -9)} r={11} fill={FILL.yellow} stroke="#b45309" strokeWidth={1.5} />)}
      {lbl(2, "סיב 30 ננומטר", "במבחנה; בתא — במחלוקת")}
      <Line x1={30} y1={rows[3]} x2={262} y2={rows[3]} c={INK} w={2} />
      {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={52 + i * 46} cy={rows[3] + (i % 2 ? 18 : -18)} rx={16} ry={20} fill="none" stroke={BLUE} strokeWidth={2} />)}
      {lbl(3, "לולאות ותחומים", "מעוגנות בקוהזין ובקונדנסין")}
      <path d={`M40 ${rows[4] - 22} Q160 ${rows[4] - 30} 165 ${rows[4] - 6} Q170 ${rows[4] - 30} 262 ${rows[4] - 22} L262 ${rows[4] - 4} Q170 ${rows[4] + 2} 165 ${rows[4] - 2} Q160 ${rows[4] + 2} 40 ${rows[4] - 4} Z`} fill={FILL.blue} stroke={BLUE} strokeWidth={1.8} />
      <path d={`M40 ${rows[4] + 4} Q160 ${rows[4] + 2} 165 ${rows[4] + 2} Q170 ${rows[4] + 2} 262 ${rows[4] + 4} L262 ${rows[4] + 22} Q170 ${rows[4] + 30} 165 ${rows[4] + 6} Q160 ${rows[4] + 30} 40 ${rows[4] + 22} Z`} fill={FILL.green} stroke={GREEN} strokeWidth={1.8} />
      <circle cx={165} cy={rows[4]} r={5} fill={ORANGE} />
      {lbl(4, "כרומוזום מיטוטי", "2 כרומטידות; צנטרומר בכתום")}
      {[0, 1, 2, 3].map((i) => <Arrow key={i} x1={286} y1={rows[i] + 14} x2={286} y2={rows[i + 1] - 22} color={MUTED} />)}
    </Svg>
  );
}

// ── mol-replication-fork ─────────────────────────────────────────────────────
function ReplicationFork() {
  const prim = (x1: number, x2: number, y: number) => <Line x1={x1} y1={y} x2={x2} y2={y} c={ORANGE} w={6} />;
  return (
    <Svg w={520} h={300} label="מזלג השכפול: ההליקאז פותח את הגדילים, הגיראז משחרר את המתח לפניו, הגדיל המוביל נבנה ברצף לכיוון המזלג והגדיל המפגר נבנה בקטעי אוקזאקי, כל אחד מתחיל בפריימר RNA">
      {/* parental duplex + templates */}
      <Line x1={20} y1={140} x2={200} y2={140} c={BLUE} />
      <Line x1={20} y1={160} x2={200} y2={160} c={BLUE} />
      <path d="M200 140 L240 100 L505 100" fill="none" stroke={BLUE} strokeWidth={3} strokeLinejoin="round" />
      <path d="M200 160 L240 200 L505 200" fill="none" stroke={BLUE} strokeWidth={3} strokeLinejoin="round" />
      <La x={12} y={136} size={12} bold>5′</La><La x={12} y={176} size={12} bold>3′</La>
      <La x={513} y={96} size={12} bold>3′</La><La x={513} y={216} size={12} bold>5′</La>
      {/* gyrase */}
      <rect x={74} y={128} width={42} height={44} rx={10} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.8} />
      <He x={95} y={118} size={11.5} color={PURPLE} bold>גיראז</He>
      <Arrow x1={170} y1={188} x2={60} y2={188} color={MUTED} />
      <He x={115} y={208} size={11} color={MUTED}>המזלג מתקדם</He>
      {/* helicase */}
      <ellipse cx={222} cy={182} rx={11} ry={17} transform="rotate(-45 222 182)" fill={FILL.yellow} stroke="#b45309" strokeWidth={2} />
      <He x={196} y={236} size={11} color="#b45309" bold>הליקאז</He>
      {/* leading strand */}
      <Arrow x1={495} y1={113} x2={262} y2={113} color={GREEN} width={3} />
      <ellipse cx={252} cy={113} rx={20} ry={11} fill={FILL.green} stroke={GREEN} strokeWidth={1.5} />
      <La x={252} y={117} size={9} bold>Pol III</La>
      <La x={500} y={128} size={11} color={GREEN}>5′</La>
      <He x={380} y={88} size={12} bold color={GREEN}>גדיל מוביל — ברצף</He>
      {/* lagging strand: newest fragment near the fork */}
      {[248, 258].map((x) => <circle key={x} cx={x} cy={207} r={4} fill={MUTED} />)}
      <La x={253} y={226} size={10} color={MUTED}>SSB</La>
      {prim(272, 284, 187)}
      <Arrow x1={284} y1={187} x2={322} y2={187} color={GREEN} width={3} />
      <ellipse cx={336} cy={187} rx={20} ry={11} fill={FILL.green} stroke={GREEN} strokeWidth={1.5} />
      <La x={336} y={191} size={9} bold>Pol III</La>
      {prim(362, 374, 187)}
      <Line x1={374} y1={187} x2={424} y2={187} c={GREEN} />
      <ellipse cx={432} cy={187} rx={13} ry={10} fill={FILL.sky} stroke={BLUE} strokeWidth={1.5} />
      <La x={432} y={226} size={10.5} color={BLUE} bold>Pol I</La>
      <Line x1={440} y1={187} x2={448} y2={187} c={ORANGE} w={6} />
      <Line x1={448} y1={187} x2={500} y2={187} c={GREEN} />
      <circle cx={278} cy={210} r={6} fill={PURPLE} />
      <He x={290} y={244} size={10.5} color={PURPLE}>פרימאז</He>
      <He x={390} y={262} size={12} bold color={GREEN}>גדיל מפגר — קטעי אוקזאקי</He>
      <rect x={350} y={280} width={16} height={6} fill={ORANGE} />
      <He x={420} y={287} size={11} color={ORANGE}>פריימר RNA</He>
    </Svg>
  );
}

// ── mol-replication-origins ──────────────────────────────────────────────────
function OricInitiation() {
  const duplex = (y: number) => (<g><Line x1={40} y1={y - 5} x2={440} y2={y - 5} /><Line x1={40} y1={y + 5} x2={440} y2={y + 5} /></g>);
  return (
    <Svg h={300} label="התחלת השכפול ב-oriC: DnaA-ATP נקשר לרצפי ה-9, פותח את אזור ה-13 העשיר ב-A-T, ו-DnaC טוען שני הליקאזים (DnaB) — אחד לכל מזלג">
      <Num x={20} y={44} n={1} />
      {duplex(44)}
      {[78, 116, 154].map((x) => <rect key={x} x={x - 16} y={34} width={32} height={20} rx={3} fill={FILL.red} stroke={RED} strokeWidth={1.2} />)}
      {[232, 284, 336, 388].map((x) => <rect key={x} x={x - 16} y={34} width={32} height={20} rx={3} fill={FILL.blue} stroke={BLUE} strokeWidth={1.2} />)}
      <He x={116} y={76} size={11} color={RED}>3 רצפים של 13 — עשירים ב-A-T</He>
      <He x={310} y={76} size={11} color={BLUE}>4 רצפים של 9 — אתרי DnaA</He>
      <Num x={20} y={148} n={2} />
      <path d="M40 143 L60 143 Q116 112 172 143 L440 143" fill="none" stroke={BLUE} strokeWidth={3} />
      <path d="M40 153 L60 153 Q116 184 172 153 L440 153" fill="none" stroke={BLUE} strokeWidth={3} />
      {[236, 262, 288, 314, 340, 366, 392].map((x, i) => <circle key={x} cx={x} cy={i % 2 ? 128 : 166} r={12} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.5} />)}
      <He x={310} y={108} size={11} color={ORANGE}>DnaA-ATP, מולקולות רבות</He>
      <Num x={20} y={244} n={3} />
      <path d="M40 239 L130 239 Q240 196 350 239 L440 239" fill="none" stroke={BLUE} strokeWidth={3} />
      <path d="M40 249 L130 249 Q240 292 350 249 L440 249" fill="none" stroke={BLUE} strokeWidth={3} />
      <ellipse cx={165} cy={226} rx={10} ry={15} fill={FILL.yellow} stroke="#b45309" strokeWidth={2} />
      <ellipse cx={315} cy={262} rx={10} ry={15} fill={FILL.yellow} stroke="#b45309" strokeWidth={2} />
      <Arrow x1={150} y1={214} x2={110} y2={214} color="#b45309" />
      <Arrow x1={330} y1={276} x2={370} y2={276} color="#b45309" />
      <He x={240} y={196} size={11} color="#b45309">DnaB — הליקאז לכל מזלג</He>
    </Svg>
  );
}

function OriginLicensing() {
  return (
    <Svg h={330} label="רישוי וירי של מקורות באאוקריוטים: ב-G1 (CDK נמוך) ORC, Cdc6 ו-Cdt1 טוענים שתי טבעות MCM לא פעילות; ב-S (CDK ו-DDK גבוהים) נוצר ההליקאז הפעיל CMG ושני מזלגות יוצאים; כל עוד CDK גבוה אין טעינה חדשה">
      <He x={240} y={22} size={13} bold>G1 — CDK נמוך: רישוי</He>
      <Line x1={40} y1={72} x2={440} y2={72} />
      <rect x={130} y={48} width={56} height={22} rx={6} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.5} /><La x={158} y={63} size={11} bold>ORC</La>
      <circle cx={204} cy={50} r={10} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.5} /><La x={200} y={36} size={9.5} anchor="end">Cdc6</La>
      <circle cx={224} cy={50} r={10} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.5} /><La x={230} y={36} size={9.5} anchor="start">Cdt1</La>
      <ellipse cx={272} cy={72} rx={17} ry={20} fill={FILL.yellow} stroke="#b45309" strokeWidth={2} />
      <ellipse cx={308} cy={72} rx={17} ry={20} fill={FILL.yellow} stroke="#b45309" strokeWidth={2} />
      <La x={290} y={110} size={11} color="#b45309">MCM ×2</La>
      <He x={390} y={110} size={11} color={MUTED}>מורשה, לא פעיל</He>

      <He x={240} y={142} size={13} bold>S — CDK ו-DDK גבוהים: ירי</He>
      <path d="M40 188 L170 188 Q240 152 310 188 L440 188" fill="none" stroke={BLUE} strokeWidth={3} />
      <path d="M40 198 L170 198 Q240 234 310 198 L440 198" fill="none" stroke={BLUE} strokeWidth={3} />
      <ellipse cx={186} cy={180} rx={20} ry={14} fill={FILL.yellow} stroke="#b45309" strokeWidth={2} /><La x={186} y={184} size={10} bold>CMG</La>
      <ellipse cx={294} cy={206} rx={20} ry={14} fill={FILL.yellow} stroke="#b45309" strokeWidth={2} /><La x={294} y={210} size={10} bold>CMG</La>
      <Arrow x1={162} y1={162} x2={118} y2={162} color="#b45309" />
      <Arrow x1={318} y1={226} x2={362} y2={226} color="#b45309" />
      <He x={240} y={248} size={11} color={MUTED}>Cdc45 ו-GINS מצטרפים ל-MCM</He>

      <He x={240} y={284} size={13} bold>מ-S עד סוף המיטוזה: אין רישוי חדש</He>
      <He x={240} y={306} size={11.5}>Cdc6 מפורק · Cdt1 מעוכב בידי ג'מינין · ORC מזורחן</He>
    </Svg>
  );
}

function Telomerase() {
  const step = 17, x0 = 44;
  const top = "TTAGGGTTAG".split(""), add = "GGTTAG".split(""), rna = "CAAUCCCAAUC".split("");
  return (
    <Svg h={260} label="טלומראז מאריך את קצה ה-3′ של הגדיל העשיר ב-G: ה-RNA שלו מזדווג לקצה הבולט, וה-TERT מוסיף חזרה חדשה (GGTTAG, בכתום) לפי התבנית; אחר כך האנזים זז קדימה, והגדיל השני מושלם בידי Pol α–פרימאז">
      <rect x={x0 + 4 * step - 8} y={58} width={12 * step + 22} height={74} rx={18} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} opacity={0.55} />
      <La x={x0 - 22} y={84} size={12} bold>5′…</La>
      {top.map((c, i) => <La key={i} x={x0 + i * step} y={84} size={14} bold color={BLUE}>{c}</La>)}
      {add.map((c, i) => <La key={`a${i}`} x={x0 + (10 + i) * step} y={84} size={14} bold color={ORANGE}>{c}</La>)}
      <La x={x0 + 16 * step + 4} y={84} size={12} bold>3′</La>
      {"AATC".split("").map((c, i) => <La key={`b${i}`} x={x0 + i * step} y={106} size={14} bold color={BLUE}>{c}</La>)}
      <La x={x0 - 22} y={106} size={12} bold>3′…</La>
      <La x={x0 + 4 * step - 2} y={106} size={12} bold>5′</La>
      {rna.map((c, i) => <La key={`r${i}`} x={x0 + (5 + i) * step} y={118} size={14} bold color={PURPLE}>{c}</La>)}
      <La x={x0 + 4 * step + 6} y={128} size={11} color={PURPLE}>3′</La>
      <La x={x0 + 16 * step + 4} y={118} size={11} color={PURPLE}>5′</La>
      <He x={390} y={150} size={11.5} color={PURPLE}>טלומראז: TERT + RNA</He>
      <He x={240} y={182} size={12}>1. ה-RNA מזדווג לקצה ה-3′ הבולט</He>
      <He x={240} y={202} size={12}>2. TERT מוסיף GGTTAG לפי התבנית (כתום)</He>
      <He x={240} y={222} size={12}>3. האנזים זז קדימה וחוזר על המחזור</He>
      <He x={240} y={242} size={12}>4. Pol α–פרימאז משלים את הגדיל העשיר ב-C</He>
    </Svg>
  );
}

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
function BacterialPromoter() {
  const X = (p: number) => 300 + 4 * p;
  return (
    <Svg h={220} label="פרומוטור חיידקי: אזור −35 (TTGACA) ואזור −10 (TATAAT) במרווח של 16–18 זוגות בסיסים; פקטור סיגמא של ההולואנזים מזהה את שניהם; השעתוק מתחיל ב-+1">
      <ellipse cx={270} cy={36} rx={110} ry={24} fill={FILL.sky} stroke={BLUE} strokeWidth={1.6} />
      <He x={270} y={41} size={12.5}>אנזים הליבה</He>
      <rect x={146} y={62} width={140} height={20} rx={8} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.6} />
      <La x={216} y={77} size={12} bold color={ORANGE}>σ⁷⁰</La>
      <Line x1={170} y1={82} x2={170} y2={108} c={ORANGE} w={2} />
      <Line x1={262} y1={82} x2={262} y2={108} c={ORANGE} w={2} />
      <Line x1={20} y1={112} x2={460} y2={112} c={INK} />
      <Line x1={20} y1={122} x2={460} y2={122} c={INK} />
      <rect x={X(-60)} y={108} width={80} height={18} rx={3} fill={FILL.gray} stroke={MUTED} strokeWidth={1} />
      <rect x={X(-35)} y={106} width={24} height={22} rx={3} fill={FILL.red} stroke={RED} strokeWidth={1.5} />
      <rect x={X(-12)} y={106} width={24} height={22} rx={3} fill={FILL.red} stroke={RED} strokeWidth={1.5} />
      <path d={`M${X(1)} 106 L${X(1)} 86 L${X(1) + 44} 86`} fill="none" stroke={GREEN} strokeWidth={2.5} markerEnd="url(#bfArrow)" />
      <He x={100} y={148} size={10.5} color={MUTED}>אלמנט UP</He>
      <La x={X(-32.5)} y={148} size={12} bold color={RED}>TTGACA</La>
      <La x={X(-9.5)} y={148} size={12} bold color={RED}>TATAAT</La>
      <La x={X(-32.5)} y={166} size={11.5}>−35</La>
      <La x={X(-9.5)} y={166} size={11.5}>−10</La>
      <La x={X(1)} y={166} size={11.5} color={GREEN} bold>+1</La>
      <path d={`M${X(-29)} 178 L${X(-29)} 184 L${X(-13)} 184 L${X(-13)} 178`} fill="none" stroke={INK} strokeWidth={1.2} />
      <He x={X(-21)} y={202} size={11}>16–18 ז״ב</He>
    </Svg>
  );
}

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

function Terminators() {
  return (
    <Svg h={300} label="שתי דרכים לסיום שעתוק בחיידקים: סיום עצמי — סיכת ראש עשירה ב-G-C ב-RNA ואחריה רצף של U; סיום תלוי-Rho — Rho נקשר לאתר rut ב-RNA, נע 5′→3′ ומפריד את ה-RNA מהפולימראז המושהה">
      <He x={240} y={20} size={13} bold>סיום עצמי</He>
      <Line x1={30} y1={118} x2={450} y2={118} c={BLUE} />
      <ellipse cx={360} cy={108} rx={44} ry={26} fill={FILL.sky} stroke={BLUE} strokeWidth={1.6} />
      <He x={360} y={150} size={10.5} color={MUTED}>RNA פולימראז</He>
      <Line x1={40} y1={98} x2={232} y2={98} c={PURPLE} />
      <La x={32} y={102} size={11} color={PURPLE} anchor="end">5′</La>
      <Line x1={236} y1={96} x2={236} y2={50} c={PURPLE} />
      <Line x1={250} y1={96} x2={250} y2={50} c={PURPLE} />
      {[60, 70, 80, 90].map((y) => <line key={y} x1={236} x2={250} y1={y} y2={y} stroke={PURPLE} strokeWidth={1.4} />)}
      <circle cx={243} cy={42} r={10} fill="none" stroke={PURPLE} strokeWidth={3} />
      <La x={290} y={102} size={11} color={PURPLE} bold>UUUUUU</La>
      <He x={160} y={52} size={11} color={PURPLE}>סיכה עשירה ב-G-C</He>

      <He x={240} y={180} size={13} bold>סיום תלוי-Rho</He>
      <Line x1={30} y1={270} x2={450} y2={270} c={BLUE} />
      <ellipse cx={380} cy={260} rx={44} ry={26} fill={FILL.sky} stroke={BLUE} strokeWidth={1.6} />
      <He x={380} y={226} size={10.5} color={MUTED}>מושהה</He>
      <Line x1={40} y1={252} x2={340} y2={252} c={PURPLE} />
      <La x={32} y={256} size={11} color={PURPLE} anchor="end">5′</La>
      <Line x1={90} y1={252} x2={150} y2={252} c={ORANGE} w={6} />
      <He x={120} y={238} size={10.5} color={ORANGE}>אתר rut, עשיר ב-C</He>
      <polygon points="216,236 236,236 246,252 236,268 216,268 206,252" fill={FILL.yellow} stroke="#b45309" strokeWidth={2} />
      <La x={226} y={256} size={10.5} bold>Rho</La>
      <Arrow x1={256} y1={240} x2={300} y2={240} color="#b45309" />
      <He x={226} y={222} size={10.5} color="#b45309">הליקאז, ATP</He>
    </Svg>
  );
}

// ── mol-transcription-euk ────────────────────────────────────────────────────
function PicAssembly() {
  return (
    <Svg h={260} label="קומפלקס הטרום-התחלה של RNA פולימראז II: TFIID (עם TBP) נקשר ראשון לתיבת TATA, אחריו TFIIA ו-TFIIB, הפולימראז עם TFIIF, TFIIE ובסוף TFIIH, שפותח את ה-DNA ומזרחן את ה-CTD">
      <Line x1={20} y1={186} x2={460} y2={186} c={INK} />
      <Line x1={20} y1={196} x2={460} y2={196} c={INK} />
      <rect x={112} y={182} width={34} height={18} rx={3} fill={FILL.red} stroke={RED} strokeWidth={1.4} />
      <La x={129} y={218} size={11.5} bold color={RED}>TATA</La>
      <La x={250} y={218} size={11.5} bold color={GREEN}>+1</La>
      <path d="M250 182 L250 168" stroke={GREEN} strokeWidth={2} />
      <rect x={86} y={110} width={92} height={62} rx={14} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.6} />
      <La x={132} y={128} size={11.5} bold>TFIID</La>
      <path d="M106 180 Q129 140 152 180" fill={FILL.orange} stroke={ORANGE} strokeWidth={2} />
      <La x={129} y={170} size={10} bold>TBP</La>
      <circle cx={70} cy={160} r={14} fill={FILL.gray} stroke={INK} strokeWidth={1.4} /><La x={70} y={164} size={11} bold>A</La>
      <circle cx={194} cy={162} r={15} fill={FILL.gray} stroke={INK} strokeWidth={1.4} /><La x={194} y={166} size={11} bold>B</La>
      <ellipse cx={268} cy={134} rx={52} ry={42} fill={FILL.sky} stroke={BLUE} strokeWidth={1.8} />
      <La x={262} y={140} size={13} bold>Pol II</La>
      <circle cx={300} cy={98} r={13} fill={FILL.gray} stroke={INK} strokeWidth={1.4} /><La x={300} y={102} size={11} bold>F</La>
      <circle cx={336} cy={160} r={14} fill={FILL.gray} stroke={INK} strokeWidth={1.4} /><La x={336} y={164} size={11} bold>E</La>
      <ellipse cx={392} cy={150} rx={36} ry={22} fill={FILL.green} stroke={GREEN} strokeWidth={1.6} />
      <La x={392} y={154} size={11} bold>TFIIH</La>
      <path d="M240 94 Q236 60 270 46 Q300 36 330 50" fill="none" stroke={BLUE} strokeWidth={2.5} {...dash} />
      {[268, 296, 322].map((x, i) => <g key={x}><circle cx={x} cy={i === 0 ? 47 : i === 1 ? 40 : 48} r={7} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.4} /><La x={x} y={(i === 0 ? 47 : i === 1 ? 40 : 48) + 4} size={8.5} bold>P</La></g>)}
      <He x={380} y={44} size={11} color={ORANGE}>CTD: זרחון Ser5</He>
      <Arrow x1={380} y1={128} x2={346} y2={62} color={ORANGE} />
      <Num x={132} y={98} n={1} /><Num x={52} y={140} n={2} /><Num x={212} y={142} n={3} /><Num x={230} y={86} n={4} /><Num x={356} y={140} n={5} /><Num x={430} y={126} n={6} />
      <He x={240} y={246} size={11.5}>המספרים — סדר ההרכבה הקלאסי</He>
    </Svg>
  );
}

function EnhancerLoop() {
  return (
    <Svg h={270} label="מגביר רחוק משפיע על הפרומוטור דרך לולאה ב-DNA: מפעיל שנקשר למגביר פונה דרך המדיאטור אל RNA פולימראז II וגורמי השעתוק הכלליים בפרומוטור">
      <path d="M20 220 L150 220 C150 220 60 70 190 70 C320 70 230 220 230 220 L460 220" fill="none" stroke={INK} strokeWidth={3} />
      <rect x={168} y={62} width={44} height={16} rx={3} fill={FILL.red} stroke={RED} strokeWidth={1.5} />
      <He x={190} y={48} size={12} bold color={RED}>מגביר</He>
      <ellipse cx={192} cy={98} rx={30} ry={15} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.8} />
      <He x={192} y={103} size={11.5} bold>מפעיל</He>
      <rect x={224} y={110} width={140} height={44} rx={16} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.6} />
      <He x={294} y={137} size={12.5} bold color={PURPLE}>מדיאטור</He>
      <rect x={300} y={214} width={30} height={14} rx={3} fill={FILL.gray} stroke={MUTED} strokeWidth={1.2} />
      <La x={315} y={246} size={10.5} color={MUTED}>TATA</La>
      <ellipse cx={372} cy={192} rx={48} ry={26} fill={FILL.sky} stroke={BLUE} strokeWidth={1.8} />
      <La x={372} y={197} size={12.5} bold>Pol II</La>
      <path d="M402 214 L402 200 L436 200" fill="none" stroke={GREEN} strokeWidth={2} markerEnd="url(#bfArrow)" />
      <He x={100} y={256} size={11} color={MUTED}>המגביר יכול להיות רחוק עשרות אלפי ז״ב</He>
    </Svg>
  );
}

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
      <La x={284} y={202} size={12} bold color={ORANGE}>A</La>
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
function TrnaStructure() {
  const stemV = (x: number, y1: number, y2: number) => (<g><Line x1={x - 12} y1={y1} x2={x - 12} y2={y2} c={PURPLE} /><Line x1={x + 12} y1={y1} x2={x + 12} y2={y2} c={PURPLE} />{Array.from({ length: Math.floor((y2 - y1) / 12) }, (_, i) => <line key={i} x1={x - 12} x2={x + 12} y1={y1 + 8 + i * 12} y2={y1 + 8 + i * 12} stroke={PURPLE} strokeWidth={1.2} />)}</g>);
  const stemH = (y: number, x1: number, x2: number) => (<g><Line x1={x1} y1={y - 12} x2={x2} y2={y - 12} c={PURPLE} /><Line x1={x1} y1={y + 12} x2={x2} y2={y + 12} c={PURPLE} />{Array.from({ length: Math.floor(Math.abs(x2 - x1) / 12) }, (_, i) => <line key={i} x1={Math.min(x1, x2) + 8 + i * 12} x2={Math.min(x1, x2) + 8 + i * 12} y1={y - 12} y2={y + 12} stroke={PURPLE} strokeWidth={1.2} />)}</g>);
  return (
    <Svg h={390} label="מבנה התלתן של tRNA: זרוע הקבלה עם קצה CCA שאליו מחוברת חומצת האמינו, זרוע D, זרוע TψC, לולאה משתנה, וזרוע האנטיקודון שבלולאה שלה שלושת בסיסי האנטיקודון">
      {stemV(240, 80, 160)}
      <La x={222} y={74} size={12} bold>5′</La>
      {["C", "C", "A"].map((c, i) => <La key={i} x={266} y={72 - i * 16} size={13} bold color={ORANGE}>{c}</La>)}
      <La x={268} y={22} size={11} bold>3′</La>
      <circle cx={290} cy={30} r={13} fill={FILL.green} stroke={GREEN} strokeWidth={2} />
      <La x={290} y={34} size={10} bold>aa</La>
      <He x={360} y={34} size={11} color={GREEN}>חומצת אמינו</He>
      <He x={340} y={110} size={11} color={MUTED}>זרוע הקבלה</He>
      {stemH(184, 228, 160)}
      <circle cx={128} cy={184} r={32} fill="none" stroke={PURPLE} strokeWidth={3} />
      <He x={128} y={234} size={11} color={MUTED}>זרוע D</He>
      {stemH(184, 252, 320)}
      <circle cx={352} cy={184} r={32} fill="none" stroke={PURPLE} strokeWidth={3} />
      <La x={352} y={240} size={11} color={MUTED}>TψC</La>
      <path d="M252 212 Q290 226 268 238" fill="none" stroke={PURPLE} strokeWidth={3} />
      <He x={318} y={258} size={10.5} color={MUTED}>לולאה משתנה</He>
      {stemV(240, 208, 284)}
      <circle cx={240} cy={316} r={32} fill="none" stroke={PURPLE} strokeWidth={3} />
      {[222, 240, 258].map((x) => <rect key={x} x={x - 8} y={340} width={16} height={18} rx={3} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.5} />)}
      {["G", "A", "A"].map((c, i) => <La key={i} x={222 + i * 18} y={354} size={11} bold>{c}</La>)}
      <He x={240} y={380} size={12} bold color={ORANGE}>אנטיקודון</He>
    </Svg>
  );
}

function Aminoacylation() {
  return (
    <Svg h={260} label="טעינת tRNA בשני שלבים: חומצת אמינו ו-ATP יוצרים אמינואציל-AMP ופירופוספט; אחר כך חומצת האמינו עוברת ל-tRNA ו-AMP משתחרר; טעינה שגויה מפורקת באתר העריכה">
      <LBox x={110} y={30} w={170} label="aa + ATP" c={BLUE} fill={FILL.blue} />
      <Arrow x1={200} y1={45} x2={262} y2={45} />
      <He x={231} y={30} size={11} bold>שלב 1</He>
      <LBox x={360} y={30} w={190} label="aa–AMP + PPᵢ" c={BLUE} fill={FILL.blue} />
      <La x={430} y={84} size={11} color={MUTED}>PPᵢ → 2 Pᵢ</La>
      <LBox x={110} y={110} w={170} label="aa–AMP + tRNA" c={GREEN} fill={FILL.green} />
      <Arrow x1={200} y1={125} x2={262} y2={125} />
      <He x={231} y={110} size={11} bold>שלב 2</He>
      <LBox x={360} y={110} w={190} label="aa–tRNA + AMP" c={GREEN} fill={FILL.green} />
      <Arrow x1={360} y1={142} x2={360} y2={186} color={ORANGE} dashed />
      <HBox x={360} y={190} w={200} label="אתר עריכה — טעינה שגויה מפורקת" c={ORANGE} fill={FILL.orange} size={11.5} />
      <HBox x={110} y={190} w={190} label="מחיר: 2 קשרים עתירי אנרגיה" c={MUTED} fill={FILL.gray} size={11.5} />
    </Svg>
  );
}

// ── ribosome helpers ─────────────────────────────────────────────────────────
type Slot = "empty" | "trna" | "aa" | "peptide" | "rf";
function Ribo({ cx, cy, E = "empty", P = "empty", A = "empty", codons, k = 1, peptideLen = 3 }: { cx: number; cy: number; E?: Slot; P?: Slot; A?: Slot; codons?: [string, string, string]; k?: number; peptideLen?: number }) {
  const s = (v: number) => v * k;
  const slots: [string, number, Slot][] = [["E", -s(44), E], ["P", 0, P], ["A", s(44), A]];
  return (
    <g>
      <rect x={cx - s(80)} y={cy - s(62)} width={s(160)} height={s(60)} rx={s(24)} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.6} />
      <rect x={cx - s(80)} y={cy} width={s(160)} height={s(36)} rx={s(14)} fill={FILL.sky} stroke={BLUE} strokeWidth={1.6} />
      <Line x1={cx - s(100)} y1={cy + s(12)} x2={cx + s(100)} y2={cy + s(12)} c={PURPLE} w={2.5} />
      {slots.map(([n, dx, st], i) => (
        <g key={n}>
          <La x={cx + dx} y={cy + s(52)} size={11 * k} bold color={MUTED}>{n}</La>
          {codons && <La x={cx + dx} y={cy + s(29)} size={9.5 * k} bold>{codons[i]}</La>}
          {(st === "trna" || st === "aa" || st === "peptide") && <rect x={cx + dx - s(9)} y={cy - s(38)} width={s(18)} height={s(52)} rx={s(4)} fill={st === "trna" ? FILL.gray : FILL.green} stroke={st === "trna" ? MUTED : GREEN} strokeWidth={1.4} />}
          {st === "aa" && <circle cx={cx + dx} cy={cy - s(44)} r={s(6)} fill={ORANGE} />}
          {st === "peptide" && Array.from({ length: peptideLen }, (_, j) => <circle key={j} cx={cx + dx + s(j * 8)} cy={cy - s(44) - s(j * 9)} r={s(6)} fill={ORANGE} />)}
          {st === "rf" && <g><rect x={cx + dx - s(11)} y={cy - s(40)} width={s(22)} height={s(54)} rx={s(6)} fill={FILL.red} stroke={RED} strokeWidth={1.5} /><La x={cx + dx} y={cy - s(10)} size={9 * k} bold color={RED}>RF</La></g>}
        </g>
      ))}
    </g>
  );
}

// ── mol-ribosome-initiation ──────────────────────────────────────────────────
function RibosomeSites() {
  return (
    <Svg h={305} label="הריבוזום: תת-יחידה גדולה (מרכז הפפטידיל טרנספראז) ותת-יחידה קטנה (מרכז הפענוח), שלושה אתרים ל-tRNA — E, P ו-A — וה-mRNA שעובר בתת-היחידה הקטנה מ-5′ ל-3′; השרשרת יוצאת דרך תעלת היציאה">
      <Ribo cx={220} cy={180} E="trna" P="peptide" A="aa" codons={["GCU", "UUC", "AAA"]} k={1.5} peptideLen={4} />
      <La x={56} y={202} size={12} bold color={PURPLE}>5′</La>
      <La x={384} y={202} size={12} bold color={PURPLE}>3′</La>
      <He x={430} y={110} size={11.5} bold color={PURPLE}>תת-יחידה גדולה</He>
      <He x={430} y={128} size={10.5} color={PURPLE}>פפטידיל טרנספראז</He>
      <He x={430} y={226} size={11.5} bold color={BLUE}>תת-יחידה קטנה</He>
      <He x={430} y={244} size={10.5} color={BLUE}>מרכז הפענוח</He>
      <He x={330} y={44} size={11} color={ORANGE}>השרשרת יוצאת</He>
      <Arrow x1={300} y1={284} x2={370} y2={284} color={MUTED} />
      <He x={220} y={290} size={10.5} color={MUTED}>הריבוזום נע לכיוון 3′</He>
    </Svg>
  );
}

function InitiationCompare() {
  return (
    <Svg h={340} label="התחלת תרגום: בחיידקים רצף שיין-דלגרנו מזדווג עם קצה ה-16S rRNA ומציב את AUG באתר P; באאוקריוטים eIF4F נקשר לכובע, ה-mRNA יוצר מעגל עם PABP, וקומפלקס 43S סורק מ-5′ עד AUG בהקשר קוזאק">
      <He x={240} y={22} size={13} bold>חיידקים</He>
      <rect x={100} y={56} width={210} height={84} rx={20} fill={FILL.sky} stroke={BLUE} strokeWidth={1.2} opacity={0.7} />
      <La x={300} y={72} size={11} bold color={BLUE}>30S</La>
      <Line x1={30} y1={110} x2={450} y2={110} c={PURPLE} w={2.5} />
      <La x={24} y={114} size={11} color={PURPLE} anchor="end">5′</La>
      <rect x={124} y={100} width={62} height={20} rx={3} fill={FILL.red} stroke={RED} strokeWidth={1.2} />
      <La x={155} y={115} size={11} bold>AGGAGG</La>
      <rect x={236} y={100} width={40} height={20} rx={3} fill={FILL.green} stroke={GREEN} strokeWidth={1.2} />
      <La x={256} y={115} size={11} bold>AUG</La>
      <La x={155} y={138} size={11} bold color={BLUE}>UCCUCC</La>
      <He x={70} y={138} size={10} color={BLUE}>קצה ה-16S</He>
      <rect x={248} y={62} width={16} height={36} rx={3} fill={FILL.green} stroke={GREEN} strokeWidth={1.2} />
      <circle cx={256} cy={56} r={9} fill={ORANGE} />
      <La x={256} y={44} size={10} bold color={ORANGE}>fMet</La>
      <ellipse cx={226} cy={78} rx={14} ry={9} fill={FILL.yellow} stroke="#b45309" strokeWidth={1.2} /><La x={226} y={82} size={8.5} bold>IF2</La>
      <He x={390} y={70} size={10.5} color={MUTED}>כ-10 נוקלאוטידים</He>
      <He x={390} y={86} size={10.5} color={MUTED}>בין SD ל-AUG</He>

      <He x={240} y={186} size={13} bold>אאוקריוטים</He>
      <path d="M418 262 Q420 206 240 206 Q80 206 82 252" fill="none" stroke={MUTED} strokeWidth={1.5} {...dash} />
      <Line x1={60} y1={278} x2={440} y2={278} c={PURPLE} w={2.5} />
      <circle cx={50} cy={278} r={13} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.6} /><La x={50} y={282} size={8.5} bold>m⁷G</La>
      <ellipse cx={84} cy={258} rx={24} ry={12} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.4} /><La x={84} y={262} size={9.5} bold>eIF4F</La>
      <La x={420} y={298} size={11} bold color={PURPLE}>AAAA…</La>
      <circle cx={418} cy={266} r={10} fill={FILL.gray} stroke={INK} strokeWidth={1.2} /><La x={418} y={252} size={9} bold>PABP</La>
      <ellipse cx={182} cy={268} rx={40} ry={18} fill={FILL.sky} stroke={BLUE} strokeWidth={1.6} /><La x={182} y={272} size={11} bold>43S</La>
      <Arrow x1={226} y1={252} x2={290} y2={252} color={BLUE} />
      <He x={258} y={242} size={10.5} color={BLUE}>סריקה</He>
      <rect x={312} y={268} width={40} height={20} rx={3} fill={FILL.green} stroke={GREEN} strokeWidth={1.2} />
      <La x={332} y={283} size={11} bold>AUG</La>
      <La x={332} y={308} size={11} color={GREEN}>gccRccAUGG</La>
      <He x={332} y={326} size={10.5} color={MUTED}>הקשר קוזאק</He>
      <He x={240} y={222} size={10.5} color={MUTED}>מעגל: כובע + זנב</He>
    </Svg>
  );
}

// ── mol-translation-elongation ───────────────────────────────────────────────
function ElongationCycle() {
  return (
    <Svg h={410} label="מחזור ההארכה: EF-Tu–GTP מביא אמינואציל-tRNA לאתר A; ה-rRNA יוצר קשר פפטידי והשרשרת עוברת ל-tRNA שבאתר A; EF-G–GTP מזיז את הריבוזום בקודון אחד, וה-tRNA הריק עובר ל-E">
      <Ribo cx={240} cy={96} E="trna" P="peptide" A="empty" k={0.95} />
      <He x={240} y={168} size={11} color={MUTED}>שרשרת ב-P, אתר A פנוי</He>
      <Ribo cx={370} cy={300} P="peptide" A="aa" k={0.95} />
      <Ribo cx={110} cy={300} P="trna" A="peptide" k={0.95} peptideLen={4} />
      <Arrow x1={330} y1={160} x2={380} y2={226} color={GREEN} width={2.4} />
      <He x={420} y={170} size={11.5} bold color={GREEN}>1. כניסה לאתר A</He>
      <La x={420} y={188} size={11} color={GREEN}>EF-Tu–GTP</La>
      <Arrow x1={282} y1={330} x2={200} y2={330} color={ORANGE} width={2.4} />
      <He x={240} y={372} size={11.5} bold color={ORANGE}>2. קשר פפטידי</He>
      <He x={240} y={390} size={10.5} color={ORANGE}>ה-rRNA מזרז, בלי GTP</He>
      <Arrow x1={100} y1={226} x2={150} y2={160} color={BLUE} width={2.4} />
      <He x={64} y={170} size={11.5} bold color={BLUE}>3. טרנסלוקציה</He>
      <La x={64} y={188} size={11} color={BLUE}>EF-G–GTP</La>
    </Svg>
  );
}

function Termination() {
  return (
    <Svg h={220} label="סיום התרגום: גורם שחרור נכנס לאתר A מול קודון העצירה, ומים מנתקים את השרשרת מה-tRNA; אחר כך RRF ו-EF-G מפרקים את הריבוזום">
      <Ribo cx={120} cy={110} P="peptide" A="rf" codons={["GCU", "UUC", "UAA"]} k={1} peptideLen={4} />
      <He x={120} y={186} size={11.5} bold>קודון עצירה באתר A</He>
      <He x={120} y={204} size={10.5} color={MUTED}>RF1 או RF2 מזהה אותו</He>
      <Arrow x1={226} y1={100} x2={276} y2={100} />
      <He x={251} y={86} size={10.5}>מים</He>
      <rect x={300} y={44} width={136} height={44} rx={18} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <rect x={300} y={104} width={136} height={24} rx={11} fill={FILL.sky} stroke={BLUE} strokeWidth={1.4} />
      {[0, 1, 2, 3].map((j) => <circle key={j} cx={420 + j * 9} cy={30 - j * 8} r={6} fill={ORANGE} />)}
      <He x={368} y={160} size={11.5} bold>החלבון משתחרר</He>
      <He x={368} y={178} size={10.5} color={MUTED}>RF3 · RRF ו-EF-G מפרקים</He>
      <He x={368} y={196} size={10.5} color={MUTED}>את הריבוזום לתת-יחידות</He>
    </Svg>
  );
}

export const MOLECULAR_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "nucleotide-structure": { el: NucleotideStructure, captionHe: "מבנה של נוקלאוטיד. הבסיס מחובר לפחמן 1′ של הסוכר בקשר N-גליקוזידי; הפוספט — לפחמן 5′; ב-OH של פחמן 3′ יתחבר הנוקלאוטיד הבא. ההבדל בין DNA ל-RNA: בפחמן 2′ יש H (דאוקסיריבוז) או OH (ריבוז). סכמטי." },
  "double-helix": { el: DoubleHelix, captionHe: "הסליל הכפול. משמאל — \"פרוש\": שני גדילים אנטי-מקבילים, A מול T בשני קשרי מימן ו-G מול C בשלושה, תמיד פורין מול פירימידין. מימין — הסליל הימני, שבו המרחקים הלא שווים בין שני השלדים יוצרים חריץ גדול וחריץ קטן. סכמטי." },
  "dna-melting": { el: DnaMelting, captionHe: "עקומות התכה מחושבות (מודל של מעבר חד). הבליעה ב-260 ננומטר עולה כשהגדילים נפרדים — האפקט ההיפרכרומי. Tm חושב לפי הקשר האמפירי של מרמור ודוטי, Tm ≈ 69.3 + 0.41 × (%G+C), שנמדד בתמיסת מלח מסוימת (SSC); בתנאים אחרים הערכים משתנים, אבל הכיוון נשמר: יותר G+C — Tm גבוה יותר." },
  nucleosome: { el: Nucleosome, captionHe: "נוקלאוזום. כ-147 זוגות בסיסים של DNA מלופפים כ-1.65 סיבובים סביב אוקטמר של היסטונים — שניים מכל אחד מ-H2A, H2B, H3 ו-H4. DNA מקשר מחבר לנוקלאוזום הבא, והיסטון H1 נקשר במקום הכניסה והיציאה. זנבות ההיסטונים בולטים החוצה. סכמטי." },
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
