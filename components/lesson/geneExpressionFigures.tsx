/* Figures for the gene-expression units (Technion 134119). All schematic, not to scale.
   Colors: DNA gray/blue, RNA purple, repressors red, activators green, signals orange.
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
// Box with a Latin label centered at (x, y + h/2).
const LBox = ({ x, y, w, h = 26, label, c = BLUE, fill = FILL.blue, size = 12, bold = false }: { x: number; y: number; w: number; h?: number; label: React.ReactNode; c?: string; fill?: string; size?: number; bold?: boolean }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={6} fill={fill} stroke={c} strokeWidth={1.5} />
    <La x={x} y={y + h / 2 + size * 0.36} size={size} bold={bold}>{label}</La>
  </g>
);
const HBox = ({ x, y, w, h = 26, label, c = BLUE, fill = FILL.blue, size = 12, bold = false }: { x: number; y: number; w: number; h?: number; label: React.ReactNode; c?: string; fill?: string; size?: number; bold?: boolean }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={6} fill={fill} stroke={c} strokeWidth={1.5} />
    <He x={x} y={y + h / 2 + size * 0.36} size={size} bold={bold}>{label}</He>
  </g>
);
// DNA drawn as a double line.
const Dna = ({ x0, x1, y, c = MUTED }: { x0: number; x1: number; y: number; c?: string }) => (
  <g>
    <line x1={x0} x2={x1} y1={y - 2.5} y2={y - 2.5} stroke={c} strokeWidth={1.6} />
    <line x1={x0} x2={x1} y1={y + 2.5} y2={y + 2.5} stroke={c} strokeWidth={1.6} />
  </g>
);
// Gene/element block sitting on a DNA line (centered vertically on y).
const Seg = ({ x0, x1, y, label, c = BLUE, fill = FILL.blue, size = 11.5, h = 18 }: { x0: number; x1: number; y: number; label?: React.ReactNode; c?: string; fill?: string; size?: number; h?: number }) => (
  <g>
    <rect x={x0} y={y - h / 2} width={x1 - x0} height={h} rx={3} fill={fill} stroke={c} strokeWidth={1.3} />
    {label != null && <La x={(x0 + x1) / 2} y={y + size * 0.36} size={size} bold color={c === MUTED ? MUTED : INK}>{label}</La>}
  </g>
);
const Blob = ({ x, y, rx = 13, ry = 9, c = RED, fill = FILL.red, t, size = 10 }: { x: number; y: number; rx?: number; ry?: number; c?: string; fill?: string; t?: string; size?: number }) => (
  <g>
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={fill} stroke={c} strokeWidth={1.4} />
    {t && <La x={x} y={y + size * 0.36} size={size} bold color={c}>{t}</La>}
  </g>
);
const Num = ({ x, y, n }: { x: number; y: number; n: number }) => (
  <g><circle cx={x} cy={y} r={9} fill={INK} /><La x={x} y={y + 4} size={11} bold color="#ffffff">{n}</La></g>
);
const Cross = ({ x, y, c = RED }: { x: number; y: number; c?: string }) => (
  <g><Line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} c={c} w={2.4} /><Line x1={x - 6} y1={y + 6} x2={x + 6} y2={y - 6} c={c} w={2.4} /></g>
);

// ── gx-operons ───────────────────────────────────────────────────────────────
function LacMerodiploid() {
  const row = (y: number, lab: string, iOk: boolean, oc: boolean, zOn: boolean, repOn: boolean) => (
    <g>
      <He x={474} y={y + 4} size={11} anchor="end" color={MUTED}>{lab}</He>
      <Dna x0={30} x1={400} y={y} />
      <Seg x0={40} x1={110} y={y} label={iOk ? "I⁺" : "I⁻"} c={iOk ? PURPLE : MUTED} fill={iOk ? FILL.purple : FILL.gray} />
      <Seg x0={150} x1={190} y={y} label={oc ? "Oᶜ" : "O⁺"} c={oc ? ORANGE : INK} fill={oc ? FILL.orange : "#ffffff"} />
      <Seg x0={200} x1={370} y={y} label="lacZ" c={zOn ? GREEN : MUTED} fill={zOn ? FILL.green : FILL.gray} />
      {repOn && <Blob x={170} y={y - 17} rx={16} ry={8} t="R" c={RED} />}
      {!iOk && <Cross x={75} y={y - 17} />}
      <He x={286} y={y + 26} size={11} bold color={zOn ? GREEN : MUTED}>{zOn ? "מתבטא" : "כבוי"}</He>
    </g>
  );
  return (
    <Svg h={330} label="דיפלואידים חלקיים, בלי משרן. למעלה: lacI⁻ בכרומוזום ו-lacI⁺ ב-F′ — המדכא מה-F′ מתפזר וקושר את שני האופרטורים, ושני ה-lacZ כבויים: lacI⁻ רצסיבית ופועלת ב-trans. למטה: lacOᶜ בכרומוזום — המדכא לא נקשר אליו, ולכן רק ה-lacZ שלידו מתבטא; ה-lacZ שליד האופרטור התקין כבוי: Oᶜ פועל ב-cis">
      <He x={240} y={18} size={12.5} bold>lacI⁻ / F′ lacI⁺ — המדכא פועל ב-trans</He>
      {row(58, "כרומוזום", false, false, false, true)}
      {row(122, "F′", true, false, false, true)}
      <path d="M75 113 C 100 90, 140 90, 160 72" fill="none" stroke={RED} strokeWidth={1.5} markerEnd="url(#bfArrowS)" {...dash} />
      <path d="M75 113 C 110 108, 140 108, 160 106" fill="none" stroke={RED} strokeWidth={1.5} markerEnd="url(#bfArrowS)" {...dash} />
      <line x1={20} x2={460} y1={172} y2={172} stroke={LINE} strokeWidth={1} />
      <He x={240} y={196} size={12.5} bold>lacOᶜ / F′ lacO⁺ — האופרטור פועל רק ב-cis</He>
      {row(236, "כרומוזום", true, true, true, false)}
      {row(300, "F′", true, false, false, true)}
    </Svg>
  );
}

function LacStates() {
  const rows: [string, boolean, boolean, number, string][] = [
    ["בלי לקטוז", true, false, 0, "כבוי"],
    ["לקטוז + גלוקוז", false, false, 1.4, "חלש"],
    ["לקטוז, בלי גלוקוז", false, true, 4, "חזק"],
  ];
  return (
    <Svg h={290} label="שלושה מצבים של אופרון lac: בלי לקטוז המדכא קשור לאופרטור והאופרון כבוי; עם לקטוז וגלוקוז המדכא משתחרר אבל CAP-cAMP לא קשור והשעתוק חלש; עם לקטוז ובלי גלוקוז המדכא משתחרר ו-CAP-cAMP מגייס את RNA פולימראז — שעתוק חזק">
      <La x={92} y={20} size={11} color={MUTED}>CAP</La>
      <La x={150} y={20} size={11} color={MUTED}>P</La>
      <La x={196} y={20} size={11} color={MUTED}>O</La>
      <La x={290} y={20} size={11} color={MUTED}>lacZ lacY lacA</La>
      {rows.map(([lab, rep, cap, out, word], i) => {
        const y = 60 + i * 82;
        return (
          <g key={lab}>
            <He x={474} y={y - 26} size={12} bold anchor="end">{lab}</He>
            <Dna x0={60} x1={380} y={y} />
            <Seg x0={78} x1={106} y={y} c={MUTED} fill={FILL.gray} />
            <Seg x0={126} x1={176} y={y} c={INK} fill="#ffffff" />
            <Seg x0={180} x1={212} y={y} c={INK} fill="#ffffff" />
            <Seg x0={220} x1={372} y={y} c={out ? GREEN : MUTED} fill={out ? FILL.green : FILL.gray} />
            {rep && <Blob x={196} y={y - 18} rx={18} ry={9} t="R" />}
            {!rep && <Blob x={232} y={y - 30} rx={14} ry={8} t="R" c={MUTED} fill={FILL.gray} />}
            {!rep && <circle cx={248} cy={y - 34} r={4} fill={ORANGE} />}
            {cap && <Blob x={92} y={y - 18} rx={16} ry={9} t="CAP" c={GREEN} fill={FILL.green} size={9} />}
            {cap && <circle cx={108} cy={y - 26} r={4} fill={BLUE} />}
            {!rep && <Blob x={150} y={y - 18} rx={20} ry={10} t="Pol" c={BLUE} fill={FILL.blue} size={10} />}
            {out > 0 && <Line x1={225} y1={y + 18} x2={225 + out * 34} y2={y + 18} c={PURPLE} w={out} />}
            <He x={430} y={y + 5} size={12} bold color={out ? GREEN : MUTED}>{word}</He>
          </g>
        );
      })}
      <circle cx={30} cy={276} r={4} fill={ORANGE} /><He x={40} y={280} size={11} anchor="start">משרן</He>
      <circle cx={110} cy={276} r={4} fill={BLUE} /><La x={120} y={280} size={11} anchor="start">cAMP</La>
      <Line x1={180} y1={276} x2={210} y2={276} c={PURPLE} w={3} /><He x={218} y={280} size={11} anchor="start">mRNA</He>
    </Svg>
  );
}

function TrpAttenuation() {
  const lead = (y: number, high: boolean) => {
    const x = [70, 140, 210, 280];
    return (
      <g>
        <Line x1={30} y1={y} x2={430} y2={y} c={PURPLE} w={2.4} />
        {x.map((xx, i) => <rect key={i} x={xx} y={y - 7} width={44} height={14} rx={3} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />)}
        {x.map((xx, i) => <La key={`l${i}`} x={xx + 22} y={y + 4} size={10.5} bold>{i + 1}</La>)}
        <La x={380} y={y - 8} size={11} color={MUTED}>trpE…</La>
        {/* ribosome */}
        <ellipse cx={high ? 150 : 92} cy={y - 18} rx={30} ry={14} fill={FILL.blue} stroke={BLUE} strokeWidth={1.5} />
        {!high && <He x={92} y={y - 40} size={10.5} color={RED} bold>נתקע על קודוני Trp</He>}
        {high && <He x={150} y={y - 40} size={10.5} color={BLUE}>מכסה את אזור 2</He>}
        {/* hairpin */}
        {high ? (
          <g>
            <path d={`M232 ${y + 8} q34 50 68 0`} fill="none" stroke={RED} strokeWidth={2.4} />
            <He x={266} y={y + 64} size={11.5} bold color={RED}>3:4 — טרמינטור</He>
            <He x={266} y={y + 80} size={11} color={MUTED}>השעתוק נעצר</He>
          </g>
        ) : (
          <g>
            <path d={`M162 ${y + 8} q34 50 68 0`} fill="none" stroke={GREEN} strokeWidth={2.4} />
            <He x={196} y={y + 64} size={11.5} bold color={GREEN}>2:3 — אנטי-טרמינטור</He>
            <He x={196} y={y + 80} size={11} color={MUTED}>השעתוק ממשיך</He>
          </g>
        )}
      </g>
    );
  };
  return (
    <Svg h={320} label="אטנואציה באופרון trp: ב-RNA המוביל ארבעה אזורים. כשיש הרבה טריפטופן הריבוזום עובר מהר ומכסה את אזור 2, נוצר זיווג 3:4 — טרמינטור, והשעתוק נעצר. כשחסר טריפטופן הריבוזום נתקע על קודוני הטריפטופן באזור 1, נוצר זיווג 2:3 — אנטי-טרמינטור, והשעתוק ממשיך לגנים המבניים">
      <He x={474} y={22} size={12.5} bold anchor="end">הרבה טריפטופן</He>
      {lead(68, true)}
      <line x1={20} x2={460} y1={164} y2={164} stroke={LINE} strokeWidth={1} />
      <He x={474} y={184} size={12.5} bold anchor="end">מחסור בטריפטופן</He>
      {lead(228, false)}
    </Svg>
  );
}

// ── gx-transcription-factors ─────────────────────────────────────────────────
function DnaBindingMotifs() {
  const cell = (cx: number, cy: number, title: string, sub: string, body: React.ReactNode) => (
    <g>
      <Dna x0={cx - 90} x1={cx + 90} y={cy + 44} />
      <path d={`M${cx - 26} ${cy + 41} q26 -10 52 0`} fill="none" stroke={MUTED} strokeWidth={1} {...dash} />
      {body}
      <He x={cx} y={cy + 72} size={12} bold>{title}</He>
      <He x={cx} y={cy + 88} size={10.5} color={MUTED}>{sub}</He>
    </g>
  );
  const helix = (x: number, y: number, w: number, h: number, c: string, rot = 0) => (
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={c === RED ? FILL.red : FILL.blue} stroke={c} strokeWidth={1.4} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined} />
  );
  return (
    <Svg h={290} label="ארבעה מוטיבים לקישור DNA: סליל-סיבוב-סליל — סליל הזיהוי (אדום) בחריץ הגדול; אצבע אבץ — לולאה שמיוצבת ביון אבץ; רוכסן לאוצין — שני סלילים ארוכים שנצמדים לדימר ואוחזים ב-DNA כמו מלקחיים; סליל-לולאה-סליל — דימר עם לולאה בין הסלילים">
      {cell(120, 20, "סליל-סיבוב-סליל", "סליל הזיהוי בחריץ הגדול", (
        <g>{helix(98, 30, 46, 14, BLUE, -30)}{helix(130, 52, 46, 14, RED)}<path d="M116 22 q10 6 2 22" fill="none" stroke={INK} strokeWidth={1.4} /></g>
      ))}
      {cell(360, 20, "אצבע אבץ", "Zn²⁺ מייצב לולאה", (
        <g>
          <path d="M330 56 C 320 10, 360 0, 372 20 C 384 40, 392 50, 390 56" fill="none" stroke={BLUE} strokeWidth={3} />
          {helix(372, 48, 40, 12, RED, 10)}
          <circle cx={350} cy={30} r={8} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.4} /><La x={350} y={33.5} size={9} bold color={ORANGE}>Zn</La>
        </g>
      ))}
      {cell(120, 160, "רוכסן לאוצין (bZIP)", "דימר — Jun/Fos, CREB", (
        <g>
          <path d="M112 146 L102 190 M128 146 L138 190" fill="none" stroke={BLUE} strokeWidth={8} strokeLinecap="round" />
          <path d="M112 146 L128 146" stroke={INK} strokeWidth={1} />
          {[150, 158, 166].map((y) => <line key={y} x1={113} x2={127} y1={y} y2={y} stroke={ORANGE} strokeWidth={2} />)}
          <path d="M102 190 L86 200 M138 190 L154 200" fill="none" stroke={RED} strokeWidth={8} strokeLinecap="round" />
        </g>
      ))}
      {cell(360, 160, "סליל-לולאה-סליל (bHLH)", "דימר — MyoD, Myc", (
        <g>
          {helix(340, 172, 14, 34, BLUE)}{helix(380, 172, 14, 34, BLUE)}
          <path d="M340 154 q-14 -16 0 -22 M380 154 q14 -16 0 -22" fill="none" stroke={INK} strokeWidth={1.6} />
          {helix(340, 128, 14, 26, BLUE)}{helix(380, 128, 14, 26, BLUE)}
          <path d="M340 190 L330 200 M380 190 L390 200" fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" />
        </g>
      ))}
    </Svg>
  );
}

function GalSwitch() {
  const panel = (x0: number, on: boolean) => {
    const cx = x0 + 110;
    return (
      <g>
        <He x={cx} y={22} size={12.5} bold>{on ? "יש גלקטוז" : "אין גלקטוז"}</He>
        <Dna x0={x0} x1={x0 + 220} y={190} />
        <Seg x0={x0 + 10} x1={x0 + 60} y={190} label="UASᴳ" c={INK} fill="#ffffff" size={10} />
        <Seg x0={x0 + 130} x1={x0 + 214} y={190} label="GAL1" c={on ? GREEN : MUTED} fill={on ? FILL.green : FILL.gray} size={11} />
        {/* Gal4 dimer with activation domain */}
        <Blob x={x0 + 26} y={170} rx={13} ry={10} c={BLUE} fill={FILL.blue} />
        <Blob x={x0 + 46} y={170} rx={13} ry={10} c={BLUE} fill={FILL.blue} />
        <Line x1={x0 + 36} y1={160} x2={x0 + 36} y2={130} c={BLUE} w={3} />
        <La x={x0 + 18} y={150} size={10.5} bold color={BLUE}>Gal4</La>
        {on ? (
          <g>
            <circle cx={x0 + 36} cy={124} r={7} fill={GREEN} />
            <Blob x={x0 + 110} y={118} rx={36} ry={16} t="Mediator" c={PURPLE} fill={FILL.purple} size={10} />
            <Blob x={x0 + 160} y={160} rx={26} ry={14} t="Pol II" c={BLUE} fill={FILL.blue} size={10} />
            <Line x1={x0 + 44} y1={124} x2={x0 + 74} y2={120} c={GREEN} w={1.6} />
            <Blob x={x0 + 50} y={70} rx={18} ry={10} t="Gal80" c={RED} />
            <Blob x={x0 + 92} y={70} rx={16} ry={10} t="Gal3" c={ORANGE} fill={FILL.orange} />
            <circle cx={x0 + 112} cy={58} r={5} fill={ORANGE} />
            <He x={x0 + 150} y={52} size={10.5} color={ORANGE} anchor="start">גלקטוז</He>
            <Line x1={x0 + 174} y1={210} x2={x0 + 214} y2={210} c={PURPLE} w={4} />
            <He x={cx} y={240} size={11.5} bold color={GREEN}>אזור ההפעלה חשוף — שעתוק</He>
          </g>
        ) : (
          <g>
            <Blob x={x0 + 36} y={118} rx={20} ry={11} t="Gal80" c={RED} />
            <He x={cx} y={240} size={11.5} bold color={MUTED}>Gal80 מכסה את אזור ההפעלה</He>
          </g>
        )}
      </g>
    );
  };
  return (
    <Svg h={256} label="מתג GAL בשמרים: Gal4 קשור תמיד ל-UASᴳ. בלי גלקטוז, Gal80 מכסה את אזור ההפעלה של Gal4 והגן כבוי. עם גלקטוז, Gal3 קושר גלקטוז ואת Gal80, אזור ההפעלה נחשף, ו-Gal4 מגייס את Mediator ו-RNA פולימראז II">
      {panel(250, false)}
      {panel(10, true)}
      <line x1={240} x2={240} y1={10} y2={250} stroke={LINE} strokeWidth={1} />
    </Svg>
  );
}

// ── gx-chromatin-modifications ───────────────────────────────────────────────
function HistoneMarks() {
  const marks: [number, string, string, string, string][] = [
    [125, "K4me3", GREEN, "פרומוטור פעיל", "קורא: PHD"],
    [215, "K9me3", RED, "הטרוכרומטין", "קורא: HP1"],
    [305, "K27me3", RED, "Polycomb", "קורא: PRC1"],
    [400, "K36me3", GREEN, "גוף גן פעיל", ""],
  ];
  return (
    <Svg h={250} label="סימנים על זנב ההיסטון H3: אצטילציה של ליזינים קשורה לגנים פעילים; H3K4me3 בפרומוטורים פעילים; H3K36me3 בגוף גנים משועתקים; H3K9me3 בהטרוכרומטין; H3K27me3 בהשתקה של Polycomb. לכל סימן יש כותב, קורא ומוחק">
      <ellipse cx={58} cy={92} rx={40} ry={34} fill={FILL.yellow} stroke={ORANGE} strokeWidth={1.6} />
      <He x={58} y={96} size={11.5} bold>נוקלאוזום</He>
      <Line x1={98} y1={92} x2={440} y2={92} c={INK} w={2.4} />
      <La x={454} y={96} size={11} color={MUTED}>N</La>
      <La x={440} y={78} size={11} color={MUTED}>H3</La>
      {marks.map(([x, t, c, a, b]) => (
        <g key={t}>
          <Line x1={x} y1={92} x2={x} y2={116} c={c} w={1.6} />
          <circle cx={x} cy={124} r={9} fill={c === GREEN ? FILL.green : FILL.red} stroke={c} strokeWidth={1.5} />
          <La x={x} y={127} size={9} bold color={c}>me</La>
          <La x={x} y={150} size={12} bold color={c}>{t}</La>
          <He x={x} y={168} size={10.5}>{a}</He>
          {b && <He x={x} y={184} size={10} color={MUTED}>{b}</He>}
        </g>
      ))}
      {[170, 260, 350].map((x) => (
        <g key={x}><Line x1={x} y1={92} x2={x} y2={70} c={BLUE} w={1.4} /><circle cx={x} cy={64} r={7} fill={FILL.blue} stroke={BLUE} strokeWidth={1.3} /><La x={x} y={67} size={8.5} bold color={BLUE}>ac</La></g>
      ))}
      <He x={260} y={44} size={10.5} color={BLUE}>אצטילציה — כרומטין פתוח</He>
      <line x1={20} x2={460} y1={200} y2={200} stroke={LINE} strokeWidth={1} />
      <He x={400} y={224} size={11.5} bold>כותבים</He><He x={400} y={240} size={10.5} color={MUTED}>HATs, מתילטרנספראזות</He>
      <He x={250} y={224} size={11.5} bold>קוראים</He><He x={250} y={240} size={10.5} color={MUTED}>ברומודומיין, כרומודומיין</He>
      <He x={100} y={224} size={11.5} bold>מוחקים</He><He x={100} y={240} size={10.5} color={MUTED}>HDACs, דה-מתילאזות</He>
    </Svg>
  );
}

function DnaMethylationMaintenance() {
  const duplex = (x: number, y: number, top: boolean, bot: boolean, newBot = false) => (
    <g>
      <Line x1={x - 50} y1={y} x2={x + 50} y2={y} c={INK} w={2.4} />
      <Line x1={x - 50} y1={y + 22} x2={x + 50} y2={y + 22} c={newBot ? ORANGE : INK} w={2.4} />
      <La x={x - 8} y={y - 6} size={10.5} bold>CG</La>
      <La x={x - 8} y={y + 38} size={10.5} bold>GC</La>
      {top && <circle cx={x - 30} cy={y - 10} r={5} fill={RED} />}
      {bot && <circle cx={x - 30} cy={y + 34} r={5} fill={RED} />}
    </g>
  );
  return (
    <Svg h={280} label="מתילציית שימור: אתר CpG ממותל בשני הגדילים; אחרי שכפול כל מולקולת בת חצי-ממותלת — גדיל ישן ממותל וגדיל חדש לא ממותל; DNMT1 עם UHRF1 מזהה את האתר החצי-ממותל וממתל את הגדיל החדש, וכך הדפוס עובר בחלוקה">
      <He x={240} y={20} size={12} bold>ממותל בשני הגדילים</He>
      {duplex(240, 44, true, true)}
      <Arrow x1={210} y1={102} x2={140} y2={128} />
      <Arrow x1={270} y1={102} x2={340} y2={128} />
      <He x={240} y={124} size={11} color={MUTED}>שכפול</He>
      {duplex(110, 150, true, false, true)}
      {duplex(370, 150, true, false, true)}
      <He x={240} y={172} size={11.5} bold color={ORANGE}>חצי-ממותל</He>
      <Arrow x1={110} y1={208} x2={110} y2={226} color={RED} />
      <Arrow x1={370} y1={208} x2={370} y2={226} color={RED} />
      <La x={170} y={222} size={11} bold color={RED}>DNMT1 + UHRF1</La>
      <He x={240} y={252} size={11.5} bold>שוב ממותל בשני הגדילים — בשתי מולקולות הבת</He>
      <circle cx={30} cy={272} r={5} fill={RED} /><He x={40} y={276} size={10.5} anchor="start">5-מתילציטוזין</He>
      <Line x1={150} y1={272} x2={180} y2={272} c={ORANGE} w={2.4} /><He x={188} y={276} size={10.5} anchor="start">גדיל חדש</He>
    </Svg>
  );
}

// ── gx-epigenetics ───────────────────────────────────────────────────────────
function HeterochromatinSpreading() {
  const nuc = (x: number, y: number, marked: boolean) => (
    <g key={`${x}${y}`}>
      <circle cx={x} cy={y} r={13} fill={marked ? FILL.red : FILL.yellow} stroke={marked ? RED : ORANGE} strokeWidth={1.4} />
      {marked && <circle cx={x} cy={y - 18} r={5} fill={RED} />}
    </g>
  );
  const row = (y: number, boundary: boolean) => {
    const xs = [40, 80, 120, 160, 200, 240, 280, 320];
    const reach = boundary ? 200 : 320;
    return (
      <g>
        <Dna x0={20} x1={440} y={y} c={LINE} />
        <rect x={20} y={y - 16} width={56} height={32} rx={6} fill="none" stroke={RED} strokeWidth={1.4} {...dash} />
        {xs.map((x) => nuc(x, y, x <= reach))}
        {boundary && <Seg x0={214} x1={226} y={y} c={INK} fill={INK} h={30} />}
        <Seg x0={340} x1={430} y={y} label="white" c={boundary ? GREEN : MUTED} fill={boundary ? FILL.green : FILL.gray} />
        <Arrow x1={60} y1={y + 30} x2={(boundary ? 200 : 320)} y2={y + 30} color={RED} width={2.4} />
        <He x={385} y={y + 34} size={11.5} bold color={boundary ? GREEN : RED}>{boundary ? "פעיל" : "מושתק"}</He>
      </g>
    );
  };
  return (
    <Svg h={250} label="התפשטות הטרוכרומטין מאתר הנבטה: אנזים H3K9 יחד עם HP1 מעבירים את הסימן מנוקלאוזום לנוקלאוזום. למעלה, גבול (מבודד מסוג מחסום) עוצר את ההתפשטות והגן פעיל; למטה, בלי גבול — ההטרוכרומטין מגיע לגן ומשתיק אותו, כמו באפקט המיקום המגוון">
      <He x={240} y={22} size={12} bold>עם גבול</He>
      {row(70, true)}
      <He x={240} y={140} size={12} bold>בלי גבול (PEV)</He>
      {row(188, false)}
      <He x={48} y={240} size={10.5} color={RED}>אתר נבטה</He>
      <circle cx={130} cy={236} r={5} fill={RED} /><La x={140} y={240} size={10.5} anchor="start">H3K9me3 + HP1</La>
    </Svg>
  );
}

function XInactivationSteps() {
  const chrom = (x: number, y: number, c: string, fill: string, h = 90) => <rect x={x - 9} y={y} width={18} height={h} rx={9} fill={fill} stroke={c} strokeWidth={1.5} />;
  const steps: [string, string][] = [["ספירה ובחירה", "X אחד נבחר"], ["Xist מצפה", "רק את ה-X שלו (cis)"], ["השתקה", "PRC2 — H3K27me3"], ["שימור", "גופיף בר, מתילציה"]];
  return (
    <Svg h={230} label="ארבעה שלבים בהשבתת X: ספירה ובחירה של X אחד; Xist משועתק מה-X הנבחר ומצפה אותו בלבד; Xist מגייס את PRC2 ונוצר H3K27me3, והשעתוק נעצר; ה-X המושבת נדחס לגופיף בר, איי CpG ממותלים, וההשתקה עוברת בכל החלוקות">
      {steps.map(([a, b], i) => {
        const cx = 60 + i * 120;
        return (
          <g key={a}>
            <Num x={cx} y={20} n={i + 1} />
            {chrom(cx - 18, 46, BLUE, FILL.blue)}
            {i === 0 && chrom(cx + 18, 46, BLUE, FILL.blue)}
            {i === 0 && <Arrow x1={cx + 18} y1={150} x2={cx + 18} y2={140} color={PURPLE} />}
            {i === 1 && (<g>{chrom(cx + 18, 46, PURPLE, FILL.purple)}{[56, 70, 84, 98, 112, 126].map((y) => <path key={y} d={`M${cx + 6} ${y} q12 -6 24 0`} fill="none" stroke={PURPLE} strokeWidth={1.6} />)}</g>)}
            {i === 2 && (<g>{chrom(cx + 18, 46, RED, FILL.red)}{[60, 80, 100, 120].map((y) => <circle key={y} cx={cx + 32} cy={y} r={3.5} fill={RED} />)}</g>)}
            {i === 3 && <ellipse cx={cx + 18} cy={92} rx={14} ry={22} fill={INK} />}
            <He x={cx} y={168} size={12} bold>{a}</He>
            <He x={cx} y={186} size={10.5} color={MUTED}>{b}</He>
          </g>
        );
      })}
      <He x={240} y={216} size={11} color={MUTED}>כחול — X פעיל · סגול — מצופה Xist · אדום — H3K27me3 · שחור — גופיף בר</He>
    </Svg>
  );
}

// ── gx-alternative-splicing ──────────────────────────────────────────────────
function AltSplicingTypes() {
  const ex = (x0: number, x1: number, y: number, c = BLUE, fill = FILL.blue) => <rect x={x0} y={y - 8} width={x1 - x0} height={16} rx={2} fill={fill} stroke={c} strokeWidth={1.3} />;
  const arc = (x0: number, x1: number, y: number, up: boolean, c: string) => (
    <path d={`M${x0} ${y + (up ? -8 : 8)} Q${(x0 + x1) / 2} ${y + (up ? -30 : 30)} ${x1} ${y + (up ? -8 : 8)}`} fill="none" stroke={c} strokeWidth={1.6} />
  );
  const rows: [string, (y: number) => React.ReactNode][] = [
    ["דילוג על אקסון", (y) => (<g>{ex(150, 190, y)}{ex(240, 280, y, ORANGE, FILL.orange)}{ex(330, 370, y)}{arc(190, 240, y, true, GREEN)}{arc(280, 330, y, true, GREEN)}{arc(190, 330, y, false, RED)}</g>)],
    ["אקסונים שמוציאים זה את זה", (y) => (<g>{ex(130, 170, y)}{ex(210, 245, y, ORANGE, FILL.orange)}{ex(280, 315, y, PURPLE, FILL.purple)}{ex(355, 395, y)}{arc(170, 210, y, true, GREEN)}{arc(245, 355, y, true, GREEN)}{arc(170, 280, y, false, RED)}{arc(315, 355, y, false, RED)}</g>)],
    ["אתר 5′ חלופי", (y) => (<g>{ex(160, 210, y)}{ex(210, 240, y, ORANGE, FILL.orange)}{ex(330, 370, y)}{arc(240, 330, y, true, GREEN)}{arc(210, 330, y, false, RED)}</g>)],
    ["שימור אינטרון", (y) => (<g>{ex(160, 210, y)}<rect x={210} y={y - 4} width={120} height={8} fill={FILL.orange} stroke={ORANGE} strokeWidth={1} />{ex(330, 370, y)}{arc(210, 330, y, true, GREEN)}</g>)],
  ];
  return (
    <Svg h={290} label="ארבעה סוגים של שחבור חלופי. דילוג על אקסון: האקסון האמצעי נכלל או מושמט. אקסונים שמוציאים זה את זה: נבחר תמיד אחד מהשניים. אתר 5′ חלופי: האקסון מתארך או מתקצר. שימור אינטרון: האינטרון נשאר ב-mRNA. ירוק ואדום — שתי דרכי השחבור">
      {rows.map(([t, draw], i) => {
        const y = 42 + i * 66;
        return (
          <g key={t}>
            <He x={474} y={y + 4} size={10.5} bold anchor="end">{t}</He>
            <g transform="translate(-75 0)"><Line x1={110} y1={y} x2={400} y2={y} c={LINE} w={1.4} />{draw(y)}</g>
          </g>
        );
      })}
      <Line x1={30} y1={280} x2={56} y2={280} c={GREEN} w={1.6} /><He x={62} y={284} size={10.5} anchor="start">דרך אחת</He>
      <Line x1={140} y1={280} x2={166} y2={280} c={RED} w={1.6} /><He x={172} y={284} size={10.5} anchor="start">דרך שנייה</He>
    </Svg>
  );
}

function SexDeterminationSplicing() {
  const col = (x: number, female: boolean) => (
    <g>
      <He x={x} y={22} size={13} bold color={female ? PURPLE : BLUE}>{female ? "נקבה (XX)" : "זכר (XY)"}</He>
      <LBox x={x} y={40} w={150} label={female ? "Sxl — protein" : "Sxl — stop, no protein"} c={female ? PURPLE : MUTED} fill={female ? FILL.purple : FILL.gray} size={11} />
      <Arrow x1={x} y1={68} x2={x} y2={96} color={female ? PURPLE : MUTED} />
      <He x={x + 10} y={86} size={10.5} anchor="start" color={MUTED}>{female ? "חוסם את U2AF" : ""}</He>
      <LBox x={x} y={100} w={150} label={female ? "tra — Tra protein" : "tra — stop"} c={female ? PURPLE : MUTED} fill={female ? FILL.purple : FILL.gray} size={11} />
      <Arrow x1={x} y1={128} x2={x} y2={156} color={female ? PURPLE : MUTED} />
      <He x={x + 10} y={146} size={10.5} anchor="start" color={MUTED}>{female ? "Tra + Tra2 על משפר" : "אין Tra"}</He>
      <LBox x={x} y={160} w={150} label={female ? "dsx — female exon" : "dsx — exon skipped"} c={female ? PURPLE : BLUE} fill={female ? FILL.purple : FILL.blue} size={11} />
      <Arrow x1={x} y1={188} x2={x} y2={214} color={female ? PURPLE : BLUE} />
      <LBox x={x} y={218} w={110} label={female ? "Dsx-F" : "Dsx-M"} c={female ? PURPLE : BLUE} fill={female ? FILL.purple : FILL.blue} size={13} bold />
      <He x={x} y={266} size={11.5} color={MUTED}>{female ? "תוכנית נקבית" : "תוכנית זכרית"}</He>
    </g>
  );
  return (
    <Svg h={280} label="מפל השחבור בקביעת המין בזבוב: בנקבה Sxl פעיל, חוסם את U2AF ב-tra ונוצר Tra; Tra ו-Tra2 מפעילים את האקסון הנקבי ב-dsx ונוצר Dsx-F. בזכר אין Sxl פעיל, ה-mRNA של tra מכיל קודון עצירה, האקסון הנקבי ב-dsx מושמט ונוצר Dsx-M">
      {col(360, true)}
      {col(120, false)}
      <line x1={240} x2={240} y1={10} y2={270} stroke={LINE} strokeWidth={1} />
    </Svg>
  );
}

// ── gx-translation-control ───────────────────────────────────────────────────
function IronRegulation() {
  const mrna = (y: number, x0: number, ire5: boolean, irp: boolean, out: string, good: boolean) => (
    <g>
      <circle cx={x0} cy={y} r={5} fill={INK} />
      <Line x1={x0 + 5} y1={y} x2={x0 + 190} y2={y} c={PURPLE} w={2.4} />
      <rect x={x0 + 50} y={y - 7} width={90} height={14} rx={3} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />
      {ire5 ? <path d={`M${x0 + 20} ${y} l0 -16 a6 6 0 1 1 10 0 l0 16`} fill="none" stroke={ORANGE} strokeWidth={2} />
        : [150, 162, 174].map((dx) => <path key={dx} d={`M${x0 + dx} ${y} l0 -14 a5 5 0 1 1 8 0 l0 14`} fill="none" stroke={ORANGE} strokeWidth={1.8} />)}
      {irp && (ire5 ? <Blob x={x0 + 25} y={y - 30} rx={14} ry={9} t="IRP" c={RED} size={9} /> : <Blob x={x0 + 166} y={y - 30} rx={14} ry={9} t="IRP" c={RED} size={9} />)}
      <He x={x0 + 95} y={y + 26} size={11} bold color={good ? GREEN : RED}>{out}</He>
    </g>
  );
  return (
    <Svg h={290} label="בקרת הברזל: ב-mRNA של פריטין IRE בקצה ה-5′, וב-mRNA של קולטן הטרנספרין כמה IREs בקצה ה-3′. כשחסר ברזל IRP נקשר ל-IREs: בפריטין הוא חוסם את התרגום, ובקולטן הוא מגן על ה-mRNA מפירוק — פחות אגירה, יותר קליטה. כשיש ברזל IRP משתחרר: פריטין מתורגם וה-mRNA של הקולטן מפורק">
      <He x={360} y={22} size={12.5} bold>מחסור בברזל</He>
      <He x={120} y={22} size={12.5} bold>עודף ברזל</He>
      <He x={474} y={62} size={11} anchor="end" color={MUTED}>פריטין</He>
      <He x={474} y={150} size={11} anchor="end" color={MUTED}>קולטן הטרנספרין</He>
      {mrna(90, 258, true, true, "תרגום חסום", false)}
      {mrna(90, 20, true, false, "מתורגם — אגירה", true)}
      {mrna(212, 258, false, true, "יציב — יותר קליטה", true)}
      {mrna(212, 20, false, false, "מפורק", false)}
      <line x1={240} x2={240} y1={34} y2={250} stroke={LINE} strokeWidth={1} />
      <He x={240} y={276} size={11} color={MUTED}>כתום — IRE (גבעול-לולאה) · אותו חלבון, תוצאה הפוכה לפי מיקום ה-IRE</He>
    </Svg>
  );
}

function MrnaDecay() {
  const m = (x: number, y: number, tail: number, cap = true) => (
    <g>
      {cap && <circle cx={x} cy={y} r={5} fill={INK} />}
      <Line x1={x + 5} y1={y} x2={x + 130} y2={y} c={PURPLE} w={2.4} />
      <rect x={x + 30} y={y - 7} width={70} height={14} rx={3} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />
      {tail > 0 && <La x={x + 132} y={y + 4} size={10.5} anchor="start" bold color={ORANGE}>{"A".repeat(tail)}</La>}
    </g>
  );
  return (
    <Svg h={300} label="פירוק mRNA באאוקריוטים: קודם קיצור זנב הפולי-A בידי CCR4–NOT; אחר כך אחת משתי דרכים — הסרת הכובע בידי Dcp2 ופירוק 5′ ל-3′ בידי Xrn1, או פירוק 3′ ל-5′ בידי האקסוזום">
      {m(150, 30, 8)}
      <Arrow x1={240} y1={46} x2={240} y2={84} />
      <La x={252} y={70} size={11.5} anchor="start" bold color={RED}>CCR4–NOT</La>
      <He x={228} y={70} size={11} anchor="end" color={MUTED}>דה-אדנילציה</He>
      {m(170, 100, 2)}
      <Arrow x1={210} y1={116} x2={120} y2={160} />
      <Arrow x1={290} y1={116} x2={370} y2={160} />
      <He x={100} y={134} size={11} color={MUTED} anchor="end">הסרת כובע</He>
      <La x={106} y={134} size={11} bold color={RED} anchor="start">Dcp2</La>
      {m(40, 180, 2, false)}
      <Arrow x1={30} y1={206} x2={150} y2={206} color={RED} />
      <La x={90} y={226} size={11.5} bold color={RED}>Xrn1 5′→3′</La>
      {m(300, 180, 0)}
      <Arrow x1={440} y1={206} x2={320} y2={206} color={RED} />
      <He x={380} y={226} size={11.5} bold color={RED}>האקסוזום 3′→5′</He>
      <He x={240} y={268} size={11} color={MUTED}>AREs ו-miRNAs מגייסים את הדה-אדנילאזות ומקצרים את חיי ה-mRNA</He>
      <circle cx={30} cy={288} r={5} fill={INK} /><He x={40} y={292} size={10.5} anchor="start">כובע</He>
    </Svg>
  );
}

// ── gx-ncrna ─────────────────────────────────────────────────────────────────
function MirnaPathway() {
  const hp = (x: number, y: number, len: number, c = PURPLE) => (
    <g><path d={`M${x} ${y} l${len} 0 a7 7 0 1 1 0 8 l${-len} 0`} fill="none" stroke={c} strokeWidth={2} /></g>
  );
  return (
    <Svg h={320} label="ייצור miRNA ופעולתו: בגרעין גן ה-miRNA משועתק ל-pri-miRNA שמתקפל לגבעול-לולאה; Drosha חותך ל-pre-miRNA; Exportin-5 מוציא אותו לציטופלזמה; Dicer חותך את הלולאה לדופלקס; גדיל אחד נטען על Argonaute ויוצר RISC, שמזווג עם קצה ה-3′ של mRNA מטרה דרך אזור הזרע ומוביל לעיכוב תרגום ולדה-אדנילציה">
      <rect x={10} y={10} width={460} height={110} rx={16} fill={FILL.gray} stroke={LINE} strokeWidth={1.2} />
      <He x={460} y={30} size={11} anchor="end" color={MUTED}>גרעין</He>
      <Line x1={30} y1={60} x2={130} y2={60} c={PURPLE} w={2} />
      {hp(130, 56, 30)}
      <Line x1={130} y1={64} x2={30} y2={64} c={PURPLE} w={2} />
      <La x={90} y={90} size={11} bold>pri-miRNA</La>
      <Arrow x1={180} y1={60} x2={240} y2={60} />
      <La x={210} y={50} size={11} bold color={RED}>Drosha</La>
      {hp(260, 56, 30)}
      <La x={250} y={90} size={11} bold>pre-miRNA</La>
      <Arrow x1={300} y1={74} x2={300} y2={148} />
      <La x={312} y={112} size={11} anchor="start" bold color={BLUE}>Exportin-5</La>
      {hp(270, 154, 30)}
      <Arrow x1={260} y1={158} x2={200} y2={158} />
      <La x={230} y={148} size={11} bold color={RED}>Dicer</La>
      <Line x1={140} y1={154} x2={190} y2={154} c={PURPLE} w={2} />
      <Line x1={140} y1={162} x2={190} y2={162} c={ORANGE} w={2} />
      <He x={165} y={184} size={10.5} color={MUTED}>דופלקס של כ-22</He>
      <Arrow x1={140} y1={170} x2={110} y2={210} />
      <ellipse cx={100} cy={232} rx={46} ry={20} fill={FILL.green} stroke={GREEN} strokeWidth={1.5} />
      <La x={100} y={236} size={11} bold color={GREEN}>RISC (Ago)</La>
      {/* target */}
      <circle cx={180} cy={282} r={5} fill={INK} />
      <Line x1={185} y1={282} x2={460} y2={282} c={PURPLE} w={2.4} />
      <rect x={210} y={275} width={110} height={14} rx={3} fill={FILL.purple} stroke={PURPLE} strokeWidth={1.2} />
      <La x={265} y={286} size={10} bold>ORF</La>
      <Line x1={360} y1={268} x2={410} y2={268} c={PURPLE} w={2.4} />
      {[365, 372, 379, 386, 393, 400].map((x) => <line key={x} x1={x} x2={x} y1={270} y2={280} stroke={GREEN} strokeWidth={1.2} />)}
      <He x={385} y={306} size={10.5} color={MUTED}>זרע (2–8) בקצה ה-3′</He>
      <Arrow x1={146} y1={240} x2={350} y2={266} color={GREEN} />
      <He x={420} y={232} size={11} bold color={RED}>תרגום ↓</He>
      <He x={420} y={248} size={11} bold color={RED}>דה-אדנילציה ↑</He>
    </Svg>
  );
}

// ── gx-genome-structure ──────────────────────────────────────────────────────
function CotCurve() {
  const s = scale(60, 450, 230, 40, -4, 4, 0, 1);
  const sig = (mid: number, w = 0.45) => (x: number) => 1 / (1 + Math.exp((x - mid) / w));
  const euk = (x: number) => 0.2 * sig(-3)(x) + 0.3 * sig(0)(x) + 0.5 * sig(3)(x);
  const bact = sig(0.6);
  return (
    <Svg h={290} label="עקומות ריאסוציאציה (Cot): השבר שנשאר חד-גדילי כפונקציה של Cot בסקאלה לוגריתמית. ב-DNA של חיידק — שלב אחד (כל הרצפים ייחודיים). ב-DNA אאוקריוטי — שלושה שלבים: רצפים חוזרים מאוד מזדווגים ראשונים (Cot נמוך), חוזרים בינוניים אחריהם, ורצפים ייחודיים אחרונים">
      <line x1={60} y1={230} x2={458} y2={230} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      <line x1={60} y1={234} x2={60} y2={32} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
      {[-4, -2, 0, 2, 4].map((v) => <g key={v}><line x1={s.sx(v)} x2={s.sx(v)} y1={230} y2={235} stroke={INK} /><La x={s.sx(v)} y={250} size={11}>{`10${["⁻⁴", "", "⁻²", "", "⁰", "", "²", "", "⁴"][v + 4]}`}</La></g>)}
      <La x={255} y={272} size={12}>Cot (M·s)</La>
      <He x={24} y={136} size={11.5} rotate={-90}>חלק חד-גדילי</He>
      {[0, 0.5, 1].map((v) => <La key={v} x={52} y={s.sy(v) + 4} size={10.5} anchor="end">{v}</La>)}
      <path d={curve(euk, -4, 4, s)} fill="none" stroke={BLUE} strokeWidth={3} />
      <path d={curve(bact, -4, 4, s)} fill="none" stroke={ORANGE} strokeWidth={2.4} {...dash} />
      <He x={s.sx(-3.2)} y={s.sy(0.78)} size={10.5} color={BLUE}>חוזרים מאוד</He>
      <He x={s.sx(-1.4)} y={s.sy(0.6)} size={10.5} color={BLUE}>חוזרים בינוניים</He>
      <He x={s.sx(3)} y={s.sy(0.42) - 10} size={10.5} color={BLUE}>ייחודיים</He>
      <He x={s.sx(1.6)} y={s.sy(0.12)} size={11} bold color={ORANGE} anchor="start">חיידק</He>
      <He x={s.sx(3.3)} y={s.sy(0.62)} size={11} bold color={BLUE} anchor="start">אאוקריוט</He>
    </Svg>
  );
}

// ── gx-gene-families ─────────────────────────────────────────────────────────
function UnequalCrossover() {
  const gene = (x: number, y: number, t: string, c = BLUE, fill = FILL.blue) => <Seg x0={x} x1={x + 54} y={y} label={t} c={c} fill={fill} />;
  return (
    <Svg h={270} label="שחלוף לא שווה: שני הומולוגים עם שני עותקים דומים, A1 ו-A2, מזדווגים בהיסט — A1 מול A2. שחלוף בנקודה הזו יוצר כרומוזום עם שלושה עותקים וכרומוזום עם עותק אחד, ושניהם נושאים גן היברידי">
      <He x={240} y={20} size={12} bold>הזדווגות בהיסט</He>
      <Dna x0={40} x1={340} y={56} />
      {gene(90, 56, "A1")}{gene(170, 56, "A2")}
      <Dna x0={120} x1={420} y={96} c={ORANGE} />
      {gene(170, 96, "A1", ORANGE, FILL.orange)}{gene(250, 96, "A2", ORANGE, FILL.orange)}
      <path d="M185 64 L210 88 M210 64 L185 88" stroke={RED} strokeWidth={2.4} />
      <Arrow x1={240} y1={116} x2={240} y2={146} />
      <He x={240} y={168} size={12} bold>התוצרים</He>
      <Dna x0={40} x1={420} y={196} />
      {gene(90, 196, "A1")}
      <Seg x0={170} x1={224} y={196} label="A2/A1" c={PURPLE} fill={FILL.purple} />
      {gene(250, 196, "A2", ORANGE, FILL.orange)}
      <He x={474} y={200} size={11} anchor="end" bold>3 עותקים</He>
      <Dna x0={120} x1={340} y={240} />
      <Seg x0={170} x1={224} y={240} label="A1/A2" c={PURPLE} fill={FILL.purple} />
      <He x={474} y={244} size={11} anchor="end" bold>עותק אחד</He>
    </Svg>
  );
}

function GlobinLocus() {
  const genes: [number, string, string][] = [[150, "ε", ORANGE], [205, "Gγ", GREEN], [245, "Aγ", GREEN], [295, "ψβ", MUTED], [340, "δ", BLUE], [390, "β", BLUE]];
  return (
    <Svg h={250} label="צביר β-גלובין בכרומוזום 11: ה-LCR עם אתרי רגישות-יתר במעלה הזרם, ואחריו הגנים לפי סדר ההתבטאות — ε (עוברי מוקדם), Gγ ו-Aγ (עובר), פסאודוגן, δ ו-β (בוגר). ה-LCR יוצר לולאה אל הגן שפעיל בכל שלב">
      <Dna x0={20} x1={440} y={110} />
      {[40, 58, 76, 94, 112].map((x) => <path key={x} d={`M${x} 92 l4 10 l-8 0 z`} fill={RED} />)}
      <Seg x0={30} x1={120} y={110} c={RED} fill={FILL.red} />
      <La x={75} y={114} size={11} bold color={RED}>LCR</La>
      <He x={50} y={80} size={10.5} color={RED}>אתרי רגישות-יתר</He>
      {genes.map(([x, t, c]) => <Seg key={t} x0={x - 16} x1={x + 16} y={110} label={t} c={c} fill={c === MUTED ? FILL.gray : c === ORANGE ? FILL.orange : c === GREEN ? FILL.green : FILL.blue} />)}
      <path d="M90 100 C 120 40, 200 40, 225 100" fill="none" stroke={GREEN} strokeWidth={1.8} {...dash} />
      <He x={160} y={44} size={10.5} color={GREEN}>לולאה לגן הפעיל (בעובר)</He>
      <La x={460} y={114} size={11} color={MUTED}>3′</La><La x={12} y={114} size={11} color={MUTED}>5′</La>
      {[[150, ORANGE, "עובר מוקדם", "ε"], [225, GREEN, "עובר", "γ → HbF"], [365, BLUE, "אחרי הלידה", "β (ו-δ) → HbA"]].map(([x, c, a, b]) => (
        <g key={a as string}>
          <rect x={(x as number) - 50} y={150} width={100} height={8} rx={4} fill={c as string} opacity={0.75} />
          <He x={x as number} y={180} size={11.5} bold>{a as string}</He>
          <He x={x as number} y={198} size={10.5} color={MUTED}>{b as string}</He>
        </g>
      ))}
      <He x={240} y={236} size={11} color={MUTED}>סדר הגנים על הכרומוזום = סדר ההתבטאות בהתפתחות</He>
    </Svg>
  );
}

// ── gx-repeats-mobile ────────────────────────────────────────────────────────
function TransposonTypes() {
  const tsd = (x: number, y: number) => <path d={`M${x} ${y + 12} l8 0`} stroke={RED} strokeWidth={3} />;
  const rows: [string, string, (y: number) => React.ReactNode][] = [
    ["טרנספוזון של DNA (IS)", "חתוך והדבק", (y) => (<g>
      <path d={`M60 ${y - 9} l14 9 l-14 9 z`} fill={ORANGE} />
      <Seg x0={80} x1={330} y={y} label="transposase" c={BLUE} fill={FILL.blue} />
      <path d={`M350 ${y - 9} l-14 9 l14 9 z`} fill={ORANGE} />
    </g>)],
    ["רטרוטרנספוזון עם LTR", "RNA → DNA", (y) => (<g>
      <Seg x0={50} x1={100} y={y} label="LTR" c={ORANGE} fill={FILL.orange} />
      <Seg x0={104} x1={170} y={y} label="gag" c={BLUE} fill={FILL.blue} />
      <Seg x0={174} x1={300} y={y} label="pol (RT, IN)" c={BLUE} fill={FILL.blue} />
      <Seg x0={304} x1={354} y={y} label="LTR" c={ORANGE} fill={FILL.orange} />
    </g>)],
    ["LINE-1 (בלי LTR)", "כ-17% מהגנום", (y) => (<g>
      <Seg x0={50} x1={90} y={y} label="5′UTR" c={MUTED} fill={FILL.gray} size={9.5} />
      <Seg x0={94} x1={150} y={y} label="ORF1" c={BLUE} fill={FILL.blue} />
      <Seg x0={154} x1={320} y={y} label="ORF2 (EN, RT)" c={BLUE} fill={FILL.blue} />
      <La x={340} y={y + 4} size={10.5} bold color={PURPLE}>AAAA</La>
    </g>)],
    ["Alu (SINE)", "בלי אנזימים — משתמש ב-L1", (y) => (<g>
      <Seg x0={50} x1={170} y={y} label="~300 bp" c={GREEN} fill={FILL.green} />
      <La x={190} y={y + 4} size={10.5} bold color={PURPLE}>AAAA</La>
    </g>)],
  ];
  return (
    <Svg h={290} label="מבנה של רצפים ניידים: טרנספוזון של DNA — גן לטרנספוזאזה בין חזרות הפוכות; רטרוטרנספוזון עם LTR — gag ו-pol בין שני LTR; LINE-1 — שתי מסגרות קריאה, השנייה עם אנדונוקלאזה ורוורס טרנסקריפטאזה, וזנב פולי-A; Alu — כ-300 זוגות בסיסים בלי גנים לאנזימים. משני הצדדים — שכפול קצר של אתר המטרה">
      {rows.map(([t, sub, draw], i) => {
        const y = 40 + i * 64;
        return (
          <g key={t}>
            <Dna x0={20} x1={366} y={y} c={LINE} />
            {tsd(30, y)}{tsd(354, y)}
            {draw(y)}
            <He x={474} y={y - 2} size={11.5} bold anchor="end">{t}</He>
            <He x={474} y={y + 14} size={10.5} anchor="end" color={MUTED}>{sub}</He>
          </g>
        );
      })}
      <path d="M40 278 l8 0" stroke={RED} strokeWidth={3} /><He x={56} y={282} size={10.5} anchor="start">שכפול אתר המטרה</He>
      <path d="M180 272 l12 6 l-12 6 z" fill={ORANGE} /><He x={198} y={282} size={10.5} anchor="start">חזרה הפוכה</He>
    </Svg>
  );
}

// ── gx-genome-wide ───────────────────────────────────────────────────────────
function TadLoopExtrusion() {
  const tri = (x0: number, x1: number, c: string) => <path d={`M${x0} 110 L${(x0 + x1) / 2} ${110 - (x1 - x0) / 2} L${x1} 110 z`} fill={c} opacity={0.35} stroke={c} strokeWidth={1.2} />;
  return (
    <Svg h={290} label="TADs ושליחת לולאה: למעלה — מפת מגעים (Hi-C) עם שני משולשים, שני תחומים שבתוכם הרבה מגעים. למטה — טבעת קוהזין מושכת את ה-DNA ויוצרת לולאה שגדלה, עד שהיא נעצרת בשני אתרי CTCF שפונים זה אל זה; המגביר והפרומוטור בתוך אותה לולאה באים במגע">
      <He x={240} y={20} size={12} bold>מפת מגעים (Hi-C)</He>
      {tri(40, 240, ORANGE)}{tri(240, 440, BLUE)}
      <Line x1={40} y1={110} x2={440} y2={110} c={MUTED} w={1.4} />
      <La x={140} y={100} size={11} bold color={ORANGE}>TAD 1</La>
      <La x={340} y={100} size={11} bold color={BLUE}>TAD 2</La>
      <line x1={20} x2={460} y1={130} y2={130} stroke={LINE} strokeWidth={1} />
      <He x={240} y={152} size={12} bold>שליחת לולאה</He>
      <path d="M40 250 L180 250 C 175 170, 305 170, 300 250 L440 250" fill="none" stroke={MUTED} strokeWidth={3} />
      <ellipse cx={240} cy={246} rx={70} ry={10} fill="none" stroke={ORANGE} strokeWidth={4} />
      <He x={240} y={276} size={10.5} bold color={ORANGE}>קוהזין</He>
      <path d="M170 238 l14 12 l-14 12 z" fill={RED} />
      <path d="M310 238 l-14 12 l14 12 z" fill={RED} />
      <La x={150} y={238} size={10.5} bold color={RED}>CTCF</La>
      <La x={330} y={238} size={10.5} bold color={RED}>CTCF</La>
      <circle cx={208} cy={186} r={7} fill={GREEN} /><He x={192} y={182} size={10.5} anchor="end" color={GREEN}>מגביר</He>
      <circle cx={272} cy={186} r={7} fill={BLUE} /><He x={288} y={182} size={10.5} anchor="start" color={BLUE}>פרומוטור</He>
      <Arrow x1={110} y1={268} x2={160} y2={268} color={MUTED} />
      <Arrow x1={370} y1={268} x2={320} y2={268} color={MUTED} />
    </Svg>
  );
}

function DosageCompensation() {
  const chr = (x: number, y: number, kind: "on" | "off" | "up" | "half" | "y") => {
    const c = kind === "off" ? MUTED : kind === "y" ? INK : kind === "up" ? GREEN : kind === "half" ? ORANGE : BLUE;
    const fill = kind === "off" ? FILL.gray : kind === "y" ? "#e5e7eb" : kind === "up" ? FILL.green : kind === "half" ? FILL.orange : FILL.blue;
    const h = kind === "y" ? 40 : 70;
    return <rect x={x - 8} y={y} width={16} height={h} rx={8} fill={fill} stroke={c} strokeWidth={1.5} />;
  };
  const cols: [number, string, string, string, string][] = [
    [400, "יונקים", "X אחד מושבת בנקבה", "Xist", "XX / XY"],
    [240, "זבוב", "X של הזכר ×2", "MSL + roX · H4K16ac", "XX / XY"],
    [80, "C. elegans", "שני ה-X × ½", "קומפלקס דמוי-קונדנסין", "XX / XO"],
  ];
  return (
    <Svg h={250} label="שלושה פתרונות לפיצוי מינון של X: ביונקים X אחד מושבת בנקבה; בזבוב ה-X היחיד של הזכר משועתק פי 2 בעזרת קומפלקס MSL; ב-C. elegans שני ה-X של ההרמפרודיט מוחלשים בחצי">
      {cols.map(([x, a, b, c, d], i) => (
        <g key={a}>
          <He x={x} y={22} size={12.5} bold>{a}</He>
          <La x={x} y={40} size={10.5} color={MUTED}>{d}</La>
          {i === 0 && (<g>{chr(x - 46, 56, "on")}{chr(x - 24, 56, "off")}{chr(x + 24, 56, "on")}{chr(x + 46, 56, "y")}</g>)}
          {i === 1 && (<g>{chr(x - 46, 56, "on")}{chr(x - 24, 56, "on")}{chr(x + 24, 56, "up")}{chr(x + 46, 56, "y")}</g>)}
          {i === 2 && (<g>{chr(x - 46, 56, "half")}{chr(x - 24, 56, "half")}{chr(x + 24, 56, "on")}</g>)}
          <line x1={x} x2={x} y1={52} y2={130} stroke={LINE} strokeWidth={1} {...dash} />
          <He x={x - 35} y={144} size={10} color={MUTED}>נקבה</He>
          <He x={x + 35} y={144} size={10} color={MUTED}>{i === 2 ? "זכר" : "זכר"}</He>
          <He x={x} y={174} size={11.5} bold>{b}</He>
          <He x={x} y={192} size={10.5} color={MUTED}>{c}</He>
        </g>
      ))}
      <He x={240} y={232} size={11} color={MUTED}>אפור — מושבת · ירוק — מוגבר · כתום — מוחלש · התוצאה: אותה רמת ביטוי מ-X בשני המינים</He>
    </Svg>
  );
}

// ── gx-integration ───────────────────────────────────────────────────────────
function LambdaSwitch() {
  const state = (y: number, lyso: boolean) => (
    <g>
      <He x={474} y={y - 34} size={12.5} bold anchor="end" color={lyso ? PURPLE : RED}>{lyso ? "ליזוגניה" : "ליזיס"}</He>
      <Dna x0={30} x1={450} y={y} />
      <Seg x0={30} x1={110} y={y} label="cI" c={PURPLE} fill={lyso ? FILL.purple : FILL.gray} />
      <Seg x0={150} x1={190} y={y} label="Oᴿ3" c={INK} fill="#ffffff" size={10.5} />
      <Seg x0={194} x1={234} y={y} label="Oᴿ2" c={INK} fill="#ffffff" size={10.5} />
      <Seg x0={238} x1={278} y={y} label="Oᴿ1" c={INK} fill="#ffffff" size={10.5} />
      <Seg x0={318} x1={400} y={y} label="cro" c={RED} fill={lyso ? FILL.gray : FILL.red} />
      <La x={134} y={y + 26} size={10.5} color={MUTED}>Pᴿᴹ</La>
      <La x={298} y={y + 26} size={10.5} color={MUTED}>Pᴿ</La>
      {lyso ? (
        <g>
          <Blob x={214} y={y - 18} rx={16} ry={8} t="CI" c={PURPLE} fill={FILL.purple} size={9.5} />
          <Blob x={258} y={y - 18} rx={16} ry={8} t="CI" c={PURPLE} fill={FILL.purple} size={9.5} />
          <Arrow x1={140} y1={y + 10} x2={80} y2={y + 10} color={GREEN} width={2.4} />
          <He x={250} y={y + 48} size={11} color={MUTED}>CI מדכא את Pᴿ ומפעיל את Pᴿᴹ — משוב חיובי</He>
        </g>
      ) : (
        <g>
          <Blob x={170} y={y - 18} rx={18} ry={8} t="Cro" c={RED} size={9.5} />
          <Arrow x1={290} y1={y + 10} x2={380} y2={y + 10} color={GREEN} width={2.4} />
          <He x={250} y={y + 48} size={11} color={MUTED}>Cro מדכא את Pᴿᴹ; Pᴿ פתוח — גני ליזיס</He>
        </g>
      )}
    </g>
  );
  return (
    <Svg h={260} label="המתג של פאג' λ באזור Oᴿ: בליזוגניה דימרים של CI קשורים ל-Oᴿ1 ול-Oᴿ2, מדכאים את Pᴿ ומפעילים את Pᴿᴹ — הפרומוטור של cI — משוב חיובי. בליזיס Cro קשור ל-Oᴿ3, מדכא את Pᴿᴹ, ו-Pᴿ פתוח לגני הליזיס">
      {state(70, true)}
      <line x1={20} x2={460} y1={138} y2={138} stroke={LINE} strokeWidth={1} />
      {state(196, false)}
    </Svg>
  );
}

function DrosophilaCascade() {
  const em = (y: number, draw: (x0: number, w: number, y: number) => React.ReactNode, t: string, sub: string) => (
    <g>
      <clipPath id={`emb${y}`}><ellipse cx={170} cy={y} rx={140} ry={20} /></clipPath>
      <ellipse cx={170} cy={y} rx={140} ry={20} fill="#ffffff" stroke={INK} strokeWidth={1.2} />
      <g clipPath={`url(#emb${y})`}>{draw(30, 280, y)}</g>
      <He x={474} y={y - 2} size={11.5} bold anchor="end">{t}</He>
      <He x={474} y={y + 14} size={10} anchor="end" color={MUTED}>{sub}</He>
    </g>
  );
  return (
    <Svg h={310} label="מפל הבקרה בעובר הזבוב: גנים אימהיים יוצרים מפלי ריכוז (Bicoid בקדמה, Nanos באחור); גני פער מתבטאים באזורים רחבים; גני זוג-כלל בשבעה פסים; גני קוטביות מקטע ב-14 פסים; וגני Hox נותנים זהות לכל אזור. הקדמה (ראש) משמאל">
      <He x={30} y={18} size={10.5} color={MUTED} anchor="start">קדמה</He>
      <He x={310} y={18} size={10.5} color={MUTED} anchor="end">אחור</He>
      {em(46, (x0, w, y) => (<g>
        {Array.from({ length: 28 }, (_, i) => <rect key={i} x={x0 + i * 10} y={y - 20} width={10} height={40} fill={BLUE} opacity={Math.exp(-i / 6) * 0.8} />)}
        {Array.from({ length: 28 }, (_, i) => <rect key={`n${i}`} x={x0 + w - (i + 1) * 10} y={y - 20} width={10} height={40} fill={ORANGE} opacity={Math.exp(-i / 4) * 0.7} />)}
      </g>), "אימהיים", "Bicoid · Nanos — מפלי ריכוז")}
      {em(106, (x0, _w, y) => (<g>
        <rect x={x0 + 20} y={y - 20} width={80} height={40} fill={GREEN} opacity={0.55} />
        <rect x={x0 + 110} y={y - 20} width={50} height={40} fill={PURPLE} opacity={0.5} />
        <rect x={x0 + 170} y={y - 20} width={60} height={40} fill={ORANGE} opacity={0.5} />
      </g>), "פער", "אזורים רחבים")}
      {em(166, (x0, _w, y) => (<g>{Array.from({ length: 7 }, (_, i) => <rect key={i} x={x0 + 50 + i * 30} y={y - 20} width={12} height={40} fill={PURPLE} opacity={0.75} />)}</g>), "זוג-כלל", "7 פסים — even-skipped")}
      {em(226, (x0, _w, y) => (<g>{Array.from({ length: 14 }, (_, i) => <rect key={i} x={x0 + 50 + i * 15} y={y - 20} width={5} height={40} fill={RED} opacity={0.7} />)}</g>), "קוטביות מקטע", "14 פסים")}
      {em(286, (x0, _w, y) => (<g>
        {[[60, 40, BLUE], [100, 40, GREEN], [140, 50, ORANGE], [190, 70, PURPLE]].map(([dx, w, c], i) => <rect key={i} x={x0 + (dx as number)} y={y - 20} width={w as number} height={40} fill={c as string} opacity={0.5} />)}
      </g>), "Hox", "זהות לכל מקטע")}
      {[66, 126, 186, 246].map((y) => <Arrow key={y} x1={330} y1={y} x2={330} y2={y + 18} color={MUTED} />)}
    </Svg>
  );
}

export const GENE_EXPRESSION_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "lac-merodiploid": { el: LacMerodiploid, captionHe: "דיפלואידים חלקיים של אופרון lac, בלי משרן. למעלה: המדכא מעותק תקין של lacI מתפזר וקושר את שני האופרטורים — lacI⁻ רצסיבית ופועלת ב-trans. למטה: אופרטור Oᶜ לא קושר מדכא, אבל משפיע רק על ה-lacZ שלידו — פעולה ב-cis. סכמטי." },
  "lac-states": { el: LacStates, captionHe: "שלושה מצבים של אופרון lac. בלי לקטוז — המדכא (R) קשור לאופרטור. עם לקטוז — המשרן משחרר את המדכא; אם יש גם גלוקוז, רמת ה-cAMP נמוכה ו-CAP לא קשור — שעתוק חלש. בלי גלוקוז — CAP-cAMP מגייס את RNA פולימראז — שעתוק חזק. סכמטי." },
  "trp-attenuation": { el: TrpAttenuation, captionHe: "אטנואציה באופרון trp. אזורים 1–4 ב-RNA המוביל יכולים להתזווג כ-3:4 (טרמינטור) או כ-2:3 (אנטי-טרמינטור). מיקום הריבוזום שמתרגם את הפפטיד המוביל קובע מה ייווצר: כשיש טריפטופן הוא מכסה את אזור 2 → 3:4; כשחסר — הוא נתקע באזור 1 → 2:3. סכמטי." },
  "dna-binding-motifs": { el: DnaBindingMotifs, captionHe: "ארבעה מוטיבים עיקריים לקישור DNA בגורמי שעתוק. ברובם סליל α (אדום) נכנס לחריץ הגדול של ה-DNA ומזהה את הבסיסים. ברוכסן לאוצין ובסליל-לולאה-סליל החלבון פועל כדימר, ולכן השותף קובע את האתר ואת התוצאה. סכמטי." },
  "gal-switch": { el: GalSwitch, captionHe: "המתג של גני GAL בשמרים. Gal4 קשור תמיד ל-UASᴳ. בלי גלקטוז Gal80 מכסה את אזור ההפעלה שלו; גלקטוז נקשר ל-Gal3, שקושר את Gal80 ומשחרר את אזור ההפעלה — ו-Gal4 מגייס את Mediator ואת RNA פולימראז II. סכמטי." },
  "histone-marks": { el: HistoneMarks, captionHe: "סימנים עיקריים על זנב ההיסטון H3. אצטילציה (כחול) ו-H3K4me3, H3K36me3 (ירוק) קשורים לגנים פעילים; H3K9me3 ו-H3K27me3 (אדום) — להשתקה. המשמעות של מתילציה תלויה במיקום, והיא פועלת דרך חלבונים שקוראים אותה. סכמטי." },
  "dna-methylation-maintenance": { el: DnaMethylationMaintenance, captionHe: "מתילציית שימור. אחרי שכפול, כל אתר CpG חצי-ממותל: הגדיל הישן ממותל והחדש (כתום) לא. DNMT1, בעזרת UHRF1, מזהה אתרים חצי-ממותלים וממתל את הגדיל החדש — כך הדפוס עובר בחלוקה. סכמטי." },
  "heterochromatin-spreading": { el: HeterochromatinSpreading, captionHe: "התפשטות הטרוכרומטין. מאתר הנבטה, אנזים שממתל H3K9 ו-HP1 שקורא את הסימן מעבירים את המצב מנוקלאוזום לנוקלאוזום. גבול עוצר את ההתפשטות; בלעדיו — גן שכן מושתק (כמו white באפקט המיקום המגוון). סכמטי." },
  "x-inactivation-steps": { el: XInactivationSteps, captionHe: "השבתת X בתא של נקבת יונק: ספירה ובחירה, ציפוי ה-X הנבחר ב-RNA של Xist, השתקה דרך PRC2 ו-H3K27me3, ושימור יציב בגופיף בר עם מתילציה של DNA. סכמטי." },
  "alt-splicing-types": { el: AltSplicingTypes, captionHe: "סוגי השחבור החלופי. מלבנים — אקסונים; קווים — אינטרונים; הקשתות הירוקות והאדומות — שתי דרכים לשחבר את אותו pre-mRNA. סכמטי." },
  "sex-determination-splicing": { el: SexDeterminationSplicing, captionHe: "קביעת המין בזבוב — מפל של אירועי שחבור. בנקבה: Sxl חוסם אתר 3′ ב-tra, נוצר Tra, ו-Tra עם Tra2 מפעילים את האקסון הנקבי ב-dsx (Dsx-F). בזכר: אין Sxl ואין Tra, והאקסון הנקבי ב-dsx מושמט (Dsx-M). סכמטי." },
  "iron-regulation": { el: IronRegulation, captionHe: "בקרת הברזל דרך IRE ו-IRP. במחסור בברזל IRP נקשר: בפריטין (IRE בקצה ה-5′) הוא חוסם תרגום; בקולטן הטרנספרין (IREs בקצה ה-3′) הוא מגן על ה-mRNA. בעודף ברזל — ההפך. סכמטי." },
  "mrna-decay": { el: MrnaDecay, captionHe: "המסלול העיקרי לפירוק mRNA באאוקריוטים: קיצור זנב הפולי-A, ואחריו הסרת הכובע ופירוק 5′→3′ (Xrn1) או פירוק 3′→5′ (האקסוזום). סכמטי." },
  "mirna-pathway": { el: MirnaPathway, captionHe: "ייצור miRNA ופעולתו: Drosha בגרעין, Exportin-5, Dicer בציטופלזמה, טעינה על Argonaute (RISC), וזיווג חלקי עם קצה ה-3′ של mRNA מטרה דרך אזור הזרע — עיכוב תרגום ופירוק. סכמטי." },
  "cot-curve": { el: CotCurve, captionHe: "עקומות ריאסוציאציה (Cot) מודגמות. ב-DNA חיידקי — שלב אחד. ב-DNA אאוקריוטי — שלושה שלבים לפי מספר העותקים: חוזרים מאוד, חוזרים בינוניים וייחודיים (כאן 20%, 30% ו-50%, כמו בתרגיל). העקומות מחושבות מסכום של שלוש עקומות לוגיסטיות, לא ממדידה." },
  "unequal-crossover": { el: UnequalCrossover, captionHe: "שחלוף לא שווה בין שני גנים דומים בטנדם. הזדווגות בהיסט (A1 מול A2) ושחלוף ביניהם יוצרים כרומוזום עם שלושה עותקים וכרומוזום עם עותק אחד; בשניהם גן היברידי (סגול). סכמטי." },
  "globin-locus": { el: GlobinLocus, captionHe: "צביר β-גלובין בכרומוזום 11. ה-LCR (אתרי רגישות-יתר ל-DNase I) פותח את הכרומטין של כל הצביר ויוצר לולאה אל הגן הפעיל. סדר הגנים תואם לסדר ההתבטאות: ε, γ, ואחר כך δ ו-β. סכמטי, לא בקנה מידה." },
  "transposon-types": { el: TransposonTypes, captionHe: "סוגים עיקריים של רצפים ניידים. טרנספוזון של DNA מקודד לטרנספוזאזה בין חזרות הפוכות; רטרוטרנספוזונים עוברים דרך RNA ורוורס טרנסקריפטאזה — עם LTR (כמו רטרו-נגיפים) או בלי (LINE-1). Alu קצר ומשתמש באנזימים של L1. סכמטי." },
  "tad-loop-extrusion": { el: TadLoopExtrusion, captionHe: "תחומים טופולוגיים (TADs) ושליחת לולאה. קוהזין מושך את ה-DNA ויוצר לולאה שגדלה, עד שהוא נעצר בשני אתרי CTCF שפונים זה אל זה. מגביר ופרומוטור באותה לולאה באים במגע; בין תחומים — מעט מגעים. סכמטי." },
  "dosage-compensation": { el: DosageCompensation, captionHe: "שלושה פתרונות לפיצוי מינון של כרומוזום X. בכל המקרים התוצאה זהה: ביטוי דומה של גני X בשני המינים — אבל בשלושה מנגנונים שונים, וכל אחד פועל על כרומוזום שלם. סכמטי." },
  "lambda-switch": { el: LambdaSwitch, captionHe: "המתג של פאג' λ. CI ו-Cro מתחרים על שלושה אופרטורים. CI (בעיקר ב-Oᴿ1 ו-Oᴿ2) מדכא את Pᴿ ומפעיל את הפרומוטור של עצמו — מצב ליזוגני יציב. Cro (בעיקר ב-Oᴿ3) מדכא את Pᴿᴹ — ליזיס. סכמטי." },
  "drosophila-cascade": { el: DrosophilaCascade, captionHe: "מפל הבקרה לאורך ציר הראש-זנב בעובר הזבוב: מפלי ריכוז אימהיים, גני פער, גני זוג-כלל, גני קוטביות מקטע וגני Hox. כל רמה מפרשת את הקודמת ויוצרת דפוס מפורט יותר. סכמטי — המיקומים לא מדויקים." },
};
