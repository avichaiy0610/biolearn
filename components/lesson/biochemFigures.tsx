/* Drawn figures for the biochemistry units (Technion 134019). Plots are computed from the
   equations in the text (same numbers as the worked problems); schematics are marked as such
   in their captions. Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { isolatePrimes } from "@/lib/text";

export const BLUE = "#1d4ed8", ORANGE = "#c2410c", GREEN = "#15803d", INK = "#1f2937", MUTED = "#64748b", LINE = "#cbd5e1";
const HE = { fontFamily: "var(--font-hebrew), Arial, sans-serif" };
const LAT = { fontFamily: "Arial, sans-serif" };

type TxProps = { x: number; y: number; children: React.ReactNode; size?: number; anchor?: "start" | "middle" | "end"; color?: string; bold?: boolean; rotate?: number };
// Hebrew (or mixed) label. Use anchor "middle" unless the text is short and clearly placed.
// `anchor` uses left-to-right meaning (start = text begins at x and runs right); flipped here for RTL text.
export function He({ x, y, children, size = 15, anchor = "middle", color = INK, bold, rotate }: TxProps) {
  const a = anchor === "start" ? "end" : anchor === "end" ? "start" : "middle";
  if (typeof children === "string") children = isolatePrimes(children); // "Na⁺" keeps its order in RTL
  return (
    <text x={x} y={y} fontSize={size} textAnchor={a} direction="rtl" fill={color} fontWeight={bold ? 700 : 400} style={HE}
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}>{children}</text>
  );
}
// Latin / formula label.
export function La({ x, y, children, size = 15, anchor = "middle", color = INK, bold }: TxProps) {
  return <text x={x} y={y} fontSize={size} textAnchor={anchor} direction="ltr" fill={color} fontWeight={bold ? 700 : 400} style={LAT}>{children}</text>;
}

type Scale = { sx: (v: number) => number; sy: (v: number) => number };
export function scale(x0: number, x1: number, y0: number, y1: number, xmin: number, xmax: number, ymin: number, ymax: number): Scale {
  return {
    sx: (v) => x0 + ((v - xmin) / (xmax - xmin)) * (x1 - x0),
    sy: (v) => y0 - ((v - ymin) / (ymax - ymin)) * (y0 - y1),
  };
}
export function curve(f: (x: number) => number, a: number, b: number, s: Scale, n = 160) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n;
    d += `${i ? "L" : "M"}${s.sx(x).toFixed(1)} ${s.sy(f(x)).toFixed(1)}`;
  }
  return d;
}
export function Axes({ x0, y0, x1, y1, xLabel, yLabel, ox }: { x0: number; y0: number; x1: number; y1: number; xLabel: React.ReactNode; yLabel: React.ReactNode; ox?: number }) {
  const ax = ox ?? x0; // where the y axis crosses (for plots with a negative x range)
  return (
    <g>
      <ArrowDefs />
      <line x1={x0} y1={y0} x2={x1 + 8} y2={y0} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <line x1={ax} y1={y0 + 4} x2={ax} y2={y1 - 8} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      {xLabel}
      {yLabel}
    </g>
  );
}
export const dash = { strokeDasharray: "5 4" };
export const ArrowDefs = () => (
  <defs>
    <marker id="bfArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill={INK} /></marker>
    <marker id="bfArrowS" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill={INK} /></marker>
  </defs>
);

// ── Amino acids ──────────────────────────────────────────────────────────────
function GlycineTitration() {
  const pK1 = 2.34, pK2 = 9.6;
  const eq = (pH: number) => 1 / (1 + 10 ** (pK1 - pH)) + 1 / (1 + 10 ** (pK2 - pH));
  const s = scale(70, 460, 260, 30, 0, 2, 0, 12);
  let d = "";
  for (let i = 0; i <= 200; i++) { const pH = 0.6 + (11.4 - 0.6) * i / 200; d += `${i ? "L" : "M"}${s.sx(eq(pH)).toFixed(1)} ${s.sy(pH).toFixed(1)}`; }
  const mark = (e: number, pH: number, label: string, color: string, dx = 8, dy = -8, anchor: "start" | "end" = "start") => (
    <g>
      <line x1={s.sx(e)} y1={s.sy(pH)} x2={s.sx(e)} y2={260} stroke={color} {...dash} />
      <line x1={70} y1={s.sy(pH)} x2={s.sx(e)} y2={s.sy(pH)} stroke={color} {...dash} />
      <circle cx={s.sx(e)} cy={s.sy(pH)} r={5} fill={color} />
      <La x={s.sx(e) + dx} y={s.sy(pH) + dy} anchor={anchor} color={color} bold size={14}>{label}</La>
    </g>
  );
  return (
    <svg viewBox="0 0 480 320" className="w-full h-auto" role="img" aria-label="עקומת טיטרציה של גליצין: pH מול כמות הבסיס שנוספה, עם שני אזורי בופר סביב pKa 2.34 ו-9.60 ונקודה איזואלקטרית 5.97">
      <Axes x0={70} y0={260} x1={460} y1={30}
        xLabel={<He x={265} y={300} size={14}>מולי OH⁻ שנוספו לכל מול גליצין</He>}
        yLabel={<La x={60} y={22} anchor="end" bold>pH</La>} />
      {[0, 1, 2].map((v) => <La key={v} x={s.sx(v)} y={278} size={13} color={MUTED}>{v}</La>)}
      {[2, 4, 6, 8, 10].map((v) => <La key={v} x={62} y={s.sy(v) + 5} anchor="end" size={13} color={MUTED}>{v}</La>)}
      <path d={d} fill="none" stroke={BLUE} strokeWidth={3} />
      {mark(0.5, pK1, "pKa₁ = 2.34", ORANGE, 10, 24)}
      {mark(1, 5.97, "pI = 5.97", GREEN)}
      {mark(1.5, pK2, "pKa₂ = 9.60", ORANGE, -10, -12, "end")}
      <He x={s.sx(0.2)} y={s.sy(0.7)} size={13} color={MUTED} anchor="start">מטען {"⁦"}+1{"⁩"}</He>
      <He x={s.sx(0.5)} y={s.sy(7.2)} size={13} color={MUTED}>יון דו-קוטבי (מטען 0)</He>
      <He x={s.sx(1.72)} y={s.sy(8.4)} size={13} color={MUTED}>מטען {"⁦"}−1{"⁩"}</He>
    </svg>
  );
}

// ── Protein structure ────────────────────────────────────────────────────────
function HBondPatterns() {
  const xs = Array.from({ length: 11 }, (_, i) => 40 + i * 40);
  return (
    <svg viewBox="0 0 480 300" className="w-full h-auto" role="img" aria-label="דפוסי קשרי מימן: בסליל אלפא בין שייר i לשייר i+4 באותה שרשרת; במשטח בטא בין שני גדילים סמוכים">
      <He x={240} y={24} bold>סליל α — בתוך השרשרת: CO של i ↔ NH של i+4</He>
      {xs.slice(0, 7).map((x, i) => (
        <path key={i} d={`M${x} 100 Q${x + 80} ${30 + (i % 2) * 12} ${x + 160} 100`} fill="none" stroke={ORANGE} strokeWidth={1.6} {...dash} />
      ))}
      <line x1={40} y1={100} x2={440} y2={100} stroke={INK} strokeWidth={3} />
      {xs.map((x, i) => (<g key={i}><circle cx={x} cy={100} r={11} fill="#dbeafe" stroke={BLUE} strokeWidth={2} /><La x={x} y={105} size={12}>{i + 1}</La></g>))}
      <He x={240} y={168} bold>משטח β — בין גדילים סמוכים (אנטי-מקבילי)</He>
      <line x1={60} y1={200} x2={420} y2={200} stroke={INK} strokeWidth={3} />
      <line x1={60} y1={262} x2={420} y2={262} stroke={INK} strokeWidth={3} />
      <La x={440} y={205} size={14} color={MUTED}>→</La><La x={42} y={267} size={14} color={MUTED}>←</La>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
        const x = 75 + i * 37;
        return (<g key={i}>
          {i % 2 === 0 && <line x1={x} y1={209} x2={x} y2={253} stroke={ORANGE} strokeWidth={1.6} {...dash} />}
          <circle cx={x} cy={200} r={9} fill="#dbeafe" stroke={BLUE} strokeWidth={2} />
          <circle cx={x} cy={262} r={9} fill="#dcfce7" stroke={GREEN} strokeWidth={2} />
        </g>);
      })}
      <He x={240} y={292} size={13} color={MUTED}>מקווקו כתום = קשר מימן בין קבוצות השלד (סכמטי)</He>
    </svg>
  );
}

// ── Folding ──────────────────────────────────────────────────────────────────
function Denaturation() {
  const s = scale(70, 460, 250, 40, 0, 8, 0, 1);
  const fU = (c: number) => 1 / (1 + Math.exp(-(c - 4) * 2.5));
  return (
    <svg viewBox="0 0 480 310" className="w-full h-auto" role="img" aria-label="עקומת דנטורציה חדה: החלק של החלבון הפרוש עולה בחדות סביב ריכוז מסוים של אוריאה">
      <Axes x0={70} y0={250} x1={460} y1={40}
        xLabel={<He x={265} y={295} size={14}>ריכוז אוריאה (M)</He>}
        yLabel={<He x={74} y={26} anchor="start" size={14}>חלק החלבון הפרוש</He>} />
      {[0, 2, 4, 6, 8].map((v) => <La key={v} x={s.sx(v)} y={268} size={13} color={MUTED}>{v}</La>)}
      {[0, 0.5, 1].map((v) => <La key={v} x={62} y={s.sy(v) + 5} anchor="end" size={13} color={MUTED}>{v}</La>)}
      <path d={curve(fU, 0, 8, s)} fill="none" stroke={BLUE} strokeWidth={3} />
      <line x1={s.sx(4)} y1={s.sy(0.5)} x2={s.sx(4)} y2={250} stroke={ORANGE} {...dash} />
      <line x1={70} y1={s.sy(0.5)} x2={s.sx(4)} y2={s.sy(0.5)} stroke={ORANGE} {...dash} />
      <circle cx={s.sx(4)} cy={s.sy(0.5)} r={5} fill={ORANGE} />
      <He x={s.sx(5.6)} y={s.sy(0.5) + 4} size={13} color={ORANGE}>נקודת האמצע:</He>
      <He x={s.sx(5.6)} y={s.sy(0.5) + 22} size={13} color={ORANGE}>50% מקופלים, 50% פרושים</He>
      <He x={s.sx(1.4)} y={s.sy(0.08)} size={13} color={MUTED}>מקופל</He>
      <He x={s.sx(7)} y={s.sy(0.9)} size={13} color={MUTED}>פרוש</He>
    </svg>
  );
}

function FoldingFunnel() {
  return (
    <svg viewBox="0 0 480 320" className="w-full h-auto" role="img" aria-label="משפך הקיפול: למעלה הרבה מבנים פרושים, ובירידה האנרגיה החופשית והמבנים האפשריים מצטמצמים עד למבנה הטבעי בתחתית">
      <defs><linearGradient id="bfFunnel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dbeafe" /><stop offset="1" stopColor="#1d4ed8" stopOpacity="0.55" /></linearGradient></defs>
      <path d="M40 50 C120 60 150 110 175 160 C190 195 200 215 205 228 C215 222 222 238 230 262 L250 262 C258 238 268 210 278 214 C290 190 330 110 360 80 C380 64 410 54 440 50 Z" fill="url(#bfFunnel)" stroke={BLUE} strokeWidth={2} />
      <path d="M40 50 Q240 75 440 50" fill="none" stroke={BLUE} strokeWidth={2} />
      <circle cx={240} cy={266} r={7} fill={ORANGE} />
      <He x={240} y={292} bold color={ORANGE}>המבנה הטבעי (אנרגיה חופשית מינימלית)</He>
      <He x={240} y={30} size={14}>הרבה מבנים פרושים — אנטרופיה גבוהה</He>
      <line x1={455} y1={70} x2={455} y2={250} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow2)" />
      <defs><marker id="bfArrow2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={INK} /></marker></defs>
      <He x={440} y={160} size={13} rotate={-90}>אנרגיה חופשית יורדת</He>
      <He x={104} y={190} size={12} color={MUTED}>שקע = תוצר ביניים</He>
      <line x1={160} y1={192} x2={192} y2={206} stroke={MUTED} strokeWidth={1} />
    </svg>
  );
}

// ── Fibrous & membrane proteins ──────────────────────────────────────────────
function MembraneProteins() {
  const heads = (y: number) => Array.from({ length: 30 }, (_, i) => <circle key={`${y}-${i}`} cx={10 + i * 16} cy={y} r={6} fill="#fde68a" stroke="#b45309" strokeWidth={1} />);
  return (
    <svg viewBox="0 30 480 270" className="w-full h-auto" role="img" aria-label="סוגים של חלבוני ממברנה: סליל שחוצה את הממברנה, חבית בטא, חלבון היקפי וחלבון שמעוגן בשומן">
      <rect x={0} y={110} width={480} height={70} fill="#fef3c7" />
      {heads(110)}{heads(180)}
      <He x={240} y={60} size={13} color={MUTED}>↑ בחוץ</He>
      <He x={20} y={292} size={13} color={MUTED} anchor="start">↓ בפנים</He>
      {/* TM helices */}
      <rect x={52} y={88} width={16} height={114} rx={7} fill={BLUE} />
      <rect x={74} y={88} width={16} height={114} rx={7} fill={BLUE} />
      <He x={71} y={235} size={13}>סלילי α</He><He x={71} y={252} size={13}>חוצי ממברנה</He>
      {/* beta barrel */}
      <rect x={160} y={92} width={70} height={106} rx={14} fill="#dcfce7" stroke={GREEN} strokeWidth={2} />
      {[172, 186, 200, 214].map((x) => <line key={x} x1={x} y1={98} x2={x} y2={192} stroke={GREEN} strokeWidth={4} />)}
      <He x={195} y={235} size={13}>חבית β</He><He x={195} y={252} size={13}>(פורין)</He>
      {/* peripheral bound to a TM protein */}
      <rect x={272} y={88} width={16} height={114} rx={7} fill={BLUE} />
      <ellipse cx={295} cy={222} rx={28} ry={18} fill="#fed7aa" stroke={ORANGE} strokeWidth={2} />
      <He x={295} y={262} size={13}>היקפי</He><He x={295} y={278} size={12} color={MUTED}>(נקשר לחלבון/לראשים)</He>
      {/* lipid anchored */}
      <ellipse cx={420} cy={232} rx={30} ry={18} fill="#e9d5ff" stroke="#7c3aed" strokeWidth={2} />
      <path d="M415 214 L415 196 L408 186 L415 176 L408 166" fill="none" stroke="#7c3aed" strokeWidth={3} />
      <He x={420} y={272} size={13}>מעוגן בשומן</He><He x={420} y={288} size={12} color={MUTED}>(פלמיטויל, GPI…)</He>
    </svg>
  );
}

// ── Protein methods ──────────────────────────────────────────────────────────
function SdsStandard() {
  const s = scale(80, 460, 250, 40, 0, 1, Math.log10(10), Math.log10(200));
  const yl = (m: number) => s.sy(Math.log10(m));
  return (
    <svg viewBox="0 0 480 310" className="w-full h-auto" role="img" aria-label="עקומת כיול של ג'ל SDS: לוגריתם המסה יורד ליניארית עם הניידות; חלבון בניידות 0.60 הוא כ-45 קילודלטון">
      <Axes x0={80} y0={250} x1={460} y1={40}
        xLabel={<He x={270} y={296} size={14}>ניידות יחסית בג׳ל</He>}
        yLabel={<He x={84} y={26} anchor="start" size={14}>מסה (kDa, סקאלה לוגריתמית)</He>} />
      {[0, 0.3, 0.6, 0.9].map((v) => <La key={v} x={s.sx(v)} y={268} size={13} color={MUTED}>{v.toFixed(1)}</La>)}
      {[20, 45, 100].map((m) => <La key={m} x={72} y={yl(m) + 5} anchor="end" size={13} color={m === 45 ? ORANGE : MUTED}>{m}</La>)}
      <line x1={s.sx(0.12)} y1={yl(100 * (20 / 100) ** ((0.12 - 0.3) / 0.6))} x2={s.sx(1)} y2={yl(100 * (20 / 100) ** ((1 - 0.3) / 0.6))} stroke={BLUE} strokeWidth={2.5} />
      <circle cx={s.sx(0.9)} cy={yl(20)} r={6} fill={BLUE} /><circle cx={s.sx(0.3)} cy={yl(100)} r={6} fill={BLUE} />
      <He x={s.sx(0.3) + 70} y={yl(100) - 10} size={13} color={BLUE}>סמן 100 kDa</He>
      <He x={s.sx(0.9)} y={yl(20) + 26} size={13} color={BLUE}>סמן 20 kDa</He>
      <line x1={s.sx(0.6)} y1={250} x2={s.sx(0.6)} y2={yl(44.7)} stroke={ORANGE} {...dash} />
      <line x1={80} y1={yl(44.7)} x2={s.sx(0.6)} y2={yl(44.7)} stroke={ORANGE} {...dash} />
      <circle cx={s.sx(0.6)} cy={yl(44.7)} r={6} fill={ORANGE} />
      <He x={s.sx(0.6) + 80} y={yl(44.7) - 8} size={13} color={ORANGE}>לא ידוע: ≈45 kDa</He>
    </svg>
  );
}

// ── Hemoglobin ───────────────────────────────────────────────────────────────
const hill = (p: number, p50: number, n: number) => p ** n / (p ** n + p50 ** n);
function O2Binding() {
  const s = scale(60, 460, 250, 40, 0, 120, 0, 1);
  const mb = (p: number) => p / (p + 2), hb = (p: number) => hill(p, 26, 2.8);
  const xa = s.sx(112);
  return (
    <svg viewBox="0 0 480 310" className="w-full h-auto" role="img" aria-label="עקומות קישור חמצן: מיוגלובין היפרבולית עם P50 של 2 טור, המוגלובין סיגמואידית עם P50 של 26 טור; בין 100 ל-20 טור המוגלובין מוסר כ-65 אחוז ומיוגלובין רק 7">
      <Axes x0={60} y0={250} x1={460} y1={40}
        xLabel={<La x={260} y={296} size={14}>pO₂ (torr)</La>}
        yLabel={<He x={64} y={26} anchor="start" size={14}>רוויה (Y)</He>} />
      {[0, 20, 40, 60, 80, 100, 120].map((v) => <La key={v} x={s.sx(v)} y={268} size={13} color={MUTED}>{v}</La>)}
      {[0, 0.5, 1].map((v) => <La key={v} x={52} y={s.sy(v) + 5} anchor="end" size={13} color={MUTED}>{v}</La>)}
      {[20, 100].map((v) => <line key={v} x1={s.sx(v)} y1={250} x2={s.sx(v)} y2={40} stroke={LINE} strokeWidth={1.5} {...dash} />)}
      <He x={s.sx(20) + 5} y={242} size={12} color={MUTED} anchor="start">רקמה פעילה</He>
      <He x={s.sx(100) - 5} y={242} size={12} color={MUTED} anchor="end">ריאות</He>
      <path d={curve(mb, 0.2, 120, s)} fill="none" stroke={BLUE} strokeWidth={3} />
      <path d={curve(hb, 0, 120, s)} fill="none" stroke={ORANGE} strokeWidth={3} />
      <line x1={xa} y1={s.sy(hb(20))} x2={xa} y2={s.sy(hb(100))} stroke={ORANGE} strokeWidth={2} markerStart="url(#bfArrow)" markerEnd="url(#bfArrow)" />
      <line x1={s.sx(20)} y1={s.sy(hb(20))} x2={xa} y2={s.sy(hb(20))} stroke={ORANGE} strokeWidth={1} {...dash} />
      <La x={xa - 34} y={s.sy(0.62)} size={13} color={ORANGE} bold>≈65%</La>
      <He x={xa - 34} y={s.sy(0.62) + 17} size={12} color={ORANGE}>נמסר</He>
      <He x={s.sx(24)} y={s.sy(0.8)} size={13} color={BLUE} bold anchor="start">מיוגלובין</He>
      <He x={s.sx(55)} y={s.sy(0.62)} size={13} color={ORANGE} bold>המוגלובין</He>
    </svg>
  );
}

function BohrShift() {
  const s = scale(60, 460, 250, 40, 0, 100, 0, 1);
  return (
    <svg viewBox="0 0 480 310" className="w-full h-auto" role="img" aria-label="הזזה של עקומת המוגלובין: שמאלה כשהזיקה עולה, ימינה כשה-pH יורד או כשיש יותר CO2 או 2,3-BPG">
      <Axes x0={60} y0={250} x1={460} y1={40}
        xLabel={<La x={260} y={296} size={14}>pO₂ (torr)</La>}
        yLabel={<He x={64} y={26} anchor="start" size={14}>רוויה (Y)</He>} />
      {[0, 20, 40, 60, 80, 100].map((v) => <La key={v} x={s.sx(v)} y={268} size={13} color={MUTED}>{v}</La>)}
      <path d={curve((p) => hill(p, 18, 2.8), 0, 100, s)} fill="none" stroke={GREEN} strokeWidth={3} />
      <path d={curve((p) => hill(p, 26, 2.8), 0, 100, s)} fill="none" stroke={INK} strokeWidth={3} />
      <path d={curve((p) => hill(p, 36, 2.8), 0, 100, s)} fill="none" stroke={ORANGE} strokeWidth={3} />
      <He x={70} y={s.sy(0.86)} size={13} color={GREEN} bold anchor="start">זיקה גבוהה לחמצן</He>
      <He x={70} y={s.sy(0.86) + 16} size={12} color={GREEN} anchor="start">(עוברי)</He>
      <He x={s.sx(78)} y={s.sy(0.42)} size={13} color={ORANGE} bold>זיקה נמוכה לחמצן</He>
      <La x={s.sx(78)} y={s.sy(0.42) + 16} size={12} color={ORANGE}>pH↓  CO₂↑  2,3-BPG↑</La>
      <line x1={s.sx(30)} y1={s.sy(0.5)} x2={s.sx(42)} y2={s.sy(0.5)} stroke={ORANGE} strokeWidth={2} markerEnd="url(#bfArrow)" />
    </svg>
  );
}

// ── Enzymes: energy, Michaelis–Menten, Lineweaver–Burk, inhibition ───────────
function EnergyDiagram() {
  const s = scale(50, 460, 260, 30, 0, 1, 0, 1);
  const base = (x: number) => { const t = Math.min(1, Math.max(0, (x - 0.25) / 0.5)); const sm = t * t * (3 - 2 * t); return 0.45 + (0.25 - 0.45) * sm; };
  const g = (h: number) => (x: number) => base(x) + h * Math.exp(-(((x - 0.5) / 0.11) ** 2));
  const top1 = s.sy(g(0.5)(0.5)), top2 = s.sy(g(0.22)(0.5));
  return (
    <svg viewBox="0 0 480 310" className="w-full h-auto" role="img" aria-label="דיאגרמת אנרגיה: האנזים מוריד את מחסום האנרגיה (אנרגיית השפעול) אבל לא משנה את ההפרש בין המצע לתוצר">
      <Axes x0={50} y0={260} x1={460} y1={30}
        xLabel={<He x={255} y={296} size={14}>התקדמות התגובה</He>}
        yLabel={<He x={54} y={22} anchor="start" size={14}>אנרגיה חופשית (G)</He>} />
      <path d={curve(g(0.5), 0.05, 0.95, s)} fill="none" stroke={MUTED} strokeWidth={3} />
      <path d={curve(g(0.22), 0.05, 0.95, s)} fill="none" stroke={BLUE} strokeWidth={3} />
      <La x={s.sx(0.07)} y={s.sy(0.45) - 10} anchor="start" bold>S</La>
      <La x={s.sx(0.93)} y={s.sy(0.25) - 10} anchor="end" bold>P</La>
      <line x1={s.sx(0.05)} y1={s.sy(0.45)} x2={s.sx(0.5) + 70} y2={s.sy(0.45)} stroke={LINE} {...dash} />
      <line x1={s.sx(0.5) + 34} y1={s.sy(0.45)} x2={s.sx(0.5) + 34} y2={top1} stroke={MUTED} strokeWidth={1.6} markerStart="url(#bfArrow)" markerEnd="url(#bfArrow)" />
      <La x={s.sx(0.5) + 42} y={top1 + 30} anchor="start" size={13} color={MUTED}>ΔG‡</La>
      <He x={s.sx(0.5) + 42} y={top1 + 48} anchor="start" size={12} color={MUTED}>בלי אנזים</He>
      <line x1={s.sx(0.5)} y1={s.sy(0.45)} x2={s.sx(0.5)} y2={top2} stroke={BLUE} strokeWidth={1.6} markerStart="url(#bfArrow)" markerEnd="url(#bfArrow)" />
      <La x={s.sx(0.5)} y={s.sy(0.45) + 22} size={13} color={BLUE}>ΔG‡</La>
      <He x={s.sx(0.5)} y={s.sy(0.45) + 40} size={12} color={BLUE}>עם אנזים</He>
      <line x1={s.sx(0.86)} y1={s.sy(0.45)} x2={s.sx(0.86)} y2={s.sy(0.25)} stroke={ORANGE} strokeWidth={1.6} markerStart="url(#bfArrow)" markerEnd="url(#bfArrow)" />
      <line x1={s.sx(0.6)} y1={s.sy(0.45)} x2={s.sx(0.9)} y2={s.sy(0.45)} stroke={LINE} {...dash} />
      <La x={s.sx(0.86) - 8} y={s.sy(0.35) + 5} anchor="end" size={13} color={ORANGE}>ΔG</La>
      <He x={s.sx(0.5)} y={top1 - 8} size={12} color={MUTED}>מצב המעבר X‡</He>
    </svg>
  );
}

function MichaelisMenten() {
  const s = scale(60, 460, 250, 40, 0, 10, 0, 1.08);
  const v = (x: number) => x / (x + 1);
  return (
    <svg viewBox="0 0 480 310" className="w-full h-auto" role="img" aria-label="עקומת מיכאליס-מנטן: המהירות ההתחלתית עולה עם ריכוז המצע ומתקרבת ל-Vmax; בריכוז השווה ל-Km המהירות היא חצי מ-Vmax">
      <Axes x0={60} y0={250} x1={460} y1={40}
        xLabel={<He x={260} y={296} size={14}>ריכוז המצע, ביחידות של Kₘ</He>}
        yLabel={<La x={64} y={26} anchor="start" size={15} bold>V₀</La>} />
      {[0, 2, 4, 6, 8, 10].map((x) => <La key={x} x={s.sx(x)} y={268} size={13} color={MUTED}>{x}</La>)}
      <line x1={60} y1={s.sy(1)} x2={460} y2={s.sy(1)} stroke={ORANGE} {...dash} />
      <La x={68} y={s.sy(1) - 8} anchor="start" size={14} color={ORANGE} bold>Vₘₐₓ</La>
      <line x1={60} y1={s.sy(0.5)} x2={s.sx(1)} y2={s.sy(0.5)} stroke={GREEN} {...dash} />
      <line x1={s.sx(1)} y1={s.sy(0.5)} x2={s.sx(1)} y2={250} stroke={GREEN} {...dash} />
      <La x={54} y={s.sy(0.5) + 5} anchor="end" size={13} color={GREEN} bold>Vₘₐₓ/2</La>
      <La x={s.sx(1)} y={286} size={14} color={GREEN} bold>Kₘ</La>
      <path d={curve(v, 0, 10, s)} fill="none" stroke={BLUE} strokeWidth={3} />
      <He x={s.sx(1.2)} y={s.sy(0.18)} size={12} color={MUTED} anchor="start">← סדר ראשון</He>
      <He x={s.sx(7.5)} y={s.sy(0.8)} size={12} color={MUTED}>מתקרב לסדר אפס</He>
    </svg>
  );
}

function LineweaverBurk() {
  const s = scale(40, 460, 250, 40, -1.4, 3, 0, 4.2);
  const ox = s.sx(0);
  return (
    <svg viewBox="0 0 480 310" className="w-full h-auto" role="img" aria-label="גרף ליינוויבר-ברק: קו ישר של 1/V0 מול 1/[S]; חיתוך עם ציר y הוא 1/Vmax, חיתוך עם ציר x הוא מינוס 1/Km, והשיפוע הוא Km/Vmax">
      <Axes x0={40} y0={250} x1={460} y1={40} ox={ox}
        xLabel={<La x={452} y={276} anchor="end" bold>1/[S]</La>}
        yLabel={<La x={ox + 8} y={30} anchor="start" bold>1/V₀</La>} />
      <path d={curve((x) => x + 1, -1, 0, s)} fill="none" stroke={BLUE} strokeWidth={2.5} {...dash} />
      <path d={curve((x) => x + 1, 0, 3, s)} fill="none" stroke={BLUE} strokeWidth={3} />
      {[0.4, 0.9, 1.5, 2.2, 2.9].map((x) => <circle key={x} cx={s.sx(x)} cy={s.sy(x + 1)} r={5} fill={BLUE} />)}
      <circle cx={s.sx(0)} cy={s.sy(1)} r={6} fill={ORANGE} />
      <La x={ox - 8} y={s.sy(1) - 8} anchor="end" size={14} color={ORANGE} bold>1/Vₘₐₓ</La>
      <circle cx={s.sx(-1)} cy={s.sy(0)} r={6} fill={GREEN} />
      <La x={s.sx(-1)} y={276} size={14} color={GREEN} bold>−1/Kₘ</La>
      <He x={s.sx(2.2) - 6} y={s.sy(3.6)} size={13} color={BLUE}>שיפוע = Kₘ/Vₘₐₓ</He>
      <He x={s.sx(-0.6)} y={s.sy(1.7)} size={12} color={MUTED}>המשך (אקסטרפולציה)</He>
    </svg>
  );
}

const INH = {
  competitive: { f: (x: number) => 2 * x + 1, he: "תחרותי: הקווים נחתכים על ציר y", aria: "עיכוב תחרותי: Vmax לא משתנה, השיפוע עולה, הקווים נחתכים על ציר y" },
  uncompetitive: { f: (x: number) => x + 2, he: "Uncompetitive: קווים מקבילים", aria: "עיכוב שבו המעכב נקשר רק ל-ES: אותו שיפוע, קווים מקבילים" },
  noncompetitive: { f: (x: number) => 2 * x + 2, he: "לא-תחרותי טהור: נחתכים על ציר x", aria: "עיכוב לא-תחרותי טהור: Km לא משתנה, Vmax יורד, הקווים נחתכים על ציר x" },
} as const;
function InhibitionLB({ kind }: { kind: keyof typeof INH }) {
  const s = scale(40, 460, 240, 46, -1.4, 2.2, 0, 6.6);
  const ox = s.sx(0), k = INH[kind];
  return (
    <svg viewBox="0 0 480 300" className="w-full h-auto" role="img" aria-label={k.aria}>
      <He x={250} y={22} bold>{k.he}</He>
      <Axes x0={40} y0={240} x1={460} y1={46} ox={ox}
        xLabel={<La x={452} y={266} anchor="end" bold>1/[S]</La>}
        yLabel={<La x={ox + 8} y={40} anchor="start" bold>1/V₀</La>} />
      <path d={curve((x) => x + 1, -1, 2.2, s)} fill="none" stroke={INK} strokeWidth={3} />
      <path d={curve(k.f, kind === "uncompetitive" ? -1.4 : kind === "competitive" ? -0.5 : -1, 2.2, s)} fill="none" stroke={ORANGE} strokeWidth={3} />
      <He x={s.sx(1.95)} y={s.sy(k.f(2.2)) - 6} size={13} color={ORANGE} bold anchor="end">עם מעכב</He>
      <He x={s.sx(2.2)} y={s.sy(3.2) + 40} size={13} bold anchor="end">בלי מעכב</He>
    </svg>
  );
}
const InhCompetitive = () => <InhibitionLB kind="competitive" />;
const InhUncompetitive = () => <InhibitionLB kind="uncompetitive" />;
const InhNoncompetitive = () => <InhibitionLB kind="noncompetitive" />;

// ── Catalytic mechanisms ─────────────────────────────────────────────────────
function CatalyticTriad() {
  const box = (x: number, y: number, w: number, label: string, sub: string, color: string) => (
    <g>
      <rect x={x} y={y} width={w} height={58} rx={12} fill="#fff" stroke={color} strokeWidth={2.5} />
      <La x={x + w / 2} y={y + 25} bold color={color}>{label}</La>
      <La x={x + w / 2} y={y + 45} size={13} color={MUTED}>{sub}</La>
    </g>
  );
  return (
    <svg viewBox="0 0 480 300" className="w-full h-auto" role="img" aria-label="השלישייה הקטליטית של כימוטריפסין: אספרטט 102 מכוון את היסטידין 57, שמושך פרוטון מסרין 195; הסרין תוקף את הקרבוניל של המצע, והמטען השלילי מיוצב בחור האוקסיאניון">
      <ArrowDefs />
      {box(16, 40, 120, "Asp102", "–COO⁻", "#7c3aed")}
      {box(180, 40, 120, "His57", "imidazole", BLUE)}
      {box(344, 40, 120, "Ser195", "–CH₂–OH", ORANGE)}
      <line x1={136} y1={69} x2={180} y2={69} stroke={INK} strokeWidth={2} {...dash} />
      <line x1={300} y1={69} x2={344} y2={69} stroke={INK} strokeWidth={2} {...dash} />
      <He x={190} y={122} size={13}>His57 מושך פרוטון מהסרין,</He>
      <He x={190} y={140} size={13}>והסרין הופך לנוקלאופיל חזק</He>
      <rect x={300} y={170} width={164} height={70} rx={12} fill="#f1f5f9" stroke={MUTED} strokeWidth={2} />
      <La x={382} y={198} bold>C=O</La>
      <He x={382} y={222} size={13} color={MUTED}>הקשר הפפטידי שנחתך</He>
      <path d="M404 100 Q430 140 400 168" fill="none" stroke={ORANGE} strokeWidth={2.5} markerEnd="url(#bfArrow)" />
      <He x={448} y={146} size={12} color={ORANGE}>תקיפה</He>
      <rect x={16} y={170} width={230} height={70} rx={12} fill="#dcfce7" stroke={GREEN} strokeWidth={2} />
      <He x={131} y={198} size={14} bold color={GREEN}>חור האוקסיאניון</He>
      <He x={131} y={222} size={12} color={GREEN}>NH של השלד מייצבים את ה-O⁻</He>
      <line x1={246} y1={205} x2={300} y2={205} stroke={GREEN} strokeWidth={2} {...dash} />
      <He x={240} y={280} size={12} color={MUTED}>מקווקו = קשר מימן. סכמטי.</He>
    </svg>
  );
}

// ── Allosteric regulation (MWC, n = 6 like ATCase) ───────────────────────────
const mwc = (a: number, L: number, c = 0.05, n = 6) => (a * (1 + a) ** (n - 1) + L * c * a * (1 + c * a) ** (n - 1)) / ((1 + a) ** n + L * (1 + c * a) ** n);
function AllostericCurves() {
  const s = scale(60, 460, 250, 40, 0, 12, 0, 1);
  return (
    <svg viewBox="0 0 480 310" className="w-full h-auto" role="img" aria-label="קינטיקה סיגמואידית של אנזים אלוסטרי לפי המודל המתואם: CTP מזיז את העקומה ימינה, ATP שמאלה">
      <Axes x0={60} y0={250} x1={460} y1={40}
        xLabel={<He x={260} y={296} size={14}>ריכוז מצע (יחסי)</He>}
        yLabel={<He x={64} y={26} anchor="start" size={14}>קצב (חלק מהמרבי)</He>} />
      {[0, 0.5, 1].map((v) => <La key={v} x={52} y={s.sy(v) + 5} anchor="end" size={13} color={MUTED}>{v}</La>)}
      <path d={curve((a) => mwc(a, 70), 0, 12, s)} fill="none" stroke={GREEN} strokeWidth={3} />
      <path d={curve((a) => mwc(a, 200), 0, 12, s)} fill="none" stroke={INK} strokeWidth={3} />
      <path d={curve((a) => mwc(a, 1250), 0, 12, s)} fill="none" stroke={ORANGE} strokeWidth={3} />
      <La x={s.sx(1.0)} y={s.sy(0.62)} size={13} color={GREEN} bold>+ATP</La>
      <La x={s.sx(1.0)} y={s.sy(0.62) + 16} size={12} color={GREEN}>(L = 70)</La>
      <He x={s.sx(8.6)} y={s.sy(0.6)} size={13} bold>בלי אפקטור</He>
      <La x={s.sx(8.6)} y={s.sy(0.6) + 16} size={12}>(L = 200)</La>
      <La x={s.sx(5.6)} y={s.sy(0.3)} size={13} color={ORANGE} bold>+CTP</La>
      <La x={s.sx(5.6)} y={s.sy(0.3) + 16} size={12} color={ORANGE}>(L = 1250)</La>
    </svg>
  );
}

// ── Covalent regulation ──────────────────────────────────────────────────────
function KinaseCycle() {
  return (
    <svg viewBox="0 0 480 260" className="w-full h-auto" role="img" aria-label="מחזור זרחון: קינאז מעביר פוספט מ-ATP לחלבון, ופוספטאז מסיר אותו בהידרוליזה">
      <ArrowDefs />
      <rect x={20} y={95} width={130} height={60} rx={14} fill="#fff" stroke={BLUE} strokeWidth={2.5} />
      <He x={85} y={130} bold>חלבון (OH)</He>
      <rect x={330} y={95} width={130} height={60} rx={14} fill="#fff" stroke={ORANGE} strokeWidth={2.5} />
      <He x={395} y={130} bold>חלבון–P</He>
      <path d="M130 92 Q240 10 350 92" fill="none" stroke={INK} strokeWidth={2.5} markerEnd="url(#bfArrow)" />
      <He x={240} y={22} bold color={BLUE}>קינאז</He>
      <La x={240} y={42} size={13} color={MUTED}>ATP → ADP</La>
      <path d="M350 158 Q240 240 130 158" fill="none" stroke={INK} strokeWidth={2.5} markerEnd="url(#bfArrow)" />
      <He x={240} y={224} bold color={ORANGE}>פוספטאז</He>
      <La x={240} y={246} size={13} color={MUTED}>H₂O → Pᵢ</La>
      <He x={240} y={130} size={12} color={MUTED}>שתי תגובות נפרדות,</He>
      <He x={240} y={146} size={12} color={MUTED}>כל אחת בלתי הפיכה</He>
    </svg>
  );
}

function ZymogenCascade() {
  const rows: [number, string, string, string][] = [[130, "טריפסינוגן", "טריפסין", BLUE], [175, "כימוטריפסינוגן", "כימוטריפסין", ORANGE], [215, "פרו-אלסטאז", "אלסטאז", ORANGE], [255, "פרו-קרבוקסיפפטידאז", "קרבוקסיפפטידאז", ORANGE], [295, "פרו-קוליפאז", "קוליפאז", ORANGE]];
  return (
    <svg viewBox="0 0 480 340" className="w-full h-auto" role="img" aria-label="מפל השפעול של זימוגני הלבלב: אנטרופפטידאז מפעיל טריפסינוגן לטריפסין, וטריפסין מפעיל עוד טריפסינוגן ואת שאר הזימוגנים">
      <ArrowDefs />
      <rect x={300} y={14} width={160} height={42} rx={10} fill="#ede9fe" stroke="#7c3aed" strokeWidth={2} />
      <He x={380} y={41} bold color="#7c3aed">אנטרופפטידאז</He>
      <He x={380} y={74} size={12} color={MUTED}>(בממברנת התריסריון)</He>
      <path d="M300 35 L250 35 L250 114" fill="none" stroke="#7c3aed" strokeWidth={2} markerEnd="url(#bfArrow)" />
      <He x={395} y={22 + 88} size={12} color={MUTED}>זימוגן (לא פעיל)</He>
      <He x={95} y={110} size={12} color={MUTED}>אנזים פעיל</He>
      {rows.map(([y, pro, act, color]) => (
        <g key={pro}>
          <He x={395} y={y} size={13} color={MUTED}>{pro}</He>
          <line x1={315} y1={y - 5} x2={185} y2={y - 5} stroke={color} strokeWidth={2} markerEnd="url(#bfArrow)" />
          <circle cx={250} cy={y - 5} r={5} fill={BLUE} />
          <He x={95} y={y} size={14} bold color={color}>{act}</He>
        </g>
      ))}
      <path d="M95 138 L95 150 L250 150" fill="none" stroke={BLUE} strokeWidth={2.5} />
      <line x1={250} y1={125} x2={250} y2={290} stroke={BLUE} strokeWidth={2.5} />
      <He x={240} y={330} size={12} color={BLUE}>קו כחול: הטריפסין מזרז כל אחד מהחיתוכים (גם של טריפסינוגן נוסף)</He>
    </svg>
  );
}

// ── Carbohydrates & lipids ───────────────────────────────────────────────────
function Polysaccharides() {
  const chain = (x0: number, y: number, n: number, dx: number, color: string, k = "") => Array.from({ length: n }, (_, i) => (
    <circle key={`${k}${y}-${i}`} cx={x0 + i * dx} cy={y} r={7} fill="#fff" stroke={color} strokeWidth={2} />
  ));
  return (
    <svg viewBox="0 0 480 330" className="w-full h-auto" role="img" aria-label="רב-סוכרים של גלוקוז: עמילוז שרשרת לא מסועפת, גליקוגן מסועף מאוד, ותאית שרשראות ישרות מקבילות שמחוברות בקשרי מימן">
      <He x={240} y={22} bold>עמילוז — α-1,4, לא מסועף (נוטה ליצור סליל)</He>
      <line x1={40} y1={50} x2={440} y2={50} stroke={BLUE} strokeWidth={2} />
      {chain(40, 50, 21, 20, BLUE, "a")}
      <He x={240} y={98} bold>גליקוגן — α-1,4 עם הסתעפויות α-1,6</He>
      <line x1={60} y1={180} x2={420} y2={180} stroke={ORANGE} strokeWidth={2} />
      {chain(60, 180, 19, 20, ORANGE, "g")}
      {[[140, 140, 1], [260, 140, 1], [340, 220, -1], [180, 220, -1]].map(([x, y, dir], i) => (
        <g key={i}>
          <line x1={x} y1={180} x2={x + 20} y2={y} stroke={ORANGE} strokeWidth={2} />
          <line x1={x + 20} y1={y} x2={x + 120} y2={y} stroke={ORANGE} strokeWidth={2} />
          {chain(x + 20, y, 6, 20, ORANGE, `b${i}`)}
          <circle cx={x + 120} cy={y} r={4} fill={GREEN} />
          {dir === 1 && i === 0 && <He x={x + 70} y={y - 14} size={11} color={GREEN}>קצה לא מחזר</He>}
        </g>
      ))}
      <He x={240} y={262} bold>תאית — β-1,4, שרשראות ישרות במקביל</He>
      {[280, 304].map((y) => <g key={y}><line x1={40} y1={y} x2={440} y2={y} stroke={GREEN} strokeWidth={2} />{chain(40, y, 21, 20, GREEN, "c")}</g>)}
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={60 + i * 40} y1={287} x2={60 + i * 40} y2={297} stroke={MUTED} strokeWidth={1.5} {...dash} />)}
    </svg>
  );
}

function MicelleBilayer() {
  const lipid = (x: number, y: number, ang: number, color: string, two = true, k = "") => {
    const r = (ang * Math.PI) / 180, dx = Math.cos(r), dy = Math.sin(r), px = -dy * 3, py = dx * 3;
    return (
      <g key={k}>
        <line x1={x + dx * 7} y1={y + dy * 7} x2={x + dx * 30 + (two ? px : 0)} y2={y + dy * 30 + (two ? py : 0)} stroke={MUTED} strokeWidth={1.8} />
        {two && <line x1={x + dx * 7} y1={y + dy * 7} x2={x + dx * 30 - px} y2={y + dy * 30 - py} stroke={MUTED} strokeWidth={1.8} />}
        <circle cx={x} cy={y} r={7} fill={color} />
      </g>
    );
  };
  const micelle = Array.from({ length: 16 }, (_, i) => { const a = (i * 360) / 16; const r = (a * Math.PI) / 180; return lipid(110 + 48 * Math.cos(r), 150 + 48 * Math.sin(r), a + 180, "#f59e0b", false, `m${i}`); });
  const bilayer = Array.from({ length: 8 }, (_, i) => [lipid(255 + i * 26, 116, 90, BLUE, true, `t${i}`), lipid(255 + i * 26, 184, -90, BLUE, true, `b${i}`)]);
  return (
    <svg viewBox="0 0 480 300" className="w-full h-auto" role="img" aria-label="מיצלה של חומצות שומן עם זנב אחד, לעומת שכבה כפולה של פוספוליפידים עם שני זנבות">
      {micelle}
      {bilayer}
      <He x={110} y={240} bold>מיצלה</He>
      <He x={110} y={260} size={12} color={MUTED}>זנב אחד (למשל סבון)</He>
      <He x={346} y={250} bold>שכבה כפולה</He>
      <He x={346} y={270} size={12} color={MUTED}>שתי שרשראות (פוספוליפידים)</He>
      <He x={346} y={90} size={12} color={MUTED}>ראשים קוטביים פונים למים</He>
      <He x={346} y={226} size={12} color={MUTED}>הזנבות פונים זה אל זה, הרחק מהמים</He>
    </svg>
  );
}

export const BIOCHEM_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "glycine-titration": { el: GlycineTitration, captionHe: "עקומת טיטרציה של גליצין, מחושבת מהנדרסון-הסלבך עם pKa₁ = 2.34 ו-pKa₂ = 9.60. סביב כל pKa העקומה שטוחה — שם גליצין משמש בופר. באמצע, אחרי מול OH⁻ אחד, גליצין כמעט כולו יון דו-קוטבי, וה-pH שווה ל-pI = 5.97." },
  "hbond-patterns": { el: HBondPatterns, captionHe: "דפוסי קשרי המימן של השלד. בסליל α, ה-CO של כל שייר קשור ל-NH של השייר שנמצא ארבעה מקומות אחריו, באותה שרשרת. במשטח β הקשרים הם בין גדילים סמוכים (כאן — אנטי-מקבילים). סכמטי, לא בקנה מידה." },
  denaturation: { el: Denaturation, captionHe: "עקומת דנטורציה במודל שני מצבים (ערכים להמחשה). המעבר חד: בנקודת האמצע התמיסה היא תערובת של מולקולות מקופלות לגמרי ופרושות לגמרי, ולא של מולקולות \"חצי מקופלות\"." },
  "folding-funnel": { el: FoldingFunnel, captionHe: "משפך הקיפול. למעלה — מספר עצום של מבנים פרושים; ככל שהאנרגיה החופשית יורדת, מספר המבנים האפשריים קטן, עד המבנה הטבעי בתחתית. שקעים בדפנות הם תוצרי ביניים. הרבה מסלולים מובילים לאותה תחתית. סכמטי." },
  "membrane-proteins": { el: MembraneProteins, captionHe: "דרכים שבהן חלבונים נקשרים לממברנה. אינטגרליים — סלילי α שחוצים את הממברנה, או חבית β (כמו פורין); משתחררים רק בדטרגנט. היקפיים — נקשרים לראשים הקוטביים או לחלבון אחר; משתחררים במלח או בשינוי pH. ויש חלבונים שמעוגנים בשומן שמחובר אליהם קוולנטית. סכמטי." },
  "sds-standard": { el: SdsStandard, captionHe: "עקומת כיול לג'ל SDS — הנתונים מהתרגיל. לוגריתם המסה יורד ליניארית עם הניידות: סמן 20 kDa ב-0.90 וסמן 100 kDa ב-0.30. חלבון בניידות 0.60 נמצא באמצע בסקאלה הלוגריתמית — כ-45 kDa, ולא 60." },
  "o2-binding": { el: O2Binding, captionHe: "עקומות קישור חמצן, מחושבות: מיוגלובין — היפרבולה עם P₅₀ = 2 torr; המוגלובין — משוואת היל עם P₅₀ = 26 torr ו-n = 2.8. בין הריאות (100 torr) לרקמה פעילה (20 torr) ההמוגלובין מוסר כ-65% מהקיבולת, והמיוגלובין רק כ-7%." },
  "bohr-shift": { el: BohrShift, captionHe: "הזזות של עקומת ההמוגלובין (ערכי P₅₀ להמחשה). ירידה ב-pH, עלייה ב-CO₂ ועלייה ב-2,3-BPG מייצבות את מצב T ומזיזות את העקומה ימינה — יותר חמצן משתחרר. המוגלובין עוברי קושר פחות 2,3-BPG, ולכן העקומה שלו משמאל." },
  "energy-diagram": { el: EnergyDiagram, captionHe: "דיאגרמת אנרגיה של תגובה S → P. האנזים מוריד את אנרגיית השפעול ΔG‡ (המחסום עד מצב המעבר), ולכן מאיץ את התגובה בשני הכיוונים — אבל ההפרש ΔG בין המצע לתוצר, ולכן גם שיווי המשקל, לא משתנה. סכמטי." },
  "michaelis-menten": { el: MichaelisMenten, captionHe: "עקומת מיכאליס-מנטן: V₀ = Vₘₐₓ[S]/([S] + Kₘ). בריכוז מצע נמוך הקצב עולה כמעט ליניארית (סדר ראשון); ב-[S] = Kₘ הקצב הוא חצי מ-Vₘₐₓ; בריכוז גבוה הוא מתקרב ל-Vₘₐₓ ולא מגיע אליו." },
  lineweaver: { el: LineweaverBurk, captionHe: "גרף ליינוויבר-ברק של אותו אנזים: 1/V₀ מול 1/[S] הוא קו ישר. החיתוך עם ציר y הוא 1/Vₘₐₓ, החיתוך עם ציר x הוא −1/Kₘ, והשיפוע הוא Kₘ/Vₘₐₓ. הנקודות נמדדות רק בצד החיובי; הקו המקווקו הוא המשכה." },
  "inh-competitive": { el: InhCompetitive, captionHe: "עיכוב תחרותי בגרף ליינוויבר-ברק (המעכב מכפיל את Kₘ הנראה פי 2). Vₘₐₓ לא משתנה, ולכן הקווים נחתכים על ציר y; השיפוע עולה." },
  "inh-uncompetitive": { el: InhUncompetitive, captionHe: "עיכוב שבו המעכב נקשר רק ל-ES (uncompetitive). Vₘₐₓ ו-Kₘ יורדים באותו יחס, ולכן השיפוע Kₘ/Vₘₐₓ לא משתנה — קווים מקבילים." },
  "inh-noncompetitive": { el: InhNoncompetitive, captionHe: "עיכוב לא-תחרותי טהור. Kₘ לא משתנה ו-Vₘₐₓ יורד, ולכן הקווים נחתכים על ציר x (ב-−1/Kₘ). כך נראה גם אנזים שחלק ממנו הושבת על ידי מעכב בלתי הפיך." },
  "catalytic-triad": { el: CatalyticTriad, captionHe: "השלישייה הקטליטית של כימוטריפסין. Asp102 מכוון את His57; His57 מושך את הפרוטון מה-OH של Ser195, והסרין תוקף את פחמן הקרבוניל של הקשר שנחתך. המטען השלילי שנוצר על החמצן מיוצב בחור האוקסיאניון. סכמטי." },
  "allosteric-curves": { el: AllostericCurves, captionHe: "קינטיקה סיגמואידית של אנזים אלוסטרי, מחושבת במודל המתואם (MWC) עם 6 אתרים כמו ב-ATCase, ומקדמים אלוסטריים מ-Berg: L = 200 בלי אפקטורים, 1250 עם CTP, 70 עם ATP (יחס הזיקה בין T ל-R נבחר להמחשה). CTP מייצב את T ומזיז את העקומה ימינה; ATP מייצב את R ומזיז שמאלה." },
  "kinase-cycle": { el: KinaseCycle, captionHe: "מחזור זרחון. קינאז מעביר את הפוספט האחרון של ATP לשייר עם OH; פוספטאז מסיר אותו בהידרוליזה. אלה שתי תגובות נפרדות, וכל אחת בלתי הפיכה — לכן המחזור עולה ATP אחד, ומצב החלבון נקבע לפי היחס בין שני האנזימים." },
  "zymogen-cascade": { el: ZymogenCascade, captionHe: "השפעול של זימוגני הלבלב בתריסריון. אנטרופפטידאז חותך טריפסינוגן לטריפסין; הטריפסין מפעיל עוד טריפסינוגן ואת שאר הזימוגנים — כך כל אנזימי העיכול נדלקים יחד ובמקום הנכון." },
  polysaccharides: { el: Polysaccharides, captionHe: "שלושה רב-סוכרים של גלוקוז. עמילוז — שרשרת α-1,4 לא מסועפת. גליקוגן — שרשראות α-1,4 עם הסתעפויות α-1,6 (בערך כל 12 יחידות); לכל ענף קצה לא מחזר משלו (ירוק), שממנו אפשר לפרק. תאית — שרשראות β-1,4 ישרות ומקבילות, שמחוברות בקשרי מימן לסיבים. סכמטי." },
  "micelle-bilayer": { el: MicelleBilayer, captionHe: "חומצת שומן עם זנב אחד יוצרת מיצלה; לפוספוליפידים יש שתי שרשראות הידרופוביות, והם יוצרים שכבה כפולה. בשני המקרים הראשים הקוטביים פונים למים והזנבות מוסתרים בפנים — האפקט ההידרופובי. סכמטי." },
};
