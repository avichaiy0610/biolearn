/* Drawn figures for study units, referenced from lesson bodies as [[figure:<id>]].
   Drawn on a white panel (like the animations) so they read the same in dark mode. */

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

const FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  crossover: { el: Crossover, captionHe: "איור 1 — שחלוף יחיד בין שני גנים בתאחיזה במצב cis. השחלוף מערב רק שתיים מארבע הכרומטידות, ולכן מתוך מיוזה כזו רק מחצית מהתוצרים רקומביננטיים. כחול וכתום מציינים את מקור המקטעים בשני ההומולוגים; הסימון המקווקו מציין את אתר ההחלפה. סכמטי, לא בקנה מידה." },
  punnett: { el: Punnett, captionHe: "ריבוע פאנט להצלבה Aa × Aa. כל הורה יוצר שני סוגי גמטות בהסתברות שווה; שלוש מתוך ארבע המשבצות נושאות לפחות אלל A אחד — ולכן 3 סגולים : 1 לבן." },
  "forked-line": { el: ForkedLine, captionHe: "תרשים ענפים להצלבה YyRr × YyRr, בהנחת מיון בלתי תלוי ודומיננטיות מלאה בשתי התכונות. בכל תכונה יחס הפנוטיפים הצפוי הוא 3 : 1; מכפלת ההסתברויות לאורך הענפים נותנת 9 : 3 : 3 : 1 — בלי לצייר ריבוע של 16 משבצות." },
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
