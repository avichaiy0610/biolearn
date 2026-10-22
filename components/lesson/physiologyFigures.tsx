/* Figures for the physiology units (Technion 134117). Schematic unless the caption says the curve is computed.
   Colors: Na⁺ orange, K⁺ blue, Ca²⁺ red, Cl⁻ green, membranes gray, signals purple.
   Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, BLUE, GREEN, INK, LINE, MUTED, ORANGE, He, La, curve, dash, scale } from "./biochemFigures";
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
const HBox = ({ x, y, w, h = 28, label, c = BLUE, fill = FILL.blue, size = 12, bold = false }: { x: number; y: number; w: number; h?: number; label: React.ReactNode; c?: string; fill?: string; size?: number; bold?: boolean }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={7} fill={fill} stroke={c} strokeWidth={1.5} />
    <He x={x} y={y + h / 2 + size * 0.36} size={size} bold={bold}>{label}</He>
  </g>
);
const LBox = ({ x, y, w, h = 28, label, c = BLUE, fill = FILL.blue, size = 12, bold = false }: { x: number; y: number; w: number; h?: number; label: React.ReactNode; c?: string; fill?: string; size?: number; bold?: boolean }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={7} fill={fill} stroke={c} strokeWidth={1.5} />
    <La x={x} y={y + h / 2 + size * 0.36} size={size} bold={bold}>{label}</La>
  </g>
);
const Tag = ({ x, y, t, c = ORANGE, fill = FILL.orange, r = 10, size = 9.5 }: { x: number; y: number; t: string; c?: string; fill?: string; r?: number; size?: number }) => (
  <g><circle cx={x} cy={y} r={r} fill={fill} stroke={c} strokeWidth={1.3} /><La x={x} y={y + size * 0.36} size={size} bold color={c}>{t}</La></g>
);
const Axes = ({ x0, y0, x1, y1 }: { x0: number; y0: number; x1: number; y1: number }) => (
  <g>
    <line x1={x0} y1={y0} x2={x1 + 8} y2={y0} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
    <line x1={x0} y1={y0 + 4} x2={x0} y2={y1 - 8} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
  </g>
);

// ── ph-transport ─────────────────────────────────────────────────────────────
function TransportKinetics() {
  const s = scale(60, 440, 230, 40, 0, 10, 0, 1.2);
  const vmax = 1, km = 1.5;
  return (
    <Svg h={280} label="קצב ההובלה כפונקציה של ריכוז החומר: בדיפוזיה פשוטה או דרך תעלה הקצב עולה ליניארית; דרך נשא הקצב עולה ומגיע לרוויה ב-Vmax, כי מספר הנשאים מוגבל">
      <Axes x0={60} y0={230} x1={440} y1={40} />
      <He x={250} y={268} size={12.5}>ריכוז החומר</He>
      <He x={26} y={135} size={12} rotate={-90}>קצב ההובלה</He>
      <path d={curve((c) => 0.11 * c, 0, 10, s)} fill="none" stroke={ORANGE} strokeWidth={3} />
      <path d={curve((c) => (vmax * c) / (km + c), 0, 10, s)} fill="none" stroke={BLUE} strokeWidth={3} />
      <line x1={60} x2={440} y1={s.sy(vmax)} y2={s.sy(vmax)} stroke={BLUE} strokeWidth={1.2} {...dash} />
      <La x={66} y={s.sy(vmax) - 6} size={11} anchor="start" color={BLUE}>Vmax</La>
      <line x1={s.sx(km)} x2={s.sx(km)} y1={230} y2={s.sy(0.5)} stroke={MUTED} strokeWidth={1} {...dash} />
      <La x={s.sx(km)} y={246} size={11} color={MUTED}>Km</La>
      <He x={s.sx(8.6)} y={s.sy(1.05) - 8} size={12} bold color={ORANGE}>דיפוזיה / תעלה</He>
      <He x={s.sx(7.5)} y={s.sy(0.78) + 22} size={12} bold color={BLUE}>נשא — רוויה</He>
    </Svg>
  );
}

// ── ph-membrane-potential ────────────────────────────────────────────────────
function RestingPotentialIons() {
  const y = (mv: number) => 150 - mv * 0.9;
  const marks: [number, string, string][] = [[123, "E_Ca ≈ +123", RED], [67, "E_Na ≈ +67", ORANGE], [0, "0 mV", MUTED], [-70, "Vm ≈ −70", INK], [-97, "E_K ≈ −97", BLUE]];
  return (
    <Svg h={280} label="סרגל מתחים: פוטנציאלי שיווי המשקל של היונים העיקריים — E_Ca כ-+123, E_Na כ-+67, E_K כ-−97 מיליוולט — ופוטנציאל המנוחה כ-−70, קרוב ל-E_K. מימין: הכוח המניע במנוחה מכניס Na⁺ בכוח רב ומוציא K⁺ בכוח קטן; המשאבה מחזירה אותם">
      <Line x1={150} y1={y(130)} x2={150} y2={y(-105)} c={INK} w={2} />
      {marks.map(([mv, t, c]) => (
        <g key={t}>
          <Line x1={142} y1={y(mv)} x2={158} y2={y(mv)} c={c} w={mv === -70 ? 3 : 2} />
          {/[א-ת]/.test(t) ? <He x={136} y={y(mv) + 4} size={11.5} anchor="end" bold color={c}>{t}</He> : <La x={136} y={y(mv) + 4} size={11.5} anchor="end" bold color={c}>{t}</La>}
        </g>
      ))}
      {/* membrane */}
      <He x={40} y={y(-70) + 4} size={11} color={MUTED}>(מנוחה)</He>
      <rect x={300} y={40} width={24} height={210} fill={FILL.gray} stroke={MUTED} />
      <He x={256} y={34} size={11.5} color={MUTED}>בחוץ</He>
      <He x={372} y={34} size={11.5} color={MUTED}>בתוך התא</He>
      <La x={256} y={84} size={12} bold color={ORANGE}>Na⁺ 145</La><La x={372} y={84} size={12} bold color={ORANGE}>Na⁺ 12</La>
      <Arrow x1={270} y1={100} x2={350} y2={100} color={ORANGE} width={3.2} />
      <La x={256} y={150} size={12} bold color={BLUE}>K⁺ 4</La><La x={372} y={150} size={12} bold color={BLUE}>K⁺ 150</La>
      <Arrow x1={350} y1={166} x2={292} y2={166} color={BLUE} width={1.8} />
      <circle cx={312} cy={220} r={14} fill={FILL.yellow} stroke={PURPLE} strokeWidth={1.5} />
      <He x={420} y={210} size={11} color={PURPLE}>Na⁺/K⁺-ATPase</He>
      <He x={420} y={226} size={10.5} color={MUTED}>3 Na⁺ החוצה, 2 K⁺ פנימה</He>
      <He x={420} y={118} size={10.5} color={ORANGE}>כוח גדול, מוליכות נמוכה</He>
      <He x={420} y={184} size={10.5} color={BLUE}>כוח קטן, מוליכות גבוהה</He>
    </Svg>
  );
}

// ── ph-action-potential ──────────────────────────────────────────────────────
function ApConductances() {
  const s = scale(70, 450, 150, 30, 0, 5, -90, 40);
  const g = scale(70, 450, 270, 175, 0, 5, 0, 1);
  const v = (t: number) => {
    if (t < 1) return -70;
    const up = 1 / (1 + Math.exp(-(t - 1.25) / 0.06));
    const down = 1 / (1 + Math.exp(-(t - 2.0) / 0.18));
    const ahp = -12 * Math.exp(-((t - 3.0) ** 2) / 0.35) * (t > 2.2 ? 1 : 0);
    return -70 + 105 * up - 112 * down * up + ahp + 7 * down * (t > 3.6 ? Math.min(1, (t - 3.6) / 1) : 0);
  };
  const gna = (t: number) => Math.exp(-((t - 1.35) ** 2) / 0.03);
  const gk = (t: number) => (t < 1.3 ? 0 : ((0.75 * Math.E) / 0.7) * (t - 1.3) * Math.exp(-(t - 1.3) / 0.7));
  return (
    <Svg h={300} label="פוטנציאל פעולה ומוליכויות (עקומות מודגמות): למעלה — המתח עולה במהירות מ-−70 לכ-+35 מיליוולט, יורד וחולף מתחת למנוחה לזמן קצר. למטה — מוליכות ה-Na⁺ עולה ראשונה ויורדת מהר (השבתה), ומוליכות ה-K⁺ עולה מאוחר ונשארת זמן ארוך יותר">
      <line x1={70} x2={450} y1={s.sy(-70)} y2={s.sy(-70)} stroke={LINE} {...dash} />
      <La x={64} y={s.sy(-70) + 4} size={10.5} anchor="end" color={MUTED}>−70</La>
      <line x1={70} x2={450} y1={s.sy(0)} y2={s.sy(0)} stroke={LINE} {...dash} />
      <La x={64} y={s.sy(0) + 4} size={10.5} anchor="end" color={MUTED}>0</La>
      <La x={64} y={s.sy(-55) + 4} size={10.5} anchor="end" color={RED}>סף</La>
      <line x1={70} x2={200} y1={s.sy(-55)} y2={s.sy(-55)} stroke={RED} strokeWidth={1} {...dash} />
      <path d={curve(v, 0, 5, s, 300)} fill="none" stroke={INK} strokeWidth={3} />
      <He x={330} y={44} size={12} bold>Vm (mV)</He>
      <line x1={70} x2={450} y1={270} y2={270} stroke={INK} strokeWidth={1.4} />
      <path d={curve(gna, 0, 5, g, 300)} fill="none" stroke={ORANGE} strokeWidth={3} />
      <path d={curve(gk, 0, 5, g, 300)} fill="none" stroke={BLUE} strokeWidth={3} />
      <La x={g.sx(1.35) + 14} y={g.sy(0.95)} size={12} bold color={ORANGE} anchor="start">g_Na</La>
      <La x={g.sx(2.6)} y={g.sy(0.72)} size={12} bold color={BLUE} anchor="start">g_K</La>
      <He x={260} y={292} size={11.5} color={MUTED}>זמן (אלפיות שנייה)</He>
    </Svg>
  );
}

function SaltatoryConduction() {
  const nodes = [70, 170, 270, 370];
  return (
    <Svg h={250} label="הולכה קופצנית: באקסון ממוילן פוטנציאל הפעולה מתחדש רק בצמתי רנוויה, שבהם מרוכזות תעלות Na⁺, ו'קופץ' מצומת לצומת. למטה, באקסון לא ממוילן, פוטנציאל הפעולה מתחדש בכל נקודה לאורך הממברנה ומתקדם לאט">
      <He x={240} y={22} size={12.5} bold>אקסון ממוילן — הולכה קופצנית</He>
      <Line x1={30} y1={90} x2={450} y2={90} c={MUTED} w={10} />
      {nodes.slice(0, -1).map((x, i) => <rect key={x} x={x + 10} y={72} width={80} height={36} rx={14} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.4} />)}
      <rect x={380} y={72} width={70} height={36} rx={14} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.4} />
      {nodes.map((x) => <g key={x}>{[-6, 0, 6].map((d) => <circle key={d} cx={x + d} cy={90} r={2.6} fill={ORANGE} />)}</g>)}
      {nodes.slice(0, -1).map((x, i) => <path key={i} d={`M${x} 66 Q${x + 50} 30 ${x + 98} 66`} fill="none" stroke={RED} strokeWidth={2} markerEnd="url(#bfArrowS)" />)}
      <He x={120} y={130} size={10.5} color={ORANGE}>מיאלין</He>
      <He x={70} y={130} size={10.5} color={RED}>צומת</He>
      <He x={240} y={160} size={12.5} bold>אקסון לא ממוילן — הולכה רציפה</He>
      <Line x1={30} y1={210} x2={450} y2={210} c={MUTED} w={10} />
      {Array.from({ length: 21 }, (_, i) => <circle key={i} cx={40 + i * 20} cy={210} r={2.3} fill={ORANGE} />)}
      <Arrow x1={60} y1={232} x2={200} y2={232} color={RED} />
      <He x={330} y={238} size={10.5} color={MUTED}>מתקדם לאט, נקודה אחרי נקודה</He>
    </Svg>
  );
}

// ── ph-nervous-system ────────────────────────────────────────────────────────
function GliaTypes() {
  return (
    <Svg h={300} label="סוגי תאי הגליה: אסטרוציט עם שלוחות לנימי דם ולסינפסות; אוליגודנדרוציט שעוטף בכמה שלוחות קטעים של כמה אקסונים במערכת המרכזית; תא שוואן שעוטף קטע של אקסון אחד במערכת ההיקפית; מיקרוגליה — תאי החיסון של המוח">
      {/* astrocyte */}
      <circle cx={120} cy={80} r={14} fill={FILL.green} stroke={GREEN} strokeWidth={1.5} />
      {[[60, 40], [70, 120], [175, 45], [180, 115], [120, 20]].map(([x, y], i) => <Line key={i} x1={120} y1={80} x2={x} y2={y} c={GREEN} w={2.5} />)}
      <rect x={40} y={112} width={40} height={14} rx={7} fill={FILL.red} stroke={RED} />
      <He x={60} y={142} size={10} color={RED}>נים</He>
      <He x={120} y={168} size={12.5} bold color={GREEN}>אסטרוציט</He>
      <He x={120} y={184} size={10.5} color={MUTED}>K⁺, גלוטמט, מחסום דם-מוח</He>
      {/* oligodendrocyte */}
      <circle cx={360} cy={50} r={13} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.5} />
      {[300, 360, 420].map((x) => <g key={x}><Line x1={360} y1={58} x2={x} y2={110} c={PURPLE} w={2} /><rect x={x - 18} y={104} width={36} height={14} rx={6} fill={FILL.purple} stroke={PURPLE} /></g>)}
      <Line x1={270} y1={111} x2={450} y2={111} c={MUTED} w={2} />
      <He x={360} y={146} size={12.5} bold color={PURPLE}>אוליגודנדרוציט</He>
      <He x={360} y={162} size={10.5} color={MUTED}>מרכזי — כמה אקסונים</He>
      {/* schwann */}
      <Line x1={260} y1={232} x2={460} y2={232} c={MUTED} w={2} />
      <rect x={320} y={220} width={80} height={24} rx={10} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.5} />
      <circle cx={360} cy={214} r={7} fill={FILL.orange} stroke={ORANGE} />
      <He x={360} y={268} size={12.5} bold color={ORANGE}>תא שוואן</He>
      <He x={360} y={284} size={10.5} color={MUTED}>היקפי — קטע של אקסון אחד</He>
      {/* microglia */}
      <ellipse cx={120} cy={236} rx={12} ry={8} fill={FILL.sky} stroke={BLUE} strokeWidth={1.5} />
      {[[95, 222], [100, 252], [145, 224], [142, 252]].map(([x, y], i) => <Line key={i} x1={120} y1={236} x2={x} y2={y} c={BLUE} w={1.5} />)}
      <He x={120} y={278} size={12.5} bold color={BLUE}>מיקרוגליה</He>
      <He x={120} y={294} size={10.5} color={MUTED}>תאי חיסון</He>
    </Svg>
  );
}

// ── ph-synapse ───────────────────────────────────────────────────────────────
function EpspIpspReversal() {
  const y = (mv: number) => 40 + (10 - mv) * 1.9;
  const levels: [number, string, string, string][] = [[0, "קטיונים — AMPA, ניקוטיני", "Erev ≈ 0", ORANGE], [-55, "סף", "−55", RED], [-70, "מנוחה", "", INK], [-75, "תעלות Cl⁻ — GABA_A", "Erev ≈ −75", GREEN], [-90, "תעלות K⁺", "Erev ≈ −90", BLUE]];
  const trace = (x0: number, amp: number, c: string) => {
    let d = "";
    for (let i = 0; i <= 60; i++) { const t = i / 60; const k = t < 0.1 ? 0 : (Math.exp(-(t - 0.1) / 0.25) - Math.exp(-(t - 0.1) / 0.05)); d += `${i ? "L" : "M"}${(x0 + i * 2).toFixed(1)} ${(y(-70) - amp * 2.4 * k * 1.9).toFixed(1)}`; }
    return <path d={d} fill="none" stroke={c} strokeWidth={2.6} />;
  };
  return (
    <Svg h={270} label="מה קובע אם פוטנציאל סינפטי מעורר או מעכב: פוטנציאל ההיפוך של הזרם הסינפטי ביחס לסף. בקולטנים לקטיונים (AMPA, ניקוטיני) פוטנציאל ההיפוך כ-0 — מעל הסף — ונוצר EPSP; בתעלות Cl⁻ (GABA_A) וב-K⁺ פוטנציאל ההיפוך מתחת לסף — ונוצר IPSP">
      {levels.map(([mv, t, v, c]) => (
        <g key={t}>
          <line x1={150} x2={400} y1={y(mv)} y2={y(mv)} stroke={c} strokeWidth={mv === -55 || mv === -70 ? 1.4 : 1} {...dash} />
          <He x={146} y={y(mv) + 4} size={10.5} anchor="end" bold color={c}>{t}</He>
          {v && <La x={406} y={y(mv) + 4} size={10.5} anchor="start" bold color={c}>{v}</La>}
        </g>
      ))}
      {trace(160, 12, ORANGE)}
      <La x={220} y={y(-70) - 38} size={12} bold color={ORANGE}>EPSP</La>
      {trace(278, -4, GREEN)}
      <La x={340} y={y(-70) + 30} size={12} bold color={GREEN}>IPSP</La>
      <He x={300} y={262} size={11} color={MUTED}>הזרם מושך את המתח לכיוון פוטנציאל ההיפוך שלו</He>
    </Svg>
  );
}

// ── ph-skeletal-muscle ───────────────────────────────────────────────────────
function Sarcomere() {
  const row = (y: number, half: number, label: string) => {
    const cx = 240, zL = cx - half, zR = cx + half, thick = 80, thin = 95;
    return (
      <g>
        <He x={470} y={y + 4} size={11.5} anchor="end" bold>{label}</He>
        <Line x1={zL} y1={y - 30} x2={zL} y2={y + 30} c={INK} w={3} />
        <Line x1={zR} y1={y - 30} x2={zR} y2={y + 30} c={INK} w={3} />
        {[-18, -6, 6, 18].map((d) => <g key={d}><Line x1={zL} y1={y + d} x2={zL + thin} y2={y + d} c={RED} w={2} /><Line x1={zR} y1={y + d} x2={zR - thin} y2={y + d} c={RED} w={2} /></g>)}
        {[-12, 0, 12].map((d) => <Line key={d} x1={cx - thick} y1={y + d} x2={cx + thick} y2={y + d} c={BLUE} w={5} />)}
      </g>
    );
  };
  return (
    <Svg h={300} label="סרקומר רפוי ומכווץ: בין שני קווי Z, סיבים דקים של אקטין (אדום) מעוגנים בקווי ה-Z, וסיבים עבים של מיוזין (כחול) במרכז. בהתכווצות הסיבים הדקים מחליקים פנימה: פס A (אורך הסיבים העבים) קבוע, ופס I ואזור H מתקצרים">
      {row(70, 140, "רפוי")}
      {row(200, 105, "מכווץ")}
      {/* labels on relaxed */}
      <line x1={160} x2={320} y1={112} y2={112} stroke={BLUE} strokeWidth={1.2} />
      <La x={240} y={128} size={11.5} bold color={BLUE}>A band</La>
      <line x1={100} x2={160} y1={34} y2={34} stroke={RED} strokeWidth={1.2} />
      <La x={130} y={28} size={11} bold color={RED}>I</La>
      <line x1={195} x2={285} y1={34} y2={34} stroke={MUTED} strokeWidth={1.2} />
      <La x={240} y={28} size={11} bold color={MUTED}>H</La>
      <La x={100} y={112} size={11} color={INK}>Z</La><La x={380} y={112} size={11} color={INK}>Z</La>
      <line x1={160} x2={320} y1={242} y2={242} stroke={BLUE} strokeWidth={1.2} />
      <La x={240} y={258} size={11.5} bold color={BLUE}>A band — ללא שינוי</La>
      <He x={240} y={290} size={11} color={MUTED}>הסיבים לא מתקצרים — הם מחליקים זה על זה</He>
    </Svg>
  );
}

// ── ph-smooth-cardiac-muscle ─────────────────────────────────────────────────
function CicrCardiac() {
  return (
    <Svg h={290} label="צימוד עירור-התכווצות בשריר הלב: פוטנציאל הפעולה פותח תעלות Ca²⁺ מסוג L בצינורית T; ה-Ca²⁺ שנכנס פותח את RyR2 ב-SR, שמשחרר כמות גדולה של Ca²⁺ לטרופונין C. בהרפיה SERCA2 (שמעוכבת ע״י פוספולמבן) מחזירה Ca²⁺ ל-SR, ו-NCX מוציא Ca²⁺ החוצה בתמורה ל-Na⁺">
      <rect x={20} y={30} width={440} height={22} fill={FILL.gray} stroke={MUTED} />
      <He x={60} y={22} size={11} color={MUTED}>בחוץ</He>
      <rect x={160} y={52} width={40} height={90} fill={FILL.gray} stroke={MUTED} />
      <He x={180} y={160} size={10.5} color={MUTED}>צינורית T</He>
      <LBox x={180} y={70} w={54} h={24} label="L-type" c={RED} fill={FILL.red} size={10.5} />
      <Arrow x1={180} y1={22} x2={180} y2={66} color={RED} />
      <Tag x={200} y={14} t="Ca" c={RED} fill={FILL.red} />
      <rect x={220} y={60} width={200} height={70} rx={20} fill={FILL.sky} stroke={BLUE} strokeWidth={1.5} />
      <La x={340} y={100} size={14} bold color={BLUE}>SR</La>
      <LBox x={248} y={96} w={52} h={24} label="RyR2" c={RED} fill={FILL.red} size={10.5} />
      <Arrow x1={200} y1={92} x2={222} y2={104} color={RED} />
      <He x={154} y={136} size={10} color={RED} anchor="end">Ca²⁺ פותח</He>
      <Arrow x1={248} y1={122} x2={248} y2={180} color={RED} width={3} />
      <He x={248} y={198} size={12} bold color={RED}>Ca²⁺ ↑ → טרופונין C → התכווצות</He>
      <LBox x={390} y={136} w={74} h={24} label="SERCA2" c={GREEN} fill={FILL.green} size={10.5} />
      <Arrow x1={390} y1={176} x2={390} y2={162} color={GREEN} />
      <He x={390} y={186} size={10} color={MUTED}>פוספולמבן ⊣</He>
      <LBox x={80} y={58} w={60} h={24} label="NCX" c={ORANGE} fill={FILL.orange} size={10.5} />
      <Arrow x1={40} y1={92} x2={40} y2={44} color={RED} />
      <Arrow x1={120} y1={44} x2={120} y2={92} color={ORANGE} />
      <He x={80} y={114} size={10} color={MUTED}>Ca²⁺ החוצה, 3 Na⁺ פנימה</He>
      <He x={240} y={240} size={11.5} color={MUTED}>בשריר השלד, לעומת זאת: DHPR מחובר מכנית ל-RyR1 — בלי צורך ב-Ca²⁺ מבחוץ</He>
      <He x={240} y={262} size={11.5} color={PURPLE}>β1 → PKA: מזרחן תעלות L ופוספולמבן → כוח והרפיה מהירה</He>
    </Svg>
  );
}

function SmoothMuscleMlck() {
  return (
    <Svg h={290} label="בקרת ההתכווצות בשריר חלק: Ca²⁺ נקשר לקלמודולין, Ca²⁺-קלמודולין מפעיל את MLCK שמזרחן את השרשרת הקלה של המיוזין — התכווצות. MLCP מסיר את הפוספט — הרפיה. Rho kinase מעכב את MLCP (רגישות-יתר ל-Ca²⁺); NO דרך cGMP מגביר הרפיה">
      <Tag x={60} y={50} t="Ca²⁺" c={RED} fill={FILL.red} r={16} size={10} />
      <Arrow x1={78} y1={50} x2={120} y2={50} />
      <HBox x={180} y={36} w={110} label="קלמודולין" c={PURPLE} fill={FILL.purple} />
      <Arrow x1={236} y1={50} x2={276} y2={50} />
      <LBox x={320} y={36} w={80} label="MLCK" c={GREEN} fill={FILL.green} bold />
      <Arrow x1={320} y1={66} x2={320} y2={110} color={GREEN} width={3} />
      <HBox x={320} y={114} w={150} label="מיוזין-P → התכווצות" c={GREEN} fill={FILL.green} bold />
      <Arrow x1={244} y1={136} x2={150} y2={136} color={BLUE} width={3} />
      <LBox x={110} y={122} w={70} label="MLCP" c={BLUE} fill={FILL.blue} bold />
      <He x={102} y={176} size={11} color={BLUE} anchor="end">מסיר P → הרפיה</He>
      <LBox x={110} y={210} w={100} label="Rho kinase" c={RED} fill={FILL.red} />
      <line x1={110} y1={208} x2={110} y2={156} stroke={RED} strokeWidth={2} />
      <line x1={100} y1={156} x2={120} y2={156} stroke={RED} strokeWidth={3} />
      <He x={110} y={254} size={10.5} color={RED}>רגישות-יתר ל-Ca²⁺</He>
      <LBox x={320} y={210} w={110} label="NO → cGMP" c={BLUE} fill={FILL.sky} />
      <Arrow x1={270} y1={220} x2={150} y2={150} color={BLUE} dashed />
      <He x={320} y={254} size={10.5} color={BLUE}>מגביר MLCP, מוריד Ca²⁺</He>
      <He x={430} y={60} size={10.5} color={MUTED} anchor="end">אין טרופונין</He>
    </Svg>
  );
}

// ── ph-blood ─────────────────────────────────────────────────────────────────
function EpoFeedback() {
  const box = (x: number, y: number, w: number, t: string, c: string, fill: string) => <HBox x={x} y={y} w={w} label={t} c={c} fill={fill} />;
  return (
    <Svg h={260} label="משוב שלילי של אריתרופויאטין: ירידה באספקת החמצן לכליה מגבירה את הפרשת EPO; EPO מגרה את מח העצם לייצר יותר תאים אדומים; כושר נשיאת החמצן עולה, והאספקה לכליה חוזרת — EPO יורד">
      {box(240, 20, 220, "↓ אספקת חמצן לכליה", RED, FILL.red)}
      <Arrow x1={330} y1={50} x2={380} y2={92} />
      {box(390, 96, 140, "כליה: EPO ↑", ORANGE, FILL.orange)}
      <Arrow x1={390} y1={126} x2={340} y2={176} />
      {box(240, 180, 210, "מח עצם: יותר תאים אדומים", PURPLE, FILL.purple)}
      <Arrow x1={140} y1={176} x2={90} y2={126} />
      {box(90, 96, 150, "↑ נשיאת חמצן", GREEN, FILL.green)}
      <Arrow x1={90} y1={92} x2={150} y2={50} color={GREEN} dashed />
      <He x={86} y={58} size={11} color={GREEN}>משוב שלילי</He>
      <He x={240} y={244} size={10.5} color={MUTED}>גירויים: אנמיה, גובה רב, מחלת ריאות · חיישן: HIF בתאי הכליה</He>
    </Svg>
  );
}

function CoagulationCascade() {
  return (
    <Svg h={330} label="מפל הקרישה בגוף: פקטור רקמה עם VIIa מפעיל את X; Xa עם Va הופך פרותרומבין לתרומבין; תרומבין הופך פיברינוגן לפיברין, מפעיל XIII שיוצר קשרים צולבים, ומגביר את המפל דרך V, VIII, XI וטסיות. IXa עם VIIIa מפעיל עוד X. מימין: המערכות נגד קרישה — אנטיתרומבין, חלבון C ופלסמין">
      <LBox x={90} y={20} w={120} label="TF + VIIa" c={RED} fill={FILL.red} bold />
      <Arrow x1={130} y1={50} x2={190} y2={84} color={RED} />
      <LBox x={130} y={92} w={80} label="IXa + VIIIa" c={PURPLE} fill={FILL.purple} size={11} />
      <Arrow x1={172} y1={106} x2={196} y2={106} color={PURPLE} />
      <LBox x={240} y={92} w={80} label="X → Xa" c={INK} fill={FILL.gray} bold />
      <Arrow x1={240} y1={122} x2={240} y2={154} />
      <La x={252} y={142} size={10.5} color={MUTED} anchor="start">+ Va, Ca²⁺</La>
      <LBox x={240} y={158} w={170} label="prothrombin → thrombin" c={ORANGE} fill={FILL.orange} bold size={11.5} />
      <Arrow x1={240} y1={188} x2={240} y2={220} color={ORANGE} width={3} />
      <LBox x={240} y={224} w={170} label="fibrinogen → fibrin" c={GREEN} fill={FILL.green} bold size={11.5} />
      <Arrow x1={240} y1={254} x2={240} y2={280} color={GREEN} />
      <He x={240} y={300} size={11.5} bold color={GREEN}>XIIIa — קשרים צולבים → קריש יציב</He>
      <path d="M150 172 C 60 172, 60 120, 96 122" fill="none" stroke={ORANGE} strokeWidth={1.6} markerEnd="url(#bfArrowS)" {...dash} />
      <He x={52} y={186} size={10} color={ORANGE}>הגברה: V, VIII, XI, טסיות</He>
      {/* anticoagulants */}
      <rect x={348} y={86} width={124} height={160} rx={12} fill={FILL.sky} stroke={BLUE} strokeWidth={1.2} />
      <He x={410} y={106} size={11.5} bold color={BLUE}>נגד קרישה</He>
      <He x={410} y={130} size={10.5}>אנטיתרומבין III</He>
      <He x={410} y={146} size={10} color={MUTED}>(הפרין מגביר)</He>
      <He x={410} y={172} size={10.5}>חלבון C + S</He>
      <He x={410} y={188} size={10} color={MUTED}>מפרקים Va, VIIIa</He>
      <He x={410} y={214} size={10.5}>tPA → פלסמין</He>
      <He x={410} y={230} size={10} color={MUTED}>מפרק פיברין</He>
      <He x={90} y={66} size={10} color={MUTED}>וויטמין K: II, VII, IX, X</He>
    </Svg>
  );
}

// ── ph-kidney-filtration ─────────────────────────────────────────────────────
function GlomerularStarling() {
  return (
    <Svg h={270} label="כוחות סטרלינג בפקעית: לחץ הדם בנימים (כ-55 מ״מ כספית) דוחף נוזל החוצה; הלחץ בכופסית באומן (כ-15) והלחץ האוסמוטי של חלבוני הפלזמה (כ-25, עולה לאורך הנים) מתנגדים. הדם נכנס בעורקיק המוביל ויוצא בעורקיק המוציא">
      <Line x1={30} y1={130} x2={110} y2={130} c={RED} w={10} />
      <He x={70} y={112} size={10.5} color={RED}>עורקיק מוביל</He>
      <path d="M110 130 C 160 60, 320 60, 370 130" fill="none" stroke={RED} strokeWidth={14} strokeLinecap="round" />
      <Line x1={370} y1={130} x2={450} y2={130} c={RED} w={8} />
      <He x={410} y={112} size={10.5} color={RED}>עורקיק מוציא</He>
      <path d="M90 150 C 160 250, 320 250, 390 150" fill="none" stroke={MUTED} strokeWidth={2} {...dash} />
      <He x={240} y={238} size={11.5} color={MUTED}>כופסית באומן — הסנן</He>
      <Arrow x1={190} y1={95} x2={190} y2={150} color={RED} width={3} />
      <La x={202} y={130} size={12} bold color={RED} anchor="start">P_GC ≈ 55</La>
      <Arrow x1={280} y1={180} x2={280} y2={118} color={MUTED} />
      <La x={292} y={160} size={12} bold color={MUTED} anchor="start">P_BS ≈ 15</La>
      <Arrow x1={150} y1={150} x2={150} y2={96} color={BLUE} />
      <La x={158} y={174} size={12} bold color={BLUE} anchor="start">π_GC ≈ 25→35</La>
      <He x={240} y={30} size={12.5} bold>כוח נטו ≈ 55 − 15 − 25 ≈ 15 מ״מ כספית (בתחילת הנים)</He>
    </Svg>
  );
}

// ── ph-kidney-tubules ────────────────────────────────────────────────────────
function NephronShape({ children }: { children?: React.ReactNode }) {
  return (
    <g>
      <circle cx={70} cy={60} r={22} fill={FILL.red} stroke={RED} strokeWidth={1.5} />
      <path d="M90 66 C 140 60, 150 90, 160 100 L160 230 Q180 262 200 230 L200 120 C 210 90, 240 80, 270 80 L330 80 L330 260" fill="none" stroke={BLUE} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      <line x1={20} x2={460} y1={140} y2={140} stroke={LINE} {...dash} />
      <He x={455} y={130} size={10} anchor="end" color={MUTED}>קליפה</He>
      <He x={455} y={156} size={10} anchor="end" color={MUTED}>ליבה</He>
      {children}
    </g>
  );
}

function NephronSegments() {
  return (
    <Svg h={290} label="מקטעי הנפרון והנשאים העיקריים, עם אחוז ספיגת ה-Na⁺ שסונן: אבובית מקורבת כ-67% (SGLT2, NHE3, אקוופורין 1); החלק העולה העבה כ-25% (NKCC2, אטום למים); אבובית מרוחקת כ-5% (NCC); צינורית מאספת כ-3% (ENaC בתאים ראשיים, אקוופורין 2 בהשפעת ADH)">
      <NephronShape>
        <He x={145} y={40} size={11.5} bold color={BLUE}>מקורבת ~67%</He>
        <La x={145} y={56} size={10} color={MUTED}>SGLT2 · NHE3 · AQP1</La>
        <He x={120} y={200} size={10.5} color={BLUE} anchor="end">יורד: מים יוצאים</He>
        <He x={212} y={200} size={10.5} bold color={ORANGE} anchor="start">עולה עבה ~25%</He>
        <La x={212} y={216} size={10} color={MUTED} anchor="start">NKCC2 · אטום למים</La>
        <He x={270} y={66} size={11} bold color={GREEN}>מרוחקת ~5%</He>
        <La x={270} y={104} size={10} color={MUTED}>NCC</La>
        <He x={344} y={200} size={11} bold color={PURPLE} anchor="start">מאספת ~3%</He>
        <La x={344} y={216} size={10} color={MUTED} anchor="start">ENaC · AQP2 (ADH)</La>
        <He x={344} y={232} size={10} color={MUTED} anchor="start">אלדוסטרון</He>
      </NephronShape>
    </Svg>
  );
}

function DiureticSites() {
  return (
    <Svg h={290} label="אתרי הפעולה של המשתנים: מעכבי קרבוניק אנהידראזה באבובית המקורבת; משתני לולאה (פורוסמיד) על NKCC2 בחלק העולה העבה; תיאזידים על NCC באבובית המרוחקת; אמילוריד על ENaC וספירונולקטון על קולטן האלדוסטרון בצינורית המאספת — שני האחרונים חוסכי אשלגן">
      <NephronShape>
        <He x={150} y={40} size={11} bold color={MUTED}>אצטזולאמיד</He>
        <He x={150} y={56} size={10} color={MUTED}>(קרבוניק אנהידראזה)</He>
        <He x={212} y={200} size={11.5} bold color={RED} anchor="start">פורוסמיד</He>
        <La x={212} y={216} size={10} color={MUTED} anchor="start">NKCC2 — הכי חזק</La>
        <He x={270} y={66} size={11.5} bold color={ORANGE}>תיאזיד</He>
        <La x={270} y={104} size={10} color={MUTED}>NCC</La>
        <He x={344} y={200} size={11} bold color={GREEN} anchor="start">אמילוריד · ספירונולקטון</He>
        <He x={344} y={216} size={10} color={MUTED} anchor="start">חוסכי K⁺</He>
      </NephronShape>
    </Svg>
  );
}

// ── ph-volume-pressure ───────────────────────────────────────────────────────
function Countercurrent() {
  const lvl = [300, 600, 900, 1200];
  return (
    <Svg h={300} label="מכפל הזרם הנגדי: בחלק היורד של הלולאה מים יוצאים והנוזל מתרכז עד כ-1200; בחלק העולה, שאטום למים, NaCl נשאב החוצה והנוזל מתמהל עד כ-100. הנוזל הבין-תאי בליבה מתרכז בהדרגה מ-300 עד 1200. בצינורית המאספת, בנוכחות ADH, מים יוצאים לליבה והשתן מתרכז">
      {lvl.map((v, i) => (
        <g key={v}>
          <rect x={20} y={50 + i * 55} width={440} height={55} fill={["#fff7ed", "#ffedd5", "#fed7aa", "#fdba74"][i]} opacity={0.55} />
          <La x={40} y={82 + i * 55} size={11} bold color={ORANGE}>{v}</La>
        </g>
      ))}
      <He x={50} y={40} size={10.5} color={ORANGE}>נוזל בין-תאי</He>
      {/* descending */}
      <Line x1={150} y1={50} x2={150} y2={262} c={BLUE} w={8} />
      {/* ascending */}
      <Line x1={210} y1={262} x2={210} y2={50} c={GREEN} w={8} />
      <path d="M150 262 Q180 290 210 262" fill="none" stroke={BLUE} strokeWidth={8} />
      {[90, 145, 200].map((y) => <Arrow key={y} x1={146} y1={y} x2={116} y2={y} color={BLUE} />)}
      {[90, 145, 200].map((y) => <Arrow key={y} x1={214} y1={y} x2={244} y2={y} color={GREEN} />)}
      <He x={130} y={295} size={10.5} color={BLUE}>יורד: H₂O יוצא</He>
      <He x={240} y={295} size={10.5} color={GREEN}>עולה: NaCl נשאב</He>
      <La x={162} y={70} size={10} anchor="start">300</La><La x={162} y={250} size={10} anchor="start">1200</La>
      <La x={222} y={250} size={10} anchor="start">1200</La><La x={222} y={70} size={10} anchor="start">~100</La>
      {/* collecting duct */}
      <Line x1={350} y1={50} x2={350} y2={262} c={PURPLE} w={8} />
      {[100, 160, 220].map((y) => <Arrow key={y} x1={346} y1={y} x2={310} y2={y} color={PURPLE} />)}
      <He x={400} y={160} size={11} bold color={PURPLE}>מאספת + ADH</He>
      <He x={400} y={176} size={10} color={MUTED}>מים יוצאים</He>
      <La x={350} y={286} size={11} bold color={PURPLE}>~1200</La>
    </Svg>
  );
}

function Raas() {
  return (
    <Svg h={300} label="מערכת הרנין-אנגיוטנסין-אלדוסטרון: ירידה בלחץ בעורקיק המוביל, גירוי סימפתטי או פחות NaCl במקולה דנסה מגבירים הפרשת רנין; רנין הופך אנגיוטנסינוגן מהכבד לאנגיוטנסין I; ACE הופך אותו לאנגיוטנסין II, שמכווץ כלי דם, מגביר אלדוסטרון, ADH וצמא, וספיגת Na⁺ — לחץ הדם והנפח עולים, והמשוב השלילי מפחית רנין">
      <He x={110} y={22} size={11} color={MUTED}>↓ לחץ בעורקיק המוביל</He>
      <He x={110} y={38} size={11} color={MUTED}>גירוי סימפתטי (β1)</He>
      <He x={110} y={54} size={11} color={MUTED}>↓ NaCl במקולה דנסה</He>
      <Arrow x1={200} y1={40} x2={240} y2={40} />
      <HBox x={300} y={26} w={110} label="רנין (כליה)" c={ORANGE} fill={FILL.orange} bold />
      <HBox x={110} y={86} w={170} label="אנגיוטנסינוגן (כבד)" c={MUTED} fill={FILL.gray} />
      <Arrow x1={198} y1={100} x2={250} y2={100} color={ORANGE} />
      <HBox x={320} y={86} w={130} label="אנגיוטנסין I" c={MUTED} fill={FILL.gray} />
      <Arrow x1={320} y1={116} x2={320} y2={148} color={PURPLE} />
      <La x={332} y={136} size={11} bold color={PURPLE} anchor="start">ACE</La>
      <HBox x={320} y={152} w={150} label="אנגיוטנסין II" c={RED} fill={FILL.red} bold />
      {[["כיווץ כלי דם", 40], ["אלדוסטרון → Na⁺", 160], ["ADH וצמא", 280], ["ספיגת Na⁺ במקורבת", 400]].map(([t, x]) => (
        <g key={t as string}>
          <Arrow x1={320} y1={182} x2={x as number} y2={214} color={RED} />
          <He x={x as number} y={232} size={10.5} bold>{t as string}</He>
        </g>
      ))}
      <He x={240} y={264} size={12} bold color={GREEN}>↑ לחץ דם ונפח</He>
      <path d="M380 260 C 470 240, 470 60, 360 40" fill="none" stroke={GREEN} strokeWidth={1.6} markerEnd="url(#bfArrowS)" {...dash} />
      <He x={420} y={290} size={10.5} color={GREEN}>משוב שלילי — פחות רנין</He>
      <He x={110} y={290} size={10.5} color={BLUE}>ANP פועל בכיוון ההפוך</He>
    </Svg>
  );
}

export const PHYSIOLOGY_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "transport-kinetics": { el: TransportKinetics, captionHe: "קינטיקה של הובלה (עקומות מודגמות). בדיפוזיה פשוטה או דרך תעלה פתוחה הקצב עולה ליניארית עם הריכוז; דרך נשא הקצב עולה ומגיע לרוויה (Vmax), כי מספר הנשאים מוגבל. Km — הריכוז שבו הקצב מחצית מהמרבי." },
  "resting-potential-ions": { el: RestingPotentialIons, captionHe: "פוטנציאלי שיווי המשקל של היונים (לפי הריכוזים ביחידה) ופוטנציאל המנוחה. Vm קרוב ל-E_K, כי במנוחה הממברנה חדירה בעיקר ל-K⁺. על Na⁺ פועל כוח מניע גדול פנימה, אבל המוליכות שלו נמוכה. Na⁺/K⁺-ATPase מחזירה את מה שדלף. סכמטי." },
  "ap-conductances": { el: ApConductances, captionHe: "פוטנציאל פעולה ומוליכויות ה-Na⁺ וה-K⁺ (עקומות מודגמות לפי המודל של הודג'קין והאקסלי, לא מדידה). מוליכות ה-Na⁺ עולה ראשונה ונעלמת מהר (השבתה); מוליכות ה-K⁺ עולה באיחור ונמשכת — ולכן הרה-פולריזציה וההיפר-פולריזציה שאחריה." },
  "saltatory-conduction": { el: SaltatoryConduction, captionHe: "הולכה קופצנית: באקסון ממוילן, תעלות Na⁺ מרוכזות בצמתי רנוויה, ופוטנציאל הפעולה מתחדש רק בהם — מהיר וחסכוני. באקסון לא ממוילן הוא מתחדש בכל נקודה. סכמטי, לא בקנה מידה." },
  "glia-types": { el: GliaTypes, captionHe: "סוגי תאי הגליה העיקריים. במערכת המרכזית: אסטרוציטים, אוליגודנדרוציטים (מיאלין לכמה אקסונים) ומיקרוגליה. במערכת ההיקפית: תאי שוואן (מיאלין לקטע של אקסון אחד). סכמטי." },
  "epsp-ipsp-reversal": { el: EpspIpspReversal, captionHe: "פוטנציאל ההיפוך של הזרם הסינפטי קובע את סוג הסינפסה: מעל הסף — מעוררת (EPSP), מתחת לסף — מעכבת (IPSP). הזרם מושך את המתח לכיוון פוטנציאל ההיפוך שלו. ערכים טיפוסיים; סכמטי." },
  "sarcomere": { el: Sarcomere, captionHe: "הסרקומר ברפיון ובהתכווצות. הסיבים הדקים (אקטין, אדום) מחליקים לאורך הסיבים העבים (מיוזין, כחול) לכיוון המרכז: פס A קבוע, פס I ואזור H מתקצרים. סכמטי." },
  "cicr-cardiac": { el: CicrCardiac, captionHe: "צימוד עירור-התכווצות בשריר הלב: Ca²⁺ שנכנס דרך תעלות L בצינורית T מפעיל את RyR2 ומשחרר Ca²⁺ מה-SR (CICR). ההרפיה: SERCA2 (מווסתת ע\"י פוספולמבן) ו-NCX. גירוי β1 דרך PKA מגביר את שני הצדדים. סכמטי." },
  "smooth-muscle-mlck": { el: SmoothMuscleMlck, captionHe: "בקרת ההתכווצות בשריר חלק — על המיוזין, לא על האקטין: Ca²⁺-קלמודולין מפעיל את MLCK שמזרחן את המיוזין; MLCP מסיר את הזרחן. היחס ביניהם קובע את הכוח, ו-Rho kinase ו-NO/cGMP משנים אותו. סכמטי." },
  "epo-feedback": { el: EpoFeedback, captionHe: "משוב שלילי של אריתרופויאטין: ירידה באספקת החמצן לכליה מגבירה EPO; מח העצם מייצר יותר תאים אדומים; כשהחמצן חוזר — EPO יורד. סכמטי." },
  "coagulation-cascade": { el: CoagulationCascade, captionHe: "מפל הקרישה כפי שהוא פועל בגוף: פקטור רקמה–VIIa מתחיל, Xa–Va יוצר תרומבין, ותרומבין הופך פיברינוגן לפיברין ומגביר את המפל. בצד ימין — המערכות שמגבילות ומפרקות את הקריש. סכמטי." },
  "glomerular-starling": { el: GlomerularStarling, captionHe: "כוחות סטרלינג בפקעית (ערכים טיפוסיים). הלחץ בנימים דוחף נוזל החוצה; הלחץ בכופסית באומן והלחץ האוסמוטי של חלבוני הפלזמה מתנגדים. הלחץ האוסמוטי עולה לאורך הנים, ולכן הכוח הנטו יורד לאורכו. סכמטי." },
  "nephron-segments": { el: NephronSegments, captionHe: "מקטעי הנפרון, הנשאים העיקריים ואחוז ספיגת ה-Na⁺ שסונן בכל מקטע (בקירוב). רוב הספיגה במקורבת; הכוונון הסופי, בהשפעת אלדוסטרון ו-ADH, בצינורית המאספת. סכמטי." },
  "diuretic-sites": { el: DiureticSites, captionHe: "אתרי הפעולה של המשתנים העיקריים לאורך הנפרון. משתני לולאה הם החזקים ביותר; אמילוריד וספירונולקטון חוסכי אשלגן. סכמטי." },
  "countercurrent": { el: Countercurrent, captionHe: "מכפל הזרם הנגדי בלולאת הנלה (ערכי אוסמולריות טיפוסיים, mOsm/kg). החלק היורד מאבד מים, החלק העולה מאבד מלח — והנוזל הבין-תאי בליבה מתרכז עד ~1200. בצינורית המאספת, ADH מאפשר למים לצאת והשתן מתרכז. סכמטי." },
  "raas": { el: Raas, captionHe: "מערכת הרנין-אנגיוטנסין-אלדוסטרון: מה מגביר רנין, המפל לאנגיוטנסין II, ופעולותיו שמעלות את לחץ הדם ואת הנפח — ומפחיתות בחזרה את הפרשת הרנין. ANP פועל בכיוון ההפוך. סכמטי." },
};
