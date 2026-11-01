/* Original textbook-informed drawings for Technion 134082. Gel intensities and
   molecular shapes are schematic; the plotted binding/rate values are computed. */
import type React from "react";
import { He, La, BLUE, GREEN, ORANGE, INK, MUTED, LINE, scale, curve } from "./biochemFigures";

const PURPLE = "#7c3aed", RED = "#b91c1c";
const F = { blue: "#eff6ff", green: "#f0fdf4", purple: "#f5f3ff", orange: "#fff7ed", gray: "#f8fafc" };
function Panel({ h, label, children }: { h: number; label: string; children: React.ReactNode }) {
  return <svg viewBox={`0 0 480 ${h}`} className="w-full h-auto" role="img" aria-label={label}>
    <rect width={480} height={h} fill="white" />
    {children}
  </svg>;
}
function Stroke({ x1, y1, x2, y2, c = BLUE, width = 3 }: { x1: number; y1: number; x2: number; y2: number; c?: string; width?: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={width} strokeLinecap="round" />;
}
function Tip({ x1, y1, x2, y2, c = GREEN }: { x1: number; y1: number; x2: number; y2: number; c?: string }) {
  const a = Math.atan2(y2 - y1, x2 - x1), len = 9;
  return <g><Stroke x1={x1} y1={y1} x2={x2} y2={y2} c={c} width={2.5} />
    <path d={`M${x2} ${y2} L${x2 - len * Math.cos(a - 0.45)} ${y2 - len * Math.sin(a - 0.45)} L${x2 - len * Math.cos(a + 0.45)} ${y2 - len * Math.sin(a + 0.45)}Z`} fill={c} /></g>;
}
function Band({ x, y, opacity = 1, color = BLUE, w = 28 }: { x: number; y: number; opacity?: number; color?: string; w?: number }) {
  return <rect x={x - w / 2} y={y - 4} width={w} height={8} rx={2} fill={color} opacity={opacity} />;
}
function Bases({ seq, x, y, color = BLUE, step = 18 }: { seq: string; x: number; y: number; color?: string; step?: number }) {
  return <g>{[...seq].map((base, i) => <La key={i} x={x + step * i} y={y} size={16} bold color={color}>{base}</La>)}</g>;
}
function Protein({ x, y, color = PURPLE }: { x: number; y: number; color?: string }) {
  return <path d={`M${x - 28} ${y + 11} C${x - 39} ${y - 6} ${x - 20} ${y - 28} ${x - 3} ${y - 20} C${x + 15} ${y - 34} ${x + 39} ${y - 13} ${x + 29} ${y + 6} Q${x + 10} ${y + 27} ${x - 2} ${y + 12} Q${x - 17} ${y + 26} ${x - 28} ${y + 11}Z`} fill={color} opacity={0.9} />;
}

export function PcrPrimerDesign() {
  const top = "ATGCCATACGATCGTATC", bottom = "TACGGTATGCTAGCATAG";
  return <Panel h={590} label="תכנון פריימרים: קדמי זהה לקצה העליון ונקשר לתחתון; אחורי הוא משלים הפוך ונקשר לעליון; הארכה פנימה ותוצר הכולל את שני הפריימרים">
    <He x={240} y={25} bold>שני גדילי המקור — אנטי־מקבילים</He>
    <Bases seq={top} x={87} y={65} /><La x={49} y={65}>5′</La><La x={430} y={65}>3′</La>
    <Stroke x1={78} y1={76} x2={402} y2={76} />
    <Stroke x1={78} y1={108} x2={402} y2={108} />
    <Bases seq={bottom} x={87} y={132} /><La x={49} y={132}>3′</La><La x={430} y={132}>5′</La>
    {Array.from({ length: 18 }, (_, i) => <Stroke key={i} x1={87 + i * 18} y1={82} x2={87 + i * 18} y2={102} c={LINE} width={1.5} />)}

    <He x={240} y={174} bold color={GREEN}>קדמי: זהה לקצה 5′ של העליון</He>
    <La x={240} y={198} size={16} color={GREEN}>Forward: 5′–ATGCCA–3′</La>
    <Bases seq="ATGCCA" x={87} y={232} color={GREEN} /><La x={49} y={232}>5′</La><La x={208} y={232}>3′</La>
    <Stroke x1={78} y1={242} x2={186} y2={242} c={GREEN} width={5} />
    <Tip x1={220} y1={242} x2={385} y2={242} />
    <Bases seq={bottom} x={87} y={280} /><La x={49} y={280}>3′</La><La x={430} y={280}>5′</La>
    <Stroke x1={78} y1={257} x2={402} y2={257} />
    <He x={303} y={221} size={13} color={GREEN}>הארכה מקצה 3′</He>

    <He x={240} y={322} bold color={ORANGE}>אחורי: המשלים ההפוך של הקצה הימני</He>
    <La x={240} y={347} size={16} color={ORANGE}>Reverse: 5′–GATACG–3′</La>
    <Bases seq={top} x={87} y={380} /><La x={49} y={380}>5′</La><La x={430} y={380}>3′</La>
    <Stroke x1={78} y1={390} x2={402} y2={390} />
    <Stroke x1={294} y1={412} x2={402} y2={412} c={ORANGE} width={5} />
    <Bases seq="GCATAG" x={303} y={437} color={ORANGE} /><La x={268} y={437}>3′</La><La x={430} y={437}>5′</La>
    <Tip x1={265} y1={412} x2={95} y2={412} c={ORANGE} />
    <He x={170} y={437} size={13} color={ORANGE}>הארכה מקצה 3′</He>

    <He x={240} y={477} bold>התוצר המוגדר: מפריימר לפריימר, כולל שניהם</He>
    <Stroke x1={78} y1={503} x2={186} y2={503} c={GREEN} width={7} />
    <Stroke x1={186} y1={503} x2={402} y2={503} c={GREEN} />
    <Stroke x1={78} y1={518} x2={294} y2={518} c={GREEN} />
    <Stroke x1={294} y1={518} x2={402} y2={518} c={ORANGE} width={7} />
    <path d="M78 537 V545 H402 V537" fill="none" stroke={INK} strokeWidth={1.5} />
    <He x={240} y={569} size={14}>דוגמה מקוצרת: 18 זוגות בסיסים, פריימרים של 6</He>
  </Panel>;
}

const BASE_COLOR: Record<string, string> = { A: GREEN, C: BLUE, G: PURPLE, T: RED };
function Peak({ x, y, color, height = 43, spread = 9 }: { x: number; y: number; color: string; height?: number; spread?: number }) {
  return <path d={`M${x - 2 * spread} ${y} C${x - spread} ${y} ${x - spread / 2} ${y - height} ${x} ${y - height} C${x + spread / 2} ${y - height} ${x + spread} ${y} ${x + 2 * spread} ${y}`} fill="none" stroke={color} strokeWidth={2.5} />;
}
export function SangerRead() {
  const seq = "ACGTACG";
  return <Panel h={750} label="ריצוף סנגר: פריימר על תבנית, שבעה אורכי תוצרים עם ddNTP צבעוני, סדר יציאה קצר לארוך וכרומטוגרמה של הגדיל המשלים; פיק כפול בדגימה מעורבת">
    <He x={240} y={25} bold>סנגר — קוראים את הגדיל החדש</He>
    <He x={390} y={52} size={13} color={BLUE}>תבנית</He>
    <Bases seq="CCTTGCATGC" x={117} y={78} step={23} /><La x={77} y={78}>3′</La><La x={355} y={78}>5′</La>
    <Bases seq="GGA" x={117} y={115} step={23} color={ORANGE} /><La x={77} y={115}>5′</La><La x={189} y={115}>3′</La>
    {[117, 140, 163].map(x => <Stroke key={x} x1={x} y1={85} x2={x} y2={98} c={LINE} width={1.5} />)}
    <Tip x1={214} y1={109} x2={328} y2={109} />
    <He x={381} y={115} size={13} color={ORANGE}>פריימר</He>
    <He x={240} y={149} size={14}>קצה צבעוני = ddNTP ללא 3′-OH; ההארכה נעצרת</He>
    {Array.from({ length: 7 }, (_, i) => {
      const y = 182 + i * 25, end = 168 + (i + 1) * 25, base = seq[i];
      return <g key={i}>
        <Stroke x1={95} y1={y} x2={160} y2={y} c={ORANGE} width={5} />
        <Stroke x1={165} y1={y} x2={end - 8} y2={y} c={GREEN} width={4} />
        <circle cx={end} cy={y} r={8} fill={BASE_COLOR[base]} />
        <La x={end + 24} y={y + 5} size={14} color={BASE_COLOR[base]} bold>{base}</La>
        <La x={61} y={y + 5} size={13}>{`+${i + 1}`}</La>
      </g>;
    })}
    <He x={240} y={370} size={13}>כתום: אותו פריימר בכל קטע · ירוק: DNA חדש</He>
    <He x={240} y={404} bold>בנימית: סדר ההגעה לגלאי</He>
    <rect x={56} y={422} width={367} height={39} rx={19} fill={F.gray} stroke={LINE} strokeWidth={1.5} />
    {[...seq].map((b, i) => <g key={i}><circle cx={87 + i * 47} cy={441} r={10} fill={BASE_COLOR[b]} /><La x={87 + i * 47} y={487} size={14}>{i + 1}</La></g>)}
    <Tip x1={75} y1={510} x2={408} y2={510} c={INK} />
    <He x={240} y={537} size={14}>1: הקצר ביותר · 7: הארוך ביותר</He>
    <He x={240} y={572} bold>כרומטוגרמה: קריאה משמאל לימין, 5′→3′</He>
    <Stroke x1={58} y1={634} x2={423} y2={634} c={LINE} width={1} />
    {[...seq].map((b, i) => <g key={i}><Peak x={87 + 47 * i} y={632} color={BASE_COLOR[b]} /><La x={87 + 47 * i} y={655} bold color={BASE_COLOR[b]}>{b}</La></g>)}
    <La x={42} y={655} size={13}>5′</La><La x={442} y={655} size={13}>3′</La>
    <He x={160} y={704} size={14}>פיק כפול בעמדה אחת:</He>
    <Peak x={332} y={734} color={GREEN} height={46} /><Peak x={332} y={734} color={RED} height={32} />
    <La x={397} y={716} size={14}>A / T</La>
    <He x={151} y={731} size={13} color={MUTED}>שתי אוכלוסיות תבנית</He>
  </Panel>;
}

export function PrimerExtensionGel() {
  const laneX = [110, 169, 228, 287, 346, 405];
  return <Panel h={770} label="הארכת פריימר על DNA מעגלי: Pol III נעצר בדו גדיל; הליקאז מאפשר תוצר ארוך; Pol I ובלי טבעת בטא נותנים מריחה קצרה; Tus עוצר ב-Ter הלא מתיר">
    <He x={240} y={25} bold>הארכת פריימר: מחסום ומרחק</He>
    <circle cx={176} cy={132} r={72} fill="none" stroke={BLUE} strokeWidth={3} />
    {/* Clockwise synthesis starts at the upper left, meets duplex, then Ter. */}
    <path d="M111 103 A72 72 0 0 1 134 73" fill="none" stroke={ORANGE} strokeWidth={6} />
    <circle cx={111} cy={103} r={5} fill={RED} />
    <Tip x1={137} y1={62} x2={159} y2={55} c={ORANGE} />
    <path d="M213 68 A82 82 0 0 1 257 117" fill="none" stroke={GREEN} strokeWidth={4} />
    {[[215, 80, 221, 73], [228, 94, 236, 89], [240, 111, 250, 108]].map(([x1, y1, x2, y2], i) => <Stroke key={i} x1={x1} y1={y1} x2={x2} y2={y2} c={LINE} width={1.5} />)}
    <rect x={225} y={167} width={19} height={7} rx={2} transform="rotate(-48 235 170)" fill={PURPLE} />
    <La x={80} y={69} size={13} color={ORANGE}>3′</La><La x={76} y={121} size={13} color={ORANGE}>5′</La>
    <He x={344} y={78} size={14} color={GREEN}>אזור דו־גדילי</He>
    <Stroke x1={270} y1={86} x2={256} y2={93} c={MUTED} width={1.5} />
    <La x={342} y={150} size={14} color={PURPLE}>Ter + Tus</La>
    <He x={345} y={176} size={13} color={PURPLE}>מהצד הלא מתיר</He>
    <Stroke x1={285} y1={173} x2={254} y2={173} c={MUTED} width={1.5} />
    <He x={240} y={232} size={13}>כחול: תבנית ssDNA · כתום: פריימר · אדום: סימון</He>
    <He x={240} y={260} size={13}>בסכמה: האזור הדו־גדילי קודם ל־Ter בכיוון ההארכה</He>
    <He x={240} y={292} bold>ג׳ל דנטורטיבי — מודדים רק גדיל מסומן</He>
    <rect x={82} y={327} width={351} height={224} rx={8} fill={F.gray} stroke={LINE} strokeWidth={1.5} />
    {laneX.map((x, i) => <g key={i}><La x={x} y={318} size={15} bold>{i + 1}</La><rect x={x - 13} y={335} width={26} height={5} fill={LINE} /></g>)}
    <Band x={laneX[0]} y={528} />
    <Band x={laneX[1]} y={442} />
    <Band x={laneX[2]} y={362} />
    {[3, 4].map(i => <g key={i}>{Array.from({ length: 17 }, (_, j) => <rect key={j} x={laneX[i] - 13} y={484 + j * 2.5} width={26} height={3} fill={BLUE} opacity={0.15 + 0.5 * (j / 16)} />)}</g>)}
    <Band x={laneX[5]} y={401} color={PURPLE} />
    <Tip x1={52} y1={366} x2={52} y2={525} c={INK} />
    <He x={32} y={349} size={12}>ארוך</He><He x={32} y={547} size={12}>קצר</He>
    <La x={240} y={578} size={14}>1: primer only · 2: Pol III · 3: Pol III + helicase</La>
    <La x={240} y={604} size={14}>4: Pol I + helicase · 5: Pol III − β clamp</La>
    <La x={240} y={630} size={14}>6: Pol III + helicase + Tus</La>
    <He x={240} y={662} size={14}>1: פריימר בלבד · 2: עצירה באזור הדו־גדילי</He>
    <He x={240} y={689} size={14}>3: ארוך מאוד · 4–5: מריחה של קטעים קצרים</He>
    <He x={240} y={716} size={14} color={PURPLE}>6: עצירה ב־Ter אחרי פתיחת האזור הדו־גדילי</He>
    <He x={240} y={745} size={12} color={MUTED}>תגובה קצרה; בעיקר אירוע קישור אחד; סכמטי, ללא סולם אורך</He>
    <He x={240} y={764} size={11} color={MUTED}>Pol III הוא הולואנזים; β כלולה אלא אם צוין אחרת</He>
  </Panel>;
}

export function EmsaGel() {
  const xs = [102, 153, 204, 255, 306, 357, 408], fractions = [0, 1 / 11, 5 / 15, 0.5, 50 / 60, 0.12, 50 / 60];
  const s = scale(77, 422, 551, 409, 0, 50, 0, 1);
  return <Panel h={668} label="EMSA בג׳ל טבעי: חלבון עולה מגדיל את הפס המוסט; תחרות ספציפית מחלישה אותו, תחרות לא ספציפית אינה מחלישה; Kd עשרה ננומולר בחצי קישור">
    <He x={240} y={25} bold>EMSA — קישור ותחרות בג׳ל טבעי</He>
    <La x={240} y={55} size={14}>[P] (nM): 0 · 1 · 5 · 10 · 50</La>
    <He x={240} y={81} size={13}>חמשת המסלולים הראשונים: ריכוז חלבון עולה</He>
    {xs.map((x, i) => <La key={i} x={x} y={111} bold size={14}>{i + 1}</La>)}
    <rect x={77} y={122} width={356} height={166} rx={7} fill={F.gray} stroke={LINE} strokeWidth={1.5} />
    {xs.map((x, i) => <g key={i}>
      <rect x={x - 12} y={130} width={24} height={5} fill={LINE} />
      {fractions[i] > 0 && <Band x={x} y={177} color={PURPLE} opacity={fractions[i]} w={29} />}
      <Band x={x} y={263} opacity={1 - fractions[i]} w={29} />
    </g>)}
    <He x={40} y={181} size={12} color={PURPLE}>קשור</He><He x={40} y={267} size={12} color={BLUE}>חופשי</He>
    <Tip x1={52} y1={201} x2={52} y2={244} c={MUTED} />
    <He x={240} y={317} size={13}>6: כמו 5 + עודף DNA ספציפי לא מסומן → פחות קישור</He>
    <He x={240} y={344} size={13}>7: כמו 5 + עודף DNA לא ספציפי → הקישור נשמר</He>
    <He x={240} y={381} bold>עקומת קישור: Kd בריכוז שנותן 50%</He>
    <Stroke x1={77} y1={409} x2={77} y2={551} c={INK} width={1.5} />
    <Stroke x1={77} y1={551} x2={422} y2={551} c={INK} width={1.5} />
    <path d={curve(p => p / (p + 10), 0, 50, s)} fill="none" stroke={PURPLE} strokeWidth={3} />
    <path d={`M77 ${s.sy(0.5)} H${s.sx(10)} V551`} fill="none" stroke={ORANGE} strokeWidth={1.5} strokeDasharray="4 4" />
    {[0, 0.5, 1].map(v => <La key={v} x={64} y={s.sy(v) + 5} anchor="end" size={13}>{v}</La>)}
    {[0, 10, 25, 50].map(v => <La key={v} x={s.sx(v)} y={574} size={13}>{v}</La>)}
    {[1, 5, 10, 50].map(p => <circle key={p} cx={s.sx(p)} cy={s.sy(p / (p + 10))} r={4} fill={ORANGE} />)}
    <He x={131} y={401} size={12}>חלק קשור</He>
    <La x={283} y={505} size={15} bold color={ORANGE}>Kd = 10 nM</La>
    <La x={254} y={600} size={14}>[P] (nM) · 1 → 0.09 · 5 → 0.33</La>
    <La x={240} y={625} size={14}>10 → 0.50 · 50 → 0.83</La>
    <He x={240} y={653} size={12} color={MUTED}>DNA מסומן זניח; חלבון כולל ≈ חופשי; עוצמות הג׳ל סכמטיות</He>
  </Panel>;
}

export function FootprintLadder() {
  const ys = Array.from({ length: 17 }, (_, i) => 286 + i * 13);
  return <Panel h={599} label="DNase I footprinting: סימון בקצה אחד, סולם חיתוכים בלי חלבון ואזור ללא פסים עם חלבון, המסמן DNA מוגן">
    <He x={240} y={25} bold>טביעת רגל: איפה ה־DNA מוגן?</He>
    <He x={240} y={58} size={14}>סימון בקצה אחד של גדיל אחד</He>
    <Stroke x1={90} y1={95} x2={399} y2={95} /><Stroke x1={90} y1={110} x2={399} y2={110} />
    <circle cx={90} cy={95} r={6} fill={RED} />
    <La x={62} y={99} size={14}>5′</La><La x={426} y={99} size={14}>3′</La>
    <Protein x={248} y={91} />
    <He x={249} y={153} size={13} color={PURPLE}>חלבון מכסה אזור מוגן</He>
    <He x={240} y={184} size={14}>חיתוך חלקי ב־DNase I → הסרת החלבון → ג׳ל דנטורטיבי</He>
    <He x={168} y={228} size={14} bold>בלי חלבון</He><He x={279} y={228} size={14} bold>עם חלבון</He>
    <He x={240} y={252} size={12} color={MUTED}>אותו DNA מסומן בשני המסלולים</He>
    <rect x={130} y={266} width={189} height={256} rx={8} fill={F.gray} stroke={LINE} strokeWidth={1.5} />
    {ys.map((y, i) => <g key={i}><Band x={169} y={y} w={42} />{(i < 6 || i > 10) && <Band x={279} y={y} w={42} />}</g>)}
    <path d="M328 359 H338 V424 H328" fill="none" stroke={PURPLE} strokeWidth={2} />
    <He x={401} y={381} size={14} color={PURPLE}>אזור מוגן</He>
    <He x={401} y={407} size={13} color={PURPLE}>חסרים פסים</He>
    <Tip x1={89} y1={290} x2={89} y2={494} c={INK} />
    <He x={77} y={548} size={13}>קצר יותר ↓</He>
    <He x={284} y={549} size={14}>הפער בסולם = footprint</He>
    <He x={240} y={579} size={12} color={MUTED}>הגנה מחיתוך אינה בהכרח אתר ההכרה המדויק; סולם סכמטי</He>
  </Panel>;
}

function Dna({ x, y, w = 126 }: { x: number; y: number; w?: number }) {
  return <g><Stroke x1={x} y1={y} x2={x + w} y2={y} /><Stroke x1={x} y1={y + 12} x2={x + w} y2={y + 12} />
    {Array.from({ length: Math.floor(w / 12) }, (_, i) => <Stroke key={i} x1={x + 6 + 12 * i} y1={y + 3} x2={x + 6 + 12 * i} y2={y + 9} c={LINE} width={1} />)}</g>;
}
export function ChipSteps() {
  return <Panel h={854} label="ChIP: קיבוע חלבון ל-DNA, חיתוך, שיקוע על חרוז עם נוגדן, ביטול קיבוע ו-PCR של הפרומוטור; input מודד כמות התחלתית ו-IgG מודד רקע">
    <He x={240} y={26} bold>ChIP — מהתא אל אזור הפרומוטור</He>
    <He x={305} y={62} size={15} bold>1 · קיבוע בתא</He>
    <He x={305} y={87} size={12}>קשרים בין חלבון ל־DNA סמוך</He>
    <Dna x={54} y={90} w={139} /><Protein x={124} y={70} />
    <path d="M118 90 L130 102 M130 90 L118 102" stroke={RED} strokeWidth={2} />
    <Tip x1={126} y1={119} x2={126} y2={141} c={INK} />
    <He x={308} y={159} size={15} bold>2 · שבירת הכרומטין</He>
    <He x={312} y={184} size={12}>קטעים של מאות זוגות בסיסים</He>
    <Dna x={52} y={168} w={54} /><Dna x={121} y={168} w={72} />
    <Protein x={156} y={148} />
    <path d="M150 168 L162 180 M162 168 L150 180" stroke={RED} strokeWidth={2} />
    <Tip x1={126} y1={196} x2={126} y2={222} c={INK} />
    <He x={311} y={246} size={15} bold>3 · שיקוע עם נוגדן</He>
    <He x={312} y={272} size={12}>הנוגדן מזהה את חלבון המטרה</He>
    <circle cx={104} cy={286} r={30} fill="#ffedd5" stroke={ORANGE} strokeWidth={2} />
    <path d="M117 261 L135 236 L128 215 M135 236 L157 229" fill="none" stroke={ORANGE} strokeWidth={5} />
    <Protein x={168} y={228} /><Dna x={141} y={246} w={61} />
    <He x={104} y={339} size={12} color={ORANGE}>חרוז + נוגדן</He>
    <Tip x1={126} y1={353} x2={126} y2={376} c={INK} />
    <He x={310} y={400} size={15} bold>4 · ביטול הקיבוע</He>
    <He x={310} y={426} size={12}>הסרת חלבונים וטיהור DNA</He>
    <Dna x={58} y={403} w={138} />
    <Tip x1={126} y1={438} x2={126} y2={464} c={INK} />
    <He x={310} y={489} size={15} bold>5 · PCR של הפרומוטור</He>
    <He x={310} y={515} size={12}>הפריימרים תוחמים את אזור הבקרה</He>
    <rect x={86} y={479} width={79} height={36} rx={5} fill={F.green} />
    <Dna x={46} y={489} w={161} />
    <Tip x1={70} y1={478} x2={104} y2={478} /><Tip x1={184} y1={524} x2={149} y2={524} c={ORANGE} />
    <He x={125} y={552} size={13}>פרומוטור</He>
    <He x={240} y={587} size={13} color={MUTED}>העשרה ביחס לביקורות תומכת בנוכחות החלבון באזור</He>
    <rect x={20} y={608} width={213} height={148} rx={10} fill={F.blue} stroke={LINE} strokeWidth={1} />
    <rect x={247} y={608} width={213} height={148} rx={10} fill={F.orange} stroke={LINE} strokeWidth={1} />
    <La x={126} y={637} bold color={BLUE}>Input</La><La x={353} y={637} bold color={ORANGE}>IgG</La>
    <He x={126} y={665} size={13}>נלקח אחרי החיתוך, לפני IP</He>
    <He x={126} y={692} size={13}>כמה DNA היה מלכתחילה?</He>
    <He x={126} y={723} size={12}>PCR באותם פריימרים</He>
    <He x={353} y={665} size={13}>נוגדן לא ספציפי + חרוזים</He>
    <He x={353} y={692} size={13}>כמה DNA נמשך כרקע?</He>
    <He x={353} y={723} size={12}>עובר את שלבי השיקוע והטיהור</He>
    <He x={240} y={792} size={14} bold>קרבה ל־DNA בתא אינה הוכחה לקישור ישיר</He>
    <He x={240} y={826} size={12} color={MUTED}>צורות סכמטיות; כחול: DNA · סגול: חלבון · × אדום: קיבוע</He>
  </Panel>;
}

export function TweezersTrace() {
  const s = scale(78, 428, 551, 289, 0, 40, 0, 600);
  const polII = [[0, 0], [12.5, 300], [27.5, 300], [40, 600]].map(([t, p], i) => `${i ? "L" : "M"}${s.sx(t)} ${s.sy(p)}`).join(" ");
  return <Panel h={703} label="פינצטה אופטית: חרוז לכוד המחובר לפולימראז ו-DNA מקובע; חיידק מגיע ל-600 ב-12 שניות; Pol II ב-40 עם עצירה של 15 שניות בעמדה 300">
    <He x={240} y={25} bold>פולימראז יחיד: תנועה ועצירה</He>
    <He x={240} y={57} size={13}>סכמת מדידה: החרוז מחובר לפולימראז</He>
    <path d="M61 75 L106 138 L151 75 M61 201 L106 138 L151 201" fill="#fee2e2" opacity={0.7} />
    <circle cx={106} cy={138} r={29} fill="#fff7ed" stroke={ORANGE} strokeWidth={2} />
    <Stroke x1={138} y1={138} x2={187} y2={138} c={INK} width={2} />
    <Dna x={212} y={132} w={162} /><Protein x={215} y={135} />
    <path d="M219 157 Q235 188 257 174" stroke={PURPLE} strokeWidth={3} fill="none" />
    <Stroke x1={379} y1={107} x2={379} y2={168} c={INK} width={5} />
    <He x={106} y={225} size={13}>חרוז לכוד בלייזר</He>
    <La x={218} y={97} size={14} color={PURPLE}>RNA polymerase</La>
    <La x={298} y={118} size={14} color={BLUE}>DNA</La>
    <He x={398} y={196} size={13}>עיגון</He>
    <He x={240} y={260} size={14} bold>מיקום (bp) מול זמן (s) — נתוני התרגיל</He>
    <Stroke x1={78} y1={280} x2={78} y2={551} c={INK} width={1.5} />
    <Stroke x1={78} y1={551} x2={437} y2={551} c={INK} width={1.5} />
    {[0, 300, 600].map(v => <La key={v} x={64} y={s.sy(v) + 5} anchor="end" size={13}>{v}</La>)}
    {[0, 12, 20, 30, 40].map(v => <La key={v} x={s.sx(v)} y={575} size={13}>{v}</La>)}
    <path d={`M${s.sx(0)} ${s.sy(0)} L${s.sx(12)} ${s.sy(600)}`} fill="none" stroke={BLUE} strokeWidth={3.5} />
    <path d={polII} fill="none" stroke={PURPLE} strokeWidth={3.5} />
    <circle cx={s.sx(12)} cy={s.sy(600)} r={5} fill={BLUE} /><circle cx={s.sx(40)} cy={s.sy(600)} r={5} fill={PURPLE} />
    <path d={`M${s.sx(12.5)} 444 V451 H${s.sx(27.5)} V444`} fill="none" stroke={ORANGE} strokeWidth={1.5} />
    <He x={253} y={478} size={14} color={ORANGE}>עצירה ≈ 15 s</He>
    <He x={285} y={509} size={13} color={PURPLE}>נוקלאוזום? מכשול בעמדה 300</He>
    <La x={128} y={324} size={14} color={BLUE}>50 bp/s</La>
    <La x={307} y={312} size={13} color={PURPLE}>Pol II</La>
    <He x={251} y={607} size={14}>זמן (שניות)</He>
    <He x={405} y={642} size={14} color={BLUE}>חיידק:</He>
    <La x={230} y={642} size={14} color={BLUE}>600 / 12 = 50 bp/s</La>
    <He x={240} y={668} size={14} color={PURPLE}>Pol II: ממוצע 15; בלי העצירה 24 זוגות בסיסים לשנייה</He>
    <He x={240} y={695} size={12} color={MUTED}>עקבות אידאליים; אינם נתוני ניסוי או קצב אוניברסלי לאנזים</He>
  </Panel>;
}
