/* Figures for the microbiology & virology units (Technion 134121). Schematic unless the caption says otherwise.
   Colors: membranes gray/blue, peptidoglycan orange, nucleic acid purple, proteins green, signals red.
   Referenced from lesson bodies as [[figure:<id>]]. */
import type React from "react";
import { ArrowDefs, BLUE, GREEN, INK, MUTED, ORANGE, He, La, curve, dash, scale } from "./biochemFigures";
import { Arrow } from "./metabolicFigures";

const PURPLE = "#7c3aed";
const RED = "#b91c1c";
const PINK = "#db2777";
const LINE_GRAY = "#cbd5e1";
const FILL = { blue: "#dbeafe", green: "#dcfce7", orange: "#ffedd5", purple: "#ede9fe", yellow: "#fef3c7", gray: "#f1f5f9", red: "#fee2e2", pink: "#fce7f3", sky: "#e0f2fe" };

const Svg = ({ w = 480, h, label, children }: { w?: number; h: number; label: string; children: React.ReactNode }) => (
  <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label={label}>
    <ArrowDefs />
    {children}
  </svg>
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
const Axes = ({ x0, y0, x1, y1 }: { x0: number; y0: number; x1: number; y1: number }) => (
  <g>
    <line x1={x0} y1={y0} x2={x1 + 8} y2={y0} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
    <line x1={x0} y1={y0 + 4} x2={x0} y2={y1 - 8} stroke={INK} strokeWidth={1.6} markerEnd="url(#bfArrow)" />
  </g>
);
const Rod = ({ x, y, w = 34, h = 14, fill, stroke = INK }: { x: number; y: number; w?: number; h?: number; fill: string; stroke?: string }) => (
  <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={stroke} strokeWidth={1.2} />
);

// ── mv-history: Gram stain ───────────────────────────────────────────────────
function GramStain() {
  const steps: [string, string, string, string, string][] = [
    ["1. גביש סגול", "צבע ראשוני", PURPLE, PURPLE, ""],
    ["2. יוד", "מקבע — קומפלקס", PURPLE, PURPLE, ""],
    ["3. אלכוהול", "הסרת צבע", PURPLE, "#f8fafc", "הצבע נשטף"],
    ["4. ספרנין", "צבע נגדי", PURPLE, PINK, ""],
  ];
  const xs = [385, 280, 175, 70];
  return (
    <Svg h={250} label="צביעת גראם בארבעה שלבים: גביש סגול, יוד, אלכוהול וספרנין. תאים גראם-חיוביים נשארים סגולים; תאים גראם-שליליים מאבדים את הצבע באלכוהול ונצבעים בוורוד בספרנין">
      {steps.map(([t, sub, pos, neg, note], i) => (
        <g key={t}>
          <He x={xs[i]} y={26} size={12.5} bold>{t}</He>
          <He x={xs[i]} y={44} size={10.5} color={MUTED}>{sub}</He>
          <Rod x={xs[i] - 14} y={100} fill={pos} /><Rod x={xs[i] + 14} y={112} fill={pos} />
          <Rod x={xs[i] - 14} y={170} fill={neg} /><Rod x={xs[i] + 14} y={182} fill={neg} />
          {note && <He x={xs[i]} y={214} size={10} color={RED}>{note}</He>}
          {i < 3 && <Arrow x1={xs[i] - 40} y1={140} x2={xs[i] - 70} y2={140} color={MUTED} />}
        </g>
      ))}
      <He x={476} y={110} size={11.5} anchor="end" bold color={PURPLE}>גראם+</He>
      <He x={476} y={180} size={11.5} anchor="end" bold color={PINK}>גראם−</He>
      <He x={240} y={240} size={11} color={MUTED}>דופן עבה של פפטידוגליקן לוכדת את הקומפלקס; בגראם-שליליים האלכוהול ממיס את הממברנה החיצונית</He>
    </Svg>
  );
}

// ── mv-cell-envelope: transport systems ──────────────────────────────────────
function TransportSystems() {
  const memTop = 120, memBot = 150;
  return (
    <Svg h={300} label="שלוש מערכות הובלה בחיידקים: הובלה פשוטה בסימפורט עם פרוטונים, העברה קבוצתית במערכת הפוספוטרנספראז שבה הסוכר מזורחן בכניסה על חשבון PEP, ומובל ABC שבו חלבון קושר בפריפלזמה מגיש את החומר והאנרגיה מגיעה מפירוק ATP">
      <rect x={10} y={memTop} width={460} height={memBot - memTop} fill={FILL.gray} stroke={MUTED} />
      <He x={470} y={memTop - 8} size={10.5} anchor="end" color={MUTED}>בחוץ</He>
      <He x={470} y={memBot + 18} size={10.5} anchor="end" color={MUTED}>ציטופלזמה</He>
      {/* simple transport */}
      <He x={390} y={24} size={12.5} bold>הובלה פשוטה</He>
      <rect x={374} y={memTop - 6} width={32} height={42} rx={8} fill={FILL.blue} stroke={BLUE} />
      <La x={372} y={90} size={11.5} color={ORANGE} bold>H⁺</La>
      <He x={412} y={90} size={11.5} bold>חומר</He>
      <Arrow x1={380} y1={98} x2={384} y2={200} color={ORANGE} />
      <Arrow x1={402} y1={98} x2={398} y2={200} color={BLUE} />
      <He x={390} y={222} size={10.5} color={MUTED}>הכוח הפרוטוני</He>
      <He x={390} y={238} size={10.5} color={MUTED}>מניע (סימפורט)</He>
      {/* group translocation */}
      <He x={240} y={24} size={12.5} bold>העברה קבוצתית</He>
      <rect x={224} y={memTop - 6} width={32} height={42} rx={8} fill={FILL.green} stroke={GREEN} />
      <He x={240} y={90} size={11.5} bold>גלוקוז</He>
      <Arrow x1={240} y1={98} x2={240} y2={200} color={GREEN} />
      <La x={240} y={218} size={11.5} bold color={GREEN}>glucose-6-P</La>
      <La x={170} y={196} size={11} color={RED}>PEP → pyruvate</La>
      <Arrow x1={190} y1={186} x2={226} y2={164} color={RED} />
      <He x={240} y={258} size={10.5} color={MUTED}>הסוכר מזורחן בכניסה</He>
      <He x={240} y={274} size={10.5} color={MUTED}>(מערכת PTS)</He>
      {/* ABC */}
      <He x={90} y={24} size={12.5} bold>מובל ABC</He>
      <circle cx={90} cy={78} r={16} fill={FILL.yellow} stroke={ORANGE} />
      <He x={90} y={58} size={10} color={ORANGE}>חלבון קושר</He>
      <circle cx={90} cy={78} r={5} fill={BLUE} />
      <rect x={72} y={memTop - 6} width={36} height={42} rx={8} fill={FILL.blue} stroke={BLUE} />
      <Arrow x1={90} y1={98} x2={90} y2={200} color={BLUE} />
      <La x={135} y={186} size={11} color={RED}>ATP → ADP</La>
      <Arrow x1={130} y1={176} x2={108} y2={160} color={RED} />
      <He x={90} y={222} size={10.5} color={MUTED}>זיקה גבוהה מאוד</He>
      <He x={90} y={238} size={10.5} color={MUTED}>(חלבון קושר בפריפלזמה)</He>
    </Svg>
  );
}

// ── mv-cell-envelope: Gram-positive vs Gram-negative envelopes ──────────────
function GramEnvelopes() {
  const Layer = ({ x, y, w, h, fill, stroke, label, size = 11 }: { x: number; y: number; w: number; h: number; fill: string; stroke: string; label: string; size?: number }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.3} />
      <He x={x - 8} y={y + h / 2 + 4} size={size} anchor="end">{label}</He>
    </g>
  );
  return (
    <Svg h={300} label="השוואת המעטפות: בגראם-חיוביים שכבה עבה של פפטידוגליקן עם חומצות טייכואיות מעל הממברנה הציטופלזמית; בגראם-שליליים ממברנה חיצונית עם LPS ופורינים, פריפלזמה, שכבה דקה של פפטידוגליקן וממברנה ציטופלזמית">
      <He x={360} y={24} size={13} bold color={PURPLE}>גראם-חיובי</He>
      <Layer x={330} y={70} w={120} h={90} fill={FILL.orange} stroke={ORANGE} label="פפטידוגליקן עבה" />
      {[350, 380, 410].map((x) => <line key={x} x1={x} y1={50} x2={x} y2={160} stroke={ORANGE} strokeWidth={2} />)}
      <He x={325} y={52} size={10.5} anchor="end" color={ORANGE}>חומצות טייכואיות</He>
      <Layer x={330} y={166} w={120} h={22} fill={FILL.gray} stroke={MUTED} label="ממברנה ציטופלזמית" />
      <He x={390} y={214} size={11} color={MUTED}>ציטופלזמה</He>

      <He x={120} y={24} size={13} bold color={PINK}>גראם-שלילי</He>
      {[100, 116, 132, 148, 164].map((x) => <line key={x} x1={x} y1={40} x2={x} y2={60} stroke={RED} strokeWidth={2} />)}
      <He x={86} y={50} size={10.5} anchor="end" color={RED}>LPS</He>
      <Layer x={90} y={60} w={120} h={22} fill={FILL.sky} stroke={BLUE} label="ממברנה חיצונית" />
      <rect x={140} y={56} width={14} height={30} rx={4} fill={FILL.green} stroke={GREEN} />
      <Layer x={90} y={82} w={120} h={46} fill="#ffffff" stroke={LINE_GRAY} label="פריפלזמה" />
      <He x={180} y={104} size={10} color={GREEN} anchor="start">פורין</He>
      <Layer x={90} y={128} w={120} h={12} fill={FILL.orange} stroke={ORANGE} label="פפטידוגליקן דק" size={10.5} />
      <Layer x={90} y={146} w={120} h={22} fill={FILL.gray} stroke={MUTED} label="ממברנה ציטופלזמית" />
      <He x={150} y={194} size={11} color={MUTED}>ציטופלזמה</He>
      <He x={240} y={256} size={11} color={MUTED}>LPS: ליפיד A (אנדוטוקסין) + ליבה + שרשרת O</He>
      <He x={240} y={276} size={11} color={MUTED}>הפפטידוגליקן מחובר לממברנה החיצונית בליפופרוטאין</He>
    </Svg>
  );
}
// ── mv-surface-motility: flagellar motor ─────────────────────────────────────
function FlagellumMotor() {
  const cx = 200;
  return (
    <Svg h={320} label="המנוע של השוטון בחיידק גראם-שלילי: הסיב מחובר דרך הקרס למוט, שעובר דרך טבעת L בממברנה החיצונית וטבעת P בפפטידוגליקן אל טבעת MS בממברנה הציטופלזמית ואל טבעת C בציטופלזמה. חלבוני Mot מסביב מהווים את הסטטור, וזרימת פרוטונים דרכם מסובבת את הרוטור">
      <rect x={20} y={110} width={300} height={18} fill={FILL.sky} stroke={BLUE} />
      <rect x={20} y={150} width={300} height={8} fill={FILL.orange} stroke={ORANGE} />
      <rect x={20} y={196} width={300} height={18} fill={FILL.gray} stroke={MUTED} />
      <path d={`M${cx} 112 L${cx} 70 Q ${cx} 50 ${cx + 20} 44 L${cx + 60} 30`} fill="none" stroke={GREEN} strokeWidth={6} strokeLinecap="round" />
      <path d={`M${cx + 60} 30 C ${cx + 100} 18, ${cx + 120} 40, ${cx + 160} 24 S ${cx + 220} 10, ${cx + 260} 20`} fill="none" stroke={GREEN} strokeWidth={4} />
      <rect x={cx - 4} y={110} width={8} height={100} fill={GREEN} />
      <rect x={cx - 18} y={112} width={36} height={14} rx={3} fill="#bbf7d0" stroke={GREEN} />
      <rect x={cx - 18} y={147} width={36} height={14} rx={3} fill="#bbf7d0" stroke={GREEN} />
      <rect x={cx - 26} y={198} width={52} height={14} rx={3} fill="#bbf7d0" stroke={GREEN} />
      <rect x={cx - 36} y={222} width={72} height={22} rx={6} fill="#bbf7d0" stroke={GREEN} />
      {[cx - 56, cx + 56].map((x) => <rect key={x} x={x - 9} y={160} width={18} height={56} rx={4} fill={FILL.yellow} stroke={ORANGE} />)}
      <La x={cx + 56} y={150} size={10.5} bold color={ORANGE}>Mot</La>
      <La x={cx - 56} y={150} size={10.5} bold color={ORANGE}>Mot</La>
      <La x={cx - 56} y={234} size={11} bold color={RED}>H⁺</La>
      <Arrow x1={cx - 46} y1={170} x2={cx - 46} y2={214} color={RED} />
      <He x={476} y={118} size={10.5} anchor="end">ממברנה חיצונית:</He><He x={476} y={133} size={10.5} anchor="end">טבעת L</He>
      <He x={476} y={152} size={10.5} anchor="end">פפטידוגליקן:</He><He x={476} y={167} size={10.5} anchor="end">טבעת P</He>
      <He x={476} y={200} size={10.5} anchor="end">ממברנה ציטופלזמית:</He><He x={476} y={215} size={10.5} anchor="end">טבעת MS</He>
      <He x={476} y={238} size={10.5} anchor="end">טבעת C (המתג)</He>
      <He x={cx + 170} y={60} size={11} color={GREEN}>הסיב (פלגלין)</He>
      <He x={cx - 40} y={60} size={11} color={GREEN}>קרס</He>
      <He x={200} y={278} size={11.5} color={MUTED}>הרוטור: מוט, טבעות MS ו-C · הסטטור: חלבוני Mot</He>
      <He x={200} y={298} size={11.5} color={MUTED}>זרימת פרוטונים דרך הסטטור מסובבת את הרוטור</He>
    </Svg>
  );
}

// ── mv-surface-motility: chemotaxis signaling ────────────────────────────────
function ChemotaxisChe() {
  return (
    <Svg h={310} label="מסלול הכימוטקסיס: חומר מושך נקשר לקולטן MCP ומעכב את הקינאז CheA; פחות CheY-P מגיע למנוע, ולכן פחות התהפכויות. CheZ מסלק את הזרחה מ-CheY-P. להסתגלות: CheR מוסיף מתיל לקולטן ו-CheB-P מסיר אותו">
      <rect x={20} y={70} width={440} height={22} fill={FILL.gray} stroke={MUTED} />
      <He x={460} y={62} size={10.5} anchor="end" color={MUTED}>בחוץ</He>
      <rect x={210} y={40} width={30} height={92} rx={6} fill={FILL.blue} stroke={BLUE} />
      <La x={225} y={34} size={11} bold color={BLUE}>MCP</La>
      <circle cx={190} cy={48} r={8} fill={FILL.green} stroke={GREEN} />
      <He x={176} y={32} size={10.5} color={GREEN}>חומר מושך</He>
      <LBox x={225} y={134} w={70} label="CheW·CheA" c={PURPLE} fill={FILL.purple} size={11} />
      <line x1={190} y1={66} x2={204} y2={140} stroke={RED} strokeWidth={2} />
      <line x1={198} y1={142} x2={210} y2={138} stroke={RED} strokeWidth={3} />
      <He x={150} y={110} size={10.5} color={RED}>מעכב</He>
      <Arrow x1={225} y1={164} x2={225} y2={200} color={PURPLE} />
      <La x={240} y={186} size={10.5} anchor="start" color={PURPLE}>P</La>
      <LBox x={225} y={202} w={70} label="CheY-P" c={PURPLE} fill={FILL.purple} size={11.5} bold />
      <Arrow x1={225} y1={232} x2={225} y2={258} color={PURPLE} />
      <HBox x={225} y={260} w={170} label="מנוע: CW — התהפכות" c={ORANGE} fill={FILL.orange} size={11.5} />
      <LBox x={95} y={202} w={60} label="CheZ" c={GREEN} fill={FILL.green} />
      <Arrow x1={126} y1={216} x2={186} y2={216} color={GREEN} />
      <He x={95} y={248} size={10.5} color={GREEN}>מסלק את הזרחה</He>
      <LBox x={375} y={110} w={56} label="CheR" c={BLUE} fill={FILL.blue} />
      <LBox x={375} y={160} w={66} label="CheB-P" c={RED} fill={FILL.red} />
      <Arrow x1={346} y1={124} x2={244} y2={110} color={BLUE} />
      <Arrow x1={342} y1={172} x2={244} y2={124} color={RED} dashed />
      <He x={420} y={210} size={10.5} color={MUTED}>+ מתיל / − מתיל</He>
      <He x={420} y={226} size={10.5} color={MUTED}>= הסתגלות</He>
      <He x={240} y={302} size={11} color={MUTED}>יותר חומר מושך ← פחות CheY-P ← ריצות ארוכות יותר</He>
    </Svg>
  );
}

// ── mv-growth: growth curve ──────────────────────────────────────────────────
function GrowthCurve() {
  const s = scale(60, 450, 230, 40, 0, 24, 5, 11);
  const f = (t: number) => {
    if (t < 3) return 6;
    if (t < 11) return 6 + (t - 3) * 0.42;
    if (t < 13) return 9.36 + (t - 11) * 0.12 - (t - 11) ** 2 * 0.03;
    if (t < 18) return 9.5;
    return 9.5 - (t - 18) * 0.22;
  };
  const phases: [number, number, string][] = [[0, 3, "השהיה"], [3, 11, "מעריכית"], [11, 18, "נייחת"], [18, 24, "מוות"]];
  return (
    <Svg h={290} label="עקומת הגדילה של תרבית סגורה: שלב השהיה, שלב מעריכי שבו לוגריתם מספר התאים עולה בקו ישר, שלב נייח ושלב מוות">
      <Axes x0={60} y0={230} x1={450} y1={40} />
      <He x={255} y={270} size={12.5}>זמן</He>
      <He x={26} y={135} size={12} rotate={-90}>לוג מספר התאים החיים</He>
      {phases.slice(1).map(([a]) => <line key={a} x1={s.sx(a)} x2={s.sx(a)} y1={230} y2={50} stroke={MUTED} strokeWidth={1} {...dash} />)}
      {phases.map(([a, b, t]) => <He key={t} x={(s.sx(a) + s.sx(b)) / 2} y={62} size={12} bold color={BLUE}>{t}</He>)}
      <path d={curve(f, 0, 24, s)} fill="none" stroke={ORANGE} strokeWidth={3.2} />
      <He x={s.sx(7.5) + 40} y={s.sy(7.7) + 14} size={10.5} color={MUTED}>קו ישר בסקלה לוגריתמית</He>
    </Svg>
  );
}

// ── mv-environment: oxygen classes in thioglycolate tubes ───────────────────
function OxygenTubes() {
  const tubes: [string, number[]][] = [
    ["אירובי מחייב", [0, 0.06, 0.1]],
    ["אנאירובי מחייב", [0.8, 0.88, 0.95]],
    ["פקולטטיבי", [0.05, 0.1, 0.15, 0.25, 0.4, 0.55, 0.7, 0.85]],
    ["מיקרואירופיל", [0.2, 0.24, 0.28]],
    ["סובל אוויר", [0.1, 0.25, 0.4, 0.55, 0.7, 0.85]],
  ];
  const xs = [420, 330, 240, 150, 60];
  const top = 60, h = 180;
  return (
    <Svg h={290} label="חמש מבחנות תיוגליקולט: אירובי מחייב גדל רק בחלק העליון; אנאירובי מחייב רק בתחתית; פקולטטיבי לכל האורך עם יותר למעלה; מיקרואירופיל ברצועה קצת מתחת לפני השטח; סובל אוויר באופן אחיד לכל האורך">
      {tubes.map(([t, dots], i) => (
        <g key={t}>
          <rect x={xs[i] - 18} y={top} width={36} height={h} rx={14} fill="#fffbeb" stroke={MUTED} strokeWidth={1.4} />
          <rect x={xs[i] - 17} y={top + 2} width={34} height={22} fill={FILL.pink} />
          {dots.map((d, j) => (
            <circle key={j} cx={xs[i] + ((j % 3) - 1) * 9} cy={top + 10 + d * (h - 26)} r={i === 2 ? 5.5 - d * 3 : 4} fill={ORANGE} />
          ))}
          <He x={xs[i]} y={top + h + 22} size={11} bold>{t}</He>
        </g>
      ))}
      <He x={240} y={36} size={11} color={PINK}>אזור ורוד = חמצן (החומר המחווה מתחמצן)</He>
      <He x={240} y={282} size={10.5} color={MUTED}>סכמטי — צפיפות הנקודות מסמלת את כמות הגדילה</He>
    </Svg>
  );
}

// ── mv-antibiotics: targets ──────────────────────────────────────────────────
function AntibioticTargets() {
  return (
    <Svg h={320} label="מטרות האנטיביוטיקה בתא החיידקי: בניית הדופן (בטא-לקטמים, ונקומיצין), הממברנה (פולימיקסינים), הריבוזום 30S (אמינוגליקוזידים, טטרציקלינים) ו-50S (מקרולידים, כלורמפניקול), הג'ירז (קווינולונים), RNA פולימראז (ריפמפין) ובניית החומצה הפולית (סולפונמידים, טרימתופרים)">
      <rect x={100} y={60} width={280} height={190} rx={60} fill={FILL.orange} stroke={ORANGE} strokeWidth={5} />
      <rect x={110} y={70} width={260} height={170} rx={52} fill="#ffffff" stroke={MUTED} strokeWidth={2} />
      <path d="M180 150 C 200 120, 240 180, 260 140 S 300 120, 300 160" fill="none" stroke={PURPLE} strokeWidth={3} />
      <He x={290} y={186} size={10.5} color={PURPLE}>DNA</He>
      <circle cx={170} cy={200} r={12} fill={FILL.green} stroke={GREEN} /><circle cx={170} cy={216} r={8} fill={FILL.green} stroke={GREEN} />
      <rect x={300} y={100} width={30} height={18} rx={6} fill={FILL.blue} stroke={BLUE} />
      <He x={240} y={36} size={11.5} bold color={ORANGE}>דופן: בטא-לקטמים, ונקומיצין</He>
      <Arrow x1={240} y1={42} x2={240} y2={60} color={ORANGE} />
      <He x={50} y={130} size={11} color={MUTED}>ממברנה:</He>
      <He x={50} y={146} size={11} color={MUTED}>פולימיקסינים</He>
      <Arrow x1={70} y1={154} x2={108} y2={160} color={MUTED} />
      <He x={60} y={206} size={10.5} color={GREEN}>30S: אמינוגליקוזידים,</He>
      <He x={60} y={222} size={10.5} color={GREEN}>טטרציקלינים</He>
      <He x={60} y={250} size={10.5} color={GREEN}>50S: מקרולידים,</He>
      <He x={60} y={266} size={10.5} color={GREEN}>כלורמפניקול</He>
      <Arrow x1={118} y1={232} x2={158} y2={214} color={GREEN} />
      <He x={430} y={92} size={10.5} color={BLUE}>RNA פולימראז:</He>
      <He x={430} y={108} size={10.5} color={BLUE}>ריפמפין</He>
      <Arrow x1={400} y1={106} x2={334} y2={108} color={BLUE} />
      <He x={430} y={156} size={10.5} color={PURPLE}>ג'ירז:</He>
      <He x={430} y={172} size={10.5} color={PURPLE}>קווינולונים</He>
      <Arrow x1={400} y1={164} x2={304} y2={158} color={PURPLE} />
      <He x={430} y={226} size={10.5} color={RED}>חומצה פולית:</He>
      <He x={430} y={242} size={10.5} color={RED}>סולפונמידים,</He>
      <He x={430} y={258} size={10.5} color={RED}>טרימתופרים</He>
      <Arrow x1={392} y1={236} x2={330} y2={214} color={RED} />
      <He x={330} y={210} size={10} color={RED}>פולאט</He>
      <He x={240} y={300} size={11} color={MUTED}>כל מטרה — מבנה שקיים בחיידק ולא בתא האדם, או שונה בו</He>
    </Svg>
  );
}

// ── mv-metabolic-diversity: redox tower ──────────────────────────────────────
function RedoxTower() {
  const y = (v: number) => 50 + (v + 0.5) * 190;
  const couples: [number, string][] = [
    [-0.42, "2H⁺/H₂  −0.42"], [-0.32, "NAD⁺/NADH  −0.32"], [-0.24, "CO₂/CH₄  −0.24"], [-0.22, "SO₄²⁻/H₂S  −0.22"],
    [0.34, "NO₂⁻/NH₄⁺  +0.34"], [0.42, "NO₃⁻/NO₂⁻  +0.42"], [0.75, "NO₃⁻/½N₂  +0.75"], [0.76, "Fe³⁺/Fe²⁺  +0.76"], [0.82, "½O₂/H₂O  +0.82"],
  ];
  const LY = [-0.44, -0.33, -0.25, -0.17, 0.32, 0.43, 0.70, 0.77, 0.85];
  const ly = (i: number) => y(LY[i]) + 4;
  return (
    <Svg h={340} label="מגדל החיזור: זוגות חמצון-חיזור לפי E0' בוולט. למעלה זוגות שליליים, שהצורה המחוזרת שלהם תורמת אלקטרונים טוב (H2, NADH); למטה זוגות חיוביים, שהצורה המחומצנת שלהם מקבלת אלקטרונים טוב (O2, חנקה). ככל שהמרחק בין התורם למקבל גדול יותר, משתחררת יותר אנרגיה">
      <line x1={250} y1={y(-0.5)} x2={250} y2={y(0.88)} stroke={INK} strokeWidth={2} />
      {[-0.4, 0, 0.4, 0.8].map((v) => <g key={v}><line x1={244} x2={256} y1={y(v)} y2={y(v)} stroke={INK} /><La x={236} y={y(v) + 4} size={10.5} anchor="end" color={MUTED}>{v.toFixed(1)}</La></g>)}
      <La x={250} y={30} size={12} bold>E₀′ (V)</La>
      {couples.map(([v, t], i) => (
        <g key={t}>
          <line x1={252} x2={272} y1={y(v)} y2={ly(i) - 4} stroke={i < 4 ? BLUE : RED} strokeWidth={1.2} />
          <La x={276} y={ly(i)} size={11.5} anchor="start" color={i < 4 ? BLUE : RED} bold={i === 0 || i === 8}>{t}</La>
        </g>
      ))}
      <path d={`M120 ${y(-0.42)} L120 ${y(0.8)}`} stroke={ORANGE} strokeWidth={5} markerEnd="url(#bfArrowS)" />
      <He x={100} y={y(0.15)} size={12} bold color={ORANGE} rotate={-90}>זרימת אלקטרונים</He>
      <He x={150} y={y(-0.45)} size={11} color={BLUE}>תורמים טובים</He>
      <He x={150} y={y(0.86)} size={11} color={RED}>מקבלים טובים</He>
      <He x={240} y={332} size={11} color={MUTED}>ΔG°′ = −nFΔE₀′ — הפרש גדול = יותר אנרגיה</He>
    </Svg>
  );
}

// ── mv-nutrient-cycles: anoxic carbon food chain ────────────────────────────
function CarbonCycleAnoxic() {
  const steps: [string, string, string, string][] = [
    ["פולימרים", "צלולוז, חלבונים, שומנים", "הידרוליזה", ORANGE],
    ["מונומרים", "סוכרים, חומצות אמינו", "תוססים ראשוניים", ORANGE],
    ["חומצות שומן קצרות, אלכוהולים", "פרופיונט, בוטיראט, אתנול", "סינטרופים", PURPLE],
    ["אצטט + H₂ + CO₂", "", "מתנוגנים", GREEN],
    ["CH₄ (+ CO₂)", "", "", GREEN],
  ];
  return (
    <Svg h={360} label="שרשרת הפירוק האנאירובית: פולימרים עוברים הידרוליזה למונומרים; תוססים ראשוניים הופכים אותם לחומצות שומן קצרות ולאלכוהולים; סינטרופים הופכים אותם לאצטט, מימן ו-CO2; מתנוגנים מייצרים מתאן. מעל פני השטח, מתנוטרופים מחמצנים את המתאן ל-CO2">
      {steps.map(([m, sub, enz, c], i) => (
        <g key={m}>
          <HBox x={240} y={20 + i * 64} w={230} h={sub ? 36 : 28} label={m} c={c} fill={c === GREEN ? FILL.green : c === PURPLE ? FILL.purple : FILL.orange} size={12} bold />
          {sub && <He x={240} y={20 + i * 64 + 31} size={9.5} color={MUTED}>{sub}</He>}
          {enz && <><Arrow x1={240} y1={20 + i * 64 + (sub ? 38 : 30)} x2={240} y2={20 + (i + 1) * 64 - 2} color={INK} /><He x={250} y={20 + i * 64 + 54} size={10.5} anchor="start" color={c}>{enz}</He></>}
        </g>
      ))}
      <He x={420} y={170} size={10.5} color={PURPLE}>אפשרי רק כששותף</He>
      <He x={420} y={186} size={10.5} color={PURPLE}>צורכים את ה-H₂</He>
      <path d="M360 180 C 370 210, 370 230, 300 230" fill="none" stroke={PURPLE} strokeWidth={1.4} {...dash} />
      <path d="M125 290 C 70 250, 70 120, 110 60" fill="none" stroke={BLUE} strokeWidth={2} markerEnd="url(#bfArrow)" />
      <He x={62} y={175} size={10.5} color={BLUE} rotate={-90}>מתנוטרופים (עם O₂): CH₄ → CO₂</He>
    </Svg>
  );
}

// ── mv-nutrient-cycles: nitrogen cycle ───────────────────────────────────────
function NitrogenCycle() {
  const N: Record<string, [number, number, string]> = {
    n2: [240, 40, "N₂"], nh4: [90, 170, "NH₄⁺"], no2: [240, 270, "NO₂⁻"], no3: [390, 170, "NO₃⁻"], org: [90, 300, "N אורגני"], n2o: [390, 70, "NO, N₂O"],
  };
  const Node = ({ k, c }: { k: string; c: string }) => {
    const [x, yy, t] = N[k];
    return k === "org" ? <HBox x={x} y={yy - 14} w={84} label={t} c={c} fill={FILL.gray} size={12} bold /> : <LBox x={x} y={yy - 14} w={84} label={t} c={c} fill={FILL.gray} size={13} bold />;
  };
  return (
    <Svg h={340} label="מחזור החנקן: קיבוע הופך N2 לאמוניום; ניטריפיקציה מחמצנת אמוניום לניטריט ולחנקה; דניטריפיקציה מחזרת חנקה דרך NO ו-N2O ל-N2; אנמוקס מחבר אמוניום וניטריט ל-N2; DNRA מחזר חנקה לאמוניום; אמוניפיקציה מפרקת חנקן אורגני לאמוניום, והטמעה בונה ממנו חנקן אורגני">
      <Arrow x1={200} y1={44} x2={110} y2={150} color={BLUE} width={2.4} />
      <He x={130} y={86} size={11} bold color={BLUE}>קיבוע</He>
      <Arrow x1={110} y1={190} x2={200} y2={260} color={ORANGE} width={2.4} />
      <Arrow x1={280} y1={260} x2={370} y2={190} color={ORANGE} width={2.4} />
      <He x={130} y={238} size={11} bold color={ORANGE}>ניטריפיקציה</He>
      <He x={350} y={238} size={11} bold color={ORANGE}>ניטריפיקציה</He>
      <Arrow x1={390} y1={154} x2={390} y2={90} color={RED} width={2.4} />
      <Arrow x1={348} y1={60} x2={284} y2={46} color={RED} width={2.4} />
      <He x={430} y={124} size={11} bold color={RED}>דניטריפיקציה</He>
      <Arrow x1={140} y1={170} x2={226} y2={58} color={PURPLE} dashed />
      <Arrow x1={232} y1={254} x2={236} y2={58} color={PURPLE} dashed />
      <He x={196} y={150} size={11} bold color={PURPLE}>אנמוקס</He>
      <Arrow x1={346} y1={166} x2={134} y2={166} color={GREEN} dashed />
      <La x={290} y={160} size={11} bold color={GREEN}>DNRA</La>
      <Arrow x1={70} y1={286} x2={70} y2={186} color={MUTED} />
      <He x={34} y={240} size={10.5} color={MUTED}>אמוניפיקציה</He>
      <Arrow x1={110} y1={186} x2={110} y2={284} color={MUTED} dashed />
      <He x={150} y={300} size={10.5} color={MUTED} anchor="start">הטמעה</He>
      {Object.keys(N).map((k) => <Node key={k} k={k} c={k === "n2" ? BLUE : INK} />)}
      <He x={360} y={326} size={10.5} color={MUTED}>מימין — אנאירובי (חוץ מניטריפיקציה)</He>
    </Svg>
  );
}

// ── mv-ecology: biofilm stages ───────────────────────────────────────────────
function BiofilmStages() {
  const xs = [420, 330, 240, 150, 60];
  const t: [string, string][] = [["1. היצמדות", "הפיכה"], ["2. היצמדות", "קבועה"], ["3. מיקרו-", "מושבה"], ["4. ביופילם", "בוגר ומטריקס"], ["5. התפזרות", ""]];
  return (
    <Svg h={250} label="שלבי הביופילם: היצמדות הפיכה של תאים בודדים למשטח, היצמדות קבועה, היווצרות מיקרו-מושבות, ביופילם בוגר עטוף מטריקס עם תעלות מים, והתפזרות של תאים שוחים שמאכלסים משטחים חדשים">
      <rect x={10} y={180} width={460} height={14} fill={FILL.gray} stroke={MUTED} />
      <He x={240} y={212} size={10.5} color={MUTED}>משטח</He>
      <Rod x={xs[0]} y={150} fill={FILL.blue} stroke={BLUE} />
      <Rod x={xs[1]} y={172} fill={FILL.blue} stroke={BLUE} /><Rod x={xs[1] + 22} y={172} w={30} fill={FILL.blue} stroke={BLUE} />
      <ellipse cx={xs[2]} cy={164} rx={30} ry={16} fill={FILL.yellow} stroke={ORANGE} />
      {[-14, 0, 14].map((d) => <Rod key={d} x={xs[2] + d} y={166} w={14} h={8} fill={FILL.blue} stroke={BLUE} />)}
      <path d={`M${xs[3] - 40} 180 Q ${xs[3] - 36} 90 ${xs[3] - 10} 100 Q ${xs[3]} 140 ${xs[3] + 6} 100 Q ${xs[3] + 34} 80 ${xs[3] + 40} 180 Z`} fill={FILL.yellow} stroke={ORANGE} />
      {[[-24, 160], [-16, 130], [16, 120], [24, 156], [-4, 170]].map(([dx, yy], i) => <Rod key={i} x={xs[3] + dx} y={yy} w={14} h={8} fill={FILL.blue} stroke={BLUE} />)}
      <path d={`M${xs[4] - 26} 180 Q ${xs[4] - 22} 110 ${xs[4]} 120 Q ${xs[4] + 22} 110 ${xs[4] + 26} 180 Z`} fill={FILL.yellow} stroke={ORANGE} />
      <Rod x={xs[4] - 14} y={70} w={20} h={9} fill={FILL.blue} stroke={BLUE} /><Rod x={xs[4] + 18} y={84} w={20} h={9} fill={FILL.blue} stroke={BLUE} />
      <Arrow x1={xs[4] - 4} y1={112} x2={xs[4] - 12} y2={80} color={BLUE} />
      {t.map(([a, b], i) => <g key={a}><He x={xs[i]} y={30} size={11} bold>{a}</He><He x={xs[i]} y={46} size={11} bold>{b}</He></g>)}
      <He x={240} y={238} size={10.5} color={MUTED}>המטריקס: פוליסכרידים, חלבונים ו-DNA חוץ-תאי · מעבר לביופילם נשלט גם בחישת מניין</He>
    </Svg>
  );
}

// ── mv-ecology: quorum sensing (lux) ─────────────────────────────────────────
function QuorumSensingLux() {
  const Cell = ({ x, y, lit }: { x: number; y: number; lit: boolean }) => (
    <g>
      <rect x={x - 22} y={y - 11} width={44} height={22} rx={11} fill={lit ? "#fef08a" : FILL.gray} stroke={lit ? ORANGE : MUTED} strokeWidth={1.3} />
      {lit && <circle cx={x} cy={y} r={24} fill="none" stroke="#facc15" strokeWidth={2} {...dash} />}
    </g>
  );
  const sig = (x: number, y: number) => <circle cx={x} cy={y} r={3.5} fill={RED} />;
  return (
    <Svg h={300} label="חישת מניין במערכת lux: כל תא מייצר את האות AHL באנזים LuxI, והאות מתפזר דרך הממברנה. בצפיפות נמוכה ריכוז האות נמוך ואין אור. בצפיפות גבוהה האות מצטבר, נקשר ל-LuxR, והקומפלקס מפעיל את אופרון lux, ולכן התאים מאירים">
      <He x={360} y={24} size={12.5} bold>צפיפות נמוכה</He>
      <Cell x={330} y={80} lit={false} /><Cell x={410} y={130} lit={false} />
      {sig(380, 70)}{sig(300, 130)}{sig(440, 90)}
      <He x={360} y={176} size={11} color={MUTED}>מעט AHL — אין אור</He>
      <He x={120} y={24} size={12.5} bold>צפיפות גבוהה</He>
      {[[70, 60], [130, 56], [190, 70], [80, 110], [150, 106], [205, 120], [110, 150], [180, 156]].map(([x, yy], i) => <Cell key={i} x={x} y={yy} lit />)}
      {[[100, 80], [160, 84], [55, 135], [130, 130], [200, 95], [145, 175], [95, 180], [215, 145]].map(([x, yy], i) => <g key={i}>{sig(x, yy)}</g>)}
      <He x={130} y={200} size={11} color={ORANGE}>AHL מצטבר — אור</He>
      <line x1={10} y1={214} x2={470} y2={214} stroke={LINE_GRAY} />
      <LBox x={410} y={228} w={60} label="LuxI" c={GREEN} fill={FILL.green} />
      <Arrow x1={378} y1={242} x2={334} y2={242} color={RED} />
      <La x={310} y={246} size={11.5} bold color={RED}>AHL</La>
      <Arrow x1={286} y1={242} x2={244} y2={242} color={RED} />
      <LBox x={210} y={228} w={66} label="LuxR" c={BLUE} fill={FILL.blue} />
      <Arrow x1={174} y1={242} x2={128} y2={242} color={BLUE} />
      <LBox x={80} y={228} w={90} label="luxCDABE" c={ORANGE} fill={FILL.yellow} />
      <He x={80} y={276} size={10.5} color={ORANGE}>לוציפראז — אור</He>
      <He x={240} y={294} size={10.5} color={MUTED}>LuxI מקודד גם הוא באופרון — משוב חיובי</He>
    </Svg>
  );
}

// ── mv-viruses: Baltimore classes ────────────────────────────────────────────
function BaltimoreClasses() {
  const cls: [string, string, string, number, number][] = [
    ["I", "dsDNA", "שעתוק", 400, 40],
    ["II", "ssDNA", "הופך ל-dsDNA, ואז שעתוק", 400, 100],
    ["VII", "dsDNA (שלב RNA)", "שעתוק", 400, 160],
    ["III", "dsRNA", "פולימראז ויראלי", 80, 40],
    ["IV", "+ssRNA", "הגנום הוא mRNA", 80, 100],
    ["V", "−ssRNA", "פולימראז ויראלי", 80, 160],
    ["VI", "ssRNA (רטרו)", "רוורס טרנסקריפטאז", 80, 220],
  ];
  return (
    <Svg h={300} label="סיווג בלטימור: שבע קבוצות נגיפים לפי סוג הגנום והדרך שבה כל אחד מגיע ל-mRNA. נגיפי DNA (I, II, VII) עוברים שעתוק; dsRNA ו-RNA שלילי מועתקים בפולימראז ויראלי; RNA חיובי הוא עצמו ה-mRNA; רטרו-וירוסים הופכים קודם ל-DNA בעזרת רוורס טרנסקריפטאז">
      <ellipse cx={240} cy={150} rx={56} ry={26} fill={FILL.yellow} stroke={ORANGE} strokeWidth={2} />
      <La x={240} y={155} size={14} bold color={ORANGE}>+mRNA</La>
      {cls.map(([n, g, how, x, yy]) => {
        const right = x > 240;
        return (
          <g key={n}>
            <rect x={x - 70} y={yy} width={140} height={36} rx={8} fill={g.includes("DNA") ? FILL.blue : FILL.purple} stroke={g.includes("DNA") ? BLUE : PURPLE} />
            <La x={right ? x + 62 : x - 62} y={yy + 15} size={11} anchor={right ? "end" : "start"} bold color={INK}>{n}</La>
            <La x={x} y={yy + 15} size={11.5} bold color={g.includes("DNA") ? BLUE : PURPLE}>{g.replace(/ \(.*\)/, "")}</La>
            <He x={x} y={yy + 30} size={9.5} color={MUTED}>{g.includes("(") ? g.replace(/^[^(]*\(|\)$/g, "") + " · " + how : how}</He>
            <Arrow x1={right ? x - 72 : x + 72} y1={yy + 18} x2={right ? 296 : 184} y2={150 + (yy - 130) * 0.15} color={MUTED} />
          </g>
        );
      })}
      <He x={400} y={240} size={10.5} color={MUTED}>נגיפי RNA (III–V) צריכים RNA פולימראז</He>
      <He x={400} y={256} size={10.5} color={MUTED}>תלוי-RNA משלהם — אין כזה בתא</He>
      <He x={240} y={292} size={10.5} color={MUTED}>VI ו-VII משתמשים ברוורס טרנסקריפטאז</He>
    </Svg>
  );
}

// ── mv-viruses: one-step growth curve ────────────────────────────────────────
function OneStepGrowth() {
  const s = scale(60, 450, 230, 40, 0, 50, 0, 3);
  const free = (t: number) => (t < 25 ? 0.15 : t < 38 ? 0.15 + ((t - 25) / 13) * 2.45 : 2.6);
  const inside = (t: number) => (t < 12 ? 0 : t < 25 ? ((t - 12) / 13) * 2.4 : t < 38 ? 2.4 + ((t - 25) / 13) * 0.2 : 2.6);
  return (
    <Svg h={290} label="עקומת גדילה בצעד אחד: מספר חלקיקי הנגיף החופשיים נשאר נמוך בתקופה הסמויה ואז עולה בחדות כשהתאים מתפרקים. סך החלקיקים המדבקים, כשמפרקים את התאים במכוון, נשאר אפס בשלב הליקוי ועולה לפני השחרור. גודל הפריצה הוא מספר הצאצאים לכל תא שהודבק">
      <Axes x0={60} y0={230} x1={450} y1={40} />
      <He x={255} y={270} size={12.5}>זמן אחרי ההדבקה (דקות)</He>
      <He x={26} y={135} size={12} rotate={-90}>לוג חלקיקים מדבקים</He>
      <path d={curve(free, 0, 50, s)} fill="none" stroke={ORANGE} strokeWidth={3} />
      <path d={curve(inside, 0, 50, s)} fill="none" stroke={BLUE} strokeWidth={2.2} {...dash} />
      <line x1={s.sx(12)} x2={s.sx(12)} y1={230} y2={60} stroke={MUTED} strokeWidth={1} {...dash} />
      <line x1={s.sx(25)} x2={s.sx(25)} y1={230} y2={60} stroke={MUTED} strokeWidth={1} {...dash} />
      <He x={(s.sx(0) + s.sx(12)) / 2} y={56} size={11.5} bold color={BLUE}>ליקוי</He>
      <He x={(s.sx(0) + s.sx(25)) / 2} y={78} size={11.5} bold color={ORANGE}>תקופה סמויה</He>
      <He x={s.sx(31)} y={56} size={11.5} bold>שחרור</He>
      <path d={`M${s.sx(44)} ${s.sy(0.2)} L${s.sx(44)} ${s.sy(2.55)}`} stroke={GREEN} strokeWidth={2} markerEnd="url(#bfArrowS)" markerStart="url(#bfArrowS)" />
      <He x={s.sx(44) - 8} y={s.sy(1.4)} size={11} anchor="end" bold color={GREEN}>גודל הפריצה</He>
      <He x={s.sx(16)} y={s.sy(0.15) - 8} size={10.5} color={ORANGE}>חופשיים</He>
      <He x={s.sx(18)} y={s.sy(1.7)} size={10.5} color={BLUE}>סך הכול (אחרי פירוק)</He>
    </Svg>
  );
}

// ── mv-phages: lambda decision ───────────────────────────────────────────────
function LambdaSwitch() {
  return (
    <Svg h={330} label="המתג של פאג' למדא: אחרי ההדבקה רמת CII מכריעה. כש-CII מצטבר (תאים רעבים, הרבה פאג'ים לתא) הוא מפעיל את CI ואת האינטגראז, והפאג' משתלב כפרופאג' — ליזוגניה. כש-CII מפורק בפרוטאזות של המאכסן, Cro גובר והפאג' נכנס למחזור ליטי. נזק ל-DNA מפעיל את RecA, שגורם ל-CI לחתוך את עצמו, והפרופאג' יוצא — השראה">
      <HBox x={240} y={14} w={200} label="הדבקה: הגנום נכנס ונסגר למעגל" c={INK} fill={FILL.gray} size={11.5} />
      <Arrow x1={240} y1={44} x2={240} y2={70} />
      <HBox x={240} y={72} w={170} label="כמה CII מצטבר?" c={PURPLE} fill={FILL.purple} size={12} bold />
      <Arrow x1={320} y1={100} x2={370} y2={140} color={GREEN} />
      <Arrow x1={160} y1={100} x2={110} y2={140} color={RED} />
      <He x={410} y={108} size={10.5} color={GREEN}>הרבה: רעב / הרבה פאג'ים</He>
      <He x={70} y={108} size={10.5} color={RED}>מעט: מאכסן בריא</He>
      <HBox x={370} y={142} w={170} label="CI + אינטגראז" c={GREEN} fill={FILL.green} size={12} />
      <HBox x={110} y={142} w={170} label="Cro גובר על CI" c={RED} fill={FILL.red} size={12} />
      <Arrow x1={370} y1={172} x2={370} y2={200} color={GREEN} />
      <Arrow x1={110} y1={172} x2={110} y2={200} color={RED} />
      <HBox x={370} y={202} w={170} h={40} label="ליזוגניה: פרופאג'" c={GREEN} fill={FILL.green} size={12.5} bold />
      <He x={370} y={258} size={10.5} color={MUTED}>CI מדכא את גני הליזיס</He>
      <HBox x={110} y={202} w={170} h={40} label="מחזור ליטי: פריצה" c={RED} fill={FILL.red} size={12.5} bold />
      <path d="M300 236 C 260 290, 200 290, 160 246" fill="none" stroke={ORANGE} strokeWidth={2} markerEnd="url(#bfArrow)" />
      <He x={230} y={302} size={11} bold color={ORANGE}>השראה: נזק ל-DNA ← RecA ← CI נחתך</He>
      <He x={230} y={320} size={10.5} color={MUTED}>הפרופאג' יוצא (Int + Xis) ונכנס למחזור ליטי</He>
    </Svg>
  );
}

// ── mv-gene-transfer: F and Hfr conjugation ─────────────────────────────────
function ConjugationHfr() {
  const Cell = ({ x, y, label, c }: { x: number; y: number; label: string; c: string }) => (
    <g>
      <rect x={x - 50} y={y - 24} width={100} height={48} rx={24} fill={FILL.gray} stroke={c} strokeWidth={1.6} />
      <La x={x} y={y + 40} size={12} bold color={c}>{label}</La>
    </g>
  );
  return (
    <Svg h={330} label="קוניוגציה: תא F+ מעביר עותק של הפלסמיד F לתא F-, ושני התאים יוצאים F+. בזן Hfr הפלסמיד משולב בכרומוזום; ההעברה מתחילה ב-oriT ומושכת את הכרומוזום גן אחר גן, ובדרך כלל נקטעת לפני ש-F עובר, ולכן המקבל נשאר F- ומקבל רק את הגנים הקרובים ל-oriT">
      <La x={240} y={22} size={13} bold>F⁺ × F⁻</La>
      <Cell x={360} y={70} label="F⁺" c={BLUE} />
      <circle cx={360} cy={70} r={11} fill="none" stroke={ORANGE} strokeWidth={2.5} />
      <line x1={310} y1={70} x2={250} y2={70} stroke={MUTED} strokeWidth={3} />
      <Cell x={200} y={70} label="F⁻" c={MUTED} />
      <Arrow x1={300} y1={80} x2={258} y2={80} color={ORANGE} />
      <He x={100} y={66} size={11} color={MUTED}>שני התאים</He>
      <La x={100} y={84} size={12} bold color={BLUE}>F⁺</La>
      <line x1={10} y1={130} x2={470} y2={130} stroke={LINE_GRAY} />
      <La x={240} y={156} size={13} bold>Hfr × F⁻</La>
      <Cell x={360} y={210} label="Hfr" c={BLUE} />
      <ellipse cx={360} cy={210} rx={34} ry={14} fill="none" stroke={PURPLE} strokeWidth={2} />
      <rect x={322} y={202} width={10} height={16} fill={ORANGE} />
      <line x1={310} y1={210} x2={250} y2={210} stroke={MUTED} strokeWidth={3} />
      <Cell x={200} y={210} label="F⁻" c={MUTED} />
      <path d="M300 220 L170 220" stroke={PURPLE} strokeWidth={3} />
      {[["a", 176], ["b", 206], ["c", 236], ["d", 280]].map(([g, x]) => <La key={g} x={x as number} y={236} size={11} bold color={PURPLE}>{g}</La>)}
      <La x={330} y={196} size={10} color={ORANGE}>oriT</La>
      <He x={240} y={276} size={11} color={PURPLE}>הגנים נכנסים לפי הסדר: a ראשון, ואחר כך b, c…</He>
      <He x={240} y={296} size={11} color={MUTED}>ההעברה נקטעת לפני ששאר F עובר — המקבל נשאר F⁻</He>
      <He x={240} y={316} size={11} color={MUTED}>זמן הכניסה של כל גן = מיקומו (בדקות)</He>
    </Svg>
  );
}

// ── mv-evolution: tree of life ───────────────────────────────────────────────
function TreeOfLife() {
  return (
    <Svg h={320} label="עץ החיים לפי rRNA: השורש בין חיידקים לארכאונים; האאוקריוטים מסתעפים מתוך הקו הארכאוני. המיטוכונדריה מקורה בפרוטאובקטריה והכלורופלסטים בציאנובקטריה — חיצים מקווקווים מסמנים את האנדוסימביוזות">
      <circle cx={240} cy={280} r={6} fill={INK} />
      <He x={240} y={308} size={11} bold>LUCA</He>
      <path d="M240 280 L110 160" stroke={BLUE} strokeWidth={4} fill="none" />
      <path d="M240 280 L350 190" stroke={GREEN} strokeWidth={4} fill="none" />
      {[[110, 160, 60, 60], [110, 160, 110, 50], [110, 160, 160, 60]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={BLUE} strokeWidth={3} />)}
      <He x={110} y={24} size={13} bold color={BLUE}>חיידקים</He>
      <He x={60} y={50} size={10} color={BLUE}>ציאנובקטריה</He>
      <He x={160} y={50} size={10} color={BLUE}>פרוטאובקטריה</He>
      <path d="M350 190 L300 80" stroke={GREEN} strokeWidth={3} />
      <path d="M350 190 L390 140" stroke={GREEN} strokeWidth={3} />
      <path d="M390 140 L430 60" stroke={PURPLE} strokeWidth={4} />
      <path d="M390 140 L360 70" stroke={GREEN} strokeWidth={3} />
      <He x={330} y={60} size={13} bold color={GREEN}>ארכאונים</He>
      <He x={440} y={44} size={13} bold color={PURPLE}>אאוקריוטים</He>
      <path d="M170 60 C 260 20, 380 30, 420 70" fill="none" stroke={ORANGE} strokeWidth={1.6} markerEnd="url(#bfArrow)" {...dash} />
      <He x={290} y={28} size={10.5} color={ORANGE}>מיטוכונדריה</He>
      <path d="M60 64 C 100 120, 330 150, 412 110" fill="none" stroke={GREEN} strokeWidth={1.6} markerEnd="url(#bfArrow)" {...dash} />
      <He x={220} y={142} size={10.5} color={GREEN}>כלורופלסט (בצמחים ובאצות)</He>
      <He x={400} y={300} size={10} color={MUTED}>אורכי הענפים אינם בקנה מידה</He>
    </Svg>
  );
}

// ── mv-immunology: antibody structure ────────────────────────────────────────
function AntibodyStructure() {
  const arm = (dir: 1 | -1) => {
    const x0 = 240, y0 = 150;
    const hx = x0 + dir * 110, hy = 40;
    return (
      <g>
        <line x1={x0 + dir * 8} y1={y0} x2={hx} y2={hy} stroke={BLUE} strokeWidth={14} strokeLinecap="round" />
        <line x1={x0 + dir * 34} y1={y0 + 6} x2={hx + dir * 26} y2={hy + 18} stroke={GREEN} strokeWidth={12} strokeLinecap="round" />
        <line x1={hx - dir * 22} y1={hy + 24} x2={hx} y2={hy} stroke={ORANGE} strokeWidth={14} strokeLinecap="round" opacity={0.75} />
        <line x1={hx + dir * 4} y1={hy + 40} x2={hx + dir * 26} y2={hy + 18} stroke={ORANGE} strokeWidth={12} strokeLinecap="round" opacity={0.75} />
      </g>
    );
  };
  return (
    <Svg h={320} label="מבנה הנוגדן: שתי שרשראות כבדות (כחול) ושתי שרשראות קלות (ירוק) בצורת Y, מחוברות בקשרי דיסולפיד. בקצה כל זרוע האזורים המשתנים (כתום) של שרשרת כבדה ושל שרשרת קלה יוצרים אתר קישור לאנטיגן. הגבעול, אזור Fc, קבוע וקובע את תפקיד הנוגדן">
      {arm(-1)}{arm(1)}
      <line x1={232} y1={150} x2={232} y2={270} stroke={BLUE} strokeWidth={14} strokeLinecap="round" />
      <line x1={248} y1={150} x2={248} y2={270} stroke={BLUE} strokeWidth={14} strokeLinecap="round" />
      {[160, 172].map((y) => <line key={y} x1={225} x2={255} y1={y} y2={y} stroke={RED} strokeWidth={2.5} />)}
      <He x={286} y={170} size={10.5} anchor="start" color={RED}>קשרי S–S (ציר)</He>
      <circle cx={130} cy={34} r={9} fill={FILL.red} stroke={RED} />
      <circle cx={350} cy={34} r={9} fill={FILL.red} stroke={RED} />
      <He x={100} y={22} size={11} bold color={ORANGE}>אתר קישור</He>
      <He x={380} y={22} size={11} bold color={ORANGE}>אתר קישור</He>
      <He x={60} y={110} size={11} color={GREEN}>שרשרת קלה</He>
      <He x={140} y={130} size={11} color={BLUE}>שרשרת כבדה</He>
      <He x={420} y={100} size={11} color={ORANGE}>אזורים משתנים</He>
      <He x={420} y={116} size={11} color={ORANGE}>(V, עם CDRs)</He>
      <La x={290} y={240} size={13} bold color={BLUE} anchor="start">Fc</La>
      <He x={340} y={262} size={10.5} color={MUTED}>קבוע במחלקה — קובע את התפקיד</He>
      <La x={240} y={306} size={11} color={MUTED}>Fab — Fab</La>
    </Svg>
  );
}

// ── mv-immunology: primary vs secondary response ────────────────────────────
function PrimarySecondaryResponse() {
  const s = scale(60, 450, 230, 40, 0, 60, 0, 10);
  const g = (t: number, t0: number, peak: number, rise: number, decay: number) => (t < t0 ? 0 : t < t0 + rise ? (peak * (t - t0)) / rise : peak * Math.exp(-(t - t0 - rise) / decay));
  const igm = (t: number) => g(t, 5, 1.4, 6, 6) + g(t, 33, 0.8, 4, 4);
  const igg = (t: number) => g(t, 8, 1.2, 8, 14) + (t > 31 ? g(t, 31, 8.4, 6, 40) : 0);
  return (
    <Svg h={290} label="תגובה ראשונית ושניונית: אחרי החשיפה הראשונה ביום 0, נוגדנים מופיעים אחרי כשבוע, בעיקר IgM וברמה נמוכה. אחרי חשיפה שנייה לאותו אנטיגן ביום 30, העלייה מהירה, גבוהה פי כמה, בעיקר IgG, ונמשכת זמן רב">
      <Axes x0={60} y0={230} x1={450} y1={40} />
      <He x={420} y={262} size={12.5}>ימים</He>
      <He x={26} y={135} size={12} rotate={-90}>רמת הנוגדנים בדם</He>
      {[0, 30].map((d) => <g key={d}><Arrow x1={s.sx(d)} y1={250} x2={s.sx(d)} y2={234} color={RED} /><La x={s.sx(d)} y={262} size={11} color={RED}>{String(d)}</La></g>)}
      <path d={curve(igm, 0, 60, s)} fill="none" stroke={ORANGE} strokeWidth={2.6} />
      <path d={curve(igg, 0, 60, s)} fill="none" stroke={BLUE} strokeWidth={3} />
      <La x={s.sx(12)} y={s.sy(1.4) - 8} size={11.5} bold color={ORANGE}>IgM</La>
      <La x={s.sx(40)} y={s.sy(8.4) - 6} size={11.5} bold color={BLUE}>IgG</La>
      <He x={s.sx(10)} y={s.sy(4)} size={11.5} bold>ראשונית</He>
      <He x={s.sx(50)} y={s.sy(9.6)} size={11.5} bold>שניונית</He>
      <He x={s.sx(15)} y={s.sy(3.1)} size={10} color={MUTED}>(עקומות מודגמות)</He>
    </Svg>
  );
}

// ── mv-clinical: stages of infection ────────────────────────────────────────
function InfectionStages() {
  const steps: [string, string][] = [
    ["כניסה", "רירית, פצע, עקיצה, צנתר"],
    ["היצמדות", "אדהזינים ← קולטנים"],
    ["התיישבות", "התרבות, ברזל (סידרופורים)"],
    ["חדירה", "אנזימים מפרקי רקמה"],
    ["התחמקות", "קופסית, שינוי אנטיגנים"],
    ["נזק", "רעלנים או התגובה החיסונית"],
  ];
  return (
    <Svg h={320} label="שלבי ההדבקה: כניסה, היצמדות באדהזינים, התיישבות והתרבות, חדירה לרקמות, התחמקות ממערכת החיסון, ונזק — מרעלנים או מהתגובה החיסונית">
      {steps.map(([t, sub], i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const x = col === 0 ? 350 : 130, y = 20 + row * 100;
        return (
          <g key={t}>
            <rect x={x - 95} y={y} width={190} height={58} rx={10} fill={i === 5 ? FILL.red : FILL.blue} stroke={i === 5 ? RED : BLUE} strokeWidth={1.5} />
            <He x={x} y={y + 24} size={13} bold>{`${i + 1}. ${t}`}</He>
            <He x={x} y={y + 44} size={10.5} color={MUTED}>{sub}</He>
            {col === 0 && <Arrow x1={x - 98} y1={y + 29} x2={x - 120} y2={y + 29} />}
            {col === 1 && i < 5 && <path d={`M${x} ${y + 60} C ${x} ${y + 84}, 350 ${y + 70}, 350 ${y + 98}`} fill="none" stroke={INK} strokeWidth={1.8} markerEnd="url(#bfArrow)" />}
          </g>
        );
      })}
    </Svg>
  );
}

// ── mv-endospores: layers of the endospore ──────────────────────────────────
function EndospereStructure() {
  const cx = 196, cy = 148;
  const layers: [number, number, string, string, string][] = [
    [148, 86, FILL.gray, MUTED, "אקסוספוריום"],
    [128, 74, "#fef9c3", ORANGE, "מעטה"],
    [108, 62, FILL.sky, BLUE, "ממברנה חיצונית"],
    [92, 52, FILL.orange, ORANGE, "קורטקס"],
    [72, 40, FILL.blue, BLUE, "ממברנה פנימית"],
    [58, 32, FILL.green, GREEN, "ליבה"],
  ];
  // A legend instead of leader lines: in a concentric drawing every leader to an inner layer
  // would have to cut across the outer ones. The colours carry the mapping.
  const ly = [52, 82, 112, 142, 172, 202];
  return (
    <Svg h={300} label="שכבות האנדוספורה מבפנים החוצה: ליבה ובה DNA, ריבוזומים, סידן-DPA וחלבוני SASP; ממברנה פנימית; קורטקס של פפטידוגליקן; ממברנה חיצונית; מעטה חלבוני; ובחלק מהמינים גם אקסוספוריום">
      {layers.map(([rx, ry, fill, stroke, label], i) => (
        <g key={label}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth={1.6} />
          <rect x={436} y={ly[i]} width={16} height={16} rx={3} fill={fill} stroke={stroke} strokeWidth={1.4} />
          <He x={426} y={ly[i] + 13} size={11.5} anchor="end" bold color={stroke}>{label}</He>
        </g>
      ))}
      <La x={cx} y={cy - 4} size={10.5} color={INK}>DNA · SASP</La>
      <La x={cx} y={cy + 14} size={10.5} color={INK}>Ca–DPA</La>
      <He x={452} y={34} size={10.5} anchor="end" color={MUTED}>מבחוץ פנימה ↓</He>
      <He x={426} y={ly[5] + 34} size={10.5} anchor="end" color={MUTED}>בליבה 10–25% מים בלבד</He>
      <He x={160} y={282} size={10.5} color={MUTED}>הממברנה החיצונית של הספורה אינה זו של גראם-שליליים</He>
    </Svg>
  );
}

// ── mv-endospores: the sporulation cycle ────────────────────────────────────
function SporulationCycle() {
  const xs = [410, 300, 190, 80];
  const Cell = ({ x, y }: { x: number; y: number }) => <rect x={x - 46} y={y - 20} width={92} height={40} rx={20} fill={FILL.gray} stroke={INK} strokeWidth={1.5} />;
  const t: [string, string][] = [["1. חלוקה", "א-סימטרית"], ["2. בליעה", "בתוך תא האם"], ["3. קורטקס", "ומעטה"], ["4. שחרור", "תא האם מתפרק"]];
  return (
    <Svg h={344} label="מחזור הספורולציה: חלוקה א-סימטרית שיוצרת פורספורה קטנה ותא אם גדול; בליעת הפורספורה בתוך תא האם; בניית הקורטקס והמעטה והבשלה; ופירוק תא האם ששחרר את האנדוספורה הבשלה. הנביטה מחזירה את האנדוספורה לתא פעיל">
      {t.map(([a, b], i) => (<g key={a}><He x={xs[i]} y={28} size={12} bold>{a}</He><He x={xs[i]} y={44} size={11} color={MUTED}>{b}</He></g>))}
      <Cell x={xs[0]} y={100} />
      <line x1={xs[0] + 16} y1={82} x2={xs[0] + 16} y2={118} stroke={INK} strokeWidth={2} />
      <ellipse cx={xs[0] + 30} cy={100} rx={13} ry={16} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <He x={410} y={150} size={10.5} color={MUTED}>תא אם + <tspan fill={GREEN} fontWeight={700}>פורספורה</tspan></He>
      <Cell x={xs[1]} y={100} />
      <ellipse cx={xs[1] + 14} cy={100} rx={15} ry={17} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <ellipse cx={xs[1] + 14} cy={100} rx={20} ry={22} fill="none" stroke={BLUE} strokeWidth={1.4} />
      <Cell x={xs[2]} y={100} />
      <ellipse cx={xs[2] + 10} cy={100} rx={22} ry={24} fill={FILL.orange} stroke={ORANGE} strokeWidth={1.6} />
      <ellipse cx={xs[2] + 10} cy={100} rx={14} ry={16} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <ellipse cx={xs[3]} cy={100} rx={26} ry={28} fill={FILL.yellow} stroke={ORANGE} strokeWidth={2} />
      <ellipse cx={xs[3]} cy={100} rx={15} ry={17} fill={FILL.green} stroke={GREEN} strokeWidth={1.4} />
      <He x={xs[3]} y={150} size={10.5} bold color={ORANGE}>אנדוספורה בשלה</He>
      {[0, 1, 2].map((i) => <Arrow key={i} x1={xs[i] - 50} y1={100} x2={xs[i + 1] + 50} y2={100} color={INK} width={2.2} />)}
      <He x={222} y={186} size={11} color={MUTED}>כ-8 שעות · מעל 200 גנים · Spo0A ואחריו σF, σE, σG, σK</He>
      {/* the cycle closes below: each arrow runs from one caption to the next, never from the drawings */}
      <path d="M80 164 C 78 230, 132 264, 194 264" fill="none" stroke={GREEN} strokeWidth={2.2} markerEnd="url(#bfArrow)" />
      <Rod x={240} y={264} w={78} h={32} fill={FILL.gray} />
      <He x={240} y={269} size={11} bold>תא פעיל</He>
      <path d="M284 258 C 372 258, 452 240, 452 198 C 452 180, 436 170, 418 166" fill="none" stroke={MUTED} strokeWidth={1.8} markerEnd="url(#bfArrow)" {...dash} />
      <He x={430} y={226} size={10.5} anchor="end" color={MUTED}>רעב ← ספורולציה</He>
      <He x={150} y={310} size={11} bold color={GREEN}>נביטה: הפעלה ← נביטה ← התפתחות (דקות)</He>
      <He x={240} y={332} size={10.5} color={MUTED}>בנביטה אובדת העמידות לחום ולכימיקלים</He>
    </Svg>
  );
}

export const MICRO_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "endospore-structure": { el: EndospereStructure, captionHe: "שכבות האנדוספורה. העמידות לחום נובעת מהליבה — מעט מים, קומפלקס סידן-DPA ו-SASP שנקשרים ל-DNA; המעטה חוסם אנזימים וכימיקלים, והממברנה הפנימית חוסמת מולקולות קטנות. סכמטי, לא בקנה מידה." },
  "sporulation-cycle": { el: SporulationCycle, captionHe: "מחזור הספורולציה והנביטה. הבנייה אורכת שעות ומערבת מעל 200 גנים בסדר קבוע; החזרה לתא פעיל אורכת דקות, ובה אובדת העמידות. סכמטי." },
  "gram-stain": { el: GramStain, captionHe: "צביעת גראם בארבעה שלבים. הקומפלקס של גביש סגול ויוד נלכד בדופן העבה של גראם-חיוביים; בגראם-שליליים האלכוהול שוטף אותו, והתאים נצבעים בצבע הנגדי (ספרנין). סכמטי." },
  "transport-systems": { el: TransportSystems, captionHe: "שלוש מערכות הובלה: הובלה פשוטה (מונעת בכוח הפרוטוני), העברה קבוצתית (PTS — הסוכר מזורחן בכניסה על חשבון PEP) ומובל ABC (חלבון קושר בפריפלזמה, אנרגיה מ-ATP). סכמטי." },
  "gram-envelopes": { el: GramEnvelopes, captionHe: "המעטפת הגראם-חיובית (פפטידוגליקן עבה עם חומצות טייכואיות) והגראם-שלילית (ממברנה חיצונית עם LPS ופורינים, פריפלזמה ופפטידוגליקן דק). סכמטי, לא בקנה מידה." },
  "flagellum-motor": { el: FlagellumMotor, captionHe: "המנוע של השוטון בחיידק גראם-שלילי: הרוטור (מוט וטבעות) מסתובב בתוך המעטפת, והסטטור (חלבוני Mot) מנצל זרימת פרוטונים. טבעת C היא המתג בין CCW ל-CW. סכמטי." },
  "chemotaxis-che": { el: ChemotaxisChe, captionHe: "מסלול האיתות בכימוטקסיס של E. coli: חומר מושך מעכב את CheA, ולכן יש פחות CheY-P ופחות התהפכויות. CheR ו-CheB משנים את המתילציה של הקולטנים ומאפשרים הסתגלות. סכמטי." },
  "growth-curve": { el: GrowthCurve, captionHe: "עקומת הגדילה של תרבית סגורה (בציר לוגריתמי). בשלב המעריכי הלוג של מספר התאים עולה בקו ישר; השיפוע קובע את זמן הדור. עקומה מודגמת." },
  "oxygen-tubes": { el: OxygenTubes, captionHe: "גדילה במבחנות תיוגליקולט לפי היחס לחמצן. החמצן חודר רק לחלק העליון (ורוד). סכמטי." },
  "antibiotic-targets": { el: AntibioticTargets, captionHe: "חמש קבוצות המטרות של אנטיביוטיקה ודוגמאות לכל אחת. סכמטי." },
  "redox-tower": { el: RedoxTower, captionHe: "מגדל החיזור: פוטנציאלי חיזור סטנדרטיים (E₀′, וולט, pH 7; Fe³⁺/Fe²⁺ ב-pH 2). אלקטרונים זורמים מלמעלה (תורמים) למטה (מקבלים); האנרגיה פרופורציונית להפרש." },
  "carbon-cycle-anoxic": { el: CarbonCycleAnoxic, captionHe: "שרשרת המזון האנאירובית שמפרקת חומר אורגני למתאן. שלב הסינטרופים אפשרי רק כששותף (מתנוגן או מחזר סולפט) שומר על ריכוז H₂ נמוך. סכמטי." },
  "nitrogen-cycle": { el: NitrogenCycle, captionHe: "מחזור החנקן: קיבוע, ניטריפיקציה (אירובית), דניטריפיקציה ואנמוקס (מחזירים N₂ לאוויר), DNRA (שומר את החנקן כאמוניום), אמוניפיקציה והטמעה. סכמטי." },
  "biofilm-stages": { el: BiofilmStages, captionHe: "חמשת שלבי הביופילם: היצמדות הפיכה, היצמדות קבועה, מיקרו-מושבה, ביופילם בוגר עם מטריקס, והתפזרות. סכמטי." },
  "quorum-sensing-lux": { el: QuorumSensingLux, captionHe: "חישת מניין במערכת lux: האות (AHL) מצטבר רק בצפיפות גבוהה, נקשר ל-LuxR ומפעיל את אופרון האור. סכמטי." },
  "baltimore-classes": { el: BaltimoreClasses, captionHe: "שבע קבוצות בלטימור, לפי הדרך שבה הגנום מגיע ל-mRNA. סכמטי." },
  "one-step-growth": { el: OneStepGrowth, captionHe: "עקומת גדילה בצעד אחד של פאג'. הקו הרציף: חלקיקים חופשיים; הקו המקווקו: סך החלקיקים המדבקים, בתוך התאים ומחוצה להם, אחרי פירוק מלאכותי של התאים. בשלב הליקוי אין חלקיקים שלמים בתא. גודל הפריצה — צאצאים לכל תא שהודבק. עקומות מודגמות." },
  "lambda-switch": { el: LambdaSwitch, captionHe: "ההחלטה של פאג' λ בין ליזיס לליזוגניה, וההשראה שמוציאה את הפרופאג'. סכמטי." },
  "conjugation-hfr": { el: ConjugationHfr, captionHe: "קוניוגציה של F⁺ (שני התאים יוצאים F⁺) ושל Hfr (הכרומוזום נמשך מ-oriT, וההעברה נקטעת לפני ששאר F עובר). סכמטי." },
  "tree-of-life": { el: TreeOfLife, captionHe: "שלושת התחומים לפי rRNA של תת-היחידה הקטנה. האאוקריוטים מסתעפים מתוך הקו הארכאוני; החיצים המקווקווים — מוצא המיטוכונדריה והכלורופלסטים באנדוסימביוזה. סכמטי." },
  "antibody-structure": { el: AntibodyStructure, captionHe: "מבנה נוגדן (IgG): שתי שרשראות כבדות ושתי קלות. האזורים המשתנים בקצות הזרועות יוצרים שני אתרי קישור זהים; אזור Fc קובע מה הנוגדן עושה. סכמטי." },
  "primary-secondary-response": { el: PrimarySecondaryResponse, captionHe: "תגובה ראשונית ושניונית לאותו אנטיגן (החיצים האדומים — חשיפה). השניונית מהירה, חזקה וארוכה, ובעיקר IgG, בזכות תאי הזיכרון. עקומות מודגמות." },
  "infection-stages": { el: InfectionStages, captionHe: "שלבי ההדבקה ודוגמאות לגורמי האלימות בכל שלב. לא כל פתוגן עובר את כל השלבים. סכמטי." },
};
