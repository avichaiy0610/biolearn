/* Original textbook-informed schematics for Technion 134117.
   See visual-lab/physiology-gaps/learning-card.md for sources and limitations. */
import type React from "react";
import { He, La, BLUE, ORANGE, GREEN, INK, MUTED } from "./biochemFigures";

const RED = "#b91c1c", PURPLE = "#7c3aed", TEAL = "#0f766e";
const tint = { blue: "#eff6ff", green: "#f0fdf4", red: "#fff1f2", purple: "#f5f3ff", bone: "#fef3c7" };
function Canvas({ h, label, children }: { h: number; label: string; children: React.ReactNode }) {
  return <svg viewBox={`0 0 480 ${h}`} className="w-full h-auto" style={{ background: "white" }} role="img" aria-label={label}>{children}</svg>;
}
function Panel({ y, h, title }: { y: number; h: number; title: string }) {
  return <g><rect x={8} y={y} width={464} height={h} rx={12} fill="#f8fafc" stroke="#cbd5e1" /><He x={240} y={y + 30} size={20} bold>{title}</He></g>;
}
function Flow({ d, end, color = INK, stop = false }: { d: string; end: [number, number, number]; color?: string; stop?: boolean }) {
  const [x, y, angle] = end;
  return <g><path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <path d={stop ? "M0 -7 V7" : "M-8 -4 L0 0 L-8 4"} fill="none" stroke={color} strokeWidth={2} transform={`translate(${x} ${y}) rotate(${angle})`} /></g>;
}
function Box({ x, y, w = 170, label, color = BLUE, he = false }: { x: number; y: number; w?: number; label: string; color?: string; he?: boolean }) {
  return <g><rect x={x - w / 2} y={y} width={w} height={38} rx={9} fill="white" stroke={color} strokeWidth={1.6} />
    {he ? <He x={x} y={y + 25} size={18} bold color={color}>{label}</He> : <La x={x} y={y + 25} size={18} bold color={color}>{label}</La>}</g>;
}

export function DiffusionDistanceTime() {
  // Physical coordinates: s in cm, t in seconds. Both axes use log10.
  const x = (logS: number) => 85 + (logS + 3.5) * 74;
  const y = (logT: number) => 454 - (logT + 3) * 34;
  const logT = (logS: number) => 2 * logS - Math.log10(4e-5);
  return <Canvas h={725} label="יחס איינשטיין בממד אחד: בגרף לוגריתמי כפול הזמן גדל כריבוע מרחק RMS. עשר מיקרומטר: 0.025 שנייה; עשרה סנטימטרים: 2.5 מיליון שניות, כ־695 שעות.">
    <He x={240} y={30} size={22} bold>מרחק קטן, הבדל עצום בזמן</He>
    <La x={240} y={67} size={20} bold color={BLUE}>s² = 2Dt   ·   D = 2×10⁻⁵ cm²/sec</La>
    <He x={240} y={101} size={16}>שני הצירים לוגריתמיים · זמן בשניות</He>
    <path d="M85 120 V454 H446" fill="none" stroke={INK} strokeWidth={2} />
    {[-2, 0, 2, 4, 6].map(e => <g key={e}><path d={`M79 ${y(e)} H85`} stroke={INK} strokeWidth={1.5} /><La x={72} y={y(e) + 5} anchor="end" size={15}>{`10${({[-2]:"⁻²",0:"⁰",2:"²",4:"⁴",6:"⁶"} as Record<number,string>)[e]}`}</La></g>)}
    {[-3, -2, -1, 0, 1].map((e, i) => <g key={e}><path d={`M${x(e)} 454 V462`} stroke={INK} strokeWidth={1.5} /><La x={x(e)} y={484} size={15}>{["10⁻³", "10⁻²", "10⁻¹", "10⁰", "10¹"][i]}</La></g>)}
    <He x={260} y={517} size={17}>מרחק בסנטימטרים</He>
    <La x={34} y={126} size={17} bold>t (sec)</La>
    <path d={`M${x(-3.4)} ${y(logT(-3.4))} L${x(1.2)} ${y(logT(1.2))}`} fill="none" stroke={BLUE} strokeWidth={3} />
    {[-3, 1].map(e => <circle key={e} cx={x(e)} cy={y(logT(e))} r={6} fill={ORANGE} />)}
    <La x={270} y={412} size={19} bold color={ORANGE}>10 µm → 0.025 sec</La>
    <path d={`M${x(-3) + 8} ${y(logT(-3))} H172 V389`} fill="none" stroke={ORANGE} strokeWidth={1.4} />
    <La x={250} y={186} size={19} bold color={ORANGE}>10 cm → 2.5×10⁶ sec</La>
    <He x={250} y={215} size={17} color={ORANGE}>כ־695 שעות</He>
    <path d={`M${x(1) - 9} ${y(logT(1))} H382 V157`} fill="none" stroke={ORANGE} strokeWidth={1.4} />
    <La x={173} y={282} size={18} color={BLUE}>t = s² / 2D</La>
    <rect x={35} y={550} width={410} height={99} rx={12} fill={tint.blue} />
    <He x={240} y={583} size={20} bold>המחיר הוא ריבוע המרחק</He>
    <La x={240} y={623} size={22} bold color={BLUE}>s ×10⁴  →  t ×10⁸</La>
    <He x={240} y={678} size={16}>מודל של פיזור אקראי בממד אחד</He>
    <He x={240} y={705} size={15} color={MUTED}>המרחק הוא RMS; זה אינו זמן הגעה של חלקיק יחיד</He>
  </Canvas>;
}

function Bilayer({ y, gap = false }: { y: number; gap?: boolean }) {
  return <g><rect x={27} y={y + 9} width={426} height={82} fill="#fef3c7" />
    {Array.from({ length: 22 }, (_, i) => 30 + i * 20).filter(x => !gap || x < 285 || x > 365).map(x => <g key={x}>
      <path d={`M${x-3} ${y+12} v28 m6 -28 v28 M${x-3} ${y+88} v-28 m6 28 v-28`} stroke="#b45309" strokeWidth={1.3} />
      <circle cx={x} cy={y+7} r={7} fill="#fcd34d" stroke={ORANGE} /><circle cx={x} cy={y+93} r={7} fill="#fcd34d" stroke={ORANGE} />
    </g>)}</g>;
}
export function MembranePermeability() {
  return <Canvas h={970} label="מקדם חדירות במודל המסיסות־דיפוזיה: חלוקה מן המים לשומן K, דיפוזיה בתוך הדו־שכבה D, עובי d. יון או מומס הידרופילי נעזר בתעלה או בנשא; נוסחת החדירות הפשוטה אינה מתארת מסלול חלבוני זה.">
    <Panel y={8} h={534} title="א. מעבר דרך הליפידים" />
    <La x={240} y={78} size={25} bold color={BLUE}>Ps = K·D/d</La>
    <He x={240} y={112} size={17}>מים: ריכוז גבוה מעל, נמוך מתחת</He>
    <Bilayer y={223} />
    {[95,150,205,265].map((x,i) => <path key={x} d={`M${x-9} ${162+i%2*22} l9 -6 9 6 -3 11 -12 0Z`} fill={GREEN} />)}
    {[123,198,253].map((x,i) => <path key={x} d={`M${x-8} ${255+i%2*27} l8 -6 8 6 -3 10 -10 0Z`} fill={GREEN} />)}
    <path d="M173 188 V218 M173 239 L188 252 L173 265 L188 279 L173 293 M173 326 V351" fill="none" stroke={GREEN} strokeWidth={2} />
    <Flow d="M173 351 V371" end={[173,371,90]} color={GREEN} />
    <path d="M164 393 l9 -6 9 6 -3 11 -12 0Z" fill={GREEN} />
    <He x={97} y={208} size={16} color={GREEN}>חלוקה לשומן</He>
    <La x={265} y={207} size={18} bold color={GREEN}>K</La>
    <La x={286} y={278} size={20} bold color={GREEN}>D</La>
    <path d="M429 230 H447 M438 230 V316 M429 316 H447" fill="none" stroke={INK} strokeWidth={1.5} />
    <La x={463} y={278} size={21} bold>d</La>
    <He x={311} y={359} size={16}>דיפוזיה בתוך הממברנה</He>
    <La x={240} y={446} size={18}>K = [S]lipid / [S]water</La>
    <La x={240} y={483} size={22} bold color={BLUE}>J = Ps·A·ΔS</La>
    <He x={240} y={517} size={16}>כאן J הוא קצב מעבר כולל, במול לשנייה</He>
    <Panel y={560} h={400} title="ב. מומס הידרופילי או טעון" />
    <He x={240} y={626} size={17}>חלוקה מועטה לשומן · מחסום למטען</He>
    <Bilayer y={703} gap />
    <circle cx={130} cy={660} r={13} fill={tint.blue} stroke={BLUE} strokeWidth={2} />
    <La x={130} y={666} size={19} color={BLUE}>+</La>
    <Flow d="M130 678 V696" end={[130,696,90]} color={BLUE} stop />
    <path d="M292 695 Q275 717 294 737 V778 Q275 798 292 811 L312 811 V695Z M358 695 Q375 717 356 737 V778 Q375 798 358 811 L338 811 V695Z" fill="#dbeafe" stroke={BLUE} strokeWidth={2} />
    <circle cx={325} cy={668} r={11} fill={tint.blue} stroke={BLUE} />
    <La x={325} y={674} size={18} color={BLUE}>+</La>
    <Flow d="M325 687 V829" end={[325,829,90]} color={BLUE} />
    <He x={130} y={850} size={16} color={BLUE}>מעבר ישיר נמוך מאוד</He>
    <He x={325} y={863} size={18} bold color={BLUE}>תעלה (מצוירת) או נשא</He>
    <He x={240} y={905} size={16}>המסלול החלבוני עוקף את הליבה ההידרופובית</He>
    <He x={240} y={935} size={15} color={MUTED}>ירוק: מומס הידרופובי · כחול: מומס טעון</He>
  </Canvas>;
}

export function SpineCordLevels() {
  const groups = [{ n:7, y:90, step:22, c:BLUE }, { n:12, y:250, step:21, c:TEAL }, { n:5, y:510, step:32, c:ORANGE }];
  return <Canvas h={1390} label="עמוד השדרה במבט צד: שבע צוואריות, שתים־עשרה חזיות, חמש מותניות, עצה וזנב. חוט השדרה מסתיים L1–L2, מתחתיו זנב הסוס. דקירה בדרך כלל L3–L4, פריצות דיסק L4–L5 או L5–S1. חתך עליון מוגדל מדגים חוליה, דיסק ושורשי עצב.">
    <Panel y={8} h={821} title="א. מבט צד · קדמי משמאל" />
    {groups.map(g => <g key={g.y}>{Array.from({length:g.n},(_,i) => {
      const yy=g.y+i*g.step,xx=125+18*Math.sin(yy/108);
      return <g key={i}><path d={`M${xx-24} ${yy} q23 -6 47 0 l3 ${g.step-6} q-26 6 -50 0Z M${xx+26} ${yy+5} l34 11 -33 3Z`} fill={tint.bone} stroke={g.c} strokeWidth={1.6} />
        <path d={`M${xx-23} ${yy+g.step-3} H${xx+25}`} stroke={PURPLE} strokeWidth={2} /></g>;
    })}</g>)}
    <path d="M115 681 Q150 666 166 690 L155 749 L140 779 L117 714Z" fill={tint.bone} stroke={ORANGE} strokeWidth={2} />
    {[696,710,724,738].map(y=><path key={y} d={`M128 ${y} l25 -2`} stroke={ORANGE} strokeWidth={1.2} />)}
    <path d="M140 779 q20 3 8 28 q-5 -11 -8 -28Z" fill={tint.bone} stroke={ORANGE} strokeWidth={2} />
    <path d="M171 87 C185 180 150 277 167 375 S186 500 171 546 L166 560 L160 546 C176 495 159 458 155 375 S177 178 159 87Z" fill="#ddd6fe" stroke={PURPLE} strokeWidth={2} />
    {[0,1,2,3,4,5,6].map(i=><path key={i} d={`M166 553 Q${148+i*6} 625 ${147+i*5} 742`} fill="none" stroke={PURPLE} strokeWidth={1.2} />)}
    <He x={328} y={114} size={19} bold color={BLUE}>צוואר · 7 חוליות</He><La x={328} y={143} size={18}>C1–C7</La>
    <He x={328} y={289} size={19} bold color={TEAL}>חזה · 12 חוליות</He><La x={328} y={319} size={18}>T1–T12</La>
    <He x={328} y={440} size={17} color={PURPLE}>חוט השדרה בתוך התעלה</He>
    <He x={328} y={493} size={19} bold color={ORANGE}>מותן · 5 חוליות</He><La x={328} y={520} size={18}>L1–L5</La>
    <path d="M179 554 H235" stroke={PURPLE} strokeWidth={1.5} /><La x={337} y={561} size={17} color={PURPLE}>L1–L2: conus</La>
    <path d="M180 604 H234" stroke={BLUE} strokeWidth={2} /><La x={297} y={610} size={17} bold color={BLUE}>L3–L4</La><He x={385} y={610} size={16} bold color={BLUE}>דקירה</He>
    <path d="M151 633 H233 M151 676 H233" stroke={RED} strokeWidth={2} />
    <La x={337} y={648} size={17} color={RED}>L4–L5 / L5–S1</La><He x={337} y={674} size={16} color={RED}>פריצות דיסק שכיחות</He>
    <He x={328} y={712} size={17} color={PURPLE}>זנב הסוס: שורשים בלבד</He>
    <He x={328} y={750} size={18} bold>עצה · 5 מאוחות</He><La x={328} y={776} size={17}>S1–S5</La>
    <He x={328} y={810} size={17}>עצם הזנב</He>
    <Panel y={846} h={532} title="ב. מבט מלמעלה · קדמי למעלה" />
    {/* A disc-level projection: the adjacent body is outlined behind the annulus. */}
    <ellipse cx={240} cy={972} rx={65} ry={45} fill={tint.bone} stroke={ORANGE} strokeWidth={2} />
    <ellipse cx={240} cy={972} rx={53} ry={34} fill="#e0e7ff" stroke={PURPLE} strokeWidth={2} />
    <ellipse cx={240} cy={972} rx={39} ry={24} fill="none" stroke={PURPLE} strokeWidth={1.3} />
    <ellipse cx={240} cy={972} rx={23} ry={15} fill="#c4b5fd" stroke={PURPLE} />
    <path d="M187 996 L181 1031 L114 1044 L119 1058 L184 1051 Q197 1082 223 1085 L229 1136 L249 1136 L257 1085 Q283 1082 296 1051 L361 1058 L366 1044 L299 1031 L293 996 L280 1007 L281 1036 Q279 1061 240 1064 Q200 1061 199 1036 L200 1007Z" fill={tint.bone} stroke={ORANGE} strokeWidth={2} />
    <ellipse cx={240} cy={1035} rx={28} ry={20} fill="#ddd6fe" stroke={PURPLE} />
    <path d="M219 1028 Q224 1022 232 1031 Q240 1024 248 1031 Q256 1022 261 1028 L257 1047 Q250 1051 243 1042 H237 Q230 1051 223 1047Z" fill={PURPLE} />
    <path d="M259 1043 Q300 1106 344 1094 L385 1070 M257 1027 Q295 988 337 1011 L385 1070 L423 1070" stroke={GREEN} strokeWidth={2.5} fill="none" />
    <ellipse cx={337} cy={1094} rx={13} ry={10} fill="#dcfce7" stroke={GREEN} strokeWidth={2} />
    <He x={98} y={927} size={17} color={ORANGE}>גוף החוליה</He><path d="M138 938 L175 951" stroke={ORANGE} strokeWidth={1.3} />
    <He x={376} y={916} size={16} color={PURPLE}>טבעת סיבית</He><path d="M346 925 L284 949" stroke={PURPLE} strokeWidth={1.3} />
    <He x={98} y={990} size={16} color={PURPLE}>ליבה ג׳לטינית</He><path d="M149 984 L213 973" stroke={PURPLE} strokeWidth={1.3} />
    <He x={80} y={1087} size={16}>זיז רוחבי</He><path d="M112 1074 L124 1057" stroke={ORANGE} strokeWidth={1.3} />
    <He x={154} y={1167} size={16}>זיז קוצי</He><path d="M188 1156 L227 1130" stroke={ORANGE} strokeWidth={1.3} />
    <He x={368} y={1126} size={16} color={GREEN}>שורש בטני · מוטורי</He>
    <path d="M300 1004 H430 V1101 M324 1102 H275 V1143 H345" fill="none" stroke={GREEN} strokeWidth={1.2} />
    <He x={368} y={1170} size={16} color={GREEN}>שורש גבי · תחושתי</He>
    <He x={368} y={1198} size={15} color={GREEN}>הבליטה בו: גנגליון</He>
    <He x={240} y={1237} size={16}>התעלה מקיפה את חוט השדרה (בסגול)</He>
    <He x={240} y={1266} size={15}>הדיסק מוקרן על הגוף; אינו באותו מישור חתך</He>
    <He x={240} y={1306} size={16} bold color={BLUE}>אפידורל: מחוץ לדורה · דקירה: אל נוזל השדרה</He>
    <He x={240} y={1342} size={15} color={MUTED}>הגבהים הם גבהי חוליות במבוגר, לא מקטעי עצב</He>
  </Canvas>;
}

export function ThoraxDiaphragm() {
  return <Canvas h={1260} label="בית החזה במבט קדמי: 12 זוגות צלעות, 1–7 אמיתיות עם סחוס נפרד, 8–10 סחוס משותף, 11–12 מרחפות. הסרעפת במבט מלמטה: וריד נבוב תחתון, ושט וגזעי ואגוס, אבי העורקים; עצבוב C3–C5.">
    <Panel y={8} h={711} title="א. בית החזה · מבט קדמי" />
    <He x={240} y={70} size={18} bold>12 זוגות צלעות</He>
    {/* Paired ribs are continuous bone laterally, cartilage medially. Floating ribs stop freely. */}
    <g transform="translate(-6 0) scale(.82 1)">{Array.from({length:12},(_,i)=> {
      const n=i+1,yy=115+i*31,wide=n<8?72+n*12:164-(n-8)*18,edge=240-wide;
      const medial=n<=7?222:n<=10?203-(n-8)*8:edge+45;
      const cy=yy+20;
      return <g key={n}>{[-1,1].map(sign=><g key={sign} transform={sign===1?undefined:"translate(480 0) scale(-1 1)"}>
        <path d={`M222 ${yy-12} C${edge+12} ${yy-45} ${edge-35} ${yy+17} ${medial-23} ${cy}`} fill="none" stroke={n<=7?ORANGE:n<=10?TEAL:PURPLE} strokeWidth={7} strokeLinecap="round" />
        {n<=7 ? <path d={`M${medial-23} ${cy} Q220 ${cy+5} 225 ${yy+12}`} fill="none" stroke="#38bdf8" strokeWidth={5} /> : n<=10 ? <path d={`M${medial-23} ${cy} Q${medial+12} ${cy+8} 221 323`} fill="none" stroke="#38bdf8" strokeWidth={4} /> : null}
      </g>)}<La x={36} y={yy+9} size={15} color={n<=7?ORANGE:n<=10?TEAL:PURPLE}>{n}</La></g>;
    })}
    <path d="M224 101 L256 101 L253 153 L227 153Z" fill={tint.bone} stroke={ORANGE} strokeWidth={2} />
    <path d="M229 154 H251 V320 L245 335 H235 L229 320Z M235 336 H245 L240 360Z" fill={tint.bone} stroke={ORANGE} strokeWidth={2} /></g>
    <path d="M204 126 H347 M203 247 H347 M196 351 H347" fill="none" stroke={MUTED} strokeWidth={1.2} />
    <He x={404} y={115} size={17} bold>ידית</He><La x={404} y={144} size={14}>manubrium</La>
    <He x={404} y={235} size={17} bold>גוף</He><La x={404} y={266} size={15}>body</La>
    <He x={404} y={339} size={17} bold>זיז החרב</He><La x={404} y={370} size={15}>xiphoid</La>
    <He x={240} y={546} size={17}>עצם החזה: ידית, גוף, זיז החרב</He>
    <La x={240} y={575} size={15}>manubrium · body · xiphoid</La>
    <He x={240} y={613} size={17} color={ORANGE}>כתום: 1–7 · כל זוג בסחוס משלו</He>
    <He x={240} y={646} size={17} color={TEAL}>ירוק: 8–10 · סחוס משותף לצלע 7</He>
    <He x={240} y={679} size={17} color={PURPLE}>סגול: 11–12 · קצה קדמי חופשי</He>
    <He x={240} y={704} size={14} color={BLUE}>תכלת: סחוס · עצם החזה במרכז</He>
    <Panel y={738} h={510} title="ב. הסרעפת · מבט מלמטה" />
    <He x={240} y={801} size={16}>קדמי למעלה · ימין הגוף משמאל בתמונה</He>
    <path d="M43 956 C27 864 125 824 205 856 Q240 834 275 856 C355 824 453 864 437 956 L366 1015 Q318 1003 284 980 L270 1002 L210 1002 L196 980 Q162 1003 114 1015Z" fill="#fee2e2" stroke={RED} strokeWidth={2.5} />
    {Array.from({length:12},(_,i)=>{const a=i*Math.PI/11;return <path key={i} d={`M${240+155*Math.cos(a)} ${935-75*Math.sin(a)} L${240+70*Math.cos(a)} ${937-28*Math.sin(a)}`} stroke="#fca5a5" strokeWidth={2} />;})}
    <path d="M147 910 Q168 867 217 893 Q240 874 263 893 Q312 867 333 910 L299 958 Q269 949 240 968 Q211 949 181 958Z" fill="#fff7ed" stroke="#ea580c" strokeWidth={1.5} />
    <ellipse cx={173} cy={915} rx={17} ry={14} fill="white" stroke={BLUE} strokeWidth={3} />
    <ellipse cx={264} cy={942} rx={16} ry={19} fill="white" stroke={ORANGE} strokeWidth={3} />
    <circle cx={248} cy={937} r={4} fill={GREEN} /><circle cx={280} cy={946} r={4} fill={GREEN} />
    <path d="M216 992 Q240 960 264 992" fill="white" stroke={RED} strokeWidth={3} />
    <ellipse cx={240} cy={1014} rx={20} ry={12} fill={tint.bone} stroke={ORANGE} strokeWidth={1.5} />
    <He x={240} y={1060} size={17} color={BLUE}>כחול: וריד נבוב תחתון · בגיד המרכזי</He>
    <He x={240} y={1094} size={17} color={ORANGE}>כתום: הוושט · ירוק: גזעי הוואגוס</He>
    <He x={240} y={1128} size={17} color={RED}>אדום: אבי העורקים · אחורי, בין הרגליות</He>
    <He x={240} y={1171} size={18} bold>עצב פרני: עצבוב מוטורי לסרעפת</He>
    <La x={240} y={1205} size={22} bold color={PURPLE}>C3–C5</La>
    <He x={240} y={1235} size={14} color={MUTED}>הפתחים פרושים להמחשה; מיקומם אינו מדידת מרחק</He>
  </Canvas>;
}

export function AtrophySignaling() {
  return <Canvas h={1450} label="מאזן איתותי הגדילה והאטרופיה: Akt מפעיל סינתזה ומונע כניסת FoxO לגרעין באמצעות זרחון ו־14-3-3. איתותי דחק ודלקת מעודדים את תכנית האטרוגנים. JunB ו־PGC-1α מצמצמים את פעילות FoxO3 על הפרומוטורים.">
    <Panel y={8} h={1430} title="בנייה מול פירוק: נקודת המפגש בגרעין" />
    <He x={130} y={78} size={20} bold color={GREEN}>אותות גדילה</He><He x={354} y={78} size={20} bold color={RED}>דחק ודלקת</He>
    <He x={130} y={119} size={18}>אינסולין / IGF-1</He>
    <Flow d="M130 134 V158" end={[130,158,90]} color={GREEN} /><Box x={130} y={168} label="PI3K" color={GREEN} />
    <Flow d="M130 217 V243" end={[130,243,90]} color={GREEN} /><Box x={130} y={253} label="Akt" color={GREEN} />
    <Flow d="M98 302 V334 H69 V358" end={[69,358,90]} color={GREEN} />
    <Flow d="M159 302 V334 H198 V358" end={[198,358,90]} color={GREEN} />
    <La x={70} y={391} size={18} bold color={GREEN}>mTORC1</La>
    <Flow d="M70 407 V439" end={[70,439,90]} color={GREEN} />
    <He x={88} y={471} size={17} bold color={GREEN}>סינתזת חלבון</He>
    <La x={201} y={391} size={17} bold color={PURPLE}>FoxO–P</La>
    <La x={201} y={425} size={18} color={PURPLE}>14-3-3</La>
    <He x={201} y={461} size={15} color={PURPLE}>מוחזק בציטופלזמה</He>
    <He x={354} y={122} size={17}>גלוקוקורטיקואידים</He>
    <La x={354} y={163} size={16} color={RED}>TNFα · IL-1 · IL-6</La>
    <Flow d="M354 179 V203" end={[354,203,90]} color={RED} /><Box x={354} y={213} label="NF-κB" color={RED} />
    <He x={354} y={300} size={17}>אנרגיה זמינה נמוכה</He><Box x={354} y={320} label="AMPK" color={RED} />
    <He x={354} y={405} size={17}>מיוסטטין</He><Flow d="M354 422 V447" end={[354,447,90]} color={RED} /><Box x={354} y={457} label="Smad2/3" color={RED} />
    <path d="M444 116 H458 V654 M444 232 H458 M444 339 H458 M444 476 H458" fill="none" stroke={RED} strokeWidth={1.5} />
    <Flow d="M201 480 V496 H21 V658 H128 V670" end={[128,670,90]} color={PURPLE} stop />
    <He x={240} y={537} size={17} bold>המסלולים הקטבוליים מתכנסים על התכנית</He>
    <He x={240} y={566} size={15}>גלוקוקורטיקואידים פועלים גם דרך קולטן גרעיני</He>
    <He x={240} y={598} size={15} color={RED}>AMPK מעכב mTORC1 ומעודד FoxO ואוטופגיה</He>
    <He x={240} y={627} size={15} color={RED}>מיוסטטין גם מחליש את אות Akt בעקיפין</He>
    <path d="M29 722 Q29 680 70 680 H410 Q451 680 451 722 V1230 Q451 1274 410 1274 H70 Q29 1274 29 1230Z" fill={tint.purple} stroke={PURPLE} strokeWidth={2} />
    <Flow d="M458 654 H420 V741" end={[420,741,90]} color={RED} />
    <He x={93} y={718} size={19} bold color={PURPLE}>גרעין</He>
    <La x={240} y={769} size={21} bold color={PURPLE}>FoxO3</La>
    <He x={240} y={800} size={16}>בהיעדר עיכוב בידי Akt: כניסה לגרעין</He>
    <He x={240} y={849} size={17} color={GREEN}>אימון / PGC-1α מפחיתים את פעילות FoxO3</He>
    <La x={119} y={910} size={21} bold color={GREEN}>JunB</La><La x={359} y={910} size={21} bold color={PURPLE}>FoxO3</La>
    <Flow d="M119 927 V952 H209" end={[209,952,0]} color={GREEN} stop />
    <Flow d="M359 927 V952 H271" end={[271,952,180]} color={PURPLE} />
    <He x={240} y={991} size={17}>ויסות מנוגד על אותם פרומוטורים</He>
    <Flow d="M359 1001 V1008" end={[359,1008,90]} color={PURPLE} />
    <path d="M78 1021 H402 M78 1030 H402" stroke={PURPLE} strokeWidth={3} />
    {[130,240,350].map(x=><rect key={x} x={x-28} y={1013} width={56} height={25} rx={5} fill="#ddd6fe" stroke={PURPLE} />)}
    <La x={240} y={1070} size={17}>MuRF1 · Atrogin-1</La>
    <He x={240} y={1114} size={20} bold color={RED}>תכנית האטרוגנים</He>
    <He x={240} y={1153} size={17}>יוביקוויטין · תת־יחידות פרוטאזום</He>
    <He x={240} y={1187} size={17}>ליגאזי E3 · גני אוטופגיה</He>
    <He x={240} y={1231} size={16}>פירוק חלבונים ואברונים → ירידה במסת השריר</He>
    <He x={240} y={1320} size={16}>ירוק: תמיכה בגדילה · אדום: הטיה לפירוק</He>
    <He x={240} y={1353} size={16}>ראש חץ: קידום · קצה שטוח: עיכוב</He>
    <He x={240} y={1385} size={15} color={MUTED}>JunB מונע גיוס FoxO3; לא בהכרח תחרות על אתר DNA זהה</He>
    <He x={240} y={1414} size={15} color={MUTED}>מודל מסכם: רשימת האותות אינה רצף יחיד בזמן</He>
  </Canvas>;
}

function Sarcomere({ x, y, w = 184, loose = false }: { x: number; y: number; w?: number; loose?: boolean }) {
  const half=w/2;
  return <g transform={`translate(${x} ${y})`}>
    {[0,w].map(z=><path key={z} d={`M${z} -38 l-5 12 10 12 -10 12 10 12 -5 20`} stroke={INK} strokeWidth={4} fill="none" />)}
    {[-24,24].map(dy=><g key={dy}>
      {Array.from({length:12},(_,i)=> <g key={i}><circle cx={i*7} cy={dy} r={2.5} fill={BLUE} /><circle cx={w-i*7} cy={dy} r={2.5} fill={BLUE} /></g>)}
      <path d={`M30 ${dy+12} H${w-30}`} stroke={RED} strokeWidth={6} strokeLinecap="round" />
      {Array.from({length:6},(_,i)=> <path key={i} d={`M${35+i*9} ${dy+12} l-5 -8 m${w-70-i*18} 8 l5 -8`} stroke={RED} strokeWidth={1.8} fill="none" />)}
    </g>)}
    <path d={`M${half} -10 V45`} stroke="#fda4af" strokeWidth={2} strokeDasharray="3 3" />
    {[0,w].map(z=><ellipse key={z} cx={z} cy={3} rx={13} ry={52} stroke={TEAL} strokeWidth={3} fill="none" strokeDasharray={loose?"7 9":undefined} />)}
  </g>;
}
function UbChain({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x} ${y+14} l8 -15 9 -16 8 -16`} stroke={ORANGE} strokeWidth={2} />{[0,1,2].map(i=><path key={i} d={`M${x+i*8-5} ${y-i*15-5} l8 -4 6 5 -3 8 -9 -1Z`} fill="#fbbf24" stroke={ORANGE} />)}</g>;
}
export function MyofibrilDisassembly() {
  return <Canvas h={1330} label="שתי פאזות בפירוק מיופיבריל משמאל לימין. תחילה ערעור הדזמין המקיף את קווי Z; אחר כך הסרת מייצבי הסיב העבה בידי MuRF1 לפני המיוזין, וסימון הסיבים הדקים בידי Trim32. p97/VCP מחלץ חלבון מסומן ומוסר אותו לפרוטאזום.">
    <Panel y={8} h={1309} title="סדר הפירוק: פתיחת המבנה לפני החילוץ" />
    <He x={120} y={84} size={20} bold color={TEAL}>א. ערעור דזמין</He><He x={359} y={84} size={20} bold color={RED}>ב. פירוק סיבים</He>
    <Flow d="M205 77 H270" end={[270,77,0]} />
    <Sarcomere x={36} y={179} w={168} /><Sarcomere x={276} y={179} w={168} loose />
    <He x={120} y={269} size={16} color={TEAL}>דזמין סביב קווי Z</He><He x={360} y={269} size={16}>הסרקומר נגיש לפירוק</He>
    <La x={120} y={321} size={20} bold>GSK3-β</La><He x={120} y={351} size={17}>זרחון דזמין</He>
    <Flow d="M120 366 V392" end={[120,392,90]} color={TEAL} />
    <La x={120} y={423} size={20} bold>Trim32</La><He x={120} y={453} size={17}>יוביקוויטינציה</He>
    <Flow d="M120 468 V494" end={[120,494,90]} color={TEAL} />
    <La x={120} y={525} size={20} bold>calpain-1</La><He x={120} y={555} size={17}>חיתוך תלוי סידן</He>
    <He x={360} y={319} size={18} bold color={RED}>הסיב העבה</He><La x={360} y={351} size={20} bold color={RED}>MuRF1</La>
    <La x={360} y={388} size={16}>MyLC1 · MyLC2</La><La x={360} y={415} size={17}>MyBP-C</La>
    <He x={360} y={448} size={16}>סימון והסרת המייצבים</He>
    <Flow d="M360 465 V495" end={[360,495,90]} color={RED} /><He x={360} y={526} size={18} bold color={RED}>רק אז: מיוזין עצמו</He>
    <La x={360} y={555} size={17} color={RED}>MyHC</La>
    <He x={120} y={618} size={16} color={TEAL}>רשת הביניים מתערערת</He>
    <He x={360} y={618} size={18} bold color={BLUE}>הסיב הדק</He><La x={360} y={651} size={20} bold color={BLUE}>Trim32</La>
    <He x={360} y={681} size={16} color={BLUE}>אקטין וחלבונים נלווים</He>
    <path d="M30 719 H450" stroke="#cbd5e1" strokeWidth={1.5} />
    <He x={240} y={758} size={20} bold>מסימון לחילוץ ולפירוק</He>
    <Sarcomere x={46} y={856} w={180} loose />
    <UbChain x={186} y={821} />
    <Flow d="M239 856 H267" end={[267,856,0]} color={ORANGE} />
    <path d="M284 830 L304 817 L324 830 L324 861 L304 874 L284 861Z" fill="#ccfbf1" stroke={TEAL} strokeWidth={2} />
    <ellipse cx={304} cy={845} rx={9} ry={12} fill="white" stroke={TEAL} />
    <path d="M302 808 Q330 786 345 811" fill="none" stroke={RED} strokeWidth={3} /><UbChain x={346} y={797} />
    <La x={304} y={921} size={19} bold color={TEAL}>p97/VCP</La>
    <He x={304} y={950} size={17}>חילוץ בעזרת ATP</He>
    <Flow d="M363 843 H405 V993 H279" end={[279,993,180]} color={ORANGE} />
    <g transform="translate(239 1039)">{[-26,-10,6,22].map((yy,i)=><path key={yy} d={`M-28 ${yy} q28 -12 56 0 v13 q-28 12 -56 0Z`} fill={i===1||i===2?"#ddd6fe":"#ccfbf1"} stroke={TEAL} strokeWidth={2} />)}</g><ellipse cx={239} cy={1004} rx={14} ry={5} fill="white" stroke={TEAL} />
    <He x={119} y={1043} size={19} bold>פרוטאזום</He><Flow d="M239 1092 V1120" end={[239,1120,90]} color={TEAL} />
    <path d="M194 1148 l17 -8 m12 17 l15 -9 m16 -4 l13 9" stroke={RED} strokeWidth={4} />
    <He x={240} y={1192} size={18}>פפטידים · לא בליעה של מיופיבריל שלם</He>
    <He x={240} y={1236} size={16}>כחול: דק · אדום: עבה · כהה: קווי Z</He>
    <He x={240} y={1268} size={16}>ירקרק: דזמין · כתום: יוביקוויטין</He>
    <He x={240} y={1299} size={15} color={MUTED}>מודל סדר אירועים · אורכים וכמות תגי Ub סכמטיים</He>
  </Canvas>;
}

function BloodCell({ x, y, kind }: { x: number; y: number; kind: string }) {
  if(kind==="rbc")return <g><ellipse cx={x} cy={y} rx={19} ry={13} fill="#fca5a5" stroke={RED} strokeWidth={2} /><ellipse cx={x} cy={y} rx={10} ry={6} fill="#fee2e2" /></g>;
  if(kind==="platelet")return <g>{[-12,0,13].map((dx,i)=><path key={dx} d={`M${x+dx-3} ${y+i%2*6} l4 -5 5 3 -1 6 -6 0Z`} fill="#c4b5fd" stroke={PURPLE} />)}</g>;
  return <g><circle cx={x} cy={y} r={kind==="mega"?25:19} fill={kind==="mono"?"#dbeafe":"#f5f3ff"} stroke={kind==="mono"?BLUE:PURPLE} strokeWidth={1.5} />
    {kind==="neutro"||kind==="mega" ? <path d={`M${x-11} ${y-5} q5 -10 10 0 q7 -10 13 -1 q2 7 -7 8 q-4 12 -10 3 q-12 1 -6 -10Z`} fill={PURPLE} /> : kind==="mono" ? <path d={`M${x+5} ${y-12} C${x-17} ${y-20} ${x-18} ${y+18} ${x+5} ${y+11} L${x-1} ${y+5} Q${x-8} ${y} ${x+5} ${y-12}Z`} fill={BLUE} /> : <ellipse cx={x} cy={y} rx={kind==="lymph"?13:9} ry={kind==="lymph"?13:12} fill={PURPLE} />}
    {["eos","baso","nk"].includes(kind)&&Array.from({length:9},(_,i)=><circle key={i} cx={x+13*Math.cos(i*2.3)} cy={y+13*Math.sin(i*2.3)} r={2.2} fill={kind==="eos"?ORANGE:PURPLE} />)}
  </g>;
}
export function HematopoieticLineages() {
  const rows=[{y:287,he:"אריתרוציטים",factor:"EPO",kind:"rbc"},{y:437,he:"מגקריוציט",factor:"TPO",kind:"mega"},{y:664,he:"נויטרופילים",factor:"G-CSF",kind:"neutro"},{y:814,he:"אאוזינופילים",factor:"IL-5",kind:"eos"},{y:964,he:"בזופילים",factor:"",kind:"baso"},{y:1114,he:"מונוציטים",factor:"M-CSF",kind:"mono"}];
  return <Canvas h={1420} label="עץ התמיינות סכמטי מתא גזע המטופויטי: מיאלואידי לאריתרוציטים, מגקריוציט וטסיות, גרנולוציטים ומונוציטים למקרופאגים; לימפואידי לתאי B, T ו־NK. גורמי הגדילה מצוינים ליד הענפים; B במח העצם, T בתימוס.">
    <Panel y={8} h={1399} title="תא גזע אחד · שושלות רבות" />
    <BloodCell x={240} y={87} kind="lymph" /><He x={240} y={133} size={20} bold>תא גזע המטופויטי</He>
    <Flow d="M223 151 V174 H131 V195" end={[131,195,90]} color={TEAL} /><Flow d="M257 151 V174 H354 V195" end={[354,195,90]} color={PURPLE} />
    <He x={131} y={224} size={20} bold color={TEAL}>מיאלואידי</He><He x={354} y={224} size={20} bold color={PURPLE}>לימפואידי</He>
    <path d="M35 248 V1114 M267 248 V851" stroke="#94a3b8" strokeWidth={2} />
    {rows.map(r=><g key={r.y}><Flow d={`M35 ${r.y} H83`} end={[83,r.y,0]} color={TEAL} /><BloodCell x={115} y={r.y} kind={r.kind} />
      {r.factor&&<La x={158} y={r.y-35} size={18} bold color={TEAL}>{r.factor}</La>}
      <He x={141} y={r.y+49} size={18} bold>{r.he}</He>
    </g>)}
    <Flow d="M115 503 V530" end={[115,530,90]} color={PURPLE} /><BloodCell x={115} y={556} kind="platelet" /><He x={141} y={600} size={18}>טסיות</He>
    <Flow d="M115 1178 V1206" end={[115,1206,90]} color={BLUE} /><BloodCell x={115} y={1237} kind="mono" /><He x={141} y={1281} size={18}>מקרופאגים ברקמה</He>
    {[{y:329,id:"B",place:"הבשלה במח העצם"},{y:589,id:"T",place:"הבשלה בתימוס"},{y:849,id:"NK",place:"תאי הרג טבעיים"}].map(r=><g key={r.id}>
      <Flow d={`M267 ${r.y} H309`} end={[309,r.y,0]} color={PURPLE} /><BloodCell x={340} y={r.y} kind={r.id==="NK"?"nk":"lymph"} />
      <La x={354} y={r.y+52} size={22} bold color={PURPLE}>{r.id}</La><He x={354} y={r.y+88} size={16}>{r.place}</He>
    </g>)}
    <La x={354} y={275} size={19} bold color={PURPLE}>IL-7</La>
    <La x={354} y={1009} size={17} bold color={TEAL}>GM-CSF</La>
    <He x={354} y={1044} size={16}>פעילות רחבה על</He><He x={354} y={1074} size={16}>תאי אב מיאלואידיים</He>
    <He x={354} y={1148} size={15} color={MUTED}>גורמי הגדילה פועלים</He><He x={354} y={1178} size={15} color={MUTED}>בכמה שלבי הבשלה</He>
    <He x={240} y={1335} size={16}>החצים מציינים מוצא והתמיינות, לא נדידה בדם</He>
    <He x={240} y={1370} size={15} color={MUTED}>העץ מפושט; IL-7 מסמן את הזרוע הלימפואידית בקורס</He>
  </Canvas>;
}

export function AnemiaClassification() {
  return <Canvas h={1060} label="סיווג אנמיה בשני צירים: MCV מיקרוציטי, נורמוציטי ומקרוציטי מול תגובת רטיקולוציטים נמוכה או גבוהה. חסר ברזל, מחלה כרונית, כליות, B12 ופולאט לעומת המוליזה ודימום. תלסמיה משלבת ייצור לא יעיל והמוליזה.">
    <He x={240} y={33} size={22} bold>גודל התא × תגובת מח העצם</He>
    <La x={52} y={92} size={20} bold>MCV</La>
    <He x={198} y={83} size={18} bold color={BLUE}>רטיקולוציטים נמוכים</He>
    <He x={198} y={112} size={16} color={BLUE}>תגובה לא מספקת: ייצור</He>
    <He x={387} y={83} size={18} bold color={RED}>רטיקולוציטים גבוהים</He>
    <He x={387} y={112} size={16} color={RED}>תגובה להרס או לאובדן</He>
    {[{y:146,h:201},{y:365,h:201},{y:584,h:172}].map(r=><g key={r.y}><rect x={103} y={r.y} width={177} height={r.h} rx={10} fill={tint.blue} /><rect x={290} y={r.y} width={180} height={r.h} rx={10} fill={tint.red} /></g>)}
    <He x={51} y={184} size={16} bold>מיקרוציטית</He><La x={51} y={215} size={15}>&lt;80 fL</La>
    <He x={192} y={184} size={17}>חסר ברזל</He>
    <He x={192} y={220} size={17}>תלסמיה: ייצור לא יעיל</He>
    <He x={192} y={261} size={16}>מחלה כרונית</He><He x={192} y={289} size={15}>(בחלק מהמקרים)</He>
    <He x={380} y={204} size={17}>תלסמיה עם המוליזה</He><He x={380} y={244} size={15}>התגובה משתנה לפי</He><He x={380} y={274} size={15}>חומרת המחלה והטיפול</He>
    <He x={51} y={408} size={16} bold>נורמוציטית</He><La x={51} y={438} size={15}>80–100 fL</La>
    <He x={192} y={409} size={17}>מחלה כרונית</He><He x={192} y={447} size={17}>אי־ספיקת כליות</He><He x={192} y={480} size={16}>חסר EPO</He>
    <He x={380} y={407} size={17} bold>רוב ההמוליזות</He><La x={380} y={442} size={17}>G6PD</La><He x={380} y={477} size={17}>אנמיה חרמשית</He><He x={380} y={522} size={17}>דימום חריף*</He>
    <He x={51} y={626} size={16} bold>מקרוציטית</He><La x={51} y={657} size={15}>&gt;100 fL</La>
    <He x={192} y={626} size={17}>חסר B12 / פולאט</He><He x={192} y={667} size={16}>פגיעה בסינתזת DNA</He>
    <He x={380} y={626} size={17}>רטיקולוציטוזה חזקה</He><He x={380} y={665} size={16}>בעקבות המוליזה</He><He x={380} y={695} size={16}>או אובדן דם</He><He x={380} y={731} size={15}>התאים הצעירים גדולים</He>
    <He x={240} y={805} size={17} bold>* דימום חריף: התגובה אינה מיידית</He>
    <He x={240} y={840} size={16}>בימים הראשונים הרטיקולוציטים עשויים עדיין לא לעלות</He>
    <He x={240} y={883} size={16}>יש להעריך תגובה מתוקנת לחומרת האנמיה</He>
    <He x={240} y={916} size={16}>ערך “תקין” עלול להיות נמוך מדי לנוכח האנמיה</He>
    <He x={240} y={966} size={16} color={MUTED}>מפת חשיבה קלינית · מצבים מעורבים עשויים לחצות תאים</He>
    <He x={240} y={1000} size={16} color={MUTED}>גבולות MCV מקובלים למבוגר; לא נתוני חולים</He>
    <He x={240} y={1034} size={15} color={MUTED}>המיקום מציין דפוס טיפוסי, לא אבחנה לפי שתי בדיקות בלבד</He>
  </Canvas>;
}

export const PHYSIOLOGY_GAP_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "diffusion-distance-time": { el: DiffusionDistanceTime, captionHe: "עקומה מחושבת ממודל איינשטיין החד־ממדי s²=2Dt עבור D=2×10⁻⁵ cm²/sec, ולא נתוני מדידה. s הוא מרחק RMS. שתי הנקודות הן דוגמאות התרגול: 10 µm ב־0.025 שנייה ו־10 cm ב־2.5×10⁶ שניות (694.4 שעות, מעוגל בקורס לכ־695). הגדלת המרחק פי 10⁴ מגדילה את הזמן פי 10⁸; הקו ישר משום ששני הצירים לוגריתמיים." },
  "membrane-permeability": { el: MembranePermeability, captionHe: "מודל מסיסות־דיפוזיה של מעבר דרך הדו־שכבה: K מתאר חלוקה בין שומן למים, D דיפוזיה בתוך הממברנה ו־d את עובייה. J=Ps·A·ΔS הוא קצב המעבר הכולל לפי סימון הקורס. התעלה מייצגת מסלול חלבוני נפרד; גם נשא יכול לאפשר מעבר. סכמטי, לא בקנה מידה; מספר המולקולות וצורת התעלה אינם נתוני ניסוי." },
  "spine-cord-levels": { el: SpineCordLevels, captionHe: "מפת אנטומיה סכמטית של מבוגר, לא בקנה מידה ולא הנחיה לביצוע פעולה רפואית. מספרי החוליות והגבהים הם פרטים אנטומיים; העקמומיות והמרווחים מפושטים. חוט השדרה מסתיים בדרך כלל L1–L2; מתחתיו שורשי זנב הסוס. L3–L4 הוא אתר שכיח לאפידורל ולדקירה מותנית, אך יעדיהן שונים. במבט העליון הדיסק מוקרן על גוף החוליה הסמוכה כדי להציג טבעת וליבה; אין זה חתך יחיד. השורשים והגנגליון מוצגים בצד אחד בלבד." },
  "thorax-diaphragm": { el: ThoraxDiaphragm, captionHe: "תרשים אנטומי מקורי וסכמטי, לא בקנה מידה. מוצגים 12 זוגות הצלעות והחיבורים הקדמיים: 1–7 בסחוס נפרד, 8–10 דרך קשת סחוסית משותפת ו־11–12 ללא חיבור קדמי. הסרעפת מוצגת מלמטה, גיד מרכזי בהיר ושריר ורדרד; פתח הווריד הנבוב בגיד, הוושט עם גזעי הוואגוס בשריר, ואבי העורקים מאחור בין הרגליות. אלה יחסים אנטומיים מפושטים, לא נתוני הדמיה. העצב הפרני מקורו C3–C5." },
  "atrophy-signaling": { el: AtrophySignaling, captionHe: "מודל מסכם של בקרת מסת השריר לפי יחידת הקורס; סכמטי, ללא נתונים כמותיים וללא קנה מידה. Akt מזרחן FoxO ומאפשר החזקתו בציטופלזמה בידי 14-3-3, ובענף נפרד מקדם סינתזה דרך mTORC1. אותות קטבוליים מתכנסים על תכנית האטרוגנים בדרכים שונות; אין להסיק שכל ציטוקין פועל רק דרך NF-κB. אימון ו־PGC-1α מגינים חלקית. JunB מצמצם את גיוס FoxO3 לאותם פרומוטורים; האיור אינו טוען לאתר קשירת DNA זהה או שכל הענפים פעילים יחד." },
  "myofibril-disassembly": { el: MyofibrilDisassembly, captionHe: "מודל דו־פאזי של פירוק מיופיבריל באטרופיה, משמאל לימין. הסרקומר כולל גבולות Z, סיבים דקים המעוגנים בהם וסיבים עבים מרכזיים עם ראשי מיוזין; דזמין סביב Z מקשר בין מיופיברילים. מוצג סדר זרחון–יוביקוויטינציה–חיתוך הדזמין, ולאחריו תפקידי MuRF1 ו־Trim32 וחילוץ חלבון מסומן בידי p97/VCP אל הפרוטאזום. סכמטי, לא בקנה מידה; אין כאן נתוני ניסוי, וכמות תגי היוביקוויטין אינה אורך שרשרת שנמדד." },
  "hematopoietic-lineages": { el: HematopoieticLineages, captionHe: "עץ התמיינות קלאסי ומפושט של ההמטופויאזה, לא נתוני מעקב אחר תא יחיד ולא בקנה מידה. צורות התאים מסמנות טיפוסים; שלבי ביניים רבים הושמטו. גורמי הגדילה מציינים השפעות עיקריות בקורס ואינם בלעדיים לשורה אחת: GM-CSF פועל רחב על תאי אב מיאלואידיים, ו־IL-7 מסמן את הזרוע הלימפואידית בלי לטעון שהוא לבדו מבשיל NK. מקום ההבשלה מוצג לפי הקורס: B במח העצם ו־T בתימוס. ההפיכה ממונוציט למקרופאג היא מסלול אחד ואינה מקורם של כל המקרופאגים התושבים." },
  "anemia-classification": { el: AnemiaClassification, captionHe: "מודל סיווג קליני, לא נתוני חולים: MCV במבוגר מול תגובת רטיקולוציטים מותאמת לחומרת האנמיה. הדוגמאות הן דפוסים טיפוסיים של הקורס. תלסמיה משלבת ייצור לא יעיל והמוליזה ולכן מופיעה בשתי עמודות עם הסתייגות; מחלה כרונית עשויה להיות נורמוציטית או מיקרוציטית. דימום חריף מקדים את עליית הרטיקולוציטים; רטיקולוציטוזה עצמה יכולה להעלות MCV. מצבים מעורבים, חומרת המחלה וטיפול עשויים לשנות את המיקום." },
};
