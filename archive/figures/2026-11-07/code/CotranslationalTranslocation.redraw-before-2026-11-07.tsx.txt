/* Textbook-level redraw by Codex (2026-11-02); the previous version is archived in archive/figures/2026-11-02/. */
import {Svg, He, La} from "./helpers";

// Original topology drawing. Molecular silhouettes are schematic, not atomic models.
const muted = 'var(--muted, #64748b)';
function Bilayer({y}:{y:number}) {
  return <g>
    <rect x={30} y={y} width={540} height={42} fill="url(#ct-lipid)" />
    {Array.from({length:36},(_,i)=>{const x=37+i*15;return <g key={i}>
      <path d={`M${x-3} ${y+7}l-2 10 3 4 M${x+3} ${y+7}l2 10-2 4 M${x-3} ${y+35}l-2-9 3-5 M${x+3} ${y+35}l2-9-2-5`} stroke="#c8a66a" strokeWidth={1.3} fill="none"/>
      <circle cx={x} cy={y+3} r={4.5} fill="#ead6a5" stroke="#b79b66" strokeWidth={1}/>
      <circle cx={x} cy={y+39} r={4.5} fill="#ead6a5" stroke="#b79b66" strokeWidth={1}/>
    </g>})}
  </g>;
}
function Ribosome({x,y}:{x:number;y:number}) {
  return <g transform={`translate(${x} ${y})`}>
    {/* The small subunit follows the mRNA; the large subunit contains the exit tunnel. */}
    <path d="M-53-57C-61-76-39-85-22-81C-11-95 12-88 17-77C39-84 57-69 49-54C42-44 19-44 6-47C-15-42-41-43-53-57Z" fill="url(#ct-small)" stroke="#537e99" strokeWidth={2}/>
    <path d="M-62-31C-70-49-53-59-38-55C-25-62-11-56-5-49C10-61 28-53 31-45C53-52 67-34 59-20C72-4 54 10 39 6C32 20 14 18 5 12C-10 24-30 13-31 5C-51 11-67-8-62-31Z" fill="url(#ct-ribo)" stroke="#537e99" strokeWidth={2}/>
    <path d="M-42-28Q-28-45-12-29 M22-24Q39-35 47-20 M-39-10Q-28 3-17-4" fill="none" stroke="#94b9c8" strokeWidth={2}/>
    <path d="M-4-37Q7-17 0 14" fill="none" stroke="#426b84" strokeWidth={9} opacity={.42} strokeLinecap="round"/>
    <path d="M-4-37Q7-17 0 14" fill="none" stroke="#f7fbfa" strokeWidth={4} strokeLinecap="round"/>
    <path d="M-91-49C-70-58-59-44-42-48S-4-43 18-47S55-53 85-43" fill="none" stroke="#9a6b9f" strokeWidth={3} strokeLinecap="round"/>
  </g>;
}
function SRP({x,y,rotate=0}:{x:number;y:number;rotate?:number}) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <path d="M-8 6Q8-9 29-12T70-26" fill="none" stroke="#755b96" strokeWidth={9} strokeLinecap="round"/>
    <path d="M-5 6Q9-5 17-2T35-13T53-15T72-27" fill="none" stroke="#c5b0da" strokeWidth={3}/>
    <path d="M-17 2C-22-12-9-22 1-16L9-9 3 3 13 9C3 25-14 20-17 2Z M61-34C61-46 78-45 83-34C89-21 75-14 67-20Z" fill="url(#ct-srp)" stroke="#73578d" strokeWidth={1.8}/>
  </g>;
}
function Receptor({x,y}:{x:number;y:number}) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-7 0L-8-31C-26-29-29-46-19-53C-10-60-3-52 3-48C11-56 26-46 22-34C19-24 9-27 7-23L7 0Z" fill="url(#ct-srp)" stroke="#73578d" strokeWidth={2}/>
  </g>;
}
function Channel({x,y,open=false}:{x:number;y:number;open?:boolean}) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-12-8C-31-15-39 0-34 16C-44 29-33 47-17 48L-7 40-9 23-5 8Z" fill="url(#ct-channel)" stroke="#4f866d" strokeWidth={2}/>
    <path d="M12-8C32-12 40 2 34 17C44 34 28 50 16 47L7 40 9 23 5 8Z" fill="url(#ct-channel)" stroke="#4f866d" strokeWidth={2}/>
    <path d="M-24 4Q-19 21-25 34 M25 3Q20 22 26 35" fill="none" stroke="#94bda1" strokeWidth={3}/>
    {!open&&<path d="M-9 22Q0 14 9 22L9 29-9 29Z" fill="#4f866d"/>}
  </g>;
}
function Panel({y,n,title,h=342}:{y:number;n:number;title:string;h?:number}){
 return <g><rect x={16} y={y} width={568} height={h} rx={18} fill="var(--panel, #fff)" stroke="var(--muted, #64748b)" strokeOpacity={.25}/><La x={47} y={y+33} size={23} bold>{n}</La><He x={316} y={y+33} size={22} bold>{title}</He></g>;
}
export function CotranslationalTranslocation(){
 return <Svg w={600} h={1260} label="תרגום וטרנסלוקציה ל-ER בשלושה שלבים: 1 — רצף האות יוצא מהריבוזום ו-SRP נקשר אליו; 2 — SRP מביא את הריבוזום לקולטן שלו ליד תעלת Sec61; 3 — SRP משתחרר, השרשרת מושחלת דרך התעלה לחלל ה-ER ופפטידאז האות חותך את האות">
  <defs>
   <linearGradient id="ct-ribo"><stop stopColor="#a8cbd9"/><stop offset=".48" stopColor="#e2f0f3"/><stop offset="1" stopColor="#8db4c7"/></linearGradient>
   <linearGradient id="ct-small" x2="0" y2="1"><stop stopColor="#d4e7ed"/><stop offset="1" stopColor="#8eafc6"/></linearGradient>
   <linearGradient id="ct-srp"><stop stopColor="#b29ac9"/><stop offset=".5" stopColor="#e3d5ed"/><stop offset="1" stopColor="#9a7eaf"/></linearGradient>
   <linearGradient id="ct-channel"><stop stopColor="#91bba0"/><stop offset=".5" stopColor="#d8e9d8"/><stop offset="1" stopColor="#7eaa8e"/></linearGradient>
   <linearGradient id="ct-lipid" x2="0" y2="1"><stop stopColor="#efdfb7"/><stop offset=".5" stopColor="#fff4d7"/><stop offset="1" stopColor="#efdfb7"/></linearGradient>
   <linearGradient id="ct-enzyme"><stop stopColor="#d6ab78"/><stop offset=".5" stopColor="#f1d9b0"/><stop offset="1" stopColor="#be8d60"/></linearGradient>
   <marker id="ct-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#7a658c"/></marker>
  </defs>
  <rect width={600} height={1260} fill="var(--paper, #f8fafc)"/>
  <He x={300} y={32} size={25} bold>טרנסלוקציה תוך תרגום</He>
  <He x={300} y={60} size={17} color={muted}>מחלבון שנוצר בציטוזול לחלבון בחלל ה־⁦ER⁩</He>
  <Panel y={79} n={1} title="זיהוי רצף האות"/>
  <Bilayer y={319}/>
  <Ribosome x={214} y={242}/>
  <path d="M214 218Q220 242 214 256L213 274" fill="none" stroke="#bd705a" strokeWidth={4} strokeLinecap="round"/>
  <path d="M213 274L203 295" stroke="#c66b44" strokeWidth={9} strokeLinecap="round"/>
  <SRP x={209} y={288} rotate={-20}/>
  <He x={460} y={145} size={18} color={muted}>ציטוזול</He>
  <He x={452} y={201} size={19} bold>ריבוזום</He>
  <path d="M279 210L355 197" stroke={muted} strokeWidth={1.2} fill="none"/>
  <La x={96} y={174} size={17} color="#b28ab5">mRNA</La>
  <La x={391} y={258} size={19} bold color="#b299cb">SRP</La>
  <path d="M285 266L356 253" fill="none" stroke={muted} strokeWidth={1.2}/>
  <He x={455} y={292} size={18}>רצף אות</He>
  <He x={370} y={389} size={18}>ו־⁦SRP⁩ נקשר — התרגום מואט</He>
  <He x={100} y={389} size={16} color={muted}>חלל ה־⁦ER⁩</He>

  <Panel y={439} n={2} title="עגינה בממברנת ה־ER"/>
  <Bilayer y={679}/>
  <Channel x={220} y={679}/>
  <Receptor x={326} y={704}/>
  <Ribosome x={220} y={626}/>
  <path d="M220 602Q226 626 220 640L237 655" fill="none" stroke="#bd705a" strokeWidth={4} strokeLinecap="round"/>
  <path d="M237 655L251 666" stroke="#c66b44" strokeWidth={9} strokeLinecap="round"/>
  <SRP x={254} y={652} rotate={17}/>
  <La x={455} y={519} size={18} color="#b299cb" bold>GTP</La>
  <He x={455} y={548} size={17}>על ⁦SRP⁩ ועל הקולטן</He>
  <He x={464} y={617} size={18} color="#b299cb">קולטן ⁦SRP⁩</He>
  <path d="M346 658L379 638" fill="none" stroke={muted} strokeWidth={1.2}/>
  <La x={220} y={757} size={18} bold color="#77a78d">Sec61</La>
  <He x={455} y={751} size={17} color={muted}>התעלה עדיין סגורה</He>

  <Panel y={799} n={3} title="העברה דרך התעלה וחיתוך האות" h={356}/>
  <Bilayer y={1039}/>
  <Channel x={220} y={1039} open/>
  <Ribosome x={220} y={1018}/>
  <path d="M220 994Q226 1018 220 1032V1084C208 1107 229 1117 239 1100L247 1088" fill="none" stroke="#bd705a" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M261 1047L261 1077" stroke="#c66b44" strokeWidth={9} strokeLinecap="round"/>
  <path d="M261 1077L257 1082" stroke="#bd705a" strokeWidth={4} strokeLinecap="round"/>
  {/* The enzyme is membrane anchored; its catalytic cleft faces the lumen. */}
  <path d="M293 1041Q310 1033 315 1047L315 1072C339 1080 324 1110 303 1105L287 1097 279 1089 290 1080Z" fill="url(#ct-enzyme)" stroke="#ab7d52" strokeWidth={2}/>
  <path d="M251 1077L258 1090 M258 1077L251 1090" fill="none" stroke="#a45643" strokeWidth={1.8}/>
  <SRP x={300} y={934} rotate={-5}/>
  <path d="M307 977Q344 968 350 943" fill="none" stroke="#9a7eaf" strokeWidth={2} markerEnd="url(#ct-arrow)"/>
  <La x={450} y={873} size={18} bold color="#b299cb">GTP → GDP + Pᵢ</La>
  <He x={459} y={911} size={18}>⁦SRP⁩ משתחרר</He>
  <He x={461} y={1006} size={17}>השרשרת מושחלת</He>
  <He x={465} y={1117} size={18}>האות נחתך</He>
  <He x={465} y={1140} size={16} color={muted}>(פפטידאז)</He>
  <He x={131} y={1127} size={16} color={muted}>חלל ה־⁦ER⁩</He>
  <He x={300} y={1172} size={17}>חיתוך בצד הלומינלי • המשך התרגום מעביר את השרשרת</He>
  <path d="M45 1201H76" stroke="#bd705a" strokeWidth={4} strokeLinecap="round"/>
  <He x={125} y={1207} size={16}>שרשרת</He>
  <path d="M197 1201H227" stroke="#c66b44" strokeWidth={8} strokeLinecap="round"/>
  <He x={284} y={1207} size={16}>רצף אות</He>
  <path d="M358 1201H389" stroke="#9a7eaf" strokeWidth={8} strokeLinecap="round"/>
  <He x={473} y={1207} size={16}>⁦SRP⁩ והקולטן</He>
  <He x={300} y={1243} size={15} color={muted}>איור מקורי סכמטי • מבני החלבונים והמרחקים אינם בקנה מידה</He>
 </Svg>;
}
