/* Textbook-level redraw by Codex (round 2, 2026-11-05); the previous version is archived in archive/figures/2026-11-05/. */
import { Svg, He, La } from "./helpers";
const blue='#336b95',purple='#806098',red='#b85a64',green='#3e8d85',orange='#cb8a35';
function Track({y,actin=false}:{y:number;actin?:boolean}){
 return <g>{actin?Array.from({length:27},(_,i)=><g key={i}><ellipse cx={48+i*14.2} cy={y+5*Math.sin(i*.85)} rx={9} ry={7.4} fill="url(#mot-actin)" stroke={red} strokeWidth={.8}/><ellipse cx={48+i*14.2} cy={y-5*Math.sin(i*.85)+10} rx={9} ry={7.4} fill="#e5adb4" stroke={red} strokeWidth={.7}/></g>):<g><path d={`M43 ${y-6} H432 V${y+21} H43 Z`} fill="#c1ded8"/>{[0,1,2].map(r=>Array.from({length:24},(_,i)=><ellipse key={r+'-'+i} cx={49+i*16} cy={y+r*8} rx={8} ry={5.5} fill={i%2?'#b2d6cf':'#dcece4'} stroke={green} strokeWidth={.7}/>))}</g>}<La x={23} y={y+12} size={22} bold>−</La><La x={453} y={y+12} size={22} bold>+</La></g>;
}
function Cargo({x,y}:{x:number;y:number}){return <g><circle cx={x} cy={y} r={28} fill="url(#mot-cargo)" stroke={orange} strokeWidth={1.4}/><path d={`M${x-18} ${y-12} Q${x-9} ${y-24} ${x+7} ${y-19}`} fill="none" stroke="#fff5da" strokeWidth={3} strokeLinecap="round"/></g>;}
function Direction({x1,x2,y,color}:{x1:number;x2:number;y:number;color:string}){const s=x2>x1?1:-1;return <g><path d={`M${x1} ${y} H${x2-s*8}`} stroke={color} strokeWidth={2.5}/><path d={`M${x2} ${y} l${-s*11} -6 v12 Z`} fill={color}/></g>;}
function Twine({d1,d2,color}:{d1:string;d2:string;color:string}){return <g><path d={d1} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round"/><path d={d2} fill="none" stroke="#b8d6e5" strokeWidth={2.5} strokeLinecap="round"/></g>;}
export function MotorProteins(){return <Svg h={1114} label="שלוש משפחות של מנועים: על מיקרוטובול — קינזין נע לקצה הפלוס (החוצה) ודיינאין לקצה המינוס (אל הצנטרוזום); על סיב אקטין — מיוזין V נע לקצה הפלוס. כל מנוע נושא מטען בזנב">
 <defs><radialGradient id="mot-cargo" cx="34%" cy="24%" r="80%"><stop stopColor="#fff0c7"/><stop offset=".65" stopColor="#e5b565"/><stop offset="1" stopColor="#be8130"/></radialGradient><radialGradient id="mot-head" cx="30%" cy="22%"><stop stopColor="#e6f4fa"/><stop offset="1" stopColor={blue}/></radialGradient><radialGradient id="mot-ring" cx="35%" cy="25%"><stop stopColor="#e4d7ed"/><stop offset="1" stopColor={purple}/></radialGradient><radialGradient id="mot-actin" cx="35%" cy="20%"><stop stopColor="#fae2df"/><stop offset="1" stopColor="#c47781"/></radialGradient></defs>
 <He x={240} y={30} size={23} bold>חלבונים מוטוריים — מבנה וכיוון</He>
 <He x={240} y={58} size={16} color="var(--muted)">הראשים קושרים את הסיב ו־ATP; הזנב נושא מטען</He>
 <rect x={10} y={80} width={460} height={302} rx={18} fill="#f2f7f9"/>
 <He x={395} y={112} size={22} bold color={blue}>קינזין</He>
 <La x={393} y={137} size={16} color={blue}>Kinesin</La>
 <Cargo x={231} y={145}/>
 <Twine d1="M223 171 C242 189 222 200 239 215 C252 229 233 239 242 254" d2="M239 171 C220 187 241 200 227 216 C215 229 240 242 235 255" color={blue}/>
 <path d="M238 250 Q219 257 200 286 M237 251 Q257 265 279 286" fill="none" stroke={blue} strokeWidth={5} strokeLinecap="round"/>
 <path d="M183 286 Q178 273 194 270 Q213 267 218 280 Q223 294 205 298 Q185 302 183 286 Z" fill="url(#mot-head)" stroke={blue} strokeWidth={1.5}/>
 <path d="M262 286 Q257 273 274 270 Q293 269 297 281 Q299 295 282 298 Q264 300 262 286 Z" fill="url(#mot-head)" stroke={blue} strokeWidth={1.5}/>
 <Track y={305}/><Direction x1={300} x2={420} y={200} color={blue}/>
 <He x={360} y={182} size={17} bold>לקצה הפלוס</He><He x={360} y={226} size={16}>החוצה</He>
 <He x={105} y={191} size={16} color={orange}>מטען</He><path d="M132 187 L198 155" stroke={orange} strokeWidth={1.2}/>
 <He x={103} y={258} size={16}>ראשים</He><path d="M133 255 L178 278" stroke={blue} strokeWidth={1.2}/>
 <He x={240} y={357} size={17} bold color={green}>מיקרוטובול</He>
 <rect x={10} y={399} width={460} height={322} rx={18} fill="#f7f3f9"/>
 <He x={395} y={431} size={22} bold color={purple}>דיינאין</He><La x={393} y={456} size={16} color={purple}>Dynein</La>
 <Cargo x={246} y={464}/>
 <Twine d1="M232 488 Q208 501 202 530 M256 489 Q282 512 286 535" d2="M242 492 Q219 508 212 536 M250 494 Q271 512 276 538" color={purple}/>
 {[{x:207,y:554},{x:280,y:560}].map(({x,y})=><g key={x}><circle cx={x} cy={y} r={25} fill="url(#mot-ring)" stroke={purple} strokeWidth={1.5}/>{Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return <ellipse key={i} cx={x+17*Math.cos(a)} cy={y+17*Math.sin(a)} rx={7} ry={6} fill="#b69ac9" stroke={purple} strokeWidth={.6}/>;})}<circle cx={x} cy={y} r={8} fill="#f7f3f9" stroke={purple} strokeWidth={1.2}/></g>)}
 <path d="M193 571 L173 638 M202 576 L180 640 M270 581 L247 638 M279 583 L255 640" fill="none" stroke={purple} strokeWidth={2.5}/>
 <ellipse cx={176} cy={643} rx={10} ry={6} fill={purple}/><ellipse cx={251} cy={643} rx={10} ry={6} fill={purple}/>
 <path d="M186 547 Q201 527 225 549 M259 554 Q279 534 298 559" fill="none" stroke="#d9bfdf" strokeWidth={5} strokeLinecap="round"/>
 <Track y={656}/><Direction x1={149} x2={51} y={503} color={purple}/>
 <He x={100} y={485} size={17} bold>לקצה המינוס</He><He x={100} y={529} size={16}>אל הצנטרוזום</He>
 <He x={374} y={576} size={16}>ראש טבעתי</He><path d="M331 571 L311 565" stroke={purple} strokeWidth={1.2}/>
 <He x={240} y={700} size={17} bold color={green}>מיקרוטובול</He>
 <rect x={10} y={738} width={460} height={305} rx={18} fill="#faf5f3"/>
 <He x={390} y={771} size={22} bold color={blue}>מיוזין V</He><La x={391} y={796} size={16} color={blue}>Myosin V</La>
 <Cargo x={229} y={800}/>
 <Twine d1="M225 829 C240 839 220 853 237 865" d2="M237 829 C221 842 241 851 230 866" color={blue}/>
 <path d="M233 864 L176 938 M234 864 L291 938" fill="none" stroke={blue} strokeWidth={7} strokeLinecap="round"/>
 {[0,1,2,3,4,5].map(i=><g key={i}><ellipse cx={225-i*7.6} cy={876+i*10} rx={6} ry={4} transform={`rotate(-53 ${225-i*7.6} ${876+i*10})`} fill="#a5c9db" stroke={blue} strokeWidth={.7}/><ellipse cx={242+i*7.6} cy={876+i*10} rx={6} ry={4} transform={`rotate(53 ${242+i*7.6} ${876+i*10})`} fill="#a5c9db" stroke={blue} strokeWidth={.7}/></g>)}
 <path d="M163 946 Q157 930 171 923 Q189 918 195 930 Q198 942 185 951 Q169 957 163 946 Z M278 945 Q270 930 284 923 Q302 918 309 930 Q314 945 298 952 Q285 955 278 945 Z" fill="url(#mot-head)" stroke={blue} strokeWidth={1.4}/>
 <Track y={963} actin/><Direction x1={309} x2={421} y={858} color={blue}/><He x={365} y={840} size={17} bold>לקצה הפלוס</He>
 <He x={98} y={878} size={16}>זרועות מנוף</He><path d="M134 885 L178 925" stroke={blue} strokeWidth={1.2}/>
 <He x={240} y={1017} size={17} bold color={red}>סיב אקטין</He>
 <He x={240} y={1075} size={16} color="var(--muted)">מטען כתום · מבנים סכמטיים, לא בקנה מידה</He>
 <He x={240} y={1101} size={16} color="var(--muted)">כיוון הקינזין המוצג אופייני לרוב הקינזינים</He>
 </Svg>;}
