/* Textbook-level redraw by Codex (round 2, 2026-11-05); the previous version is archived in archive/figures/2026-11-05/. */
import { Svg, He, La } from "./helpers";
const blue='#3b759d',green='#3c8a70',orange='#cf843a',purple='#87669b';
function Tip({x,y,up=false,color=green}:{x:number;y:number;up?:boolean;color?:string}){return <path d={up?`M${x} ${y} l-6 11 h12 Z`:`M${x} ${y} l-11 -6 v12 Z`} fill={color}/>;}
function Polymerase({x,y,small=false}:{x:number;y:number;small?:boolean}){return <g transform={`translate(${x} ${y}) scale(${small?.7:1})`}><path d="M-25 -5 C-38 -24 -20 -42 -5 -33 C9 -45 29 -30 22 -16 C39 -5 30 20 14 20 L5 6 Q-7 -4 -13 14 C-30 28 -41 9 -25 -5 Z" fill="url(#rf-pol)" stroke={green} strokeWidth={1.6}/><path d="M-16 -24 Q-5 -34 7 -28 M20 -5 Q25 4 17 11" fill="none" stroke="#e6f3d5" strokeWidth={3} strokeLinecap="round"/></g>;}
function Dna({y1,y2}:{y1:number;y2:number}){const path=(p:number)=>Array.from({length:Math.ceil((y2-y1)/3)+1},(_,i)=>{const y=Math.min(y2,y1+i*3);return `${i?'L':'M'}${240+18*Math.sin((y-y1)/16+p)} ${y}`;}).join(' ');return <g>{Array.from({length:Math.floor((y2-y1)/8)},(_,i)=>{const y=y1+i*8;return <line key={i} x1={240+18*Math.sin((y-y1)/16)} x2={240-18*Math.sin((y-y1)/16)} y1={y} y2={y} stroke="#97bacd" strokeWidth={1.3}/>;})}<path d={path(0)} fill="none" stroke={blue} strokeWidth={3}/><path d={path(Math.PI)} fill="none" stroke="#6e99ba" strokeWidth={3}/></g>;}
export function ReplicationFork(){return <Svg h={1150} label="מזלג השכפול: ההליקאז פותח את הגדילים, הגיראז משחרר את המתח לפניו, הגדיל המוביל נבנה ברצף לכיוון המזלג והגדיל המפגר נבנה בקטעי אוקזאקי, כל אחד מתחיל בפריימר RNA">
 <defs><radialGradient id="rf-pol" cx="30%" cy="22%"><stop stopColor="#e1efd0"/><stop offset="1" stopColor="#78ae80"/></radialGradient><radialGradient id="rf-helicase" cx="25%" cy="20%"><stop stopColor="#fff0bb"/><stop offset="1" stopColor="#d5a14d"/></radialGradient></defs>
 <He x={240} y={30} size={23} bold>מזלג השכפול</He><He x={240} y={58} size={17} color="var(--muted)">מודל חיידקי — אותם גדילים, שני אופני סינתזה</He>
 <rect x={10} y={78} width={460} height={564} rx={18} fill="#f4f8fa"/>
 <Dna y1={115} y2={278}/><La x={208} y={108} size={18} bold>5′</La><La x={276} y={108} size={18} bold>3′</La>
 <path d="M218 189 C191 186 185 163 202 152 C211 147 217 153 221 164 L229 186 Z M252 162 C261 144 284 152 285 169 C286 186 269 193 251 185 Z" fill="#d5c7df" stroke={purple} strokeWidth={1.4}/>
 <path d="M209 162 Q211 175 220 180 M262 163 Q275 158 276 171" fill="none" stroke="#f3eafa" strokeWidth={3}/>
 <He x={355} y={173} size={18} bold color={purple}>גיראז</He><path d="M319 170 H289" stroke={purple} strokeWidth={1.2}/>
 <He x={116} y={160} size={16}>המזלג מתקדם</He><path d="M117 236 V183" stroke="#657d8d" strokeWidth={2}/><Tip x={117} y={177} up color="#657d8d"/>
 <path d="M234 273 C211 324 161 358 102 415 Q79 441 79 555 M247 272 C274 320 322 355 376 414 Q403 441 403 555" fill="none" stroke={blue} strokeWidth={3.4}/>
 <path d="M96 551 V447 Q98 421 124 400 L173 355" fill="none" stroke={green} strokeWidth={4}/><Tip x={176} y={351} up/>
 <Polymerase x={178} y={364}/>
 <La x={115} y={335} size={18} bold color={green}>Pol III</La><path d="M142 338 L155 351" stroke={green} strokeWidth={1.2}/>
 <He x={103} y={586} size={18} bold color={green}>גדיל מוביל — ברצף</He>
 <La x={61} y={568} size={18} bold>3′</La><La x={111} y={551} size={18} color={green}>5′</La>
 <g transform="translate(266 304) rotate(-35)">{Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return <ellipse key={i} cx={18*Math.cos(a)} cy={18*Math.sin(a)} rx={13} ry={10} transform={`rotate(${i*60} ${18*Math.cos(a)} ${18*Math.sin(a)})`} fill="url(#rf-helicase)" stroke="#b88c43" strokeWidth={1.1}/>;})}<ellipse rx={9} ry={10} fill="#f4f8fa" stroke="#b88c43" strokeWidth={1}/></g>
 <He x={374} y={279} size={18} bold color="#a57935">הליקאז</He><path d="M333 285 L294 300" stroke="#a57935" strokeWidth={1.2}/>
 <path d="M295 341 Q306 326 319 339 Q327 357 312 365 Q298 362 295 350 Z" fill="#c7b4d9" stroke={purple} strokeWidth={1.3}/>
 <He x={391} y={338} size={18} bold color={purple}>פרימאז</He><path d="M346 341 L324 345" stroke={purple} strokeWidth={1.2}/>
 {[{x:344,y:383},{x:362,y:404},{x:381,y:430}].map(({x,y})=><path key={x} d={`M${x-6} ${y-8} q-9 1 -7 10 q3 11 13 6 q6 -8 0 -16 Z`} fill="#90a7b7" stroke="#637c90" strokeWidth={1.1}/>)}
 <La x={428} y={391} size={17} bold color="#637c90">SSB</La><path d="M411 396 L375 410" stroke="#637c90" strokeWidth={1.2}/>
 <path d="M387 463 V478" stroke={orange} strokeWidth={5}/><path d="M387 478 V531" stroke={green} strokeWidth={4}/><path d="M387 543 l-6 -11 h12 Z" fill={green}/><Polymerase x={387} y={524} small/>
 <La x={317} y={502} size={18} bold color={green}>Pol III</La><path d="M344 505 L364 516" stroke={green} strokeWidth={1.2}/>
 <La x={423} y={568} size={18} bold>5′</La><La x={368} y={456} size={18} color={green}>5′</La>
 <He x={354} y={586} size={18} bold color={green}>גדיל מפגר</He><He x={354} y={613} size={17}>קטעי אוקזאקי</He>
 <He x={111} y={616} size={16} color="var(--muted)">סינתזה לכיוון המזלג</He>
 <rect x={10} y={660} width={460} height={367} rx={18} fill="#f7f8f2"/>
 <He x={240} y={692} size={20} bold>תקריב — הבשלת הגדיל המפגר</He>
 <He x={240} y={719} size={16}>כל קטע מתחיל בפריימר RNA</He>
 <path d="M50 772 H428" stroke={blue} strokeWidth={3}/>
 <La x={28} y={778} size={17}>3′</La><La x={450} y={778} size={17}>5′</La>
 <path d="M80 790 H105" stroke={orange} strokeWidth={5}/><path d="M105 790 H188" stroke={green} strokeWidth={4}/><Tip x={193} y={790}/><Polymerase x={207} y={793}/>
 <path d="M271 790 H292" stroke={orange} strokeWidth={5}/><path d="M292 790 H420" stroke={green} strokeWidth={4}/>
 <La x={77} y={834} size={17}>5′</La><La x={190} y={834} size={17}>3′</La><La x={270} y={834} size={17}>5′</La><La x={424} y={834} size={17}>3′</La>
 <La x={207} y={748} size={18} bold color={green}>Pol III</La>
 <He x={240} y={858} size={17}>הסינתזה בכל קטע מתרחקת מהמזלג</He>
 <path d="M50 919 H428" stroke={blue} strokeWidth={3}/><path d="M80 936 H232 M283 936 H420" stroke={green} strokeWidth={4}/><path d="M254 936 H280" stroke={orange} strokeWidth={5}/>
 <g transform="translate(250 938)"><path d="M-20 -14 Q-27 -28 -11 -31 Q1 -37 11 -24 Q24 -18 16 -5 L3 3 Q-10 14 -20 2 Z" fill="#a7c9d9" stroke={blue} strokeWidth={1.4}/></g>
 <La x={250} y={889} size={18} bold color={blue}>Pol I</La><He x={240} y={981} size={17}>החלפת פריימר ה־RNA ב־DNA</He>
 <He x={240} y={1008} size={16} color="var(--muted)">תקריב של קטעים שונים — אין זה מסלול נפרד</He>
 <path d="M47 1063 H79" stroke={blue} strokeWidth={3}/><He x={149} y={1069} size={17}>גדיל תבנית</He>
 <path d="M259 1063 H291" stroke={green} strokeWidth={4}/><He x={374} y={1069} size={17}>DNA חדש</He>
 <path d="M47 1097 H79" stroke={orange} strokeWidth={5}/><He x={149} y={1103} size={17} color={orange}>פריימר RNA</He>
 <He x={240} y={1136} size={16} color="var(--muted)">פישוט מרחבי של הרפליזום; לא בקנה מידה</He>
 </Svg>;}
