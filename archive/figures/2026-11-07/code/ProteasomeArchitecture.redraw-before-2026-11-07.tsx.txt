/* Textbook-level redraw by Codex (round 2, 2026-11-05); the previous version is archived in archive/figures/2026-11-05/. */
import { Svg, He, La } from "./helpers";
const BLUE='#3c7196',PURPLE='#786699',TEAL='#378f85',ORANGE='#b66e3b',GOLD='#ab7928',RED='#bf514d';
function Ub({x,y,a=0}:{x:number;y:number;a?:number}){
  return <g transform={`translate(${x} ${y}) rotate(${a})`}>
    <path d="M-12 -7 Q-9 -16 0 -12 Q9 -16 13 -7 Q19 0 12 7 Q10 15 1 12 Q-9 17 -13 8 Q-20 1 -12 -7Z" fill="url(#pa-ub)" stroke={RED} strokeWidth={1.2}/>
    <path d="M-9 -2 l5 -5 4 9 5 -8 4 8" stroke={RED} strokeWidth={1} fill="none" opacity={.55}/>
  </g>
}
function Badge({x,y,n}:{x:number;y:number;n:number}){
  return <g><circle cx={x} cy={y} r={12} fill="#fff" stroke="#8799a7" strokeWidth={1.3}/><La x={x} y={y+5} size={16} bold>{n}</La></g>
}
function Lobe({x,y,fill,stroke,a=0,s=1}:{x:number;y:number;fill:string;stroke:string;a?:number;s?:number}){
  return <path transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`} d="M-15 -25 C-30 -15 -28 6 -17 22 C-8 38 12 32 20 17 C31 4 26 -15 12 -24 C2 -30 -6 -34 -15 -25Z" fill={fill} stroke={stroke} strokeWidth={1.4}/>
}
// A longitudinal cutaway: the near-facing subunits are omitted, exposing the chamber.
function CoreRing({y,beta}:{y:number;beta:boolean}){
  const c=beta?ORANGE:BLUE,f=beta?'url(#pa-beta)':'url(#pa-alpha)';
  return <g>
    <path d={`M155 ${y-12} Q240 ${y-50} 325 ${y-12} L325 ${y+29} Q240 ${y+57} 155 ${y+29}Z`} fill={beta?'#f4e7d7':'#e5edf3'} stroke={c} strokeWidth={1.4}/>
    {[{x:176,dy:-6,a:-18},{x:217,dy:-17,a:-6},{x:261,dy:-17,a:6},{x:304,dy:-6,a:18}].map((v,i)=><Lobe key={i} x={v.x} y={y+v.dy} a={v.a} fill={f} stroke={c} s={.94}/>)}
    <path d={`M204 ${y-9} Q240 ${y-18} 276 ${y-9} L276 ${y+34} Q240 ${y+49} 204 ${y+34}Z`} fill="#fff9e8" stroke="none"/>
    <Lobe x={162} y={y+18} a={-12} fill={f} stroke={c}/><Lobe x={318} y={y+18} a={12} fill={f} stroke={c}/>
    <path d={`M188 ${y+38} Q194 ${y+46} 204 ${y+39} M276 ${y+39} Q287 ${y+46} 291 ${y+38}`} fill="none" stroke={c} strokeWidth={1.3}/>
  </g>
}
function LegendLine({y,n,head,tail,color}:{y:number;n:number;head:string;tail:string;color:string}){
  return <g><Badge x={40} y={y-6} n={n}/><He x={443} y={y} anchor="end" size={18} bold color={color}>{head}</He><He x={443} y={y+27} anchor="end" size={16} color="var(--muted)">{tail}</He></g>
}
export function ProteasomeArchitecture(){
  return <Svg h={1460} label="חתך של הפרוטאזום 26S: הליבה 20S בנויה מארבע טבעות — אלפא, בטא, בטא, אלפא. טבעות הבטא הפנימיות נושאות שלושה סוגי אתרים פעילים, ובסך הכול שישה אתרים, שהנוקלאופיל בהם הוא תראונין. טבעות האלפא החיצוניות סוגרות את השער. מעל הליבה יושב המכסה 19S: טבעת של שש ATPases שפותחות את השער ופורשות את המצע, הקולטנים ליוביקוויטין, ו-Rpn11 שמסיר את השרשרת.">
    <defs>
      <linearGradient id="pa-alpha" x1="0" x2="1" y1="0" y2=".7"><stop stopColor="#e0eaf1"/><stop offset=".38" stopColor="#bed1de"/><stop offset="1" stopColor="#7d9fb8"/></linearGradient>
      <linearGradient id="pa-beta" x2="1" y2=".8"><stop stopColor="#f5e3cd"/><stop offset=".42" stopColor="#e5bd91"/><stop offset="1" stopColor="#c69264"/></linearGradient>
      <linearGradient id="pa-lid" x2="1" y2="1"><stop stopColor="#e5dff0"/><stop offset=".5" stopColor="#c8bbdb"/><stop offset="1" stopColor="#9682b2"/></linearGradient>
      <linearGradient id="pa-motor" x2="1" y2="1"><stop stopColor="#dcecf4"/><stop offset=".4" stopColor="#add0e3"/><stop offset="1" stopColor="#5a94b8"/></linearGradient>
      <linearGradient id="pa-ub" x2="1" y2="1"><stop stopColor="#ffe2d4"/><stop offset="1" stopColor="#e99d8b"/></linearGradient>
    </defs>
    <rect x={16} y={16} width={448} height={822} rx={20} fill="#f7fafb" stroke="#d9e4e9"/>
    <He x={240} y={52} size={23} bold>הפרוטאזום 26S</He>
    <He x={240} y={82} size={17} color="var(--muted)">מכסה 19S מעל ליבה 20S — חתך לאורך</He>
    {/* A folded substrate, its unstructured initiation region, and an external Ub chain. */}
    <path d="M265 131 C249 103 294 99 305 115 C318 102 343 115 331 136 C351 155 318 177 300 159 C280 180 251 158 265 131Z" fill="#f5e5b7" stroke={GOLD} strokeWidth={1.5}/>
    <path d="M275 125 C281 109 307 122 299 137 S281 148 282 133 S318 129 316 145" fill="none" stroke={GOLD} strokeWidth={4} strokeLinecap="round"/>
    <path d="M298 159 C282 172 282 192 263 208 C246 223 234 230 239 253" stroke={GOLD} strokeWidth={5} fill="none" strokeLinecap="round"/>
    <path d="M325 144 Q349 159 354 174 L369 198 363 225" stroke={RED} strokeWidth={2.5} fill="none"/>
    <Ub x={351} y={169} a={-30}/><Ub x={368} y={195} a={20}/><Ub x={362} y={224} a={-20}/>
    <He x={402} y={133} size={18} bold color={GOLD}>מצע</He><path d="M344 129 H375" stroke={GOLD} strokeWidth={1.4}/>
    <He x={140} y={125} size={16} color={RED}>השרשרת נשארת בחוץ</He>
    <path d="M155 137 L175 161 H326" stroke={RED} strokeWidth={1.2} fill="none"/>
    {/* Asymmetric multi-lobed lid and the receptor-bearing arm. */}
    <path d="M152 290 C132 277 144 251 163 253 C148 227 171 208 190 222 C183 198 211 191 224 211 C242 195 261 210 256 232 C278 228 287 251 272 266 C285 286 265 308 247 302 C239 326 216 325 202 308 C183 324 160 314 152 290Z" fill="url(#pa-lid)" stroke={PURPLE} strokeWidth={1.8}/>
    <path d="M160 265 Q188 245 181 226 M184 299 Q198 279 216 286 M218 214 Q206 239 222 251 M249 236 Q231 254 247 271" fill="none" stroke={PURPLE} strokeOpacity={.5} strokeWidth={1.4}/>
    <path d="M270 306 C267 282 284 262 302 264 C292 246 308 232 324 242 C343 236 356 256 342 270 C358 287 340 309 326 304 C315 322 288 324 270 306Z" fill="url(#pa-lid)" stroke={PURPLE} strokeWidth={1.8}/>
    <path d="M326 250 Q342 246 350 235" stroke={PURPLE} strokeWidth={3} fill="none"/>
    {/* Rpn11 sits above the ATPase pore, not in the proteolytic chamber. */}
    <path d="M224 250 C214 236 231 221 245 229 C260 220 274 236 264 251 C270 269 252 279 241 266 C226 274 216 262 224 250Z" fill="#b9ded1" stroke={TEAL} strokeWidth={1.6}/>
    <path d="M237 247 l9 8 13 -15" fill="none" stroke={TEAL} strokeWidth={2.5}/>
    <Badge x={112} y={253} n={1}/><path d="M125 253 H141" stroke={PURPLE} strokeWidth={1.4}/>
    <Badge x={286} y={213} n={3}/><path d="M276 221 L263 234" stroke={TEAL} strokeWidth={1.4}/>
    <Badge x={398} y={263} n={5}/><path d="M384 263 H350" stroke={PURPLE} strokeWidth={1.4}/>
    {/* Six ATPase lobes around a central pore; rear lobes precede the threaded chain. */}
    {[[-53,-5,-26],[-26,-22,-12],[17,-24,8],[52,-7,27]].map(([dx,dy,a],i)=><Lobe key={i} x={240+dx} y={345+dy} a={a} fill="url(#pa-motor)" stroke={BLUE} s={.92}/>)}
    <ellipse cx={240} cy={346} rx={28} ry={19} fill="#fff8e6" stroke={BLUE} strokeWidth={1.5}/>
    <path d="M239 253 C247 274 230 290 239 311 C248 329 229 340 239 356 L239 413" stroke={GOLD} strokeWidth={5} fill="none" strokeLinecap="round"/>
    <Lobe x={204} y={370} a={-20} fill="url(#pa-motor)" stroke={BLUE} s={1.05}/><Lobe x={276} y={370} a={20} fill="url(#pa-motor)" stroke={BLUE} s={1.05}/>
    <Badge x={110} y={356} n={2}/><path d="M123 356 H167" stroke={BLUE} strokeWidth={1.4}/>
    <La x={373} y={358} size={17} color={BLUE}>ATP</La>
    <path d="M353 368 q-18 15 0 28" fill="none" stroke={BLUE} strokeWidth={1.4}/><path d="M348 391 l6 6 3 -8" fill="none" stroke={BLUE} strokeWidth={1.4}/>
    <La x={385} y={415} size={16} color="var(--muted)">ADP + Pᵢ</La>
    {/* The four heptameric rings form one barrel. */}
    <CoreRing y={453} beta={false}/><CoreRing y={519} beta/><CoreRing y={585} beta/><CoreRing y={651} beta={false}/>
    <path d="M211 440 Q239 449 269 440" stroke={BLUE} strokeWidth={4} fill="none"/>
    <path d="M239 411 C229 443 250 455 238 480 S246 516 239 542 C233 554 249 561 241 574" stroke={GOLD} strokeWidth={4.5} fill="none" strokeLinecap="round"/>
    <path d="M232 596 l11 10 m-7 15 10 8 m-17 14 9 6 m14 -23 10 5" stroke={TEAL} strokeWidth={4} strokeLinecap="round"/>
    {/* Three active beta sites in each beta ring, facing the enclosed chamber. */}
    {[{x:205,y:516},{x:272,y:526},{x:205,y:541},{x:272,y:581},{x:205,y:595},{x:272,y:607}].map((p,i)=><g key={i}><path d={`M${p.x} ${p.y} l${p.x<240?8:-8} 1`} stroke={RED} strokeWidth={2}/><circle cx={p.x<240?p.x+8:p.x-8} cy={p.y+1} r={3} fill={RED}/></g>)}
    {[[453,'α7'],[519,'β7'],[585,'β7'],[651,'α7']].map(([y,t])=><g key={String(y)}><La x={91} y={Number(y)+13} size={19} bold color={String(t).startsWith('β')?ORANGE:BLUE}>{String(t)}</La><path d={`M108 ${Number(y)+7} H133`} stroke={String(t).startsWith('β')?ORANGE:BLUE} strokeWidth={1.3}/></g>)}
    <Badge x={373} y={453} n={4}/><path d="M358 453 H335" stroke={BLUE} strokeWidth={1.4}/>
    <Badge x={373} y={577} n={6}/><path d="M358 577 H338" stroke={ORANGE} strokeWidth={1.4}/>
    <path d="M282 628 Q326 648 345 699" fill="none" stroke={TEAL} strokeWidth={1.5} strokeDasharray="3 5"/>
    <path d="M340 694 l5 7 2 -9" fill="none" stroke={TEAL} strokeWidth={1.5}/>
    {[{x:294,y:715},{x:320,y:728},{x:349,y:716},{x:370,y:741}].map((p,i)=><path key={i} d={`M${p.x} ${p.y} q5 -5 11 1 t10 0`} fill="none" stroke={TEAL} strokeWidth={4} strokeLinecap="round"/>)}
    <He x={240} y={786} size={18} bold color={TEAL}>אוליגופפטידים קצרים</He>
    <He x={240} y={817} size={16} color="var(--muted)">הדופן הקדמית הוסרה כדי לחשוף את החלל</He>
    {/* Text remains in a dedicated legend, away from molecular strokes. */}
    <LegendLine y={884} n={1} head="מכסה (lid) — כולל Rpn11" tail="חלקיק הבקרה 19S: זיהוי ועיבוד המצע" color={PURPLE}/>
    <LegendLine y={956} n={2} head="בסיס: 6 ATPases (Rpt1–6)" tail="פרישה והשחלה (ATP)" color={BLUE}/>
    <LegendLine y={1028} n={3} head="DUB: מסיר שרשרת" tail="השרשרת נשארת בחוץ; היוביקוויטין ממוחזר" color={TEAL}/>
    <LegendLine y={1100} n={4} head="שער" tail="זנבות ה-Rpt פותחים את השער" color={BLUE}/>
    <He x={443} y={1154} anchor="end" size={16} color="var(--muted)">במצב חופשי — השער סגור</He>
    <LegendLine y={1200} n={5} head="קולטנים:" tail="Rpn10 · Rpn13 · Rpn1" color={PURPLE}/>
    <LegendLine y={1272} n={6} head="חלל קטליטי סגור" tail="β1 · β2 · β5 — אתרים פעילים" color={ORANGE}/>
    <He x={240} y={1327} size={16} color={ORANGE}>הנוקלאופיל: תראונין בקצה N</He>
    <He x={240} y={1355} size={16} color="var(--muted)">שלושה סוגי אתרים; שישה אתרים בשתי טבעות β</He>
    <He x={240} y={1394} size={16} color="var(--muted)">סכמטי: חתך לאורך, לא בקנה מידה</He>
    <He x={240} y={1422} size={16} color="var(--muted)">מכסה אחד מוצג; ייתכנו מכסים בשני הקצוות</He>
    <He x={240} y={1448} size={16} color="var(--muted)">האונות וההצללה אינן מודל אטומי</He>
  </Svg>
}
