/* Drawn figures for study units, referenced from lesson bodies as [[figure:<id>]].
   Drawn on a white panel (like the animations) so they read the same in dark mode. */

import { BIOCHEM_FIGURES } from "./biochemFigures";
import { METABOLIC_FIGURES } from "./metabolicFigures";
import { MOLECULAR_FIGURES } from "./molecularFigures";
import { CELL_FIGURES } from "./cellFigures";
import { GENE_EXPRESSION_FIGURES } from "./geneExpressionFigures";
import { PHYSIOLOGY_FIGURES } from "./physiologyFigures";
import { MICRO_FIGURES } from "./microFigures";
import { PLANT_FIGURES } from "./plantFigures";

const BLUE = "#1d4ed8", ORANGE = "#c2410c", INK = "#1f2937", MUTED = "#64748b";
const T = { fontFamily: "var(--font-hebrew), Arial, sans-serif" };

function Allele({ x, y, label, color, below = false }: { x: number; y: number; label?: string; color: string; below?: boolean }) {
  return (
    <g>
      <rect x={x - 3} y={y - 9} width={6} height={18} rx={2} fill={color} />
      {label && <text x={x} y={below ? y + 27 : y - 14} textAnchor="middle" fontSize="15" fontWeight="700" fill={color} style={{ fontFamily: "Arial, sans-serif" }}>{label}</text>}
    </g>
  );
}

// Four chromatids (two homologs), one crossover between A and B on the two inner
// chromatids, and the four resulting chromatids: two parental, two recombinant.
function Crossover() {
  const strand = (y: number, color: string) => <line x1={360} x2={610} y1={y} y2={y} stroke={color} strokeWidth={7} strokeLinecap="round" />;
  const out = (y: number, left: string, right: string, l: string, r: string, kind: string) => (
    <g>
      <line x1={25} x2={110} y1={y} y2={y} stroke={left} strokeWidth={7} strokeLinecap="round" />
      <line x1={110} x2={195} y1={y} y2={y} stroke={right} strokeWidth={7} strokeLinecap="round" />
      <Allele x={55} y={y} label={l} color={left} />
      <Allele x={165} y={y} label={r} color={right} />
      <text x={305} y={y + 5} direction="rtl" textAnchor="start" fontSize="13" fill={kind === "rec" ? ORANGE : MUTED} fontWeight={kind === "rec" ? 700 : 400} style={T}>
        {kind === "rec" ? "רקומביננטית" : "הורית"}
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 640 268" className="w-full h-auto" role="img" aria-label="שחלוף יחיד בין כרומטידות לא-אחיות של כרומוזומים הומולוגיים, בין הלוקוסים A ו-B, יוצר שתי כרומטידות הוריות ושתי כרומטידות רקומביננטיות">
      <text x={485} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK} style={T}>פרופאזה I: ארבע כרומטידות</text>
      {strand(70, BLUE)}{strand(100, BLUE)}{strand(160, ORANGE)}{strand(190, ORANGE)}
      {/* crossover between the inner chromatids, between the two loci */}
      <path d="M470 100 C 485 100, 485 160, 500 160 M470 160 C 485 160, 485 100, 500 100" fill="none" stroke={INK} strokeWidth={2} strokeDasharray="4 3" />
      <text x={545} y={134} direction="rtl" textAnchor="start" fontSize="12" fill={INK} style={T}>שחלוף</text>
      <Allele x={410} y={70} label="A" color={BLUE} /><Allele x={560} y={70} label="B" color={BLUE} />
      <Allele x={410} y={100} color={BLUE} /><Allele x={560} y={100} color={BLUE} />
      <Allele x={410} y={160} color={ORANGE} /><Allele x={560} y={160} color={ORANGE} />
      <Allele x={410} y={190} label="a" color={ORANGE} below /><Allele x={560} y={190} label="b" color={ORANGE} below />
      <text x={485} y={250} textAnchor="middle" fontSize="12" fill={MUTED} style={T}>שני הומולוגים, כל אחד משתי כרומטידות אחיות</text>

      <path d="M345 130 H 325" stroke={INK} strokeWidth={2} markerEnd="url(#lf-arrow)" />
      <defs>
        <marker id="lf-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill={INK} /></marker>
      </defs>

      <text x={150} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK} style={T}>ארבעת התוצרים של המיוזה</text>
      {out(70, BLUE, BLUE, "A", "B", "par")}
      {out(115, BLUE, ORANGE, "A", "b", "rec")}
      {out(160, ORANGE, BLUE, "a", "B", "rec")}
      {out(205, ORANGE, ORANGE, "a", "b", "par")}
      <text x={150} y={252} textAnchor="middle" fontSize="12" fill={MUTED} style={T}>שחלוף אחד ← 2 מתוך 4 רקומביננטיות (50%)</text>
    </svg>
  );
}

// The three-point example: A – C – B with 10 and 20 cM; direct A–B measures 28.
function GeneMap() {
  const x = { A: 70, C: 230, B: 550 };
  return (
    <svg viewBox="0 0 620 200" className="w-full h-auto" role="img" aria-label="מפה גנטית: A ו-C במרחק 10 סנטימורגן, C ו-B במרחק 20, סכום 30; תדירות הרקומבינציה הנמדדת ישירות בין A ל-B היא 28%">
      <g direction="ltr">
        <line x1={40} x2={580} y1={110} y2={110} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        {(["A", "C", "B"] as const).map((g) => (
          <g key={g}>
            <line x1={x[g]} x2={x[g]} y1={98} y2={122} stroke={g === "C" ? ORANGE : BLUE} strokeWidth={4} />
            <text x={x[g]} y={145} textAnchor="middle" fontSize="18" fontWeight="700" fill={g === "C" ? ORANGE : BLUE} style={{ fontFamily: "Arial, sans-serif" }}>{g}</text>
          </g>
        ))}
        <text x={(x.A + x.C) / 2} y={98} textAnchor="middle" fontSize="14" fill={INK} style={{ fontFamily: "Arial, sans-serif" }}>10 cM</text>
        <text x={(x.C + x.B) / 2} y={98} textAnchor="middle" fontSize="14" fill={INK} style={{ fontFamily: "Arial, sans-serif" }}>20 cM</text>
        <path d={`M${x.A} 55 V 45 H ${x.B} V 55`} fill="none" stroke={MUTED} strokeWidth={1.5} />
        <text x={(x.A + x.B) / 2} y={36} textAnchor="middle" fontSize="13" fill={MUTED} style={{ fontFamily: "Arial, sans-serif" }}>30 cM</text>
        <path d={`M${x.A} 165 V 175 H ${x.B} V 165`} fill="none" stroke={ORANGE} strokeWidth={1.5} strokeDasharray="4 3" />
      </g>
      <text x={(x.A + x.B) / 2} y={194} textAnchor="middle" fontSize="13" fill={ORANGE} style={T}>RF בין A ל-B, נמדד ישירות: ‎28%‎ — תוצרי ה-DCO נראים הוריים</text>
      <text x={(x.A + x.B) / 2} y={20} textAnchor="middle" fontSize="12" fill={MUTED} style={T}>סכום המרווחים</text>
    </svg>
  );
}


// Monohybrid Aa × Aa: gametes on the edges, offspring in the cells, phenotype by color.
function Punnett() {
  const PURPLE = "#7c3aed", WHITE = "#f8fafc", LT = { fontFamily: "Arial, sans-serif" };
  const cell = (x: number, y: number, g: string) => {
    const dom = g.includes("A");
    return (
      <g key={`${x}${y}`}>
        <rect x={x} y={y} width={110} height={80} fill={dom ? "#ede9fe" : WHITE} stroke={INK} strokeWidth={1.5} />
        <circle cx={x + 30} cy={y + 40} r={16} fill={dom ? PURPLE : WHITE} stroke={dom ? PURPLE : MUTED} strokeWidth={2} />
        <text x={x + 72} y={y + 46} textAnchor="middle" fontSize="20" fontWeight="700" fill={INK} style={LT}>{g}</text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 420 300" className="w-full h-auto" role="img" aria-label="ריבוע פאנט להצלבה Aa כפול Aa: AA, Aa, Aa ו-aa; שלושה סגולים ואחד לבן">
      <g direction="ltr">
        <text x={245} y={30} textAnchor="middle" direction="rtl" fontSize="13" fill={MUTED} style={T}>גמטות מההורה Aa</text>
        <text x={190} y={58} textAnchor="middle" fontSize="20" fontWeight="700" fill={BLUE} style={LT}>A</text>
        <text x={300} y={58} textAnchor="middle" fontSize="20" fontWeight="700" fill={ORANGE} style={LT}>a</text>
        <text x={115} y={115} textAnchor="middle" fontSize="20" fontWeight="700" fill={BLUE} style={LT}>A</text>
        <text x={115} y={195} textAnchor="middle" fontSize="20" fontWeight="700" fill={ORANGE} style={LT}>a</text>
        {cell(135, 70, "AA")}{cell(245, 70, "Aa")}{cell(135, 150, "Aa")}{cell(245, 150, "aa")}
      </g>
      <text x={60} y={160} textAnchor="middle" direction="rtl" fontSize="13" fill={MUTED} style={T} transform="rotate(-90 60 160)">גמטות מההורה Aa</text>
      <text x={245} y={262} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK} style={T}>גנוטיפים 1 : 2 : 1 · פנוטיפים 3 סגול : 1 לבן</text>
      <text x={245} y={286} textAnchor="middle" fontSize="12" fill={MUTED} style={T}>כל גמטה בהסתברות ½, ולכן כל משבצת בהסתברות ¼</text>
    </svg>
  );
}

// Three dominance relations side by side: the heterozygote (middle row) is what differs.
function DominanceTypes() {
  const RED = "#dc2626", PINK = "#f9a8d4", LT = { fontFamily: "Arial, sans-serif" };
  const rows = [{ y: 95, g: "AA" }, { y: 175, g: "Aa" }, { y: 255, g: "aa" }];
  const flower = (cx: number, cy: number, fill: string) => <circle cx={cx} cy={cy} r={24} fill={fill} stroke={fill === "#ffffff" ? MUTED : fill} strokeWidth={2} />;
  // Codominance: a cell carrying antigen M (blue) and/or N (orange) on its surface.
  const cell = (cx: number, cy: number, m: boolean, n: boolean) => {
    const dots = Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      const color = m && n ? (i % 2 ? ORANGE : BLUE) : m ? BLUE : ORANGE;
      return <circle key={i} cx={cx + Math.cos(a) * 26} cy={cy + Math.sin(a) * 26} r={4.5} fill={color} />;
    });
    return <g><circle cx={cx} cy={cy} r={22} fill="#fef2f2" stroke={MUTED} strokeWidth={1.5} />{dots}</g>;
  };
  const cols = [
    { x: 520, title: "דומיננטיות מלאה", note: "3 : 1", f: (y: number, g: string) => flower(520, y, g === "aa" ? "#ffffff" : RED) },
    { x: 320, title: "דומיננטיות חלקית", note: "1 : 2 : 1", f: (y: number, g: string) => flower(320, y, g === "AA" ? RED : g === "Aa" ? PINK : "#ffffff") },
    { x: 120, title: "קו-דומיננטיות", note: "1 : 2 : 1", f: (y: number, g: string) => cell(120, y, g !== "aa", g !== "AA") },
  ];
  return (
    <svg viewBox="0 0 640 345" className="w-full h-auto" role="img" aria-label="שלושה סוגי יחסי דומיננטיות: במלאה ההטרוזיגוט אדום כמו AA; בחלקית ההטרוזיגוט ורוד; בקו-דומיננטיות ההטרוזיגוט נושא את שני האנטיגנים">
      {cols.map((c) => (
        <g key={c.x}>
          <text x={c.x} y={30} textAnchor="middle" fontSize="15" fontWeight="700" fill={INK} style={T}>{c.title}</text>
          {rows.map((r) => <g key={r.g}>{c.f(r.y, r.g)}</g>)}
          <text x={c.x} y={318} textAnchor="middle" fontSize="13" fill={MUTED} style={T}>{`F2: ${c.note}`}</text>
        </g>
      ))}
      {rows.map((r) => (
        <text key={r.g} x={612} y={r.y + 6} textAnchor="middle" fontSize="16" fontWeight="700" fill={r.g === "Aa" ? ORANGE : INK} style={LT}>{r.g}</text>
      ))}
      <rect x={20} y={142} width={560} height={66} rx={10} fill="none" stroke={ORANGE} strokeWidth={1.5} strokeDasharray="5 4" />
      <text x={320} y={60} textAnchor="middle" fontSize="12" fill={MUTED} style={T}>בכל דוגמה משווים את ההטרוזיגוט (מקווקו) לשני ההומוזיגוטים</text>
      <text x={120} y={338} textAnchor="middle" fontSize="11" fill={MUTED} style={T}>כחול = אנטיגן M · כתום = אנטיגן N</text>
    </svg>
  );
}

// Two-step pathway (sweet pea): each gene encodes one enzyme; a block at either step → white.
function Pathway() {
  const PURPLE = "#7c3aed", LT = { fontFamily: "Arial, sans-serif" };
  const box = (cx: number, label: string, fill: string, stroke: string) => (
    <g>
      <rect x={cx - 70} y={60} width={140} height={56} rx={12} fill={fill} stroke={stroke} strokeWidth={2} />
      <text x={cx} y={94} textAnchor="middle" fontSize="14" fontWeight="700" fill={fill === PURPLE ? "#ffffff" : INK} style={T}>{label}</text>
    </g>
  );
  const step = (x1: number, x2: number, gene: string, block: string) => (
    <g>
      <line x1={x1} x2={x2} y1={88} y2={88} stroke={INK} strokeWidth={2.5} markerEnd="url(#pw-arrow)" />
      <text x={(x1 + x2) / 2} y={50} textAnchor="middle" fontSize="13" fill={BLUE} fontWeight="700" style={T}>{`אנזים ${gene}`}</text>
      <text x={(x1 + x2) / 2} y={140} textAnchor="middle" fontSize="12" fill={MUTED} style={T}>מקודד בגן</text>
      <text x={(x1 + x2) / 2} y={158} textAnchor="middle" fontSize="15" fontWeight="700" fill={BLUE} style={LT}>{gene}</text>
      <text x={(x1 + x2) / 2} y={190} textAnchor="middle" fontSize="12" fill={ORANGE} style={T}>{`${block} — חסום כאן`}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 640 215" className="w-full h-auto" role="img" aria-label="מסלול בשני שלבים: חומר לבן הופך בעזרת אנזים C לתוצר ביניים לבן, שהופך בעזרת אנזים P לפיגמנט סגול. חסימה באחד השלבים נותנת פרח לבן">
      <defs>
        <marker id="pw-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill={INK} /></marker>
      </defs>
      {box(550, "חומר מוצא חסר צבע", "#ffffff", MUTED)}
      {box(320, "תוצר ביניים חסר צבע", "#ffffff", MUTED)}
      {box(90, "פיגמנט סגול", PURPLE, PURPLE)}
      {step(478, 394, "C", "cc")}
      {step(248, 164, "P", "pp")}
    </svg>
  );
}

// Normal order vs paracentric and pericentric inversions; the inverted segment is orange.
function InversionTypes() {
  const LT = { fontFamily: "Arial, sans-serif" };
  const genes = ["A", "B", "C", "D", "E", "F", "G"];
  const CEN = 2.5; // centromere between C and D
  const row = (y: number, order: string[], inv: [number, number] | null, label: string) => {
    const x0 = 70, dx = 70;
    return (
      <g>
        <text x={620} y={y - 22} textAnchor="start" direction="rtl" fontSize="14" fontWeight="700" fill={INK} style={T}>{label}</text>
        <g direction="ltr">
          {inv && <rect x={x0 + inv[0] * dx - 30} y={y - 16} width={(inv[1] - inv[0]) * dx + 60} height={32} rx={8} fill="#fff7ed" stroke={ORANGE} strokeWidth={1.5} />}
          <line x1={x0 - 30} x2={x0 + 6 * dx + 30} y1={y} y2={y} stroke={MUTED} strokeWidth={6} strokeLinecap="round" />
          <circle cx={x0 + CEN * dx} cy={y} r={9} fill={INK} />
          {order.map((g, i) => {
            const inside = inv && i >= inv[0] && i <= inv[1];
            return <text key={i} x={x0 + i * dx} y={y + 36} textAnchor="middle" fontSize="17" fontWeight="700" fill={inside ? ORANGE : BLUE} style={LT}>{g}</text>;
          })}
          {order.map((_, i) => <line key={`t${i}`} x1={x0 + i * dx} x2={x0 + i * dx} y1={y - 8} y2={y + 8} stroke={INK} strokeWidth={2} />)}
        </g>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 640 330" className="w-full h-auto" role="img" aria-label="כרומוזום תקין A B C, צנטרומר, D E F G; אינברסיה פאראצנטרית שבה E F הפוכים; אינברסיה פריצנטרית שבה הקטע B עד E, כולל הצנטרומר, הפוך">
      {row(70, genes, null, "תקין")}
      {row(170, ["A", "B", "C", "D", "F", "E", "G"], [4, 5], "פאראצנטרית — בלי הצנטרומר")}
      {row(270, ["A", "E", "D", "C", "B", "F", "G"], [1, 4], "פריצנטרית — כולל הצנטרומר")}
    </svg>
  );
}

// Nondisjunction of one chromosome pair in meiosis I vs II; blue/orange = the two homologs.
function Nondisjunction() {
  const chrom = (x: number, y: number, color: string) => <rect x={x - 3} y={y - 14} width={6} height={28} rx={3} fill={color} />;
  // joined: kids come in sister pairs (0-1, 2-3) held at a centromere
  const cell = (cx: number, cy: number, r: number, kids: string[], label?: string, bad = false, joined = false) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={bad ? "#fff7ed" : "#ffffff"} stroke={bad ? ORANGE : MUTED} strokeWidth={1.5} />
      {joined
        ? Array.from({ length: kids.length / 2 }, (_, k) => {
            const px = cx + (k - (kids.length / 2 - 1) / 2) * 18;
            return (
              <g key={k}>
                {chrom(px - 3.5, cy, kids[2 * k])}{chrom(px + 3.5, cy, kids[2 * k + 1])}
                <circle cx={px} cy={cy} r={3.5} fill={INK} />
              </g>
            );
          })
        : kids.map((c, i) => <g key={i}>{chrom(cx + (i - (kids.length - 1) / 2) * 10, cy, c)}</g>)}
      {label && <text x={cx} y={cy + r + 16} textAnchor="middle" fontSize="12" fontWeight="700" fill={bad ? ORANGE : INK} style={{ fontFamily: "Arial, sans-serif" }}>{label}</text>}
    </g>
  );
  const line = (x1: number, y1: number, x2: number, y2: number) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={1.5} />;
  const panel = (ox: number, title: string, mi: boolean) => {
    const c1 = mi ? [BLUE, BLUE, ORANGE, ORANGE] : [BLUE, BLUE];
    const c2 = mi ? [] : [ORANGE, ORANGE];
    const g = mi
      ? [[BLUE, ORANGE], [BLUE, ORANGE], [], []]
      : [[BLUE, BLUE], [], [ORANGE], [ORANGE]];
    const lab = (k: string[]) => (k.length === 2 ? "n+1" : k.length === 0 ? "n−1" : "n");
    return (
      <g>
        <text x={ox + 140} y={22} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK} style={T}>{title}</text>
        {line(ox + 140, 70, ox + 70, 125)}{line(ox + 140, 70, ox + 210, 125)}
        {cell(ox + 140, 60, 26, [BLUE, BLUE, ORANGE, ORANGE], undefined, false, true)}
        {line(ox + 70, 140, ox + 35, 200)}{line(ox + 70, 140, ox + 105, 200)}
        {line(ox + 210, 140, ox + 175, 200)}{line(ox + 210, 140, ox + 245, 200)}
        {cell(ox + 70, 135, 24, c1, undefined, mi, true)}
        {cell(ox + 210, 135, 24, c2, undefined, mi, true)}
        {g.map((k, i) => <g key={i}>{cell(ox + 35 + i * 70, 215, 20, k, lab(k), k.length !== 1)}</g>)}
      </g>
    );
  };
  return (
    <svg viewBox="0 0 640 270" className="w-full h-auto" role="img" aria-label="אי-היפרדות במיוזה I: שני ההומולוגים עוברים יחד, ונוצרות שתי גמטות n+1 עם הומולוגים שונים ושתי גמטות n−1. אי-היפרדות במיוזה II: כרומטידות אחיות לא נפרדות; גמטה n+1 עם שתי כרומטידות אחיות של אותו הומולוג, גמטה n−1 ושתי גמטות תקינות">
      {panel(330, "אי-היפרדות במיוזה I", true)}
      {panel(10, "אי-היפרדות במיוזה II", false)}
      <line x1={320} x2={320} y1={10} y2={255} stroke="#e2e8f0" strokeWidth={1.5} />
    </svg>
  );
}

// X inactivation: early embryo (random choice per cell) → clonal patches in the adult tissue.
function XInactivation() {
  // Early embryo: 8 cells, each silences one X (the small dark "Barr body" is the silenced X's colour).
  const early: ("m" | "p")[] = ["m", "p", "p", "m", "p", "m", "m", "p"];
  const col = (k: "m" | "p") => (k === "m" ? BLUE : ORANGE);
  const other = (k: "m" | "p") => (k === "m" ? ORANGE : BLUE);
  // Adult tissue: 8×6 grid of patches; each patch descends from one early cell.
  const patch = [
    "mmmppppm", "mmpppppm", "mmmpmmmm", "pmmpmmpp", "ppmmmppp", "pppmmppm",
  ];
  return (
    <svg viewBox="0 0 640 250" className="w-full h-auto" role="img" aria-label="אינאקטיבציה של X: בעובר המוקדם כל תא משתיק באקראי את ה-X מהאם או את ה-X מהאב, וההחלטה עוברת לכל תאי הבת — ולכן ברקמה הבוגרת נוצרים כתמים">
      <text x={500} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK} style={T}>עובר מוקדם: בחירה אקראית בכל תא</text>
      {early.map((k, i) => {
        const cx = 410 + (i % 4) * 60, cy = 75 + Math.floor(i / 4) * 70;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={26} fill="#ffffff" stroke={MUTED} strokeWidth={1.5} />
            <rect x={cx - 12} y={cy - 12} width={6} height={24} rx={3} fill={col(k)} />
            <circle cx={cx + 9} cy={cy} r={6} fill={other(k)} opacity={0.9} />
          </g>
        );
      })}
      <path d="M375 110 H 330" stroke={INK} strokeWidth={2} markerEnd="url(#xi-arrow)" />
      <defs><marker id="xi-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill={INK} /></marker></defs>
      <text x={160} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK} style={T}>רקמה בוגרת: כתמים</text>
      {patch.map((rowS, r) => rowS.split("").map((k, c) => (
        <rect key={`${r}${c}`} x={40 + c * 30} y={45 + r * 28} width={28} height={26} rx={4} fill={k === "m" ? "#dbeafe" : "#ffedd5"} stroke={k === "m" ? BLUE : ORANGE} strokeWidth={1} />
      )))}
      <text x={320} y={232} textAnchor="middle" fontSize="12" fill={MUTED} style={T}>מוט = ה-X הפעיל · עיגול קטן = ה-X המושתק (גופיף בר) · כחול = X מהאם · כתום = X מהאב</text>
    </svg>
  );
}

// Complementation test in trans: mutations in different genes complement, in the same gene they don't.
function Complementation() {
  const LT = { fontFamily: "Arial, sans-serif" };
  const RED = "#dc2626", GREEN = "#15803d";
  // One homolog: two genes (boxes) A and B; `bad` marks the mutated gene with an X.
  const homolog = (x: number, y: number, bad: "A" | "B" | "A1" | "A2" | null) => (
    <g>
      <line x1={x} x2={x + 220} y1={y} y2={y} stroke={MUTED} strokeWidth={5} strokeLinecap="round" />
      {(["A", "B"] as const).map((g, i) => {
        const gx = x + 30 + i * 110;
        const hit = bad === g || (g === "A" && (bad === "A1" || bad === "A2"));
        return (
          <g key={g}>
            <rect x={gx} y={y - 13} width={70} height={26} rx={5} fill={hit ? "#fee2e2" : "#dcfce7"} stroke={hit ? RED : GREEN} strokeWidth={1.5} />
            <text x={gx + 35} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK} style={LT}>{g}</text>
            {hit && <text x={gx + (bad === "A2" ? 58 : bad === "A1" ? 12 : 58)} y={y + 6} textAnchor="middle" fontSize="16" fontWeight="700" fill={RED} style={LT}>×</text>}
          </g>
        );
      })}
    </g>
  );
  const panel = (x: number, title: string, b1: "A" | "A1", b2: "B" | "A2", ok: boolean) => (
    <g>
      <text x={x + 110} y={26} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK} style={T}>{title}</text>
      {homolog(x, 70, b1)}
      {homolog(x, 115, b2)}
      <text x={x + 110} y={160} textAnchor="middle" fontSize="12" fill={MUTED} style={T}>{ok ? "לכל גן יש עותק תקין אחד" : "לגן A אין אף עותק תקין"}</text>
      <text x={x + 110} y={190} textAnchor="middle" fontSize="15" fontWeight="700" fill={ok ? GREEN : RED} style={T}>{ok ? "פנוטיפ תקין — השלמה" : "פנוטיפ מוטנטי — אין השלמה"}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 640 210" className="w-full h-auto" role="img" aria-label="מבחן קומפלמנטציה: כשהמוטציות בשני גנים שונים, לכל גן יש עותק תקין והפנוטיפ תקין. כשהמוטציות בשני מקומות באותו גן, אין עותק תקין של הגן והפנוטיפ מוטנטי">
      {panel(390, "מוטציות בגנים שונים", "A", "B", true)}
      {panel(20, "מוטציות באותו גן", "A1", "A2", false)}
      <line x1={320} x2={320} y1={10} y2={200} stroke="#e2e8f0" strokeWidth={1.5} />
    </svg>
  );
}

// Dihybrid YyRr × YyRr as two independent 3:1 splits → 9:3:3:1.
function ForkedLine() {
  const LT = { fontFamily: "Arial, sans-serif" };
  const row = (y: number, b: string, p: string, label: string) => (
    <g key={y}>
      <line x1={150} y1={y} x2={205} y2={y} stroke={MUTED} strokeWidth={1.5} />
      <text x={215} y={y + 5} fontSize="15" fill={INK} style={LT}>{b}</text>
      <text x={330} y={y + 5} fontSize="15" fontWeight="700" fill={BLUE} style={LT}>{p}</text>
      <text x={400} y={y + 5} fontSize="13" fill={MUTED} style={T}>{label}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 520 260" className="w-full h-auto" role="img" aria-label="תרשים ענפים: 3/4 צהוב כפול 3/4 חלק נותן 9/16, וכך מתקבל 9:3:3:1">
      <g direction="ltr">
        <text x={20} y={22} fontSize="12" fill={MUTED} style={T}>צבע</text>
        <text x={215} y={22} fontSize="12" fill={MUTED} style={T}>צורה</text>
        <text x={330} y={22} fontSize="12" fill={MUTED} style={T}>הסתברות</text>
        <text x={20} y={80} fontSize="15" fontWeight="700" fill={INK} style={LT}>¾ Y_</text>
        <text x={20} y={190} fontSize="15" fontWeight="700" fill={INK} style={LT}>¼ yy</text>
        <path d="M80 75 L150 55 M80 75 L150 105 M80 185 L150 165 M80 185 L150 215" stroke={MUTED} strokeWidth={1.5} fill="none" />
        {row(55, "¾ R_", "9/16", "צהוב, חלק")}
        {row(105, "¼ rr", "3/16", "צהוב, מקומט")}
        {row(165, "¾ R_", "3/16", "ירוק, חלק")}
        {row(215, "¼ rr", "1/16", "ירוק, מקומט")}
      </g>
      <text x={260} y={250} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK} style={T}>כל ענף: מכפלת ההסתברויות לאורכו (כלל הכפל)</text>
    </svg>
  );
}

// ── Pedigree drawing kit ──────────────────────────────────────────────────
type Person = { x: number; y: number; sex: "m" | "f"; state?: "affected" | "carrier"; proband?: boolean; label?: string };
const R = 15;
function PersonMark({ p }: { p: Person }) {
  const fill = p.state === "affected" ? INK : "#fff";
  const shape = p.sex === "m"
    ? <rect x={p.x - R} y={p.y - R} width={2 * R} height={2 * R} fill={fill} stroke={INK} strokeWidth={2} />
    : <circle cx={p.x} cy={p.y} r={R} fill={fill} stroke={INK} strokeWidth={2} />;
  return (
    <g>
      {shape}
      {p.state === "carrier" && <circle cx={p.x} cy={p.y} r={4.5} fill={INK} />}
      {p.proband && <path d={`M${p.x - 34} ${p.y + 26} L${p.x - 18} ${p.y + 12}`} stroke={ORANGE} strokeWidth={2.5} markerEnd="url(#pd-arrow)" />}
      {p.label && <text x={p.x} y={p.y + R + 16} textAnchor="middle" fontSize="11" fill={MUTED} style={{ fontFamily: "Arial, sans-serif" }}>{p.label}</text>}
    </g>
  );
}
// Couple line + drop line to a sibship bar over the children.
function Family({ a, b, kids }: { a: Person; b: Person; kids: Person[] }) {
  const midX = (a.x + b.x) / 2, barY = kids[0].y - R - 18;
  const xs = kids.map((k) => k.x);
  return (
    <g stroke={INK} strokeWidth={1.8} fill="none">
      <line x1={a.x + R} y1={a.y} x2={b.x - R} y2={b.y} />
      <line x1={midX} y1={a.y} x2={midX} y2={barY} />
      <line x1={Math.min(...xs)} y1={barY} x2={Math.max(...xs)} y2={barY} />
      {kids.map((k) => <line key={k.x} x1={k.x} y1={barY} x2={k.x} y2={k.y - R} />)}
    </g>
  );
}
function Legend({ y }: { y: number }) {
  const items: [Person, string][] = [
    [{ x: 0, y: 0, sex: "m" }, "זכר"], [{ x: 0, y: 0, sex: "f" }, "נקבה"],
    [{ x: 0, y: 0, sex: "m", state: "affected" }, "חולה"], [{ x: 0, y: 0, sex: "f", state: "carrier" }, "נשא/ית"],
  ];
  return (
    <g>
      {items.map(([p, t], i) => (
        <g key={t} transform={`translate(${470 - i * 110} ${y}) scale(0.7)`}>
          <PersonMark p={p} />
          <text x={-26} y={6} textAnchor="start" direction="rtl" fontSize="17" fill={INK} style={T}>{t}</text>
        </g>
      ))}
    </g>
  );
}
const PdDefs = () => (
  <defs><marker id="pd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill={ORANGE} /></marker></defs>
);
const Gen = ({ y, n }: { y: number; n: string }) => <text x={540} y={y + 5} textAnchor="end" direction="ltr" fontSize="14" fontWeight="700" fill={MUTED} style={{ fontFamily: "Georgia, serif" }}>{n}</text>;

// Autosomal recessive: two carrier parents, one affected child (the proband).
function PedigreeAR() {
  const f1: Person = { x: 220, y: 50, sex: "m", state: "carrier", label: "I-1" }, m1: Person = { x: 320, y: 50, sex: "f", state: "carrier", label: "I-2" };
  const kids: Person[] = [
    { x: 150, y: 150, sex: "m", label: "II-1" }, { x: 230, y: 150, sex: "f", state: "affected", proband: true, label: "II-2" },
    { x: 310, y: 150, sex: "m", label: "II-3" }, { x: 390, y: 150, sex: "f", label: "II-4" },
  ];
  return (
    <svg viewBox="0 0 560 250" className="w-full h-auto" role="img" aria-label="שושלת של מחלה אוטוזומלית רצסיבית: שני הורים נשאים, בת חולה ושלושה אחים בריאים">
      <PdDefs /><Gen y={50} n="I" /><Gen y={150} n="II" />
      <Family a={f1} b={m1} kids={kids} />
      {[f1, m1, ...kids].map((p) => <PersonMark key={p.label} p={p} />)}
      <Legend y={225} />
    </svg>
  );
}

// X-linked recessive: carrier grandmother → affected son and carrier daughter → affected grandson.
function PedigreeXR() {
  const g1: Person = { x: 250, y: 40, sex: "m", label: "I-1" }, g2: Person = { x: 330, y: 40, sex: "f", state: "carrier", label: "I-2" };
  const kids: Person[] = [
    { x: 150, y: 130, sex: "m", state: "affected", label: "II-1" }, { x: 250, y: 130, sex: "f", state: "carrier", label: "II-2" },
    { x: 410, y: 130, sex: "f", label: "II-4" },
  ];
  const spouse: Person = { x: 330, y: 130, sex: "m", label: "II-3" };
  // II-2 and her husband II-3 sit side by side; their children below.
  const grand: Person[] = [
    { x: 210, y: 220, sex: "m", state: "affected", proband: true, label: "III-1" }, { x: 290, y: 220, sex: "f", label: "III-2" },
    { x: 370, y: 220, sex: "m", label: "III-3" },
  ];
  return (
    <svg viewBox="0 0 560 320" className="w-full h-auto" role="img" aria-label="שושלת של מחלה תאוחזת X רצסיבית: סבתא נשאית, בן חולה, בת נשאית ונכד חולה; אין חולות">
      <PdDefs /><Gen y={40} n="I" /><Gen y={130} n="II" /><Gen y={220} n="III" />
      <Family a={g1} b={g2} kids={[kids[0], kids[1], kids[2]]} />
      <Family a={kids[1]} b={spouse} kids={grand} />
      {[g1, g2, ...kids, spouse, ...grand].map((p) => <PersonMark key={p.label} p={p} />)}
      <Legend y={295} />
    </svg>
  );
}

// Figure ids must be unique across the per-course maps — a later spread silently replaces an earlier figure
// (this happened with "z-scheme", "calvin-cycle" and "lambda-switch"). Fail loudly instead.
const FIGURE_SETS = { BIOCHEM_FIGURES, METABOLIC_FIGURES, MOLECULAR_FIGURES, CELL_FIGURES, GENE_EXPRESSION_FIGURES, PHYSIOLOGY_FIGURES, MICRO_FIGURES, PLANT_FIGURES };
{
  const seen = new Map<string, string>();
  for (const [set, figs] of Object.entries(FIGURE_SETS)) for (const id of Object.keys(figs)) {
    if (seen.has(id)) throw new Error(`Duplicate figure id "${id}" in ${seen.get(id)} and ${set}`);
    seen.set(id, set);
  }
}

const FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  crossover: { el: Crossover, captionHe: "איור 1 — שחלוף יחיד בין שני גנים בתאחיזה במצב cis. השחלוף מערב רק שתיים מארבע הכרומטידות, ולכן מתוך מיוזה כזו רק מחצית מהתוצרים רקומביננטיים. כחול וכתום מציינים את מקור המקטעים בשני ההומולוגים; הסימון המקווקו מציין את אתר ההחלפה. סכמטי, לא בקנה מידה." },
  punnett: { el: Punnett, captionHe: "ריבוע פאנט להצלבה Aa × Aa. כל הורה יוצר שני סוגי גמטות בהסתברות שווה; שלוש מתוך ארבע המשבצות נושאות לפחות אלל A אחד — ולכן 3 סגולים : 1 לבן." },
  "forked-line": { el: ForkedLine, captionHe: "תרשים ענפים להצלבה YyRr × YyRr, בהנחת מיון בלתי תלוי ודומיננטיות מלאה בשתי התכונות. בכל תכונה יחס הפנוטיפים הצפוי הוא 3 : 1; מכפלת ההסתברויות לאורך הענפים נותנת 9 : 3 : 3 : 1 — בלי לצייר ריבוע של 16 משבצות." },
  "pedigree-ar": { el: PedigreeAR, captionHe: "שושלת של מחלה אוטוזומלית רצסיבית. שני ההורים בריאים ונשאים (I-1, I-2); בתם II-2 חולה (החץ מסמן את הפרובנד). לכל ילד בריא שלהם סיכוי של 2/3 להיות נשא." },
  "pedigree-xr": { el: PedigreeXR, captionHe: "שושלת של מחלה תאוחזת X רצסיבית. הסבתא I-2 נשאית: בנה II-1 חולה, ובתה II-2 נשאית שמעבירה את המחלה לנכד III-1. החולים כולם זכרים, ואין העברה מאב לבן." },
  "dominance-types": { el: DominanceTypes, captionHe: "השוואה סכמטית של שלושה יחסי דומיננטיות, כל אחד בדוגמה נפרדת (פרחים; אנטיגנים על תאי דם). בכל עמודה משווים את ההטרוזיגוט לשני ההומוזיגוטים של אותה דוגמה: בדומיננטיות מלאה הוא כמו AA, בחלקית הוא בין השניים (ורוד), ובקו-דומיננטיות אפשר לזהות את התוצר של כל אחד מהאללים — אנטיגן M וגם N על אותו תא. לכן רק בדומיננטיות מלאה מתקבל ב-F2 יחס 3 : 1. הסימון AA/Aa/aa כללי; במערכת MN הסימון הוא LᴹLᴹ/LᴹLᴺ/LᴺLᴺ." },
  pathway: { el: Pathway, captionHe: "מודל של שני שלבים שדרושים ליצירת פיגמנט סגול — ההסבר המקובל ליחס 9:7 באפון ריחני. כל שלב תלוי בגן אחר; פרט הומוזיגוטי רצסיבי באחד הגנים (cc או pp) חסום באותו שלב ולכן פרחיו לבנים, גם אם הגן השני תקין. במוטנטים של מיקרואורגניזמים, הוספה למצע של חומר שנמצא אחרי החסימה עוקפת אותה. סכמטי." },
  "inversion-types": { el: InversionTypes, captionHe: "שני סוגי אינברסיה. העיגול השחור הוא הצנטרומר, והקטע ההפוך מסומן בכתום. בפאראצנטרית הקטע ההפוך כולו בזרוע אחת; בפריצנטרית הוא כולל את הצנטרומר. כמות החומר הגנטי לא משתנה — רק הסדר. סכמטי." },
  nondisjunction: { el: Nondisjunction, captionHe: "אי-היפרדות של זוג כרומוזומים אחד, במודל בלי שחלוף. כחול וכתום = שני ההומולוגים; לפני ההפרדה כל כרומוזום משוכפל בנוי משתי כרומטידות אחיות שמחוברות בצנטרומר (נקודה שחורה). מימין — במיוזה I ההומולוגים עוברים יחד: כל ארבעת התוצרים לא מאוזנים, ושני תוצרי n+1 נושאים הומולוגים שונים. משמאל — במיוזה II כרומטידות אחיות לא נפרדות באחד התאים: מחצית מהתוצרים תקינים, ותוצר n+1 נושא שתי כרומטידות אחיות של אותו הומולוג. (באואוגנזה רק תוצר אחד הופך לביצית.) סכמטי." },
  "x-inactivation": { el: XInactivation, captionHe: "אינאקטיבציה אקראית של X אצל נקבת יונק שליה. מוקדם בעובר כל תא משתיק באקראי את ה-X שקיבל מהאם (כחול) או מהאב (כתום); ה-X המושתק נדחס לגופיף בר. ההחלטה עוברת לכל תאי הבת, ולכן ברקמה הבוגרת נוצרים כתמים — הצבע מציין איזה X פעיל. בנקבה הטרוזיגוטית זה נראה לעין, למשל בכתמים הכתומים והשחורים של חתולה בדגם שריון-צב. סכמטי." },
  complementation: { el: Complementation, captionHe: "מבחן קומפלמנטציה בצאצא שקיבל מוטציה רצסיבית אחת מכל הורה (מצב trans). כל קו הוא הומולוג; ירוק = עותק תקין של הגן, אדום עם × = עותק מוטנטי. מימין — המוטציות בשני גנים שונים: לכל גן יש עותק תקין, ולכן הפנוטיפ תקין. משמאל — שתי המוטציות באותו גן, במקומות שונים: אין עותק תקין של הגן, ולכן הפנוטיפ מוטנטי. (במודל הפשוט, בלי חריגים.) סכמטי." },
  ...BIOCHEM_FIGURES,
  ...METABOLIC_FIGURES,
  ...MOLECULAR_FIGURES,
  ...CELL_FIGURES,
  ...GENE_EXPRESSION_FIGURES,
  ...PHYSIOLOGY_FIGURES,
  ...MICRO_FIGURES,
  ...PLANT_FIGURES,
  map: { el: GeneMap, captionHe: "איור 2 — המפה מהדוגמה התלת-נקודתית: A–C–B. בהזנחת שחלופים מרובים שלא זוהו, המרחקים הם 10 ו-20 cM וסכומם 30 cM. תדירות הרקומבינציה הנמדדת ישירות בין A ל-B היא רק 28%." },
};

export default function LessonFigure({ id }: { id: string }) {
  const f = FIGURES[id];
  if (!f) return null;
  const El = f.el;
  return (
    <figure className="my-6 rounded-xl border border-line bg-surface-2 p-3">
      <div className="rounded-lg bg-white p-2"><El /></div>
      <figcaption className="mt-2 px-1 text-xs leading-6 text-muted">{f.captionHe}</figcaption>
    </figure>
  );
}
