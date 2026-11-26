/* Original textbook-informed drawings. Sources, equations and review evidence:
   visual-lab/shared-gaps-a/. No clinical measurements are represented. */
import type React from "react";
import { useId } from "react";
import { La, BLUE, ORANGE, GREEN, INK, MUTED } from "./biochemFigures";

const RED = "#b13d53", PURPLE = "#7551a8", TEAL = "#187e86", LINE = "#cbd5e1";
const blush = "#fbe9e7", sky = "#eaf2fa", mint = "#e6f4ed", sand = "#fff3d7";
type Children = { children: React.ReactNode };
// One text node per line; WebKit needs RLM/LRM, not SVG bidi isolates.
function bidi(s: string) {
  return "\u200f" + s.replace(/[\u200e\u200f\u2066-\u2069]/g, "").replace(/\d+(?:[.,]\d+)?[–-]\d+(?:[.,]\d+)?|[A-Za-zαβπ][A-Za-zαβπ0-9₀-₉⁰-ⁿ⁻⁺₂₃]*(?:[ /+≈×·−–-]*[A-Za-zαβπ0-9₀-₉⁰-ⁿ⁻⁺₂₃]+)*/g, s => "\u200e" + s + "\u200e");
}
function He({ x, y, children, color = INK, size = 24, bold = false }: { x: number; y: number; children: string; color?: string; size?: number; bold?: boolean }) {
  return <text x={x} y={y} fontSize={size} textAnchor="middle" direction="rtl" fill={color} fontWeight={bold ? 700 : 400} style={{ fontFamily: "var(--font-hebrew), Arial, sans-serif" }}>{bidi(children)}</text>;
}
function L({ x, y, children, color = INK, bold = false }: { x: number; y: number; children: string; color?: string; bold?: boolean }) {
  return <La x={x} y={y} size={24} color={color} bold={bold}>{children}</La>;
}
function Canvas({ h, label, children }: Children & { h: number; label: string }) {
  return <svg viewBox={`0 0 720 ${h + 16}`} className="w-full h-auto" style={{ display: "block", width: "100%", height: "auto", background: "#fff", borderRadius: 12 }} role="img" aria-label={label}>
    {children}
  </svg>;
}
function Title({ children }: { children: string }) { return <He x={360} y={36} bold size={29}>{children}</He>; }
function Stroke({ d, color = INK, width = 2, dash }: { d: string; color?: string; width?: number; dash?: string }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />;
}
function Arrow({ d, x, y, angle = 0, color = INK, stop = false }: { d: string; x: number; y: number; angle?: number; color?: string; stop?: boolean }) {
  return <g><Stroke d={d} color={color} width={3} /><path d={stop ? "M0 -8 V8" : "M-10 -5 L0 0 L-10 5"} transform={`translate(${x} ${y}) rotate(${angle})`} fill={stop ? "none" : color} stroke={color} strokeWidth={2} /></g>;
}
function Badge({ x, y, w = 150, lines, color = BLUE, fill = sky }: { x: number; y: number; w?: number; lines: string[]; color?: string; fill?: string }) {
  const lineHeight = 38, h = 51 + (lines.length - 1) * lineHeight;
  return <g><rect x={x - w / 2} y={y} width={w} height={h} rx={16} fill={fill} stroke={color} strokeWidth={1.5} />{lines.map((s, i) => /[א-ת]/.test(s) ? <He key={i} x={x} y={y + 31 + i * lineHeight} color={color} bold>{s}</He> : <L key={i} x={x} y={y + 31 + i * lineHeight} color={color} bold>{s}</L>)}</g>;
}
function Key({ x, y, color, label }: { x: number; y: number; color: string; label: string }) { return <g><rect x={x} y={y - 16} width={16} height={16} rx={4} fill={color} /><He x={x + 38 + label.length * 5.8} y={y} color={color}>{label}</He></g>; }
function plot(f: (t: number) => number, x: (t: number) => number, y: (v: number) => number, a = 0, b = 1, n = 240) {
  return Array.from({ length: n + 1 }, (_, i) => { const t = a + (b - a) * i / n; return `${i ? "L" : "M"}${x(t).toFixed(2)} ${y(f(t)).toFixed(2)}`; }).join(" ");
}
function interp(points: number[][], t: number) {
  const k = points.findIndex(p => p[0] >= t);
  if (k <= 0) return points[k < 0 ? points.length - 1 : 0][1];
  const [a, b] = [points[k - 1], points[k]], q = (t - a[0]) / (b[0] - a[0]);
  const s = q * q * (3 - 2 * q);
  return a[1] + (b[1] - a[1]) * s;
}
function Bracket({ x, y1, y2, color = INK }: { x: number; y1: number; y2: number; color?: string }) { return <Stroke d={`M${x - 6} ${y1} H${x + 6} M${x} ${y1} V${y2} M${x - 6} ${y2} H${x + 6}`} color={color} />; }

function Heart({ x = 0, y = 0, scale = 1, conduction = false }: { x?: number; y?: number; scale?: number; conduction?: boolean }) {
  const uid = useId().replace(/:/g, "");
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <defs><linearGradient id={uid}><stop stopColor="#f3c4b4" /><stop offset=".5" stopColor="#f7dbcc" /><stop offset="1" stopColor="#c8797c" /></linearGradient></defs>
    <path d="M80 53 V8 H112 V59 M179 59 Q153 4 203 5 Q230 7 232 30 L210 37 Q202 18 193 28 L210 68" fill={sky} stroke="#6790af" strokeWidth={3} />
    <path d="M137 61 C106 25 50 47 43 96 C29 153 84 224 163 276 C233 234 265 156 250 105 C244 65 208 43 176 63 Q159 77 137 61Z" fill={`url(#${uid})`} stroke="#ab5b65" strokeWidth={3} />
    <path d="M135 88 Q88 49 65 88 Q43 118 81 139 L135 125Z" fill="#dbeaf4" stroke="#799fb6" strokeWidth={2} />
    <path d="M157 86 Q198 54 230 92 Q245 123 207 139 L158 124Z" fill={blush} stroke={RED} strokeWidth={2} />
    <path d="M134 144 L91 153 Q71 188 153 251 L143 151Z" fill={sky} stroke="#799fb6" strokeWidth={2} />
    <path d="M161 145 L204 153 Q245 173 168 252 L154 154Z" fill="#fff3ee" stroke={RED} strokeWidth={3} />
    <Stroke d="M145 137 Q134 203 163 267 M83 145 l19 9 18 -10 M172 145 l18 10 19 -9" color="#b77e77" width={3} />
    {conduction && <g><Stroke d="M78 73 Q95 66 131 93 L143 116 L153 145 L150 202 Q150 240 167 247 M131 93 Q173 60 211 98 M151 164 Q126 184 114 214 Q96 218 83 192 M153 164 Q181 186 195 226 Q217 208 222 180" color={ORANGE} width={4} />
      {[0, 1, 2, 3].map(i => <Stroke key={i} d={`M${112 + i * 7} ${202 + i * 8} l-23 -11 m${23} 11 l-9 -20 M${186 + i * 5} ${211 - i * 10} l20 -4`} color={ORANGE} width={2} />)}
      <circle cx={78} cy={73} r={8} fill={ORANGE} stroke="white" strokeWidth={2} /><circle cx={143} cy={116} r={8} fill={PURPLE} stroke="white" strokeWidth={2} />
    </g>}
  </g>;
}

function ECGConduction() {
  // A sum of five Gaussian deflections; schematic lead, no diagnostic scale.
  const gaussian = (t:number,center:number,sigma:number) => Math.exp(-Math.pow((t-center)/sigma,2));
  const ecg = (t: number) => .18*gaussian(t,.18,.033)-.18*gaussian(t,.345,.012)+1.2*gaussian(t,.37,.011)-.3*gaussian(t,.395,.014)+.34*gaussian(t,.68,.065);
  const x = (t: number) => 76 + 570 * t, y = (v: number) => 504 - 70 * v;
  return <Canvas h={747} label="מסלול ההולכה בלב וקשרו לגלי האק״ג: P עליות, QRS חדרים, T רה־פולריזציה של חדרים.">
    <Title>מהאות החשמלי לרישום האק״ג</Title>
    <Heart x={194} y={51} scale={1.04} conduction />
    <He x={106} y={101} color={ORANGE} bold>צומת SA</He><Stroke d="M174 96 H251" color={ORANGE} />
    <He x={103} y={156}>שתי העליות</He><Stroke d="M176 151 H267" color={ORANGE} />
    <He x={578} y={120} color={PURPLE} bold>צומת AV</He><He x={583} y={151}>עיכוב: כ־0.1 שנ׳</He><Stroke d="M353 172 H481 V137 H493" color={PURPLE} />
    <He x={585} y={210}>צרור היס</He><Stroke d="M357 205 H493" color={ORANGE} />
    <He x={105} y={250}>ענפי הצרור</He><Stroke d="M180 244 H299" color={ORANGE} />
    <He x={579} y={293}>סיבי Purkinje</He><Stroke d="M415 282 H477" color={ORANGE} />
    <He x={360} y={375} color={MUTED}>סדר ההולכה; האיור האנטומי אינו ציר זמן</He>
    <rect x={54} y={400} width={612} height={166} rx={15} fill="#f7fafc" />
    <Stroke d={plot(ecg, x, y)} color={TEAL} width={3} />
    <L x={x(.18)} y={464} color={TEAL} bold>P</L><L x={x(.37)} y={412} color={TEAL} bold>QRS</L><L x={x(.68)} y={453} color={TEAL} bold>T</L>
    <Stroke d={`M${x(.105)} 537 V547 H${x(.325)} V537 M${x(.43)} 527 V537 H${x(.56)} V527`} color={PURPLE} />
    <L x={x(.21)} y={579} color={PURPLE}>PR</L><L x={x(.495)} y={570} color={PURPLE}>ST</L>
    <He x={125} y={616} color={TEAL}>דה־פולריזציה</He><He x={125} y={646}>של העליות</He>
    <He x={356} y={616} color={TEAL}>דה־פולריזציה</He><He x={356} y={646}>של החדרים</He>
    <He x={586} y={616} color={TEAL}>רה־פולריזציה</He><He x={586} y={646}>של החדרים</He>
    <Stroke d="M190 476 V418 H92 V588 M287 432 H318 V588 M464 459 H653 V588" color={LINE} />
    <He x={360} y={690} color={MUTED}>PR: הולכה בעליות ועיכוב ב־AV</He><He x={360} y={729} color={MUTED}>ST: החדרים עברו דה־פולריזציה</He>
  </Canvas>;
}

function CardiacCycle() {
  // One 0.8-s cycle, beginning with ventricular filling. Smoothstep between
  // illustrative landmarks; isovolumetric portions have strictly constant volume.
  const ao = [[0, 90], [.30, 80], [.35, 80], [.47, 120], [.62, 95], [.64, 90], [.66, 94], [.8, 90]];
  const lv = [[0, 3], [.20, 5], [.28, 9], [.30, 10], [.35, 80], [.47, 120], [.62, 95], [.69, 10], [.73, 3], [.8, 3]];
  const la = [[0, 8], [.12, 5], [.24, 6], [.28, 12], [.30, 10], [.34, 12], [.4, 6], [.62, 13], [.69, 10], [.73, 7], [.8, 8]];
  const volume = [[0, 92], [.14, 115], [.24, 122], [.30, 135], [.35, 135], [.49, 83], [.62, 65], [.69, 65], [.8, 92]];
  // Filling wraps around the cycle boundary; at 0.69 the mitral valve reopens.
  const vol = (t: number) => t > .69 ? interp([[.69,65],[.8,92]],t) : interp(volume,t);
  const x = (t: number) => 92 + 535 * t / .8, yp = (v: number) => 352 - v * 1.63, yv = (v: number) => 531 - (v - 60) * 1.25;
  const phases = [[0,.3,"מילוי",sky],[.3,.35,"2",sand],[.35,.62,"הזרמה",blush],[.62,.69,"4",mint],[.69,.8,"מילוי",sky]] as const;
  return <Canvas h={760} label="מחזור לב שמאלי: לחץ אאורטלי, חדרי ועלייתי ונפח חדרי על ציר זמן משותף, עם מסתמים וקולות לב.">
    <Title>מחזור הלב השמאלי</Title>
    <Key x={72} y={76} color={RED} label="אאורטה" /><Key x={301} y={76} color={BLUE} label="חדר שמאל" /><Key x={534} y={76} color={PURPLE} label="עלייה" />
    {phases.map(([a,b,s,c],i)=><g key={i}><rect x={x(a)} y={101} width={x(b)-x(a)} height={450} fill={c} /><He x={(x(a)+x(b))/2} y={128}>{s}</He></g>)}
    <L x={51} y={111}>mmHg</L><Stroke d="M92 153 V352 H627" />
    {[0,40,80,120].map(v=><g key={v}><L x={53} y={yp(v)+8}>{String(v)}</L><Stroke d={`M86 ${yp(v)} H92`} /></g>)}
    <Stroke d={plot(t=>interp(ao,t),x,yp,0,.8)} color={RED} width={3} /><Stroke d={plot(t=>interp(lv,t),x,yp,0,.8)} color={BLUE} width={3} /><Stroke d={plot(t=>interp(la,t),x,yp,0,.8)} color={PURPLE} width={3} />
    <He x={359} y={400} bold>נפח חדר שמאל</He><L x={54} y={410}>mL</L>
    <Stroke d="M92 418 V538 H627" />{[65,135].map(v=><L key={v} x={52} y={yv(v)+8}>{String(v)}</L>)}
    <Stroke d={plot(vol,x,yv,0,.8)} color={ORANGE} width={3} />
    {[.30,.35,.62,.69].map(t=><g key={t}><Stroke d={`M${x(t)} 142 V367`} color="#95a2b5" dash="4 6" /><Stroke d={`M${x(t)} 418 V550`} color="#95a2b5" dash="4 6" /></g>)}
    <L x={x(.3)} y={582} bold>S1</L><L x={x(.62)} y={582} bold>S2</L><L x={624} y={581}>0.8 s</L>
    <He x={360} y={617}>2: התכווצות איזו־וולומטרית · 4: הרפיה איזו־וולומטרית</He>
    <He x={184} y={655}>S1: המיטרלי נסגר</He><He x={533} y={655}>S2: האאורטלי נסגר</He>
    <He x={183} y={691}>אחריו: האאורטלי נפתח</He><He x={535} y={691}>אחריו: המיטרלי נפתח</He>
    <He x={360} y={734} color={MUTED}>סימוני הגבול: סגירה → פתיחה בכל מעבר איזו־וולומטרי</He>
  </Canvas>;
}

function FrankStarling() {
  // Saturating illustrative ventricular function: SV=A(1-exp(-(EDV-40)/90)).
  const f = (v:number,a:number) => a*(1-Math.exp(-(v-40)/90));
  const x=(v:number)=>90+(v-40)*2.15,y=(v:number)=>470-v*2.5;
  return <Canvas h={670} label="עקומות פרנק־סטרלינג: העלאת EDV מזיזה לאורך אותה עקומה; שינוי כושר ההתכווצות מזיז את העקומה.">
    <Title>מילוי וכושר התכווצות</Title><He x={190} y={82} bold>נפח פעימה במ״ל</He>
    <Stroke d="M90 110 V470 H650" />
    {[0,50,100].map(v=><L key={v} x={54} y={y(v)+8}>{String(v)}</L>)}
    {[80,160,240].map(v=><g key={v}><Stroke d={`M${x(v)} 470 V478`} /><L x={x(v)} y={510}>{String(v)}</L></g>)}
    {[{a:135,c:ORANGE},{a:107,c:BLUE},{a:65,c:PURPLE}].map(o=><Stroke key={o.a} d={plot(v=>f(v,o.a),x,y,55,290)} color={o.c} width={3} />)}
    <He x={472} y={126} color={ORANGE} bold>גירוי סימפתטי</He><He x={572} y={204} color={BLUE} bold>תקין</He><He x={510} y={370} color={PURPLE} bold>אי־ספיקה סיסטולית</He>
    <Arrow d={`M${x(100)} ${y(f(100,107))+20} Q${x(130)} ${y(f(130,107))+31} ${x(160)} ${y(f(160,107))+20}`} x={x(160)} y={y(f(160,107))+20} angle={-25} color={BLUE} />
    <L x={x(135)} y={y(f(135,107))-17} color={BLUE}>●</L>
    <Arrow d={`M${x(185)} ${y(f(185,107))-9} V${y(f(185,135))+9}`} x={x(185)} y={y(f(185,135))+9} angle={-90} color={ORANGE} />
    <He x={360} y={552}>נפח סוף־דיאסטולי — EDV במ״ל</He>
    <He x={360} y={598} color={BLUE}>לאורך העקומה: טעינה מוקדמת עולה</He>
    <He x={360} y={638} color={ORANGE}>מעבר בין עקומות: כושר התכווצות משתנה</He>
  </Canvas>;
}

function VascularProfile() {
  // Seven systemic beds. Constant Q=83.3 cm³/s; velocity=Q/total area.
  const beds=["אאורטה","עורקים","עורקיקים","נימים","ורידונים","ורידים","נבובים"];
  const area=[3,20,100,2500,250,70,8], pressure=[95,90,55,25,12,6,2];
  const x=(t:number)=>102+t*90;
  const p=(t:number)=>interp(pressure.map((v,i)=>[i,v]),t)+(t<2.5 ? 18*Math.exp(-t*.9)*Math.sin(2*Math.PI*5*t):0);
  const a=(t:number)=>Math.exp(interp(area.map((v,i)=>[i,Math.log(v)]),t));
  return <Canvas h={760} label="פרופיל כלי הדם: לחץ יורד בעיקר בעורקיקים, שטח חתך כולל מרבי בנימים ומהירות מזערית בנימים.">
    <Title>אותה זרימה, שלוש תמונות</Title>
    {beds.map((s,i)=><g key={s}><rect x={x(i)-42} y={75} width={84} height={566} fill={i===3?mint:i===2?sand:i<3?blush:sky} /><He x={x(i)} y={91} size={24}>{i===6?"ורידים":s}</He>{i===6&&<He x={x(i)} y={129}>נבובים</He>}</g>)}
    <He x={360} y={149} color={RED} bold>לחץ הדם — מ״מ כספית</He>
    <Stroke d="M94 166 V302 H650" /><L x={57} y={191}>120</L><L x={58} y={310}>0</L>
    <Stroke d={plot(p,x,v=>302-v,0,6,600)} color={RED} width={2.5} />
    <He x={360} y={351} color={TEAL} bold>שטח החתך הכולל — סמ״ר</He>
    <Stroke d="M94 366 V477 H650" /><L x={51} y={388}>2500</L><L x={57} y={483}>0</L>
    <Stroke d={plot(a,x,v=>477-v*.039,0,6)} color={TEAL} width={3} />
    <He x={360} y={525} color={BLUE} bold>מהירות הזרימה — ס״מ לשנייה</He>
    <Stroke d="M94 542 V640 H650" /><L x={57} y={561}>30</L><L x={57} y={647}>0</L>
    <Stroke d={plot(t=>83.3/a(t),x,v=>640-v*3,0,6)} color={BLUE} width={3} />
    <L x={360} y={696} color={BLUE}>v = Q / A</L><He x={360} y={735} color={MUTED}>השטח הוא סכום כל כלי הדם המקבילים, לא כלי יחיד</He>
  </Canvas>;
}

function CapillaryStarling() {
  const uid=useId().replace(/:/g,"");
  return <Canvas h={660} label="מודל סטרלינג הקלאסי: לחץ הידרוסטטי יורד מ־35 ל־15, לחץ אונקוטי כ־25, סינון בקצה עורקי וספיגה בקצה ורידי; עודף ללימפה.">
    <defs><linearGradient id={uid} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d67a82" /><stop offset=".5" stopColor="#fff0ed" /><stop offset="1" stopColor="#d67a82" /></linearGradient></defs>
    <Title>חילוף נוזלים דרך דופן הנים</Title><He x={360} y={78} color={MUTED}>המודל הקלאסי בספרי הלימוד</He>
    <He x={150} y={131} color={RED} bold>קצה עורקי</He><He x={568} y={131} color={BLUE} bold>קצה ורידי</He>
    <path d="M72 173 Q63 215 72 257 H648 Q663 215 648 173Z" fill={`url(#${uid})`} stroke={RED} strokeWidth={2} />
    <ellipse cx={72} cy={215} rx={13} ry={42} fill={blush} stroke={RED} strokeWidth={2} />
    {[122,222,322,422,522,622].map(x=><ellipse key={x} cx={x} cy={174} rx={15} ry={4} fill="#bb6576" />)}
    <Arrow d="M100 216 H627" x={627} y={216} color={RED} />
    <L x={260} y={315} color={RED}>P_c ≈ 35 mmHg</L><L x={453} y={315} color={BLUE}>P_c ≈ 15 mmHg</L>
    <L x={360} y={364} color={PURPLE}>π_c ≈ 25 mmHg</L>
    <Arrow d="M170 269 V396" x={170} y={396} angle={90} color={RED} /><Arrow d="M548 396 V270" x={548} y={270} angle={-90} color={BLUE} />
    <He x={165} y={439} color={RED} bold>סינון החוצה</He><He x={555} y={439} color={BLUE} bold>ספיגה פנימה</He>
    <He x={360} y={484}>נוזל בין־תאי</He>
    <path d="M205 550 Q245 517 278 550 H626 V596 H278 Q245 627 205 596Z" fill={mint} stroke={GREEN} strokeWidth={2} />
    <Stroke d="M299 550 l16 23 -16 23 M460 550 l16 23 -16 23" color={GREEN} />
    <Arrow d="M364 497 V534" x={364} y={534} angle={90} color={GREEN} /><Arrow d="M498 573 H598" x={598} y={573} color={GREEN} />
    <He x={360} y={637} color={GREEN}>נים לימפה: עודף הנוזל חוזר למחזור הדם</He>
  </Canvas>;
}

function Baroreflex() {
  return <Canvas h={760} label="משוב שלילי אחרי ירידה בלחץ דם: פחות ירי ברורצפטורים, שינוי פעילות במדולה, עלייה בתפוקה ובהתנגדות והחזרת הלחץ.">
    <Title>רפלקס ברורצפטורים</Title>
    <Badge x={142} y={85} w={190} lines={["לחץ הדם יורד"]} color={RED} fill={blush} />
    <Arrow d="M247 111 H324" x={324} y={111} />
    <Badge x={510} y={75} w={340} lines={["סינוס קרוטיד וקשת האאורטה","פחות מתיחה → פחות ירי"]} color={TEAL} />
    <Arrow d="M510 170 V192" x={510} y={192} angle={90} />
    <Badge x={510} y={205} w={300} lines={["המרכז הקרדיווסקולרי","במדולה"]} color={PURPLE} fill="#f2edf9" />
    <Arrow d="M352 245 H284" x={284} y={245} angle={180} color={PURPLE} />
    <Badge x={150} y={202} w={250} lines={["סימפתטי עולה","פאראסימפתטי יורד"]} color={ORANGE} fill={sand} />
    <Stroke d="M150 297 V320 H590 M150 320 H95" color={ORANGE} width={3} />
    {[95,355,590].map(x=><Arrow key={x} d={`M${x} 320 V350`} x={x} y={350} angle={90} color={ORANGE} />)}
    <Badge x={110} y={366} w={190} lines={["לב","קצב וכוח עולים","CO עולה"]} color={RED} fill={blush} />
    <Badge x={360} y={366} w={240} lines={["עורקיקים","כיווץ","TPR עולה"]} color={ORANGE} fill={sand} />
    <Badge x={607} y={366} w={190} lines={["ורידים מתכווצים","החזר ורידי עולה","נפח פעימה עולה"]} color={BLUE} />
    <Stroke d="M110 501 V530 H607 V501" color={TEAL} width={3} /><Arrow d="M360 501 V565" x={360} y={565} angle={90} color={TEAL} />
    <Badge x={360} y={580} w={290} lines={["לחץ הדם עולה חזרה"]} color={GREEN} fill={mint} />
    <Arrow d="M207 606 H22 V161 H142 V147" x={142} y={147} angle={-90} color={GREEN} stop />
    <L x={360} y={690} bold>MAP ≈ CO × TPR</L><He x={360} y={734} color={GREEN}>התגובה מתנגדת לירידה הראשונית — משוב שלילי</He>
  </Canvas>;
}

function Spirogram() {
  // Volumes in L: RV=1.2, ERV=1.2, TV=.5, IRV=3.0; TLC=5.9.
  const f=(t:number)=>t<.44 ? 2.65-.25*Math.cos(t/.11*2*Math.PI) : t<.58 ? interp([[.44,2.4],[.58,5.9]],t):t<.78?interp([[.58,5.9],[.78,1.2]],t):interp([[.78,1.2],[.9,2.4],[1,2.65]],t);
  const x=(t:number)=>78+t*390,y=(v:number)=>470-v*58;
  return <Canvas h={730} label="נפחי ריאה: נשימות רגילות, שאיפה מרבית ונשיפה מרבית; TV, IRV, ERV, RV וקיבולות VC, TLC, FRC.">
    <Title>נפחי ריאה וקיבולות</Title><He x={211} y={80}>נפח ריאה בליטרים</He>
    <rect x={78} y={y(1.2)} width={390} height={470-y(1.2)} fill="#f1f0f7" />
    <Stroke d="M78 111 V470 H469" />
    {[0,1.2,2.4,2.9,5.9].map(v=><g key={v}><L x={40} y={y(v)+8}>{String(v)}</L><Stroke d={`M79 ${y(v)} H468`} color={LINE} dash="3 7" /></g>)}
    <Stroke d={plot(f,x,y)} color={TEAL} width={3} />
    <Bracket x={488} y1={y(5.9)} y2={y(2.9)} color={ORANGE} /><L x={541} y={244} color={ORANGE}>IRV</L>
    <Bracket x={488} y1={y(2.9)} y2={y(2.4)} color={BLUE} /><L x={546} y={322} color={BLUE}>TV</L>
    <Bracket x={488} y1={y(2.4)} y2={y(1.2)} color={PURPLE} /><L x={544} y={380} color={PURPLE}>ERV</L>
    <Bracket x={488} y1={y(1.2)} y2={470} color={MUTED} /><L x={543} y={448}>RV</L>
    <Bracket x={603} y1={y(5.9)} y2={y(1.2)} color={GREEN} /><L x={643} y={272} color={GREEN}>VC</L>
    <Bracket x={640} y1={y(2.4)} y2={470} color={PURPLE}/><L x={624} y={511} color={PURPLE}>FRC</L>
    <Bracket x={688} y1={y(5.9)} y2={470} color={INK}/><L x={688} y={511}>TLC</L>
    <He x={269} y={511}>זמן →</He><He x={189} y={551} color={BLUE}>TV = כ־500 מ״ל</He><He x={521} y={551}>RV = כ־1.2 ליטר</He>
    <L x={360} y={595} color={GREEN}>VC = IRV + TV + ERV = 4.7 L</L>
    <L x={360} y={636}>TLC = VC + RV = 5.9 L</L><L x={360} y={674}>FRC = ERV + RV = 2.4 L</L>
    <He x={360} y={715} color={MUTED}>RV, TLC ו־FRC אינם נמדדים בספירומטריה פשוטה</He>
  </Canvas>;
}

function CO2Transport() {
  const uid=useId().replace(/:/g,"");
  return <Canvas h={760} label="הובלת פחמן דו־חמצני ברקמה ובריאה: כ־10% מומס, כ־30% קשור להמוגלובין וכ־60% כביקרבונט; מעבר כלוריד והיפוכו.">
    <defs><radialGradient id={uid}><stop stopColor="#fff0e8"/><stop offset=".65" stopColor="#efb9b2"/><stop offset="1" stopColor="#cc7181"/></radialGradient></defs>
    <Title>מן הרקמות אל הריאות</Title>
    {[0,1].map(i=>{const o=i*355;return <g key={i} transform={`translate(${o} 0)`}>
      <He x={182} y={86} bold color={i?BLUE:RED}>{i?"נים בריאה":"נים ברקמה"}</He>
      <path d="M43 144 Q182 144 320 144 V552 Q180 568 43 552Z" fill={i?sky:blush} stroke={i?BLUE:RED} strokeWidth={2} />
      <He x={180} y={126}>{i?"נאדית: נשיפת CO₂":"תאי הרקמה מייצרים CO₂"}</He>
      <Arrow d={i?"M180 204 V153":"M180 153 V204"} x={180} y={i?153:204} angle={i?-90:90} color={TEAL} />
      <ellipse cx={180} cy={363} rx={125} ry={151} fill={`url(#${uid})`} stroke={RED} strokeWidth={3} />
      <He x={180} y={244} color="#78253e">תא דם אדום</He>
      <L x={180} y={280}>CO₂ + H₂O</L><L x={180} y={319} color={TEAL}>{i?"↑":"↓"}</L>
      <L x={180} y={359}>H⁺ + HCO₃⁻</L>
      <He x={180} y={399} color="#78253e">{i?"המוגלובין משחרר H⁺":"המוגלובין קושר H⁺"}</He>
      <L x={180} y={439} color="#124b51">carbonic anhydrase</L>
      <He x={180} y={477} color="#78253e">{i?"CO₂ נפרד מהמוגלובין":"CO₂ נקשר להמוגלובין"}</He>
      <L x={81} y={586} color={BLUE}>HCO₃⁻</L><L x={281} y={586} color={PURPLE}>Cl⁻</L>
      <He x={105} y={191} color={TEAL}>CO₂ מומס</He>
      <Arrow d={i?"M81 556 V533 H139 V490":"M139 490 V533 H81 V556"} x={i?139:81} y={i?490:556} angle={i?-90:90} color={BLUE} />
      <Arrow d={i?"M223 490 V533 H281 V556":"M281 556 V533 H223 V490"} x={i?281:223} y={i?556:490} angle={i?90:-90} color={PURPLE} />
      <He x={180} y={630}>{i?"היפוך מעבר הכלוריד":"מעבר הכלוריד לפנים התא"}</He>
    </g>;})}
    <He x={360} y={675} color={MUTED}>כ־10% מומס · כ־30% קשור להמוגלובין · כ־60% ביקרבונט</He>
    <He x={360} y={715} color={BLUE}>אפקט הלדיין: קישור חמצן בריאה מסייע לשחרור CO₂ ו־H⁺</He>
    <He x={360} y={750} color={MUTED}>קשירת CO₂ היא לחלבון; לא לאתר הקישור של החמצן</He>
  </Canvas>;
}

function Neuron({ x,y,color=BLUE }: {x:number;y:number;color?:string}) {return <g><path d={`M${x-12} ${y-5} l-11 -11 m11 11 l-15 4 m20 4 l-12 14 m14 -22 l6 -17`} fill="none" stroke={color} strokeWidth={2}/><path d={`M${x-12} ${y} q5 -18 15 -11 l13 11 -13 11 q-10 7 -15 -11Z`} fill={sky} stroke={color} strokeWidth={2}/></g>;}
function ANSPathways() {
  const rows=[{y:140,name:"סומטי",origin:"מוח וחוט שדרה",g:0,target:"שריר שלד",tx:"אצטילכולין",rx:"ניקוטיני"},{y:275,name:"פאראסימפתטי",origin:"גולגולתי / S2–S4",g:485,target:"איבר מטרה",tx:"אצטילכולין",rx:"מוסקריני"},{y:410,name:"סימפתטי",origin:"T1–L2",g:257,target:"איבר מטרה",tx:"נוראדרנלין",rx:"α / β"},{y:545,name:"סימפתטי לזיעה",origin:"T1–L2",g:257,target:"בלוטת זיעה",tx:"אצטילכולין",rx:"מוסקריני"},{y:680,name:"מדולת האדרנל",origin:"T1–L2",g:485,target:"אל הדם",tx:"אדרנלין",rx:""}];
  return <Canvas h={850} label="חמש דרכי יציאה מוטוריות: סומטית, פאראסימפתטית, סימפתטית, סימפתטית לזיעה ומדולת האדרנל; מוליכים וקולטנים.">
    <Title>ממערכת העצבים אל המטרה</Title><He x={105} y={79}>מקור מרכזי</He><He x={381} y={79}>גנגליון וסיבים היקפיים</He><He x={642} y={79}>מטרה</He>
    <rect x={24} y={99} width={165} height={641} rx={25} fill="#f2edf9" />
    {rows.map((r,i)=><g key={r.y}>
      <He x={112} y={r.y-13} bold color={i<2?BLUE:ORANGE}>{r.name}</He><He x={108} y={r.y+17}>{r.origin}</He>
      <Neuron x={163} y={r.y+48} color={i<2?BLUE:ORANGE}/>
      <Arrow d={`M182 ${r.y+48} H${r.g?r.g-24:570}`} x={r.g?r.g-24:570} y={r.y+48} color={i<2?BLUE:ORANGE}/>
      {r.g>0&&<g><ellipse cx={r.g} cy={r.y+48} rx={22} ry={26} fill={sand} stroke={ORANGE} strokeWidth={2}/><circle cx={r.g+3} cy={r.y+48} r={10} fill="#edc27d"/>
        <He x={r.g===257?320:408} y={r.y+13}>אצטילכולין</He><He x={r.g===257?320:408} y={r.y+91}>ניקוטיני</He>
        <Arrow d={`M${r.g+25} ${r.y+48} H570`} x={570} y={r.y+48} color={i===1?BLUE:i===4?GREEN:ORANGE}/>
      </g>}
      <rect x={585} y={r.y+22} width={112} height={54} rx={i===4?25:10} fill={i===4?mint:blush} stroke={i===4?GREEN:RED} strokeWidth={1.5}/>
      <He x={641} y={r.y+55}>{r.target}</He><He x={i===0?372:629} y={r.y+100} color={i===4?GREEN:RED}>{r.tx}</He>
      {r.rx&&<He x={637} y={r.y+5} color={RED}>{r.rx}</He>}
    </g>)}
    <He x={360} y={811} color={MUTED}>פאראסימפתטי: טרום ארוך, בתר קצר; בסימפתטי להפך</He>
    <He x={360} y={845} color={GREEN}>באדרנל: תאים כרומפיניים במקום נוירון בתר־גנגליוני</He>
  </Canvas>;
}

function Cord({x,y,s=1}:{x:number;y:number;s?:number}) {const uid=useId().replace(/:/g,"");return <g transform={`translate(${x} ${y}) scale(${s})`}>
  <defs><radialGradient id={uid}><stop stopColor="#fffdf4"/><stop offset=".8" stopColor="#f4e9cd"/><stop offset="1" stopColor="#d6c29d"/></radialGradient><linearGradient id={uid+'-gray'}><stop stopColor="#ddd6dd"/><stop offset="1" stopColor="#b7a7ba"/></linearGradient></defs>
  <path d="M0 -82 C-125 -104 -145 -5 -116 57 Q-65 107 -9 67 L0 43 L9 67 Q65 107 116 57 C145 -5 125 -104 0 -82Z" fill={`url(#${uid})`} stroke="#b8a680" strokeWidth={2}/>
  <path d="M0 -19 C-21 -23 -22 -67 -48 -65 Q-67 -49 -41 -18 C-95 -7 -84 57 -53 56 Q-28 54 -17 24 H17 Q28 54 53 56 C84 57 95 -7 41 -18 Q67 -49 48 -65 C22 -67 21 -23 0 -19Z" fill={`url(#${uid}-gray)`} stroke="#918598" strokeWidth={2}/>
  <circle r={5} fill="white" stroke="#918598"/>
 </g>;}
function StretchReflex() {
  const uid=useId().replace(/:/g,"");
  return <Canvas h={760} label="רפלקס הברך: כישור בארבע־ראשי, סיב Ia עם גוף תא בגנגליון שורש גבי, סינפסה ישירה לנוירון α וענף דרך אינטרנוירון מעכב לכופף.">
    <defs><linearGradient id={uid}><stop stopColor="#e59c98"/><stop offset=".35" stopColor="#f7d5bb"/><stop offset=".7" stopColor="#eeb8a6"/><stop offset="1" stopColor="#c47a83"/></linearGradient></defs>
    <Title>רפלקס המתיחה ועיכוב הדדי</Title>
    <Cord x={478} y={255} s={1.25}/><He x={476} y={121} bold>חוט השדרה — חתך</He><He x={479} y={382} color={MUTED}>חומר אפור</He>
    <path d="M87 280 Q55 392 99 510 L130 517 Q179 399 141 281Z" fill={`url(#${uid})`} stroke={RED} strokeWidth={2}/>
    <path d="M196 304 Q171 411 205 509 L233 505 Q264 399 236 303Z" fill={`url(#${uid})`} stroke={PURPLE} strokeWidth={2}/>
    {[98,108,118,128].map(x=><Stroke key={x} d={`M${x} 300 Q${x-20} 400 ${x+5} 492`} color="#bd7778"/>)}
    <path d="M99 510 L115 562 L129 516 M205 509 L178 562 L233 505" fill={sand} stroke="#ba9b68" strokeWidth={3}/>
    <ellipse cx={119} cy={568} rx={24} ry={20} fill={sand} stroke="#ba9b68" strokeWidth={2}/><Stroke d="M115 587 L175 671 M141 579 L205 657" color="#ba9b68" width={4}/>
    <ellipse cx={114} cy={352} rx={16} ry={40} fill={sand} stroke={TEAL} strokeWidth={2}/><Stroke d="M105 326 l18 9 -18 9 18 9 -18 9 18 9 -18 9" color={TEAL}/>
    <Arrow d="M114 312 V227 Q114 181 174 181 H365 Q391 181 416 209 L432 240" x={432} y={240} angle={64} color={TEAL}/>
    <ellipse cx={297} cy={154} rx={27} ry={22} fill={sand} stroke={TEAL} strokeWidth={1.5}/><circle cx={297} cy={154} r={11} fill={mint} stroke={TEAL} strokeWidth={2}/><Stroke d="M297 166 V181" color={TEAL}/>
    <He x={264} y={109} color={TEAL}>גנגליון שורש גבי</He><L x={180} y={216} color={TEAL}>Ia</L>
    <Arrow d="M430 248 V290" x={430} y={290} angle={90} color={TEAL}/><Neuron x={430} y={310} color={RED}/>
    <Arrow d="M418 324 Q393 448 160 448 H145" x={145} y={448} angle={180} color={RED}/>
    <Arrow d="M431 241 H505" x={505} y={241} color={TEAL}/><circle cx={526} cy={241} r={13} fill={PURPLE}/>
    <Arrow d="M532 257 V289" x={532} y={289} angle={90} color={PURPLE} stop/><Neuron x={532} y={310} color={PURPLE}/>
    <Arrow d="M546 321 Q617 468 270 468 H251" x={251} y={468} angle={180} color={PURPLE}/>
    <He x={625} y={88} color={PURPLE}>אינטרנוירון</He><He x={644} y={120} color={PURPLE}>מעכב</He>
    <He x={448} y={525} color={RED}>נוירוני α מוטוריים</He><He x={233} y={280} color={TEAL}>כישור שריר</He><Stroke d="M190 289 L132 318" color={TEAL}/>
    <He x={99} y={716} color={RED}>ארבע־ראשי מתכווץ</He><He x={478} y={716} color={PURPLE}>המסטרינג מעוכב</He>
    <Stroke d="M115 588 L143 627" color="#d5b891" width={5}/>
    <path d="M65 592 L129 612 L119 630 L55 610Z" fill="#94a3b8" stroke={INK} strokeWidth={2}/><Stroke d="M68 610 L35 659" width={4}/><He x={77} y={686}>מכה בגיד</He>
    <He x={468} y={586}>המסלול לשריר הפושט</He><He x={468} y={621}>כולל סינפסה מרכזית אחת</He><He x={360} y={753} color={MUTED}>חץ: עירור · קצה שטוח: עיכוב</He>
  </Canvas>;
}

function BasalGanglia() {
  return <Canvas h={780} label="המסלול הישיר והעקיף בגרעינים הבזאליים: עירור בכחול, עיכוב בסגול; דופמין מ־SNc מגרה D1 ומדכא D2.">
    <Title>לולאת הגרעינים הבזאליים</Title>
    <Badge x={360} y={67} w={480} lines={["קורטקס"]} color={BLUE}/>
    <Arrow d="M230 119 V176" x={230} y={176} angle={90} color={BLUE}/><Arrow d="M480 119 V176" x={480} y={176} angle={90} color={BLUE}/>
    <rect x={133} y={190} width={440} height={97} rx={35} fill="#e4f0ec" stroke={TEAL} strokeWidth={2}/><He x={353} y={220} bold color={TEAL}>סטריאטום</He><L x={230} y={265} color={TEAL}>D1</L><L x={480} y={265} color={TEAL}>D2</L>
    <He x={130} y={341} color={GREEN} bold>ישיר</He><He x={590} y={341} color={ORANGE} bold>עקיף</He>
    <Arrow d="M230 290 V512" x={230} y={512} angle={90} color={PURPLE} stop/>
    <Arrow d="M480 290 V353" x={480} y={353} angle={90} color={PURPLE} stop/>
    <Badge x={480} y={365} w={150} lines={["GPe"]} color={PURPLE} fill="#f2edf9"/>
    <Arrow d="M480 417 V454" x={480} y={454} angle={90} color={PURPLE} stop/>
    <Badge x={480} y={468} w={150} lines={["STN"]} color={ORANGE} fill={sand}/>
    <Arrow d="M480 520 V551 H343" x={343} y={551} angle={180} color={BLUE}/>
    <Badge x={230} y={526} w={195} lines={["GPi / SNr"]} color={PURPLE} fill="#f2edf9"/>
    <Arrow d="M230 579 V627" x={230} y={627} angle={90} color={PURPLE} stop/>
    <Badge x={230} y={640} w={195} lines={["תלמוס"]} color={BLUE}/>
    <Arrow d="M130 666 H54 V92 H108" x={108} y={92} color={BLUE}/>
    <Badge x={650} y={385} w={115} lines={["SNc"]} color={TEAL} fill={mint}/>
    <Arrow d="M650 381 V157 H530 V181" x={530} y={181} angle={90} color={TEAL} stop/>
    <Stroke d="M466 141 H494" color="white" width={8}/>
    <Arrow d="M650 157 H621 V141 H280 V181" x={280} y={181} angle={90} color={TEAL}/>
    <He x={641} y={469} color={TEAL}>דופמין</He>
    <Arrow d="M370 637 H412" x={412} y={637} color={BLUE}/><He x={473} y={646} color={BLUE}>עירור</He>
    <Arrow d="M370 681 H412" x={412} y={681} color={PURPLE} stop/><He x={473} y={690} color={PURPLE}>עיכוב</He>
    <He x={360} y={731} color={TEAL}>דופמין מחזק את הישיר ומחליש את העקיף</He><He x={360} y={768} color={MUTED}>פרקינסון: אובדן הקלט הדופמינרגי מ־SNc</He>
  </Canvas>;
}

function SomatosensoryPathways() {
  return <Canvas h={870} label="שני מסלולים עולים מאותו צד גוף: העמודה הגבית חוצה במדולה; הספינותלמי חוצה בחוט השדרה בקומיסורה הלבנה הקדמית.">
    <Title>תחושה מהגוף אל הקורטקס</Title>
    <He x={186} y={82} color={BLUE} bold>עמודה גבית</He><He x={186} y={113} color={BLUE}>למניסקוס מדיאלי</He><He x={538} y={82} color={ORANGE} bold>ספינותלמי</He><He x={538} y={113} color={ORANGE}>קדמי־צידי</He>
    {[0,1].map(i=>{const o=i*350,c=i?ORANGE:BLUE;return <g key={i} transform={`translate(${o} 0)`}>
      <path d="M83 193 Q51 155 98 146 Q120 122 144 146 Q171 117 198 140 Q250 129 265 172 L253 199Z" fill={blush} stroke="#bb9291" strokeWidth={2}/>
      <Stroke d="M106 151 q-17 24 3 36 M143 147 q-8 20 9 22 M184 146 q-11 15 6 32 M219 147 q-6 28 15 35" color="#bb9291"/>
      <ellipse cx={222} cy={293} rx={55} ry={32} fill={sand} stroke="#ba9b68" strokeWidth={2}/>
      <path d="M116 385 Q185 363 254 385 L239 467 Q182 491 126 464Z" fill={sand} stroke="#ba9b68" strokeWidth={2}/>
      <Cord x={185} y={637} s={.85}/>
      <Stroke d="M185 211 V257 M185 329 V370 M185 387 V467 M185 486 V560 M185 570 V704" color={MUTED} dash="5 7"/>
      <Arrow d="M222 255 V211" x={222} y={211} angle={-90} color={c}/><circle cx={222} cy={293} r={7} fill={c}/><Arrow d="M222 373 V334" x={222} y={334} angle={-90} color={c}/>
      {i===0?<g><Arrow d="M136 575 V454" x={136} y={454} angle={-90} color={c}/><circle cx={136} cy={439} r={7} fill={c}/><Arrow d="M142 429 Q181 428 222 393" x={222} y={393} angle={-44} color={c}/><Arrow d="M55 692 Q82 682 136 650 V594" x={136} y={594} angle={-90} color={c}/></g>:<g><Arrow d="M55 692 Q96 673 136 615" x={136} y={615} angle={-54} color={c}/><circle cx={142} cy={601} r={7} fill={c}/><Arrow d="M148 613 Q176 680 222 657 V391" x={222} y={391} angle={-90} color={c}/></g>}
      <He x={101} y={246}>S1</He><L x={94} y={302}>VPL</L>
      <He x={183} y={751} color={c}>{i?"כאב וטמפרטורה":"מגע עדין, רטט ומנח"}</He><He x={178} y={783} color={c}>{i?"חצייה בקומיסורה קדמית":"עלייה באותו צד בחוט"}</He><He x={178} y={817} color={c}>{i?"בטווח 1–2 מקטעים":"חצייה במדולה"}</He>
    </g>;})}
    <He x={358} y={356}>תלמוס</He><He x={358} y={501}>מדולה</He><He x={360} y={553}>חוט השדרה</He>
    <He x={360} y={853} color={MUTED}>קו מקווקו: קו האמצע · שתי הכניסות מאותו צד גוף</He>
  </Canvas>;
}

export const SHARED_PHYSIO_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "sh-ecg-conduction": {el:ECGConduction,captionHe:"האות מתקדם מצומת SA דרך העליות וצומת AV אל מערכת היס–פורקינייה. האק״ג מסכם את הפעילות החשמלית: P של העליות, QRS ו־T של החדרים; הרישום אינו מדידה קלינית. ערכים להמחשה."},
  "sh-cardiac-cycle": {el:CardiacCycle,captionHe:"לחצים ונפח בחדר השמאלי לאורך מחזור אחד, על ציר זמן משותף. נפח סוף־דיאסטולי כ־135 מ״ל ונפח סוף־סיסטולי כ־65 מ״ל; העקומות מחושבות מנקודות ציון לימודיות. ערכים להמחשה."},
  "sh-frank-starling": {el:FrankStarling,captionHe:"עלייה בטעינה המוקדמת מזיזה את נקודת העבודה לאורך אותה עקומה. גירוי סימפתטי מעלה את העקומה ואי־ספיקה סיסטולית מורידה אותה, בהנחת עומס וקצב קבועים. ערכים להמחשה."},
  "sh-vascular-profile": {el:VascularProfile,captionHe:"לאורך המחזור המערכתי הלחץ יורד בעיקר בעורקיקים, והדופק דועך. בנימים שטח החתך הכולל מרבי והמהירות מזערית; המהירות חושבה מספיקה קבועה חלקי שטח החתך. ערכים להמחשה."},
  "sh-capillary-starling": {el:CapillaryStarling,captionHe:"זהו מודל סטרלינג הקלאסי בספרי הלימוד: סינון בקצה העורקי וספיגה בקצה הוורידי, עם החזרת עודף הנוזל בלימפה. היחידה מפרטת את העיקרון המעודכן, שבו ברוב הרקמות במצב יציב אין ספיגה ורידית מתמשכת; כאן הושמטו הלחצים הבין־תאיים. סכמטי."},
  "sh-baroreflex": {el:Baroreflex,captionHe:"ירידה בלחץ הדם מפחיתה את ירי קולטני המתיחה ומפעילה תגובה במדולה. הלב, העורקיקים והוורידים תורמים להעלאת הלחץ בתוך שניות; זהו משוב שלילי. סכמטי."},
  "sh-spirogram": {el:Spirogram,captionHe:"עקבת נשימה מחושבת עם נשימות רגילות, שאיפה מרבית ונשיפה מרבית. נפח השארית כ־1.2 ליטר; הוא, TLC ו־FRC אינם נמדדים בספירומטריה פשוטה. ערכים להמחשה."},
  "sh-co2-transport": {el:CO2Transport,captionHe:"ברקמות נוצר ביקרבונט בתא הדם האדום, הוא יוצא תמורת Cl⁻ ו־H⁺ נקשר להמוגלובין. בריאות התהליך מתהפך וקישור חמצן מסייע לשחרור CO₂ ו־H⁺ — אפקט הלדיין; החלוקה 10/30/60 אחוזים מקורבת לפי היחידה. סכמטי."},
  "sh-ans-pathways": {el:ANSPathways,captionHe:"במסלול הסומטי נוירון אחד; בפאראסימפתטי הגנגליון ליד האיבר, ובמסלול הסימפתטי המוצג הוא בשרשרת סמוך לחוט השדרה. בזיעה המוליך הבתר־גנגליוני הוא אצטילכולין; באדרנל התאים הכרומפיניים מפרישים אדרנלין ונוראדרנלין לדם. סכמטי."},
  "sh-stretch-reflex": {el:StretchReflex,captionHe:"מכה בגיד הפיקה מותחת את כישורי הארבע־ראשי. סיב Ia מפעיל ישירות נוירון α לאותו שריר, ובענף נוסף מפעיל אינטרנוירון המעכב את השריר הנוגד; גנגליון השורש הגבי מכיל את גוף התא התחושתי. סכמטי."},
  "sh-basal-ganglia": {el:BasalGanglia,captionHe:"המסלול הישיר מפחית את העיכוב הטוני על התלמוס; העקיף מגביר אותו דרך GPe ו־STN. דופמין מ־SNc תומך בתנועה דרך D1 במסלול הישיר ו־D2 בעקיף; מוצג מודל מעגלים מפושט. סכמטי."},
  "sh-somatosensory-pathways": {el:SomatosensoryPathways,captionHe:"שני המסלולים מתחילים באותו צד גוף ומגיעים לקורטקס הנגדי. העמודה הגבית חוצה במדולה אחרי הסינפסה הראשונה; המסלול הקדמי־צידי חוצה בקומיסורה הלבנה הקדמית בחוט השדרה, בדרך כלל בטווח מקטע או שניים מהכניסה. סכמטי."},
};
