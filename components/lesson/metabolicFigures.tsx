/* Figures for the metabolic-pathways units (Technion 134113). Pathways are drawn from data with two
   generic layouts — a vertical chain and a cycle — so every unit shows its pathway the same way.
   Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, Axes, BLUE, GREEN, INK, LINE, MUTED, ORANGE, He, La, curve, dash, scale } from "./biochemFigures";

const PURPLE = "#7c3aed";

// ── Generic layouts ──────────────────────────────────────────────────────────
// A metabolite box, label centered.
export function Box({ x, y, w, h = 30, label, color = BLUE, fill = "#eff6ff", size = 14, bold = false }: { x: number; y: number; w: number; h?: number; label: React.ReactNode; color?: string; fill?: string; size?: number; bold?: boolean }) {
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={h} rx={8} fill={fill} stroke={color} strokeWidth={1.8} />
      <He x={x} y={y + h / 2 + size * 0.36} size={size} bold={bold}>{label}</He>
    </g>
  );
}
export function Arrow({ x1, y1, x2, y2, color = INK, width = 1.8, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; width?: number; dashed?: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} markerEnd={width > 2.2 ? "url(#bfArrowS)" : "url(#bfArrow)"} {...(dashed ? dash : {})} />;
}

export type Step = { m: string; e?: string; s?: string; key?: boolean };
// Vertical chain: box for each metabolite; the arrow under step i carries its enzyme (right) and cofactors (left).
export function Chain({ x, y, w, steps, pitch = 64, size = 13 }: { x: number; y: number; w: number; steps: Step[]; pitch?: number; size?: number }) {
  return (
    <g>
      {steps.map((st, i) => {
        const top = y + i * pitch;
        const next = steps[i + 1];
        return (
          <g key={i}>
            <Box x={x} y={top} w={w} label={st.m} size={size} />
            {next && (
              <g>
                <Arrow x1={x} y1={top + 31} x2={x} y2={top + pitch - 2} color={st.key ? ORANGE : INK} width={st.key ? 3 : 1.8} />
                {st.e && <He x={x + 14} y={top + 30 + (pitch - 30) / 2 + 5} anchor="start" size={12} color={st.key ? ORANGE : MUTED} bold={st.key}>{st.e}</He>}
                {st.s && <La x={x - 14} y={top + 30 + (pitch - 30) / 2 + 5} anchor="end" size={11.5} color={MUTED}>{st.s}</La>}
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

export type Edge = { inner?: string; outer?: string; key?: boolean };
// Cycle: nodes on a circle (clockwise from the top); edge i goes node i → node i+1.
export function Cycle({ cx, cy, r, nodes, edges, w = 104, size = 12.5, innerR = 0.55, outerR = 1.32, rot = 0, ry }: { cx: number; cy: number; r: number; ry?: number; nodes: string[]; edges: Edge[]; w?: number; size?: number; innerR?: number; outerR?: number; rot?: number }) {
  const n = nodes.length;
  const k = (ry ?? r) / r; // vertical stretch (ellipse)
  const pos = (i: number, rr = r) => { const a = (-90 + rot + (i * 360) / n) * Math.PI / 180; return [cx + rr * Math.cos(a), cy + k * rr * Math.sin(a)]; };
  const mid = (i: number, rr: number) => { const a = (-90 + rot + ((i + 0.5) * 360) / n) * Math.PI / 180; return [cx + rr * Math.cos(a), cy + k * rr * Math.sin(a)]; };
  return (
    <g>
      {nodes.map((_, i) => {
        const [x1, y1] = pos(i), [x2, y2] = pos((i + 1) % n);
        const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
        // shorten so the arrow starts/ends outside the boxes (box half-diagonal ≈ w/2 horizontally, 15 vertically)
        const cut = (ux: number, uy: number) => Math.min(Math.abs((w / 2 + 4) / (ux || 1e-6)), Math.abs(19 / (uy || 1e-6)));
        const ux = dx / L, uy = dy / L, c = cut(ux, uy);
        const e = edges[i] ?? {};
        const [ix, iy] = mid(i, r * innerR), [ox, oy] = mid(i, r * outerR);
        return (
          <g key={`e${i}`}>
            <Arrow x1={x1 + ux * c} y1={y1 + uy * c} x2={x2 - ux * c} y2={y2 - uy * c} color={e.key ? ORANGE : INK} width={e.key ? 3 : 1.8} />
            {e.inner && <He x={ix} y={iy + 4} size={10.5} color={e.key ? ORANGE : MUTED} bold={e.key}>{e.inner}</He>}
            {e.outer && <He x={ox} y={oy + 4} size={11.5} color={GREEN} bold>{e.outer}</He>}
          </g>
        );
      })}
      {nodes.map((m, i) => { const [x, y] = pos(i); return <Box key={m} x={x} y={y - 15} w={w} label={m} size={size} />; })}
    </g>
  );
}

// ── met-concepts ─────────────────────────────────────────────────────────────
function CatabolismStages() {
  const col = [95, 240, 385];
  return (
    <svg viewBox="0 0 480 330" className="w-full h-auto" role="img" aria-label="שלושת שלבי הפקת האנרגיה מהמזון: פירוק מקרומולקולות ליחידות, פירוק היחידות לאצטיל-CoA, וחמצון במעגל החומצה הציטרית ובזרחון חמצוני">
      <ArrowDefs />
      {[["חלבונים", "חומצות אמינו"], ["רב-סוכרים", "סוכרים פשוטים"], ["שומנים", "חומצות שומן וגליצרול"]].map(([a, b], i) => (
        <g key={a}>
          <Box x={col[i]} y={16} w={130} label={a} />
          <Arrow x1={col[i]} y1={47} x2={col[i]} y2={88} />
          <Box x={col[i]} y={90} w={140} label={b} size={12.5} />
          <Arrow x1={col[i]} y1={121} x2={240 + (col[i] - 240) * 0.25} y2={176} />
        </g>
      ))}
      <Box x={240} y={178} w={150} label="אצטיל-CoA" bold color={ORANGE} fill="#fff7ed" />
      <Arrow x1={240} y1={209} x2={240} y2={238} />
      <Box x={240} y={240} w={300} label="מעגל החומצה הציטרית + זרחון חמצוני" />
      <Arrow x1={240} y1={271} x2={240} y2={294} />
      <La x={240} y={312} size={14} bold>CO₂ + H₂O + ATP</La>
      <He x={8} y={62} size={11.5} color={MUTED} anchor="start">שלב 1</He>
      <He x={8} y={150} size={11.5} color={MUTED} anchor="start">שלב 2</He>
      <He x={8} y={260} size={11.5} color={MUTED} anchor="start">שלב 3</He>
    </svg>
  );
}

function EnergyCharge() {
  const s = scale(60, 460, 250, 40, 0, 1, 0, 1);
  const gen = (x: number) => 1 / (1 + Math.exp((x - 0.82) * 22));
  const use = (x: number) => 1 / (1 + Math.exp(-(x - 0.78) * 22));
  return (
    <svg viewBox="0 0 480 310" className="w-full h-auto" role="img" aria-label="קצב יחסי של מסלולים שמייצרים ATP ושל מסלולים שצורכים ATP כפונקציה של המטען האנרגטי; שתי העקומות נחתכות סביב 0.8–0.9">
      <rect x={s.sx(0.8)} y={40} width={s.sx(0.95) - s.sx(0.8)} height={210} fill="#f1f5f9" />
      <Axes x0={60} y0={250} x1={460} y1={40}
        xLabel={<He x={260} y={296} size={14}>מטען אנרגטי</He>}
        yLabel={<He x={64} y={26} anchor="start" size={14}>קצב יחסי</He>} />
      {[0, 0.25, 0.5, 0.75, 1].map((v) => <La key={v} x={s.sx(v)} y={268} size={12.5} color={MUTED}>{v}</La>)}
      <path d={curve(gen, 0, 1, s)} fill="none" stroke={BLUE} strokeWidth={3} />
      <path d={curve(use, 0, 1, s)} fill="none" stroke={ORANGE} strokeWidth={3} />
      <He x={s.sx(0.32)} y={s.sy(0.9)} size={13} color={BLUE} bold>מסלולים שמייצרים ATP</He>
      <He x={s.sx(0.32)} y={s.sy(0.9) + 17} size={12} color={BLUE}>(קטבוליים)</He>
      <He x={s.sx(0.4)} y={s.sy(0.18)} size={13} color={ORANGE} bold>מסלולים שצורכים ATP</He>
      <He x={s.sx(0.4)} y={s.sy(0.18) + 17} size={12} color={ORANGE}>(אנבוליים)</He>
      <He x={s.sx(0.875)} y={34} size={11.5} color={MUTED}>הטווח בתאים</He>
    </svg>
  );
}

// ── Glycolysis & gluconeogenesis ─────────────────────────────────────────────
const GLY: Step[] = [
  { m: "גלוקוז", e: "הקסוקינאז", s: "ATP → ADP", key: true },
  { m: "גלוקוז-6-פוספט", e: "פוספוגלוקוז איזומראז" },
  { m: "פרוקטוז-6-פוספט", e: "PFK — השלב המחייב", s: "ATP → ADP", key: true },
  { m: "פרוקטוז-1,6-ביספוספט", e: "אלדולאז (+ טריוז פ. איזומראז)" },
  { m: "2 × GAP", e: "GAP דהידרוגנאז", s: "2 NAD⁺ → 2 NADH" },
  { m: "2 × 1,3-ביספוספוגליצרט", e: "פוספוגליצרט קינאז", s: "2 ADP → 2 ATP" },
  { m: "2 × 3-פוספוגליצרט", e: "פוספוגליצרט מוטאז" },
  { m: "2 × 2-פוספוגליצרט", e: "אנולאז", s: "− 2 H₂O" },
  { m: "2 × PEP", e: "פירובט קינאז", s: "2 ADP → 2 ATP", key: true },
  { m: "2 × פירובט" },
];
function GlycolysisPathway() {
  return (
    <svg viewBox="0 0 480 660" className="w-full h-auto" role="img" aria-label="עשר התגובות של הגליקוליזה מגלוקוז לשתי מולקולות פירובט; שלוש התגובות הבלתי הפיכות מודגשות">
      <ArrowDefs />
      <Chain x={190} y={8} w={200} steps={GLY} pitch={64} />
      <He x={470} y={140} size={12} color={MUTED} anchor="end">שלב ההשקעה: 2 ATP</He>
      <He x={470} y={460} size={12} color={MUTED} anchor="end">שלב הרווח: 4 ATP</He>
    </svg>
  );
}

function GluconeoBypasses() {
  const rows = ["גלוקוז", "גלוקוז-6-פוספט", "פרוקטוז-6-פוספט", "פרוקטוז-1,6-ביספוספט", "תגובות הפיכות משותפות", "PEP"];
  const y = (i: number) => 14 + i * 66;
  const L = 160, R = 320;
  return (
    <svg viewBox="0 0 480 540" className="w-full h-auto" role="img" aria-label="גליקוליזה וגלוקונאוגנזה: שלוש התגובות הבלתי הפיכות של הגליקוליזה (משמאל) נעקפות בגלוקונאוגנזה בארבעה אנזימים (מימין)">
      <ArrowDefs />
      {rows.map((m, i) => <Box key={m} x={240} y={y(i)} w={i === 4 ? 210 : 190} label={m} size={12.5} fill={i === 4 ? "#f8fafc" : "#eff6ff"} color={i === 4 ? LINE : BLUE} />)}
      <Box x={240} y={y(7)} w={150} label="פירובט" />
      <Box x={400} y={y(6) + 2} w={120} label="אוקסלואצטט" size={12} color={GREEN} fill="#f0fdf4" />
      {/* glycolysis — left, down */}
      {[[0, "הקסוקינאז"], [2, "PFK"]].map(([i, n]) => (
        <g key={n as string}>
          <Arrow x1={L} y1={y(i as number) + 31} x2={L} y2={y((i as number) + 1) - 2} color={ORANGE} width={2.6} />
          <He x={L - 10} y={y(i as number) + 52} anchor="end" size={12} color={ORANGE} bold>{n as string}</He>
        </g>
      ))}
      <Arrow x1={L} y1={y(5) + 31} x2={L} y2={y(7) - 2} color={ORANGE} width={2.6} />
      <He x={L - 10} y={y(6) + 20} anchor="end" size={12} color={ORANGE} bold>פירובט קינאז</He>
      {/* gluconeogenesis — right, up */}
      {[[0, "גלוקוז-6-פוספטאז"], [2, "פרוקטוז-1,6-ביספוספטאז"]].map(([i, n]) => (
        <g key={n as string}>
          <Arrow x1={R} y1={y((i as number) + 1) - 2} x2={R} y2={y(i as number) + 33} color={GREEN} width={2.6} />
          <He x={R + 16} y={y(i as number) + 52} anchor="start" size={11.5} color={GREEN} bold>{n as string}</He>
        </g>
      ))}
      <Arrow x1={300} y1={y(7) + 8} x2={360} y2={y(6) + 34} color={GREEN} width={2.6} />
      <He x={352} y={y(7) + 26} anchor="start" size={11.5} color={GREEN} bold>פירובט קרבוקסילאז</He>
      <Arrow x1={400} y1={y(6) + 2} x2={318} y2={y(5) + 30} color={GREEN} width={2.6} />
      <La x={372} y={y(5) + 40} anchor="start" size={12} color={GREEN} bold>PEPCK</La>
      {/* reversible middle */}
      <line x1={240} y1={y(3) + 31} x2={240} y2={y(4) - 1} stroke={INK} strokeWidth={1.8} markerStart="url(#bfArrow)" markerEnd="url(#bfArrow)" />
      <line x1={240} y1={y(4) + 31} x2={240} y2={y(5) - 1} stroke={INK} strokeWidth={1.8} markerStart="url(#bfArrow)" markerEnd="url(#bfArrow)" />
      <line x1={240} y1={y(1) + 31} x2={240} y2={y(2) - 1} stroke={INK} strokeWidth={1.8} markerStart="url(#bfArrow)" markerEnd="url(#bfArrow)" />
      <He x={70} y={530} size={12} color={ORANGE} bold>גליקוליזה ↓</He>
      <He x={410} y={530} size={12} color={GREEN} bold>גלוקונאוגנזה ↑</He>
    </svg>
  );
}

function F26bpSwitch() {
  const fast: Step[] = [{ m: "גלוקוז בדם נמוך" }, { m: "גלוקגון → cAMP → PKA" }, { m: "האנזים הדו-תפקידי מזורחן" }, { m: "F-2,6-BP יורד" }, { m: "PFK ↓  FBPase-1 ↑" }, { m: "גלוקונאוגנזה" }];
  const fed: Step[] = [{ m: "גלוקוז בדם גבוה" }, { m: "פחות גלוקגון, יותר אינסולין" }, { m: "הפוספט מוסר" }, { m: "F-2,6-BP עולה" }, { m: "PFK ↑  FBPase-1 ↓" }, { m: "גליקוליזה" }];
  return (
    <svg viewBox="0 0 480 400" className="w-full h-auto" role="img" aria-label="פרוקטוז-2,6-ביספוספט כמתג בכבד: בצום גלוקגון מוריד אותו ומעביר לגלוקונאוגנזה; אחרי ארוחה הוא עולה ומעביר לגליקוליזה">
      <ArrowDefs />
      <He x={360} y={20} bold color={GREEN}>צום</He>
      <He x={120} y={20} bold color={BLUE}>אחרי ארוחה</He>
      <Chain x={360} y={32} w={220} steps={fast} pitch={60} size={12.5} />
      <Chain x={120} y={32} w={220} steps={fed} pitch={60} size={12.5} />
    </svg>
  );
}

// ── Citric acid cycle ────────────────────────────────────────────────────────
function TcaCycle() {
  const nodes = ["אוקסלואצטט", "ציטראט", "איזוציטראט", "α-קטוגלוטרט", "סוקציניל-CoA", "סוקצינט", "פומרט", "מאלאט"];
  const edges: Edge[] = [
    { inner: "ציטראט סינתאז", outer: "+ אצטיל-CoA" }, { inner: "אקוניטאז" },
    { inner: "איזוציטראט DH", outer: "NADH + CO₂", key: true }, { inner: "α-KG DH", outer: "NADH + CO₂", key: true },
    { inner: "סינתטאז", outer: "GTP" }, { inner: "סוקצינט DH", outer: "FADH₂" },
    { inner: "פומראז", outer: "+ H₂O" }, { inner: "מאלאט DH", outer: "NADH" },
  ];
  return (
    <svg viewBox="0 0 480 580" className="w-full h-auto" role="img" aria-label="מעגל החומצה הציטרית: שמונה שלבים מאוקסלואצטט וחזרה; נוצרים 3 NADH, FADH2 אחד, GTP אחד ו-2 CO2">
      <ArrowDefs />
      <Cycle cx={240} cy={258} r={172} ry={200} nodes={nodes} edges={edges} w={104} size={12} innerR={0.64} outerR={1.17} rot={-22.5} />
      <He x={240} y={548} size={13} bold>לכל סיבוב:</He>
      <La x={240} y={568} size={12.5}>3 NADH · 1 FADH₂ · 1 GTP · 2 CO₂</La>
    </svg>
  );
}

// ── Oxidative phosphorylation ────────────────────────────────────────────────
function EtcMembrane() {
  const mY = 150, mH = 70;
  const cx = [62, 150, 236, 330, 425];
  const pump = (x: number, n: string) => (<g><Arrow x1={x} y1={mY + mH + 6} x2={x} y2={mY - 34} color={ORANGE} width={2.2} /><La x={x + 4} y={mY - 40} anchor="middle" size={12.5} color={ORANGE} bold>{n}</La></g>);
  return (
    <svg viewBox="0 0 480 360" className="w-full h-auto" role="img" aria-label="שרשרת הנשימה בממברנה הפנימית של המיטוכונדריה: קומפלקסים I, III ו-IV שואבים פרוטונים, קומפלקס II לא; Q וציטוכרום c נושאים אלקטרונים; ATP סינתאז מייצר ATP מזרימת הפרוטונים חזרה">
      <ArrowDefs />
      <rect x={0} y={mY} width={480} height={mH} fill="#fef3c7" />
      <He x={240} y={22} size={12.5} color={MUTED}>מרווח בין-ממברנלי (H⁺ רבים)</He>
      <He x={240} y={350} size={12.5} color={MUTED}>מטריקס</He>
      {pump(cx[0] - 14, "4H⁺")}{pump(cx[2] - 14, "4H⁺")}{pump(cx[3] - 14, "2H⁺")}
      {[["I", BLUE], ["II", MUTED], ["III", BLUE], ["IV", BLUE]].map(([n, c], i) => (
        <g key={n}><rect x={cx[i] - 30} y={mY - 18} width={60} height={mH + 36} rx={10} fill="#dbeafe" stroke={c} strokeWidth={2} /><La x={cx[i]} y={mY + 42} bold size={16}>{n}</La></g>
      ))}
      {/* ATP synthase */}
      <rect x={cx[4] - 20} y={mY - 4} width={40} height={mH + 8} rx={8} fill="#dcfce7" stroke={GREEN} strokeWidth={2} />
      <circle cx={cx[4]} cy={mY + mH + 34} r={26} fill="#dcfce7" stroke={GREEN} strokeWidth={2} />
      <Arrow x1={cx[4] + 30} y1={mY - 30} x2={cx[4] + 30} y2={mY + mH + 4} color={ORANGE} width={2.2} />
      <La x={cx[4] + 34} y={mY - 36} size={12.5} color={ORANGE} bold>H⁺</La>
      <La x={cx[4]} y={mY + mH + 30} size={10.5} color={GREEN} bold>ADP+Pᵢ</La>
      <La x={cx[4]} y={mY + mH + 44} size={10.5} color={GREEN} bold>→ ATP</La>
      {/* Q and cyt c */}
      <circle cx={193} cy={mY + 35} r={13} fill="#fde68a" stroke="#b45309" strokeWidth={1.5} /><La x={193} y={mY + 40} size={12.5} bold>Q</La>
      <circle cx={283} cy={mY - 30} r={14} fill="#fecaca" stroke="#b91c1c" strokeWidth={1.5} /><La x={283} y={mY - 26} size={10.5} bold>cyt c</La>
      {/* electron path */}
      <path d={`M${cx[0]} ${mY + mH + 50} L${cx[0]} ${mY + mH + 20}`} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <La x={cx[0]} y={mY + mH + 66} size={12.5} bold>NADH</La>
      <path d={`M${cx[1]} ${mY + mH + 50} L${cx[1]} ${mY + mH + 20}`} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <La x={cx[1]} y={mY + mH + 66} size={12} bold>FADH₂</La>
      <He x={cx[1]} y={mY + mH + 82} size={10.5} color={MUTED}>(מסוקצינט)</He>
      <path d={`M${cx[0] + 30} ${mY + 58} Q${cx[1]} ${mY + 100} 186 ${mY + 47}`} fill="none" stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <path d={`M${cx[1] + 30} ${mY + 44} L182 ${mY + 38}`} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <path d={`M206 ${mY + 35} L${cx[2] - 30} ${mY + 35}`} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <path d={`M${cx[2] + 18} ${mY - 18} L270 ${mY - 30}`} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <path d={`M297 ${mY - 30} L${cx[3] - 16} ${mY - 18}`} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <path d={`M${cx[3]} ${mY + mH + 18} L${cx[3]} ${mY + mH + 46}`} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <La x={cx[3]} y={mY + mH + 62} size={12} bold>O₂ → H₂O</La>
    </svg>
  );
}

// ── Photosynthesis ───────────────────────────────────────────────────────────
function ZScheme() {
  // x along the chain, y = energy (up = more reducing)
  const pts: [number, number, string][] = [
    [40, 300, "H₂O"], [100, 260, "P680"], [100, 70, "P680*"], [160, 120, "PQ"], [220, 165, "cyt bf"], [270, 200, "PC"],
    [320, 225, "P700"], [320, 30, "P700*"], [380, 70, "Fd"], [415, 105, "NADP⁺"],
  ];
  const seg = (a: number, b: number, color = INK, w = 1.8) => <Arrow key={`${a}-${b}`} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} color={color} width={w} />;
  return (
    <svg viewBox="0 0 480 340" className="w-full h-auto" role="img" aria-label="סכמת Z: אור מעורר את P680 ואת P700; האלקטרונים עוברים ממים דרך פלסטוקינון, ציטוכרום bf ופלסטוציאנין ובסוף ל-NADP+">
      <ArrowDefs />
      {seg(0, 1)}{seg(1, 2, ORANGE, 3.5)}{seg(2, 3)}{seg(3, 4)}{seg(4, 5)}{seg(5, 6)}{seg(6, 7, ORANGE, 3.5)}{seg(7, 8)}{seg(8, 9)}
      {pts.map(([x, y, l]) => {
        const below = l === "H₂O" || l === "P680" || l === "P700";
        const side = !below && !l.endsWith("*");
        return <La key={l} x={side ? x + 8 : x} y={below ? y + 20 : side ? y - 10 : y - 10} anchor={side ? "start" : "middle"} size={12.5} bold>{l}</La>;
      })}
      <He x={78} y={170} size={12} color={ORANGE} bold anchor="end">אור</He>
      <He x={298} y={130} size={12} color={ORANGE} bold anchor="end">אור</He>
      <He x={100} y={300} size={12} color={MUTED}>PS II</He>
      <He x={320} y={262} size={12} color={MUTED}>PS I</He>
      <La x={40} y={338} size={11.5} color={MUTED}>→ O₂ + 4H⁺</La>
      <He x={215} y={210} size={11.5} color={MUTED}>H⁺ נשאבים ללומן</He>
      <He x={470} y={20} size={11.5} color={MUTED} anchor="end">↑ אנרגיה (כוח מחזר)</He>
    </svg>
  );
}

function CalvinCycle() {
  return (
    <svg viewBox="0 0 480 400" className="w-full h-auto" role="img" aria-label="מעגל קלווין בשלושה שלבים: קיבוע CO2 על ידי רוביסקו, חיזור ל-GAP בעזרת ATP ו-NADPH, וחידוש ריבולוז-1,5-ביספוספט">
      <ArrowDefs />
      <Cycle cx={240} cy={205} r={130} w={150} size={12.5}
        nodes={["ריבולוז-1,5-ביספוספט", "3-פוספוגליצרט", "GAP"]}
        edges={[{ outer: "1. קיבוע: + CO₂", key: true }, { outer: "2. חיזור: ATP, NADPH" }, { outer: "3. חידוש: ATP" }]}
        outerR={1.4} />
      <He x={240} y={210} size={12} color={ORANGE} bold>רוביסקו</He>
      <Arrow x1={110} y1={290} x2={60} y2={350} color={GREEN} width={2.2} />
      <He x={20} y={375} size={12} color={GREEN} bold anchor="start">חלק מה-GAP → סוכרים</He>
    </svg>
  );
}

// ── Pentose phosphate ────────────────────────────────────────────────────────
function PppOverview() {
  return (
    <svg viewBox="0 0 480 330" className="w-full h-auto" role="img" aria-label="מסלול הפנטוז פוספט: השלב החמצוני מגלוקוז-6-פוספט לריבולוז-5-פוספט עם 2 NADPH, והשלב הלא-חמצוני ההפיך שמחבר פנטוזות לתוצרי ביניים של הגליקוליזה">
      <ArrowDefs />
      <Box x={130} y={18} w={170} label="גלוקוז-6-פוספט" />
      <Arrow x1={130} y1={49} x2={130} y2={120} color={ORANGE} width={3} />
      <He x={140} y={78} anchor="start" size={12} color={ORANGE} bold>השלב החמצוני (G6PD)</He>
      <La x={120} y={98} anchor="end" size={12} color={MUTED}>2 NADP⁺ → 2 NADPH</La>
      <La x={120} y={113} anchor="end" size={12} color={MUTED}>+ CO₂</La>
      <Box x={130} y={122} w={170} label="ריבולוז-5-פוספט" />
      <Arrow x1={130} y1={153} x2={130} y2={190} />
      <Box x={130} y={192} w={170} label="ריבוז-5-פוספט" color={GREEN} fill="#f0fdf4" />
      <Arrow x1={130} y1={223} x2={130} y2={262} color={GREEN} />
      <He x={130} y={282} size={12.5} color={GREEN} bold>נוקלאוטידים, DNA, RNA</He>
      <line x1={218} y1={207} x2={300} y2={207} stroke={INK} strokeWidth={2} markerStart="url(#bfArrow)" markerEnd="url(#bfArrow)" />
      <He x={259} y={196} size={11.5} color={MUTED}>הלא-חמצוני</He>
      <He x={259} y={228} size={11} color={MUTED}>(הפיך)</He>
      <Box x={385} y={170} w={160} label="פרוקטוז-6-פוספט" size={12.5} />
      <Box x={385} y={226} w={160} label="GAP" size={12.5} />
      <Arrow x1={385} y1={257} x2={385} y2={292} />
      <He x={385} y={312} size={12.5} bold>גליקוליזה</He>
      <path d="M385 170 Q385 40 220 33" fill="none" stroke={MUTED} strokeWidth={1.6} {...dash} markerEnd="url(#bfArrow)" />
      <He x={400} y={70} size={11} color={MUTED} anchor="start">גלוקונאוגנזה</He>
      <He x={400} y={86} size={11} color={MUTED} anchor="start">(כשצריך רק NADPH)</He>
    </svg>
  );
}

// ── Glycogen ─────────────────────────────────────────────────────────────────
function GlycogenHormones() {
  const breakdown: Step[] = [{ m: "גלוקגון (כבד), אדרנלין" }, { m: "cAMP" }, { m: "PKA" }, { m: "פוספורילאז קינאז" }, { m: "פוספורילאז b → a" }, { m: "פירוק גליקוגן ↑" }];
  const synth: Step[] = [{ m: "אינסולין" }, { m: "מפל קינאזות" }, { m: "GSK3 מושבת" }, { m: "PP1 פעיל" }, { m: "גליקוגן סינתאז פעיל" }, { m: "בניית גליקוגן ↑" }];
  return (
    <svg viewBox="0 0 480 420" className="w-full h-auto" role="img" aria-label="בקרה הורמונלית על הגליקוגן: גלוקגון ואדרנלין דרך cAMP ו-PKA מפעילים את הפוספורילאז ומשביתים את הסינתאז; אינסולין דרך GSK3 ו-PP1 מפעיל את הסינתאז">
      <ArrowDefs />
      <He x={360} y={18} bold color={ORANGE}>פירוק</He>
      <He x={120} y={18} bold color={GREEN}>בנייה</He>
      <Chain x={360} y={30} w={200} steps={breakdown} pitch={58} size={12.5} />
      <Chain x={120} y={30} w={200} steps={synth} pitch={58} size={12.5} />
      <path d="M260 160 Q240 220 220 262" fill="none" stroke={ORANGE} strokeWidth={2} {...dash} />
      <line x1={212} y1={262} x2={228} y2={262} stroke={ORANGE} strokeWidth={3} />
      <He x={240} y={392} size={12} color={ORANGE}>PKA גם מזרחן ומשבית את הסינתאז (קו מקווקו)</He>
      <He x={240} y={410} size={11.5} color={MUTED}>זרחון: פוספורילאז פעיל, סינתאז מושבת</He>
    </svg>
  );
}

// ── Fatty acids ──────────────────────────────────────────────────────────────
function BetaOxidation() {
  const steps: Step[] = [
    { m: "אציל-CoA (n פחמנים)", e: "אציל-CoA דהידרוגנאז", s: "FAD → FADH₂" },
    { m: "trans-Δ²-אנואיל-CoA", e: "אנואיל-CoA הידרטאז", s: "+ H₂O" },
    { m: "3-הידרוקסיאציל-CoA", e: "3-הידרוקסיאציל-CoA DH", s: "NAD⁺ → NADH" },
    { m: "3-קטואציל-CoA", e: "β-קטותיולאז", s: "+ CoA" },
    { m: "אציל-CoA (n−2) + אצטיל-CoA" },
  ];
  return (
    <svg viewBox="0 0 480 340" className="w-full h-auto" role="img" aria-label="ארבעת שלבי ה-β-חמצון: חמצון עם FAD, הוספת מים, חמצון עם NAD+ ותיאוליזה; בכל סיבוב יוצא אצטיל-CoA והשרשרת מתקצרת בשני פחמנים">
      <ArrowDefs />
      <Chain x={200} y={8} w={230} steps={steps} pitch={66} />
      <path d={`M85 ${8 + 4 * 66 + 15} Q20 ${8 + 2 * 66} 85 23`} fill="none" stroke={GREEN} strokeWidth={2} markerEnd="url(#bfArrow)" {...dash} />
      <He x={12} y={150} size={12} color={GREEN} bold anchor="start">הסיבוב</He>
      <He x={12} y={166} size={12} color={GREEN} bold anchor="start">הבא</He>
    </svg>
  );
}

function FaRegulation() {
  return (
    <svg viewBox="0 0 480 300" className="w-full h-auto" role="img" aria-label="בקרה הדדית: אצטיל-CoA קרבוקסילאז מייצר מאלוניל-CoA לבניית שומן, ומאלוניל-CoA מעכב את קרניטין אציל-טרנספראז I ואת כניסת חומצות השומן למיטוכונדריה">
      <ArrowDefs />
      <Box x={110} y={20} w={150} label="אצטיל-CoA" />
      <Arrow x1={110} y1={51} x2={110} y2={108} color={ORANGE} width={3} />
      <He x={120} y={78} anchor="start" size={12} color={ORANGE} bold>ACC</He>
      <Box x={110} y={110} w={150} label="מאלוניל-CoA" color={ORANGE} fill="#fff7ed" bold />
      <Arrow x1={110} y1={141} x2={110} y2={190} />
      <Box x={110} y={192} w={170} label="בניית חומצות שומן" size={12.5} />
      <Box x={370} y={110} w={170} label="קרניטין אציל-טרנספראז I" size={12} />
      <Arrow x1={370} y1={141} x2={370} y2={190} />
      <Box x={370} y={192} w={170} label="β-חמצון במיטוכונדריה" size={12} />
      <line x1={186} y1={125} x2={276} y2={125} stroke={ORANGE} strokeWidth={2.4} />
      <line x1={282} y1={113} x2={282} y2={137} stroke={ORANGE} strokeWidth={3} />
      <He x={232} y={116} size={11.5} color={ORANGE} bold>מעכב</He>
      <He x={240} y={256} size={12} color={GREEN}>מפעילים את ACC: ציטראט, אינסולין</He>
      <He x={240} y={276} size={12} color="#b91c1c">משביתים את ACC: AMPK (זרחון), גלוקגון, אדרנלין, פלמיטויל-CoA</He>
    </svg>
  );
}

// ── Integration ──────────────────────────────────────────────────────────────
function FedFasted() {
  const box = (x: number, y: number, w: number, l: string, c = BLUE) => <Box x={x} y={y} w={w} label={l} color={c} bold size={13} />;
  const flow = (x1: number, y1: number, x2: number, y2: number, l: string, lx: number, ly: number, c = INK) => (
    <g><Arrow x1={x1} y1={y1} x2={x2} y2={y2} color={c} width={2} /><He x={lx} y={ly} size={11} color={c}>{l}</He></g>
  );
  return (
    <svg viewBox="0 0 480 380" className="w-full h-auto" role="img" aria-label="זרימת דלקים בין האיברים בצום: רקמת השומן משחררת חומצות שומן וגליצרול, השריר משחרר אלנין ולקטט, הכבד מייצר גלוקוז וגופי קטון למוח ולשאר הרקמות">
      <ArrowDefs />
      {box(240, 165, 110, "כבד", ORANGE)}
      {box(80, 40, 120, "רקמת שומן")}
      {box(400, 40, 100, "שריר")}
      {box(80, 310, 100, "מוח", PURPLE)}
      {box(400, 310, 140, "כדוריות אדומות", "#b91c1c")}
      {flow(120, 72, 205, 163, "חומצות שומן, גליצרול", 76, 128)}
      {flow(140, 56, 350, 56, "חומצות שומן", 245, 48)}
      {flow(390, 72, 280, 163, "אלנין, לקטט", 376, 128)}
      {flow(205, 197, 100, 306, "גלוקוז", 128, 245, GREEN)}
      {flow(232, 197, 128, 306, "גופי קטון", 212, 270, PURPLE)}
      {flow(268, 197, 368, 306, "גלוקוז", 300, 270, GREEN)}
      {flow(398, 306, 296, 197, "לקטט", 395, 240, "#b91c1c")}
      <He x={240} y={372} size={11.5} color={MUTED}>מצב צום (גלוקגון גבוה, אינסולין נמוך). סכמטי.</He>
    </svg>
  );
}

function StarvationFuels() {
  const s = scale(60, 460, 250, 40, 0, 40, 0, 1);
  const glycogen = (d: number) => Math.exp(-d / 0.6) * 0.9;
  const gneo = (d: number) => 0.85 * (1 - Math.exp(-d / 0.8)) * (0.35 + 0.65 * Math.exp(-d / 8));
  const ketone = (d: number) => 0.7 * (1 - Math.exp(-d / 9));
  return (
    <svg viewBox="0 0 480 310" className="w-full h-auto" role="img" aria-label="שינוי מקורות הדלק בצום: הגליקוגן נגמר תוך כיום, הגלוקונאוגנזה מחומצות אמינו עולה ואחר כך יורדת, וגופי הקטון עולים בהדרגה והופכים לדלק העיקרי של המוח">
      <Axes x0={60} y0={250} x1={460} y1={40}
        xLabel={<He x={260} y={296} size={14}>ימי צום</He>}
        yLabel={<He x={64} y={26} anchor="start" size={14}>תרומה יחסית (סכמטי)</He>} />
      {[0, 10, 20, 30, 40].map((v) => <La key={v} x={s.sx(v)} y={268} size={12.5} color={MUTED}>{v}</La>)}
      <path d={curve(glycogen, 0, 40, s, 300)} fill="none" stroke={BLUE} strokeWidth={3} />
      <path d={curve(gneo, 0, 40, s, 300)} fill="none" stroke={ORANGE} strokeWidth={3} />
      <path d={curve(ketone, 0, 40, s, 300)} fill="none" stroke={PURPLE} strokeWidth={3} />
      <He x={s.sx(2.5)} y={s.sy(0.95)} size={12.5} color={BLUE} bold anchor="start">גליקוגן בכבד</He>
      <He x={s.sx(6)} y={s.sy(0.78)} size={12.5} color={ORANGE} bold anchor="start">גלוקונאוגנזה (מחלבון)</He>
      <He x={s.sx(26)} y={s.sy(0.72)} size={12.5} color={PURPLE} bold>גופי קטון (למוח)</He>
    </svg>
  );
}

// ── Lipids & cholesterol ─────────────────────────────────────────────────────
function CholesterolPathway() {
  const steps: Step[] = [
    { m: "3 אצטיל-CoA" },
    { m: "HMG-CoA", e: "HMG-CoA רדוקטאז (מחייב)", s: "2 NADPH", key: true },
    { m: "מוולונט (6C)", s: "3 ATP, − CO₂" },
    { m: "IPP — איזופרן (5C)" },
    { m: "פרנזיל פירופוספט (15C)", e: "2 פרנזיל ראש-בראש", s: "NADPH" },
    { m: "סקוואלן (30C)", e: "סגירת 4 טבעות" },
    { m: "לנוסטרול", e: "כ-20 שלבים, −3 CH₃" },
    { m: "כולסטרול (27C)" },
  ];
  return (
    <svg viewBox="0 0 480 530" className="w-full h-auto" role="img" aria-label="בניית כולסטרול מאצטיל-CoA דרך HMG-CoA, מוולונט, יחידות איזופרן, סקוואלן ולנוסטרול; HMG-CoA רדוקטאז הוא השלב המחייב והמטרה של הסטטינים">
      <ArrowDefs />
      <Chain x={200} y={8} w={210} steps={steps} pitch={64} />
      <He x={312} y={157} anchor="start" size={11.5} color="#b91c1c" bold>⊣ סטטינים</He>
    </svg>
  );
}

function Lipoproteins() {
  return (
    <svg viewBox="0 0 480 330" className="w-full h-auto" role="img" aria-label="הובלת שומנים בדם: כילומיקרונים מהמעי, VLDL מהכבד שהופך ל-IDL ול-LDL, LDL נקלט בקולטן, ו-HDL מחזיר כולסטרול לכבד">
      <ArrowDefs />
      <Box x={70} y={20} w={110} label="מעי" bold />
      <Arrow x1={125} y1={35} x2={208} y2={35} />
      <Box x={290} y={20} w={150} label="כילומיקרונים" size={12.5} />
      <Arrow x1={365} y1={35} x2={398} y2={35} />
      <He x={440} y={40} size={12} bold>רקמות</He>
      <He x={290} y={68} size={11} color={MUTED}>ליפופרוטאין ליפאז → חומצות שומן</He>
      <Box x={70} y={130} w={110} label="כבד" bold color={ORANGE} />
      <Arrow x1={125} y1={145} x2={170} y2={145} />
      <Box x={205} y={130} w={66} label="VLDL" size={12} />
      <Arrow x1={238} y1={145} x2={262} y2={145} />
      <Box x={290} y={130} w={52} label="IDL" size={12} />
      <Arrow x1={316} y1={145} x2={340} y2={145} />
      <Box x={375} y={130} w={66} label="LDL" size={12} bold color="#b91c1c" fill="#fef2f2" />
      <Arrow x1={408} y1={145} x2={430} y2={145} />
      <He x={455} y={150} size={12} bold>רקמות</He>
      <He x={330} y={198} size={11} color="#b91c1c" anchor="end">LDL נקלט דרך קולטן LDL</He>
      <Box x={290} y={240} w={80} label="HDL" bold color={GREEN} fill="#f0fdf4" />
      <Arrow x1={455} y1={168} x2={336} y2={246} color={GREEN} />
      <Arrow x1={250} y1={255} x2={100} y2={163} color={GREEN} />
      <He x={290} y={300} size={11.5} color={GREEN}>HDL אוסף כולסטרול מהרקמות ומחזיר לכבד</He>
    </svg>
  );
}

// ── Amino acids ──────────────────────────────────────────────────────────────
function UreaCycle() {
  return (
    <svg viewBox="0 0 480 420" className="w-full h-auto" role="img" aria-label="מעגל האוריאה: אורניתין מקבל קרבמואיל פוספט ונהפך לציטרולין במיטוכונדריה; בציטופלזמה מצטרף אספרטט, משתחרר פומרט, וארגינאז משחרר אוריאה ומחדש אורניתין">
      <ArrowDefs />
      <line x1={20} y1={208} x2={460} y2={208} stroke={LINE} strokeWidth={1.5} {...dash} />
      <He x={470} y={30} size={11.5} color={MUTED} anchor="end">מיטוכונדריה ↑</He>
      <He x={470} y={404} size={11.5} color={MUTED} anchor="end">ציטופלזמה ↓</He>
      <Cycle cx={240} cy={208} r={118} w={124} size={12.5}
        nodes={["אורניתין", "ציטרולין", "ארגינינוסוקצינט", "ארגינין"]}
        edges={[{ outer: "+ קרבמואיל פוספט" }, { outer: "+ אספרטט, ATP" }, { outer: "− פומרט" }, { outer: "− אוריאה (ארגינאז)" }]}
        outerR={1.48} />
      <He x={240} y={60} size={11.5} color={MUTED}>NH₄⁺ + HCO₃⁻ + 2 ATP → קרבמואיל פוספט</He>
    </svg>
  );
}

function AaCarbonFates() {
  const rows: [string, string, string][] = [
    ["פירובט", "Ala, Cys, Gly, Ser, Thr, Trp", BLUE],
    ["אצטיל-CoA / אצטואצטיל-CoA", "Leu, Lys (רק קטוגניות); Ile, Phe, Tyr, Trp, Thr", PURPLE],
    ["α-קטוגלוטרט", "Glu, Gln, Pro, Arg, His", GREEN],
    ["סוקציניל-CoA", "Ile, Met, Thr, Val", GREEN],
    ["פומרט", "Phe, Tyr", GREEN],
    ["אוקסלואצטט", "Asp, Asn", GREEN],
  ];
  return (
    <svg viewBox="0 0 480 360" className="w-full h-auto" role="img" aria-label="גורל שלד הפחמנים של חומצות האמינו: פירובט ותוצרי ביניים של מעגל החומצה הציטרית (גלוקוגניים), ואצטיל-CoA או אצטואצטיל-CoA (קטוגניים)">
      {rows.map(([t, aa, c], i) => (
        <g key={t}>
          <rect x={250} y={14 + i * 52} width={220} height={40} rx={8} fill="#fff" stroke={c} strokeWidth={2} />
          <He x={360} y={39 + i * 52} size={12.5} bold color={c}>{t}</He>
          <La x={240} y={39 + i * 52} size={11.5} anchor="end">{aa}</La>
        </g>
      ))}
      <He x={240} y={340} size={11.5} color={GREEN}>ירוק וכחול — גלוקוגניות (יכולות להפוך לגלוקוז)</He>
      <He x={240} y={356} size={11.5} color={PURPLE}>סגול — קטוגניות (לגופי קטון ושומן)</He>
    </svg>
  );
}

// ── Nucleotides ──────────────────────────────────────────────────────────────
function NucleotideOverview() {
  const pyr: Step[] = [{ m: "HCO₃⁻ + גלוטמין" }, { m: "קרבמואיל פוספט", e: "+ אספרטט" }, { m: "טבעת: אורוטט", e: "+ PRPP", key: true }, { m: "OMP → UMP" }, { m: "UTP → CTP" }];
  const pur: Step[] = [{ m: "PRPP + גלוטמין", key: true }, { m: "פוספוריבוזילאמין", e: "9 שלבים" }, { m: "IMP" }, { m: "AMP / GMP" }];
  return (
    <svg viewBox="0 0 480 360" className="w-full h-auto" role="img" aria-label="בניית נוקלאוטידים: בפירימידינים הטבעת נבנית קודם ואז מתחברת ל-PRPP; בפורינים הטבעת נבנית על PRPP עד IMP">
      <ArrowDefs />
      <He x={360} y={18} bold color={BLUE}>פירימידינים</He>
      <He x={120} y={18} bold color={GREEN}>פורינים</He>
      <Chain x={360} y={30} w={200} steps={pyr} pitch={64} size={12.5} />
      <Chain x={120} y={30} w={200} steps={pur} pitch={64} size={12.5} />
      <He x={120} y={312} size={11} color={MUTED}>הטבעת נבנית על הריבוז</He>
      <He x={360} y={348} size={11} color={MUTED}>הטבעת קודם, הריבוז אחר כך</He>
    </svg>
  );
}

export const METABOLIC_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "catabolism-stages": { el: CatabolismStages, captionHe: "שלושת שלבי הפקת האנרגיה מהמזון. בשלב 1 המקרומולקולות מתפרקות ליחידות שלהן; בשלב 2 היחידות מתפרקות בעיקר לאצטיל-CoA; בשלב 3 האצטיל מתחמצן לגמרי, ונוצר רוב ה-ATP. סכמטי." },
  "energy-charge": { el: EnergyCharge, captionHe: "קצב יחסי של מסלולים שמייצרים ATP ושל מסלולים שצורכים ATP כפונקציה של המטען האנרגטי (עקומות להמחשה, בהשראת אטקינסון). העקומות נחתכות בטווח שבו נמצא המטען בתאים (מוצלל) — וכך המטען נשמר יציב." },
  "glycolysis-pathway": { el: GlycolysisPathway, captionHe: "עשר התגובות של הגליקוליזה. החצים הכתומים הם שלוש התגובות הבלתי הפיכות — הקסוקינאז, PFK ופירובט קינאז — שהן גם נקודות הבקרה. משמאל לכל חץ: הקו-פקטורים שנצרכים או נוצרים. מ-GAP והלאה כל תגובה קורית פעמיים לכל גלוקוז." },
  "gluconeo-bypasses": { el: GluconeoBypasses, captionHe: "גליקוליזה (כתום, למטה) וגלוקונאוגנזה (ירוק, למעלה). שלוש התגובות הבלתי הפיכות של הגליקוליזה נעקפות בארבעה אנזימים: פירובט קרבוקסילאז ו-PEP קרבוקסיקינאז (דרך אוקסלואצטט), פרוקטוז-1,6-ביספוספטאז וגלוקוז-6-פוספטאז. שאר התגובות הפיכות ומשותפות. סכמטי." },
  "f26bp-switch": { el: F26bpSwitch, captionHe: "פרוקטוז-2,6-ביספוספט כמתג בכבד. בצום, גלוקגון גורם לזרחון של האנזים הדו-תפקידי (PFK2/FBPase2), F-2,6-BP יורד, והכבד עובר לגלוקונאוגנזה. אחרי ארוחה הפוספט מוסר, F-2,6-BP עולה ומפעיל את PFK." },
  "tca-cycle": { el: TcaCycle, captionHe: "מעגל החומצה הציטרית. בפנים — האנזימים (DH = דהידרוגנאז); בחוץ — מה שנכנס ויוצא. החצים הכתומים הם שתי נקודות הבקרה העיקריות בתוך המעגל: איזוציטראט דהידרוגנאז ו-α-קטוגלוטרט דהידרוגנאז." },
  "etc-membrane": { el: EtcMembrane, captionHe: "שרשרת הנשימה בממברנה הפנימית של המיטוכונדריה. האלקטרונים (חצים שחורים) עוברים מ-NADH (קומפלקס I) או מ-FADH₂ (קומפלקס II) ל-Q, לקומפלקס III, לציטוכרום c, ולקומפלקס IV — עד O₂. קומפלקסים I, III ו-IV מעבירים פרוטונים (כתום; 4, 4 ו-2 לזוג אלקטרונים), וזרימתם חזרה דרך ATP סינתאז מייצרת ATP. סכמטי." },
  "z-scheme": { el: ZScheme, captionHe: "סכמת Z של תגובות האור. שתי \"קפיצות\" שמונעות באור (כתום) מרימות את האלקטרון ב-PS II וב-PS I; ביניהן הוא יורד דרך פלסטוקינון (PQ), ציטוכרום bf ופלסטוציאנין (PC), ובסוף מפרדוקסין (Fd) ל-NADP⁺. מקור האלקטרונים — מים, שמתפרקים ל-O₂. הגבהים סכמטיים." },
  "calvin-cycle": { el: CalvinCycle, captionHe: "מעגל קלווין בשלושה שלבים. רוביסקו מקבע CO₂ לריבולוז-1,5-ביספוספט ונוצרות שתי מולקולות 3-פוספוגליצרט; הן מחוזרות ל-GAP בעזרת ATP ו-NADPH; ורוב ה-GAP משמש לחידוש ריבולוז-1,5-ביספוספט. לכל CO₂ — 3 ATP ו-2 NADPH." },
  "ppp-overview": { el: PppOverview, captionHe: "מסלול הפנטוז פוספט. השלב החמצוני (G6PD — השלב המבוקר) מייצר 2 NADPH ו-CO₂; השלב הלא-חמצוני ההפיך מחבר את הפנטוזות לפרוקטוז-6-פוספט ול-GAP של הגליקוליזה. כשצריך רק NADPH, התוצרים חוזרים בגלוקונאוגנזה לגלוקוז-6-פוספט." },
  "glycogen-hormones": { el: GlycogenHormones, captionHe: "בקרה הורמונלית על הגליקוגן. מימין — גלוקגון (בכבד) ואדרנלין מפעילים את PKA, שמפעיל את מפל הפירוק ובאותו זמן משבית את גליקוגן סינתאז. משמאל — אינסולין משבית את GSK3 ומפעיל את PP1, שמסיר פוספטים ומפעיל את הסינתאז. סכמטי." },
  "beta-oxidation": { el: BetaOxidation, captionHe: "ארבעת השלבים של סיבוב אחד ב-β-חמצון: חמצון (FAD), הוספת מים, חמצון (NAD⁺) ותיאוליזה. בכל סיבוב יוצא אצטיל-CoA, והאציל-CoA שנשאר — קצר יותר בשני פחמנים — חוזר להתחלה. פלמיטט (C₁₆) עובר 7 סיבובים." },
  "fa-regulation": { el: FaRegulation, captionHe: "הבקרה ההדדית על חומצות השומן. אצטיל-CoA קרבוקסילאז (ACC) מייצר מאלוניל-CoA — התורם לבניית חומצות שומן — ומאלוניל-CoA מעכב את קרניטין אציל-טרנספראז I, כך שחומצות שומן לא נכנסות לפירוק בזמן שהן נבנות. סכמטי." },
  "fed-fasted": { el: FedFasted, captionHe: "זרימת הדלקים בין האיברים בצום. רקמת השומן משחררת חומצות שומן (לשריר ולכבד) וגליצרול (לכבד); השריר משחרר אלנין ולקטט, שהכבד הופך לגלוקוז; הכבד שולח גלוקוז למוח ולכדוריות האדומות, וגופי קטון למוח (בצום ממושך) ולשריר. סכמטי." },
  "starvation-fuels": { el: StarvationFuels, captionHe: "שינוי מקורות הדלק בצום (עקומות להמחשה בלבד, לא נתונים). הגליקוגן בכבד נגמר תוך כיום; הגלוקונאוגנזה מחומצות אמינו עולה, ובהמשך יורדת; גופי הקטון עולים בהדרגה והופכים לדלק העיקרי של המוח — וכך נחסך חלבון השריר." },
  "cholesterol-pathway": { el: CholesterolPathway, captionHe: "בניית כולסטרול מאצטיל-CoA. HMG-CoA רדוקטאז (כתום) הוא השלב המחייב והמבוקר, והמטרה של הסטטינים. ממוולונט נוצרות יחידות של 5 פחמנים (IPP), שמתחברות ל-15 ול-30 פחמנים (סקוואלן); סגירת הטבעות נותנת לנוסטרול, ממנו כולסטרול." },
  lipoproteins: { el: Lipoproteins, captionHe: "הובלת שומנים בדם. כילומיקרונים מובילים שומן מהמזון; VLDL מוביל שומן שהכבד בנה, ואחרי שהוא מוסר טריאצילגליצרולים הוא הופך ל-IDL ול-LDL; LDL נקלט ברקמות ובכבד דרך קולטן LDL; HDL מחזיר כולסטרול לכבד. סכמטי." },
  "urea-cycle": { el: UreaCycle, captionHe: "מעגל האוריאה בכבד. מעל הקו המקווקו — במיטוכונדריה: קרבמואיל פוספט (החנקן הראשון) מתחבר לאורניתין ונוצר ציטרולין. מתחת — בציטופלזמה: אספרטט מביא את החנקן השני, פומרט משתחרר, וארגינאז מפרק ארגינין לאוריאה ולאורניתין." },
  "aa-carbon-fates": { el: AaCarbonFates, captionHe: "לאן הולך שלד הפחמנים של כל חומצת אמינו. חלק מחומצות האמינו מופיעות ביותר משורה אחת, כי השלד שלהן מתחלק. ליזין ולאוצין הן היחידות שהן קטוגניות בלבד. (לפי סיכום מקובל בספרי ביוכימיה; פרטים קטנים שונים בין ספרים.)" },
  "nucleotide-overview": { el: NucleotideOverview, captionHe: "שתי דרכים לבנות טבעת. בפירימידינים (מימין) הטבעת נבנית מביקרבונט, גלוטמין ואספרטט, ורק אז מתחברת ל-PRPP. בפורינים (משמאל) הטבעת נבנית שלב אחר שלב על PRPP, עד IMP, וממנו AMP ו-GMP. החצים הכתומים — שלבי החיבור ל-PRPP." },
};
