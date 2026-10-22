/* Figures for the molecular plant physiology units (Technion 134040). Original drawings: each was laid out after
   looking at how the course book (Taiz et al., Plant Physiology and Development, 7e) presents the same structure —
   which components appear, their order and arrangement — never copied. Schematic unless the caption says otherwise.
   Colors: membranes gray, cell wall tan, proteins by role (receptor blue, repressor red, transcription factor green,
   enzyme/kinase purple), DNA dark, hormones orange. Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, BLUE, GREEN, INK, MUTED, ORANGE, He, La, dash, scale } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

const PURPLE = "#7c3aed";
const RED = "#b91c1c";
const TEAL = "#0f766e";
const LINE_GRAY = "#cbd5e1";
const WALL = "#e7d3b0";
const WALL_EDGE = "#a8865a";
const FILL = { blue: "#dbeafe", green: "#dcfce7", orange: "#ffedd5", purple: "#ede9fe", yellow: "#fef3c7", gray: "#f1f5f9", red: "#fee2e2", sky: "#e0f2fe", teal: "#ccfbf1", cyto: "#fff7ed", nuc: "#f5f3ff" };

const Svg = ({ w = 480, h, label, children }: { w?: number; h: number; label: string; children: React.ReactNode }) => (
  <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label={label}>
    <ArrowDefs />
    <defs>
      <marker id="ppInhib" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M5 0L5 10" stroke={RED} strokeWidth={2.4} /></marker>
    </defs>
    {children}
  </svg>
);
// A labeled protein: rounded blob with a Latin name.
const Prot = ({ x, y, w = 54, h = 26, label, c = BLUE, fill = FILL.blue, size = 11, he = false }: { x: number; y: number; w?: number; h?: number; label: string; c?: string; fill?: string; size?: number; he?: boolean }) => (
  <g>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={c} strokeWidth={1.5} />
    {he ? <He x={x} y={y + size * 0.36} size={size} bold color={c}>{label}</He> : <La x={x} y={y + size * 0.36} size={size} bold color={c}>{label}</La>}
  </g>
);
// Inhibition arrow (line ending in a bar).
const Inhib = ({ x1, y1, x2, y2, c = RED }: { x1: number; y1: number; x2: number; y2: number; c?: string }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={2} markerEnd="url(#ppInhib)" />
);
// Lipid bilayer drawn as two lines with a pale band.
const Membrane = ({ x1, x2, y, t = 10 }: { x1: number; x2: number; y: number; t?: number }) => (
  <g>
    <rect x={x1} y={y - t / 2} width={x2 - x1} height={t} fill="#f8fafc" />
    <line x1={x1} x2={x2} y1={y - t / 2} y2={y - t / 2} stroke={MUTED} strokeWidth={1.6} />
    <line x1={x1} x2={x2} y1={y + t / 2} y2={y + t / 2} stroke={MUTED} strokeWidth={1.6} />
  </g>
);
// Double-stranded DNA segment with an optional binding site box.
const Dna = ({ x1, x2, y, site }: { x1: number; x2: number; y: number; site?: [number, number, string] }) => (
  <g>
    <line x1={x1} x2={x2} y1={y - 3} y2={y - 3} stroke={INK} strokeWidth={2} />
    <line x1={x1} x2={x2} y1={y + 3} y2={y + 3} stroke={INK} strokeWidth={2} />
    {site && <rect x={site[0]} y={y - 6} width={site[1]} height={12} fill={FILL.yellow} stroke={ORANGE} />}
    {site && <La x={site[0] + site[1] / 2} y={y + 22} size={9.5} color={ORANGE}>{site[2]}</La>}
  </g>
);
const Ub = ({ x, y, n = 4 }: { x: number; y: number; n?: number }) => (
  <g>{Array.from({ length: n }, (_, i) => <circle key={i} cx={x + i * 9} cy={y} r={4.5} fill="#fde68a" stroke="#b45309" strokeWidth={1} />)}</g>
);
const Proteasome = ({ x, y }: { x: number; y: number }) => (
  <g>
    {[0, 1, 2, 3].map((i) => <rect key={i} x={x - 14} y={y - 22 + i * 11} width={28} height={10} rx={3} fill={FILL.gray} stroke={MUTED} />)}
    <La x={x} y={y + 34} size={9.5} color={MUTED}>26S</La>
  </g>
);
const Hormone = ({ x, y, r = 7 }: { x: number; y: number; r?: number }) => <polygon points={`${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}`} fill={ORANGE} stroke="#9a3412" strokeWidth={1} />;
const PanelTitle = ({ x, y, t, c = INK }: { x: number; y: number; t: string; c?: string }) => <He x={x} y={y} size={12.5} bold color={c}>{t}</He>;

// ── pp-plant-cell: plasmodesma ──────────────────────────────────────────────
function Plasmodesma() {
  const wx1 = 190, wx2 = 270, cy = 140;
  return (
    <Svg h={300} label="פלסמודסמה בחתך אורכי: ממברנת התא רציפה בין שני התאים דרך התעלה בדופן. במרכז עובר הדסמוטובול — צינור ER דחוס שמחבר את ה-ER של שני התאים. בין הדסמוטובול לממברנה נשאר שרוול ציטופלזמי צר שדרכו עוברות מולקולות קטנות. בצוואר התעלה יכול להצטבר קאלוז שסוגר אותה. משמאל למטה: חתך רוחב">
      <rect x={20} y={40} width={170} height={200} fill={FILL.cyto} />
      <rect x={270} y={40} width={170} height={200} fill={FILL.cyto} />
      <He x={100} y={30} size={11.5} color={MUTED}>תא A</He>
      <He x={360} y={30} size={11.5} color={MUTED}>תא B</He>
      {/* cell wall with channel */}
      <rect x={wx1} y={40} width={wx2 - wx1} height={cy - 18 - 40} fill={WALL} stroke={WALL_EDGE} />
      <rect x={wx1} y={cy + 18} width={wx2 - wx1} height={240 - cy - 18} fill={WALL} stroke={WALL_EDGE} />
      <line x1={230} x2={230} y1={40} y2={cy - 18} stroke={WALL_EDGE} strokeWidth={1} {...dash} />
      <line x1={230} x2={230} y1={cy + 18} y2={240} stroke={WALL_EDGE} strokeWidth={1} {...dash} />
      {/* plasma membrane continuous through the channel */}
      <path d={`M${wx1 - 4} 40 L${wx1 - 4} ${cy - 22} Q${wx1 - 4} ${cy - 14} ${wx1 + 8} ${cy - 14} L${wx2 - 8} ${cy - 14} Q${wx2 + 4} ${cy - 14} ${wx2 + 4} ${cy - 22} L${wx2 + 4} 40`} fill="none" stroke={BLUE} strokeWidth={2.4} />
      <path d={`M${wx1 - 4} 240 L${wx1 - 4} ${cy + 22} Q${wx1 - 4} ${cy + 14} ${wx1 + 8} ${cy + 14} L${wx2 - 8} ${cy + 14} Q${wx2 + 4} ${cy + 14} ${wx2 + 4} ${cy + 22} L${wx2 + 4} 240`} fill="none" stroke={BLUE} strokeWidth={2.4} />
      {/* callose collars at the necks */}
      {[wx1 + 6, wx2 - 6].map((x) => <g key={x}><ellipse cx={x} cy={cy - 20} rx={6} ry={4} fill="#fde68a" stroke="#b45309" /><ellipse cx={x} cy={cy + 20} rx={6} ry={4} fill="#fde68a" stroke="#b45309" /></g>)}
      {/* ER and desmotubule */}
      <path d={`M60 ${cy - 30} Q120 ${cy - 30} 150 ${cy - 4} L${wx2 + 40} ${cy - 4} Q340 ${cy - 30} 400 ${cy - 30}`} fill="none" stroke={TEAL} strokeWidth={2} />
      <path d={`M60 ${cy + 30} Q120 ${cy + 30} 150 ${cy + 4} L${wx2 + 40} ${cy + 4} Q340 ${cy + 30} 400 ${cy + 30}`} fill="none" stroke={TEAL} strokeWidth={2} />
      <rect x={150} y={cy - 4} width={wx2 + 40 - 150} height={8} fill={FILL.teal} />
      {/* small molecules moving through the sleeve */}
      {[205, 225, 245].map((x) => <circle key={x} cx={x} cy={cy - 9} r={2.6} fill={ORANGE} />)}
      {/* labels */}
      <He x={230} y={262} size={11} color={WALL_EDGE}>דופן</He>
      <He x={110} y={256} size={10.5} color={BLUE}>ממברנת התא — רציפה</He>
      <La x={420} y={190} size={10.5} color={TEAL}>ER</La>
      <line x1={330} y1={cy + 6} x2={360} y2={cy + 50} stroke={TEAL} strokeWidth={1} />
      <He x={366} y={cy + 64} size={10.5} color={TEAL}>דסמוטובול (ER דחוס)</He>
      <line x1={250} y1={cy - 10} x2={330} y2={84} stroke={ORANGE} strokeWidth={1} />
      <He x={360} y={66} size={10.5} color={ORANGE}>שרוול ציטופלזמי:</He>
      <He x={360} y={80} size={10} color={ORANGE}>מולקולות עד כ-1 kDa</He>
      <line x1={wx1 + 6} y1={cy + 24} x2={150} y2={200} stroke="#b45309" strokeWidth={1} />
      <He x={120} y={214} size={10.5} color="#b45309">קאלוז בצוואר — סוגר</He>
      {/* cross-section */}
      <g transform="translate(420 268)">
        <circle r={22} fill={WALL} stroke={WALL_EDGE} />
        <circle r={14} fill={FILL.cyto} stroke={BLUE} strokeWidth={2} />
        <circle r={5} fill={FILL.teal} stroke={TEAL} strokeWidth={1.5} />
      </g>
      <He x={386} y={290} size={10} color={MUTED} anchor="end">חתך רוחב</He>
    </Svg>
  );
}

// ── pp-research-tools: Ti plasmid and T-DNA ─────────────────────────────────
function TiPlasmid() {
  const Seg = ({ x, w, fill, label, c = INK }: { x: number; w: number; fill: string; label: string; c?: string }) => (
    <g><rect x={x} y={0} width={w} height={20} fill={fill} stroke={MUTED} /><He x={x + w / 2} y={36} size={9.5} color={c}>{label}</He></g>
  );
  return (
    <Svg h={330} label="העברת T-DNA מאגרובקטריום: בחיידק, פלסמיד Ti עם גני vir ואזור T-DNA בין הגבול השמאלי לימני. ב-T-DNA הטבעי — גנים לייצור אוקסין, ציטוקינין ואופינים; ב-T-DNA המהונדס — הגן הנחקר וגן ברירה. ה-T-DNA מועבר לתא הצמח ומשתלב בכרומוזום שלו במקום אקראי">
      <rect x={300} y={20} width={160} height={110} rx={50} fill="#f1f5f9" stroke={MUTED} strokeWidth={1.6} />
      <He x={380} y={146} size={11} bold color={MUTED}>אגרובקטריום</He>
      <circle cx={360} cy={75} r={30} fill="none" stroke={BLUE} strokeWidth={4} />
      <path d="M 334 60 A 30 30 0 0 1 352 46" fill="none" stroke={RED} strokeWidth={7} />
      <path d="M 384 92 A 30 30 0 0 1 362 105" fill="none" stroke={PURPLE} strokeWidth={7} />
      <La x={294} y={44} size={10} color={RED} anchor="end">T-DNA</La>
      <La x={396} y={118} size={10} color={PURPLE} anchor="start">vir</La>
      <He x={360} y={80} size={10} color={BLUE}>Ti</He>
      <path d="M420 50 q 14 10 0 20 q -14 10 0 20" fill="none" stroke={MUTED} strokeWidth={1.4} />
      <He x={454} y={40} size={9.5} color={MUTED} anchor="end">כרומוזום</He>
      {/* wild type */}
      <He x={140} y={30} size={11.5} bold>T-DNA טבעי</He>
      <g transform="translate(20 42)">
        <Seg x={0} w={16} fill={FILL.yellow} label="LB" />
        <Seg x={16} w={70} fill={FILL.red} label="אוקסין" c={RED} />
        <Seg x={86} w={70} fill={FILL.red} label="ציטוקינין" c={RED} />
        <Seg x={156} w={70} fill={FILL.orange} label="אופינים" c={ORANGE} />
        <Seg x={226} w={16} fill={FILL.yellow} label="RB" />
      </g>
      <He x={140} y={102} size={10} color={RED}>גידול (עפצי השורש) ומזון לחיידק</He>
      <He x={140} y={140} size={11.5} bold>T-DNA מהונדס</He>
      <g transform="translate(20 152)">
        <Seg x={0} w={16} fill={FILL.yellow} label="LB" />
        <Seg x={16} w={113} fill={FILL.green} label="הגן הנחקר" c={GREEN} />
        <Seg x={129} w={97} fill={FILL.blue} label="גן ברירה" c={BLUE} />
        <Seg x={226} w={16} fill={FILL.yellow} label="RB" />
      </g>
      {/* transfer to plant cell */}
      <path d="M330 120 C 300 190, 300 220, 250 250" fill="none" stroke={PURPLE} strokeWidth={2} markerEnd="url(#bfArrow)" />
      <He x={358} y={200} size={10} color={PURPLE}>גני vir מופעלים בפצע</He>
      <He x={358} y={215} size={10} color={PURPLE}>(פנולים) ומעבירים גדיל T-DNA</He>
      <rect x={20} y={232} width={440} height={86} rx={16} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <ellipse cx={160} cy={276} rx={120} ry={34} fill={FILL.nuc} stroke={PURPLE} strokeWidth={1.3} />
      <line x1={60} x2={260} y1={276} y2={276} stroke={INK} strokeWidth={3} />
      <rect x={140} y={270} width={40} height={12} fill={FILL.green} stroke={GREEN} />
      <He x={160} y={302} size={10} color={GREEN}>T-DNA משולב — מקום אקראי</He>
      <He x={380} y={262} size={11} bold color={GREEN}>תא הצמח</He>
      <He x={380} y={280} size={10} color={MUTED}>הצמח מבטא את</He>
      <He x={380} y={295} size={10} color={MUTED}>הגנים שבין הגבולות</He>
    </Svg>
  );
}

// ── pp-water-cells: a cell in three solutions ───────────────────────────────
function CellWaterPotential() {
  const Cell = ({ x, y, state }: { x: number; y: number; state: "flaccid" | "turgid" | "plasmolyzed" }) => {
    const pw = state === "plasmolyzed" ? 0.62 : state === "turgid" ? 1 : 0.95;
    return (
      <g>
        <rect x={x - 44} y={y - 30} width={88} height={60} rx={6} fill="none" stroke={WALL_EDGE} strokeWidth={4} />
        <rect x={x - 40 * pw} y={y - 26 * pw} width={80 * pw} height={52 * pw} rx={state === "plasmolyzed" ? 18 : 5} fill={FILL.cyto} stroke={BLUE} strokeWidth={1.6} />
        <ellipse cx={x} cy={y} rx={28 * pw} ry={16 * pw} fill={FILL.sky} stroke={BLUE} strokeWidth={1} />
      </g>
    );
  };
  return (
    <Svg h={340} label="תא צמחי רפוי עם פוטנציאל אוסמוטי של כ-−0.73 MPa מוכנס לשלוש תמיסות: במים טהורים הוא קולט מים עד שהטורגור מאזן את ה-Ψs; בתמיסה של −0.24 MPa הוא קולט פחות מים ומגיע לטורגור נמוך יותר; בתמיסה של −1.2 MPa הוא מאבד מים ועובר פלסמוליזה — הפרוטופלסט מתנתק מהדופן">
      <He x={240} y={24} size={12.5} bold>תא רפוי</He>
      <Cell x={240} y={70} state="flaccid" />
      <La x={240} y={124} size={10.5}>Ψs = −0.73   Ψp = 0   Ψw = −0.73</La>
      {[90, 240, 390].map((x) => <Arrow key={x} x1={240} y1={134} x2={x} y2={168} color={MUTED} />)}
      {([
        [90, "מים טהורים", "Ψw = 0", "turgid", "מים נכנסים", "Ψp ≈ +0.73", BLUE],
        [240, "תמיסה", "Ψw = −0.24", "turgid", "מים נכנסים (פחות)", "Ψp ≈ +0.49", BLUE],
        [390, "תמיסה מרוכזת", "Ψw = −1.2", "plasmolyzed", "מים יוצאים", "פלסמוליזה, Ψp = 0", RED],
      ] as const).map(([x, t, w, st, flow, res, c]) => (
        <g key={x}>
          <rect x={x - 66} y={176} width={132} height={110} rx={10} fill={x === 90 ? "#f0f9ff" : x === 240 ? "#eef2ff" : "#ede9fe"} stroke={LINE_GRAY} />
          <He x={x} y={194} size={11} bold>{t}</He>
          <La x={x} y={210} size={10.5} color={MUTED}>{w}</La>
          <Cell x={x} y={250} state={st} />
          <He x={x} y={306} size={10.5} color={c}>{flow}</He>
          <La x={x} y={324} size={10.5} bold color={c}>{res}</La>
        </g>
      ))}
    </Svg>
  );
}

// ── pp-water-balance: guard cells and the ion fluxes of opening ─────────────
function GuardCellOpening() {
  const Pair = ({ x, open }: { x: number; open: boolean }) => {
    // Kidney-shaped guard cells joined at the tips; when turgid the inner (pore) walls bow apart.
    const b = open ? 16 : 0, w = 34;
    const cell = (side: -1 | 1) => `M${x} 50 C ${x + side * (w + 8)} 58, ${x + side * (w + 8)} 162, ${x} 170 C ${x + side * b} 140, ${x + side * b} 80, ${x} 50 Z`;
    const spokes = (side: -1 | 1) => [-0.8, -0.45, -0.1, 0.25, 0.6].map((t, k) => {
      const yy = 110 + t * 50, inner = x + side * b * (1 - t * t) * 0.85;
      return <line key={k} x1={inner + side * 2} y1={yy} x2={x + side * (w - 2 - Math.abs(t) * 10)} y2={110 + t * 56} stroke={WALL_EDGE} strokeWidth={0.9} />;
    });
    return (
      <g>
        <path d={cell(-1)} fill={FILL.green} stroke={GREEN} strokeWidth={1.5} />
        <path d={cell(1)} fill={FILL.green} stroke={GREEN} strokeWidth={1.5} />
        {spokes(-1)}{spokes(1)}
        <path d={`M${x} 56 C ${x - b} 84, ${x - b} 136, ${x} 164`} fill="none" stroke={WALL_EDGE} strokeWidth={3} />
        <path d={`M${x} 56 C ${x + b} 84, ${x + b} 136, ${x} 164`} fill="none" stroke={WALL_EDGE} strokeWidth={3} />
      </g>
    );
  };
  return (
    <Svg h={330} label="פתיחת פיונית: משמאל, זוג תאי שמירה סגורים ופתוחים, עם מיקרופיברילי תאית רדיאליים שיוצאים מהפתח ודופן עבה בצד הפתח. מימין, היונים בתא שמירה בפתיחה: אור כחול מפעיל את הפוטוטרופין ואת משאבת הפרוטונים; ההיפרפולריזציה פותחת תעלות K+; Cl- נכנס ומלאט נבנה מעמילן; מים נכנסים והטורגור עולה. ABA הופך את התהליך">
      <He x={60} y={30} size={11.5} bold>סגורה</He>
      <He x={150} y={30} size={11.5} bold>פתוחה</He>
      <Pair x={60} open={false} />
      <Pair x={150} open={true} />
      <He x={105} y={196} size={10} color={WALL_EDGE}>תאית רדיאלית, דופן עבה בצד הפתח</He>
      <He x={105} y={212} size={10} color={MUTED}>← התאים מתכופפים החוצה</He>
      {/* ion flux cell */}
      <rect x={250} y={40} width={210} height={180} rx={30} fill={FILL.green} stroke={GREEN} strokeWidth={2} />
      <ellipse cx={355} cy={130} rx={58} ry={40} fill={FILL.sky} stroke={BLUE} strokeWidth={1} />
      <He x={355} y={134} size={10.5} color={BLUE}>ואקואולה</He>
      <He x={355} y={34} size={11.5} bold color={GREEN}>תא שמירה בפתיחה</He>
      {/* pump */}
      <circle cx={250} cy={80} r={9} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <La x={264} y={84} size={10} color={PURPLE} anchor="start">H⁺-ATPase</La>
      <Arrow x1={242} y1={80} x2={220} y2={80} color={PURPLE} />
      <La x={216} y={84} size={11} bold color={PURPLE} anchor="end">H⁺</La>
      <He x={380} y={62} size={9.5} color={BLUE}>אור כחול ← פוטוטרופין</He>
      <Arrow x1={330} y1={66} x2={262} y2={78} color={BLUE} />
      {/* K+ channel */}
      <rect x={244} y={118} width={12} height={20} rx={3} fill={FILL.yellow} stroke={ORANGE} />
      <Arrow x1={220} y1={128} x2={242} y2={128} color={ORANGE} />
      <La x={216} y={132} size={11} bold color={ORANGE} anchor="end">K⁺</La>
      <Arrow x1={220} y1={168} x2={250} y2={168} color={TEAL} />
      <La x={216} y={172} size={11} bold color={TEAL} anchor="end">Cl⁻</La>
      <He x={370} y={196} size={10} color={TEAL}>מלאט ← מעמילן</He>
      <Arrow x1={300} y1={180} x2={318} y2={160} color={ORANGE} />
      <Arrow x1={300} y1={130} x2={318} y2={130} color={ORANGE} />
      {/* water */}
      <path d="M440 60 C 470 90, 470 160, 440 190" fill="none" stroke={BLUE} strokeWidth={2.4} markerEnd="url(#bfArrow)" />
      <He x={470} y={238} size={10} color={BLUE} anchor="end">Ψs יורד ← מים נכנסים ← טורגור</He>
      {/* steps strip */}
      <rect x={20} y={252} width={440} height={66} rx={10} fill="#f8fafc" stroke={LINE_GRAY} />
      <He x={240} y={274} size={10.5}>1. משאבת פרוטונים ← היפרפולריזציה   2. תעלות K⁺ פנימה נפתחות</He>
      <He x={240} y={292} size={10.5}>3. Cl⁻ נכנס ומלאט נבנה   4. מים נכנסים ← הפיונית נפתחת</He>
      <He x={240} y={310} size={10.5} color={RED}>ABA הופך את התהליך: אניונים ו-K⁺ יוצאים ← סגירה</He>
    </Svg>
  );
}

// ── pp-cell-growth: acid growth ─────────────────────────────────────────────
function AcidGrowth() {
  const fib = [80, 120, 160];
  return (
    <Svg h={320} label="גדילה חומצית: אוקסין מפעיל את משאבת הפרוטונים בממברנת התא, הפרוטונים מחמיצים את הדופן ל-pH 4.5–5, ואקספנסינים פעילים ב-pH הזה מחלישים את קשרי המימן בין שרשרות הקסילוגלוקן למיקרופיברילי התאית. תחת לחץ הטורגור המיקרופיברילים מחליקים, והדופן נמתחת">
      <rect x={20} y={56} width={440} height={140} fill={WALL} stroke={WALL_EDGE} />
      <He x={450} y={70} size={10.5} bold color={WALL_EDGE} anchor="end">דופן (pH 4.5–5)</He>
      {fib.map((y) => <rect key={y} x={30} y={y - 6} width={420} height={12} rx={6} fill="#fafaf9" stroke={MUTED} strokeWidth={1.2} />)}
      <He x={86} y={fib[0] - 12} size={10} color={MUTED}>מיקרופיבריל תאית</He>
      {/* xyloglucan tethers */}
      {[[110, 0], [210, 0], [330, 0], [160, 1], [280, 1], [400, 1]].map(([x, r], i) => {
        const y1 = fib[r] + 6, y2 = fib[r + 1] - 6;
        return <path key={i} d={`M${x} ${y1} C ${x + 10} ${(y1 + y2) / 2 - 6}, ${x - 10} ${(y1 + y2) / 2 + 6}, ${x + 4} ${y2}`} fill="none" stroke={GREEN} strokeWidth={2} />;
      })}
      <He x={380} y={104} size={10} color={GREEN}>קסילוגלוקן</He>
      {/* expansins at junctions */}
      {[[214, 108], [284, 148], [114, 108]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={8} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} /><He x={x - 44} y={y + 4} size={9.5} color={PURPLE}>{i === 2 ? "אקספנסין" : ""}</He></g>)}
      {/* H+ in wall */}
      {[60, 140, 250, 360, 430].map((x, i) => <La key={i} x={x} y={188} size={10.5} bold color={RED}>H⁺</La>)}
      {/* membrane and pump */}
      <Membrane x1={20} x2={460} y={208} />
      <rect x={20} y={216} width={440} height={56} fill={FILL.cyto} />
      <rect x={196} y={200} width={28} height={16} rx={4} fill={FILL.purple} stroke={PURPLE} />
      <Arrow x1={210} y1={226} x2={210} y2={190} color={RED} />
      <La x={262} y={234} size={10.5} color={PURPLE} anchor="start">H⁺-ATPase</La>
      <Hormone x={150} y={248} />
      <He x={128} y={252} size={10.5} color={ORANGE} anchor="end">אוקסין</He>
      <Arrow x1={160} y1={244} x2={196} y2={220} color={ORANGE} />
      <He x={330} y={252} size={10.5} color={MUTED}>ציטופלזמה</He>
      {/* turgor and extension */}
      <Arrow x1={240} y1={270} x2={240} y2={230} color={BLUE} width={2.6} />
      <He x={290} y={286} size={10.5} color={BLUE}>לחץ טורגור</He>
      <path d="M30 40 L450 40" stroke={INK} strokeWidth={1.8} markerEnd="url(#bfArrow)" markerStart="url(#bfArrow)" />
      <He x={240} y={32} size={10.5}>המיקרופיברילים מחליקים ← הדופן נמתחת</He>
      <He x={240} y={310} size={10} color={MUTED}>סכמטי — לא בקנה מידה</He>
    </Svg>
  );
}

// ── pp-development: the shoot apical meristem ───────────────────────────────
function ShootMeristem() {
  return (
    <Svg h={330} label="המריסטמה של הנבט: בראש — האזור המרכזי עם תאי הגזע; סביבו — האזור ההיקפי שממנו נוצרים עלים; מתחת — אזור הצלע. מתחת לתאי הגזע נמצא מרכז הארגון שמבטא WUS. WUS נע לתאי הגזע ומפעיל את CLV3; CLV3 נקשר לקולטן CLV1 ומדכא את WUS — משוב שלילי ששומר על גודל קבוע">
      <path d="M40 300 L40 170 C 40 60, 340 60, 340 170 L340 300" fill={FILL.green} stroke={GREEN} strokeWidth={2} />
      <path d="M50 170 C 50 74, 330 74, 330 170" fill="none" stroke={GREEN} strokeWidth={1} {...dash} />
      <La x={262} y={86} size={10} color={GREEN} anchor="start">L1, L2</La>
      {/* primordia */}
      <ellipse cx={36} cy={180} rx={22} ry={34} fill="#bbf7d0" stroke={GREEN} transform="rotate(-25 36 180)" />
      <ellipse cx={344} cy={180} rx={22} ry={34} fill="#bbf7d0" stroke={GREEN} transform="rotate(25 344 180)" />
      <line x1={354} y1={206} x2={392} y2={252} stroke={GREEN} strokeWidth={1} />
      <He x={410} y={266} size={10} color={GREEN}>ראשית עלה</He>
      {/* zones */}
      <ellipse cx={190} cy={110} rx={52} ry={26} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.4} />
      <He x={190} y={108} size={10.5} bold color={ORANGE}>אזור מרכזי</He>
      <He x={190} y={122} size={9.5} color={ORANGE}>תאי גזע · CLV3</He>
      <ellipse cx={190} cy={168} rx={38} ry={20} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.4} />
      <He x={190} y={166} size={10} bold color={PURPLE}>מרכז הארגון</He>
      <La x={190} y={180} size={10} color={PURPLE}>WUS</La>
      <He x={90} y={200} size={10} color={GREEN}>אזור היקפי</He>
      <He x={290} y={150} size={10} color={GREEN}>אזור היקפי</He>
      <rect x={150} y={210} width={80} height={80} rx={8} fill="#d1fae5" stroke={GREEN} {...dash} />
      <He x={190} y={256} size={10} color={GREEN}>אזור הצלע</He>
      {/* loop */}
      <Arrow x1={212} y1={152} x2={212} y2={128} color={PURPLE} width={2.4} />
      <path d="M150 116 C 110 130, 110 160, 148 170" fill="none" stroke={RED} strokeWidth={2} markerEnd="url(#ppInhib)" />
      <La x={112} y={142} size={9.5} bold color={RED} anchor="end">CLV3→CLV1</La>
      {/* side panel */}
      <rect x={360} y={70} width={110} height={170} rx={10} fill="#f8fafc" stroke={LINE_GRAY} />
      <He x={415} y={90} size={11} bold>הלולאה</He>
      <La x={415} y={112} size={11} bold color={PURPLE}>WUS</La>
      <Arrow x1={415} y1={118} x2={415} y2={138} color={PURPLE} />
      <He x={415} y={152} size={10.5} color={ORANGE}>תאי גזע</He>
      <Arrow x1={415} y1={158} x2={415} y2={176} color={ORANGE} />
      <La x={415} y={190} size={11} bold color={ORANGE}>CLV3</La>
      <path d="M440 186 C 470 160, 470 120, 440 110" fill="none" stroke={RED} strokeWidth={2} markerEnd="url(#ppInhib)" />
      <He x={415} y={214} size={9.5} color={MUTED}>יותר תאי גזע ←</He>
      <He x={415} y={228} size={9.5} color={MUTED}>פחות WUS</He>
      <He x={190} y={318} size={10} color={MUTED}>סכמטי — חתך אורכי דרך קצה הנבט</He>
    </Svg>
  );
}

// ── pp-auxin: chemiosmotic polar transport ──────────────────────────────────
function AuxinChemiosmotic() {
  const Cell = ({ y }: { y: number }) => (
    <g>
      <rect x={120} y={y} width={240} height={110} rx={10} fill={FILL.cyto} stroke={BLUE} strokeWidth={2} />
      <La x={330} y={y + 22} size={10} color={MUTED}>pH 7.2</La>
      {/* PIN at basal side */}
      {[170, 240, 310].map((x) => <rect key={x} x={x - 9} y={y + 104} width={18} height={12} rx={3} fill="#fecaca" stroke={RED} />)}
      {/* AUX1 at apical side */}
      <rect x={150} y={y - 6} width={16} height={12} rx={3} fill={FILL.teal} stroke={TEAL} />
      <La x={240} y={y + 62} size={11.5} bold color={ORANGE}>IAA⁻</La>
      <He x={240} y={y + 80} size={9.5} color={MUTED}>כלוא — טעון</He>
    </g>
  );
  return (
    <Svg h={340} label="המודל הכימיאוסמוטי של הובלה קוטבית של אוקסין: בדופן (pH 5.5) חלק מהאוקסין לא טעון (IAAH) ונכנס בדיפוזיה, ו-AUX1 מכניס IAA- יחד עם שני פרוטונים. בציטוזול (pH 7.2) האוקסין טעון וכלוא. הוא יוצא רק דרך נשאי PIN שנמצאים בצד התחתון של התא, ולכן הזרימה היא בכיוון אחד — מהקצה לבסיס">
      <rect x={100} y={20} width={280} height={300} fill={WALL} opacity={0.45} />
      <La x={110} y={36} size={10} color={WALL_EDGE} anchor="start">pH 5.5</La>
      <He x={364} y={36} size={10} color={WALL_EDGE} anchor="end">דופן</He>
      <Cell y={50} />
      <Cell y={190} />
      {/* entry at top */}
      <La x={205} y={36} size={10.5} color={ORANGE}>IAAH</La>
      <Arrow x1={210} y1={40} x2={220} y2={70} color={ORANGE} dashed />
      <La x={150} y={20} size={10} color={TEAL}>IAA⁻ + 2H⁺</La>
      <Arrow x1={158} y1={26} x2={158} y2={46} color={TEAL} />
      {/* exit at bottom */}
      {[170, 240, 310].map((x) => <Arrow key={x} x1={x} y1={164} x2={x} y2={186} color={RED} />)}
      {[170, 240, 310].map((x) => <Arrow key={`b${x}`} x1={x} y1={304} x2={x} y2={326} color={RED} />)}
      {/* legend */}
      <rect x={392} y={70} width={14} height={10} rx={3} fill={FILL.teal} stroke={TEAL} />
      <La x={412} y={80} size={10.5} color={TEAL} anchor="start">AUX1</La>
      <rect x={392} y={96} width={14} height={10} rx={3} fill="#fecaca" stroke={RED} />
      <La x={412} y={106} size={10.5} color={RED} anchor="start">PIN</La>
      <He x={470} y={138} size={10} color={MUTED} anchor="end">PIN רק בצד</He>
      <He x={470} y={152} size={10} color={MUTED} anchor="end">התחתון של התא</He>
      <Arrow x1={60} y1={60} x2={60} y2={300} color={INK} width={2.6} />
      <He x={44} y={190} size={10.5} bold rotate={-90}>כיוון ההובלה: קצה ← בסיס</He>
    </Svg>
  );
}

// ── pp-auxin: TIR1–Aux/IAA–ARF ──────────────────────────────────────────────
function AuxinSignaling() {
  const Panel = ({ x0, on }: { x0: number; on: boolean }) => (
    <g>
      <rect x={x0} y={30} width={225} height={250} rx={12} fill={FILL.nuc} stroke={PURPLE} strokeWidth={1.2} />
      <PanelTitle x={x0 + 112} y={22} t={on ? "יש אוקסין" : "אין אוקסין"} c={on ? GREEN : RED} />
      <Dna x1={x0 + 10} x2={x0 + 215} y={232} site={[x0 + 40, 40, "AuxRE"]} />
      <Prot x={x0 + 60} y={212} w={50} label="ARF" c={GREEN} fill={FILL.green} />
      {!on && <>
        <Prot x={x0 + 60} y={184} w={66} label="Aux/IAA" c={RED} fill={FILL.red} size={10.5} />
        <Prot x={x0 + 60} y={156} w={46} label="TPL" c={MUTED} fill={FILL.gray} size={10} />
        <He x={x0 + 160} y={210} size={10.5} bold color={RED}>הגן כבוי</He>
        <Prot x={x0 + 160} y={90} w={56} label="TIR1" c={BLUE} fill={FILL.blue} />
        <He x={x0 + 160} y={122} size={9.5} color={MUTED}>(SCF, לא קשור)</He>
      </>}
      {on && <>
        <Prot x={x0 + 70} y={82} w={56} label="TIR1" c={BLUE} fill={FILL.blue} />
        <Hormone x={x0 + 70} y={104} r={7} />
        <Prot x={x0 + 70} y={126} w={66} label="Aux/IAA" c={RED} fill={FILL.red} size={10.5} />
        <Ub x={x0 + 108} y={126} />
        <Arrow x1={x0 + 150} y1={126} x2={x0 + 172} y2={126} color={MUTED} />
        <Proteasome x={x0 + 192} y={128} />
        <He x={x0 + 30} y={108} size={9.5} color={ORANGE} anchor="end">אוקסין</He>
        <Arrow x1={x0 + 100} y1={214} x2={x0 + 160} y2={214} color={GREEN} width={2.4} />
        <He x={x0 + 170} y={196} size={10.5} bold color={GREEN}>שעתוק</He>
      </>}
    </g>
  );
  return (
    <Svg h={300} label="מסלול האיתות של אוקסין בגרעין. בלי אוקסין: Aux/IAA קשור לגורם השעתוק ARF שעל רצף AuxRE, ומגייס את הקו-מדכא TPL — הגן כבוי. עם אוקסין: האוקסין מחבר את הקולטן TIR1 (חלק מאנזים SCF) ל-Aux/IAA כמו דבק, Aux/IAA מסומן ביוביקוויטין ומפורק בפרוטאזום, ו-ARF מפעיל את הגנים">
      <Panel x0={245} on={false} />
      <Panel x0={10} on={true} />
      <He x={240} y={294} size={10} color={MUTED}>החלבונים המשתנים: מדכא (אדום) · קולטן (כחול) · גורם שעתוק (ירוק)</He>
    </Svg>
  );
}

// ── pp-cytokinin-gibberellin: cytokinin phosphorelay ────────────────────────
function CytokininRelay() {
  return (
    <Svg h={320} label="מסלול הממסר הזרחני של ציטוקינין: ציטוקינין נקשר לקולטן AHK בממברנת ה-ER; הקולטן מזרחן את עצמו על היסטידין ואחר כך על אספרטט; הזרחן עובר לחלבון AHP שנכנס לגרעין ומעביר אותו ל-ARR מסוג B — גורם שעתוק שמפעיל את הגנים, ובהם הגנים של ARR מסוג A, שמדכאים את המסלול">
      <rect x={20} y={20} width={440} height={60} fill={FILL.sky} opacity={0.6} />
      <He x={450} y={40} size={10} color={MUTED} anchor="end">לומן ה-ER</He>
      <Membrane x1={20} x2={460} y={86} />
      <rect x={20} y={92} width={440} height={80} fill={FILL.cyto} />
      <He x={450} y={164} size={10} color={MUTED} anchor="end">ציטוזול</He>
      {/* receptor */}
      <rect x={110} y={38} width={44} height={42} rx={12} fill={FILL.blue} stroke={BLUE} strokeWidth={1.5} />
      <Hormone x={132} y={56} />
      <La x={170} y={44} size={10} color={ORANGE} anchor="start">ציטוקינין</La>
      <rect x={124} y={80} width={16} height={14} fill={FILL.blue} stroke={BLUE} />
      <rect x={102} y={94} width={60} height={60} rx={12} fill={FILL.blue} stroke={BLUE} strokeWidth={1.5} />
      <La x={132} y={112} size={11} bold color={BLUE}>AHK</La>
      <La x={116} y={140} size={10} color={PURPLE}>His</La>
      <La x={148} y={140} size={10} color={PURPLE}>Asp</La>
      <path d="M120 128 C 126 120, 140 120, 146 128" fill="none" stroke={PURPLE} strokeWidth={1.4} markerEnd="url(#bfArrowS)" />
      {/* AHP */}
      <Prot x={240} y={140} w={46} label="AHP" c={PURPLE} fill={FILL.purple} />
      <Arrow x1={164} y1={138} x2={214} y2={140} color={PURPLE} />
      <He x={232} y={182} size={10} color={PURPLE} anchor="end">נכנס לגרעין</He>
      {/* nucleus */}
      <rect x={20} y={192} width={440} height={118} rx={14} fill={FILL.nuc} stroke={PURPLE} strokeWidth={1.2} />
      <path d="M240 156 C 240 210, 200 230, 156 240" fill="none" stroke={PURPLE} strokeWidth={2.4} markerEnd="url(#bfArrowS)" />
      <He x={450} y={212} size={10} color={MUTED} anchor="end">גרעין</He>
      <Dna x1={40} x2={440} y={280} site={[90, 50, "מקדם"]} />
      <Prot x={115} y={252} w={72} label="ARR-B" c={GREEN} fill={FILL.green} />
      <Arrow x1={160} y1={264} x2={250} y2={264} color={GREEN} width={2.4} />
      <He x={302} y={258} size={10.5} bold color={GREEN}>גני תגובה</He>
      <Prot x={380} y={236} w={72} label="ARR-A" c={RED} fill={FILL.red} />
      <Arrow x1={320} y1={262} x2={360} y2={248} color={GREEN} />
      <Inhib x1={344} y1={226} x2={262} y2={150} />
      <He x={380} y={218} size={9.5} color={RED}>משוב שלילי</He>
    </Svg>
  );
}

// ── pp-cytokinin-gibberellin: GA–GID1–DELLA ─────────────────────────────────
function GaDella() {
  const Panel = ({ x0, on }: { x0: number; on: boolean }) => (
    <g>
      <rect x={x0} y={30} width={225} height={250} rx={12} fill={FILL.nuc} stroke={PURPLE} strokeWidth={1.2} />
      <PanelTitle x={x0 + 112} y={22} t={on ? "יש GA" : "אין GA"} c={on ? GREEN : RED} />
      <Dna x1={x0 + 10} x2={x0 + 215} y={232} site={[x0 + 40, 40, "גני גדילה"]} />
      <Prot x={x0 + 60} y={212} w={46} label="PIF" c={GREEN} fill={FILL.green} />
      {!on && <>
        <Prot x={x0 + 60} y={180} w={60} label="DELLA" c={RED} fill={FILL.red} size={10.5} />
        <Inhib x1={x0 + 94} y1={186} x2={x0 + 90} y2={208} />
        <He x={x0 + 160} y={210} size={10.5} bold color={RED}>גדילה מדוכאת</He>
        <Prot x={x0 + 160} y={90} w={50} label="GID1" c={BLUE} fill={FILL.blue} />
      </>}
      {on && <>
        <Prot x={x0 + 64} y={78} w={50} label="GID1" c={BLUE} fill={FILL.blue} />
        <Hormone x={x0 + 64} y={98} r={7} />
        <La x={x0 + 28} y={102} size={9.5} color={ORANGE} anchor="end">GA</La>
        <Prot x={x0 + 64} y={120} w={60} label="DELLA" c={RED} fill={FILL.red} size={10.5} />
        <Prot x={x0 + 140} y={78} w={54} label="SLY1" c={PURPLE} fill={FILL.purple} />
        <He x={x0 + 140} y={62} size={9.5} color={PURPLE}>SCF</He>
        <Ub x={x0 + 100} y={120} n={3} />
        <Arrow x1={x0 + 132} y1={124} x2={x0 + 168} y2={128} color={MUTED} />
        <Proteasome x={x0 + 190} y={130} />
        <Arrow x1={x0 + 90} y1={214} x2={x0 + 160} y2={214} color={GREEN} width={2.4} />
        <He x={x0 + 172} y={196} size={10.5} bold color={GREEN}>גדילה</He>
      </>}
    </g>
  );
  return (
    <Svg h={300} label="מסלול הגיברלין: בלי GA, חלבוני DELLA נקשרים לגורמי שעתוק כמו PIF ומדכאים גדילה. עם GA: GA נקשר לקולטן GID1, הקומפלקס נקשר ל-DELLA, חלבון ה-F-box ‏SLY1 (באנזים SCF) מסמן את DELLA ביוביקוויטין, DELLA מפורק בפרוטאזום, ו-PIF מפעיל את גני הגדילה">
      <Panel x0={245} on={false} />
      <Panel x0={10} on={true} />
      <He x={240} y={294} size={10} color={MUTED}>שחרור מדיכוי — כמו באוקסין, אבל הקולטן (GID1) נפרד מה-F-box (SLY1)</He>
    </Svg>
  );
}

// ── pp-aba-ethylene: ABA core pathway ───────────────────────────────────────
function AbaCore() {
  return (
    <Svg h={320} label="מסלול ABA: בלי ABA, הפוספטאזה PP2C קשורה לקינאזה SnRK2 ומסירה ממנה זרחן — אין תגובה. עם ABA: ABA נקשר לקולטן PYL, הקולטן נקשר ל-PP2C וחוסם אותה, SnRK2 מזרחנת את עצמה ונעשית פעילה, ומזרחנת את תעלת האניונים SLAC1 בממברנה (סגירת פיוניות) ואת גורמי השעתוק ABF בגרעין">
      <PanelTitle x={360} y={22} t="אין ABA" c={RED} />
      <rect x={250} y={32} width={220} height={130} rx={12} fill={FILL.cyto} stroke={LINE_GRAY} />
      <Prot x={320} y={80} w={56} label="PP2C" c={RED} fill={FILL.red} />
      <Prot x={400} y={80} w={60} label="SnRK2" c={PURPLE} fill="#fff" />
      <Inhib x1={350} y1={80} x2={368} y2={80} />
      <Prot x={320} y={130} w={50} label="PYL" c={BLUE} fill={FILL.blue} />
      <He x={400} y={128} size={10.5} bold color={RED}>לא פעילה</He>
      <PanelTitle x={120} y={22} t="יש ABA" c={GREEN} />
      <rect x={10} y={32} width={220} height={130} rx={12} fill={FILL.cyto} stroke={LINE_GRAY} />
      <Prot x={60} y={64} w={50} label="PYL" c={BLUE} fill={FILL.blue} />
      <Hormone x={60} y={84} />
      <La x={30} y={88} size={9.5} color={ORANGE} anchor="end">ABA</La>
      <Prot x={60} y={106} w={56} label="PP2C" c={RED} fill={FILL.red} />
      <Inhib x1={90} y1={84} x2={90} y2={98} c={BLUE} />
      <Prot x={160} y={84} w={60} label="SnRK2" c={PURPLE} fill={FILL.purple} />
      <La x={196} y={70} size={10} bold color={PURPLE}>P</La>
      <He x={214} y={110} size={10.5} bold color={GREEN}>פעילה</He>
      {/* targets */}
      <Membrane x1={10} x2={470} y={190} />
      <He x={466} y={182} size={9.5} color={MUTED} anchor="end">ממברנת התא (תא שמירה)</He>
      <rect x={136} y={178} width={20} height={24} rx={4} fill={FILL.yellow} stroke={ORANGE} />
      <La x={146} y={218} size={10} bold color={ORANGE}>SLAC1</La>
      <Arrow x1={160} y1={100} x2={148} y2={176} color={PURPLE} />
      <Arrow x1={146} y1={196} x2={146} y2={160} color={ORANGE} />
      <He x={330} y={236} size={10} color={ORANGE}>אניונים יוצאים ← דה-פולריזציה ← K⁺ יוצא ← סגירה</He>
      <rect x={10} y={248} width={460} height={64} rx={12} fill={FILL.nuc} stroke={PURPLE} strokeWidth={1.1} />
      <Dna x1={30} x2={300} y={290} site={[70, 50, "ABRE"]} />
      <Prot x={95} y={270} w={46} label="ABF" c={GREEN} fill={FILL.green} />
      <Arrow x1={182} y1={100} x2={110} y2={254} color={PURPLE} dashed />
      <He x={390} y={284} size={10} color={GREEN}>גני תגובה ליובש</He>
    </Svg>
  );
}

// ── pp-aba-ethylene: ethylene pathway ───────────────────────────────────────
function EthylenePathway() {
  const Panel = ({ x0, on }: { x0: number; on: boolean }) => (
    <g>
      <PanelTitle x={x0 + 112} y={22} t={on ? "יש אתילן" : "אין אתילן"} c={on ? GREEN : RED} />
      <rect x={x0} y={32} width={225} height={40} fill={FILL.sky} opacity={0.6} />
      <Membrane x1={x0} x2={x0 + 225} y={76} />
      <rect x={x0} y={82} width={225} height={86} fill={FILL.cyto} />
      <rect x={x0 + 30} y={46} width={28} height={36} rx={8} fill={on ? FILL.gray : FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <La x={x0 + 44} y={42} size={10} bold color={BLUE}>ETR1</La>
      {on && <circle cx={x0 + 44} cy={60} r={5} fill={ORANGE} />}
      <Prot x={x0 + 44} y={102} w={50} label="CTR1" c={PURPLE} fill={on ? "#fff" : FILL.purple} size={10.5} />
      <rect x={x0 + 140} y={58} width={22} height={30} rx={6} fill={FILL.green} stroke={GREEN} />
      <La x={x0 + 151} y={52} size={10} bold color={GREEN}>EIN2</La>
      <rect x={x0} y={176} width={225} height={104} rx={12} fill={FILL.nuc} stroke={PURPLE} strokeWidth={1.1} />
      <Dna x1={x0 + 10} x2={x0 + 215} y={256} />
      {!on && <>
        <Arrow x1={x0 + 70} y1={100} x2={x0 + 136} y2={84} color={PURPLE} />
        <La x={x0 + 110} y={104} size={9.5} bold color={PURPLE}>P</La>
        <Ub x={x0 + 166} y={102} n={3} />
        <He x={x0 + 160} y={130} size={9.5} color={RED}>EIN2 מפורק</He>
        <Prot x={x0 + 70} y={226} w={52} label="EIN3" c={GREEN} fill="#fff" size={10.5} />
        <Ub x={x0 + 100} y={226} n={3} />
        <He x={x0 + 160} y={210} size={10} bold color={RED}>אין תגובה</He>
      </>}
      {on && <>
        <He x={x0 + 44} y={136} size={9.5} color={MUTED}>כבוי</He>
        <rect x={x0 + 140} y={106} width={22} height={18} rx={5} fill={FILL.green} stroke={GREEN} />
        <La x={x0 + 186} y={120} size={9.5} color={GREEN}>EIN2-C</La>
        <Arrow x1={x0 + 151} y1={126} x2={x0 + 100} y2={212} color={GREEN} width={2.2} />
        <Prot x={x0 + 70} y={234} w={52} label="EIN3" c={GREEN} fill={FILL.green} size={10.5} />
        <Arrow x1={x0 + 100} y1={250} x2={x0 + 170} y2={250} color={GREEN} width={2.4} />
        <He x={x0 + 175} y={232} size={10.5} bold color={GREEN}>גני תגובה</He>
      </>}
    </g>
  );
  return (
    <Svg h={300} label="מסלול האתילן. בלי אתילן: הקולטן ETR1 בממברנת ה-ER פעיל ומפעיל את הקינאזה CTR1, שמזרחנת את EIN2 — EIN2 מפורק, ו-EIN3 בגרעין מפורק גם הוא; אין תגובה. עם אתילן: הקולטן מושבת, CTR1 כבוי, הקצה של EIN2 נחתך ונכנס לגרעין, EIN3 מיוצב ומפעיל את הגנים">
      <Panel x0={245} on={false} />
      <Panel x0={10} on={true} />
      <He x={240} y={294} size={10} color={MUTED}>הקולטנים הם מווסתים שליליים: פעילים כשאין אתילן</He>
    </Svg>
  );
}

// ── pp-light-reactions: the Z scheme ────────────────────────────────────────
function ZScheme() {
  const s = scale(70, 470, 300, 30, 0, 10, 1.3, -1.3);
  const y = (v: number) => s.sy(v);
  const pts: [string, number, number, string][] = [
    ["H₂O", 0.4, 0.82, TEAL], ["P680", 1.6, 1.1, ORANGE], ["P680*", 1.6, -0.6, ORANGE], ["Pheo", 2.4, -0.5, INK], ["QA", 3.1, -0.15, INK], ["QB", 3.6, -0.05, INK],
    ["PQ", 4.2, 0.05, INK], ["b₆f", 4.9, 0.3, PURPLE], ["PC", 5.6, 0.37, BLUE], ["P700", 6.4, 0.45, RED], ["P700*", 6.4, -1.2, RED], ["A0/A1", 7.1, -1.0, INK],
    ["FeS", 7.8, -0.6, INK], ["Fd", 8.3, -0.45, INK], ["FNR", 8.8, -0.35, INK], ["NADP⁺", 9.25, -0.32, GREEN],
  ];
  const at = (n: string) => pts.find((p) => p[0] === n)!;
  const P = (n: string) => ({ x: s.sx(at(n)[1]), y: y(at(n)[2]) });
  const chain = ["P680*", "Pheo", "QA", "QB", "PQ", "b₆f", "PC", "P700"];
  const chain2 = ["P700*", "A0/A1", "FeS", "Fd", "FNR", "NADP⁺"];
  return (
    <Svg h={330} label="סכמת Z: רכיבי שרשרת העברת האלקטרונים לפי פוטנציאל החיזור שלהם. אור מעורר את P680 ל-P680* (חץ אנכי), האלקטרון יורד דרך פאופיטין, QA, ‏QB, פלסטוקינון, ציטוכרום b6f ופלסטוציאנין אל P700; אור נוסף מעורר את P700 ל-P700*, והאלקטרון יורד דרך מקבלי PSI, פרדוקסין ו-FNR אל NADP+. מים מספקים אלקטרונים ל-P680">
      <line x1={70} y1={30} x2={70} y2={304} stroke={INK} strokeWidth={1.4} />
      {[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2].map((v) => <g key={v}><line x1={64} x2={70} y1={y(v)} y2={y(v)} stroke={INK} /><La x={60} y={y(v) + 4} size={9.5} anchor="end" color={MUTED}>{v.toFixed(1)}</La></g>)}
      <La x={30} y={22} size={10.5} bold>Em (V)</La>
      <He x={36} y={170} size={10} color={MUTED} rotate={-90}>מחזר חזק ↑</He>
      {/* light arrows */}
      <path d={`M${P("P680").x} ${P("P680").y} L${P("P680*").x} ${P("P680*").y + 10}`} stroke={ORANGE} strokeWidth={6} markerEnd="url(#bfArrowS)" />
      <path d={`M${P("P700").x} ${P("P700").y} L${P("P700*").x} ${P("P700*").y + 10}`} stroke={RED} strokeWidth={6} markerEnd="url(#bfArrowS)" />
      <He x={P("P680").x - 14} y={y(0.3)} size={10.5} bold color={ORANGE} anchor="end">אור (PSII)</He>
      <He x={P("P700").x - 14} y={y(-0.5)} size={10.5} bold color={RED} anchor="end">אור (PSI)</He>
      {/* electron path */}
      {chain.slice(0, -1).map((n, i) => { const a = P(n), b = P(chain[i + 1]); return <line key={n} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={MUTED} strokeWidth={1.6} markerEnd="url(#bfArrow)" />; })}
      {chain2.slice(0, -1).map((n, i) => { const a = P(n), b = P(chain2[i + 1]); return <line key={n} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={MUTED} strokeWidth={1.6} markerEnd="url(#bfArrow)" />; })}
      <line x1={P("H₂O").x} y1={P("H₂O").y} x2={P("P680").x - 6} y2={P("P680").y} stroke={TEAL} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      {pts.map(([n, , , c]) => { const p = P(n); return <g key={n}><circle cx={p.x} cy={p.y} r={4} fill={c} />{n !== "NADP⁺" && <La x={p.x + (n === "P680" || n === "P700" ? 0 : 6)} y={p.y + (n.endsWith("*") ? -8 : n === "P680" || n === "P700" ? 16 : -7)} size={10} bold={n.startsWith("P6") || n.startsWith("P7") || n === "NADP⁺" || n === "H₂O"} color={c} anchor={n === "P680" || n === "P700" ? "middle" : "start"}>{n}</La>}</g>; })}
      <La x={P("H₂O").x + 2} y={y(0.66)} size={9.5} color={TEAL} anchor="start">O₂</La>
      <La x={P("b₆f").x - 6} y={y(0.62)} size={9.5} color={PURPLE} anchor="end">H⁺ → lumen (Q cycle)</La>
      <La x={472} y={P("NADP⁺").y + 20} size={10} bold color={GREEN} anchor="end">NADP⁺ → NADPH</La>
      <He x={300} y={322} size={10} color={MUTED}>ערכי פוטנציאל בקירוב — סכמטי</He>
    </Svg>
  );
}

// ── pp-light-reactions: the thylakoid membrane ──────────────────────────────
function ThylakoidMembrane() {
  const Cx = ({ x, w, h = 70, label, c, fill }: { x: number; w: number; h?: number; label: string; c: string; fill: string }) => (
    <g><rect x={x - w / 2} y={150 - h / 2} width={w} height={h} rx={12} fill={fill} stroke={c} strokeWidth={1.6} /><La x={x} y={154} size={11} bold color={c}>{label}</La></g>
  );
  return (
    <Svg h={320} label="ממברנת התילקואיד: מערכת II מפרקת מים בצד הלומן ומעבירה אלקטרונים לפלסטוקינון; ציטוכרום b6f מעביר אותם לפלסטוציאנין בלומן ומשחרר פרוטונים ללומן; מערכת I מעבירה אותם לפרדוקסין בסטרומה, ו-FNR מחזר NADP+. הפרוטונים שהצטברו בלומן חוזרים לסטרומה דרך ATP סינתאז ומניעים ייצור ATP">
      <rect x={10} y={20} width={460} height={95} fill="#ecfdf5" />
      <He x={150} y={40} size={11} bold color={GREEN}>סטרומה (pH ≈ 8)</He>
      <rect x={10} y={185} width={460} height={95} fill="#fef2f2" />
      <He x={460} y={272} size={11} bold color={RED} anchor="end">לומן (pH ≈ 5–6)</He>
      <rect x={10} y={125} width={460} height={50} fill="#f8fafc" stroke={MUTED} />
      <Cx x={70} w={70} label="PSII" c={ORANGE} fill={FILL.orange} />
      <Cx x={200} w={64} label="b₆f" c={PURPLE} fill={FILL.purple} />
      <Cx x={310} w={70} label="PSI" c={RED} fill={FILL.red} />
      <Cx x={420} w={54} h={90} label="" c={TEAL} fill={FILL.teal} />
      <La x={408} y={154} size={11} bold color={TEAL}>ATP</La>
      <He x={408} y={174} size={9} color={TEAL}>סינתאז</He>
      {/* PQ */}
      <circle cx={136} cy={150} r={9} fill={FILL.yellow} stroke={ORANGE} /><La x={136} y={154} size={9} bold>PQ</La>
      <Arrow x1={106} y1={150} x2={126} y2={150} color={INK} />
      <Arrow x1={146} y1={150} x2={166} y2={150} color={INK} />
      {/* PC in lumen */}
      <circle cx={255} cy={205} r={10} fill={FILL.blue} stroke={BLUE} /><La x={255} y={209} size={9} bold color={BLUE}>PC</La>
      <Arrow x1={220} y1={186} x2={247} y2={198} color={INK} />
      <Arrow x1={264} y1={198} x2={290} y2={186} color={INK} />
      {/* Fd/FNR in stroma */}
      <circle cx={350} cy={96} r={10} fill={FILL.gray} stroke={MUTED} /><La x={350} y={100} size={9} bold>Fd</La>
      <Arrow x1={320} y1={114} x2={344} y2={104} color={INK} />
      <La x={350} y={76} size={10} bold color={GREEN}>NADP⁺ → NADPH</La>
      {/* water */}
      <La x={70} y={232} size={10.5} bold color={TEAL}>2H₂O → O₂ + 4H⁺</La>
      <Arrow x1={70} y1={220} x2={70} y2={186} color={TEAL} />
      {/* light */}
      {[70, 310].map((x) => <path key={x} d={`M${x - 26} 30 l8 10 l-6 2 l10 14`} fill="none" stroke="#ca8a04" strokeWidth={2.2} markerEnd="url(#bfArrowS)" />)}
      <He x={70} y={30} size={10} color="#ca8a04" anchor="end">אור</He>
      {/* protons */}
      <Arrow x1={226} y1={110} x2={226} y2={240} color={RED} dashed />
      <La x={236} y={246} size={10.5} bold color={RED} anchor="start">H⁺</La>
      <Arrow x1={438} y1={240} x2={438} y2={60} color={TEAL} width={2.4} />
      <La x={420} y={50} size={10.5} bold color={TEAL}>ADP + Pi → ATP</La>
      <He x={240} y={304} size={10} color={MUTED}>החיצים השחורים — מסלול האלקטרון; האדומים — פרוטונים</He>
    </Svg>
  );
}

// ── pp-calvin: the Calvin–Benson cycle ──────────────────────────────────────
function CalvinCycle() {
  const cx = 230, cy = 160, r = 105;
  const at = (deg: number) => ({ x: cx + r * Math.cos((deg * Math.PI) / 180), y: cy + r * Math.sin((deg * Math.PI) / 180) });
  const Node = ({ deg, t, sub, c }: { deg: number; t: string; sub: string; c: string }) => { const p = at(deg); return <g><rect x={p.x - 52} y={p.y - 18} width={104} height={36} rx={10} fill="#fff" stroke={c} strokeWidth={1.8} /><La x={p.x} y={p.y - 2} size={11} bold color={c}>{t}</La><He x={p.x} y={p.y + 12} size={9.5} color={MUTED}>{sub}</He></g>; };
  const Arc = ({ a, b, c }: { a: number; b: number; c: string }) => { const p = at(a + 14), q = at(b - 14); return <path d={`M${p.x} ${p.y} A ${r} ${r} 0 0 1 ${q.x} ${q.y}`} fill="none" stroke={c} strokeWidth={3} markerEnd="url(#bfArrowS)" />; };
  return (
    <Svg h={330} label="מעגל קלווין-בנסון בשלושה שלבים: קיבוע — רוביסקו מחבר 3 CO2 ל-3 RuBP ונוצרות 6 מולקולות 3-PGA; חיזור — 6 ATP ו-6 NADPH הופכים אותן ל-6 G3P; אחת יוצאת מהמעגל, וחמש עוברות התחדשות עם 3 ATP ל-3 RuBP">
      <Arc a={-90} b={30} c={GREEN} />
      <Arc a={30} b={150} c={BLUE} />
      <Arc a={150} b={270} c={PURPLE} />
      <Node deg={-90} t="3 RuBP" sub="(5 פחמנים)" c={PURPLE} />
      <Node deg={30} t="6 3-PGA" sub="(3 פחמנים)" c={GREEN} />
      <Node deg={150} t="6 G3P" sub="טריוז-פוספט" c={BLUE} />
      <He x={418} y={140} size={11.5} bold color={GREEN}>1. קיבוע</He>
      <La x={418} y={158} size={10.5} color={GREEN}>3 CO₂ (Rubisco)</La>
      <Arrow x1={430} y1={66} x2={340} y2={104} color={GREEN} />
      <La x={444} y={60} size={11} bold color={GREEN}>CO₂</La>
      <He x={250} y={300} size={11.5} bold color={BLUE}>2. חיזור</He>
      <La x={250} y={318} size={10.5} color={BLUE}>6 ATP + 6 NADPH</La>
      <He x={64} y={140} size={11.5} bold color={PURPLE}>3. התחדשות</He>
      <La x={64} y={158} size={10.5} color={PURPLE}>3 ATP</La>
      <Arrow x1={at(150).x - 40} y1={at(150).y + 16} x2={40} y2={292} color={ORANGE} width={2.4} />
      <He x={60} y={312} size={10.5} bold color={ORANGE}>G3P אחד יוצא</He>
      <La x={230} y={156} size={11} bold>3 CO₂ + 9 ATP + 6 NADPH</La>
      <La x={230} y={174} size={11} bold>→ 1 G3P</La>
    </Svg>
  );
}

// ── pp-calvin: the C4 pathway ───────────────────────────────────────────────
function C4Pathway() {
  return (
    <Svg h={300} label="מסלול C4: בתא המזופיל, PEP קרבוקסילאז מקבע ביקרבונט ל-PEP ונוצר אוקסלואצטט, שהופך למלאט. המלאט עובר לתא עטיפת הצינור ומשחרר CO2 בריכוז גבוה, שרוביסקו מקבע במעגל קלווין. הפירובט חוזר למזופיל ונבנה ממנו PEP מחדש בהשקעת ATP">
      <rect x={20} y={40} width={200} height={230} rx={18} fill={FILL.green} stroke={GREEN} strokeWidth={1.8} />
      <He x={120} y={30} size={12} bold color={GREEN}>תא מזופיל</He>
      <rect x={260} y={40} width={200} height={230} rx={18} fill="#bbf7d0" stroke="#166534" strokeWidth={2.4} />
      <He x={360} y={30} size={12} bold color="#166534">תא עטיפת הצינור</He>
      <La x={60} y={80} size={11} bold color={TEAL}>HCO₃⁻</La>
      <La x={170} y={80} size={11} bold>PEP</La>
      <Arrow x1={76} y1={88} x2={110} y2={116} color={TEAL} />
      <Arrow x1={160} y1={88} x2={130} y2={116} color={INK} />
      <La x={120} y={134} size={11} bold>OAA</La>
      <He x={182} y={112} size={9.5} color={PURPLE}>PEP קרבוקסילאז</He>
      <Arrow x1={120} y1={140} x2={120} y2={168} color={INK} />
      <He x={120} y={186} size={11} bold>מלאט</He>
      <Arrow x1={150} y1={182} x2={290} y2={182} color={ORANGE} width={2.6} />
      <He x={330} y={186} size={11} bold>מלאט</He>
      <Arrow x1={330} y1={192} x2={330} y2={220} color={INK} />
      <He x={330} y={238} size={11} bold>פירובט</He>
      <Arrow x1={290} y1={242} x2={150} y2={242} color={ORANGE} width={2.6} />
      <He x={120} y={246} size={11} bold>פירובט</He>
      <path d="M120 230 C 70 200, 80 110, 156 84" fill="none" stroke={RED} strokeWidth={1.8} markerEnd="url(#bfArrow)" />
      <La x={58} y={170} size={10.5} bold color={RED}>ATP</La>
      <Arrow x1={350} y1={176} x2={390} y2={120} color={TEAL} width={2.4} />
      <La x={406} y={150} size={11} bold color={TEAL}>CO₂</La>
      <He x={406} y={166} size={9.5} color={TEAL}>ריכוז גבוה</He>
      <ellipse cx={380} cy={90} rx={56} ry={30} fill="#fff" stroke={PURPLE} strokeWidth={1.6} />
      <He x={380} y={86} size={10.5} bold color={PURPLE}>רוביסקו</He>
      <He x={380} y={102} size={9.5} color={PURPLE}>מעגל קלווין</He>
      <He x={240} y={292} size={10} color={MUTED}>מחיר: כ-2 ATP נוספים לכל CO₂ · רווח: כמעט אין נשימה פוטוסינתטית</He>
    </Svg>
  );
}

// ── pp-photoreceptors: phytochrome signaling ────────────────────────────────
function PhytochromeSignaling() {
  return (
    <Svg h={350} label="איתות הפיטוכרום: בציטופלזמה, Pr הופך ל-Pfr באור אדום וחוזר באור אדום רחוק. Pfr נכנס לגרעין, ושם מסמן את גורמי השעתוק PIF לפירוק — והגנים של גדילה בחושך נכבים. בחושך, COP1 עם SPA בגרעין מסמן את HY5 לפירוק; באור COP1 מעוכב ויוצא מהגרעין, HY5 מצטבר ומפעיל את גני הפוטומורפוגנזה">
      <rect x={10} y={10} width={460} height={310} rx={16} fill={FILL.cyto} stroke={LINE_GRAY} />
      <He x={460} y={30} size={10.5} color={MUTED} anchor="end">ציטופלזמה</He>
      <Prot x={90} y={56} w={50} label="Pr" c={RED} fill={FILL.red} />
      <Prot x={230} y={56} w={50} label="Pfr" c="#7f1d1d" fill="#fecaca" />
      <path d="M118 48 C 150 30, 170 30, 202 48" fill="none" stroke={RED} strokeWidth={2} markerEnd="url(#bfArrow)" />
      <path d="M202 66 C 170 84, 150 84, 118 66" fill="none" stroke="#7f1d1d" strokeWidth={2} markerEnd="url(#bfArrow)" />
      <He x={160} y={28} size={10} bold color={RED}>אדום (660)</He>
      <He x={160} y={96} size={10} bold color="#7f1d1d">אדום רחוק (730)</He>
      <rect x={30} y={120} width={420} height={190} rx={18} fill={FILL.nuc} stroke={PURPLE} strokeWidth={1.4} />
      <He x={440} y={140} size={10.5} color={MUTED} anchor="end">גרעין</He>
      <Arrow x1={240} y1={72} x2={240} y2={140} color="#7f1d1d" width={2.4} />
      <Prot x={240} y={160} w={50} label="Pfr" c="#7f1d1d" fill="#fecaca" />
      <Prot x={340} y={160} w={46} label="PIF" c={GREEN} fill={FILL.green} />
      <Arrow x1={266} y1={160} x2={314} y2={160} color="#7f1d1d" />
      <Ub x={364} y={160} n={3} />
      <Arrow x1={392} y1={160} x2={410} y2={180} color={MUTED} />
      <Proteasome x={420} y={214} />
      <He x={330} y={190} size={10} color={GREEN}>גני גדילה בחושך כבים</He>
      {/* COP1 HY5 */}
      <Prot x={100} y={200} w={70} label="COP1·SPA" c={PURPLE} fill={FILL.purple} size={10} />
      <Prot x={100} y={260} w={46} label="HY5" c={GREEN} fill={FILL.green} />
      <Inhib x1={100} y1={216} x2={100} y2={244} />
      <Inhib x1={214} y1={168} x2={140} y2={196} c="#7f1d1d" />
      <Dna x1={150} x2={330} y={276} site={[170, 50, "גני אור"]} />
      <Arrow x1={124} y1={262} x2={164} y2={270} color={GREEN} />
      <He x={260} y={250} size={10} color={GREEN}>HY5 מצטבר ← פוטומורפוגנזה</He>
      <He x={240} y={340} size={10} color={MUTED}>בחושך: אין Pfr בגרעין, COP1 מפרק את HY5, ו-PIF מפעיל גדילה בחושך</He>
    </Svg>
  );
}

// ── pp-tropisms: root gravitropism ──────────────────────────────────────────
function RootGravitropism() {
  const Tip = ({ ox, horiz }: { ox: number; horiz: boolean }) => (
    <g transform={horiz ? `translate(${ox} 110) rotate(-90)` : `translate(${ox} 30)`}>
      <rect x={-34} y={0} width={68} height={170} fill={FILL.cyto} stroke={GREEN} strokeWidth={1.6} />
      <path d="M-34 170 C -34 214, 34 214, 34 170 Z" fill="#fde68a" stroke="#b45309" strokeWidth={1.4} />
      {/* columella cells */}
      {[-20, 0, 20].map((dx) => <rect key={dx} x={dx - 9} y={176} width={18} height={18} rx={3} fill="#fff" stroke="#b45309" strokeWidth={0.8} />)}
      {[-20, 0, 20].map((dx) => horiz
        ? [0, 1].map((i) => <circle key={`${dx}${i}`} cx={dx - 6} cy={180 + i * 8} r={2.6} fill="#92400e" />)
        : [0, 1].map((i) => <circle key={`${dx}${i}`} cx={dx - 4 + i * 8} cy={190} r={2.6} fill="#92400e" />))}
      {/* auxin flows */}
      <line x1={0} y1={10} x2={0} y2={166} stroke={ORANGE} strokeWidth={2} markerEnd="url(#bfArrow)" />
      {horiz ? <>
        <path d="M-12 196 C -30 196, -34 180, -32 120" fill="none" stroke={ORANGE} strokeWidth={4} markerEnd="url(#bfArrowS)" />
        <path d="M12 196 C 30 196, 34 180, 32 150" fill="none" stroke={ORANGE} strokeWidth={1.2} markerEnd="url(#bfArrow)" />
      </> : <>
        <path d="M-12 196 C -30 196, -34 180, -32 120" fill="none" stroke={ORANGE} strokeWidth={2} markerEnd="url(#bfArrow)" />
        <path d="M12 196 C 30 196, 34 180, 32 120" fill="none" stroke={ORANGE} strokeWidth={2} markerEnd="url(#bfArrow)" />
      </>}
    </g>
  );
  return (
    <Svg h={330} label="גרביטרופיזם בשורש: בשורש אנכי, הסטטוליטים שוקעים לתחתית תאי הקולומלה, והאוקסין חוזר כלפי מעלה באופן שווה בשני הצדדים. בשורש אופקי, הסטטוליטים שוקעים לדופן התחתונה, נשאי PIN3 ו-PIN7 עוברים לשם, ויותר אוקסין חוזר בצד התחתון. בשורש, ריכוז גבוה של אוקסין מעכב התארכות — הצד התחתון גדל לאט, והשורש מתכופף למטה">
      <He x={100} y={22} size={12} bold>שורש אנכי</He>
      <Tip ox={100} horiz={false} />
      <He x={100} y={262} size={10} color={MUTED}>זרימה שווה בשני הצדדים</He>
      <He x={340} y={22} size={12} bold>שורש על הצד</He>
      <Tip ox={250} horiz={true} />
      <He x={340} y={160} size={10.5} bold color={ORANGE}>יותר אוקסין בצד התחתון</He>
      <He x={340} y={178} size={10} color={RED}>← מעכב התארכות שם</He>
      <He x={340} y={200} size={10} color={MUTED}>הצד העליון ממשיך לגדול</He>
      <path d="M260 240 C 330 240, 390 250, 420 300" fill="none" stroke={GREEN} strokeWidth={3} markerEnd="url(#bfArrowS)" />
      <He x={300} y={286} size={11} bold color={GREEN}>מתכופף למטה</He>
      <He x={240} y={320} size={10} color={MUTED}>● סטטוליטים (עמילופלסטים) · חצים כתומים: זרימת אוקסין (מודל המזרקה)</He>
    </Svg>
  );
}

// ── pp-circadian-photoperiod: the core clock ────────────────────────────────
function ClockLoop() {
  return (
    <Svg h={290} label="לולאת הליבה של השעון בארבידופסיס: CCA1 ו-LHY מבוטאים בשחר ומדכאים את TOC1 ואת גני הערב; TOC1 מבוטא בערב ומדכא את CCA1 ו-LHY. חלבוני PRR מבוטאים בגלים במשך היום ומדכאים את CCA1 ו-LHY; קומפלקס הערב (ELF3, ELF4, LUX) מדכא בלילה. האור מכוונן את השעון דרך הפיטוכרומים והקריפטוכרומים">
      <circle cx={240} cy={150} r={112} fill="none" stroke={LINE_GRAY} strokeWidth={14} />
      <path d="M128 150 A 112 112 0 0 1 352 150" fill="none" stroke="#fde68a" strokeWidth={14} />
      <path d="M352 150 A 112 112 0 0 1 128 150" fill="none" stroke="#c7d2fe" strokeWidth={14} />
      <He x={240} y={26} size={11} bold color="#b45309">יום</He>
      <He x={240} y={286} size={11} bold color="#4338ca">לילה</He>
      <Prot x={130} y={96} w={84} label="CCA1·LHY" c="#b45309" fill="#fef3c7" size={10.5} />
      <He x={130} y={124} size={9.5} color="#b45309">שחר</He>
      <Prot x={350} y={96} w={56} label="PRRs" c={ORANGE} fill={FILL.orange} />
      <He x={350} y={124} size={9.5} color={ORANGE}>לאורך היום</He>
      <Prot x={350} y={200} w={56} label="TOC1" c={PURPLE} fill={FILL.purple} />
      <He x={350} y={228} size={9.5} color={PURPLE}>ערב</He>
      <Prot x={140} y={204} w={80} label="ELF3·4·LUX" c="#4338ca" fill="#e0e7ff" size={10} />
      <He x={140} y={232} size={9.5} color="#4338ca">קומפלקס הערב</He>
      <Inhib x1={176} y1={106} x2={318} y2={192} />
      <Inhib x1={322} y1={208} x2={176} y2={114} c={PURPLE} />
      <Inhib x1={322} y1={92} x2={176} y2={92} c={ORANGE} />
      <Inhib x1={182} y1={198} x2={320} y2={104} c="#4338ca" />
      <La x={440} y={40} size={10} color={RED} anchor="end">light → phy, cry</La>
      <Arrow x1={400} y1={46} x2={370} y2={80} color={RED} />
    </Svg>
  );
}

// ── pp-circadian-photoperiod: external coincidence ──────────────────────────
function ExternalCoincidence() {
  const s = scale(70, 450, 0, 0, 0, 24, 0, 1);
  const row = (y: number, light: number, label: string) => {
    const co = (t: number) => Math.max(0, Math.exp(-(((t - 16) / 4.2) ** 2)));
    const prot = (t: number) => (t <= light ? co(t) : 0);
    const sx = (t: number) => s.sx(t), sy = (v: number) => y + 60 - v * 50;
    let d = "", p = "";
    for (let i = 0; i <= 96; i++) { const t = (24 * i) / 96; d += `${i ? "L" : "M"}${sx(t).toFixed(1)} ${sy(co(t)).toFixed(1)}`; p += `${i ? "L" : "M"}${sx(t).toFixed(1)} ${sy(prot(t)).toFixed(1)}`; }
    return (
      <g>
        <He x={60} y={y + 36} size={11} bold anchor="end">{label}</He>
        <rect x={sx(0)} y={y + 64} width={sx(light) - sx(0)} height={10} fill="#fde68a" />
        <rect x={sx(light)} y={y + 64} width={sx(24) - sx(light)} height={10} fill="#334155" />
        <path d={d} fill="none" stroke={BLUE} strokeWidth={2} {...dash} />
        <path d={`${p} L${sx(24)} ${sy(0)} L${sx(0)} ${sy(0)} Z`} fill="#bbf7d0" stroke={GREEN} strokeWidth={2} />
        <line x1={sx(0)} x2={sx(24)} y1={sy(0)} y2={sy(0)} stroke={INK} strokeWidth={1} />
      </g>
    );
  };
  return (
    <Svg h={290} label="מודל ההתלכדות החיצונית בארבידופסיס: ה-mRNA של CONSTANS (קו מקווקו) מגיע לשיא אחר הצהריים ובלילה, בשני סוגי הימים. החלבון CO (שטח ירוק) מצטבר רק בשעות שבהן ה-mRNA גבוה ויש אור. ביום ארוך (16 שעות אור) השעות האלה קיימות ו-CO מפעיל את FT; ביום קצר (8 שעות) כבר חשוך כשה-mRNA עולה, והחלבון מפורק">
      {row(20, 16, "יום ארוך")}
      {row(130, 8, "יום קצר")}
      {[0, 6, 12, 18, 24].map((t) => <La key={t} x={s.sx(t)} y={226} size={10} color={MUTED}>{String(t)}</La>)}
      <He x={260} y={244} size={10.5}>שעות מהזריחה</He>
      <He x={170} y={40} size={10.5} bold color={GREEN}>חלבון CO ← FT ← פריחה</He>
      <He x={170} y={150} size={10.5} bold color={RED}>אין חלבון CO</He>
      <He x={130} y={272} size={10} color={BLUE}>- - mRNA של CO (לפי השעון)</He>
      <He x={360} y={272} size={10} color={GREEN}>■ חלבון CO (רק באור)</He>
    </Svg>
  );
}

// ── pp-flowering: the ABC model ─────────────────────────────────────────────
function AbcModel() {
  const cx = 110, cy = 140;
  const ring = (r: number, fill: string, stroke: string) => <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={1.4} />;
  const organs = (r: number, n: number, rx: number, ry: number, fill: string, stroke: string, off = 0) => Array.from({ length: n }, (_, i) => {
    const a = ((360 / n) * i + off) * (Math.PI / 180);
    return <ellipse key={i} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth={1.2} transform={`rotate(${(360 / n) * i + off + 90} ${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)})`} />;
  });
  const Bar = ({ x, w, y, c, label }: { x: number; w: number; y: number; c: string; label: string }) => <g><rect x={x} y={y} width={w} height={20} rx={4} fill={c} opacity={0.85} /><La x={x + w / 2} y={y + 14} size={11} bold color="#fff">{label}</La></g>;
  const X0 = 250, CW = 52;
  return (
    <Svg h={300} label="מודל ABC: משמאל, חתך רוחב של פרח עם ארבע טבעות — עלי גביע, עלי כותרת, אבקנים ושתי עלי שחלה מאוחים. מימין, תחומי הפעילות של הגנים: A בטבעות 1–2, B בטבעות 2–3, C בטבעות 3–4. A לבד ← עלה גביע; A+B ← עלה כותרת; B+C ← אבקן; C לבד ← עלה שחלה. גני SEP (E) נדרשים בכל הטבעות">
      {ring(98, "#f0fdf4", GREEN)}
      {organs(84, 4, 16, 26, "#bbf7d0", GREEN, 45)}
      {organs(62, 4, 13, 20, "#fff", "#94a3b8", 0)}
      {organs(40, 6, 8, 10, "#fef3c7", "#ca8a04", 0)}
      <ellipse cx={cx} cy={cy} rx={20} ry={14} fill="#fecaca" stroke={RED} />
      <line x1={cx} x2={cx} y1={cy - 14} y2={cy + 14} stroke={RED} />
      <He x={cx} y={256} size={10.5} color={MUTED}>חתך רוחב של פרח ארבידופסיס</He>
      {/* whorl grid */}
      {["1", "2", "3", "4"].map((w, i) => <La key={w} x={X0 + CW * i + CW / 2} y={42} size={11} bold>{w}</La>)}
      <He x={X0 + 2 * CW} y={24} size={11} bold>טבעת</He>
      <Bar x={X0} w={CW * 2 - 4} y={52} c={"#16a34a"} label="A" />
      <Bar x={X0 + CW} w={CW * 2 - 4} y={78} c={BLUE} label="B" />
      <Bar x={X0 + CW * 2} w={CW * 2 - 4} y={104} c={RED} label="C" />
      <Bar x={X0} w={CW * 4 - 4} y={130} c={PURPLE} label="E (SEP)" />
      {([["עלה גביע", GREEN], ["עלה כותרת", "#64748b"], ["אבקן", "#ca8a04"], ["עלה שחלה", RED]] as const).map(([t, c], i) => <He key={t} x={X0 + CW * i + CW / 2 - 2} y={172} size={10} bold color={c}>{t}</He>)}
      <rect x={X0 - 6} y={188} width={CW * 4 + 8} height={70} rx={8} fill="#f8fafc" stroke={LINE_GRAY} />
      <He x={X0 + 2 * CW} y={208} size={10} color={MUTED}>A ו-C מדכאים זה את זה:</He>
      <He x={X0 + 2 * CW} y={226} size={10} color={MUTED}>ap2 (אין A) ← שחלה, אבקן, אבקן, שחלה</He>
      <He x={X0 + 2 * CW} y={244} size={10} color={MUTED}>ag (אין C) ← גביע, כותרת, כותרת, גביע…</He>
      <He x={240} y={290} size={10} color={MUTED}>A: AP1, AP2 · B: AP3, PI · C: AG · E: SEP</He>
    </Svg>
  );
}

// ── pp-biotic-stress: two layers of plant immunity ──────────────────────────
function PlantImmunity() {
  return (
    <Svg h={330} label="שתי שכבות החיסון של הצמח: בממברנה, הקולטן FLS2 עם BAK1 מזהה flg22 מפלגלין חיידקי ומפעיל PTI — Ca2+, ROS, MAP קינאזות, סגירת פיוניות וקאלוז. החיידק מזריק אפקטורים במערכת הפרשה מסוג III, והם מדכאים את PTI. בתוך התא, קולטן NLR מזהה אפקטור — כאן לפי השינוי שהוא גורם לחלבון RIN4 שהוא שומר עליו — ומפעיל ETI ותגובה היפרסנסיטיבית">
      <rect x={10} y={20} width={460} height={66} fill="#f0f9ff" />
      <He x={460} y={38} size={10} color={MUTED} anchor="end">מחוץ לתא</He>
      <rect x={60} y={28} width={86} height={40} rx={20} fill={FILL.gray} stroke={MUTED} strokeWidth={1.4} />
      <He x={103} y={52} size={10.5} bold color={MUTED}>חיידק</He>
      {[160, 175, 190].map((x) => <path key={x} d={`M${x} 46 q 6 -8 12 0 q 6 8 12 0`} fill="none" stroke={MUTED} strokeWidth={1.4} />)}
      <La x={238} y={42} size={10} color={ORANGE}>flg22</La>
      <Membrane x1={10} x2={470} y={96} t={12} />
      <rect x={10} y={102} width={460} height={220} fill={FILL.cyto} />
      {/* PRR */}
      <rect x={232} y={66} width={20} height={58} rx={6} fill={FILL.blue} stroke={BLUE} strokeWidth={1.4} />
      <rect x={256} y={74} width={14} height={50} rx={5} fill="#bfdbfe" stroke={BLUE} strokeWidth={1.2} />
      <circle cx={242} cy={60} r={5} fill={ORANGE} />
      <La x={232} y={138} size={10} bold color={BLUE} anchor="end">FLS2</La>
      <La x={274} y={138} size={10} bold color={BLUE} anchor="start">BAK1</La>
      <Arrow x1={250} y1={146} x2={250} y2={176} color={BLUE} width={2.2} />
      <rect x={180} y={180} width={140} height={46} rx={10} fill={FILL.blue} stroke={BLUE} />
      <He x={250} y={198} size={11} bold color={BLUE}>PTI</He>
      <He x={250} y={216} size={9.5} color={BLUE}>Ca²⁺, ROS, MAPK, פיוניות, קאלוז</He>
      {/* effectors */}
      <line x1={104} y1={68} x2={104} y2={124} stroke={MUTED} strokeWidth={3} />
      <He x={114} y={124} size={9.5} color={MUTED} anchor="start">מערכת הפרשה III</He>
      {[[96, 140], [112, 152], [100, 166]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6} fill="#fecaca" stroke={RED} />)}
      <He x={60} y={160} size={10} bold color={RED} anchor="end">אפקטורים</He>
      <Inhib x1={124} y1={160} x2={176} y2={196} />
      {/* NLR guard */}
      <Prot x={110} y={262} w={56} label="RIN4" c={MUTED} fill={FILL.gray} size={10.5} />
      <Arrow x1={104} y1={174} x2={108} y2={246} color={RED} dashed />
      <Prot x={210} y={274} w={56} label="NLR" c={PURPLE} fill={FILL.purple} />
      <He x={170} y={300} size={9.5} color={PURPLE}>שומר על RIN4</He>
      <Arrow x1={240} y1={268} x2={330} y2={268} color={PURPLE} width={2.4} />
      <rect x={334} y={238} width={126} height={66} rx={10} fill={FILL.red} stroke={RED} />
      <He x={397} y={258} size={11} bold color={RED}>ETI</He>
      <He x={397} y={276} size={9.5} color={RED}>חזק ומהיר</He>
      <He x={397} y={292} size={9.5} color={RED}>תגובה היפרסנסיטיבית</He>
      <He x={397} y={130} size={10} color={MUTED}>PTI עוצר את רוב החיידקים</He>
      <He x={397} y={148} size={10} color={MUTED}>אפקטורים מדכאים את PTI</He>
      <He x={397} y={166} size={10} color={MUTED}>NLR מזהה אפקטור ← ETI</He>
    </Svg>
  );
}

export const PLANT_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "plasmodesma": { el: Plasmodesma, captionHe: "פלסמודסמה בחתך אורכי, ובפינה — בחתך רוחב. ממברנת התא רציפה בין שני התאים; הדסמוטובול (ER דחוס) מחבר את ה-ER שלהם; מולקולות קטנות עוברות בשרוול הציטופלזמי. קאלוז בצוואר יכול לסגור את התעלה. סכמטי." },
  "ti-plasmid": { el: TiPlasmid, captionHe: "אגרובקטריום מעביר לתא הצמח את קטע ה-T-DNA שבין הגבול השמאלי (LB) לימני (RB) בפלסמיד Ti, והקטע משתלב בכרומוזום. במעבדה מחליפים את גני הגידול והאופינים בגן הנחקר ובגן ברירה. סכמטי." },
  "cell-water-potential": { el: CellWaterPotential, captionHe: "תא רפוי בשלוש תמיסות (ערכים ב-MPa; בהזנחת השינוי בנפח). המים זורמים לפי Ψw: נכנסים עד שהטורגור מאזן, או יוצאים עד פלסמוליזה. סכמטי." },
  "guard-cell-opening": { el: GuardCellOpening, captionHe: "פתיחת פיונית: המכניקה (תאית רדיאלית ודופן עבה בצד הפתח) והיונים שמניעים את המים (H⁺ החוצה, K⁺ ו-Cl⁻ פנימה, מלאט מעמילן). ABA הופך את התהליך. סכמטי." },
  "acid-growth": { el: AcidGrowth, captionHe: "גדילה חומצית: אוקסין מפעיל את משאבת הפרוטונים, הדופן מחמיצה, ואקספנסינים מחלישים את הקשרים בין קסילוגלוקן לתאית — הדופן נמתחת תחת לחץ הטורגור. סכמטי, לא בקנה מידה." },
  "shoot-meristem": { el: ShootMeristem, captionHe: "המריסטמה של הנבט: האזורים, השכבות ולולאת המשוב WUS–CLV3 ששומרת על מספר קבוע של תאי גזע. סכמטי." },
  "auxin-chemiosmotic": { el: AuxinChemiosmotic, captionHe: "ההובלה הקוטבית של אוקסין לפי המודל הכימיאוסמוטי: כניסה בדיפוזיה (IAAH) וב-AUX1; כליאה בציטוזול כ-IAA⁻; יציאה רק דרך נשאי PIN שבצד התחתון. סכמטי." },
  "auxin-signaling": { el: AuxinSignaling, captionHe: "מסלול האיתות של אוקסין בגרעין: אוקסין מחבר את TIR1 ל-Aux/IAA, המדכא מפורק, ו-ARF מפעיל את הגנים. סכמטי." },
  "cytokinin-relay": { el: CytokininRelay, captionHe: "הממסר הזרחני של ציטוקינין: AHK בממברנת ה-ER ← AHP ← ARR מסוג B בגרעין; ARR מסוג A — משוב שלילי. סכמטי." },
  "ga-della": { el: GaDella, captionHe: "מסלול הגיברלין: GA–GID1 נקשר ל-DELLA, SCF^SLY1 מסמן אותו לפירוק, וגורמי הגדילה משתחררים. סכמטי." },
  "aba-core": { el: AbaCore, captionHe: "מסלול הליבה של ABA: ‏ABA ⊣ PP2C ⊣ SnRK2. ‏SnRK2 הפעילה פותחת את SLAC1 בתא השמירה ומפעילה גורמי שעתוק ABF. סכמטי." },
  "ethylene-pathway": { el: EthylenePathway, captionHe: "מסלול האתילן: בלי אתילן הקולטנים מפעילים את CTR1 שמשבית את EIN2; אתילן משבית את הקולטנים, הקצה של EIN2 עובר לגרעין ו-EIN3 מפעיל את הגנים. סכמטי." },
  "pp-z-scheme": { el: ZScheme, captionHe: "סכמת Z: רכיבי השרשרת לפי פוטנציאל החיזור (ערכים בקירוב). שני חיצי אור מעלים את האלקטרון ב-PSII וב-PSI; בין לבין הוא יורד ומשחרר אנרגיה. סכמטי." },
  "thylakoid-membrane": { el: ThylakoidMembrane, captionHe: "הקומפלקסים בממברנת התילקואיד, מסלול האלקטרון (שחור) והפרוטונים (אדום). ATP ו-NADPH משתחררים לסטרומה. סכמטי." },
  "pp-calvin-cycle": { el: CalvinCycle, captionHe: "מעגל קלווין-בנסון לכל 3 מולקולות CO₂: קיבוע, חיזור והתחדשות. ‏G3P אחד יוצא מהמעגל. סכמטי." },
  "c4-pathway": { el: C4Pathway, captionHe: "מסלול C4 (מהסוג שבו מלאט עובר לעטיפת הצינור): ריכוז CO₂ סביב רוביסקו, במחיר של ATP. סכמטי." },
  "phytochrome-signaling": { el: PhytochromeSignaling, captionHe: "איתות הפיטוכרום: Pfr עובר לגרעין, מפרק PIF ומעכב את COP1, כך ש-HY5 מצטבר. סכמטי." },
  "root-gravitropism": { el: RootGravitropism, captionHe: "גרביטרופיזם בשורש: הסטטוליטים שוקעים, נשאי PIN עוברים לצד התחתון, ויותר אוקסין חוזר בצד התחתון ומעכב בו את ההתארכות. סכמטי." },
  "clock-loop": { el: ClockLoop, captionHe: "לולאות הדיכוי של השעון הצירקדי בארבידופסיס (גרסה מקוצרת). כל רכיב מבוטא בשעה אחרת ומדכא את האחרים. סכמטי." },
  "external-coincidence": { el: ExternalCoincidence, captionHe: "מודל ההתלכדות החיצונית: החלבון CO מצטבר רק אם יש אור בשעות שבהן ה-mRNA שלו גבוה. עקומות מודגמות." },
  "abc-model": { el: AbcModel, captionHe: "מודל ABC(E) לזהות איברי הפרח: צירוף הגנים הפעילים בכל טבעת קובע את האיבר. סכמטי." },
  "plant-immunity": { el: PlantImmunity, captionHe: "שתי שכבות החיסון של הצמח: PTI בקולטני ממברנה, ו-ETI בקולטני NLR שמזהים אפקטורים (כאן — לפי מודל השומר). סכמטי." },
};
