/* Textbook-level redraw by Codex (round 2, 2026-11-05); the previous version is archived in archive/figures/2026-11-05/. */
import { Svg, He, La } from "./helpers";

const B='#356b9c', G='#378b75', O='#b8793b', R='#bf514c';
// Original conceptual ribbons: not coordinates from an experimental structure.
function IgDomain({x,y,color,fill}:{x:number;y:number;color:string;fill:string}) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M0 -36 C-22 -35 -29 -11 -23 15 C-19 34 -4 43 12 32 C28 22 29 0 18 -23 C14 -33 8 -38 0 -36Z" fill={fill} stroke={color} strokeWidth={1.6}/>
    {[-13,0,13].map((v,i)=><path key={v} d={i%2?`M${v-7} -22 L${v-4} 9 L${v-9} 10 L${v} 26 L${v+6} 8 L${v+2} 9 L${v-1} -23Z`:`M${v-4} 20 L${v-7} -13 L${v-11} -11 L${v-4} -27 L${v+3} -13 L${v-1} -14 L${v+3} 18Z`} fill={color} opacity={.23+i*.1}/>)}
    <path d="M-17 23 Q-9 34 -3 24 M9 -26 Q16 -22 15 -12" stroke={color} fill="none" strokeWidth={1.5}/>
  </g>;
}
function Helix({x,y,len,color}:{x:number;y:number;len:number;color:string}){
  return <g transform={`translate(${x} ${y})`}>
    <path d={`M0 0 Q${len/2} -12 ${len} 0`} fill="none" stroke={color} strokeWidth={17} strokeLinecap="round"/>
    <path d={`M0 -3 Q${len/2} -15 ${len} -3`} fill="none" stroke="white" strokeOpacity={.5} strokeWidth={5} strokeLinecap="round"/>
    {Array.from({length:7},(_,i)=><path key={i} d={`M${i*len/7+2} -6 q8 -8 11 5`} stroke={color} strokeOpacity={.65} strokeWidth={2} fill="none"/>)}
  </g>
}
function Bilayer({y,anchors}:{y:number;anchors:number[]}){
  return <g>
    {Array.from({length:30},(_,i)=>37+i*14).filter(x=>anchors.every(a=>Math.abs(a-x)>8)).map(x=><g key={x}>
      <path d={`M${x-2} ${y+7} l-2 17 m6 -17 l3 17 M${x-2} ${y+37} l-2 -13 m6 13 l3 -13`} stroke="#aeb5a8" strokeWidth={1.5}/>
      <circle cx={x} cy={y+4} r={4.5} fill="#eadba8" stroke="#b8a36b"/><circle cx={x} cy={y+40} r={4.5} fill="#eadba8" stroke="#b8a36b"/>
    </g>)}
  </g>
}
function Groove({open,y}:{open:boolean;y:number}){
  const second=open?G:B;
  return <g transform={`translate(0 ${y})`}>
    <path d="M165 28 Q240 8 315 28 L315 69 Q240 85 165 69Z" fill={open?'#e5f2ec':'#e3eef6'} stroke="#9db3c0" strokeWidth={1}/>
    {Array.from({length:8},(_,i)=>175+i*18).map((x,i)=><path key={x} d={i%2?`M${x} 62 L${x} 31 l-5 0 8 -9 8 9 -5 0 0 31Z`:`M${x} 27 L${x} 59 l-5 0 8 10 8 -10 -5 0 0 -32Z`} fill={i<4?B:second} opacity={.3}/>)}
    <Helix x={166} y={21} len={146} color={B}/><Helix x={166} y={76} len={146} color={second}/>
    {!open&&<><path d="M164 22 Q146 47 165 75 M314 22 Q333 48 314 76" stroke={B} strokeWidth={9} fill="none"/><path d="M162 23 Q151 48 163 72" stroke="white" opacity={.4} strokeWidth={2} fill="none"/></>}
    <path d={open?'M129 46 C152 38 165 59 185 48 S215 37 234 48 S262 60 282 48 S319 37 350 46':'M174 48 C187 38 202 59 218 47 S245 38 263 48 S288 56 305 47'} stroke={R} fill="none" strokeWidth={8} strokeLinecap="round"/>
    <path d={open?'M129 43 C153 35 169 54 186 45 S216 35 234 45 S263 57 282 45 S320 34 350 43':'M174 45 C189 36 204 55 219 44 S246 36 263 45 S290 53 305 44'} stroke="#f3b4a0" fill="none" strokeWidth={2} strokeLinecap="round"/>
  </g>
}
function Panel({y,cls}:{y:number;cls:1|2}){
  const ii=cls===2, second=ii?G:B;
  return <g transform={`translate(0 ${y})`}>
    <rect x={16} y={14} width={448} height={582} rx={18} fill="#f8fafb" stroke="#dce4e8"/>
    <He x={240} y={49} size={22} bold>{ii?'MHC מחלקה II':'MHC מחלקה I'}</He>
    <He x={240} y={79} size={16} color="var(--muted)">{ii?'שתי שרשראות חוצות ממברנה: α ו־β':'שרשרת α ו־⁦β2⁩־מיקרוגלובולין'}</He>
    <He x={240} y={112} size={18} bold color={R}>{ii?'פפטיד ⁦13–25⁩':'פפטיד ⁦8–10⁩'}</He>
    <path d="M240 120 V140" stroke={R} strokeWidth={1.3}/>
    {/* A beta-sheet platform beneath two helical walls, shown obliquely. */}
    <path d="M161 166 Q240 146 319 166 L310 215 Q240 238 169 215Z" fill={ii?'#dfede6':'#dfeaf4'} stroke="#8ca7ba" strokeWidth={1.5}/>
    {Array.from({length:8},(_,i)=>172+i*18).map((x,i)=><path key={x} d={i%2?`M${x-2} 207 l2 -24 -4 0 8 -12 6 13 -4 -1 -2 24Z`:`M${x} 178 l-2 26 -4 -1 7 12 8 -9 -5 0 2 -27Z`} fill={i<4?B:second} opacity={.28}/>)}
    <Helix x={159} y={164} len={160} color={B}/>
    <path d={ii?'M144 188 C171 176 188 205 213 190 S247 174 270 190 S308 205 337 183':'M175 186 C195 175 211 204 232 190 S266 179 284 190 S300 193 307 185'} fill="none" stroke={R} strokeWidth={9} strokeLinecap="round"/>
    <Helix x={166} y={209} len={146} color={second}/>
    {!ii&&<path d="M158 167 Q148 189 166 209 M318 166 Q328 190 313 210" fill="none" stroke={B} strokeWidth={7}/>}
    {/* Lower Ig-like domains and the actual chain connectivity. */}
    <path d="M205 228 Q190 239 197 255" stroke={B} strokeWidth={5} fill="none"/>
    {ii&&<path d="M278 230 Q287 238 286 256" stroke={G} strokeWidth={5} fill="none"/>}
    <IgDomain x={197} y={276} color={B} fill="url(#mhc-blue)"/>
    <IgDomain x={286} y={276} color={ii?G:O} fill={ii?'url(#mhc-green)':'url(#mhc-orange)'}/>
    <path d="M197 312 Q192 327 197 340" fill="none" stroke={B} strokeWidth={5}/>
    {ii&&<path d="M286 312 Q294 327 286 340" fill="none" stroke={G} strokeWidth={5}/>}
    <Bilayer y={340} anchors={ii?[197,286]:[197]}/>
    {[197,...(ii?[286]:[])].map((x,i)=><g key={x}><path d={`M${x} 340 q-8 6 0 12 t0 12 t0 13 q-4 10 5 18 l10 9`} stroke={i?G:B} strokeWidth={7} fill="none" strokeLinecap="round"/><path d={`M${x-2} 341 q-6 5 0 11 t0 12 t0 12`} stroke="white" strokeOpacity={.5} strokeWidth={2} fill="none"/></g>)}
    <La x={91} y={161} size={18} bold color={B}>α1</La><path d="M109 157 H144" stroke={B} strokeWidth={1.4}/>
    <La x={388} y={205} size={18} bold color={second}>{ii?'β1':'α2'}</La><path d="M328 201 H365" stroke={second} strokeWidth={1.4}/>
    <La x={95} y={282} size={18} bold color={B}>{ii?'α2':'α3'}</La><path d="M113 277 H164" stroke={B} strokeWidth={1.4}/>
    <La x={390} y={282} size={18} bold color={ii?G:O}>{ii?'β2':'β2m'}</La><path d="M319 277 H365" stroke={ii?G:O} strokeWidth={1.4}/>
    <He x={95} y={330} size={16} color="var(--muted)">ממברנה</He>
    <He x={240} y={432} size={17} bold>{ii?'CD4 נקשר ל-β2':'CD8 נקשר ל-α3'}</He>
    <He x={240} y={461} size={16} color="var(--muted)">{ii?'מבט מלמעלה: החריץ פתוח בקצוות':'מבט מלמעלה: החריץ סגור בקצוות'}</He>
    <Groove open={ii} y={472}/>
    <He x={240} y={580} size={16} color="var(--muted)">{ii?'α1 + β1 יוצרים יחד את החריץ':'α1 + α2 מאותה שרשרת יוצרים את החריץ'}</He>
  </g>
}
export function MhcStructure(){
  return <Svg h={1260} label="מבנה MHC: במחלקה I — שרשרת α עם שלושה מקטעים ו-β2-מיקרוגלובולין; החריץ בין α1 ל-α2 סגור בקצוות וקושר פפטיד של 8–10 חומצות אמינו. במחלקה II — שרשראות α ו-β; החריץ בין α1 ל-β1 פתוח וקושר פפטיד ארוך יותר.">
    <defs>
      <linearGradient id="mhc-blue" x2="1" y2="1"><stop stopColor="#e6f0f8"/><stop offset=".5" stopColor="#bdd5e9"/><stop offset="1" stopColor="#83a8c9"/></linearGradient>
      <linearGradient id="mhc-green" x2="1" y2="1"><stop stopColor="#e4f3e7"/><stop offset="1" stopColor="#8cc6ae"/></linearGradient>
      <linearGradient id="mhc-orange" x2="1" y2="1"><stop stopColor="#fff0d8"/><stop offset="1" stopColor="#ddb783"/></linearGradient>
    </defs>
    <Panel y={0} cls={1}/><Panel y={612} cls={2}/>
    <He x={240} y={1240} size={16} color="var(--muted)">סכמטי, לא בקנה מידה; אדום: הפפטיד הקשור</He>
  </Svg>
}
