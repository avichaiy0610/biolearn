/* Original textbook-informed schematics. Source record: visual-lab/ubiquitin-2024-gaps/learning-card.md. */
import type React from "react";
import { He, La, INK, MUTED, BLUE, GREEN, ORANGE } from "./biochemFigures";

const PURPLE = "#7c3aed", RED = "#b91c1c", TEAL = "#0f766e";
function Canvas({ h, label, children }: { h: number; label: string; children: React.ReactNode }) {
  return <svg viewBox={`0 0 480 ${h}`} className="w-full h-auto" role="img" aria-label={label}>
    <rect width={480} height={h} rx={12} fill="white" />
    {children}
  </svg>;
}
// Arrowheads are explicit geometry, so multiple inline figures never share marker IDs.
function Flow({ d, end, color = MUTED }: { d: string; end: [number, number, number]; color?: string }) {
  const [x, y, rotation] = end;
  return <g fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} /><path d="M-6 -4 L0 0 L-6 4" transform={`translate(${x} ${y}) rotate(${rotation})`} />
  </g>;
}
function Panel({ y, h, title }: { y: number; h: number; title: string }) {
  return <g><rect x={10} y={y} width={460} height={h} rx={12} fill="#f8fafc" stroke="#cbd5e1" />
    <He x={240} y={y + 29} size={20} bold>{title}</He></g>;
}
function Ub({ x, y, p = false }: { x: number; y: number; p?: boolean }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-9 -5 Q-12 -13 -3 -13 Q3 -17 8 -10 Q15 -8 11 0 Q13 9 4 11 Q-5 14 -9 7 Q-15 4 -9 -5Z" fill="#fef3c7" stroke={ORANGE} strokeWidth={1.5} />
    {p && <><circle cx={9} cy={-12} r={7} fill={PURPLE} /><La x={9} y={-9} size={9} color="white" bold>P</La></>}
  </g>;
}
function Chain({ x, y, p = false }: { x: number; y: number; p?: boolean }) {
  return <g><path d={`M${x} ${y + 20} V${y + 11} M${x} ${y - 13} l12 -12 M${x + 12} ${y - 48} l12 -12`} fill="none" stroke={ORANGE} strokeWidth={2} />
    <Ub x={x} y={y} p={p} /><Ub x={x + 12} y={y - 36} p={p} /><Ub x={x + 24} y={y - 72} p={p} /></g>;
}
function Target({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><path d="M-27 -6 C-40 -32 -13 -43 3 -30 C28 -39 41 -14 26 1 C42 22 10 41 -5 25 C-28 35 -43 10 -27 -6Z" fill="#dbeafe" stroke={BLUE} strokeWidth={1.8} />
    <path d="M-15 6 Q-4 -15 10 -5 T20 13 M-18 -10 Q-8 -18 0 -8" stroke={BLUE} strokeWidth={1.3} fill="none" opacity={0.55} /></g>;
}
function Ligase({ x, y, crbn = false }: { x: number; y: number; crbn?: boolean }) {
  return <g transform={`translate(${x} ${y})`}><path d="M-32 -20 Q-19 -40 1 -26 Q23 -38 34 -15 Q40 -1 20 8 Q11 -4 0 7 Q-9 -4 -19 9 Q-42 5 -32 -20Z" fill="#ccfbf1" stroke={TEAL} strokeWidth={1.8} />
    <path d="M-20 12 Q-8 0 1 12 Q12 1 24 13 L28 31 Q0 43 -27 29Z" fill="#99f6e4" stroke={TEAL} strokeWidth={1.4} />
    <La x={0} y={-9} size={14} bold color={TEAL}>{crbn ? "CRBN" : "E3"}</La></g>;
}
function Degrader({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><path d="M-27 0 C-12 -12 6 12 27 0" fill="none" stroke={PURPLE} strokeWidth={4} />
    <path d="M-40 -7 L-28 -10 L-21 0 L-28 10 L-40 7Z" fill="#c4b5fd" stroke={PURPLE} strokeWidth={1.5} />
    <path d="M24 -9 L38 -7 L42 4 L30 10 L22 3Z" fill="#c4b5fd" stroke={PURPLE} strokeWidth={1.5} /></g>;
}
function Proteasome({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-31 -39 Q0 -54 31 -39 L25 -24 L-25 -24Z" fill="#bae6fd" stroke={TEAL} strokeWidth={1.5} />
    {[-23, -7, 9, 25].map((dy, i) => <g key={dy}><path d={`M-25 ${dy} Q0 ${dy - 8} 25 ${dy} v12 Q0 ${dy + 21} -25 ${dy + 12}Z`} fill={i === 1 || i === 2 ? "#ddd6fe" : "#ccfbf1"} stroke={i === 1 || i === 2 ? PURPLE : TEAL} strokeWidth={1.5} />
      {[-14, -4, 6, 16].map(dx => <line key={dx} x1={dx} x2={dx} y1={dy + 3} y2={dy + 12} stroke="#94a3b8" />)}</g>)}
    <ellipse cx={0} cy={-39} rx={11} ry={4} fill="white" stroke={TEAL} />
  </g>;
}

export function UpsDiscovery() {
  return <Canvas h={1150} label="גילוי מערכת היוביקוויטין: הפרדת תמצית רטיקולוציטים לשתי פרקציות ושחזור פירוק, ואחריו סולם הצמדה קוולנטית התלוי ב-ATP">
    <Panel y={8} h={640} title="א. הפרדה ושחזור פעילות" />
    <He x={240} y={68} size={18} bold>תמצית רטיקולוציטים</He>
    <path d="M219 82 L219 107 Q240 120 261 107 V82" fill="#fee2e2" stroke={RED} strokeWidth={2} />
    <Flow d="M240 121 V145" end={[240,145,90]} />
    <path d="M214 159 Q240 168 266 159 V235 Q240 245 214 235Z" fill="#e0f2fe" stroke={BLUE} strokeWidth={2} />
    {[176,190,204,218].map(y => <g key={y}>{[222,234,246,258].map(x => <circle key={x} cx={x} cy={y} r={3} fill="#93c5fd" />)}</g>)}
    <La x={117} y={188} size={17} bold color={BLUE}>DEAE</La>
    <He x={117} y={212} size={15}>הפרדה לפי מטען</He>
    <Flow d="M240 246 V264 H126 V284" end={[126,284,90]} />
    <Flow d="M240 264 H354 V284" end={[354,284,90]} />
    {[126,354].map((x,i) => <g key={x}>
      <path d={`M${x-22} 296 v37 q22 30 44 0 v-37`} fill={i ? "#ccfbf1" : "#fef3c7"} stroke={i ? TEAL : ORANGE} strokeWidth={2} />
      <La x={x} y={323} size={19} bold color={i ? TEAL : ORANGE}>{i ? "II" : "I"}</La>
      <He x={x} y={383} size={17}>{i ? "נקשרה לעמודה" : "לא נקשרה לעמודה"}</He>
    </g>)}
    <He x={240} y={409} size={16} bold>בכל המבחנות: מצע חלבוני ו־ATP</He>
    <He x={240} y={437} size={15} color={MUTED}>התוצאה: פירוק יעיל התלוי ב־ATP</He>
    <La x={126} y={473} size={18} color={ORANGE}>I</La><He x={324} y={473} size={18} color={RED}>לא</He>
    <La x={126} y={509} size={18} color={TEAL}>II</La><He x={324} y={509} size={18} color={RED}>לא</He>
    <La x={126} y={543} size={18}>I + II</La><He x={324} y={543} size={18} bold color={GREEN}>הפירוק חוזר</He>
    <He x={126} y={584} size={16}>פרקציה I מורתחת</He><He x={324} y={584} size={18} bold color={GREEN}>עם II: יש פירוק</He>
    <He x={240} y={626} size={16} color={ORANGE}>הרכיב החיוני בפרקציה I עמיד לחום</He>

    <Panel y={668} h={472} title="ב. 1980: הצמדה בכמה עותקים" />
    <La x={240} y={731} size={19} bold color={ORANGE}>APF-1 = ubiquitin (Ub)</La>
    <He x={240} y={761} size={17}>מצע + יוביקוויטין + מערכת הצמדה</He>
    <La x={118} y={800} size={17} bold>−ATP</La><La x={223} y={800} size={17} bold>+ATP</La>
    <rect x={67} y={815} width={209} height={218} rx={6} fill="#eef2ff" stroke="#a5b4fc" />
    {[118,223].map(x => <rect key={x} x={x-22} y={826} width={44} height={8} rx={2} fill="#a5b4fc" />)}
    <rect x={96} y={1002} width={44} height={7} rx={2} fill={BLUE} />
    {[1002,958,914,870].map((y,i) => <g key={y}><rect x={201} y={y} width={44} height={7} rx={2} fill={i ? ORANGE : BLUE} />
      <La x={303} y={y+8} size={17} anchor="start" color={i ? ORANGE : BLUE}>{i ? `S + ${i} Ub` : "S: substrate"}</La></g>)}
    <Flow d="M43 853 V1009" end={[43,1009,90]} />
    <He x={240} y={1065} size={17} bold>יותר יוביקוויטין: מסה גבוהה יותר</He>
    <He x={240} y={1094} size={15}>הפסים הגבוהים: תצמידים קוולנטיים, פחות נדידה</He>
    <He x={240} y={1123} size={14} color={MUTED}>ג׳ל סכמטי · לא נתונים מקוריים · לא בקנה מידה</He>
  </Canvas>;
}

function Mito({ x, y, damaged = false, small = false }: { x: number; y: number; damaged?: boolean; small?: boolean }) {
  const stroke = damaged ? ORANGE : TEAL;
  return <g transform={`translate(${x} ${y}) scale(${small ? 0.8 : 1})`}>
    <path d="M-86 0 C-90 -48 -35 -62 15 -48 C58 -60 94 -21 86 15 C81 51 28 58 -12 48 C-58 58 -90 34 -86 0Z" fill={damaged ? "#fff7ed" : "#f0fdfa"} stroke={stroke} strokeWidth={2.5} />
    <path d="M-74 0 C-78 -35 -51 -43 -41 -39 L-42 -7 Q-40 3 -32 -6 L-27 -39 Q-15 -42 -5 -36 L-7 9 Q-4 19 5 10 L12 -36 Q26 -40 34 -31 L28 6 Q29 16 38 8 L48 -30 Q78 -24 74 10 C70 38 39 44 7 36 C-28 47 -72 34 -74 0Z" fill={damaged ? "#ffedd5" : "#ccfbf1"} stroke={stroke} strokeWidth={1.8} />
  </g>;
}
function Kinase({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><rect x={-5} y={6} width={10} height={23} rx={3} fill={PURPLE} />
    <path d="M-18 -12 Q-20 -28 0 -26 Q22 -27 20 -9 Q26 8 9 13 Q-12 20 -18 -1Z" fill="#ede9fe" stroke={PURPLE} strokeWidth={1.7} /></g>;
}
export function Pink1Parkin() {
  return <Canvas h={1280} label="PINK1 ו-Parkin מיטופגיה: בבריאה ייבוא וחיתוך PINK1; באיבוד פוטנציאל הוא מצטבר בחוץ, מזרחן יוביקוויטין ו-Parkin ומגביר סימון וגיוס אוטופגיה">
    <Panel y={8} h={365} title="1. פוטנציאל הממברנה קובע" />
    <He x={126} y={73} size={19} bold color={TEAL}>מיטוכונדריה בריאה</He>
    <He x={354} y={73} size={19} bold color={ORANGE}>מיטוכונדריה פגועה</He>
    <Mito x={126} y={177} /><Mito x={354} y={177} damaged />
    <La x={126} y={252} size={16} color={TEAL}>Δψ maintained</La><La x={354} y={252} size={16} color={ORANGE}>Δψ lost</La>
    <Flow d="M126 122 V153" end={[126,153,90]} color={TEAL} />
    <Kinase x={354} y={107} />
    <La x={354} y={278} size={17} bold color={PURPLE}>PINK1</La>
    <He x={354} y={304} size={16}>מצטבר בממברנה החיצונית</He>
    <He x={126} y={278} size={16}>ייבוא של PINK1 פנימה</He>
    <He x={126} y={304} size={16}>חיתוך ופירוק מהיר</He>
    <He x={126} y={335} size={16} bold color={TEAL}>אין הצטברות בחוץ</He>
    <He x={354} y={335} size={16} bold color={ORANGE}>תחילת אות הנזק</He>
    <He x={240} y={355} size={14} color={MUTED}>קווי המתאר: ממברנה חיצונית ופנימית עם קריסטות</He>

    <Panel y={391} h={436} title="2. זרחון, הפעלה והגברה" />
    <La x={240} y={455} size={21} bold color={PURPLE}>PINK1</La>
    <He x={240} y={482} size={16}>קינאז בממברנה החיצונית</He>
    <Flow d="M220 500 H126 V526" end={[126,526,90]} color={PURPLE} />
    <Flow d="M260 500 H354 V526" end={[354,526,90]} color={PURPLE} />
    <Ub x={126} y={555} p /><La x={354} y={562} size={21} bold color={TEAL}>Parkin–P</La>
    <La x={126} y={597} size={17} color={PURPLE}>Ub–P (Ser65)</La>
    <He x={354} y={597} size={16}>זרחון ב־Ser65</He>
    <Flow d="M126 613 V635 H240 V655" end={[240,655,90]} color={PURPLE} />
    <Flow d="M354 613 V635 H240" end={[240,635,180]} color={PURPLE} />
    <He x={240} y={683} size={19} bold color={TEAL}>Parkin פעיל: ליגאז E3</He>
    <Flow d="M240 698 V722" end={[240,722,90]} color={TEAL} />
    <He x={240} y={751} size={18}>יוביקוויטינציה של חלבוני המעטפת</He>
    <He x={240} y={780} size={17} color={PURPLE}>PINK1 מזרחן את היוביקוויטין החדש</He>
    <Flow d="M405 785 H448 V454 H294" end={[294,454,180]} color={PURPLE} />
    <He x={240} y={811} size={16} bold color={PURPLE}>לולאת הגברה: עוד Ub–P ועוד Parkin פעיל</He>

    <Panel y={845} h={424} title="3. גישור אל ממברנת האוטופגיה" />
    {/* Two membranes of an open phagophore. The receptor bridges Ub to lipidated LC3. */}
    <path d="M98 926 C10 976 41 1169 240 1185 C439 1169 470 976 382 926" fill="none" stroke="#86efac" strokeWidth={12} />
    <path d="M105 939 C39 987 66 1148 240 1161 C414 1148 441 987 375 939" fill="none" stroke={GREEN} strokeWidth={3} />
    <Mito x={240} y={1078} damaged small />
    <rect x={233} y={1011} width={14} height={33} rx={4} fill={BLUE} stroke={BLUE} />
    <Chain x={240} y={995} p />
    <path d="M250 923 H167 Q148 923 135 945 L121 963" fill="none" stroke={TEAL} strokeWidth={7} strokeLinecap="round" />
    <path d="M104 974 L82 974" fill="none" stroke={GREEN} strokeWidth={3} />
    <circle cx={116} cy={974} r={12} fill="#dcfce7" stroke={GREEN} strokeWidth={2} />
    <La x={310} y={924} size={16} color={PURPLE}>Ub–P</La>
    <La x={123} y={900} size={15} bold color={TEAL}>OPTN / NDP52</La>
    <path d="M175 905 L183 916" stroke={TEAL} strokeWidth={1.3} />
    <La x={96} y={1005} size={17} color={GREEN} bold>LC3</La>
    <He x={240} y={1210} size={16}>חלבון בממברנה החיצונית</He>
    <He x={240} y={1239} size={13} color={MUTED}>סגול: קינאז / זרחון · כתום: Ub · ירוק: אוטופגיה</He>
    <He x={240} y={1260} size={15} bold color={GREEN}>עטיפה באוטופגוזום ובהמשך פירוק בליזוזום</He>
  </Canvas>;
}

export function ProtacTernary() {
  return <Canvas h={1220} label="השוואה: דבק מולקולרי משנה את משטח CRBN, ו-PROTAC דו-ראשי מגייס מטרה ל-E3, מאפשר יוביקוויטינציה ופירוק וממוחזר. עקומת hook סכמטית עם DC50 ו-Dmax">
    <Panel y={8} h={786} title="קירוב המטרה לליגאז" />
    <line x1={240} y1={59} x2={240} y2={755} stroke="#cbd5e1" strokeDasharray="4 5" />
    <He x={122} y={76} size={20} bold>דבק מולקולרי</He><La x={357} y={76} size={21} bold>PROTAC</La>
    <He x={122} y={108} size={16}>מולקולה קטנה אחת</He><He x={357} y={108} size={16}>שני ראשים ומקשר</He>
    <Ligase x={122} y={171} crbn /><path d="M113 184 l12 -6 11 11 -11 9 -12 -3Z" fill={PURPLE} stroke={PURPLE} />
    <He x={122} y={240} size={16}>הדבק נקשר ל־CRBN</He>
    <He x={122} y={267} size={16} color={PURPLE}>נוצר משטח זיהוי חדש</He>
    <Degrader x={357} y={163} />
    <He x={357} y={213} size={15} color={PURPLE}>ראש למטרה · ראש לליגאז</He>
    <He x={357} y={240} size={16}>גיוס שני החלבונים</He>
    <He x={357} y={267} size={16}>לקומפלקס משולש</He>
    <Flow d="M122 283 V312" end={[122,312,90]} />
    <Flow d="M357 283 V312" end={[357,312,90]} />
    <Ligase x={122} y={350} crbn /><Target x={122} y={418} />
    <path d="M113 363 l12 -6 11 11 -11 9 -12 -3Z" fill={PURPLE} stroke={PURPLE} />
    <He x={122} y={480} size={16}>מטרה חדשה נקשרת</He>
    <La x={122} y={505} size={15} color={BLUE}>e.g. IKZF1 / IKZF3</La>
    <Target x={291} y={382} /><Ligase x={425} y={382} />
    <Degrader x={357} y={382} />
    <La x={291} y={445} size={16} color={BLUE}>Target</La><La x={425} y={445} size={16} color={TEAL}>E3</La>
    <He x={357} y={480} size={16}>מטרה–מולקולה–ליגאז</He>
    <Flow d="M122 519 V545" end={[122,545,90]} />
    <Flow d="M357 500 V545" end={[357,545,90]} />
    <Target x={107} y={623} /><Chain x={144} y={603} />
    <Target x={340} y={623} /><Chain x={377} y={603} />
    <path d="M129 623 H144 M362 623 H377" fill="none" stroke={ORANGE} strokeWidth={2} />
    <He x={122} y={688} size={17} bold color={ORANGE}>סימון ביוביקוויטין</He>
    <He x={357} y={688} size={17} bold color={ORANGE}>סימון ביוביקוויטין</He>
    <He x={122} y={715} size={16}>CRBN הוא קולטן המצע</He>
    <La x={122} y={742} size={16} color={TEAL}>in CRL4–CRBN (E3)</La>
    <He x={357} y={715} size={16}>המולקולה משתחררת</He>
    <He x={357} y={742} size={17} bold color={PURPLE}>וחוזרת למחזור נוסף</He>
    <Flow d="M435 716 H456 V163 H408" end={[408,163,180]} color={PURPLE} />
    <He x={240} y={778} size={14} color={MUTED}>סגול: המגייס · כחול: המטרה · כתום: יוביקוויטין</He>
    <Flow d="M122 805 V831 H200" end={[200,831,0]} />
    <Flow d="M357 805 V831 H280" end={[280,831,180]} />
    <Proteasome x={240} y={868} />
    <He x={102} y={870} size={17} bold>פרוטאזום</He>
    <path d="M283 896 l13 7 m-8 -24 l15 3 m-19 33 l12 5" stroke={BLUE} strokeWidth={3} />
    <He x={365} y={900} size={16} color={BLUE}>פפטידים</He>

    <Panel y={941} h={269} title="אפקט ה־hook: עודף PROTAC" />
    <He x={107} y={1003} size={16} color={BLUE}>מידת הפירוק</He>
    <Flow d="M75 1150 V1020" end={[75,1020,-90]} color={INK} />
    <Flow d="M75 1150 H437" end={[437,1150,0]} color={INK} />
    <path d="M83 1146 C112 1146 135 1140 151 1127 C163 1116 173 1105 181 1094 C197 1068 210 1050 226 1043 C250 1030 276 1043 296 1065 C333 1109 374 1138 426 1144" fill="none" stroke={BLUE} strokeWidth={3} />
    {/* DC50 follows the lesson's 50% target-loss definition on the ascending branch. Axes are uncalibrated. */}
    <path d="M77 1094 H181 V1148 M77 1039 H240" fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" />
    <La x={119} y={1029} size={16} color={BLUE}>Dmax</La>
    <He x={119} y={1081} size={14} color={MUTED}>50% מהמטרה</He>
    <La x={181} y={1177} size={16} bold>DC50</La>
    <He x={351} y={1043} size={16} color={ORANGE}>עודף קומפלקסים</He>
    <He x={351} y={1067} size={16} color={ORANGE}>דו־רכיביים</He>
    <He x={359} y={1197} size={15}>ריכוז PROTAC עולה</He>
  </Canvas>;
}
